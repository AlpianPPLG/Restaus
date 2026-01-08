// ============================================
// RESTAUS - Application Constants
// ============================================

// ============ App Configuration ============
export const APP_NAME = 'RESTAUS';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Restaurant Point of Sales & Management System';

// ============ API Configuration ============
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export const API_TIMEOUT = 30000; // 30 seconds

// ============ Polling & Real-time Configuration ============
export const TABLE_STATUS_POLL_INTERVAL = 5000; // 5 seconds
export const ORDER_QUEUE_POLL_INTERVAL = 3000; // 3 seconds
export const WARNING_CHECK_INTERVAL = 10000; // 10 seconds

// ============ Warning System Configuration ============
export const PAYMENT_WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

// ============ Pagination ============
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ============ Role-based Routes ============
export const ROLE_ROUTES = {
    admin: '/admin',
    waiter: '/waiter',
    kitchen: '/kitchen',
    cashier: '/cashier',
} as const;

export const ROLE_LABELS = {
    admin: 'Administrator',
    waiter: 'Waiter',
    kitchen: 'Kitchen Staff',
    cashier: 'Cashier',
} as const;

// ============ Table Status Configuration ============
export const TABLE_STATUS_COLORS = {
    available: {
        bg: 'bg-green-500',
        text: 'text-green-700',
        border: 'border-green-500',
        label: 'Available',
    },
    reserved: {
        bg: 'bg-yellow-500',
        text: 'text-yellow-700',
        border: 'border-yellow-500',
        label: 'Reserved',
    },
    occupied: {
        bg: 'bg-blue-500',
        text: 'text-blue-700',
        border: 'border-blue-500',
        label: 'Occupied',
    },
} as const;

// ============ Order Status Configuration ============
export const ORDER_STATUS_COLORS = {
    pending: {
        bg: 'bg-gray-500',
        text: 'text-gray-700',
        label: 'Pending',
    },
    processing: {
        bg: 'bg-blue-500',
        text: 'text-blue-700',
        label: 'Processing',
    },
    delivered: {
        bg: 'bg-green-500',
        text: 'text-green-700',
        label: 'Delivered',
    },
    completed: {
        bg: 'bg-purple-500',
        text: 'text-purple-700',
        label: 'Completed',
    },
    cancelled: {
        bg: 'bg-red-500',
        text: 'text-red-700',
        label: 'Cancelled',
    },
} as const;

// ============ Order Item Status Configuration ============
export const ORDER_ITEM_STATUS_COLORS = {
    pending: {
        bg: 'bg-gray-500',
        text: 'text-gray-700',
        label: 'Pending',
    },
    cooking: {
        bg: 'bg-orange-500',
        text: 'text-orange-700',
        label: 'Cooking',
    },
    served: {
        bg: 'bg-green-500',
        text: 'text-green-700',
        label: 'Served',
    },
} as const;

// ============ Category Icons (Lucide Icons) ============
export const CATEGORY_ICONS = {
    'Makanan Berat': 'UtensilsCrossed',
    'Minuman': 'Coffee',
    'Dessert': 'IceCream',
    'Snack': 'Cookie',
    'Appetizer': 'Salad',
} as const;

// ============ Payment Methods ============
export const PAYMENT_METHODS = [
    { value: 'cash', label: 'Cash' },
    { value: 'qris', label: 'QRIS' },
    { value: 'debit', label: 'Debit Card' },
] as const;

// ============ Order Types ============
export const ORDER_TYPES = [
    { value: 'dine_in', label: 'Dine In' },
    { value: 'take_away', label: 'Take Away' },
] as const;

// ============ Special Notes Presets ============
export const SPECIAL_NOTES_PRESETS = [
    'Tanpa pedas',
    'Extra pedas',
    'Tanpa bawang',
    'Tanpa MSG',
    'Less ice',
    'No ice',
    'Extra ice',
    'Less sugar',
    'No sugar',
    'Extra sauce',
    'Separate packaging',
] as const;

// ============ Receipt Configuration ============
export const RECEIPT_CONFIG = {
    restaurant_name: 'RESTAUS Restaurant',
    address: 'Jl. Contoh No. 123, Jakarta',
    phone: '+62 812-3456-7890',
    tax_percentage: 10, // 10% tax
    service_charge_percentage: 5, // 5% service charge
} as const;

// ============ Toast Messages ============
export const TOAST_MESSAGES = {
    // Success
    LOGIN_SUCCESS: 'Login successful!',
    LOGOUT_SUCCESS: 'Logged out successfully',
    ORDER_CREATED: 'Order created successfully',
    ORDER_UPDATED: 'Order updated successfully',
    PAYMENT_SUCCESS: 'Payment processed successfully',
    MENU_CREATED: 'Menu item created successfully',
    MENU_UPDATED: 'Menu item updated successfully',
    MENU_DELETED: 'Menu item deleted successfully',
    TABLE_UPDATED: 'Table status updated successfully',

    // Error
    LOGIN_FAILED: 'Invalid username or password',
    UNAUTHORIZED: 'You are not authorized to access this page',
    NETWORK_ERROR: 'Network error. Please try again.',
    STOCK_UNAVAILABLE: 'Item is out of stock',
    INVALID_INPUT: 'Please check your input',

    // Warning
    LOW_STOCK: 'Low stock warning',
    PAYMENT_PENDING: 'Payment is pending',
} as const;

// ============ Validation Rules ============
export const VALIDATION_RULES = {
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 50,
    PASSWORD_MIN_LENGTH: 6,
    MENU_NAME_MIN_LENGTH: 3,
    MENU_NAME_MAX_LENGTH: 100,
    TABLE_NUMBER_MAX_LENGTH: 10,
    SPECIAL_NOTES_MAX_LENGTH: 255,
    MIN_PRICE: 0,
    MAX_PRICE: 9999999.99,
    MIN_QUANTITY: 1,
    MAX_QUANTITY: 999,
} as const;

// ============ Local Storage Keys ============
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'restaus_auth_token',
    USER_DATA: 'restaus_user_data',
    THEME: 'restaus_theme',
    CART: 'restaus_cart',
} as const;

// ============ Query Keys (React Query) ============
export const QUERY_KEYS = {
    TABLES: 'tables',
    TABLE_DETAIL: 'table-detail',
    MENUS: 'menus',
    MENU_DETAIL: 'menu-detail',
    CATEGORIES: 'categories',
    ORDERS: 'orders',
    ORDER_DETAIL: 'order-detail',
    KITCHEN_QUEUE: 'kitchen-queue',
    PENDING_PAYMENTS: 'pending-payments',
    INVENTORIES: 'inventories',
    DASHBOARD_STATS: 'dashboard-stats',
    TOP_ITEMS: 'top-items',
    USERS: 'users',
} as const;
