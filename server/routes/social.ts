import type { Express } from "express";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { socialPosts, users } from "@shared/schema";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";

// Independent YaadFlex Social Platform Routes
// 100% owned by YaadFlex - no external profit sharing

const signupSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  fullName: z.string().min(1),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const postSchema = createInsertSchema(socialPosts).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export function registerSocialRoutes(app: Express) {
  
  // Signup for YaadFlex Social Platform
  app.post("/api/social/signup", async (req, res) => {
    try {
      const userData = signupSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email))
        .limit(1);
      
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Create new social user
      const [newUser] = await db
        .insert(users)
        .values({
          email: userData.email,
          firstName: userData.fullName.split(' ')[0],
          lastName: userData.fullName.split(' ').slice(1).join(' ') || '',
        })
        .returning();
      
      // Store session (simplified for demo)
      req.session.socialUser = {
        id: newUser.id,
        email: newUser.email,
        fullName: userData.fullName,
        username: userData.username,
      };
      
      res.json({ 
        success: true, 
        message: "Welcome to YaadFlex Social - YOUR independent platform!",
        user: {
          id: newUser.id,
          username: userData.username,
          fullName: userData.fullName,
        }
      });
      
    } catch (error) {
      console.error("Social signup error:", error);
      res.status(400).json({ message: "Invalid signup data" });
    }
  });
  
  // Login to YaadFlex Social Platform
  app.post("/api/social/login", async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body);
      
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, loginData.email))
        .limit(1);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Store session
      req.session.socialUser = {
        id: user.id,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`.trim(),
        username: user.email.split('@')[0], // Generate username from email
      };
      
      res.json({ 
        success: true,
        message: "Welcome back to YOUR social platform!",
        user: {
          id: user.id,
          username: user.email.split('@')[0],
          fullName: `${user.firstName} ${user.lastName}`.trim(),
        }
      });
      
    } catch (error) {
      console.error("Social login error:", error);
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
  
  // Get current social user
  app.get("/api/social/user", (req, res) => {
    if (req.session.socialUser) {
      res.json(req.session.socialUser);
    } else {
      res.status(401).json({ message: "Not logged in" });
    }
  });
  
  // Create a new post on YaadFlex Social
  app.post("/api/social/posts", async (req, res) => {
    try {
      if (!req.session.socialUser) {
        return res.status(401).json({ message: "Must be logged in to post" });
      }
      
      const postData = postSchema.parse(req.body);
      
      const [newPost] = await db
        .insert(socialPosts)
        .values({
          ...postData,
          userId: req.session.socialUser.id,
          profileId: req.session.socialUser.id, // Use user ID as profile ID for now
        })
        .returning();
      
      res.json({ 
        success: true,
        message: "Posted to YOUR independent social platform!",
        post: newPost 
      });
      
    } catch (error) {
      console.error("Post creation error:", error);
      res.status(400).json({ message: "Failed to create post" });
    }
  });
  
  // Get posts from YaadFlex Social (independent feed)
  app.get("/api/social/posts", async (req, res) => {
    try {
      const posts = await db
        .select({
          id: socialPosts.id,
          content: socialPosts.content,
          imageUrls: socialPosts.imageUrls,
          videoUrl: socialPosts.videoUrl,
          postType: socialPosts.postType,
          createdAt: socialPosts.createdAt,
          userId: socialPosts.userId,
          // User info
          userEmail: users.email,
          userFirstName: users.firstName,
          userLastName: users.lastName,
        })
        .from(socialPosts)
        .leftJoin(users, eq(socialPosts.userId, users.id))
        .orderBy(desc(socialPosts.createdAt))
        .limit(50);
      
      const formattedPosts = posts.map(post => ({
        id: post.id,
        userId: post.userId,
        username: post.userEmail?.split('@')[0] || 'anonymous',
        fullName: `${post.userFirstName || ''} ${post.userLastName || ''}`.trim() || 'Anonymous User',
        content: post.content,
        imageUrl: Array.isArray(post.imageUrls) ? post.imageUrls[0] : null,
        videoUrl: post.videoUrl,
        postType: post.postType,
        likes: Math.floor(Math.random() * 100), // Demo data
        comments: Math.floor(Math.random() * 20), // Demo data
        shares: Math.floor(Math.random() * 10), // Demo data
        isLiked: false, // Demo data
        createdAt: post.createdAt?.toISOString() || new Date().toISOString(),
      }));
      
      res.json(formattedPosts);
      
    } catch (error) {
      console.error("Get posts error:", error);
      res.status(500).json({ message: "Failed to load posts" });
    }
  });
  
  // Logout from YaadFlex Social
  app.post("/api/social/logout", (req, res) => {
    req.session.socialUser = undefined;
    res.json({ success: true, message: "Logged out successfully" });
  });
}