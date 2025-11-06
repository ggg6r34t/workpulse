# WorkPulse - Professional Time Tracking & Productivity Application

WorkPulse is a modern, production-ready time tracking and productivity application built with Next.js 15, React 19, and TypeScript. It helps individuals and teams track their work hours, manage projects, and boost productivity with features like Pomodoro timers, focus metrics, and integrations.

## ✨ Features

### Core Functionality
- **Time Tracking**: Start, stop, pause, and resume timers with detailed time entries
- **Project Management**: Organize time entries by client, task, and tags
- **Pomodoro Timer**: Built-in Pomodoro technique timer with sound notifications
- **Focus Metrics**: Track your productivity with detailed analytics
- **Daily Summaries**: View your daily progress and accomplishments
- **Water Reminders**: Stay hydrated with periodic water reminders

### Productivity Features
- **Quick Tags**: Fast access to frequently used tags
- **Productivity Tips**: Contextual tips to improve your workflow
- **Keyboard Shortcuts**: Power user shortcuts for faster navigation
- **Zapier Integration**: Connect with your favorite apps and services
- **Export/Import**: Export your data to CSV or JSON formats

### User Experience
- **Dark/Light Theme**: System-aware theme switching
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Offline Support**: PWA capabilities for offline access
- **Accessibility**: WCAG-compliant with keyboard navigation support
- **Customizable Settings**: Extensive customization options

### Security & Reliability
- **Input Validation**: Comprehensive validation and sanitization
- **Error Handling**: Robust error boundaries and recovery
- **Data Validation**: Type-safe data handling with Zod schemas
- **Secure Storage**: Safe localStorage operations with quota management
- **Security Headers**: Production-ready security headers

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Modern web browser with localStorage support

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd workpulse
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and configure:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Building for Production

### Build the application:
```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Start the production server:
```bash
npm start
# or
yarn start
# or
pnpm start
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **State Management**: React Context API
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner + React Hot Toast

## 📁 Project Structure

```
workpulse/
├── app/                    # Next.js app directory
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── settings/          # Settings pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── form/             # Form components
│   ├── insights/         # Analytics components
│   ├── layout/           # Layout components
│   ├── pomodoro/         # Pomodoro timer
│   ├── stats/            # Statistics components
│   ├── table/            # Table components
│   ├── tips/             # Productivity tips
│   └── ui/               # UI primitives
├── lib/                  # Utility libraries
│   ├── storage-enhanced.ts  # Enhanced storage layer
│   ├── validation.ts     # Validation schemas
│   ├── timer.ts          # Timer utilities
│   └── time.ts           # Time formatting
├── types/                # TypeScript types
├── public/               # Static assets
└── next.config.ts        # Next.js configuration
```

## 🔒 Security Features

- **Input Sanitization**: All user inputs are sanitized and validated
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: Secure form handling
- **Secure Headers**: Comprehensive security headers
- **Data Validation**: Zod schemas for type-safe validation
- **Storage Quota Management**: Prevents storage quota errors

## 🎨 Customization

### Settings Available

- **Timer Settings**: Idle timeout, auto-stop, rounding
- **Display Settings**: Date format, time format, theme
- **Notification Settings**: Browser notifications, sounds, reminders
- **Data Settings**: Auto-save, backup frequency, archiving

### Keyboard Shortcuts

- `Space` - Start/Stop timer
- `P` - Pause/Resume timer
- `S` - Open settings
- `E` - Export data
- `?` - Show all shortcuts

## 📊 Data Management

### Export Options
- **CSV Export**: Export time entries to CSV format
- **JSON Export**: Export all data including settings

### Import Options
- **JSON Import**: Import previously exported data
- **Data Validation**: Automatic validation of imported data

### Storage
- All data is stored locally in the browser
- Automatic backups based on settings
- Storage quota monitoring

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform
- Self-hosted with Docker

### Environment Variables

Set these in your deployment platform:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or issues, please contact the maintainers.

## 📧 Support

For support, please open an issue in the repository or contact the development team.

## 🎯 Roadmap

- [ ] Cloud sync support
- [ ] Team collaboration features
- [ ] Advanced reporting and analytics
- [ ] Mobile app (iOS/Android)
- [ ] More integrations (Slack, Jira, etc.)
- [ ] AI-powered insights
- [ ] Time tracking automation

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [Radix UI](https://www.radix-ui.com)
- Icons from [Lucide](https://lucide.dev)
- Styling with [Tailwind CSS](https://tailwindcss.com)

---

Made with ❤️ for productivity enthusiasts
