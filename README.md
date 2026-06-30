# 🚀 PRINCE NEXUS — AI Engineer & Full-Stack Developer Portfolio

A world-class, professional portfolio and content management platform built using **Next.js 15**, **TypeScript**, and **Tailwind CSS**. It is designed to showcase elite AI Engineering and Full-Stack Development expertise with Apple-level simplicity and Stripe-level professionalism.

🌐 **Live Demo:** [princenexus.com](https://princenexus.vercel.app)

---

## ✨ Core Features

*   **Premium & Responsive UI:** Fully responsive design with beautiful layouts, curated dark mode, glassmorphism, and smooth Framer Motion micro-animations.
*   **Recruiter-Focused AI Assistant:** An interactive chatbot powered by Google Gemini, trained to answer recruiter queries, highlight key projects, and coordinate contact requests.
*   **Dynamic Project Gallery:** Deep-dive case studies showcasing problems, solutions, architecture, challenges, learnings, and real-world results.
*   **Secure Admin Panel:** A secure dashboard protected by NextAuth v5 featuring full CRUD tools for project administration, resume uploads, analytics, and contact message management.
*   **Optimized Performance:** Fully SEO-optimized with dynamic Open Graph/Twitter meta tags, robots.txt, sitemaps, and server-side rendering targeting Lighthouse scores of 90+.

---

## 🏗️ System Architecture

The following diagram illustrates the flow and integration of the Prince Nexus system:

```mermaid
graph TD
    User([User / Recruiter]) -->|Browse & Interact| FE[Next.js 15 Frontend]
    Admin([Administrator]) -->|Authenticate & Manage| FE
    
    FE -->|Auth Session / Middleware| Auth[NextAuth.js v5]
    FE -->|AI Assistant Chat| Gemini[Google Gemini API]
    FE -->|File Uploads| UT[UploadThing / Vercel Blob]
    
    FE -->|Database Queries| Prisma[Prisma ORM]
    Prisma -->|Read/Write| DB[(Neon PostgreSQL)]
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Server Actions** - Server-side mutations

### Database & ORM
- **PostgreSQL** - Robust relational database (via Neon)
- **Prisma** - Next-generation ORM

### Authentication
- **NextAuth v5** - Secure authentication

### File Upload
- **UploadThing** - Modern file uploads

### Deployment
- **Vercel** - Optimized hosting platform

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/princeprajapati/prince-nexus.git
cd prince-nexus
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials.

> [!TIP]
> To generate a secure `NEXTAUTH_SECRET`, open your terminal and run:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
> ```

```env
# Database (Get from neon.tech)
DATABASE_URL="postgresql://user:password@host/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# UploadThing (Get from uploadthing.com)
UPLOADTHING_TOKEN="your-token-here"

# Admin Credentials
ADMIN_EMAIL="admin@princenexus.com"
ADMIN_PASSWORD="changeme"
```

4. **Set up and Seed the Database**
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

## 🏗️ Project Structure

```text
prince-nexus/
├── app/                  # Next.js App Router Pages & Layouts
│   ├── admin/            # Secure admin control center
│   ├── api/              # Serverless API endpoints (Auth, AI Chat, etc.)
│   ├── projects/[slug]/  # Dynamic case study pages
│   └── page.tsx          # Interactive portfolio home page
├── components/           # Reusable UI & Layout Components
│   ├── layout/           # Global Navbar, Footer structures
│   ├── sections/         # Portfolio sections (Hero, About, AI Chatbot, Timeline)
│   └── ui/               # Particles, visual enhancements, and widgets
├── lib/                  # Shared utilities and configurations
│   ├── db.ts             # Prisma Client instance setup
│   └── utils.ts          # Custom CSS/Tailwind utility helpers
├── prisma/               # Database Models and Seed Scripts
│   ├── schema.prisma     # Relational database layout
│   └── seed.ts           # Standard portfolio mockup data seeder
├── public/               # Static assets (images, pdfs)
└── package.json          # Node dependencies & custom scripts
```

---

## 🚢 Deployment

### Deploying to Vercel (Recommended)
1. Push your updated code to your GitHub repository.
2. Log in to [Vercel](https://vercel.com) and click **Add New** > **Project**.
3. Import your `prince-nexus` repository.
4. Add all environment variables from your local `.env` file under the environment variables settings.
5. Click **Deploy**. Vercel will build and launch your site automatically.

---

## 🤝 Contributing

This is a personal portfolio repository, but feedback and feature suggestions are always welcome! Feel free to open an issue or submit a pull request.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**Prince Prajapati**
- Portfolio: [princenexus.com](https://princenexus.com)
- GitHub: [@princeprajapati](https://github.com/princeprajapati)
- LinkedIn: [Prince Prajapati](https://linkedin.com/in/princeprajapati)
- Email: prince@princenexus.com

## 🙏 Acknowledgments

Built with modern web technologies and best practices to showcase professional AI Engineering and Full Stack Development skills.

---

**Note**: Remember to customize all content, links, and credentials before deploying to production!
