// ============================================
// RESTAUS - TypeScript Type Definitions
// ============================================

// ============ User & Auth Types ============
export type UserRole = 'admin' | 'waiter' | 'cashier' | 'kitchen';

export interface User {
  id: number;
  username: string;
  role: UserRole;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: User;
  token?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// ============ Table Types ============
export type TableStatus = 'available' | 'reserved' | 'occupied';

export interface Table {
  id: number;
  table_number: string;
  capacity: number;
  status: TableStatus;
  created_at: string;
  current_order?: Order; // Populated when table has active order
  warning?: boolean; // True if delivered but not paid
}

// ============ Menu & Category Types ============
export interface Category {
  id: number;
  name: string;
  icon?: string;
  sort_order: number;
}

export interface Menu {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  category?: Category; // Populated in joins
  inventory?: Inventory; // Populated for stock info
}

// ============ Inventory Types ============
export interface Inventory {
  id: number;
  menu_id: number;
  daily_stock: number;
  remaining_stock: number;
  last_updated: string;
}

// ============ Order Types ============
export type OrderType = 'dine_in' | 'take_away';
export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'completed' | 'cancelled';
export type OrderItemStatus = 'pending' | 'cooking' | 'served';

export interface Order {
  id: number;
  table_id?: number;
  user_id: number;
  customer_name?: string;
  order_type: OrderType;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  table?: Table; // Populated
  waiter?: User; // Populated
  items?: OrderItem[]; // Populated
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_id: number;
  quantity: number;
  price_at_time: number;
  subtotal: number;
  special_notes?: string;
  status: OrderItemStatus;
  menu?: Menu; // Populated
}

// ============ Payment Types ============
export type PaymentMethod = 'cash' | 'qris' | 'debit';

export interface Payment {
  id: number;
  order_id: number;
  cashier_id: number;
  payment_method: PaymentMethod;
  amount_paid: number;
  change_amount: number;
  transaction_date: string;
  order?: Order; // Populated
  cashier?: User; // Populated
}

// ============ Cart Types (Frontend State) ============
export interface CartItem {
  menu: Menu;
  quantity: number;
  special_notes?: string;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// ============ Dashboard & Stats Types ============
export interface DashboardStats {
  total_sales_today: number;
  total_orders_today: number;
  active_tables: number;
  pending_orders: number;
}

export interface TopMenuItem {
  menu_id: number;
  menu_name: string;
  total_quantity: number;
  total_revenue: number;
}

// ============ API Response Types ============
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============ Form Types ============
export interface MenuFormData {
  category_id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_active: boolean;
  daily_stock: number;
}

export interface TableFormData {
  table_number: string;
  capacity: number;
}

export interface OrderFormData {
  table_id?: number;
  customer_name?: string;
  order_type: OrderType;
  items: {
    menu_id: number;
    quantity: number;
    special_notes?: string;
  }[];
}

export interface PaymentFormData {
  order_id: number;
  payment_method: PaymentMethod;
  amount_paid: number;
}

// ============ Filter & Query Types ============
export interface OrderFilters {
  status?: OrderStatus;
  order_type?: OrderType;
  date_from?: string;
  date_to?: string;
  table_id?: number;
  waiter_id?: number;
}

export interface MenuFilters {
  category_id?: number;
  is_active?: boolean;
  search?: string;
  in_stock?: boolean;
}
