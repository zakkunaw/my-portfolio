# 📚 Portfolio Admin Panel - Setup Guide

## 🚀 Quick Start

1. **Edit Your Portfolio**

   - Open `admin-panel.html` in your browser
   - Update your profile, add projects and products
   - Data saves automatically in localStorage

2. **Preview Your Portfolio**
   - Open `index.html` to see your portfolio
   - Navigate through different pages
   - All data loads dynamically

## 💾 Database Options

### Option 1: localStorage (Current - Best for Demo)

✅ **Pros:**

- No backend needed
- Works offline
- Perfect for GitHub Pages
- Instant updates

❌ **Cons:**

- Data stored in browser only
- Need to export/import for backup

### Option 2: JSON File (Recommended for GitHub)

```javascript
// Add this to your HTML files to load from JSON:
fetch("data.json")
  .then((r) => r.json())
  .then((data) => {
    // Use the data
  });
```

### Option 3: Firebase (Advanced)

For real database with sync across devices:

1. Create Firebase project
2. Add Firebase SDK
3. Update admin panel to use Firestore

## 📤 Deploy to GitHub Pages

### Step 1: Export Your Data

1. Open `admin-panel.html`
2. Go to "Data" tab
3. Click "Download JSON"
4. Save as `portfolio-data.json`

### Step 2: Setup GitHub Repository

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/USERNAME/portfolio.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to repository Settings
2. Pages → Source → main branch
3. Save
4. Visit: `https://USERNAME.github.io/portfolio`

### Step 4: Load Data from JSON (Optional)

Update each HTML file to load from JSON instead of localStorage:

```javascript
// Add this script to index.html, projects.html, etc.
<script>
async function loadFromJSON() {
  try {
    const response = await fetch('portfolio-data.json');
    const data = await response.json();
    // Use data to populate page
  } catch (error) {
    console.log('Using default data');
  }
}
loadFromJSON();
</script>
```

## 📁 File Structure

```
portfolio/
├── index.html              # Home page (profile + featured projects)
├── projects.html           # All projects list
├── project-detail.html     # Individual project page
├── products.html           # Products showcase
├── hire.html              # Contact form
├── admin-panel.html       # Admin dashboard (NEW!)
├── admin-script.js        # Admin logic (NEW!)
├── portfolio-data.json    # Data backup (export from admin)
└── README.md              # Documentation
```

## 🎨 Admin Panel Features

### Profile Management

- Full name, job title, bio
- Email and avatar
- Availability status

### Projects CRUD

- ✅ Create new projects
- ✅ Edit existing projects
- ✅ Delete projects
- ✅ Custom colors and links

### Products CRUD

- ✅ Add products
- ✅ Edit products
- ✅ Delete products
- ✅ Tags and categories

### Data Management

- 📥 Export to JSON
- 📤 Import from JSON
- 🔄 Reset to defaults

## 🔒 Security Tips

1. **For Production:**

   - Don't expose admin panel publicly
   - Rename `admin-panel.html` to something secret
   - Add password protection

2. **For GitHub Pages:**
   - Use environment variables for sensitive data
   - Consider GitHub Actions for automated deployment
   - Use `.gitignore` for sensitive files

## 🛠️ Customization

### Add New Fields to Profile

1. Edit `admin-panel.html` - add input field
2. Edit `admin-script.js` - update `defaultData.profile`
3. Edit `index.html` - add display element with ID
4. Update loading script to populate new field

### Add More Pages

1. Create new HTML file
2. Copy navbar from existing page
3. Add dynamic loading script
4. Link from navigation

## 📝 Data Structure

```json
{
  "profile": {
    "fullName": "Your Name",
    "jobTitle": "Your Title",
    "bio": "Your bio...",
    "email": "you@example.com",
    "avatarUrl": "https://...",
    "availableForWork": true
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "Short description",
      "color": "#7c3aed",
      "link": "project-detail.html"
    }
  ],
  "products": [
    {
      "name": "Product Name",
      "tag": "CATEGORY",
      "color": "#6366f1",
      "link": "https://..."
    }
  ]
}
```

## 🐛 Troubleshooting

**Data not showing?**

- Check browser console for errors
- Verify localStorage has data: `localStorage.getItem('portfolioData')`
- Try importing data again

**Admin panel not working?**

- Ensure `admin-script.js` is in same folder
- Check browser console
- Clear cache and reload

**GitHub Pages not updating?**

- Wait 5-10 minutes for deployment
- Check GitHub Actions tab
- Clear browser cache

## 🎯 Next Steps

1. ✅ Fill in your profile data
2. ✅ Add your real projects
3. ✅ Add your products
4. ✅ Export data as backup
5. ✅ Deploy to GitHub Pages
6. ✅ Share your portfolio link!

## 📧 Support

For issues or questions:

- Check documentation
- Review console errors
- Export/import data as backup

---

**Made with ❤️ using Tailwind CSS**
