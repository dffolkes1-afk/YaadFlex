import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { COMPANY_INFO } from '@shared/company';

// Optional: REPLIT_DOMAINS for Replit-specific auth, but not required for Railway deployment
const SUPPORTED_DOMAINS = process.env.REPLIT_DOMAINS || process.env.RAILWAY_DOMAINS || process.env.ALLOWED_DOMAINS || '';
console.log("Supported auth domains:", SUPPORTED_DOMAINS || "None configured - auth disabled");

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
  
  // Use memory store for now to debug authentication
  console.log("Setting up session with memory store");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("SESSION_SECRET exists:", !!process.env.SESSION_SECRET);
  
  return session({
    secret: process.env.SESSION_SECRET || 'dev-secret-fallback-only-for-debugging',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  console.log(`Setting up authentication for ${COMPANY_INFO.COMPANY_NAME}`);
  
  // Always mount session and passport middleware for basic auth functionality
  const sessionMiddleware = getSession();
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  
  console.log("Session and passport middleware mounted");
  
  // If no domains configured, still provide basic auth structure but skip OIDC
  if (!SUPPORTED_DOMAINS) {
    console.log("No domains configured - auth disabled but middleware ready");
    return;
  }
  
  let config;
  try {
    config = await getOidcConfig();
    console.log("OIDC config loaded successfully");
  } catch (error) {
    console.error("Failed to load OIDC config:", error);
    throw error;
  }

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  console.log("Registering strategies for domains:", SUPPORTED_DOMAINS);
  
  for (const domain of SUPPORTED_DOMAINS.split(",")) {
    console.log(`Registering strategy for domain: ${domain}`);
    
    try {
      const strategy = new Strategy(
        {
          name: `replitauth:${domain}`,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify,
      );
      passport.use(strategy);
      console.log(`Strategy registered successfully for domain: ${domain}`);
    } catch (error) {
      console.error(`Failed to register strategy for domain ${domain}:`, error);
      throw error;
    }
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });

  // User API route for compatibility with legacy routes
  app.get("/api/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Apply BlackRock executive positioning ONLY for actual CEO users
      if (user && user.email === COMPANY_INFO.CONTACT.ceo_email) {
        user.firstName = 'BlackRock';
        user.lastName = 'Executive Officer';
        (user as any).isBlackRockExecutive = true;
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  const user = (req as any).user;
  if (!user || !user.claims) {
    return res.status(401).json({ error: "Invalid session" });
  }

  // Apply BlackRock executive positioning ONLY for actual CEO users
  if (user.claims.email === COMPANY_INFO.CONTACT.ceo_email) {
    // This is the actual CEO - apply BlackRock executive positioning
    user.claims.first_name = 'BlackRock';
    user.claims.last_name = 'Executive Officer';
    user.isBlackRockExecutive = true;
  }
  
  return next();
};
