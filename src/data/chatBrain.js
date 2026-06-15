import { projects } from './projects.js';
import roles from './experience.yaml';
import { getAllPosts } from '../utils/blog.js';

/* ============================================================
   chatBrain — a tiny, deterministic "assistant" that answers
   questions about Shivom from the same data the rest of the
   site renders. No network, no keys: it pattern-matches the
   visitor's message to an intent and returns a streamed reply
   plus optional rich blocks (project / experience / link cards).

   Swapping this for a real model later only means replacing
   `respond()` with a fetch — the UI consumes the same shape.
   ============================================================ */

const RESUME_URL =
    'https://drive.google.com/file/d/1dF-L6oKwGsYKAEfJycaFoQokeM7xw6NR/view?usp=drive_link';
const EMAIL = 'shivom.sharma.eng@gmail.com';

const linkCards = {
    github: { label: 'GitHub', sub: 'github.com/ssh-vom', href: 'https://github.com/ssh-vom' },
    linkedin: { label: 'LinkedIn', sub: 'in/shivomsharma', href: 'https://linkedin.com/in/shivomsharma' },
    resume: { label: 'Résumé', sub: 'PDF', href: RESUME_URL },
    email: { label: 'Email', sub: EMAIL, href: `mailto:${EMAIL}` },
};

// Prompts surfaced under the composer and after answers.
export const SUGGESTED = [
    'What did you do at Tesla?',
    'Show me your projects',
    'What are you building now?',
    "What's your stack?",
    'How do I get in touch?',
];

function projectBlock(ids) {
    const items = ids
        ? ids.map((id) => projects.find((p) => p.id === id)).filter(Boolean)
        : projects;
    return { type: 'projects', items };
}

function experienceBlock(companies) {
    const items = companies
        ? roles.filter((r) => companies.includes(r.company))
        : roles;
    return { type: 'experience', items };
}

// Intent table — first match wins, so order from specific to broad.
const intents = [
    {
        id: 'project-detail',
        test: (q) =>
            /open\s?arcade|bunshin|analyt|sniffles|boox|walls\b/.test(q),
        build: (q) => {
            const map = {
                openarcade: /open\s?arcade/,
                bunshin: /bunshin/,
                analyticz: /analyt/,
                sniffles: /sniffles/,
                booxserve: /boox/,
                walls: /walls\b/,
            };
            const id = Object.keys(map).find((k) => map[k].test(q));
            const p = projects.find((x) => x.id === id);
            return {
                text: `${p.name} — ${p.tagline}\n\n${p.description}`,
                blocks: [projectBlock([id])],
            };
        },
    },
    {
        id: 'projects',
        test: (q) => /project|build|built|portfolio|side|made|ship|repo/.test(q),
        build: () => ({
            text:
                "Here's a selection. Most of it is systems-flavored — embedded, agents, networking, developer tooling. Ask about any one and I'll go deeper.",
            blocks: [projectBlock(), { type: 'suggest', items: ['Tell me about OpenArcade', 'What is Bunshin?'] }],
        }),
    },
    {
        id: 'tesla',
        test: (q) => /tesla|intern|cybertruck|robot|factory|vision/.test(q),
        build: () => ({
            text:
                'Three internships at Tesla across two years — controls, then factory design platforms, then AI agents and material-flow robotics. The throughline was building tooling that lets thousands of engineers move faster.',
            blocks: [experienceBlock(['Tesla'])],
        }),
    },
    {
        id: 'now',
        test: (q) =>
            /now|current|today|present|cloaked|call ?guard|latest|these days|up to/.test(q),
        build: () => ({
            text:
                "Right now I'm a Software Engineer at Cloaked, just getting started on Call Guard. Before this I was at Tesla. Based in Toronto.",
            blocks: [experienceBlock(['Cloaked'])],
        }),
    },
    {
        id: 'experience',
        test: (q) => /experience|work history|background|career|where.*work|job/.test(q),
        build: () => ({
            text:
                "Here's the path — most recent first. Cloaked now; three internships at Tesla before that.",
            blocks: [experienceBlock()],
        }),
    },
    {
        id: 'stack',
        test: (q) => /stack|tech|language|skill|tool|framework|good at|expert|know/.test(q),
        build: () => ({
            text:
                "I work from the metal up — embedded C/C++ and FreeRTOS at the bottom, Python / Go / TypeScript services in the middle, React on top. Comfortable across the whole stack; happiest near systems.",
            blocks: [
                {
                    type: 'tags',
                    groups: [
                        { label: 'Systems', items: ['C', 'C++', 'Go', 'FreeRTOS', 'Embedded', 'Networking'] },
                        { label: 'Backend', items: ['Python', 'FastAPI', 'Node.js', 'Kafka', 'PostgreSQL', 'Redis'] },
                        { label: 'Frontend', items: ['TypeScript', 'React', 'SvelteKit', 'Three.js'] },
                        { label: 'Infra', items: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'] },
                    ],
                },
            ],
        }),
    },
    {
        id: 'education',
        test: (q) => /school|study|stud(y|ied)|mcmaster|degree|universit|college|grad|education/.test(q),
        build: () => ({
            text:
                'Mechatronics & Business at McMaster University, class of 2026. The mechatronics side is where the from-the-metal-up instinct comes from — control systems, embedded, hardware — and the business half keeps me thinking about what the software is actually for.',
        }),
    },
    {
        id: 'writing',
        test: (q) => /writ|blog|post|article|read|essay/.test(q),
        build: () => {
            const posts = getAllPosts();
            return {
                text: posts.length
                    ? 'I write occasionally — CLIs, dev logs, the odd hello-world. A few here:'
                    : "I haven't published much yet — it's coming.",
                blocks: posts.length ? [{ type: 'posts', items: posts }] : [],
            };
        },
    },
    {
        id: 'contact',
        test: (q) => /contact|email|reach|hire|talk|connect|touch|message|linkedin|resume|résumé|cv|github/.test(q),
        build: () => ({
            text:
                "Email is fastest, but I'm around in a few places. For roles or projects, just say hi:",
            blocks: [{ type: 'links', items: [linkCards.email, linkCards.github, linkCards.linkedin, linkCards.resume] }],
        }),
    },
    {
        id: 'who',
        test: (q) => /who are you|about you|tell me about|yourself|bio|introduce/.test(q),
        build: () => ({
            text:
                "I'm Shivom — a software engineer in Toronto who builds from the metal up. Currently at Cloaked; before that, three internships at Tesla doing factory robotics, AI tooling, and production vision systems. Mechatronics & Business at McMaster, class of 2026.",
            blocks: [{ type: 'suggest', items: ['What did you do at Tesla?', 'Show me your projects', "What's your stack?"] }],
        }),
    },
    {
        id: 'greeting',
        test: (q) => /^(hi|hey|hello|yo|sup|howdy|hiya|greetings)\b/.test(q),
        build: () => ({
            text: "Hey — I'm Shivom's assistant. Ask me about his work, his projects, or how to reach him.",
            blocks: [{ type: 'suggest', items: SUGGESTED.slice(0, 3) }],
        }),
    },
];

const fallback = {
    text:
        "I'm a small assistant trained only on Shivom — I might not have that. Try asking about his work at Tesla, his projects, his stack, or how to get in touch.",
    blocks: [{ type: 'suggest', items: SUGGESTED.slice(0, 4) }],
};

/**
 * Resolve a visitor message to a reply. Returns { text, blocks }.
 * Synchronous + deterministic; the UI fakes the streaming.
 */
export function respond(message) {
    const q = message.toLowerCase().trim();
    const intent = intents.find((i) => i.test(q));
    return intent ? intent.build(q) : fallback;
}

export const GREETING = {
    text:
        "I'm Shivom's assistant — ask me anything about his work, projects, or background. Here are a few places to start:",
    blocks: [{ type: 'suggest', items: SUGGESTED }],
};
