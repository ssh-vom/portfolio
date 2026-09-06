import { DurableObject } from 'cloudflare:workers';
import { serveMedia } from './media.js';

export class MediaBudget extends DurableObject {
    constructor(ctx, env) {
        super(ctx, env);
        this.ctx = ctx;
        this.env = env;
        ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS budget (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            day TEXT NOT NULL, month TEXT NOT NULL,
            daily INTEGER NOT NULL, monthly INTEGER NOT NULL
        )`);
    }

    async fetch(request) {
        if (request.method !== 'POST' || new URL(request.url).pathname !== '/consume') {
            return new Response(null, { status: 404 });
        }
        const dailyLimit = Number(this.env.DAILY_REQUEST_LIMIT);
        const monthlyLimit = Number(this.env.MONTHLY_REQUEST_LIMIT);
        if (![dailyLimit, monthlyLimit].every(n => Number.isSafeInteger(n) && n > 0)) {
            return new Response(null, { status: 503 });
        }
        const today = new Date().toISOString().slice(0, 10);
        const month = today.slice(0, 7);
        const admitted = this.ctx.storage.transactionSync(() => {
            const row = this.ctx.storage.sql.exec('SELECT * FROM budget WHERE id = 1').toArray()[0];
            const daily = row?.day === today ? row.daily : 0;
            const monthly = row?.month === month ? row.monthly : 0;
            if (daily >= dailyLimit || monthly >= monthlyLimit) return false;
            this.ctx.storage.sql.exec(
                'INSERT OR REPLACE INTO budget (id, day, month, daily, monthly) VALUES (1, ?, ?, ?, ?)',
                today, month, daily + 1, monthly + 1,
            );
            return true;
        });
        return new Response(null, { status: admitted ? 204 : 429 });
    }
}

export default { fetch: serveMedia };
