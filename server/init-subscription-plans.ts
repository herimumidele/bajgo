import { storage } from "./storage";

export async function initializeSubscriptionPlans() {
  try {
    // Check if plans already exist
    const existingPlans = await storage.getSubscriptionPlans();
    if (existingPlans.length > 0) {
      console.log("Subscription plans already exist, skipping initialization");
      return;
    }

    // Create default subscription plans
    const defaultPlans = [
      {
        name: "free",
        displayName: "Free Plan",
        description: "Perfect for getting started with basic features",
        price: 0,
        currency: "MYR",
        billingInterval: "monthly",
        commissionRate: 10.00,
        maxProducts: 5,
        maxOrders: 10,
        features: ["Basic storefront", "Up to 5 products", "Email support"],
        isActive: true,
      },
      {
        name: "starter",
        displayName: "Starter Plan",
        description: "Great for small businesses ready to grow",
        price: 29.00,
        currency: "MYR",
        billingInterval: "monthly",
        commissionRate: 7.00,
        maxProducts: 50,
        maxOrders: 500,
        features: [
          "Professional storefront",
          "Up to 50 products",
          "Lalamove delivery integration",
          "Payment gateway integration",
          "Basic analytics",
          "Email support"
        ],
        isActive: true,
      },
      {
        name: "professional",
        displayName: "Professional Plan",
        description: "Perfect for growing businesses with advanced needs",
        price: 99.00,
        currency: "MYR",
        billingInterval: "monthly",
        commissionRate: 5.00,
        maxProducts: 500,
        maxOrders: 5000,
        features: [
          "Advanced storefront customization",
          "Up to 500 products",
          "Lalamove delivery integration",
          "Multiple payment gateways",
          "Advanced analytics dashboard",
          "WhatsApp integration",
          "Priority email support",
          "Custom domain support"
        ],
        isActive: true,
      },
      {
        name: "enterprise",
        displayName: "Enterprise Plan",
        description: "For large businesses with unlimited potential",
        price: 299.00,
        currency: "MYR",
        billingInterval: "monthly",
        commissionRate: 3.00,
        maxProducts: -1, // Unlimited
        maxOrders: -1, // Unlimited
        features: [
          "Unlimited products",
          "Unlimited orders",
          "White-label solution",
          "Mobile app builder",
          "Advanced delivery management",
          "Multi-payment gateway support",
          "Real-time analytics",
          "WhatsApp Business API",
          "24/7 priority support",
          "Custom integrations",
          "Dedicated account manager"
        ],
        isActive: true,
      },
    ];

    // Create plans in database
    for (const planData of defaultPlans) {
      await storage.createSubscriptionPlan(planData);
      console.log(`Created subscription plan: ${planData.displayName}`);
    }

    console.log("✓ Subscription plans initialized successfully");
  } catch (error) {
    console.error("Failed to initialize subscription plans:", error);
  }
}