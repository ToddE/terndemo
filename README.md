# Tern Mentoring Website

This is the modern, high-performance website for Tern Mentoring, built with **Astro 6** and **Tailwind CSS 4**.

## 🏗 Architecture & Design

The site is designed for maximum performance, SEO, and ease of use.

- **Frontend**: [Astro](https://astro.build/) (Static Site Generation)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using the new CSS-first engine)
- **CMS**: [Decap CMS](https://decapcms.org/) (Git-based, no database required)
- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Typography**: Outfit (Google Fonts)

### Design Features

- **Glassmorphism**: Modern, semi-transparent UI elements.
- **Dynamic Animations**: Smooth entry animations for headers and content.
- **Responsive**: Fully optimized for mobile, tablet, and desktop.
- **Global Design System**: Managed in `src/styles/global.css`.

---

## 🚀 Deployment Guide (For Developers)

### 1. Repository Setup

1. Create a new repository on GitHub.
2. Push the code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

### 2. Cloudflare Pages Configuration

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. Use the following build settings:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Environment variables**:
     - `NODE_VERSION`: `22` (or latest)

### 3. GitHub Actions (Optional)

A deployment workflow is included in `.github/workflows/deploy.yml`. To use it:

1. Generate a Cloudflare API Token.
2. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` to your GitHub Repository Secrets.

---

## 📝 Content Management (For Business Users)

The site features a built-in Content Management System (CMS) that allows you to update the website without touching any code.

### 1. Accessing the Admin Panel

- **Production**: Navigate to `https://your-domain.com/admin`
- **Local Development**: Run `npm run dev` and navigate to `http://localhost:4321/admin`.

**Note on Local Publishing**: In local development, the CMS uses a proxy server (`decap-server`) to write changes directly to your local files instead of committing to GitHub. This allows you to see content changes instantly in the dev server.

### 2. Updating Content & Editorial Workflow

Decap CMS uses a Git-based workflow, meaning every save or publish action translates to a Git commit in the repository.

- **Pages**: Edit the static content for Home, About, and Solution pages.
- **News & Resources**: Create new articles, whitepapers, or research reports.
- **Podcasts**: Add new episodes by selecting the "Podcast" category. You can embed audio using standard iframe tags in the Markdown body.
- **Media**: Upload images directly through the CMS. They are saved to `public/images/uploads` and automatically optimized by Astro during the build process.

**Drafts vs. Publishing**:

1. **Save Draft**: If you enable the Editorial Workflow in `config.yml`, saving creates a pull request.
2. **Publish**: Clicking "Publish" commits the changes to the `main` branch.

### 3. How Publishing Works

When you click **"Publish"** in the CMS:

1. The CMS creates a new commit in your GitHub repository on the `main` branch.
2. Cloudflare Pages automatically detects the new commit via its GitHub integration.
3. The site is rebuilt securely and deployed globally to the edge network (takes ~1-2 minutes).

### 4. Managing Menus

Menus are currently managed in `src/components/Header.astro`. To add a new navigation item, a developer will need to update the `navItems` array in that file.

---

## 🛠 Development & Testing

### Local Setup

```bash
npm install
npm run dev
```

### Build & Verify

Before publishing, you can run a build and verification locally:

```bash
npm run build
```

This runs `astro build` followed by a verification script in `scripts/verify-build.js` to ensure all pages were generated correctly.

### Project Structure

- `src/content/`: All Markdown content (managed via CMS).
- `src/pages/`: Page templates and routing.
- `src/components/`: Reusable UI elements.
- `src/styles/`: Global CSS and Tailwind configurations.
- `public/admin/`: Decap CMS configuration.

todd
