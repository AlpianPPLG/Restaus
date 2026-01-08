# 📝 RESTAUS - Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Receipt PDF generation
- Dark mode toggle UI
- User management CRUD
- Advanced reports

## [0.3.0] - 2026-01-08

### Added - UI Implementation (Phase 2)

#### Waiter App (`/waiter`)
- **Dashboard**: Real-time table grid showing availability, occupancy, and warnings.
- **Table Card**: Visual indicators for status, order duration, and payment warnings.
- **Order Creation**: Full menu catalog with category filtering and search.
- **Cart System**: Client-side cart with quantity adjustment and special notes.

#### Kitchen Display System (`/kitchen`)
- **Order Queue**: Grid view of active orders sorted by time.
- **Kitchen Card**: Detailed order card showing items, quantities, and elapsed time.
- **Status Updates**: One-click actions to mark items as 'cooking' or 'served'.
- **Late Indicators**: Visual alerts for orders waiting longer than 20 mins.

#### Cashier App (`/cashier`)
- **Split View Dashboard**: Pending order list on left, payment form on right.
- **Payment Processing**: Support for Cash, QRIS, and Debit.
- **Smart Calculation**: Automatic change calculation and shortage detection.
- **Quick Amounts**: Preset buttons for fast cash input.

#### Admin Dashboard (`/admin`)
- **Overview**: Statistics cards for Revenue, Orders, Occupancy, and Warnings.
- **Sales Chart**: Weekly sales performance visualization.
- **Menu Management**: Data table with search, filter, and stock indicators.
- **Layout**: Dedicated admin sidebar navigation.

### Improved
- **Components**: Added `StatusBadge`, `TableCard`, `MenuItemCard`, `OrderSummaryCard`.
- **Navigation**: Role-based redirection and dashboard layouts.
- **Feedback**: Comprehensive toast notifications for all major actions.

## [0.2.0] - 2026-01-08

### Added - Foundation & Backend (Phase 1)
- Core Infrastructure (Types, Constants, DB, API Client)
- Authentication System & Middleware
- Database Schema & Seed Data
- All API Endpoints (Auth, Tables, Menus, Orders, Payments)
- State Management Hooks (React Query)
- Login Page & Providers

## [0.1.0] - 2026-01-07
- Initial Project Setup
