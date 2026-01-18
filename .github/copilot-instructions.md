# Misscoteque Project - AI Coding Agent Instructions

## Project Overview
Misscoteque is a Next.js 16 (App Router) website with React 19, featuring a 3D disco ball, background music player, and MailerLite integration. The site is designed as an archive and community noticeboard with a vibrant, queer aesthetic.

## Architecture & Data Flow

### Content Management
- **Contentful CMS**: External headless CMS for dynamic content (songs, settings)
- Content client: [`lib/contentful.ts`](../lib/contentful.ts) - initialize with env vars `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`, `CONTENTFUL_ENVIRONMENT`
- Type safety: All Contentful models have TypeScript skeletons in [`types/contentful.ts`](../types/contentful.ts)
- Song fetching: [`lib/getSong.ts`](../lib/getSong.ts) queries `globalSettings` content type, provides defaults if Contentful is unavailable

### Component Architecture
- **Server Components**: [`app/page.tsx`](../app/page.tsx) fetches song data server-side via `getSong()`
- **Client Components**: All in [`app/components/`](../app/components/) marked with `"use client"`
  - [`ThreeDObject.tsx`](../app/components/ThreeDObject.tsx): React Three Fiber canvas with auto-rotating GLB model
  - [`MusicPlayer.tsx`](../app/components/MusicPlayer.tsx): Audio player with autoplay attempt, controlled by passed props from server
  - [`MailerLiteForm.tsx`](../app/components/MailerLiteForm.tsx): Email signup form (universal script loaded in layout)

### Styling System
- **Tailwind CSS v4** with custom theme in [`app/globals.css`](../app/globals.css)
- Brand colors: `--color-red: #D52D00`, `--color-cream: #F0D6B4`, `--color-pink: #F49CBB`, `--color-orange: #EF7627`
- Responsive breakpoints: Use `md:` prefix and custom `tall-screen:` for vertical layouts
- Custom fonts: Defined in [`app/ui/fonts.ts`](../app/ui/fonts.ts) - Tinos (--posh), Racing Sans One (--impact), Source Code Pro (--code)

## Development Workflows

### Essential Commands
```bash
npm run dev        # Start dev server on localhost:3000
npm run build      # Production build
npm run lint       # ESLint check (uses eslint.config.mjs)
```

### Environment Setup
Required `.env.local` variables:
```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_ENVIRONMENT=master  # optional, defaults to master
```

### 3D Assets
- Models stored in [`public/models/`](../public/models/)
- Currently using `disco_ball.glb` loaded via `@react-three/drei` useGLTF hook
- Scale set to 0.015 in [`ThreeDObject.tsx`](../app/components/ThreeDObject.tsx#L24) - adjust if adding new models

## Key Conventions

### Path Aliases
- Use `@/` prefix for absolute imports (maps to project root via `tsconfig.json`)
- Examples: `@/lib/contentful`, `@/app/components/MusicPlayer`, `@/types/contentful`

### Client/Server Boundaries
- Server components fetch data asynchronously
- Pass serializable props (strings, numbers) to client components
- Audio/3D interactions require client components with `"use client"` directive

### Accessibility Patterns
- Audio elements include `aria-label` with track info
- Music player button has `aria-pressed` state
- Visual-only content wrapped with `aria-hidden="true"`
- Screen reader text uses `.sr-only` CSS class

### Performance Optimizations
- Contentful resources preconnected in [`app/layout.tsx`](../app/layout.tsx#L39-L41)
- 3D canvas uses `dpr={[1, 1.5]}` and `antialias: false` for performance
- MailerLite script loaded with `strategy="afterInteractive"`

## Common Patterns

### Adding New Contentful Content Types
1. Define skeleton interface in [`types/contentful.ts`](../types/contentful.ts) extending `EntrySkeletonType`
2. Create fetch function in `lib/` following [`getSong.ts`](../lib/getSong.ts) pattern (with defaults for robustness)
3. Query with `contentfulClient.getEntries<YourSkeleton>({ content_type: "yourType" })`

### Adding New Components
- Place in [`app/components/`](../app/components/)
- Mark interactive components with `"use client"`
- Use Tailwind classes with brand color palette
- Follow prop interface pattern: `interface ComponentNameProps { ... }`

### SEO & Meta Tags
- Defined in [`app/layout.tsx`](../app/layout.tsx#L6-L29) as `metadata` export
- Includes OpenGraph and Twitter Card configuration
- Social preview image at `/social-preview.png`
