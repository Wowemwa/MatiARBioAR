
# MatiARBioAR 🌿

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/Wowemwa/MatiARBioAR)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3.1-purple.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.81.0-green.svg)](https://supabase.com/)

> **An Interactive Biodiversity Explorer Platform Using Augmented Reality and Web-Based Mapping for Environmental Education and Eco-Tourism in Mati City, Philippines**

A modern, comprehensive web application showcasing Mati City's rich biodiversity through interactive GIS mapping, species exploration, and cutting-edge AR technology. Built with React, TypeScript, and advanced web technologies for immersive environmental education.

## 🌟 Key Features

### 🗺️ **Interactive GIS Mapping**
- Real-time biodiversity hotspot visualization using Leaflet.js
- Multi-layer ecosystem mapping (Marine & Terrestrial)
- Geospatial data integration with WGS84 coordinate system
- Mobile-optimized touch controls and responsive cartography

### 🔬 **Scientific Species Database**
- Comprehensive database of scientifically documented species
- Advanced search and filtering capabilities
- Detailed species profiles with ecology, distribution, and conservation data
- High-quality imagery and taxonomic information

### 🥽 **Augmented Reality Experience**
- A-Frame-powered 3D experiences and environmental overlays
- Interactive species models and educational content
- Marker-based AR activation and mobile experiences
- WebXR framework for immersive learning

### 👑 **Professional Admin System**
- Complete CRUD operations for species and hotspot data
- Real-time analytics and reporting
- Secure authentication and session management
- Bulk data export capabilities

### 🎨 **Modern UI/UX Design**
- Glassmorphism design system with animated backdrops
- High-contrast navigation with dynamic gradient animations
- Responsive design optimized for all device sizes
- Dark/light theme support with smooth transitions

## 🛠️ Technology Stack

### **Core Framework**
- **React** 18.3.1 - Modern UI framework with hooks and concurrent features
- **TypeScript** 5.5.4 - Type-safe JavaScript for better developer experience
- **Vite** 5.3.1 - Fast build tool and development server

### **Frontend Technologies**
- **Tailwind CSS** 3.4.10 - Utility-first CSS framework
- **Lucide React** 0.553.0 - Modern icon system
- **React Router DOM** 6.30.1 - Client-side routing
- **React Icons** 5.5.0 - Popular icon library

### **Mapping & GIS**
- **Leaflet.js** 1.9.4 - Interactive maps and geospatial visualization
- **Leaflet Types** 1.9.8 - TypeScript definitions for Leaflet

### **Augmented Reality**
- **A-Frame** 1.7.1 - WebXR framework for immersive experiences
- **AR.js** 3.4.7 - Lightweight AR library

### **Database & Backend**
- **Supabase** 2.81.0 - Open source Firebase alternative
- **Firebase** 10.12.0 - Authentication and hosting services

### **Additional Libraries**
- **Fuse.js** 7.1.0 - Fuzzy search functionality
- **HTML2Canvas** 1.4.1 - Screenshot generation
- **clsx** 2.1.1 - Conditional CSS classes

### **Development Tools**
- **Vitest** 1.1.5 - Fast unit testing framework
- **ESLint** 8.49.0 - Code linting and formatting
- **PostCSS** 8.4.38 - CSS processing
- **Autoprefixer** 10.4.20 - CSS vendor prefixing

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (recommended: use nvm)
- **npm** or **yarn** package manager
- Modern web browser with camera support for AR features

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Wowemwa/MatiARBioAR.git
   cd MatiARBioAR
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env.local` (if exists)
   - Configure Supabase credentials
   - Set up Firebase configuration

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The application will automatically reload on changes

## 📖 Usage

### **For Users**
1. **Explore Biodiversity**: Browse species and hotspots on the interactive map
2. **View Species Details**: Click on markers to see detailed information
3. **Experience AR**: Use image markers to activate AR experiences
4. **Search & Filter**: Use the search functionality to find specific species

### **For Administrators**
1. **Login**: Access the admin panel with credentials
2. **Manage Data**: Add, edit, or delete species and hotspot information
3. **View Analytics**: Monitor user engagement and system performance
4. **Export Data**: Generate reports and export data in various formats

## 🏗️ Project Structure

```
MatiARBioAR/
├── 📂 public/
│   ├── 📂 ar-demo/          # AR demonstration files
│   ├── 📂 vendor/           # Third-party libraries
│   ├── index.html           # Main HTML template
│   ├── sw.js               # Service worker
│   └── site.webmanifest     # PWA manifest
├── 📂 src/
│   ├── 📂 components/       # Reusable UI components
│   │   ├── Admin*.tsx       # Admin interface components
│   │   ├── AR*.tsx          # AR-related components
│   │   ├── GIS*.tsx         # Mapping components
│   │   └── UI*.tsx          # Core UI elements
│   ├── 📂 context/          # React context providers
│   │   ├── DataContext.tsx  # Data management
│   │   └── AdminContext.tsx # Admin authentication
│   ├── 📂 data/             # Static data and schemas
│   ├── 📂 hooks/            # Custom React hooks
│   ├── 📂 pages/            # Route components
│   ├── 📂 services/         # API and external services
│   ├── 📂 styles/           # CSS and styling files
│   ├── 📂 utils/            # Utility functions
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── vite-env.d.ts        # Vite type definitions
├── 📂 db/                   # Database setup and migrations
├── 📄 package.json          # Dependencies and scripts
├── 📄 vite.config.ts        # Vite configuration
├── 📄 tailwind.config.js    # Tailwind CSS configuration
├── 📄 tsconfig.json         # TypeScript configuration
└── 📄 vercel.json           # Vercel deployment configuration
```

## 🧪 Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run build:analyze` | Build and analyze bundle size |
| `npm run preview` | Preview production build locally |
| `npm run ar:compile` | Generate AR target recognition data |
| `npm run optimize` | Build and preview optimized version |
| `npm run lint` | Run ESLint code linting |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |

## 🚀 Deployment

### **Vercel Deployment**
The application is configured for deployment on Vercel with the following features:
- SPA routing support via rewrites
- AR permissions policy headers
- Automatic HTTPS and global CDN

### **Environment Variables**
Required environment variables for production:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID

### **Build Commands**
```bash
# Production build
npm run build

# Preview build locally
npm run preview
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   npm run test
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure code passes linting

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

**Project Maintainer**: Wowemwa  
**Repository**: [github.com/Wowemwa/MatiARBioAR](https://github.com/Wowemwa/MatiARBioAR)  
**Issues**: [Report bugs or request features](https://github.com/Wowemwa/MatiARBioAR/issues)

### **Support**
- **Documentation**: Check this README and inline code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

---

<div align="center">

**Built with ❤️ for biodiversity conservation and environmental education**

*Mati City Biodiversity Explorer - Connecting people with nature through technology*

[![GitHub Stars](https://img.shields.io/github/stars/Wowemwa/MatiARBioAR?style=social)](https://github.com/Wowemwa/MatiARBioAR)
[![GitHub Forks](https://img.shields.io/github/forks/Wowemwa/MatiARBioAR?style=social)](https://github.com/Wowemwa/MatiARBioAR)

</div>