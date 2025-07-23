import { type Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

interface SubdomainRequest extends Request {
  vendor?: any;
  isSubdomain?: boolean;
  subdomain?: string;
  customDomain?: boolean;
}

export function setupSubdomainRouting(app: any) {
  // Middleware to detect subdomain and custom domain routing
  app.use(async (req: SubdomainRequest, res: Response, next: NextFunction) => {
    const host = req.get('host') || '';
    const hostname = host.split(':')[0]; // Remove port if present
    
    console.log(`Incoming request to: ${hostname}`);
    
    // Skip subdomain processing for localhost and main domain
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.replit.dev')) {
      return next();
    }
    
    let vendor = null;
    let isSubdomain = false;
    let subdomain = '';
    let customDomain = false;
    
    // Check if it's a subdomain of bajgo.my
    if (hostname.endsWith('.bajgo.my')) {
      const subdomainPart = hostname.replace('.bajgo.my', '');
      if (subdomainPart && subdomainPart !== 'www') {
        isSubdomain = true;
        subdomain = subdomainPart;
        
        try {
          vendor = await storage.getVendorBySlug(subdomain);
        } catch (error) {
          console.error('Error fetching vendor by slug:', error);
        }
      }
    } else {
      // Check if it's a custom domain
      try {
        vendor = await storage.getVendorByCustomDomain(hostname);
        if (vendor) {
          customDomain = true;
        }
      } catch (error) {
        console.error('Error fetching vendor by custom domain:', error);
      }
    }
    
    // If vendor found, set up storefront routing
    if (vendor) {
      req.vendor = vendor;
      req.isSubdomain = isSubdomain;
      req.subdomain = subdomain;
      req.customDomain = customDomain;
      
      // Handle API requests for storefront
      if (req.path.startsWith('/api/')) {
        // Rewrite API paths for storefront
        if (req.path === '/api/storefront') {
          req.url = `/api/storefront/${vendor.storeSlug}`;
        } else if (req.path === '/api/storefront/products') {
          req.url = `/api/storefront/${vendor.storeSlug}/products`;
        }
      } else if (req.path === '/' || req.path === '/index.html') {
        // For root requests, serve the storefront page
        const storefrontHtml = generateStorefrontHtml(vendor);
        return res.send(storefrontHtml);
      }
    }
    
    next();
  });
}

function generateStorefrontHtml(vendor: any): string {
  // Generate complete HTML for the storefront with vendor data
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${vendor.storeName} - BajGo</title>
    <meta name="description" content="${vendor.description || 'Shop at ' + vendor.storeName}">
    <meta property="og:title" content="${vendor.storeName}">
    <meta property="og:description" content="${vendor.description || 'Shop at ' + vendor.storeName}">
    <meta property="og:type" content="website">
    <link rel="icon" href="/favicon.ico">
    <script type="module">
      // Set vendor data for React app
      window.VENDOR_DATA = ${JSON.stringify(vendor)};
      window.IS_STOREFRONT = true;
      
      // Import and render the React app
      import("/src/main.tsx");
    </script>
</head>
<body>
    <div id="root"></div>
</body>
</html>
  `;
}

export function getVendorFromRequest(req: SubdomainRequest) {
  return req.vendor;
}

export function isStorefrontRequest(req: SubdomainRequest): boolean {
  return !!(req.vendor && (req.isSubdomain || req.customDomain));
}