import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("customer"), // customer, vendor, admin
  
  // Profile fields
  phone: text("phone"),
  address: text("address"),
  bio: text("bio"),
  avatar: text("avatar"),
  
  // Subscription fields
  subscriptionPlanId: integer("subscription_plan_id").references(() => subscriptionPlans.id).default(1),
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Vendors table
export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  storeName: text("store_name").notNull(),
  description: text("description"),
  logo: text("logo"),
  banner: text("banner"),
  address: text("address"),
  phone: text("phone"),
  isActive: boolean("is_active").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalReviews: integer("total_reviews").default(0),
  
  // Store customization
  storeSlug: text("store_slug").unique(), // for custom domain like storeSlug.bajgo.my
  customDomain: text("custom_domain"), // optional custom domain
  currency: text("currency").default("MYR"), // MYR, USD, SGD, etc.
  currencySymbol: text("currency_symbol").default("RM"),
  timezone: text("timezone").default("Asia/Kuala_Lumpur"),
  language: text("language").default("en"),
  
  // Store appearance
  themeColor: text("theme_color").default("#E53E3E"),
  accentColor: text("accent_color").default("#FEB2B2"),
  fontFamily: text("font_family").default("Inter"),
  storeLayout: text("store_layout").default("grid"), // grid, list, card
  
  // Payment settings
  enableCOD: boolean("enable_cod").default(true),
  enableOnlinePayment: boolean("enable_online_payment").default(true),
  enableWallet: boolean("enable_wallet").default(false),
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }).default("0.00"),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default("5.00"),
  freeDeliveryThreshold: decimal("free_delivery_threshold", { precision: 10, scale: 2 }).default("50.00"),
  
  // Store policies
  returnPolicy: text("return_policy"),
  shippingPolicy: text("shipping_policy"),
  privacyPolicy: text("privacy_policy"),
  termsOfService: text("terms_of_service"),
  
  // Operating hours
  operatingHours: jsonb("operating_hours").$type<{
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  }>(),
  
  // SEO settings
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  
  // Social media
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  twitterUrl: text("twitter_url"),
  whatsappNumber: text("whatsapp_number"),
  
  // Delivery Integration (Lalamove) - Admin manages centrally
  enableLalamove: boolean("enable_lalamove").default(false),
  lalamoveServiceType: text("lalamove_service_type").default("MOTORCYCLE"), // MOTORCYCLE, CAR, WALKER
  lalamoveMarket: text("lalamove_market").default("MY"), // MY, SG, TH, PH, etc.
  deliveryRadius: integer("delivery_radius").default(10), // in km
  estimatedDeliveryTime: integer("estimated_delivery_time").default(30), // in minutes
  
  // Store Setup Progress (for onboarding)
  setupProgress: jsonb("setup_progress").$type<{
    storeInfo: boolean;
    deliverySetup: boolean;
    paymentSetup: boolean;
    storeDesign: boolean;
    domainSetup: boolean;
    completed: boolean;
  }>().default({
    storeInfo: false,
    deliverySetup: false,
    paymentSetup: false,
    storeDesign: false,
    domainSetup: false,
    completed: false,
  }),
  
  // Mobile app fields
  hasApp: boolean("has_app").default(false),
  appName: text("app_name"),
  appDescription: text("app_description"),
  appIconUrl: text("app_icon_url"),
  appSplashUrl: text("app_splash_url"),
  appPrimaryColor: text("app_primary_color").default("#E53E3E"),
  appSecondaryColor: text("app_secondary_color").default("#FEB2B2"),
  appStatus: text("app_status").default("not_built"), // not_built, building, built, published, error
  appFilePath: text("app_file_path"), // Path to the generated APK file
  iosAppFilePath: text("ios_app_file_path"), // Path to the generated IPA file
  androidFilePath: text("android_file_path"), // Path to the latest Android 14/15 APK file
  appBuiltAt: text("app_built_at"),
  appPublishedAt: text("app_published_at"),
  appDownloadUrl: text("app_download_url"),
  googlePlayUrl: text("google_play_url"),
  appStoreUrl: text("app_store_url"),
  publishedToGooglePlay: boolean("published_to_google_play").default(false),
  publishedToAppStore: boolean("published_to_app_store").default(false),
  androidAppUrl: text("android_app_url"),
  iosAppUrl: text("ios_app_url"),
  enablePushNotifications: boolean("enable_push_notifications").default(true),
  enableLiveTracking: boolean("enable_live_tracking").default(true),
  enableRatings: boolean("enable_ratings").default(true),
  privacyPolicyUrl: text("privacy_policy_url"),
  termsOfServiceUrl: text("terms_of_service_url"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id),
  categoryId: integer("category_id").references(() => categories.id),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  stock: integer("stock").default(0),
  images: jsonb("images").$type<string[]>().default([]),
  thumbnail: text("thumbnail"), // Main product thumbnail image
  banner: text("banner"), // Product banner/hero image
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => users.id),
  vendorId: integer("vendor_id").references(() => vendors.id),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, confirmed, preparing, ready_for_pickup, out_for_delivery, delivered, cancelled
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default("0"),
  deliveryAddress: text("delivery_address").notNull(),
  deliveryMethod: text("delivery_method").default("standard"), // standard, express, lalamove
  paymentMethod: text("payment_method").default("cod"), // cod, stripe, billplz
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed, refunded
  customerPhone: text("customer_phone").notNull(),
  customerName: text("customer_name").notNull(),
  estimatedDeliveryTime: timestamp("estimated_delivery_time"),
  actualDeliveryTime: timestamp("actual_delivery_time"),
  trackingNumber: text("tracking_number"),
  lalamoveOrderId: text("lalamove_order_id"),
  notes: text("notes"),
  vendorNotes: text("vendor_notes"),
  cancellationReason: text("cancellation_reason"),
  rating: integer("rating"), // 1-5 stars
  reviewText: text("review_text"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  productName: text("product_name").notNull(), // Store name at time of order
});

// WhatsApp Messages table
export const whatsappMessages = pgTable("whatsapp_messages", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id),
  fromNumber: text("from_number").notNull(),
  toNumber: text("to_number").notNull(),
  message: text("message").notNull(),
  messageType: text("message_type").default("text"), // text, image, document
  status: text("status").default("sent"), // sent, delivered, read
  orderId: integer("order_id").references(() => orders.id),
  customerName: text("customer_name"),
  isIncoming: boolean("is_incoming").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// WhatsApp Configuration table
export const whatsappConfig = pgTable("whatsapp_config", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
  isEnabled: boolean("is_enabled").default(false),
  businessPhoneNumber: text("business_phone_number"),
  businessName: text("business_name"),
  welcomeMessage: text("welcome_message"),
  autoReplyEnabled: boolean("auto_reply_enabled").default(false),
  autoReplyMessage: text("auto_reply_message"),
  orderNotificationsEnabled: boolean("order_notifications_enabled").default(true),
  supportTicketEnabled: boolean("support_ticket_enabled").default(true),
  businessHoursEnabled: boolean("business_hours_enabled").default(false),
  businessHoursStart: text("business_hours_start"),
  businessHoursEnd: text("business_hours_end"),
  businessHoursTimezone: text("business_hours_timezone").default("UTC+8"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Platform settings table for admin to manage global configurations
export const platformSettings = pgTable("platform_settings", {
  id: serial("id").primaryKey(),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value"),
  description: text("description"),
  category: text("category").default("general"), // general, payment, delivery, integrations
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lalamove API keys managed by admin centrally
export const lalamoveConfig = pgTable("lalamove_config", {
  id: serial("id").primaryKey(),
  environment: text("environment").notNull().default("sandbox"), // sandbox, production
  apiKey: text("api_key").notNull(),
  apiSecret: text("api_secret").notNull(),
  webhookSecret: text("webhook_secret"),
  market: text("market").default("MY"), // MY, SG, TH, PH
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  vendor: one(vendors, {
    fields: [users.id],
    references: [vendors.userId],
  }),
  subscriptionPlan: one(subscriptionPlans, {
    fields: [users.subscriptionPlanId],
    references: [subscriptionPlans.id],
  }),
  orders: many(orders),
  subscriptionTransactions: many(subscriptionTransactions),
  subscriptionUsage: many(subscriptionUsage),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  user: one(users, {
    fields: [vendors.userId],
    references: [users.id],
  }),
  products: many(products),
  orders: many(orders),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  vendor: one(vendors, {
    fields: [products.vendorId],
    references: [vendors.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  vendor: one(vendors, {
    fields: [orders.vendorId],
    references: [vendors.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const whatsappMessagesRelations = relations(whatsappMessages, ({ one }) => ({
  vendor: one(vendors, {
    fields: [whatsappMessages.vendorId],
    references: [vendors.id],
  }),
  order: one(orders, {
    fields: [whatsappMessages.orderId],
    references: [orders.id],
  }),
}));

export const whatsappConfigRelations = relations(whatsappConfig, ({ one }) => ({
  vendor: one(vendors, {
    fields: [whatsappConfig.vendorId],
    references: [vendors.id],
  }),
}));

export const platformSettingsRelations = relations(platformSettings, ({ }) => ({}));

export const lalamoveConfigRelations = relations(lalamoveConfig, ({ }) => ({}));

// Subscription Plans table
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // starter, professional, enterprise
  displayName: text("display_name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("MYR"),
  billingInterval: text("billing_interval").default("monthly"), // monthly, yearly
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("5.00"), // percentage
  maxProducts: integer("max_products").default(100),
  maxOrders: integer("max_orders").default(1000),
  features: jsonb("features").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  stripePriceId: text("stripe_price_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subscription Transactions table
export const subscriptionTransactions = pgTable("subscription_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  planId: integer("plan_id").references(() => subscriptionPlans.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("MYR"),
  status: text("status").notNull(), // pending, completed, failed, refunded
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeInvoiceId: text("stripe_invoice_id"),
  transactionDate: timestamp("transaction_date").defaultNow(),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
});

// Subscription Usage table for tracking limits
export const subscriptionUsage = pgTable("subscription_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  planId: integer("plan_id").references(() => subscriptionPlans.id),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  productsUsed: integer("products_used").default(0),
  ordersProcessed: integer("orders_processed").default(0),
  apiCallsUsed: integer("api_calls_used").default(0),
  storageUsed: integer("storage_used").default(0), // in MB
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Relations for subscription tables
export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  users: many(users),
  transactions: many(subscriptionTransactions),
  usage: many(subscriptionUsage),
}));

export const subscriptionTransactionsRelations = relations(subscriptionTransactions, ({ one }) => ({
  user: one(users, { fields: [subscriptionTransactions.userId], references: [users.id] }),
  plan: one(subscriptionPlans, { fields: [subscriptionTransactions.planId], references: [subscriptionPlans.id] }),
}));

export const subscriptionUsageRelations = relations(subscriptionUsage, ({ one }) => ({
  user: one(users, { fields: [subscriptionUsage.userId], references: [users.id] }),
  plan: one(subscriptionPlans, { fields: [subscriptionUsage.planId], references: [subscriptionPlans.id] }),
}));

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").default("new"), // new, read, replied, closed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact form schema (for validation)
export const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Category = typeof categories.$inferSelect;
export type WhatsAppMessage = typeof whatsappMessages.$inferSelect;
export type WhatsAppConfig = typeof whatsappConfig.$inferSelect;
export type PlatformSettings = typeof platformSettings.$inferSelect;
export type LalamoveConfig = typeof lalamoveConfig.$inferSelect;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type SubscriptionTransaction = typeof subscriptionTransactions.$inferSelect;
export type SubscriptionUsage = typeof subscriptionUsage.$inferSelect;
export type ContactForm = z.infer<typeof contactFormSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
