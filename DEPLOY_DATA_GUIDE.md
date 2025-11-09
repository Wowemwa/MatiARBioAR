# 📝 How to Deploy Species Data Changes

## Understanding the Problem

**localStorage is browser-specific** and doesn't sync to GitHub or Vercel. When you edit species data through the admin panel:
- ✅ Changes save to YOUR browser's localStorage
- ❌ Changes DON'T get pushed to GitHub
- ❌ Vercel always deploys with default data from code

## Solution: Export → Code → Deploy Workflow

### Step 1: Edit Species Data Locally
1. Open your website locally or on Vercel
2. Access admin: Type `120108` or visit `/mati-secret-admin-2024`
3. Login with password: `Rey21`
4. Click **"Species Management"** to add/edit/delete species
5. Make all your changes (they save to localStorage automatically)

### Step 2: Export Your Data
1. In the admin dashboard, click **"📥 Export Data"**
2. A JSON file will download: `mati-species-YYYY-MM-DD.json`
3. Open this file in a text editor

### Step 3: Update the Code File
1. Open `src/data/mati-hotspots.ts` in your code editor
2. Find the `MATI_SPECIES` array (around line 150-400)
3. **Replace the entire array** with your exported JSON
4. The format should be:
   ```typescript
   export const MATI_SPECIES: SpeciesDetail[] = [
     {
       id: "species-1",
       category: "fauna",
       commonName: "Philippine Eagle",
       // ... rest of the data
     },
     // ... more species
   ]
   ```

### Step 4: Deploy to Production
1. Save the file
2. Commit changes:
   ```bash
   git add src/data/mati-hotspots.ts
   git commit -m "update: species data from admin panel"
   git push origin main
   ```
3. Vercel will automatically redeploy with your new data

## Quick Reference Commands

```bash
# Check current changes
git status

# Add and commit species data
git add src/data/mati-hotspots.ts
git commit -m "update: species data"

# Push to deploy
git push origin main
```

## Import Data (Restore from Backup)

If you have an exported JSON file and want to restore it:
1. In admin dashboard, click **"📤 Import Data"**
2. Select your JSON file
3. Data will load into localStorage and page will refresh
4. Verify the data looks correct
5. Follow steps 2-4 above to deploy permanently

## Alternative: Use a Database (Future)

For automatic syncing without manual exports, you would need:
- Firebase Realtime Database
- Supabase
- MongoDB Atlas
- Or any other cloud database

Let me know if you want help setting up a database solution!

## Troubleshooting

**Q: My changes don't appear on Vercel after pushing**
- Make sure you exported the latest data
- Check that `mati-hotspots.ts` was actually updated in the commit
- Check Vercel deployment logs

**Q: I lost my localStorage data**
- Always export your data before clearing browser cache
- Keep backup JSON files of important versions

**Q: Can I edit data directly on Vercel?**
- No, localStorage on Vercel is temporary
- Always use the Export → Code → Deploy workflow
