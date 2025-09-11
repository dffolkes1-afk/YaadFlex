/**
 * CRITICAL SECURITY PATCH FOR YAADFLEX
 * =====================================
 * This file contains security fixes for critical vulnerabilities found in the application
 */

import { RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';

// File upload security configuration
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'audio/wav',
  'application/pdf'
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB max

// Validate file uploads
export function validateFileUpload(fileName: string, fileSize?: number): { valid: boolean; error?: string } {
  // Check for path traversal attempts
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return { valid: false, error: 'Invalid file name - path traversal detected' };
  }
  
  // Check file extension
  const ext = fileName.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mp3', 'wav', 'pdf'];
  
  if (!ext || !allowedExtensions.includes(ext)) {
    return { valid: false, error: `File type not allowed. Allowed types: ${allowedExtensions.join(', ')}` };
  }
  
  // Check file size if provided
  if (fileSize && fileSize > MAX_FILE_SIZE) {
    return { valid: false, error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB` };
  }
  
  return { valid: true };
}

// Rate limiting for API endpoints
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Strict rate limiting for file uploads
export const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Only 10 uploads per 15 minutes
  message: 'Upload limit exceeded. Please try again later.'
});

// Authentication middleware for production
export const requireAuth: RequestHandler = (req, res, next) => {
  // Check if user is authenticated
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  // Check for API key authentication (for automated services)
  const apiKey = req.headers['x-api-key'];
  if (apiKey && process.env.YAADFLEX_API_KEY && apiKey === process.env.YAADFLEX_API_KEY) {
    return next();
  }
  
  // Not authenticated
  return res.status(401).json({ 
    error: 'Authentication required',
    message: 'Please log in to access this resource'
  });
};

// Sanitize user input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Security headers middleware
export const securityHeaders: RequestHandler = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://replit.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "connect-src 'self' wss: https:;"
  );
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};

// Input validation for common attack vectors
export function validateSafeString(input: string, maxLength: number = 1000): boolean {
  // Check length
  if (input.length > maxLength) return false;
  
  // Check for SQL injection patterns
  const sqlPatterns = [
    /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bUNION\b)/i,
    /(\bOR\b\s+\d+\s*=\s*\d+)/i,
    /(--|\bEXEC\b|\bEXECUTE\b)/i
  ];
  
  for (const pattern of sqlPatterns) {
    if (pattern.test(input)) return false;
  }
  
  // Check for script injection
  if (/<script|<\/script|javascript:|on\w+\s*=/i.test(input)) {
    return false;
  }
  
  return true;
}

// Session security configuration
export const sessionConfig = {
  secret: process.env.SESSION_SECRET || (() => {
    console.error('⚠️ WARNING: SESSION_SECRET not set! Using random secret for this session only.');
    return require('crypto').randomBytes(64).toString('hex');
  })(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// Log security events
export function logSecurityEvent(event: string, details: any) {
  console.log(`[SECURITY] ${new Date().toISOString()} - ${event}`, {
    ...details,
    timestamp: Date.now()
  });
}

export default {
  validateFileUpload,
  apiRateLimiter,
  uploadRateLimiter,
  requireAuth,
  sanitizeInput,
  securityHeaders,
  validateSafeString,
  sessionConfig,
  logSecurityEvent
};