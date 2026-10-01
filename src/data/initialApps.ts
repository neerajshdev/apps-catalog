import { AppItem } from '../types/app';

export const INITIAL_APPS: AppItem[] = [
  {
    id: 'aether-studio',
    name: 'Aether Studio',
    tagline: 'Next-Generation Real-Time Vector & 3D Generative Canvas',
    description: `Aether Studio is a revolutionary design and generative canvas engineered for next-generation digital creators. Combining lightning-fast GPU-accelerated 2D vector editing, real-time procedural shaders, and seamless 3D scene composition, Aether transforms the way designers and developers craft user experiences.

### Key Capabilities
- **Ultra-Responsive Vector Engine**: Handle millions of complex bezier nodes at a locked 120 FPS.
- **Real-Time 3D Viewport**: Drag-and-drop Spline, glTF, and USDZ assets directly onto your canvas with physically-based materials.
- **Node-Based Shader Generator**: Create interactive fluid simulations, holographic glowing materials, and particles without writing raw GLSL.
- **Export Everywhere**: One-click multi-format export to WebAssembly, React, Swift, Kotlin, SVG, and high-fidelity PNG/WebP archives.`,
    category: 'Design & Creative',
    platforms: ['windows', 'macos', 'linux', 'web'],
    version: 'v3.2.0',
    releaseDate: 'August 2026',
    fileSize: '142.8 MB',
    archiveFileName: 'AetherStudio-v3.2.0-Universal.zip',
    downloadUrl: 'https://github.com/aether-studio/releases/download/v3.2.0/AetherStudio-v3.2.0-Universal.zip',
    iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&h=256&q=80',
    youtubeVideos: [
      'https://www.youtube.com/watch?v=aqz-KE-bpKQ', // Big Buck Bunny / 4K showcase
      'https://www.youtube.com/watch?v=YE7VzlLtp-4'  // Big Buck Bunny 60fps
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=675&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=675&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=675&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&h=675&q=80'
    ],
    features: [
      'Hardware-accelerated rendering up to 8K resolution',
      'Interactive particle & physics workspace',
      'Live multiplayer collaboration with zero latency',
      'Plugin architecture supporting WebAssembly & TypeScript',
      'Integrated Git-based asset version control'
    ],
    systemRequirements: {
      os: 'Windows 10/11, macOS 12+ (Apple Silicon supported), Linux (glibc 2.31+)',
      processor: 'Quad-Core 2.5 GHz or higher / Apple M1+',
      memory: '8 GB RAM (16 GB Recommended)',
      storage: '1.2 GB available SSD space',
      graphics: 'DirectX 12 / Metal / Vulkan compatible GPU'
    },
    developer: {
      name: 'Aether Labs Inc.',
      website: 'https://aetherstudio.dev',
      badge: 'Verified Creator'
    },
    stats: {
      downloads: 84200,
      rating: 4.9,
      ratingCount: 1420
    },
    isFeatured: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3
  },
  {
    id: 'hyperdrive-terminal',
    name: 'HyperDrive Terminal',
    tagline: 'GPU-Accelerated Cyberpunk Terminal & Cloud Orchestrator',
    description: `HyperDrive is an ultra-fast, cross-platform terminal emulator crafted with Rust and modern rendering pipelines. Designed for developers who live in the CLI, it combines instant keystroke latency, multiplexing, inline graphics, AI command assistance, and full customization with reactive GLSL shaders.

### Highlights
- **Sub-millisecond Latency**: Built from the ground up using GPU shaders with Metal & Vulkan rendering backends.
- **Built-in SSH & Kubernetes Manager**: Monitor cluster pods, tail remote logs, and manage cloud nodes straight from split panes.
- **Smart Predictive Autocomplete**: Context-aware bash, zsh, and fish completion with history search.
- **Rich Media Preview**: View images, Markdown documents, and hex dumps directly inside terminal tabs.`,
    category: 'Developer Tools',
    platforms: ['windows', 'macos', 'linux'],
    version: 'v2.8.4',
    releaseDate: 'July 2026',
    fileSize: '48.2 MB',
    archiveFileName: 'HyperDrive-x86_64-v2.8.4.tar.gz',
    downloadUrl: 'https://github.com/hyperdrive-term/releases/download/v2.8.4/HyperDrive-x86_64.tar.gz',
    iconUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=256&h=256&q=80',
    youtubeVideos: [
      'https://www.youtube.com/watch?v=EngW7tLk6R8'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=675&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=675&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&h=675&q=80'
    ],
    features: [
      'Pure Rust & Vulkan core for < 1ms render latency',
      'Native split panes & infinite persistent sessions',
      'Inline image rendering via Sixel and Kitty protocols',
      'AI terminal assistant with local Ollama support',
      'Custom theme engine with retro CRT scanline effects'
    ],
    systemRequirements: {
      os: 'Windows 10/11, macOS 11+, Ubuntu 20.04+, Arch, Fedora',
      processor: '64-bit Dual Core 2.0 GHz',
      memory: '4 GB RAM',
      storage: '250 MB free space',
      graphics: 'OpenGL 3.3 or Vulkan 1.1'
    },
    developer: {
      name: 'Rustworks Core',
      website: 'https://hyperdrive.terminal.sh',
      badge: 'Core Contributor'
    },
    stats: {
      downloads: 129400,
      rating: 4.8,
      ratingCount: 3105
    },
    isFeatured: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7
  },
  {
    id: 'cybervanguard-rpg',
    name: 'CyberVanguard: Neon Genesis',
    tagline: 'High-Octane Sci-Fi Cyberpunk Action RPG & Arena Battler',
    description: `Enter the neon-drenched metropolis of Neo-Kyoto in the year 2184. CyberVanguard is a fast-paced isometric action RPG featuring kinetic combat, cybernetic enhancement trees, dynamic weather, and multi-threaded physics.

### Story & Lore
Take on rogue megacorporations as an augmented operative. Upgrade your synaptic reflexes, hack enemy robotic drones in mid-combat, and deploy devastating tactical nanotech weapons in solo or co-op missions.`,
    category: 'Games',
    platforms: ['windows', 'linux', 'android'],
    version: 'v1.4.1',
    releaseDate: 'August 2026',
    fileSize: '1.45 GB',
    archiveFileName: 'CyberVanguard-Setup-v1.4.1.exe',
    downloadUrl: 'https://distribution.games/cybervanguard/installer-v1.4.1.exe',
    iconUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=256&h=256&q=80',
    youtubeVideos: [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&h=675&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&h=675&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&h=675&q=80'
    ],
    features: [
      '60+ FPS Unreal Engine-powered lighting & ray-traced reflections',
      'Deep skill progression with 120+ augmentations',
      'Full cross-play co-op between PC and Android handhelds',
      'Custom mod support with integrated level builder',
      'Original synthwave electronic soundtrack'
    ],
    systemRequirements: {
      os: 'Windows 10/11 64-bit, Ubuntu 22.04 LTS (Proton compatible)',
      processor: 'Intel Core i5-8400 / AMD Ryzen 5 2600',
      memory: '16 GB RAM',
      storage: '8 GB NVMe SSD space',
      graphics: 'NVIDIA GeForce GTX 1060 / AMD Radeon RX 580 (4GB VRAM)'
    },
    developer: {
      name: 'NeonForge Interactive',
      website: 'https://neonforge.games',
      badge: 'Game Studio'
    },
    stats: {
      downloads: 45000,
      rating: 4.7,
      ratingCount: 890
    },
    isFeatured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12
  },
  {
    id: 'cogniflow-ai',
    name: 'CogniFlow AI Studio',
    tagline: 'Private On-Device Neural Model Runner & Workflow Automator',
    description: `Run open-weights LLMs, vision transformers, and speech models completely offline on your own machine. CogniFlow provides an intuitive visual node graph to chain AI models, scrape data, automate documents, and build custom multi-modal agents with 100% data privacy.

### Why CogniFlow?
- **100% Air-Gapped Privacy**: Zero data leaves your computer. No subscriptions, no cloud leaks.
- **Hardware Optimized**: Fully leverages Apple Neural Engine, NVIDIA CUDA, AMD ROCm, and Intel OpenVINO.
- **Drag-and-Drop Pipeline**: Visually assemble workflows that summarize PDFs, generate speech, and trigger webhooks.`,
    category: 'AI & Machine Learning',
    platforms: ['windows', 'macos', 'linux'],
    version: 'v4.0.2',
    releaseDate: 'August 2026',
    fileSize: '315.4 MB',
    archiveFileName: 'CogniFlow-Studio-v4.0.2-mac-arm64.dmg',
    downloadUrl: 'https://cogniflow.ai/download/CogniFlow-v4.0.2.dmg',
    iconUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=256&h=256&q=80',
    youtubeVideos: [
      'https://www.youtube.com/watch?v=aircAruvnKk'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&h=675&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=675&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=675&q=80'
    ],
    features: [
      'Support for GGUF, SafeTensors, ONNX, and PyTorch checkpoints',
      'Visual node-based agent orchestration editor',
      'Built-in vector database (Chroma/FAISS) for local document RAG',
      'Fast local whisper transcription & voice cloning',
      'Instant REST and WebSocket API generation'
    ],
    systemRequirements: {
      os: 'Windows 11, macOS 13+ (Apple Silicon), Ubuntu 22.04+',
      processor: 'Modern 8-Core CPU / Apple M-series',
      memory: '16 GB RAM minimum (32 GB recommended for large models)',
      storage: '4 GB application space + model storage',
      graphics: 'CUDA 12+ compatible NVIDIA GPU (8GB+ VRAM) or Apple M-series Unified Memory'
    },
    developer: {
      name: 'Cognitive Systems',
      website: 'https://cogniflow.ai',
      badge: 'AI Partner'
    },
    stats: {
      downloads: 98100,
      rating: 4.95,
      ratingCount: 2450
    },
    isFeatured: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1
  },
  {
    id: 'soundwave-pro',
    name: 'SoundWave Pro DAW',
    tagline: 'Spatial Audio Synthesizer & Modular Sound Design Workstation',
    description: `SoundWave Pro is a next-gen Digital Audio Workstation created for electronic music producers, game sound designers, and audio engineers. Featuring an infinite modular canvas, real-time 3D binaural spatialization, and ultra-low latency audio drivers.

Produce master-grade audio tracks with 64-bit floating point precision, zero-latency DSP plugins, and intuitive touch & MIDI controller mapping.`,
    category: 'Audio & Video',
    platforms: ['windows', 'macos', 'ios'],
    version: 'v5.1.0',
    releaseDate: 'July 2026',
    fileSize: '218.0 MB',
    archiveFileName: 'SoundWavePro-v5.1.0-Bundle.zip',
    downloadUrl: 'https://soundwave.audio/releases/v5.1.0/SoundWavePro-Setup.zip',
    iconUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=256&h=256&q=80',
    youtubeVideos: [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&h=675&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&h=675&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&h=675&q=80'
    ],
    features: [
      '64-bit double precision audio processing engine',
      'Dolby Atmos & 3D binaural spatial monitoring',
      'Modular wire-based synth and effect rack routing',
      'VST3, CLAP, and AudioUnit plugin host support',
      'Multi-touch and hardware MIDI polyphonic expression (MPE)'
    ],
    systemRequirements: {
      os: 'Windows 10/11 (ASIO recommended), macOS Monterey+',
      processor: 'Intel Core i7 3.0 GHz or Apple Silicon M1+',
      memory: '16 GB RAM',
      storage: '3 GB available SSD space',
      graphics: 'OpenGL 3.3 compatible display'
    },
    developer: {
      name: 'Resonance DSP Labs',
      website: 'https://soundwave.audio',
      badge: 'Audio Specialist'
    },
    stats: {
      downloads: 36200,
      rating: 4.85,
      ratingCount: 712
    },
    isFeatured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15
  },
  {
    id: 'nexus-vault',
    name: 'Nexus Vault Security',
    tagline: 'Zero-Knowledge Encrypted Backup & Cross-Device Cloud Sync',
    description: `Protect your most sensitive assets, encryption keys, and confidential archives with military-grade quantum-resistant cryptographic security. Nexus Vault provides end-to-end encrypted storage vaults with instant multi-device peer-to-peer sync.`,
    category: 'Utilities',
    platforms: ['windows', 'macos', 'linux', 'android', 'ios'],
    version: 'v1.9.0',
    releaseDate: 'August 2026',
    fileSize: '34.5 MB',
    archiveFileName: 'NexusVault-Security-v1.9.0.zip',
    downloadUrl: 'https://nexusvault.io/download/NexusVault-v1.9.0.zip',
    iconUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=256&h=256&q=80',
    youtubeVideos: [
      'https://www.youtube.com/watch?v=EngW7tLk6R8'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&h=675&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=675&q=80'
    ],
    features: [
      'AES-256-GCM and ChaCha20-Poly1305 quantum-resistant encryption',
      'Zero-knowledge architecture: only you possess the master passphrase',
      'Biometric authentication (TouchID, Windows Hello, FaceID)',
      'Automated background scheduled archive snapshots',
      'Decentralized peer-to-peer file transfer over encrypted TLS'
    ],
    systemRequirements: {
      os: 'All major OS platforms',
      processor: 'Any 64-bit CPU or ARM64',
      memory: '2 GB RAM',
      storage: '100 MB for app + user archive capacity'
    },
    developer: {
      name: 'Nexus Cryptography',
      website: 'https://nexusvault.io',
      badge: 'Security Verified'
    },
    stats: {
      downloads: 67300,
      rating: 4.92,
      ratingCount: 1180
    },
    isFeatured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5
  }
];

