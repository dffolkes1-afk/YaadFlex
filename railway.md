# YaadFlex Railway Deployment Guide

## Environment Variables for Railway

Set these environment variables in your Railway project:

### Required for Production
```bash
NODE_ENV=production
PORT=${PORT}  # Railway provides this automatically
```

### Database (if using external database)
```bash
DATABASE_URL=your_postgresql_connection_string
```

### Authentication (Optional - leave unset to disable auth)
```bash
SESSION_SECRET=your_secure_random_session_secret
RAILWAY_DOMAINS=your-app.up.railway.app,your-custom-domain.com
# Or use generic: ALLOWED_DOMAINS=your-app.up.railway.app
```

### API Keys (Optional - only set if using these services)
```bash
STRIPE_SECRET_KEY=sk_live_...
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
SENDGRID_API_KEY=SG....
OPENAI_API_KEY=sk-...
```

## Deployment Configuration

The app is now configured to work with Railway:
- ✅ CORS configured for Railway domains (*.railway.app, *.up.railway.app)
- ✅ Dynamic PORT handling (Railway assigns random ports)
- ✅ Production build outputs to correct directory
- ✅ Static assets served correctly in production mode
- ✅ Auth system works without REPLIT_DOMAINS dependency
- ✅ Domain detection includes Railway platforms

## Build Command
```bash
npm run build
```

## Start Command  
```bash
npm start
```

## Railway Deploy Steps

1. Connect your repository to Railway
2. Set environment variables in Railway dashboard
3. Railway will automatically:
   - Run `npm install`
   - Run `npm run build` 
   - Run `npm start`
   - Assign a domain like `your-app.up.railway.app`

## Post-Deployment

After deployment:
- Your app will be accessible at `https://your-app.up.railway.app`
- The live status indicator will show "PUBLIC" status
- All YaadFlex features will work on the Railway domain
- CORS is pre-configured to allow your Railway domain

## Troubleshooting

If the app doesn't start:
1. Check Railway logs for any missing environment variables
2. Ensure DATABASE_URL is set if using database features
3. Verify all required dependencies are in package.json

## Custom Domain

To use a custom domain:
1. Add your domain in Railway settings
2. Update RAILWAY_DOMAINS or ALLOWED_DOMAINS to include your custom domain
3. Configure DNS to point to Railway