# PRINCE NEXUS - Quick Start Guide

Get your portfolio running in 5 minutes!

## 🚀 Fast Setup

### 1. Install Dependencies (2 min)

```bash
cd prince-nexus
npm install
```

### 2. Configure Database (2 min)

1. Create free account at [neon.tech](https://neon.tech)
2. Create new project named "prince-nexus"
3. Copy connection string

### 3. Set Environment Variables (1 min)

Create `.env` file:

```env
DATABASE_URL="your-neon-connection-string-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run-this-command: openssl rand -base64 32"
UPLOADTHING_TOKEN="get-from-uploadthing.com"
```

Generate secret:
```bash
openssl rand -base64 32
```

### 4. Setup Database (1 min)

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 5. Run Development Server (< 1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ That's It!

Your portfolio is now running with:
- ✅ 3 Featured Projects
- ✅ 16 Skills
- ✅ 5 Timeline Events
- ✅ Interactive AI Assistant
- ✅ Contact Form
- ✅ Admin Panel (`/admin`)

## 🎨 Customize Your Portfolio

### Update Personal Info

1. **Hero Section** → `components/sections/HeroSection.tsx`
   - Change name, title, tagline

2. **About Section** → `components/sections/AboutSection.tsx`
   - Update bio, stats

3. **Contact Info** → `components/sections/ContactSection.tsx`
   - Update email, social links

### Add Your Projects

**Via Prisma Studio (Easiest):**
```bash
npm run db:studio
```
Opens at `http://localhost:5555` - edit directly!

**Via Seed File:**
Edit `prisma/seed.ts` and run:
```bash
npm run db:seed
```

### Add Your Resume

Place `resume.pdf` in `public/` folder - download button will work automatically!

## 🚢 Deploy to Vercel (5 min)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/prince-nexus.git
git push -u origin main

# 2. Go to vercel.com
# 3. Import your GitHub repo
# 4. Add environment variables
# 5. Deploy!
```

## 📚 Need More Help?

- **Full Setup Guide:** See `SETUP_GUIDE.md`
- **Deployment:** See `DEPLOYMENT_CHECKLIST.md`
- **Documentation:** See `README.md`

## 🎯 Next Steps

1. Customize all content
2. Add your actual projects
3. Upload your resume
4. Test on mobile
5. Deploy to production
6. Share with the world!

---

**Happy Building!** 🚀
