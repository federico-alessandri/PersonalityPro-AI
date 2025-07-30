# PersonalityPro AI - Installation Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or **yarn** 1.22.0+)
- **Git** for cloning the repository

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/PersonalityPro-AI.git
cd PersonalityPro-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Available Scripts

### Development
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint for code quality
```

### Testing
```bash
npm test             # Run test suite (if configured)
npm run test:watch   # Run tests in watch mode
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_APP_TITLE=PersonalityPro AI
VITE_API_BASE_URL=https://api.personalitypro.com
VITE_ANALYTICS_ID=your-analytics-id
```

### Vite Configuration
The `vite.config.js` is pre-configured for:
- React support
- Path aliases
- Build optimization
- Development server settings

## 🌐 Deployment

### Netlify (Recommended)
1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag and drop the `dist` folder to Netlify
   - Or connect your GitHub repository for automatic deployments

3. **Configure redirects**:
   The `public/_redirects` file is already configured for SPA routing.

### Vercel
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

### GitHub Pages
1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script** to `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

### Docker Deployment
1. **Create Dockerfile**:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
   ```

2. **Build and run**:
   ```bash
   docker build -t personalitypro-ai .
   docker run -p 3000:3000 personalitypro-ai
   ```

## 🔍 Troubleshooting

### Common Issues

#### Node Version Compatibility
```bash
# Check Node version
node --version

# Use Node Version Manager if needed
nvm install 18
nvm use 18
```

#### Dependency Conflicts
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors
```bash
# Check for TypeScript errors
npm run type-check

# Lint and fix code issues
npm run lint --fix
```

#### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

### Performance Optimization

#### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.js and run build
npm run build
```

#### Memory Issues
```bash
# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## 🛠️ Development Setup

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- Auto Rename Tag

### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "tailwindCSS.experimental.classRegex": [
    "tw`([^`]*)",
    "tw=\"([^\"]*)",
    "tw={\"([^\"}]*)",
    "tw\\.\\w+`([^`]*)",
    "tw\\(.*?\\)`([^`]*)"
  ]
}
```

### Git Hooks (Optional)
Install husky for pre-commit hooks:
```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

Add to `package.json`:
```json
{
  "lint-staged": {
    "*.{js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md}": ["prettier --write"]
  }
}
```

## 📱 Mobile Development

### PWA Configuration
The app includes basic PWA support. To enhance:

1. **Update manifest.json**:
   ```json
   {
     "name": "PersonalityPro AI",
     "short_name": "PersonalityPro",
     "description": "AI-powered personality assessment",
     "start_url": "/",
     "display": "standalone",
     "theme_color": "#366092",
     "background_color": "#ffffff"
   }
   ```

2. **Add service worker** for offline support

### Responsive Testing
```bash
# Test on different screen sizes
npm run dev

# Use browser dev tools or
# Install responsive design tester
npm install --save-dev @storybook/addon-viewport
```

## 🔐 Security Considerations

### Content Security Policy
Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

### Environment Variables
- Never commit `.env` files
- Use different configs for dev/prod
- Validate all environment variables

### Dependencies
```bash
# Audit dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

## 📊 Monitoring & Analytics

### Error Tracking
Integrate with services like:
- Sentry
- LogRocket
- Bugsnag

### Performance Monitoring
- Google Analytics
- Mixpanel
- Custom metrics

### Health Checks
```bash
# Add health check endpoint
# Monitor build status
# Set up alerts for downtime
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Standards
- Use ESLint configuration
- Follow React best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📞 Support

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check README.md and this guide
- **Community**: Join discussions in GitHub Discussions

### Reporting Issues
Include:
- Node.js version
- npm/yarn version
- Operating system
- Error messages
- Steps to reproduce

---

**Happy coding! 🚀**

