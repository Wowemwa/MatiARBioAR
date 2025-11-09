# Admin System Usage Guide

## 🔐 Access the Admin Panel

### Hidden URL (Discrete Access)
Navigate to: **`/mati-secret-admin-2024`**

Example: `http://localhost:5173/mati-secret-admin-2024`

This URL is intentionally hidden and only known to authorized administrators.

### Login Credentials
- **Password:** `Rey21`

## 🌿 Admin Features

### 1. Species Management
Click "Species Management" card to open the admin panel where you can:
- ✅ **Create** new species entries
- ✏️ **Edit** existing species data
- 🗑️ **Delete** species (with confirmation)
- 🔍 **Search** and **Filter** by category (Fauna/Flora)

### 2. Real-Time Updates
All changes made in the admin panel immediately reflect across the entire website:
- AR Demo page
- Biodiversity Explorer
- Species detail pages
- GIS Map markers

### 3. Data Persistence
- Species data is saved to **localStorage** automatically
- Changes persist across browser sessions
- Data survives page refreshes

### 4. Reset to Default
Click "Reset to Default" to restore all species data to the original defaults.
**Warning:** This permanently deletes all custom edits!

## 📊 Dashboard Stats
The admin page displays real-time statistics:
- Total species count
- Fauna count
- Flora count
- At-risk species count (EN, CR, VU status)

## 🛠️ How to Create a New Species

1. Navigate to `/mati-secret-admin-2024`
2. Login with password `Rey21`
3. Click "Species Management"
4. Click the "+" (Create New Species) button
5. Fill in all required fields:
   - ID (auto-generated if empty)
   - Category (Fauna/Flora)
   - Common Name
   - Scientific Name
   - Conservation Status
   - Habitat description
   - Blurb (species description)
   - Site IDs (select locations)
   - Highlights (key features)
   - Images (URLs)
6. Click "Save" (checkmark icon)
7. The new species immediately appears on all pages!

## ✏️ How to Edit a Species

1. Open the admin panel
2. Find the species in the list (use search if needed)
3. Click the edit icon (pencil) next to the species
4. Modify any fields
5. Click "Save" (checkmark icon)
6. Changes reflect immediately across the site

## 🗑️ How to Delete a Species

1. Open the admin panel
2. Find the species to delete
3. Click the delete icon (trash)
4. Confirm deletion in the popup
5. Species is immediately removed from all pages

## 🔄 How to Reset All Data

1. From the admin dashboard
2. Click "Reset to Default" card
3. Confirm the action in the popup
4. All species data reverts to original state

## 💡 Tips

- Changes are **instant** - no page refresh needed
- The admin route is **hidden** - only accessible via direct URL
- Use **search and filters** in the admin panel to find species quickly
- **Preview images** before saving by hovering over image URLs
- The system works **offline** - all data stored locally in browser

## 🔒 Security Notes

- Admin access requires password authentication
- Session persists until manual logout
- Admin route is not linked anywhere in the public UI
- Only users who know the secret URL can access admin features
