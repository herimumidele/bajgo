import { 
  users, vendors, products, orders, orderItems, categories, whatsappConfig, whatsappMessages, platformSettings, lalamoveConfig,
  subscriptionPlans, subscriptionTransactions, subscriptionUsage, contactMessages,
  type User, type InsertUser, type Vendor, type InsertVendor,
  type Product, type InsertProduct, type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem, type Category, type PlatformSettings, type LalamoveConfig,
  type SubscriptionPlan, type SubscriptionTransaction, type SubscriptionUsage, type ContactMessage, type InsertContactMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sum, sql, or, like, asc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Vendor operations
  getVendor(id: number): Promise<Vendor | undefined>;
  getVendorByUserId(userId: number): Promise<Vendor | undefined>;
  getVendorBySlug(slug: string): Promise<Vendor | undefined>;
  getVendorByCustomDomain(domain: string): Promise<Vendor | undefined>;
  getAllVendors(): Promise<Vendor[]>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: number, vendor: Partial<InsertVendor>): Promise<Vendor>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByVendor(vendorId: number): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByCustomer(customerId: number): Promise<Order[]>;
  getOrdersByVendor(vendorId: number): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  updateOrder(id: number, updateData: Partial<Order>): Promise<Order>;
  
  // Order item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  
  // Contact message operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  updateContactMessageStatus(id: number, status: string): Promise<ContactMessage>;
  
  // Analytics
  getVendorStats(vendorId: number): Promise<{
    totalRevenue: number;
    totalOrders: number;
    activeProducts: number;
    rating: number;
  }>;
  
  getPlatformStats(): Promise<{
    totalRevenue: number;
    totalVendors: number;
    totalOrders: number;
    totalCustomers: number;
    activeVendors: number;
    monthlyRevenue: number;
    pendingOrders: number;
    activeCustomers: number;
    commissionEarned: number;
    subscriptionRevenue: number;
  }>;
  
  // WhatsApp operations
  getWhatsAppConfig(vendorId: number): Promise<any>;
  updateWhatsAppConfig(vendorId: number, config: any): Promise<any>;
  getWhatsAppMessages(vendorId: number, limit?: number): Promise<any[]>;
  createWhatsAppMessage(message: any): Promise<any>;
  getWhatsAppConversations(vendorId: number): Promise<any[]>;
  updateMessageStatus(messageId: string, status: string): Promise<any>;
  
  // Platform settings operations
  getPlatformSetting(key: string): Promise<any>;
  updatePlatformSetting(key: string, value: string): Promise<any>;
  
  // Lalamove configuration operations
  getLalamoveConfig(): Promise<any>;
  updateLalamoveConfig(config: any): Promise<any>;
  
  // Subscription operations
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined>;
  createSubscriptionPlan(plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan>;
  updateSubscriptionPlan(id: number, plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan>;
  
  getUserSubscription(userId: number): Promise<{ user: User; plan: SubscriptionPlan | null; usage: SubscriptionUsage | null }>;
  updateUserSubscription(userId: number, planId: number, subscriptionData: Partial<User>): Promise<User>;
  createSubscriptionTransaction(transaction: Partial<SubscriptionTransaction>): Promise<SubscriptionTransaction>;
  getSubscriptionTransactions(userId: number): Promise<SubscriptionTransaction[]>;
  
  getSubscriptionUsage(userId: number, month: number, year: number): Promise<SubscriptionUsage | undefined>;
  updateSubscriptionUsage(userId: number, planId: number, month: number, year: number, usage: Partial<SubscriptionUsage>): Promise<SubscriptionUsage>;
  
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'session'
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor || undefined;
  }

  async getVendorByUserId(userId: number): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, userId));
    return vendor || undefined;
  }

  async getVendorBySlug(slug: string): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.storeSlug, slug));
    return vendor || undefined;
  }

  async getVendorByCustomDomain(domain: string): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.customDomain, domain));
    return vendor || undefined;
  }

  async getAllVendors(): Promise<Vendor[]> {
    return await db.select().from(vendors).where(eq(vendors.isActive, true));
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const [newVendor] = await db.insert(vendors).values(vendor).returning();
    return newVendor;
  }

  async updateVendor(id: number, vendor: Partial<InsertVendor>): Promise<Vendor> {
    const [updatedVendor] = await db
      .update(vendors)
      .set(vendor)
      .where(eq(vendors.id, id))
      .returning();
    return updatedVendor;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByVendor(vendorId: number): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(and(eq(products.vendorId, vendorId), eq(products.isActive, true)))
      .orderBy(desc(products.createdAt));
  }

  async getAllProducts(): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const updateData = { ...product } as any;
    delete updateData.updatedAt;
    updateData.updatedAt = sql`now()`;
    
    const [updatedProduct] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrdersByCustomer(customerId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.customerId, customerId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrdersByVendor(vendorId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.vendorId, vendorId))
      .orderBy(desc(orders.createdAt));
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: sql`now()` })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async updateOrder(id: number, updateData: Partial<Order>): Promise<Order> {
    const updateFields = { ...updateData } as any;
    delete updateFields.id;
    delete updateFields.createdAt;
    updateFields.updatedAt = sql`now()`;
    
    const [updatedOrder] = await db
      .update(orders)
      .set(updateFields)
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }

  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true));
  }

  async getVendorStats(vendorId: number): Promise<{
    totalRevenue: number;
    totalOrders: number;
    activeProducts: number;
    rating: number;
  }> {
    const [revenueResult] = await db
      .select({ total: sum(orders.total) })
      .from(orders)
      .where(eq(orders.vendorId, vendorId));

    const [orderCountResult] = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.vendorId, vendorId));

    const [productCountResult] = await db
      .select({ count: count() })
      .from(products)
      .where(and(eq(products.vendorId, vendorId), eq(products.isActive, true)));

    const [vendorResult] = await db
      .select({ rating: vendors.rating })
      .from(vendors)
      .where(eq(vendors.id, vendorId));

    return {
      totalRevenue: parseFloat(revenueResult?.total || "0"),
      totalOrders: orderCountResult?.count || 0,
      activeProducts: productCountResult?.count || 0,
      rating: parseFloat(vendorResult?.rating || "0"),
    };
  }

  async getPlatformStats(): Promise<{
    totalRevenue: number;
    totalVendors: number;
    totalOrders: number;
    totalCustomers: number;
    activeVendors: number;
    monthlyRevenue: number;
    pendingOrders: number;
    activeCustomers: number;
    commissionEarned: number;
    subscriptionRevenue: number;
  }> {
    const [revenueResult] = await db
      .select({ total: sum(orders.total) })
      .from(orders);

    const [vendorCountResult] = await db
      .select({ count: count() })
      .from(vendors)
      .where(eq(vendors.isActive, true));

    const [orderCountResult] = await db
      .select({ count: count() })
      .from(orders);

    const [customerCountResult] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "customer"));

    // Mock additional stats for admin dashboard
    const totalRevenue = parseFloat(revenueResult?.total || "0");
    const totalOrders = orderCountResult?.count || 0;
    
    return {
      totalRevenue,
      totalVendors: vendorCountResult?.count || 0,
      totalOrders,
      totalCustomers: customerCountResult?.count || 0,
      activeVendors: Math.floor((vendorCountResult?.count || 0) * 0.85),
      monthlyRevenue: Math.floor(totalRevenue * 0.25),
      pendingOrders: Math.floor(totalOrders * 0.1),
      activeCustomers: Math.floor((customerCountResult?.count || 0) * 0.75),
      commissionEarned: Math.floor(totalRevenue * 0.05),
      subscriptionRevenue: Math.floor((vendorCountResult?.count || 0) * 89),
    };
  }

  // WhatsApp operations
  async getWhatsAppConfig(vendorId: number): Promise<any> {
    const [config] = await db
      .select()
      .from(whatsappConfig)
      .where(eq(whatsappConfig.vendorId, vendorId));
    return config;
  }

  async updateWhatsAppConfig(vendorId: number, configData: any): Promise<any> {
    const existing = await this.getWhatsAppConfig(vendorId);
    
    if (existing) {
      const [updated] = await db
        .update(whatsappConfig)
        .set({ ...configData, updatedAt: new Date() })
        .where(eq(whatsappConfig.vendorId, vendorId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(whatsappConfig)
        .values({ ...configData, vendorId })
        .returning();
      return created;
    }
  }

  async getWhatsAppMessages(vendorId: number, limit = 100): Promise<any[]> {
    const messages = await db
      .select()
      .from(whatsappMessages)
      .where(eq(whatsappMessages.vendorId, vendorId))
      .orderBy(desc(whatsappMessages.createdAt))
      .limit(limit);
    return messages;
  }

  async createWhatsAppMessage(messageData: any): Promise<any> {
    const [message] = await db
      .insert(whatsappMessages)
      .values(messageData)
      .returning();
    return message;
  }

  async getWhatsAppConversations(vendorId: number): Promise<any[]> {
    // Get unique phone numbers with their latest messages
    const conversations = await db
      .select({
        phone: whatsappMessages.fromNumber,
        customerName: whatsappMessages.customerName,
        lastMessage: whatsappMessages.message,
        timestamp: whatsappMessages.createdAt,
      })
      .from(whatsappMessages)
      .where(eq(whatsappMessages.vendorId, vendorId))
      .orderBy(desc(whatsappMessages.createdAt));

    // Group by phone number and get the latest message for each
    const uniqueConversations = conversations.reduce((acc, msg) => {
      const phone = msg.phone;
      if (!acc[phone]) {
        acc[phone] = {
          phone,
          customerName: msg.customerName,
          lastMessage: msg.lastMessage,
          timestamp: msg.timestamp,
          unreadCount: 0,
        };
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(uniqueConversations);
  }

  async updateMessageStatus(messageId: string, status: string): Promise<any> {
    const [updated] = await db
      .update(whatsappMessages)
      .set({ status })
      .where(eq(whatsappMessages.id, parseInt(messageId)))
      .returning();
    return updated;
  }

  // Platform settings operations
  async getPlatformSetting(key: string): Promise<PlatformSettings | undefined> {
    const [setting] = await db.select().from(platformSettings).where(eq(platformSettings.settingKey, key));
    return setting || undefined;
  }

  async updatePlatformSetting(key: string, value: string): Promise<PlatformSettings> {
    const existing = await this.getPlatformSetting(key);
    if (existing) {
      const [updated] = await db
        .update(platformSettings)
        .set({ settingValue: value, updatedAt: new Date() })
        .where(eq(platformSettings.settingKey, key))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(platformSettings)
        .values({ settingKey: key, settingValue: value })
        .returning();
      return created;
    }
  }

  // Lalamove configuration operations
  async getLalamoveConfig(): Promise<LalamoveConfig | undefined> {
    const [config] = await db.select().from(lalamoveConfig).where(eq(lalamoveConfig.isActive, true));
    return config || undefined;
  }

  async updateLalamoveConfig(configData: Partial<LalamoveConfig>): Promise<LalamoveConfig> {
    const existing = await this.getLalamoveConfig();
    if (existing) {
      const [updated] = await db
        .update(lalamoveConfig)
        .set({ ...configData, updatedAt: new Date() })
        .where(eq(lalamoveConfig.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(lalamoveConfig)
        .values(configData)
        .returning();
      return created;
    }
  }

  // Subscription operations
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
  }

  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return plan || undefined;
  }

  async createSubscriptionPlan(planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const [plan] = await db.insert(subscriptionPlans).values(planData).returning();
    return plan;
  }

  async updateSubscriptionPlan(id: number, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const [plan] = await db
      .update(subscriptionPlans)
      .set(planData)
      .where(eq(subscriptionPlans.id, id))
      .returning();
    return plan;
  }

  async getUserSubscription(userId: number): Promise<{ user: User; plan: SubscriptionPlan | null; usage: SubscriptionUsage | null }> {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');

    let plan: SubscriptionPlan | null = null;
    let usage: SubscriptionUsage | null = null;

    if (user.subscriptionPlanId) {
      const [planResult] = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.id, user.subscriptionPlanId));
      plan = planResult || null;

      if (plan) {
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        
        const [usageResult] = await db
          .select()
          .from(subscriptionUsage)
          .where(
            and(
              eq(subscriptionUsage.userId, userId),
              eq(subscriptionUsage.planId, plan.id),
              eq(subscriptionUsage.month, month),
              eq(subscriptionUsage.year, year)
            )
          );
        usage = usageResult || null;
      }
    }

    return { user, plan, usage };
  }

  async updateUserSubscription(userId: number, planId: number, subscriptionData: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(subscriptionData)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async createSubscriptionTransaction(transactionData: Partial<SubscriptionTransaction>): Promise<SubscriptionTransaction> {
    const [transaction] = await db.insert(subscriptionTransactions).values(transactionData).returning();
    return transaction;
  }

  async getSubscriptionTransactions(userId: number): Promise<SubscriptionTransaction[]> {
    return await db
      .select()
      .from(subscriptionTransactions)
      .where(eq(subscriptionTransactions.userId, userId))
      .orderBy(desc(subscriptionTransactions.transactionDate));
  }

  async getSubscriptionUsage(userId: number, month: number, year: number): Promise<SubscriptionUsage | undefined> {
    const [usage] = await db
      .select()
      .from(subscriptionUsage)
      .where(
        and(
          eq(subscriptionUsage.userId, userId),
          eq(subscriptionUsage.month, month),
          eq(subscriptionUsage.year, year)
        )
      );
    return usage || undefined;
  }

  async updateSubscriptionUsage(userId: number, planId: number, month: number, year: number, usageData: Partial<SubscriptionUsage>): Promise<SubscriptionUsage> {
    const existing = await this.getSubscriptionUsage(userId, month, year);
    
    if (existing) {
      const [usage] = await db
        .update(subscriptionUsage)
        .set({ ...usageData, lastUpdated: new Date() })
        .where(eq(subscriptionUsage.id, existing.id))
        .returning();
      return usage;
    } else {
      const [usage] = await db
        .insert(subscriptionUsage)
        .values({
          userId,
          planId,
          month,
          year,
          ...usageData,
        })
        .returning();
      return usage;
    }
  }

  // Contact message operations
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [contactMessage] = await db
      .insert(contactMessages)
      .values(message)
      .returning();
    return contactMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id));
    return message || undefined;
  }

  async updateContactMessageStatus(id: number, status: string): Promise<ContactMessage> {
    const [updated] = await db
      .update(contactMessages)
      .set({ status, updatedAt: new Date() })
      .where(eq(contactMessages.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
