# 📖 Command Reference Guide

## Essential Commands

### 🚀 Deploy to Vercel

**Option 1: GitHub + Vercel (Recommended)**
```powershell
# Step 1: Commit everything
git add .
git commit -m "feat: Add EtherChat with MetaMask integration - ready for production"

# Step 2: Push to GitHub
git push origin main

# Step 3: Go to vercel.com and click "Import Project"
# Select your repository and click Deploy
```

**Option 2: Vercel CLI**
```powershell
# Install globally
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

---

### 💻 Local Development

**Start Dev Server**
```powershell
npm run dev
# Opens at http://localhost:5173
# Hot reload enabled - changes appear instantly
```

**Build for Production**
```powershell
npm run build
# Creates optimized build in /dist folder
# Ready to deploy!
```

**Test Production Build Locally**
```powershell
npm run build
npm run preview
# Opens at http://localhost:4173
# Shows exactly what users will see
```

---

### 🔄 Git Commands for Deployment

**Initial Setup (one-time)**
```powershell
git init
git add .
git commit -m "Initial commit - EtherChat with MetaMask"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/etherchat.git
git push -u origin main
```

**After Making Changes**
```powershell
git add .
git commit -m "Description of changes"
git push
```

**Check Status**
```powershell
git status
git log --oneline
```

---

### 📦 Dependency Management

**Install All Dependencies**
```powershell
npm install
```

**Add New Package**
```powershell
npm install package-name
```

**Update All Packages**
```powershell
npm update
```

**Check for Vulnerabilities**
```powershell
npm audit
npm audit fix
```

---

### 🐛 Troubleshooting Commands

**Clear Cache & Reinstall**
```powershell
rm node_modules -r -Force
rm package-lock.json
npm install
npm run build
```

**Check for Errors**
```powershell
npm run build
# Shows any build errors
```

**View Dependencies**
```powershell
npm list
# Shows all installed packages
```

**Check Node/npm Versions**
```powershell
node --version
npm --version
```

---

## Directory Structure Commands

**Navigate to Project**
```powershell
cd "c:\Users\tejas\Downloads\clone-existing-web-application"
```

**View Files**
```powershell
ls                           # List files in current directory
ls -Recurse                  # List all files recursively
Get-ChildItem -Filter *.tsx  # Find all tsx files
```

**View File Content**
```powershell
type .\src\App.tsx           # Show file contents
```

---

## Important Paths

```
Project Root:
C:\Users\tejas\Downloads\clone-existing-web-application\

Key Files:
- src\App.tsx              (Main component)
- src\utils\web3.ts        (MetaMask integration)
- package.json             (Dependencies)
- vite.config.ts           (Build config)
- vercel.json              (Deployment config)

Guides:
- QUICK_START.md           (5-minute guide)
- DEPLOYMENT_GUIDE.md      (Detailed guide)
- PROJECT_SETUP_REPORT.md  (This session summary)
```

---

## npm Scripts

```json
"dev": "vite"              # Development server
"build": "vite build"      # Production build
"preview": "vite preview"  # Preview production build
```

**Run Scripts:**
```powershell
npm run dev      # Fast development with hot reload
npm run build    # Optimized production build
npm run preview  # Test production build locally
```

---

## Environment Variables

**Create .env.local (Optional)**
```powershell
# Template from .env.example
VITE_INFURA_KEY=your_key_here
VITE_ALCHEMY_KEY=your_key_here
```

**In Vercel Dashboard:**
Settings → Environment Variables → Add your variables

---

## Testing MetaMask Locally

```
1. Install MetaMask extension
2. Create/import wallet
3. Switch to Sepolia Testnet
4. Go to https://sepoliafaucet.com
5. Get test ETH
6. Run: npm run dev
7. Click "Sign In" → "Connect Web3 Wallet"
8. Approve in MetaMask
9. Test! ✅
```

---

## Vercel Deployment Status

**Check Deployment:**
1. Go to vercel.com
2. Select your project
3. View deployment logs
4. Check environment variables
5. View analytics

**Rollback if Needed:**
1. Deployments tab
2. Click on previous deployment
3. Click "Promote to Production"

---

## GitHub Integration

**Create Repository (if new):**
1. Go to github.com
2. Click "New repository"
3. Name: etherchat
4. Choose public/private
5. Click Create
6. Follow instructions to push code

**Update Existing Repository:**
```powershell
git remote -v              # View remote
git remote set-url origin https://github.com/user/repo
git push origin main
```

---

## Error Resolution Quick Reference

```
ERROR: Module not found
→ npm install

ERROR: Port already in use
→ npm run dev  (try different port)

ERROR: Build fails
→ npm run build --verbose (see details)

ERROR: MetaMask error
→ Check browser console (F12)
→ Ensure MetaMask installed
→ Try different network

ERROR: Vercel deployment fails
→ Check deployment logs
→ Verify npm run build works locally
→ Check environment variables
```

---

## Useful Keyboard Shortcuts

**In Terminal:**
- `Ctrl + C` - Stop running process
- `Ctrl + L` - Clear screen
- `↑` / `↓` - Previous/next command

**In Browser (while npm run dev):**
- `h + Enter` - Show Vite help
- `q + Enter` - Stop server

---

## One-Command Quick Deploy

```powershell
# Do everything in one script
git add . && git commit -m "Update: Ready for production" && git push
# Then go to vercel.com and import repository
```

---

## 📊 Performance Checks

**Build Size:**
```powershell
npm run build
# Check dist/ folder size
```

**Bundle Analysis:**
```powershell
# Check index-xxx.js size in dist/assets/
```

**Local Speed Test:**
```powershell
npm run preview
# Test load time locally
```

---

## 🔐 Security Checks

**Audit Dependencies:**
```powershell
npm audit
npm audit fix
```

**Check .gitignore:**
```powershell
type .\gitignore
```

**Verify No Secrets:**
```powershell
git grep "password\|key\|secret"
```

---

## Version Control Best Practices

**Good Commit Messages:**
```
git commit -m "feat: Add MetaMask integration"
git commit -m "fix: Handle wallet connection errors"
git commit -m "docs: Update deployment guide"
```

**Bad Commit Messages:**
```
git commit -m "update"
git commit -m "fix stuff"
git commit -m "asdf"
```

---

## 📞 Help Commands

```powershell
npm --help              # npm help
npm install --help      # Help for specific command
npm run --help          # Show available scripts

node --version          # Check Node version
git --version          # Check Git version
```

---

## 🎯 Quick Reference Card

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Build | `npm run build` |
| Deploy | `git push` → vercel.com |
| Check errors | `npm run build` |
| Install deps | `npm install` |
| Update deps | `npm update` |
| Fix security | `npm audit fix` |
| View package | `npm list package-name` |
| Remove package | `npm uninstall package-name` |

---

## 🚀 Complete Deployment Workflow

```
1. npm run build              ← Test build locally
2. git add .                   ← Stage changes
3. git commit -m "..."        ← Create commit
4. git push                    ← Push to GitHub
5. vercel.com                 ← Import & Deploy
6. Wait 2-3 minutes           ← Deployment in progress
7. Your app is LIVE! 🎉      ← Share the URL
```

---

## 📝 Final Checklist

Before pushing:
- [ ] `npm run build` succeeds
- [ ] No console errors in dev mode
- [ ] MetaMask connects properly
- [ ] All features work locally
- [ ] `.env` files not committed
- [ ] No credentials in code
- [ ] Read DEPLOYMENT_GUIDE.md

---

**Keep this guide handy!**  
Bookmark or save for quick reference during deployment.

**Everything is ready to deploy! 🚀**
