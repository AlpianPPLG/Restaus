# 🍽️ RESTAUS - Restaurant Management System

Modern, full-featured Point of Sales (POS) and Restaurant Management System built with Next.js, TypeScript, and MySQL.

![RESTAUS Banner](https://via.placeholder.com/1200x400/f97316/ffffff?text=RESTAUS+Restaurant+Management+System)

## ✨ Features

### 🔐 Multi-Role Authentication
- **Admin**: Full system access, menu management, reports, and analytics
- **Waiter**: Table management, order creation, customer service
- **Kitchen**: Order queue display, cooking workflow management
- **Cashier**: Payment processing, receipt generation

### 📊 Core Functionality
- **Real-time Table Status**: Live updates of table availability and occupancy
- **Smart Order Management**: From order creation to delivery tracking
- **Kitchen Display System (KDS)**: Efficient order queue for kitchen staff
- **Payment Processing**: Cash payment with automatic change calculation
- **Warning System**: Automatic alerts for pending payments
- **Inventory Management**: Daily stock tracking and availability
- **Receipt Generation**: Professional receipt printing

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Eye-friendly theme switching
- **Real-time Updates**: Automatic polling for live data
- **Premium Aesthetics**: Modern gradients, animations, and micro-interactions
- **Shadcn UI Components**: Beautiful, accessible component library

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner
- **Theme**: next-themes

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: MySQL
- **ORM**: mysql2 (with connection pooling)
- **Validation**: Zod

## 📁 Project Structure

```
restaus-app/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── tables/          # Table management
│   │   ├── menus/           # Menu management
│   │   ├── orders/          # Order management
│   │   ├── payments/        # Payment processing
│   │   └── categories/      # Category endpoints
│   ├── login/               # Login page
│   ├── admin/               # Admin dashboard
│   ├── waiter/              # Waiter interface
│   ├── kitchen/             # Kitchen display
│   └── cashier/             # Cashier interface
├── components/              # React components
│   ├── ui/                  # Shadcn UI components
│   └── providers/           # Context providers
├── hooks/                   # Custom React hooks
│   ├── use-auth.ts         # Authentication hook
│   ├── use-tables.ts       # Tables data hook
│   ├── use-menus.ts        # Menus data hook
│   ├── use-orders.ts       # Orders data hook
│   ├── use-cart.ts         # Shopping cart hook
│   └── use-payments.ts     # Payments hook
├── lib/                     # Utility libraries
│   ├── db.ts               # Database connection
│   ├── api-client.ts       # API client utilities
│   ├── api-response.ts     # API response helpers
│   └── utils.ts            # General utilities
├── types/                   # TypeScript type definitions
│   └── index.ts            # All type definitions
├── constants/               # Application constants
│   └── index.ts            # Constants and configs
├── sql/                     # SQL scripts
│   ├── query.sql           # Database schema
│   └── seed.sql            # Seed data
├── docs/                    # Documentation
│   ├── plan.md             # Project plan
│   ├── major-task.md       # Major tasks
│   ├── minor-task.md       # Minor tasks
│   └── PROGRESS.md         # Implementation progress
└── middleware.ts            # Next.js middleware
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MySQL 8+ installed and running
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restaus-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Database**
   ```bash
   # Create database
   mysql -u root -p < sql/query.sql
   
   # Insert seed data
   mysql -u root -p < sql/seed.sql
   ```

4. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=restaus_db
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👤 Demo Credentials

| Role    | Username | Password    |
|---------|----------|-------------|
| Admin   | admin    | admin123    |
| Waiter  | waiter   | waiter123   |
| Kitchen | kitchen  | kitchen123  |
| Cashier | cashier  | cashier123  |

## 📖 Usage Guide

### For Waiters
1. Login with waiter credentials
2. View table dashboard with real-time status
3. Click available table to start new order
4. Select menu items and add to cart
5. Add special notes if needed
6. Submit order to kitchen

### For Kitchen Staff
1. Login with kitchen credentials
2. View incoming orders in queue
3. Update item status: Pending → Cooking → Served
4. Orders automatically move to cashier when all items served

### For Cashiers
1. Login with cashier credentials
2. View tables with delivered orders
3. Process payment (cash)
4. System calculates change automatically
5. Print receipt

### For Admins
1. Login with admin credentials
2. Manage menus and categories
3. Update daily inventory
4. View sales reports and analytics
5. Manage tables and users

## 🔄 Business Flow

```
1. Restaurant Opens → All tables set to "Available"
2. Customer Arrives → Waiter assigns table (Reserved)
3. Order Placed → Items sent to kitchen (Processing)
4. Cooking → Kitchen updates item status (Cooking)
5. Ready → All items marked as served (Delivered)
6. Warning → System alerts if payment pending > 5 min
7. Payment → Cashier processes payment (Completed)
8. Table Released → Status returns to "Available"
```

## 🎯 Key Features in Detail

### Real-time Updates
- Tables auto-refresh every 5 seconds
- Kitchen queue updates every 3 seconds
- Warning checks every 10 seconds

### Inventory Management
- Daily stock tracking
- Automatic stock reduction on order
- Out-of-stock items automatically disabled

### Warning System
- Alerts when order delivered but not paid
- Visual indicators on table dashboard
- Prioritizes tables needing payment

## 📝 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Tables
- `GET /api/tables` - Get all tables
- `POST /api/tables` - Create table
- `GET /api/tables/[id]` - Get single table
- `PATCH /api/tables/[id]` - Update table status
- `DELETE /api/tables/[id]` - Delete table

### Orders
- `GET /api/orders` - Get all orders (with filters)
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get single order
- `PATCH /api/orders/[id]/status` - Update order status

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments` - Get payment history

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for modern restaurant management

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com/)


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
