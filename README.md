# SweetB — Luxurious Marketing Website

A static, minimalist marketing website for **SweetB**, a men's health supplement. Built with Next.js and exported to pure HTML/CSS/JS for easy deployment.

## 🎨 Design Philosophy

- **Background**: Matte black (#0A0A0A) for rich, discreet luxury
- **Accents**: Gold (#C9A86A) and Neon White (#F8F8F8)
- **Typography**: Playfair Display (headings) + Inter (body)
- **Style**: High contrast, minimalist, accessible

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install
npm install tailwindcss-animate  # Additional dependency
```

### Database Setup (for CRM features)

```bash
# Generate Prisma client
npx prisma generate

# Create database and migrations
npx prisma migrate dev --name init

# Seed admin user and feature flags
npm run db:seed
```

### Environment Configuration

1. Copy `.env.local.example` to `.env.local`
2. Update the following:
   - `EMAIL_API_KEY` - Get from [Resend.com](https://resend.com)
   - `SESSION_SECRET` - Generate a long random string
   - `VERIFIER_URL` and `VERIFIER_API_KEY` - Your third-party verification service

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Admin Access
- Email: `admin@sweetb.co`
- Request OTP via `/login` (you need to create this page)
- Check terminal/email for verification code

### Build & Export Static HTML

```bash
npm run build
```

For static export (marketing pages only):
```bash
npm run export
```

This will create an `out/` directory. Note: CRM features require a Node.js server and cannot be statically exported.

## 📁 Project Structure

```
SweetB/
├── app/
│   ├── components/       # All React components
│   │   ├── Header.tsx    # Sticky navigation
│   │   ├── Hero.tsx      # Main hero section with background image
│   │   ├── ProductShowcase.tsx  # Lifestyle image showcase
│   │   ├── Benefits.tsx  # Benefit cards with lifestyle images
│   │   ├── Ingredients.tsx  # Ingredients with botanical photos
│   │   ├── HowToUse.tsx
│   │   ├── Safety.tsx    # Quality & safety certifications
│   │   ├── Precautions.tsx
│   │   ├── OfferBanner.tsx
│   │   ├── FAQ.tsx       # Accordion using <details>
│   │   ├── Footer.tsx
│   │   ├── BackgroundElements.tsx  # Parallax scroll effects
│   │   └── ScrollReveal.tsx  # Scroll-triggered animations
│   ├── about/            # About page
│   │   ├── page.tsx      # Brand story and heritage
│   │   ├── page.module.css  # About page styles
│   │   └── layout.tsx    # About page metadata
│   ├── benefits/         # Benefits page
│   │   ├── page.tsx      # Expanded benefits showcase
│   │   ├── page.module.css  # Benefits page styles
│   │   └── layout.tsx    # Benefits page metadata
│   ├── contact/          # Contact page
│   │   ├── page.tsx      # Linktree-style contact layout
│   │   ├── page.module.css  # Contact page styles
│   │   └── layout.tsx    # Contact page metadata
│   ├── globals.css       # Global styles & animations
│   ├── layout.tsx        # Root layout with fonts
│   └── page.tsx          # Main page composition
├── public/
│   └── images/           # Image assets directory
│       ├── lifestyle/    # Lifestyle photos
│       ├── ingredients/  # Botanical close-ups
│       ├── product/      # Product photography
│       └── README.md     # Image replacement guide
├── out/                  # Static export (after build)
└── README.md
```

## 🌐 Deployment

After running `npm run build`, the `out/` directory contains:
- `index.html` — main page
- `_next/` — optimized CSS, JS, fonts

You can deploy the `out/` folder to:
- **Netlify**: Drag & drop the `out/` folder
- **Vercel**: `vercel --prod`
- **GitHub Pages**: Push `out/` to `gh-pages` branch
- **Any static host**: Upload `out/` contents via FTP/SFTP

## ✨ Features

- ✅ Fully static (no backend or API routes)
- ✅ Accessible HTML with semantic markup
- ✅ Parallax scroll effects with floating background elements
- ✅ Scroll-triggered reveal animations using Intersection Observer
- ✅ CSS-only animations with `prefers-reduced-motion` support
- ✅ Smooth scroll navigation
- ✅ Responsive design (mobile-first)
- ✅ Native `<details>` accordion for FAQ
- ✅ High contrast for readability
- ✅ Google Fonts (Inter, Playfair Display)
- ✅ Subtle geometric shapes and patterns in background

## 🎯 Pages & Sections

### Home Page (/)
1. **Header** — Sticky nav with smooth scroll links
2. **Hero** — "Vitality Reborn" headline with lifestyle background image
3. **Product Showcase** — Two large lifestyle images with gold accents
4. **Ingredients** — 5 key botanicals with circular botanical images
5. **How to Use** — Simple instruction list with icons
6. **Safety** — Quality certifications (ISO 22000, GMP, ISO 9001, HACCP) with badge cards
7. **Precautions** — Disclaimer and safety warnings
8. **Offer Banner** — Member loyalty callout
9. **FAQ** — Accessible accordion with `<details>`
10. **Footer** — Logo, links, copyright

### Benefits Page (/benefits)
- **Dedicated benefits showcase** with expanded descriptions
- **4 detailed benefit sections**: Energy & Focus, Balanced Confidence, Lasting Performance, Discreet & Convenient
- **Visual storytelling** with alternating image/text layout (same style as About page)
- **In-depth explanations** of how each benefit supports your lifestyle
- **Scientific backing** mentions key ingredients for each benefit
- **Call-to-action** at the end to shop or learn more

### About Page (/about)
- **Brand story**: The Legend of Candy B
- **Visual storytelling** with alternating image/text sections
- **4 story chapters**: The Origin, Nature's Wisdom, Fifty Years of Heritage, Modern Evolution
- **Peruvian mountain imagery** and natural botanical photos
- **Timeline narrative** from ancient tradition to modern SweetB

### Contact Page (/contact)
- **Linktree-style layout** with elegant contact buttons
- **6 contact methods**: Email, WhatsApp, Telegram, Instagram, Facebook, Twitter
- **Animated hover effects** with gold accents
- **Back to home** navigation link
- **Placeholder links** ready for your actual URLs

## 🖼️ Images

The website includes curated images from Unsplash in:
- **Hero section**: Luxury lifestyle background
- **Product Showcase**: Two full-width lifestyle images
- **Benefits cards**: Professional, fitness, and lifestyle imagery
- **Ingredients**: Botanical close-ups in circular frames

All images are automatically styled with grayscale filters and gold tinting to match the luxury brand aesthetic.

### Replacing Images

To use your own images, see `public/images/README.md` for detailed instructions. Simply replace Unsplash URLs with local paths like `/images/lifestyle/your-image.jpg`.

## 📞 Contact Page

The `/contact` page features a Linktree-style layout with buttons for:
- **Email** - `mailto:contact@sweetb.co` (update with your email)
- **WhatsApp** - Placeholder link (add your WhatsApp number)
- **Telegram** - Placeholder link (add your Telegram username)
- **Instagram** - Placeholder link (add your Instagram handle)
- **Facebook** - Placeholder link (add your Facebook page)
- **Twitter** - Placeholder link (add your Twitter handle)

To update contact links, edit the `contactLinks` array in `app/contact/page.tsx`.

## 🛠 Tech Stack

### Marketing Site
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **CSS Modules**
- **Google Fonts**

### CRM Layer (New)
- **Prisma ORM** - Database management
- **SQLite** (dev) / **PostgreSQL** (prod)
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Resend** - Email delivery
- **Jose** - JWT sessions
- **Zod** - Input validation
- **bcryptjs** - OTP hashing

## 📦 Static Export

The site is configured with `output: 'export'` in `next.config.js`, making it a true static site with no Node.js runtime required.

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Black | `#0A0A0A` | Background |
| Gold | `#C9A86A` | Accents, borders, headings |
| Neon White | `#F8F8F8` | Primary text, logo "B" |
| Soft Gray | `#B8B8B8` | Secondary text |

## 🔐 CRM Features

### Authentication
- **Email OTP only** (no passwords)
- JWT session-based authentication
- 10-minute OTP expiry
- HTTP-only secure cookies

### User Features
- **Purchase Verification** - Validate product codes via third-party API
- **Gift Redemption** - Auto-eligibility based on purchase threshold
- **Purchase History** - Track all verified purchases
- **Account Dashboard** - View stats and manage redemptions

### Admin Features
- **Dashboard** - Metrics and overview
- **User Management** - View users, adjust sales manually
- **Redemption Management** - Approve/ship/reject gift requests
- **Feature Flags** - Toggle lucky draw features
- **Lucky Draw System** - Create draws, manage entries, pick winners
- **Audit Logging** - Track all admin actions

### API Endpoints

#### Authentication
- `POST /api/auth/request-otp` - Request verification code
- `POST /api/auth/verify-otp` - Verify code and create session
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Destroy session

#### Verification
- `POST /api/verify/forward` - Verify purchase code

#### User
- `POST /api/redeem` - Redeem gift (to be implemented)

#### Admin (require ADMIN role)
- `POST /api/admin/users/[id]/adjust-sales` - Manual sales adjustment
- `POST /api/admin/redemptions/[id]/status` - Update redemption status
- `POST /api/admin/flags` - Toggle feature flags
- `POST /api/admin/draws/*` - Manage lucky draws

For detailed setup instructions, see **SETUP_GUIDE.md** and **CRM_IMPLEMENTATION_STATUS.md**.

## 📄 License

© 2025 SweetB. All rights reserved.

