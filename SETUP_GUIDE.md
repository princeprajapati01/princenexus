# PRINCE NEXUS - Complete Setup Guide

This guide will walk you through setting up the PRINCE NEXUS portfolio from scratch.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control
- A **Neon** account for PostgreSQL database ([Sign up](https://neon.tech))
- An **UploadThing** account for file uploads ([Sign up](https://uploadthing.com))

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Navigate to your projects directory
cd ~/Desktop/myone

# The project is already created, navigate into it
cd prince-nexus

# Install dependencies (if you haven't already)
npm install
```

### 2. Database Setup (Neon PostgreSQL)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project called "prince-nexus"
3. Copy your connection string (it looks like: `postgresql://user:password@host/database`)
4. The connection string will be used in the next step

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your actual values:

```env
# Database - Get from Neon
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/prince_nexus?sslmode=require"

# NextAuth - Generate a secret
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Generate secret with: openssl rand -base64 32
# Or use: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# UploadThing - Get from uploadthing.com
UPLOADTHING_TOKEN="your-uploadthing-token-here"

# Admin credentials for initial login
ADMIN_EMAIL="admin@princenexus.com"
ADMIN_PASSWORD="changeme"
```

### 4. Generate NextAuth Secret

Generate a secure secret for NextAuth:

**Option 1 - Using OpenSSL:**
```bash
openssl rand -base64 32
```

**Option 2 - Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and paste it as your `NEXTAUTH_SECRET` in `.env`

### 5. Database Migration

Push the schema to your database:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 6. Seed the Database

Populate your database with initial data:

```bash
npm run db:seed
```

This will create:
- 3 featured projects (BillVaultAI, CredMint, Task Classification)
- 16 skills across 4 categories
- 5 timeline events
- Settings configuration

### 7. Verify Database (Optional)

Open Prisma Studio to view your data:

```bash
npm run db:studio
```

This will open a browser at `http://localhost:5555` where you can view and edit your database.

### 8. Run Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization Guide

### Update Personal Information

1. **Edit Homepage Content:**
   - File: `components/sections/HeroSection.tsx`
   - Update name, title, tagline

2. **Edit About Section:**
   - File: `components/sections/AboutSection.tsx`
   - Update bio, stats, achievements

3. **Update Contact Info:**
   - File: `components/sections/ContactSection.tsx`
   - Update email, social links

4. **Update Footer:**
   - File: `components/layout/Footer.tsx`
   - Update social links, copyright

### Add Your Projects

**Option 1 - Via Database:**
```bash
npm run db:studio
```
Then add projects through Prisma Studio.

**Option 2 - Via API:**
Use the `/api/projects` endpoint to create projects programmatically.

**Option 3 - Update Seed File:**
Edit `prisma/seed.ts` and run `npm run db:seed` again.

### Update Skills

Edit the skills array in `prisma/seed.ts`:

```typescript
const skills = [
  { name: 'Your Skill', category: 'Category', level: 95, order: 1 },
  // Add more skills...
];
```

Then run: `npm run db:seed`

### Customize Theme Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    500: '#your-color',
    600: '#your-darker-color',
    // ... more shades
  },
}
```

### Add Your Resume

1. Place your resume PDF in `public/resume.pdf`
2. The download link is automatically configured in the Hero section

### Configure UploadThing

1. Go to [uploadthing.com](https://uploadthing.com)
2. Create a new app
3. Copy your app token
4. Add it to `.env` as `UPLOADTHING_TOKEN`

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/prince-nexus.git
git push -u origin main
```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables from your `.env` file
   - Click "Deploy"

3. **Update Environment Variables:**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all variables from your `.env` file
   - Don't forget to update `NEXTAUTH_URL` to your production URL

4. **Trigger Redeploy:**
   - Go to Deployments
   - Click "Redeploy" to apply environment variables

### Post-Deployment

1. **Update URLs in code:**
   - Replace `princenexus.com` with your actual domain in:
     - `app/sitemap.ts`
     - `app/robots.ts`
     - `app/layout.tsx` (metadata)

2. **Test everything:**
   - Homepage loads correctly
   - Projects display properly
   - Contact form works
   - Admin panel is accessible
   - All animations work smoothly

3. **SEO Verification:**
   - Test with [PageSpeed Insights](https://pagespeed.web.dev/)
   - Check metadata with [Metatags.io](https://metatags.io/)
   - Verify in [Google Search Console](https://search.google.com/search-console)

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Check your `DATABASE_URL` is correct
2. Ensure your IP is whitelisted in Neon (usually automatic)
3. Try regenerating the connection string in Neon dashboard

### Build Errors

If the build fails:

1. Delete `.next` folder and `node_modules`
2. Run `npm install` again
3. Run `npx prisma generate`
4. Run `npm run build`

### Missing Types

If you get TypeScript errors:

```bash
npx prisma generate
npm run dev
```

### Port Already in Use

If port 3000 is busy:

```bash
# Kill the process
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

## Performance Optimization

### Image Optimization

1. Use Next.js `<Image>` component for all images
2. Convert images to WebP format
3. Serve from CDN (UploadThing or Vercel)

### Bundle Size

Check bundle size:
```bash
npm run build
```

Analyze bundle:
```bash
npm install @next/bundle-analyzer
```

### Lighthouse Score

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS in production
- [ ] Add rate limiting to API routes
- [ ] Sanitize user inputs
- [ ] Keep dependencies updated
- [ ] Enable Vercel security headers

## Maintenance

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update Next.js specifically
npm install next@latest react@latest react-dom@latest
```

### Backup Database

Neon provides automatic backups, but you can also:

```bash
# Export data
npx prisma db pull
```

### Monitor Performance

- Use Vercel Analytics
- Monitor Lighthouse scores
- Check error logs regularly

## Getting Help

- **Documentation:** Check `README.md` for quick reference
- **Issues:** Create an issue on GitHub
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs:** [prisma.io/docs](https://prisma.io/docs)

## Next Steps

Once everything is set up:

1. ✅ Customize all content with your information
2. ✅ Add your actual projects
3. ✅ Upload your resume
4. ✅ Test on multiple devices
5. ✅ Deploy to production
6. ✅ Set up custom domain
7. ✅ Submit to search engines
8. ✅ Share with your network

---

**Congratulations!** Your premium portfolio is ready to impress recruiters and showcase your AI engineering skills. 🚀
