# RS Refurbished Laptops & Services — Full-Stack Web Platform

A production-ready, fully functional web platform for **RS Refurbished Laptops & Services** built with **React 18**, **Tailwind CSS**, **Lucide Icons**, **Express.js**, and persistent **Database Backend**.

- **Official Helpline**: `+91 8668848486` / `8668848486`
- **WhatsApp Support**: Directly configured with direct order dispatch on `8668848486`.

---

## 🚀 Quick Start (Local Run)

### 1. Install Dependencies
```bash
npm.cmd install
```

### 2. Run Full-Stack Database Server (Production Mode)
```bash
npm.cmd start
```
> Server runs on **http://localhost:5000** serving both the REST API and the React frontend.

### 3. Run Development Server (with Hot Reload)
```bash
npm.cmd run dev
```
> Runs Vite on **http://localhost:3000** with auto-proxying to the database server on port 5000.

---

## 🌟 Key Features

1. **Multi-Criteria Smart Laptop Filtering**:
   - Filter by **Price Slider** and quick budget presets (Under ₹20,000, ₹20k-₹30k, ₹30k-₹45k, Above ₹45,000).
   - Filter by **Brand**: Dell, Lenovo ThinkPad, Apple MacBook, HP EliteBook, Asus, Acer.
   - Filter by **Hardware Specs**: Processor (i3, i5, i7, M1), RAM (8GB, 16GB, 32GB), SSD (256GB, 512GB, 1TB), Screen Size (13.3", 14.0", 15.6"), and Condition Grade (Grade A+, Grade A).
   - Instant live search & real-time sorting.
   - Side-by-side spec comparison table for up to 3 laptops.

2. **Full-Stack Database Persistence**:
   - Persistent database stored in `data/rs_refurbished_database.json`.
   - REST API endpoints for Laptops inventory (`/api/laptops`), Corporate Leads (`/api/inquiries`), and Repair tickets (`/api/services`).
   - Hybrid client fallback: Works online with backend server or offline with LocalStorage.

3. **Corporate B2B & Industrial IT Solutions**:
   - Bulk procurement with 18% GST Input Tax Credit (ITC).
   - Workstation & laptop monthly rentals starting at ₹1,299/month.
   - Interactive Corporate Bulk Quote Form.

4. **Laptop Repair & Diagnostic Center**:
   - Chip-level motherboard repair, screen replacement, 10x RAM/SSD speed boost, thermal servicing.
   - Online repair ticket booking with doorstep pickup or store visit.

5. **Protected Admin Management Portal**:
   - **Passcode**: `admin123` (or click "Auto-Fill" on modal).
   - **Inventory Manager**: Add new laptops, edit pricing/stock counts, toggle stock status, and delete items.
   - **Quote Leads Manager**: Manage incoming customer and corporate quote requests with status tracking (`Pending`, `Contacted`, `Completed`) and direct WhatsApp triggers.
   - **Service Tickets Manager**: Track repair tickets and update diagnostics status.
   - **Data Backup & Reset**: Export inventory as JSON or reset to factory demo data with 1-click.

6. **Quote Tray & 1-Click WhatsApp Order**:
   - Build custom quotation trays with optional RAM/SSD upgrades and send pre-formatted order directly to WhatsApp (`+91 8668848486`).

---

## 📦 How to Publish / Deploy to the Web

### Option A: 1-Click Deploy on Render (Recommended for Full-Stack)
1. Push this folder to a GitHub repository.
2. Go to [render.com](https://render.com) and click **New Web Service**.
3. Select your repository. Render will automatically detect `render.yaml` with:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
4. Click **Deploy**! Your site is live on your custom domain or `.onrender.com`.

### Option B: Deploy on Vercel
1. Run `npm run build`.
2. Connect your repository to [vercel.com](https://vercel.com).
3. The included `vercel.json` will automatically configure routing.

### Option C: Deploy on Any VPS / cPanel / Ubuntu Server
1. Upload project files to your server.
2. Run:
   ```bash
   npm install
   npm run build
   npm start
   ```
3. Use PM2 for continuous background execution:
   ```bash
   pm2 start server.js --name "rs-refurbished"
   ```
