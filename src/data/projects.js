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
  },
  {
    id: "bunshin",
    name: "Bunshin",
    tagline: "Local-first memory for parallel coding agents.",
    description:
      "Local-first, filesystem-based memory system for parallel coding agents. Capture learnings, share knowledge via review queue, and build up team memory over time with CLI and Pi extension tools.",
    github: "https://github.com/ssh-vom/Bunshin",
    previewImage: "/images/bunshin_diagram.png",
    techDetails: [
      { label: "TypeScript + Node.js", icon: "code" },
      { label: "CLI + VS Code Extension", icon: "terminal" },
    ],
    capabilities: ["TypeScript", "Node.js", "CLI", "Pi Extension", "Git"],
  },
  {
    id: "analyticz",
    name: "AnalyticZ",
    tagline: "Exploratory data analysis AI agent.",
    description:
      "An AI agent for exploratory data analysis with sandboxed SQL and Python execution environments for safe, code-driven analysis on DuckDB and CSV datasets. Features a FastAPI backend for async chat jobs, thread-state management, and long-running workflow summarization with parallel subagent fan-out for branched analysis paths.",
    github: "https://github.com/ssh-vom/analytics-agent",
    previewImage: "/images/analyticz_project.png",
    techDetails: [
      { label: "FastAPI + SvelteKit", icon: "stack" },
      { label: "Docker + Sandboxed Execution", icon: "container" },
    ],
    capabilities: ["Python", "FastAPI", "SvelteKit", "Docker", "SQL", "Async Jobs"],
  },
  {
    id: "sniffles",
    name: "Sniffles",
    tagline: "Packet sniffer and network protocol analyzer.",
    description:
      "A packet sniffer built in C++ with a Qt frontend for capturing, inspecting, and analyzing live network traffic. Implements protocol parsing workflows for dissecting packet headers, payloads, and transport-layer message structure, with low-level networking tooling for live packet inspection and protocol analysis.",
    github: "https://github.com/ssh-vom/sniffles",
    previewImage: "/images/sniffles_project.png",
    techDetails: [
      { label: "C++ + Qt", icon: "cpp" },
      { label: "Raw Socket Capture", icon: "network" },
    ],
    capabilities: ["C++", "Qt", "Networking", "Systems"],
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
  },
];
