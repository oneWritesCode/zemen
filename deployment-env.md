# Deployment Environment Variables

## Required Environment Variables for Prisma

### Database Configuration
```
DATABASE_URL=postgresql://username:password@hostname:5432/database_name?sslmode=require
```

### For Neon Database specifically:
```
DATABASE_URL=postgresql://username:password@hostname.neon.tech/dbname?sslmode=require&connect_timeout=10
```

### Additional Environment Variables
```
NODE_ENV=production
```

## Platform-Specific Setup

### Vercel
1. Add DATABASE_URL to environment variables in Vercel dashboard
2. Ensure Prisma client generation is included in build script
3. Add `prisma` to `devDependencies` in package.json

### Netlify
1. Set environment variables in Netlify dashboard
2. Add build command: `npm run build`
3. Add `prisma generate` to postinstall script

### Docker
1. Copy .env.example to .env.production
2. Set DATABASE_URL in production environment
3. Run `prisma generate` during Docker build

## Common Issues & Solutions

### Issue: Prisma Client Not Found
- Solution: Add `prisma generate` to build script or postinstall

### Issue: Database Connection Failed
- Solution: Verify DATABASE_URL is correct and accessible
- Check if database allows connections from deployment platform

### Issue: SSL Certificate Issues
- Solution: Add `sslmode=require` to DATABASE_URL
- For Neon: `sslmode=verify-full` may be required

### Issue: Timeout Issues
- Solution: Add `connect_timeout=30` to DATABASE_URL
- Example: `postgresql://...?sslmode=require&connect_timeout=30`
