# 🎨 Modern Portfolio Website

A beautiful, fully customizable portfolio website with admin panel built with Tailwind CSS.

![Portfolio Screenshot](https://img.shields.io/badge/Status-Ready%20to%20Deploy-brightgreen)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![No Backend](https://img.shields.io/badge/Backend-None%20Required-orange)

## ✨ Features

- 📱 **Fully Responsive** - Works on all devices
- 🎛️ **Admin Panel** - Easy content management without coding
- 💾 **No Backend Needed** - All data stored in localStorage
- 📤 **Export/Import** - Backup and restore your data as JSON
- 🚀 **GitHub Pages Ready** - Deploy in minutes
- 🎨 **Customizable** - Change colors, projects, and products
- ⚡ **Fast Loading** - Optimized with Tailwind CDN

## 📂 File Structure

```
portfolio/
├── index.html              # Home page (profile + featured projects)
├── projects.html           # All projects list
├── project-detail.html     # Individual project page
├── products.html           # Products showcase
├── hire.html              # Contact form
├── admin-panel.html       # Admin dashboard ⭐ NEW!
├── admin-script.js        # Admin logic
├── portfolio-data.json    # Sample data template
├── SETUP-GUIDE.md         # Detailed setup instructions
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Edit Your Portfolio

Open `admin-panel.html` in your browser - no server needed!

### 2. Update Your Information

- **Profile** tab → Edit name, bio, email, avatar
- **Projects** tab → Add/edit/delete projects
- **Products** tab → Manage digital products
- Data saves automatically

### 3. Preview Your Portfolio

Open `index.html` to see your portfolio live!

## 🌐 Deploy to GitHub Pages

### Step 1: Export Your Data

1. Open `admin-panel.html`
2. Go to "Data" tab
3. Click "Download JSON"

### Step 2: Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/USERNAME/portfolio.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Repository Settings → Pages
2. Source: `main` branch → Save
3. Visit: `https://USERNAME.github.io/portfolio`

### Step 4: Security

**Hide admin panel before deploying:**

```bash
# Option A: Delete admin files
git rm admin-panel.html admin-script.js
git commit -m "Remove admin for security"

# Option B: Add to .gitignore
echo "admin-panel.html" >> .gitignore
echo "admin-script.js" >> .gitignore
```

## 🎛️ Admin Panel Features

### Profile Management

- Full name, job title, bio
- Email and avatar URL
- Availability status toggle

### Projects CRUD

- ✅ Create, edit, delete projects
- 🎨 Custom colors and links

### Products CRUD

- ✅ Manage products
- 🏷️ Tags and categories

### Data Management

- 📥 Export to JSON
- 📤 Import from JSON
- 🔄 Reset to defaults

## 🐛 Troubleshooting

**Data not showing?**

- Check browser console (F12)
- Verify localStorage
- Try importing data

**Admin not working?**

- Ensure `admin-script.js` is in same folder
- Check console for errors
- Clear cache and reload

## 📚 Documentation

See **SETUP-GUIDE.md** for detailed instructions.

## 🎯 Next Steps

1. ✅ Fill in your data
2. ✅ Add real projects
3. ✅ Export backup
4. ✅ Deploy to GitHub
5. ✅ Share your link!

---

**Made with ❤️ using Tailwind CSS** 🌟
