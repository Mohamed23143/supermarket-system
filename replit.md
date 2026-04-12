# Supermarket Management System

## Overview

A professional full-stack Supermarket Management System built with React (Vite) + Express + PostgreSQL. Supports Arabic (RTL) as the primary language with English content fallback.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + framer-motion
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Routing**: wouter (frontend)

## Features

### Phase 1 (Complete)
- **Dashboard** (`/`) — Overview with key metrics, inventory value, stock alerts, and category breakdown
- **Inventory** (`/inventory`) — Full product table with search, category filter, add/edit/delete, RTL support

### Phase 2 (Complete)
- **POS** (`/pos`) — Full split-layout Point of Sale: product grid with search/filter, cart with qty controls and price editing, 15% Saudi VAT calculation, sale completion with stock deduction, receipt modal with thermal print (80mm) support
- **Reports** (`/reports`) — Sales history with summary cards (total revenue, transaction count, VAT), invoice table, receipt view and reprint functionality
- **Settings** (`/settings`) — Dark mode toggle

### Database Schema
- `categories` table: id, name, nameAr, color
- `products` table: id, name, nameAr, category, price, stockQuantity, barcode, minStockLevel, createdAt, updatedAt

### API Endpoints
- `GET /api/products` — list with search/category/lowStock filters
- `POST /api/products` — create product
- `GET /api/products/:id` — get product
- `PUT /api/products/:id` — update product
- `DELETE /api/products/:id` — delete product
- `GET /api/products/stats/summary` — dashboard stats
- `GET /api/categories` — list categories
- `POST /api/categories` — create category

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Architecture

```
artifacts/
  supermarket/    # React + Vite frontend (served at /)
    src/
      pages/      # dashboard, inventory, pos, reports, settings
      components/ # layout (sidebar), ui (shadcn)
  api-server/     # Express API server (served at /api)
    src/
      routes/     # health, products, categories
lib/
  api-spec/       # OpenAPI spec (source of truth)
  api-client-react/ # Generated React Query hooks
  api-zod/        # Generated Zod schemas
  db/             # Drizzle ORM schema + connection
    src/schema/
      products.ts # categories and products tables
```
