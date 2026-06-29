# Vercel Deployment Guide

Your GitHub repository is already connected to Vercel. Follow these steps to complete the deployment:

## 1. Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

## 2. Import the Project
- Look for "Castlekeep-ISS" in your projects (it may already be there if auto-imported)
- If not, click "Add New..." → "Project" and select "Castlekeep-ISS" from GitHub

## 3. Set Environment Variables
In the Vercel project settings, add these environment variables:

| Variable | Value |
|----------|-------|
| `DB_HOST` | `castleskeepprod-ro-1p.gslb4.comcast.com` |
| `DB_PORT` | `5432` |
| `DB_NAME` | `castlekeep` |
| `DB_USER` | `sryali755` |
| `DB_PASSWORD` | `CqTFbRlB` |
| `WRITER_API_KEY` | `wr-RhgO5xw1fPqGpq3-inAWTQ` |

## 4. Deploy
- Click the "Deploy" button
- Wait for the build to complete (should take 2-5 minutes)

## 5. Access Your Application
Once deployed, your app will be available at: `https://castlekeep-iss.vercel.app` (or similar)

Access the ISS Test Plan Generator at: `/iss`

## Troubleshooting
If the build fails:
1. Check the Vercel build logs for errors
2. Verify all environment variables are set correctly
3. The `.npmrc` file ensures `legacy-peer-deps=true` is used during npm install
4. The `vercel.json` config specifies the correct build command

## Local Testing
To test locally before deploying:
```bash
npm install --legacy-peer-deps
npm run build
npm run start
```
