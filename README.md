# tasklify

> A task management app for busy people 📋

## Prerequisites

Make sure you have these installed (all free):

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | v20+ | [nodejs.org](https://nodejs.org/) |
| **pnpm** | v9+ | `npm install -g pnpm` |
| **Rust** | latest | [rustup.rs](https://rustup.rs/) *(only needed for desktop build)* |

## Quick Start (Browser Dev Mode)

```bash
# 1. Install dependencies
pnpm install

# 2. Start the dev server
pnpm dev
```

Then open **http://localhost:1420** in your browser.

## Desktop App (Tauri)

```bash
# Make sure Rust is installed, then:
pnpm tauri dev
```

This will launch the native desktop window with hot-reload.

## Build for Production

```bash
# Build the desktop app installer
pnpm tauri build
```

The installer will be in `src-tauri/target/release/bundle/`.

## Project Structure

```
tasklifyv2/
├── src/                        # React frontend
│   ├── components/
│   │   ├── AddTaskForm.tsx         # Task creation modal
│   │   ├── Layout.tsx              # App shell with sidebar
│   │   ├── ProgressBar.tsx         # Dashboard progress bar
│   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   └── TaskCard.tsx            # Individual task card
│   ├── pages/
│   │   ├── LoginPage.tsx           # Login screen
│   │   ├── DashboardPage.tsx       # Dashboard with summaries
│   │   └── TaskListPage.tsx        # Task list with filtering
│   ├── stores/
│   │   ├── authStore.ts            # Auth state (Zustand)
│   │   └── taskStore.ts            # Task state (Zustand)
│   ├── lib/
│   │   └── database.ts             # localStorage persistence
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── styles/
│   │   └── index.css               # Tailwind + custom styles
│   ├── App.tsx                     # Root with routing
│   └── main.tsx                    # Entry point
├── src-tauri/                  # Tauri (Rust) backend
│   ├── src/
│   │   ├── main.rs
│   │   └── lib.rs
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── capabilities/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Tech Stack

- **Tauri v2** — Lightweight desktop shell
- **React 19** — UI framework
- **TypeScript** — Type safety
- **Tailwind CSS v3** — Styling
- **Zustand** — State management
- **React Router v7** — Client-side routing
- **date-fns** — Date utilities
- **Vite** — Build tool

## Features

- 🔐 Simple local login
- 📊 Dashboard with progress tracking
- 📝 Create, edit, delete tasks
- 🏷️ Category-based task grouping
- 🔍 Filter by status (All / Finished / Ongoing / Missed)
- 📅 Deadline tracking with reminders
- 💾 Persistent local storage
