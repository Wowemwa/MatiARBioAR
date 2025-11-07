# 🎯 MongoDB Atlas - Visual Quick Guide

```
┌─────────────────────────────────────────────────────────────┐
│                  MATI ARBIO DATABASE SETUP                  │
│                     (15 Minutes Total)                      │
└─────────────────────────────────────────────────────────────┘

Step 1: Sign Up (3 min)
├─ Go to: mongodb.com/cloud/atlas/register
├─ Click: "Sign up with Google"
├─ Activate GitHub Student Pack ($200 credit)
└─ ✓ Free account created

Step 2: Create Database (5 min)
├─ Click: "Create" button
├─ Choose: M0 FREE tier
├─ Region: Singapore (ap-southeast-1)
├─ Name: mati-arbio
├─ Username: mati-admin
├─ Password: (auto-generate & save!)
└─ ✓ Database ready

Step 3: Get Connection String (2 min)
├─ Click: "Connect" → "Drivers"
├─ Copy the connection string
├─ Replace: <password> with your actual password
└─ ✓ Connection string ready

Step 4: Configure Your App (3 min)
├─ Duplicate: .env.example → .env
├─ Paste: Connection string
├─ Add: /mati-arbio at the end
└─ ✓ App configured

Step 5: Create Collections (2 min)
├─ Browse Collections → Add My Own Data
├─ Create: hotspots
├─ Create: species
└─ ✓ Database structure ready

Step 6: Test (1 min)
├─ Run: npm run dev
├─ Open: http://localhost:5173
└─ ✓ Everything works!
```

---

## 📋 Checklist

Before you start:
- [ ] GitHub Student Pack activated
- [ ] VS Code open with your project
- [ ] Browser ready

Step by step:
- [ ] MongoDB account created
- [ ] M0 Free cluster created
- [ ] Database user created (username + password saved)
- [ ] IP address whitelisted
- [ ] Connection string copied
- [ ] `.env` file created
- [ ] Connection string pasted in `.env`
- [ ] Collections created (hotspots, species)
- [ ] Dev server running (`npm run dev`)
- [ ] Website loads without errors

---

## 🎨 Your Database Structure

```
mati-arbio (Database)
├── hotspots (Collection)
│   ├── mount-hamiguitan
│   ├── pujada-bay
│   └── dahican-beach
├── species (Collection)
│   ├── philippine-eagle
│   ├── pitcher-plant
│   └── green-turtle
└── admin_users (Collection)
    └── your-admin-account
```

---

## 🔑 Important Info to Save

**MongoDB Atlas Dashboard:**
```
https://cloud.mongodb.com
```

**Your Connection String:**
```
mongodb+srv://mati-admin:YOUR_PASSWORD@mati-arbio.xxxxx.mongodb.net/mati-arbio
```

**Your Credentials:**
```
Username: mati-admin
Password: [The one you generated - SAVE THIS!]
Database: mati-arbio
```

**Your Collections:**
```
✓ hotspots   - Biodiversity locations
✓ species    - Flora & fauna data
✓ admin_users - Admin accounts
```

---

## 🚨 Common Issues & Quick Fixes

### Issue #1: "Cannot connect"
```bash
Solution:
1. Check .env file exists
2. Check connection string is complete
3. Restart: npm run dev
```

### Issue #2: "Authentication failed"
```bash
Solution:
1. MongoDB Atlas → Database Access
2. Reset password for mati-admin
3. Update .env with new password
```

### Issue #3: "Network error"
```bash
Solution:
1. MongoDB Atlas → Network Access
2. Add IP: 0.0.0.0/0 (allow all)
3. Wait 1 minute, try again
```

---

## 💡 Pro Tips

**Tip #1:** Bookmark your MongoDB dashboard
- You'll use it often for data management

**Tip #2:** Save your password securely
- Use a password manager
- Don't commit `.env` to Git

**Tip #3:** Use M0 Free tier
- It's FREE FOREVER
- 512MB is enough for your data
- Upgrade later if needed

**Tip #4:** Choose Singapore region
- Fastest for Philippines
- Low latency for your users

---

## 📊 What You Get

### With M0 FREE Tier:
✅ 512 MB Storage  
✅ Shared RAM  
✅ Unlimited queries  
✅ Free forever  
✅ Geographic queries  
✅ Full-text search  

### With GitHub Student Pack:
💰 $200 Credit  
🚀 Can upgrade to M2 (22 months free)  
🚀 Or M10 (3 months free)  
🎓 Plus all other benefits  

---

## 🎯 Next Steps After Setup

1. **Upload Data**
   - Import your hotspots
   - Import your species
   - Link them together

2. **Test Admin Panel**
   - Login with secret access (Ctrl+Shift+A)
   - Create/Edit/Delete data
   - Upload images

3. **Set Up AR Models**
   - Upload 3D models (.glb files)
   - Upload AR targets (.mind files)
   - Test AR features

4. **Deploy to Production**
   - Push to GitHub
   - Deploy to Vercel/Netlify
   - Update production env vars

---

## 🆘 Need More Help?

**Simple Guide:**  
→ `DATABASE_SETUP.md` (This file!)

**Detailed Guide:**  
→ `MONGODB_ATLAS_DETAILED.md`

**MongoDB Documentation:**  
→ https://docs.atlas.mongodb.com

**VS Code Issues:**  
→ Check `.env` file is in root folder  
→ Check no spaces in connection string  
→ Check file is named exactly `.env` (not `.env.txt`)

---

Made with ❤️ for Mati ARBio 2025 🌿
