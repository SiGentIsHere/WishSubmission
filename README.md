# 🎂 Birthday Wishes Submission

**Share this link with friends to send birthday wishes to Cheata!**

---

## 🎯 Purpose

This is the **submission page** where friends can:
- ✅ Write a personalized birthday message
- ✅ Add their name
- ✅ Upload an optional photo
- ✅ See a live preview of their card
- ✅ Submit their wish to Cheata

---

## 🌐 Live URL

After deploying to GitHub Pages, share this URL with friends:

```
https://SiGentIsHere.github.io/birthday-submit/
```

---

## 📱 Features

### ✨ Real-time Preview
- See your card update as you type
- Preview shows exactly how Cheata will see it
- Photo preview before uploading

### 📸 Photo Upload
- Optional image upload
- Max 5MB file size
- Supports JPG, PNG, GIF
- Validates file before upload

### 🎨 Beautiful Design
- Vintage birthday card aesthetic
- Mobile-first responsive design (optimized for portrait phones)
- Smooth animations and transitions
- Easy-to-use interface

### ✅ Validation
- Name required (minimum 2 characters)
- Message required (minimum 10 characters)
- Image validation (size and type)
- Clear error messages

---

## 🗄️ Database

Submissions are stored in Supabase:
- **Table**: `birthday_wishes`
- **Storage**: `birthday-images` bucket
- **Security**: Public read/create only
- **100% Free**: No credit card required

---

## 🚀 Deployment

### Quick Deploy to GitHub Pages:

```bash
cd submission
git init
git add .
git commit -m "Birthday wishes submission site for Cheata"
git branch -M main
git remote add origin https://github.com/SiGentIsHere/birthday-submit.git
git push -u origin main
```

Then:
1. Go to repository settings
2. Pages → Source: `main` branch
3. Save
4. Wait 2 minutes
5. Share the URL with friends!

---

## 📁 Files in This Folder

```
submission/
├── index.html          - Submission form page
├── style.css           - Complete styles (mobile-first)
├── app.js              - Form submission logic
├── supabase-config.js  - Database configuration
├── .gitignore          - Git ignore rules
├── README.md           - This file
└── image/
    ├── header.png      - Birthday header image
    └── background.png  - Page background
```

---

## 🎨 Customization

To change the birthday person's name:
1. Open `index.html`
2. Find `<span id="cardFriendName">CHEATA</span>`
3. Replace with desired name
4. Also update in `app.js` where it says `friend_name: 'Cheata'`

---

## 🔧 How It Works

1. **Friend visits the page** → Sees submission form
2. **Fills in name and message** → Live preview updates
3. **Uploads photo (optional)** → Image validated and previewed
4. **Clicks submit** → Form validates all fields
5. **Image uploads** → Stored in Supabase Storage
6. **Wish saves** → Stored in Supabase database
7. **Success message** → Form resets automatically
8. **Cheata sees it** → On the view page instantly!

---

## 🆘 Troubleshooting

**Problem**: Form won't submit  
**Solution**: 
- Check browser console (F12) for errors
- Verify Supabase credentials in `supabase-config.js`
- Ensure internet connection is active

**Problem**: Image upload fails  
**Solution**: 
- Check file size (<5MB)
- Use JPG, PNG, or GIF format
- Ensure Supabase storage bucket `birthday-images` exists

**Problem**: Preview not updating  
**Solution**: 
- Make sure JavaScript is enabled in browser
- Check console for errors
- Try refreshing the page

**Problem**: "Supabase not loaded" error  
**Solution**: 
- Verify `supabase-config.js` file exists
- Check that file contains valid credentials
- Ensure file is loaded before `app.js`

---

## 🔗 Related

- **View wishes page**: See `../view-wishes/` folder
- **Deployment guide**: See `../DEPLOYMENT_GUIDE.md`
- **Supabase setup**: See `../SUPABASE_SETUP.md`
- **Project overview**: See `../PROJECT_COMPLETE.md`

---

## 📊 Technical Stack

- **Frontend**: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL + Storage)
- **Hosting**: GitHub Pages (free)
- **CDN**: Supabase JS SDK v2

---

## 📞 Support

For issues or questions:
1. Check browser console for errors (F12)
2. Verify Supabase credentials in `supabase-config.js`
3. Ensure database table and storage bucket exist
4. Test with a different browser

---

## ✅ Pre-Deployment Checklist

Before pushing to GitHub:

- [ ] All files present (index.html, app.js, style.css, etc.)
- [ ] Images exist in `image/` folder
- [ ] Supabase credentials configured
- [ ] Tested locally (form submits successfully)
- [ ] Mobile view tested (responsive design)
- [ ] No console errors when testing

---

**Made with ❤️ for Cheata's Birthday!** 🎉

**Share this page with all friends who want to send birthday wishes!**
