# RS Refurbished Laptops & Services — 24/7 Permanent Cloud Deployment Guide

This guide explains how to host your website permanently on the cloud so it runs **24/7 on any mobile phone or computer on any network (4G, 5G, Wi-Fi)**, even when your laptop is turned off or asleep.

---

## ⚡ Current Status
- **Instant Tunnel (Live Right Now):**  
  👉 **`https://clan-ending-best-dental.trycloudflare.com`**  
  *(Works right now on any phone anywhere in India or the world while your laptop is running)*
- **Git Repository:** Initialized and committed on `main` branch with all updated business details:
  - 1-Month Testing Warranty
  - Zero GSTIN / No Tax
  - Address: Sant Tukaram Nagar, Pimpri, Pune 411018, Maharashtra
  - Email: `sales@rsrefurbishedlaptops.com`
  - Helpline: `+91 8668848486`

---

## 🌟 Method 1: Render.com (Recommended — 100% Free & Full Database Support)

Render is the best platform for your website because it natively supports **Node.js + Express backend + Persistent JSON Database (`data/rs_refurbished_database.json`)**, so all customer orders, repair tickets, and catalog updates work permanently.

### Step 1: Create a Free GitHub Repository
1. Open [https://github.com/new](https://github.com/new) in your browser.
2. Enter repository name: `rs-refurbished-laptops`.
3. Set to **Public** or **Private**.
4. Leave all checkboxes (README, .gitignore) **unchecked**.
5. Click **Create repository**.
6. Copy the repository URL (e.g., `https://github.com/<your-username>/rs-refurbished-laptops.git`).

### Step 2: Push Your Project to GitHub (1-Click)
1. Double-click the file in your folder:  
   👉 **`Deploy-To-GitHub.bat`**
2. Paste your GitHub repository URL and press Enter.
3. Your code is instantly uploaded to GitHub!

### Step 3: Deploy on Render (Free)
1. Go to [https://dashboard.render.com](https://dashboard.render.com) and log in (or sign up with GitHub).
2. Click **New +** (top right) $\rightarrow$ **Web Service**.
3. Select your `rs-refurbished-laptops` repository.
4. Render will automatically detect [`render.yaml`](file:///c:/Users/DELL/.gemini/antigravity/scratch/rs-refurbished-laptops/render.yaml):
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node server.js`
   - **Plan:** `Free`
5. Click **Create Web Service**.

Within 2 minutes, Render will assign you a permanent 24/7 public address:
👉 **`https://rs-refurbished-laptops.onrender.com`**

---

## 🚀 Method 2: Vercel (Fast Frontend CDN)

If you have a Vercel account or want an immediate deployment:

1. Open PowerShell or Command Prompt in this folder.
2. Run:
   ```powershell
   npx vercel
   ```
3. Follow the 3 prompts:
   - *Set up and deploy?* $\rightarrow$ **Y**
   - *Which scope?* $\rightarrow$ Select your account
   - *Link to existing project?* $\rightarrow$ **N**
4. Vercel will instantly publish your site to a permanent `https://*.vercel.app` URL.

---

## 🌐 Linking Your Custom Domain (`rsrefurbishedlaptops.com`)

Once deployed on Render or Vercel:
1. Go to your service dashboard $\rightarrow$ **Settings** $\rightarrow$ **Custom Domains**.
2. Add `rsrefurbishedlaptops.com` and `www.rsrefurbishedlaptops.com`.
3. Add the two DNS records (CNAME and A-record) provided by Render/Vercel into your domain registrar (GoDaddy, Namecheap, Hostinger, etc.).
4. Your website will be live worldwide on **`https://rsrefurbishedlaptops.com`** with free automatic SSL certificates!
