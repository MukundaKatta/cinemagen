# CinemaGen

AI-powered cinematic video generation platform for creating, composing, and exporting professional video content.

<!-- Add screenshot here -->

## Features

- **Prompt-Based Generation** — Generate video clips from text descriptions
- **Composition Editor** — Arrange and sequence generated clips on a timeline
- **Script-to-Video** — Convert full scripts into storyboarded video sequences
- **Color Grading** — Professional color grading controls for cinematic looks
- **Audio Generator** — AI-generated soundtracks and sound effects
- **Export Presets** — Pre-configured export settings for different platforms
- **Cinema Preview** — Real-time preview of generated and composed content
- **Job Queue** — Track generation jobs with progress and status updates
- **Project Management** — Save, load, and organize video projects

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Animation:** Framer Motion
- **Storage:** AWS S3
- **Database:** Supabase (with SSR helpers)
- **Validation:** Zod
- **Date Utilities:** date-fns
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project
- AWS S3 bucket

### Installation

```bash
git clone <repo-url>
cd cinemagen
npm install
```

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
```

### Running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/
│   └── cinema/
│       ├── prompt-editor.tsx
│       ├── color-grading.tsx
│       ├── script-to-video.tsx
│       ├── audio-generator.tsx
│       ├── export-presets.tsx
│       └── cinema-preview.tsx
├── hooks/            # Custom store hooks
├── lib/              # Utilities and Supabase client
└── types/            # TypeScript type definitions
```

## License

MIT
