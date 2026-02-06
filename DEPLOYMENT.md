# Sri Kanakadurga Nursery - Deployment Guide

## Vercel Deployment

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New Project"
4. Import your repository
5. Vercel will auto-detect the settings from `vercel.json`

### Step 3: Configure Environment Variables
In Vercel Dashboard > Settings > Environment Variables, add:

#### Required Variables:
| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Measurement ID |
| `VITE_IMAGEKIT_PUBLIC_KEY` | ImageKit Public Key |
| `VITE_IMAGEKIT_URL_ENDPOINT` | ImageKit URL Endpoint |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit Public Key (for API) |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit Private Key (for API) |

### Step 4: Deploy
Click "Deploy" and Vercel will build and deploy your site.

## Current Configuration Values

### Firebase (already configured):
- Project ID: `srikanakadurga-nursery`
- Auth Domain: `srikanakadurga-nursery.firebaseapp.com`

### ImageKit (already configured):
- URL Endpoint: `https://ik.imagekit.io/vvkwy0zte`
- Public Key: `public_u4RMvhnxcY+obKITfeCIpskSxPM=`
- Private Key: `private_CBO/uXE82pXkbzExkwC+uGJ8n34=`

## Local Development

```bash
# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
├── api/                    # Vercel serverless functions
│   └── imagekit-auth.ts    # ImageKit authentication endpoint
├── client/                 # React frontend
│   └── src/
│       ├── admin/          # Admin panel pages
│       ├── components/     # Reusable components
│       ├── pages/          # Public pages
│       └── lib/            # Utilities & configs
├── server/                 # Express backend (for local dev)
├── dist/                   # Build output
├── vercel.json            # Vercel configuration
└── .env.example           # Environment variables template
```

## Features

- 🌿 E-commerce plant shop
- 📝 Blog with rich content editor
- 🔐 Firebase Authentication
- 📸 ImageKit image uploads
- 📱 Fully responsive design
- 🎨 Admin panel for content management
