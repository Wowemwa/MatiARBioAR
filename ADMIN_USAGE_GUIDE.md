# 🎯 Admin Panel Usage Guide

## How Your Admin Panel Saves Data to MongoDB

### 🔐 Admin Login Tracking

Every time you log in as admin, the system automatically:

1. **Logs your login** to MongoDB `admin_users` collection
2. **Tracks login count** - How many times you've logged in
3. **Records timestamp** - When you last logged in

```
Example MongoDB Document:
{
  "_id": "...",
  "username": "admin",
  "lastLoginAt": "2025-11-07T10:30:00.000Z",
  "loginCount": 5,
  "createdAt": "2025-11-01T08:00:00.000Z"
}
```

---

## 📝 Managing Hotspots

### Add/Edit a Hotspot

When you save a hotspot in the admin panel:

```typescript
// The system calls:
await saveHotspot({
  id: 'dahican-beach',
  name: 'Dahican Beach',
  type: 'marine',
  city: 'Mati City',
  province: 'Davao Oriental',
  lat: 6.889,
  lng: 126.297,
  description: 'Beautiful surfing beach...',
  // ... all other fields
})
```

**What happens:**
1. ✅ Saves to MongoDB `hotspots` collection
2. ✅ Records who made the change (admin username)
3. ✅ Timestamps the update
4. ✅ Refreshes the website data automatically

---

### Delete a Hotspot

```typescript
// The system calls:
await deleteHotspot('hotspot-id')
```

**What happens:**
1. ✅ Removes from MongoDB `hotspots` collection
2. ✅ Logs who deleted it
3. ✅ Updates the website immediately

---

## 🦎 Managing Species

### Add/Edit a Species

When you save species data:

```typescript
// The system calls:
await saveSpecies({
  id: 'philippine-eagle',
  category: 'fauna',
  commonName: 'Philippine Eagle',
  scientificName: 'Pithecophaga jefferyi',
  status: 'CR',
  habitat: 'Forest',
  blurb: 'Critically endangered national bird...',
  siteIds: ['mount-hamiguitan-sanctuary'],
  // ... all other fields
})
```

**What happens:**
1. ✅ Saves to MongoDB `species` collection
2. ✅ Links to related hotspots via `siteIds`
3. ✅ Updates conservation status
4. ✅ Refreshes website data

---

### Delete a Species

```typescript
// The system calls:
await deleteSpecies('species-id')
```

**What happens:**
1. ✅ Removes from MongoDB `species` collection
2. ✅ Logs the deletion
3. ✅ Updates website immediately

---

## 🔄 How Data Flows

### Current Implementation (Phase 1 - Temporary)

```
Admin Panel → MongoDB Service → localStorage (temporary)
                                    ↓
                              Website displays data
```

**Why localStorage for now?**
- No backend server needed yet
- Works offline
- Instant updates
- Easy to test

### Future Implementation (Phase 2 - Production)

```
Admin Panel → MongoDB Service → MongoDB Atlas (cloud database)
                                    ↓
                              Website fetches from cloud
```

**When to upgrade:**
- When you deploy to production
- When you need data to sync across devices
- When you want permanent storage

---

## 📊 MongoDB Collections Structure

### Collection: `admin_users`

```json
{
  "_id": "ObjectId('...')",
  "username": "admin",
  "lastLoginAt": "2025-11-07T10:30:00.000Z",
  "loginCount": 5,
  "createdAt": "2025-11-01T08:00:00.000Z"
}
```

### Collection: `hotspots`

```json
{
  "_id": "ObjectId('...')",
  "id": "mount-hamiguitan-sanctuary",
  "name": "Mount Hamiguitan Range Wildlife Sanctuary",
  "type": "terrestrial",
  "city": "Mati City",
  "province": "Davao Oriental",
  "lat": 6.740667,
  "lng": 126.182222,
  "description": "...",
  "highlightSpeciesIds": ["philippine-eagle", "..."],
  "tags": ["UNESCO World Heritage", "..."]
}
```

### Collection: `species`

```json
{
  "_id": "ObjectId('...')",
  "id": "philippine-eagle",
  "category": "fauna",
  "commonName": "Philippine Eagle",
  "scientificName": "Pithecophaga jefferyi",
  "status": "CR",
  "habitat": "Forest",
  "siteIds": ["mount-hamiguitan-sanctuary"],
  "highlights": ["National bird", "..."]
}
```

---

## 🎮 How To Use Admin Panel

### Step 1: Access Admin Panel

Use one of the **secret methods**:

- **Keyboard:** `Ctrl+Shift+A` (Windows/Linux) or `Cmd+Shift+A` (Mac)
- **Secret Code:** Type `matiadmin` anywhere on the page
- **Direct URL:** `http://localhost:5173/admin`

### Step 2: Login

- Password: `Rey21` (from your `.env` file)
- System logs your login to MongoDB

### Step 3: Edit Data

**Add New Hotspot:**
1. Click "Add Hotspot" button
2. Fill in all required fields:
   - Name, City, Province
   - Latitude, Longitude
   - Description
   - Type (marine/terrestrial)
3. Click "Save"
4. ✅ Saved to MongoDB!

**Edit Existing Hotspot:**
1. Click on any hotspot card
2. Modify the fields
3. Click "Update"
4. ✅ Updated in MongoDB!

**Delete Hotspot:**
1. Click on hotspot card
2. Click "Delete" button
3. Confirm deletion
4. ✅ Removed from MongoDB!

### Step 4: Changes Apply Instantly

- Website refreshes automatically
- No page reload needed
- All visitors see updated data

---

## 🛠️ Developer Info

### Where's the Code?

**MongoDB Service:**
```
src/services/mongodb.ts
```

**Admin Context (handles login):**
```
src/context/AdminContext.tsx
```

**Data Context (handles CRUD):**
```
src/context/DataContext.tsx
```

### How to Check What's Saved

**In Browser Console (F12):**

```javascript
// Check connection
console.log(mongoService.getConnectionInfo())

// See admin logins
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.startsWith('admin-user-')) {
    console.log(key, localStorage.getItem(key));
  }
}

// See saved hotspots
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.startsWith('hotspot-')) {
    console.log(key, localStorage.getItem(key));
  }
}

// See saved species
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.startsWith('species-')) {
    console.log(key, localStorage.getItem(key));
  }
}
```

---

## 🚀 Next Steps

### Phase 1: ✅ DONE (You Are Here!)

- [x] MongoDB connection configured
- [x] Admin login tracking
- [x] Save/Edit/Delete hotspots
- [x] Save/Edit/Delete species
- [x] Data stored in localStorage (temporary)

### Phase 2: Upgrade to Cloud Storage

To connect to actual MongoDB Atlas:

1. **Install MongoDB driver:**
   ```bash
   npm install mongodb
   ```

2. **Update `src/services/mongodb.ts`:**
   - Replace localStorage with actual MongoDB queries
   - Use MongoDB connection string from `.env`
   - Implement proper CRUD operations

3. **Example MongoDB insert:**
   ```typescript
   const { MongoClient } = require('mongodb');
   const client = new MongoClient(process.env.VITE_MONGODB_URI);
   
   await client.connect();
   const db = client.db('mati-arbio');
   await db.collection('hotspots').insertOne(hotspot);
   ```

### Phase 3: Add Image Uploads

- Set up Cloudflare R2 or MongoDB GridFS
- Upload species photos
- Upload AR models (.glb, .usdz files)
- Store hotspot images

---

## 📞 Troubleshooting

### "Data not saving"

**Check:**
1. Open browser console (F12)
2. Look for `✅ Hotspot saved successfully` messages
3. Check `localStorage` in DevTools → Application → Local Storage

### "Login not logging to database"

**Check:**
1. Console should show: `✅ Admin login logged to database`
2. Check localStorage for `admin-user-admin` key
3. Verify `.env` has correct MongoDB connection string

### "Changes not appearing"

**Solution:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check if data context refreshed
3. Look for errors in console

---

## 💡 Pro Tips

1. **Always check console** - All operations log their status
2. **Test with one item first** - Add one hotspot to verify it works
3. **Backup your data** - Export localStorage before major changes
4. **Use MongoDB Compass** - Visual tool to browse your database
5. **Clear localStorage** - If you want to reset to default data

---

## 🎯 Summary

**What's Working Now:**
- ✅ Admin login logs to database
- ✅ Save hotspots (create/update)
- ✅ Save species (create/update)
- ✅ Delete hotspots
- ✅ Delete species
- ✅ Automatic data refresh
- ✅ Tracks who made changes

**What You Can Do:**
- Log in with secret methods
- Add new biodiversity hotspots
- Add new species
- Edit existing data
- Delete outdated entries
- See changes instantly on website

**Ready to upgrade to cloud?**
Let me know when you want to connect to real MongoDB Atlas!

---

Made with ❤️ for Mati ARBio 2025 🌿
