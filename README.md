# Mary's Blog - Vue 3 + TypeScript Email Collection Site

A simple, fast, and accessible website focused on collecting emails for Mary's author mailing list. Built with Vue 3, TypeScript, Tailwind CSS, and deployed on Vercel.

## Features

- **Fast & Lightweight**: Optimized build with small bundle sizes
- **Accessible**: WCAG AA compliant with proper ARIA labels and keyboard navigation
- **Responsive**: Mobile-first design that works on all devices
- **Email Collection**: Serverless contact form with validation and rate limiting
- **SEO Optimized**: Proper meta tags and Open Graph support

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: Tailwind CSS with typography plugin
- **Routing**: Vue Router with 404 handling
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
   
   Edit `.env.local` with your Gmail credentials:
   ```
   GMAIL_TO=your-email@domain.com
   GMAIL_USER=your-gmail@gmail.com
   GMAIL_PASS=your-app-password
   ```

### Development

```bash
npm run dev
```

Opens the development server at `http://localhost:3000`

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

## Email Setup

The contact form uses Gmail SMTP with App Passwords for security:

1. Enable 2-factor authentication on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Use this password in `GMAIL_PASS` (not your regular Gmail password)

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `GMAIL_TO`
   - `GMAIL_USER` 
   - `GMAIL_PASS`
3. Deploy automatically on push to main branch

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