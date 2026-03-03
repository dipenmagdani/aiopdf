# AIOpdf

**AIOpdf** (All In One PDF) is an advanced, fully browser-based PDF manipulation tool built with **Next.js 16** (App Router & React Server Components), **Tailwind CSS**, and **shadcn/ui**. It leverages powerful client-side processing libraries to keep your documents entirely private. **Zero uploads, 100% secure.**

## Features

- **Edit PDF**: Modify existing documents locally.
- **Merge PDFs**: Combine multiple PDF files into one.
- **Split PDF**: Extract specific pages or divide a PDF.
- **Compress PDF**: Reduce file size while maintaining quality.
- **Rotate PDF**: Rotate specific or all pages.
- **PDF to Images**: Convert PDF pages to JPG/PNG.
- **Images to PDF**: Compile images into a PDF document.
- **Organize Pages**: Reorder or delete PDF pages.
- **Watermark PDF**: Add custom text or image watermarks.
- **Encrypt & Decrypt PDF**: Add or remove password protection.

## Tech Stack

- **Framework:** Next.js 16 (React 19, Turbopack, App Router)
- **Styling:** Tailwind CSS, PostCSS
- **Components:** shadcn/ui, Radix UI, Framer Motion
- **PDF Processing:** `pdf-lib`, `pdfjs-dist`
- **State Management:** Zustand, React Query
- **Routing:** `next/navigation`, `next/link`

## Browser-Based Security

All PDF processing runs client-side inside the browser using `pdf-lib` and `pdfjs-dist`. Files are read using the HTML5 `FileReader` API and are directly manipulated in memory. No files are ever uploaded or saved to any external servers.

## Getting Started

### Prerequisites

- Node.js 20.9+
- Bun (or npm)

### Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd aiopdf
   ```

2. **Install dependencies:**

   ```bash
   bun install
   # or npm install --legacy-peer-deps
   ```

3. **Start the development server:**

   ```bash
   bun dev
   # or npm run dev
   ```

   The application will run with Turbopack enabled on [http://localhost:3000](http://localhost:3000) or nearest available port.

4. **Build for production:**
   ```bash
   bun run build
   bun run start
   # or npm run build && npm start
   ```

## Development & Architecture

- **Next.js App Router**: `src/app` encompasses fully dynamic routes and layouts configured with top SEO practices.
- **Component Strategy**: Due to local file manipulations mapping to browser APIs natively without Node environment overhead, the interactive UI component logic is built on Client Components (`"use client"`). Server Components selectively govern layouts and page structural boundaries.
- **SEO Ready**: `layout.tsx` cleanly implements dynamically mapped OpenGraph metadata and static semantic definitions for maximum structural discoverability.

## License

This project is licensed under the MIT License.
