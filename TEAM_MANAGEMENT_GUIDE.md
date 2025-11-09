# Team Management Guide

## Overview
The About page now features an admin-editable team section that displays team members with photos, roles, and descriptions.

## Accessing Team Management

1. **Login as Admin**: Access the secret admin panel (triple-click on the logo or use the designated method)
2. **Navigate to Dashboard**: You'll see the Admin Dashboard with various management options
3. **Click "User Management"**: Find and click the "👥 User Management" card
4. You'll see all current team members displayed in a grid

## Managing Team Members

### Adding a New Team Member

1. Click the **"Add Member"** button (blue gradient button at the top)
2. Fill in the form:
   - **Name**: Full name of the team member
   - **Role**: Their position (e.g., "Lead Researcher", "Senior Developer")
   - **Image URL**: Path to their photo (e.g., `/images/team/photo.jpg`)
   - **Description**: Brief description of their responsibilities

3. Click **"Save"** to add the member
4. The member will immediately appear on the About page

### Editing Team Members

1. Click the **"Edit"** button on any team member card
2. Modify the fields as needed
3. Click **"Save"** to update, or **"Cancel"** to discard changes

### Deleting Team Members

1. Click the **"Delete"** button on any team member card
2. Confirm the deletion in the popup dialog
3. The member will be removed from the About page

## Adding Team Photos

### Option 1: Using Public Folder
1. Place team photos in `/public/images/team/` directory
2. In the admin panel, set the image URL to `/images/team/filename.jpg`
3. The photo will be displayed automatically

### Option 2: Using External URLs
1. Upload photos to a hosting service (e.g., Imgur, Cloudinary)
2. Copy the direct image URL
3. Paste the URL in the "Image URL" field

### Image Requirements
- **Format**: JPG, PNG, WebP
- **Recommended size**: 400x400px or larger (square aspect ratio works best)
- **File size**: Keep under 500KB for fast loading

## Default Team Members

The system comes with 3 placeholder team members:
- Team Member 1 (Lead Researcher)
- Team Member 2 (Senior Developer)
- Team Member 3 (Full Stack Developer)

Replace these with actual team information through the admin panel.

## Data Persistence

- Team member data is stored in **localStorage** (key: `mati-team-data:v1`)
- Data persists across browser sessions
- To reset to defaults, clear browser localStorage or use the admin reset function

## Display on About Page

Team members are displayed in a professional 3-column grid (responsive):
- **Desktop**: 3 columns
- **Tablet**: 2 columns  
- **Mobile**: 1 column

Each card features:
- Large photo container (placeholder with initials if no photo)
- Gradient background
- Name and role badge
- Brief description
- Hover effects with shadow and lift animation

## Tips

1. **Use high-quality photos**: Clear, professional headshots work best
2. **Keep descriptions concise**: 1-2 sentences per team member
3. **Consistent role naming**: Use standard titles for clarity
4. **Update regularly**: Keep team information current as people join/leave

## Troubleshooting

**Photo not displaying?**
- Check the URL is correct and accessible
- Verify the image file exists at the specified path
- Check browser console for loading errors

**Changes not appearing?**
- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache if needed

**Lost team data?**
- Check if localStorage was cleared
- Re-add team members through the admin panel
