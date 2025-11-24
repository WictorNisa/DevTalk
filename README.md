# DevTalk 

Talk code. Share knowledge. Grow together.

## Overview

DevTalk is a Slack/Discord-inspired chatting platform tailored for developers. We provide an intuitive, responsive interface with real-time messaging capabilities, GitHub OAuth authentication, and a sleek dark/light theme system.

## Features

### Security
- **GitHub SSO** - Seamless sign-in using your GitHub account via OAuth.
- **Protected Routes** - Automatic authentication checking and route guarding
- **Persistent Sessions** - User sessions maintained across page refreshes
- **Spring Security** - Protected with Spring Security under the hood.

### Real-time Communication
- **WebSocket Integration** - Fast channels and group messaging powered by WebSocket.
- **Thread and Channel-based Chat** - Keep discussions organized by topic and team.
- **Code Snippets** - Share formatted, syntax highlighted code directly in chat.
- **Notifications** - Get notified instantly when someone mentions you.

### User Interface
- **Modern Design** - Built with Tailwind CSS 4 and shadcn/ui components
- **Dark/Light Themes** - Persistent theme switching
- **Responsive Layout** - Three-panel dashboard (channels, messages, users)
- **Collapsible Sidebars** - Customizable workspace layout
- **Smooth Animations** - Powered by Framer Motion and GSAP

### Internationalization
- **Multi-language Support** - English and Swedish translations

## Tech Stack

### Core
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool with SWC

### State Management
- **Zustand** - Lightweight state management with persistence
- **React Router 7** - Client-side routing

### UI & Styling
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful, customizable components
- **Lucide React** - Modern icon library
- **Framer Motion** - Animation library
- **GSAP** - Advanced animations

### Real-time Communication
- **@stomp/stompjs** - STOMP protocol for WebSocket
- **SockJS Client** - WebSocket fallback support

### Internationalization
- **i18next** - Translation framework
- **react-i18next** - React bindings for i18next

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, and other assets
│   ├── components/     # React components
│   │   ├── dashboard/  # Dashboard layout components
│   │   │   ├── center/ # Message display and input
│   │   │   ├── left/   # Channels and navigation
│   │   │   └── right/  # User list
│   │   ├── landing/    # Landing page sections
│   │   ├── routing/    # Route protection components
│   │   └── ui/         # Reusable UI components
│   ├── constants/      # App constants and routes
│   ├── context/        # React contexts
│   ├── data/           # Static data and mock data
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility libraries
│   ├── locale/         # Translation files (en, sv)
│   ├── pages/          # Page components
│   ├── services/       # API service functions
│   ├── stores/         # Zustand stores
│   │   └── chat/       # Chat-specific state management
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper functions
├── components.json     # shadcn/ui configuration
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running (see backend README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Configuration

### Environment Variables
The app currently connects to the backend at `http://localhost:8080`. To modify this:
- Update API endpoints in service files (`src/services/`)
- Update WebSocket endpoint in `src/stores/chat/useChatStore.ts`

### Theme Customization
- Theme variables are in `src/styles/variables.css`
- Tailwind configuration in the root `tailwind.config.js` (if present)

### Adding Translations
Add new translation keys to:
- `src/locale/en/*.json` - English translations
- `src/locale/sv/*.json` - Swedish translations

## Key Features Explained

### WebSocket Connection
The app establishes a WebSocket connection using STOMP over SockJS:
- Auto-reconnect on connection loss
- Heartbeat mechanism for connection health
- Automatic subscription to channels
- Message history retrieval

### State Management
- **Auth State** (`useAuthStore`) - User authentication and session
- **Chat State** (`useChatStore`) - Messages, channels, WebSocket connection
- **Theme State** (`useThemeStore`) - Dark/light mode preference
- **Sidebar State** (`useSidebarStates`) - Panel visibility

### Route Protection
Routes are protected using the `ProtectedRoute` component:
- Checks authentication on mount
- Redirects to landing page if not authenticated
- Shows loading state during auth check

## Contributing

### Team
This project was built by:
- **Nicholas Sjöstrand** - Frontend Developer
- **Jonas Jönsson** - Frontend Developer
- **Luke Salem** - Backend Developer
- **Oskar Lindahl** - Backend Developer
- **Wictor Niså** - Scrum Master

## License

See LICENSE file in the root directory.

## Support

For issues and questions, please open an issue on the GitHub repository.
