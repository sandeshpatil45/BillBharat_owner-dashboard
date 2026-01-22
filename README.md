# BillBharat Owner Dashboard

A professional, desktop-first web application for BillBharat administrators to manage customers, subscriptions, sales, and business insights.

## 🎯 Overview

This dashboard is designed exclusively for **OWNER**, **ADMIN**, and **COORDINATOR** roles to:
- Monitor business health at a glance
- Track customers and subscriptions
- View sales performance
- Access business reports and analytics
- Manage hardware installations (coming soon)

## 🛠️ Tech Stack

- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Date Handling**: dayjs
- **Form Handling**: React Hook Form

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running (from vishal2006/hisab-kitab-BE-v1)

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

See `.env.example` for reference.

### 3. Run the development server

```bash
npm run dev
```

The application will be available at http://localhost:5173

### 4. Build for production

```bash
npm run build
```

## 📊 Features

- **Dashboard**: KPI cards, customer growth chart, pie charts
- **Customers**: Searchable/filterable table with CSV export
- **Subscriptions**: Track subscription status with row highlighting
- **Sales**: Sales team performance metrics
- **Hardware**: Future-ready placeholder
- **Reports**: Revenue and business analytics
- **Settings**: Profile and password management

## 🔐 Authentication

Supports OWNER, ADMIN, and COORDINATOR roles only. Other roles are denied access.

## 📄 License

Proprietary - BillBharat
