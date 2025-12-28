# Mary's Blog - Vue 3 + TypeScript Author Website

A simple, fast, and accessible website for Mary V. Cothren with blog functionality, email collection, and admin backend. Built with Vue 3, TypeScript, Tailwind CSS, and deployed on Vercel.

## Features

- **Fast & Lightweight**: Optimized build with small bundle sizes
- **Accessible**: WCAG AA compliant with proper ARIA labels and keyboard navigation
- **Responsive**: Mobile-first design that works on all devices
- **Blog System**: Full-featured blog with Markdown support, search, filtering, and pagination
- **Admin Backend**: Simple single-user admin interface for managing blog posts
- **Email Collection**: Serverless contact form with validation and rate limiting
- **SEO Optimized**: Proper meta tags and Open Graph support

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: Tailwind CSS with typography plugin
- **Routing**: Vue Router with 404 handling
- **Backend**: Express.js API server
- **Database**: Neon Postgres with Prisma ORM
- **Authentication**: HttpOnly cookie-based sessions
- **Markdown**: Marked + DOMPurify for safe rendering
- **Email**: Nodemailer with Gmail SMTP
- **Deployment**: Vercel with serverless functions
- **Code Quality**: ESLint + Prettier

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── AppHeader.vue   # Navigation with mobile menu
│   ├── AppFooter.vue   # Footer with links
│   ├── Container.vue   # Layout wrapper
│   ├── Hero.vue        # Hero section component
│   └── ContactForm.vue # Email collection form
├── pages/              # Route components
│   ├── Home.vue        # Landing page with hero + contact
│   ├── About.vue       # Author bio and photos
│   ├── Writings.vue    # Under construction page
│   ├── Contact.vue     # Full contact page
│   └── NotFound.vue    # 404 error page
├── router/              # Vue Router configuration
├── assets/              # Images and static assets
└── style.css            # Global styles and Tailwind imports

api/
└── contact.ts           # Serverless email function

public/
└── favicon.svg          # Site favicon
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration (see Environment Variables section below).

4. Set up the database:
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations (creates tables)
   npm run db:migrate
   ```
   
   Or if you prefer to push schema without migrations:
   ```bash
   npm run db:push
   ```

### Development

Run both the frontend and API server:

```bash
npm run dev:full
```

This starts:
- Frontend dev server at `http://localhost:3000`
- API server at `http://localhost:3001`

Or run them separately:
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: API server
npm run dev:api
```

### Building

```bash
npm run build
```

Creates optimized production build in `dist/` directory.

### Preview

```bash
npm run preview
```

Serves the production build locally for testing.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required

- `DATABASE_URL`: PostgreSQL connection string
  - **Local Development**: `postgresql://localhost:5432/your_database_name`
  - **Production (Neon)**: `postgresql://user:password@hostname/database?sslmode=require`
  - Get Neon connection string from your [Neon dashboard](https://neon.tech)

- `AUTH_USERNAME`: Username for admin login
- `AUTH_PASSWORD`: Password for admin login
- `AUTH_SECRET`: Secret key for signing session cookies (required in production)
  - Generate with: `openssl rand -base64 32`
  - In development, a temporary fallback will be used if not set

### Optional

- `AUTH_COOKIE_NAME`: Cookie name for auth session (default: `mvc_auth`)
- `AUTH_SESSION_DAYS`: Session duration in days (default: `7`)

### Email Configuration (for contact form)

- `RESEND_API_KEY`: Resend API key for sending emails (required)
  - Get your API key from [Resend Dashboard](https://resend.com/api-keys)
  - Sign up at [resend.com](https://resend.com) if you don't have an account
  - The key starts with `re_`

- `RESEND_FROM_EMAIL`: Email address to send from (optional)
  - Default: `onboarding@resend.dev` (works for development/testing)
  - For production: Verify your domain at [resend.com/domains](https://resend.com/domains) and use your domain email (e.g., `noreply@maryvcothren.com`)

- `RESEND_FROM_NAME`: Display name for the sender (optional)
  - Default: `Mary's Website`

## Database Setup

### Local Development (PostgreSQL)

For local development, use a local PostgreSQL instance:

1. **Install PostgreSQL** (if not already installed):
   ```bash
   # macOS with Homebrew
   brew install postgresql@14
   brew services start postgresql@14
   
   # Or use Postgres.app for macOS
   ```

2. **Create a local database**:
   ```bash
   createdb maryvcothren_dev
   # Or using psql:
   # psql postgres
   # CREATE DATABASE maryvcothren_dev;
   ```

3. **Set DATABASE_URL in `.env.local`**:
   ```bash
   DATABASE_URL="postgresql://localhost:5432/maryvcothren_dev"
   # Or with username:
   # DATABASE_URL="postgresql://your_username@localhost:5432/maryvcothren_dev"
   ```

4. **Run migrations**:
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database (creates tables)
   npm run db:push
   ```

### Production (Neon Postgres)

For production deployment, use Neon Postgres:

1. Sign up for a free account at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard
4. Set it as `DATABASE_URL` in your production environment variables (Vercel, etc.)

**Note**: The app automatically detects whether you're using local Postgres or Neon based on the `DATABASE_URL`. Local URLs (localhost, 127.0.0.1) use local Postgres, while Neon URLs use the cloud database.

### Creating Your First Post

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000/login`
3. Log in with your `AUTH_USERNAME` and `AUTH_PASSWORD`
4. Click "New Post" to create your first blog post
5. Set status to "Published" to make it visible on the public blog

## Admin Access

- **Login URL**: `/login`
- **Admin Dashboard**: `/admin/blog`
- **Create Post**: `/admin/blog/new`
- **Edit Post**: `/admin/blog/[id]/edit`

All admin routes are protected and require authentication.

## Email Setup

The contact form uses [Resend](https://resend.com) for sending emails:

### Quick Setup (Development)

1. Sign up for a free account at [resend.com](https://resend.com)
2. Go to [API Keys](https://resend.com/api-keys) in your dashboard
3. Create a new API key (name it something like "Mary's Website")
4. Copy the API key (it starts with `re_`)
5. Add it to your `.env.local` file:
   ```bash
   RESEND_API_KEY=re_your_key_here
   ```

That's it! The code will automatically use `onboarding@resend.dev` as the sender email, which works for development without domain verification.

### Production Setup (Optional)

For production, you can verify your own domain for a more professional sender address:

1. Go to [Resend Domains](https://resend.com/domains)
2. Add and verify your domain (e.g., `maryvcothren.com`)
3. Add DNS records as instructed by Resend
4. Once verified, add to your `.env.local`:
   ```bash
   RESEND_FROM_EMAIL=noreply@maryvcothren.com
   RESEND_FROM_NAME=Mary's Website
   ```

**Note**: Resend's free tier includes 3,000 emails/month, which is perfect for a personal author website.

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `DATABASE_URL` (Neon Postgres connection string)
   - `AUTH_USERNAME`
   - `AUTH_PASSWORD`
   - `AUTH_SECRET` (required in production)
   - `RESEND_API_KEY` (Resend API key for email sending)
   - Optional: `AUTH_COOKIE_NAME`, `AUTH_SESSION_DAYS`
3. Run database migrations after first deploy (or use `db:push` in build script)
4. Deploy automatically on push to main branch

**Note**: For Vercel serverless functions, you may need to adapt the Express server setup. Consider using Vercel's API routes format or keep the Express server as a separate service.

### Other Platforms

The site can be deployed to any static hosting service. For the email functionality, you'll need to adapt the serverless function for your platform (Netlify Functions, AWS Lambda, etc.).

## Accessibility Features

- Semantic HTML structure
- ARIA labels and live regions
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Skip-to-content links
- High contrast ratios

## Performance

- **Lighthouse Score**: 95+ Performance, 95+ Accessibility, 90+ SEO
- **Bundle Size**: ~160KB total (40KB CSS + 120KB JS)
- **Build Time**: <1 second
- **First Contentful Paint**: <1.5s

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details.

## Contributing

This is a personal project, but suggestions and improvements are welcome via issues or pull requests.

---

Built with ❤️ for Mary's author website