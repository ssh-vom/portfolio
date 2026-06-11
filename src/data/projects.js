export const projects = [
  {
    id: "openarcade",
    name: "OpenArcade",
    tagline: "Modular accessible gaming controller.",
    description:
      "A distributed, cross-platform gaming controller built with a Raspberry Pi Zero 2 W and ESP32 subcontrollers. Achieves ≤25ms end-to-end latency over BLE with concurrent routines in Python, C, and C++. Features FreeRTOS tasks for I2C-based screen management, battery/temperature reporting, and controller state delivery.",
    github: "https://github.com/ssh-vom/openarcade",
    previewImage: "/images/OPENARCADE.png",
    techDetails: [
      { label: "Raspberry Pi + ESP32", icon: "chip" },
      { label: "BLE + USB HID", icon: "bluetooth" },
    ],
    capabilities: ["Python", "C", "C++", "React", "Three.js", "Docker", "Embedded Systems"],
    focusAreas: [
      {
        title: "Hardware",
        description: "Bridging software and hardware to ship real-world systems.",
        icon: "hardware",
      },
      {
        title: "Embedded Systems",
        description: "Designing firmware and low-level protocols for reliable control.",
        icon: "embedded",
      },
      {
        title: "Accessibility",
        description: "Building inclusive tools that adapt to diverse user needs.",
        icon: "accessibility",
      },
    ],
  },
  {
    id: "bunshin",
    name: "Bunshin",
    tagline: "Local-first memory for parallel coding agents.",
    description:
      "Local-first, filesystem-based memory system for parallel coding agents. Capture learnings, share knowledge via review queue, and build up team memory over time with CLI and Pi extension tools.",
    github: "https://github.com/ssh-vom/Bunshin",
    techDetails: [
      { label: "TypeScript + Node.js", icon: "code" },
      { label: "CLI + VS Code Extension", icon: "terminal" },
    ],
    capabilities: ["TypeScript", "Node.js", "CLI", "Pi Extension", "Git"],
    focusAreas: [
      {
        title: "Agents",
        description: "Building intelligent systems that reason, plan, and act.",
        icon: "agents",
      },
      {
        title: "Developer Tools",
        description: "Crafting CLI and editor integrations for productive workflows.",
        icon: "devtools",
      },
      {
        title: "Distributed Systems",
        description: "Designing reliable, scalable systems and data pipelines.",
        icon: "distributed",
      },
    ],
  },
  {
    id: "analyticz",
    name: "AnalyticZ",
    tagline: "Exploratory data analysis AI agent.",
    description:
      "An AI agent for exploratory data analysis with sandboxed SQL and Python execution environments for safe, code-driven analysis on DuckDB and CSV datasets. Features a FastAPI backend for async chat jobs, thread-state management, and long-running workflow summarization with parallel subagent fan-out for branched analysis paths.",
    github: "https://github.com/ssh-vom/analytics-agent",
    techDetails: [
      { label: "FastAPI + SvelteKit", icon: "stack" },
      { label: "Docker + Sandboxed Execution", icon: "container" },
    ],
    capabilities: ["Python", "FastAPI", "SvelteKit", "Docker", "SQL", "Async Jobs"],
    focusAreas: [
      {
        title: "AI / ML",
        description: "Autonomous agents with sandboxed code execution.",
        icon: "ai",
      },
      {
        title: "Data Engineering",
        description: "SQL/Python sandboxing with async job processing.",
        icon: "data",
      },
      {
        title: "Full Stack",
        description: "FastAPI backend with reactive SvelteKit frontend.",
        icon: "fullstack",
      },
    ],
  },
  {
    id: "sniffles",
    name: "Sniffles",
    tagline: "Packet sniffer and network protocol analyzer.",
    description:
      "A packet sniffer built in C++ with a Qt frontend for capturing, inspecting, and analyzing live network traffic. Implements protocol parsing workflows for dissecting packet headers, payloads, and transport-layer message structure, with low-level networking tooling for live packet inspection and protocol analysis.",
    github: "https://github.com/ssh-vom/sniffles",
    techDetails: [
      { label: "C++ + Qt", icon: "cpp" },
      { label: "Raw Socket Capture", icon: "network" },
    ],
    capabilities: ["C++", "Qt", "Networking", "Systems"],
    focusAreas: [
      {
        title: "Networking",
        description: "Low-level packet capture and protocol analysis.",
        icon: "network",
      },
      {
        title: "Systems",
        description: "High-performance C++ with native GUI integration.",
        icon: "systems",
      },
      {
        title: "Desktop Apps",
        description: "Cross-platform GUI applications with Qt.",
        icon: "desktop",
      },
    ],
  },
  {
    id: "kalshi",
    name: "Kalshi Research Engine",
    tagline: "Prediction market accuracy research.",
    description:
      "Research project aimed at determining the accuracy of prediction markets like Kalshi using statistical analysis and time-series modeling.",
    github: "https://github.com/ssh-vom/kalshi-research",
    techDetails: [
      { label: "Python + Pandas", icon: "python" },
      { label: "TimescaleDB + NumPy", icon: "database" },
    ],
    capabilities: ["Python", "NumPy", "Pandas", "TimescaleDB", "Statistics"],
    focusAreas: [
      {
        title: "Data Science",
        description: "Statistical analysis of market prediction accuracy.",
        icon: "datascience",
      },
      {
        title: "Finance",
        description: "Quantitative modeling of prediction markets.",
        icon: "finance",
      },
      {
        title: "Research",
        description: "Exploratory analysis with time-series databases.",
        icon: "research",
      },
    ],
  },
  {
    id: "booxserve",
    name: "BooxServe",
    tagline: "E-Ink tablet content delivery tool.",
    description:
      "CLI tool to download manga and textbooks to BOOX E-Ink tablets via REST APIs and TCP/IP. Optimized for low-power e-ink displays.",
    github: "https://github.com/ssh-vom/boox-serve",
    previewImage: "/images/boox_serve_project.png",
    techDetails: [
      { label: "Go + Docker", icon: "go" },
      { label: "TCP/IP + REST", icon: "network" },
    ],
    capabilities: ["Go", "Docker", "TCP/IP", "REST", "CLI"],
    focusAreas: [
      {
        title: "Systems",
        description: "TCP/IP networking and file transfer protocols.",
        icon: "systems",
      },
      {
        title: "CLI Tools",
        description: "Command-line interface for content automation.",
        icon: "cli",
      },
      {
        title: "Networking",
        description: "REST APIs and device-to-device communication.",
        icon: "network",
      },
    ],
  },
  {
    id: "walls",
    name: "Walls",
    tagline: "TUI wallpaper manager for macOS.",
    description:
      "TUI to preview, download and set macOS wallpapers from wallhaven.cc. Built with Python and Textual for a rich terminal experience.",
    github: "https://github.com/ssh-vom/walls",
    previewImage: "/images/walls_project.png",
    techDetails: [
      { label: "Python + Textual", icon: "python" },
      { label: "REST API Integration", icon: "api" },
    ],
    capabilities: ["Python", "Textual", "REST", "TUI", "CLI"],
    focusAreas: [
      {
        title: "CLI Tools",
        description: "Terminal-based wallpaper management and discovery.",
        icon: "cli",
      },
      {
        title: "TUI",
        description: "Rich terminal user interface design.",
        icon: "tui",
      },
      {
        title: "Web APIs",
        description: "Integration with wallhaven.cc REST API.",
        icon: "api",
      },
    ],
  },
];
