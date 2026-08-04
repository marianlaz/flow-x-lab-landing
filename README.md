# Flow Experiments Lab

A minimal landing page for builders and entrepreneurs — a space for building,
experimentation, and iteration.

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) primitives
- TypeScript

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the local development server   |
| `npm run build` | Create a production build            |
| `npm run start` | Serve the production build           |
| `npm run lint`  | Run ESLint over the project          |

## Project structure

```
app/         Next.js App Router pages, layout, and global styles
components/   Reusable UI components (shadcn/ui)
hooks/        Custom React hooks
lib/          Shared utilities
public/       Static assets
styles/       Additional stylesheets
```
