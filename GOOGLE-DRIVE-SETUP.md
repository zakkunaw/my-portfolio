# Google Drive API Setup Guide

Panduan lengkap untuk mengintegrasikan Google Drive API dengan portfolio website untuk menyimpan media files (images/videos).

## Kenapa Google Drive?

- ✅ **Unlimited Storage** - Tidak ada batasan seperti localStorage (10MB)
- ✅ **File Size** - Support file sampai 100MB+ 
- ✅ **Gratis** - 15GB gratis dari Google
- ✅ **Reliable** - Infrastructure Google yang stabil
- ✅ **CDN** - Fast loading dari Google servers

## Prerequisites

- Google Account
- Google Cloud Console access

## Step-by-Step Setup

### 1. Buka Google Cloud Console

1. Pergi ke [Google Cloud Console](https://console.cloud.google.com/)
2. Login dengan Google Account kamu

### 2. Create Project Baru

1. Klik dropdown project di toolbar atas
2. Klik **"New Project"**
3. Nama project: `Portfolio Website` (atau nama lain)
4. Klik **"Create"**
5. Tunggu sampai project selesai dibuat

### 3. Enable Google Drive API

1. Di sidebar, pilih **"APIs & Services"** → **"Library"**
2. Search: `Google Drive API`
3. Klik **"Google Drive API"**
4. Klik **"Enable"**
5. Tunggu proses enable selesai

### 4. Create API Key

1. Di sidebar, pilih **"APIs & Services"** → **"Credentials"**
2. Klik **"Create Credentials"** → **"API Key"**
3. Copy API Key yang muncul
4. (Optional) Klik **"Restrict Key"** untuk keamanan:
   - Application restrictions: HTTP referrers
   - Website restrictions: Tambahkan domain kamu
   - API restrictions: Pilih "Google Drive API" saja
5. Klik **"Save"**

### 5. Create OAuth 2.0 Client ID

1. Di halaman Credentials yang sama
2. Klik **"Create Credentials"** → **"OAuth client ID"**
3. Jika diminta, setup OAuth consent screen dulu:
   - User Type: **External**
   - App name: `Portfolio Admin`
   - User support email: email kamu
   - Developer contact: email kamu
   - Scopes: Tambahkan `../auth/drive.file`
   - Test users: Tambahkan email kamu
   - Klik **"Save and Continue"**

4. Setelah consent screen setup, lanjut create OAuth client:
   - Application type: **Web application**
   - Name: `Portfolio Web App`
   - Authorized JavaScript origins:
     - `http://localhost` (untuk development)
     - `https://your-domain.com` (untuk production)
   - Authorized redirect URIs:
     - `http://localhost/oauth2callback`
     - `https://your-domain.com/oauth2callback`
   - Klik **"Create"**

5. Copy **Client ID** yang muncul

### 6. Configure Portfolio Admin Panel

1. Buka `admin-panel.html` di browser
2. Pergi ke tab **"Settings"**
3. Paste **API Key** dan **Client ID** yang sudah kamu copy
4. Klik **"Test Connection"** untuk verify setup
5. Jika sukses, klik **"Save Configuration"**

### 7. Test Upload

1. Pergi ke tab **"Projects"**
2. Klik **"Add Project"** atau edit project existing
3. Upload image atau video (max 100MB)
4. Klik **"Save Project"**
5. File akan otomatis diupload ke Google Drive
6. Check di Google Drive kamu, harusnya ada folder **"Portfolio Media"**

## Troubleshooting

### Error: "Access blocked: Authorization Error"

**Solusi:**
- Pastikan email kamu sudah ditambahkan sebagai Test User di OAuth consent screen
- Atau publish app ke Production (tapi perlu verification dari Google)

### Error: "Invalid API Key"

**Solusi:**
- Check API Key sudah benar
- Pastikan Google Drive API sudah di-enable
- Check API restrictions tidak terlalu ketat

### Error: "Redirect URI mismatch"

**Solusi:**
- Pastikan authorized redirect URI di OAuth client sesuai dengan URL yang kamu pakai
- Format: `http://localhost/oauth2callback` atau `https://domain.com/oauth2callback`

### File tidak muncul di project detail

**Solusi:**
- Check file permission di Google Drive (harusnya "Anyone with the link")
- Clear cache browser dan reload
- Check console browser untuk error messages

## Production Deployment

Saat deploy ke production (GitHub Pages, Netlify, Vercel, dll):

1. Update authorized JavaScript origins dengan domain production:
   ```
   https://username.github.io
   https://your-custom-domain.com
   ```

2. Update authorized redirect URIs:
   ```
   https://username.github.io/oauth2callback
   https://your-custom-domain.com/oauth2callback
   ```

3. Re-configure API Key dan Client ID di admin panel

## Security Best Practices

1. **API Key Restrictions**
   - Restrict API key hanya untuk domain kamu
   - Limit ke Google Drive API saja

2. **OAuth Consent Screen**
   - Gunakan External type untuk public access
   - Atau Internal jika hanya untuk organization kamu

3. **File Permissions**
   - Default: Anyone with link dapat view
   - Jangan share folder Portfolio Media secara public

## Alternative: IndexedDB Fallback

Jika tidak mau setup Google Drive, sistem tetap jalan dengan IndexedDB:

- ✅ Automatic fallback
- ✅ No configuration needed
- ❌ Limited storage (~50MB total)
- ❌ Data hilang jika clear browser data

## FAQ

**Q: Apakah harus bayar?**
A: Tidak, gratis 15GB dari Google Drive.

**Q: Apakah file saya aman?**
A: Ya, file tersimpan di Google Drive account kamu sendiri.

**Q: Bisa pakai untuk video besar?**
A: Ya, support sampai 100MB+ (limit bisa dinaikkan di code).

**Q: Bagaimana cara migrate dari IndexedDB ke Google Drive?**
A: Setup Google Drive API → Upload ulang projects dengan media baru.

**Q: Bisa ganti ke cloud storage lain?**
A: Ya, bisa modify `google-drive-config.js` untuk support AWS S3, Cloudinary, dll.

## Support

Jika ada masalah atau pertanyaan:
1. Check browser console untuk error messages
2. Verify API credentials di Google Cloud Console
3. Test connection di Settings tab
4. Check Google Drive API quota/limits

---

Made with ❤️ for Portfolio Website
