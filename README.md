# 🔗 SHIVA SCM — Supply Chain Management Platform

> **Developed by Shiva Consultancy Group** | [www.shivagroup.org.in](http://www.shivagroup.org.in)
> Co-Founder & Mentor: **Rakesh Jha** | rksjha@live.in | +91 9979021275

---

## 📌 Overview

**SHIVA SCM** is a comprehensive, enterprise-grade Supply Chain Management portal built for Shiva Consultancy Group. It digitises and centralises the entire supply chain lifecycle — from raw material manufacturers to end clients — with full traceability, verified entity IDs, and real-time tracking for **any product type**.

Inspired by real-world challenges in India's construction material and MSME supply chains (as analysed in the M-Mart Ventures market study), SHIVA SCM solves the core problems of:

- ❌ **Supplier Mistrust** → ✅ Verification workflow with ratings
- ❌ **Price Opacity** → ✅ Real-time price tracker with history
- ❌ **Information Asymmetry** → ✅ Centralised entity database
- ❌ **Manual Inefficiency** → ✅ Digital order & shipment management

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              SHIVA SCM PLATFORM             │
├─────────────────┬───────────────────────────┤
│   FRONTEND      │   BACKEND                 │
│   React 18      │   Node.js + Express       │
│   Vite 5        │   Sequelize ORM           │
│   React Router  │   JWT Authentication      │
│   Recharts      │   Role-based Access       │
│   Lucide Icons  │   RESTful API             │
└─────────────────┴────────────┬──────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   PostgreSQL 15     │
                    │   (via Docker)      │
                    └─────────────────────┘
```

### Supply Chain Flow

```
MANUFACTURER → SUPPLIER → WHOLESALER → RETAILER → CLIENT
   MFG-ID       SUP-ID      WSL-ID      RTL-ID     CLT-ID
```

---

## ✨ Features

### 🔑 Authentication & Security
- JWT-based authentication (7-day token expiry)
- Role-based access control: **Admin** / **Manager** / **Viewer**
- Password hashing with bcryptjs
- Rate limiting (100 req/15 min per IP)
- Helmet.js security headers

### 🏭 Supply Chain Entities (all with unique IDs)

| Entity | ID Format | Features |
|--------|-----------|----------|
| Manufacturer | `MFG-2025-0001` | Verification, rating, production capacity, quality certs |
| Supplier | `SUP-2025-0001` | Type (primary/secondary/spot), credit terms |
| Wholesaler | `WSL-2025-0001` | Warehouse locations, storage capacity |
| Retailer | `RTL-2025-0001` | Store type (physical/online/both) |
| Client | `CLT-2025-0001` | Loyalty tiers (Bronze/Silver/Gold/Platinum) |
| Product | `PRD-2025-0001` | GST rates, HSN codes, stock tracking |
| Order | `ORD-2025-0001` | 7-stage status workflow, multi-entity support |
| Shipment | `SHP-2025-0001` | Real-time tracking timeline |
| Category | `CAT-2025-0001` | Hierarchical product categories |

### 📊 Dashboard & Analytics
- Real-time KPI cards (entities count, revenue, pending orders)
- 12-month revenue bar chart
- Order status donut chart
- Top products by order volume
- Supply chain flow visualisation
- Supply chain health metrics table

### 📦 Order Management
- Purchase / Sales / Transfer orders
- 7-stage status: `draft → confirmed → processing → dispatched → in_transit → delivered`
- Line item management with automatic tax calculation
- Payment status tracking (pending/partial/paid/overdue)

### 🚛 Shipment Tracking
- Full tracking timeline with status history
- Driver & vehicle information
- Route origin/destination tracking
- Real-time status updates

### 💰 Price Tracker
- Historical price chart (Base Price vs MRP)
- Region-specific pricing
- Price change reason logging
- Trend analysis (% change)

### 📋 Reports
- Revenue by month (bar chart)
- Order status distribution (pie chart)
- Top products by volume (horizontal bar)
- Supply chain health scorecard (on-time delivery, fill rate, cycle time)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (recommended)
- OR PostgreSQL 15 locally

### Option 1: Docker (Recommended)

```bash
git clone https://github.com/YOUR_USERNAME/SHIVA-SCM.git
cd SHIVA-SCM

# Start all services (DB + Backend + Frontend)
docker-compose up -d

# Seed the database with demo data
docker exec shiva_scm_backend npm run seed

# Access at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
```

### Option 2: Manual Setup

#### Step 1 — Database
```bash
# Using Docker for just PostgreSQL:
docker run -d \
  --name shiva_scm_db \
  -e POSTGRES_DB=shiva_scm \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=shivascm2025 \
  -p 5432:5432 \
  postgres:15-alpine
```

#### Step 2 — Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run seed    # Load demo data
npm run dev     # Start on port 5000
```

#### Step 3 — Frontend
```bash
cd frontend
npm install
npm run dev     # Start on port 5173
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@shivascm.com | admin123 |
| **Manager** | manager@shivascm.com | manager123 |

> ⚠️ Change these credentials before any production deployment.

---

## 🌐 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email & password |
| POST | `/api/auth/register` | Register new user (admin only) |
| GET | `/api/auth/me` | Get current user profile |

### Supply Chain Entities
All entity endpoints follow this pattern:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manufacturers` | List with pagination, search, filter |
| POST | `/api/manufacturers` | Create new (auto-generates MFG ID) |
| GET | `/api/manufacturers/:id` | Get by ID |
| PUT | `/api/manufacturers/:id` | Update |
| DELETE | `/api/manufacturers/:id` | Soft delete |
| PATCH | `/api/manufacturers/:id/verify` | Mark as verified |

*(Same pattern for `/suppliers`, `/wholesalers`, `/retailers`, `/clients`)*

### Products & Pricing
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| POST | `/api/products` | Create product (auto PRD ID) |
| GET | `/api/products/low-stock` | Products below reorder level |
| GET | `/api/products/:id/price-history` | Price history |
| POST | `/api/products/:id/update-price` | Update price (saves history) |

### Orders & Shipments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create order (auto ORD ID) |
| PATCH | `/api/orders/:id/status` | Update order status |
| GET | `/api/shipments` | List shipments |
| POST | `/api/shipments` | Create shipment (auto SHP ID) |
| POST | `/api/shipments/:id/tracking` | Add tracking event |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | All KPI counts |
| GET | `/api/dashboard/revenue-chart` | Monthly revenue data |
| GET | `/api/dashboard/order-status` | Status distribution |
| GET | `/api/dashboard/top-products` | Top 10 products |
| GET | `/api/dashboard/supply-chain-flow` | Entity counts for flow |
| GET | `/api/dashboard/recent-activity` | Last 20 events |

---

## 🗄️ Database Schema

### Key Models & Relationships

```
Category ──< Product >── Manufacturer
                │
              Order
              / | \
       Buyer    │   Seller
      (Client/  │   (Mfg/Sup/
       RTL/WSL) │    WSL/RTL)
                │
            OrderItem >── Product
                │
            Shipment
                │
          PriceHistory >── Product
```

### Environment Variables (`backend/.env`)

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# PostgreSQL
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shiva_scm
DB_USER=postgres
DB_PASSWORD=your_password
```

---

## 📂 Project Structure

```
SHIVA-SCM/
├── backend/
│   ├── src/
│   │   ├── config/database.js        # Sequelize + PostgreSQL config
│   │   ├── models/                   # 12 Sequelize models
│   │   │   ├── User.js
│   │   │   ├── Manufacturer.js       # MFG-YYYY-XXXX IDs
│   │   │   ├── Supplier.js           # SUP-YYYY-XXXX IDs
│   │   │   ├── Wholesaler.js         # WSL-YYYY-XXXX IDs
│   │   │   ├── Retailer.js           # RTL-YYYY-XXXX IDs
│   │   │   ├── Client.js             # CLT-YYYY-XXXX IDs
│   │   │   ├── Product.js            # PRD-YYYY-XXXX IDs
│   │   │   ├── Category.js
│   │   │   ├── Order.js              # ORD-YYYY-XXXX IDs
│   │   │   ├── OrderItem.js
│   │   │   ├── Shipment.js           # SHP-YYYY-XXXX IDs
│   │   │   └── PriceHistory.js
│   │   ├── controllers/              # 11 controllers
│   │   ├── routes/                   # 11 route files
│   │   ├── middleware/               # auth, error, validate
│   │   ├── utils/idGenerator.js      # Auto ID generation
│   │   └── seeders/seed.js           # Full demo dataset
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/                    # 14 full page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Manufacturers.jsx
│   │   │   ├── Suppliers.jsx
│   │   │   ├── Wholesalers.jsx
│   │   │   ├── Retailers.jsx
│   │   │   ├── Clients.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── PriceTracker.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Shipments.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Users.jsx
│   │   │   └── Login.jsx
│   │   ├── components/
│   │   │   ├── layout/              # Sidebar, Header, Layout
│   │   │   └── common/              # DataTable, Modal, Badge, StatsCard
│   │   ├── context/                 # AuthContext, AppContext
│   │   ├── utils/api.js             # Axios + all API methods
│   │   ├── utils/helpers.js         # formatCurrency, formatDate, etc.
│   │   └── styles/                  # CSS design system (teal/navy theme)
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#00b4a0` | Teal — buttons, links, active states |
| `--secondary` | `#1a2332` | Dark navy — sidebar, headers |
| `--accent` | `#f59e0b` | Amber — warnings, highlights |
| `--success` | `#10b981` | Green — positive status |
| `--danger` | `#ef4444` | Red — errors, delete actions |
| `--bg-primary` | `#f0f4f8` | Light blue-grey background |

---

## 🏢 About Shiva Consultancy Group

SHIVA SCM is developed and maintained by **Shiva Consultancy Group**, a premium advisory firm delivering personalised, research-backed consultancy across:

- Capital Advisory & Project Finance
- Legal & Enforcement Advisory
- ESG, Sustainability & Environmental Advisory
- MSME, Startup & Growth Ecosystems
- Agribusiness & Renewable Energy

**Rakesh Jha** — Co-Founder & Mentor
📧 rksjha@live.in | 📱 +91 9979021275
🌐 [www.shivagroup.org.in](http://www.shivagroup.org.in)
📍 SF 34, 4D Square Mall, Motera, Ahmedabad 380005, India

---

## 📄 License

© 2025 Shiva Consultancy Group. All rights reserved.
This software is proprietary and confidential. Unauthorised copying, distribution, or use is strictly prohibited.
