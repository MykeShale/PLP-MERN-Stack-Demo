# 🚀 Deployment & DevOps Documentation: MERN Task Manager

## Overview
This document describes the complete deployment, CI/CD, environment configuration, and maintenance process for the MERN Task Manager application. It is based on the requirements from the Week 7 assignment and real project implementation.

---

## 1. Project Structure
- **Frontend:** React (Vite) app in `/client` (deployed to Netlify)
- **Backend:** Express.js API in `/server` (deployed to Render)
- **Database:** MongoDB Atlas

---

## 2. Preparing for Deployment

### Frontend (React)
- Production build with `npm run build` (outputs to `/client/dist`)
- Code splitting and optimized assets via Vite
- Environment variables managed via `.env` and Netlify/Vercel dashboard

### Backend (Express)
- Error handling and logging (morgan, error middleware)
- Secure HTTP headers (helmet)
- CORS configured for frontend domain
- Environment variables via `.env` and Render dashboard
- Health check endpoint: `/api/health`

### Database (MongoDB Atlas)
- Cluster created on MongoDB Atlas
- Database user with least privileges
- Connection string stored in backend `.env` as `MONGO_URI`

---

## 3. Deployment Steps

### Backend (Render)
1. **Create a new Web Service** on Render.
2. **Connect your GitHub repo** and select the `/server` directory.
3. **Set environment variables** in Render dashboard:
   - `MONGO_URI` (MongoDB Atlas connection string)
   - `JWT_SECRET` (JWT signing secret)
   - `FRONTEND_URL` (e.g., `https://your-frontend.netlify.app`)
4. **Build & Start Command:**
   - Build: *(none needed for Node.js)*
   - Start: `node index.js` or `npm start`
5. **Deploy** and note the backend URL (e.g., `https://your-backend.onrender.com`)
6. **(Optional) Set up custom domain and HTTPS** in Render settings.

### Frontend (Netlify/Vercel)
1. **Create a new site** and link your GitHub repo.
2. **Set build settings:**
   - Base directory: `/client`
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Set environment variable:**
   - `VITE_API_URL=https://your-backend.onrender.com/api/tasks`
4. **Deploy** and note the frontend URL (e.g., `https://your-frontend.netlify.app`)
5. **(Optional) Set up custom domain and HTTPS** in Netlify/Vercel settings.

---

## 4. Environment Variables

### Backend (`/server/.env` or Render dashboard)
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://your-frontend.netlify.app
```

### Frontend (`/client/.env` or Netlify/Vercel dashboard)
```
VITE_API_URL=https://your-backend.onrender.com/api/tasks
```

> **Note:** Never commit real `.env` files. Use `.env.example` for templates.

---

## 5. CI/CD Pipeline
- **GitHub Actions** (recommended):
  - Lint, test, and build on every push
  - Deploy to Render/Netlify/Vercel on successful build
- **Render/Netlify/Vercel**: Automatic deploys on push to main branch
- **Example workflow:**
  - Push code → GitHub Actions run tests → If successful, auto-deploy to hosting

---

## 6. Monitoring & Maintenance
- **Health check endpoint:** `/api/health` (used by Render for uptime monitoring)
- **Logging:** Morgan (backend), Netlify/Vercel/Render logs (frontend/backend)
- **Error tracking:** (Optional) Integrate Sentry or similar
- **Performance:** Use Render/Netlify/Vercel dashboards for resource monitoring
- **Backups:** Set up MongoDB Atlas backups
- **Maintenance:**
  - Regularly update dependencies
  - Monitor logs for errors
  - Document and test rollback procedures

---

## 7. Useful Links
- **Frontend (Live):** [https://plp-task-app.netlify.app](https://plp-task-app.netlify.app)
- **Backend (Live):** [https://week-7-devops-deployment-assignment-qyn7.onrender.com](https://week-7-devops-deployment-assignment-qyn7.onrender.com)
- **Backend Health Check:** [https://week-7-devops-deployment-assignment-qyn7.onrender.com/api/health](https://week-7-devops-deployment-assignment-qyn7.onrender.com/api/health)

---

## 8. Screenshots & CI/CD
### - Ci/CD Pipeline Screenshot:
[CI/CD Pipeline](/Screenshots/CI-CD.png)

---

## 9. Troubleshooting
- **CORS errors:** Ensure `FRONTEND_URL` in backend matches your deployed frontend (no trailing slash).
- **404 on login:** Ensure frontend uses `/api/auth/login` and backend route is `/api/auth/login`.
- **.env pushed to git:** Run `git rm --cached .env` and commit; ensure `.env` is in `.gitignore`.

---

## 10. References
- [Render Docs](https://render.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

**Congratulations! Your MERN app is now production-ready, CI/CD-enabled, and fully documented.**



