| License | Deployment | Last Commit |
|---------|-----------|-------------|
| [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/) | ![Vercel](https://vercelbadge.vercel.app/api/danielkorkin/tiktok-depression-survey) | ![GitHub last commit](https://img.shields.io/github/last-commit/danielkorkin/tiktok-depression-survey) |


# TikTok Depression Survey

Website to gather data for a Science Fair project to analyze correlation between TikTok fyp and depression risk

## Authors

- [@danielkorkin](https://github.com/danielkorkin)
- [@Vikthegreatest](https://github.com/Vikthegreatest)


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Tech Stack

### Framework & Core Libraries
- **Next.js 14.2.15** - React-based framework for building web applications.
- **React 18** - JavaScript library for building user interfaces.
- **React DOM 18** - Enables React to interact with the DOM.

### UI & Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework.
- **Tailwind Merge 2.5.4** - Utility to merge Tailwind class names efficiently.
- **Tailwind CSS Animate 1.0.7** - Animations for Tailwind CSS.
- **Radix UI** (various components) - Accessible UI primitives:
  - Accordion, Checkbox, Dropdown Menu, Icons, Label, Popover, Radio Group, Select, Slot.

### Animations & Motion
- **Framer Motion 11.11.17** - Animation library for React.

### Utilities
- **Clsx 2.1.1** - Utility for conditionally joining classNames.
- **Class Variance Authority 0.7.0** - Variance-based utility for styling.
- **Date-fns 3.6.0** - Modern JavaScript date utility library.
- **Gray Matter 4.0.3** - Parse front matter from markdown files.
- **HTML-to-Image 1.11.11** - Convert HTML elements to images.
- **React Dropzone 14.3.5** - File drag-and-drop component.
- **React Timezone Select 3.2.8** - Timezone selection dropdown.
- **Canvas Confetti 1.9.3** - JavaScript confetti animation.
- **Lucide React 0.453.0** - Icon set for React.
- **React Signature Canvas 1.0.6** - Signature pad for React.

### Markdown & Content Processing
- **Remark 15.0.1** - Markdown processor.
- **Remark HTML 16.0.1** - Convert Markdown to HTML.
- **Remark Prism 1.3.6** - Syntax highlighting for Markdown.
- **Rehype Plugins**:
  - **Rehype Autolink Headings 7.1.0** - Adds links to headings.
  - **Rehype Prism Plus 2.0.0** - Syntax highlighting.
  - **Rehype Slug 6.0.0** - Generates slugs for headings.

### Database & Backend
- **Prisma 5.21.1** - ORM for database management.
- **@prisma/client 5.21.1** - Client for Prisma.

### PDF Generation
- **@react-pdf/renderer 3.4.4** - Generate PDFs in React.

### Monitoring & Error Tracking
- **Sentry Next.js 8.51.0** - Error tracking and performance monitoring.

### Development Tools
- **ESLint 8** - Linting for JavaScript and TypeScript.
- **TypeScript 5** - Static typing for JavaScript.
- **PostCSS 8** - CSS processing tool.
- **Tailwind Typography 0.5.15** - Typography plugin for Tailwind.

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file (as seen in `.env.example`)

`DATABASE_URL=postgres-database-url`

`PUBLIC_KEY=public-encryption-key`

`ACCEPT_SIGNUPS=true-or-false`

## Installation

Install dependencies with npm

```bash
npm install
```
    
## Run Locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.## Deployment

To deploy your Next.js 14 application in production, follow these steps:

### 1. Build the Application  
Run the following command to generate an optimized production build:

```bash
npm run build
```

### 2. Start the Production Server  
Once the build is complete, start the application with:

```bash
npm run start
```

### 3. Access the Application  
By default, the server runs on port 3000. Open your browser and visit:

[http://localhost:3000](http://localhost:3000)
