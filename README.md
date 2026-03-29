# 🔷 EtherChat - Decentralized Web3 Chat Application

<div align="center">

![EtherChat Banner](https://img.shields.io/badge/EtherChat-Web3%20Chat-8B5CF6?style=for-the-badge&logo=ethereum&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)

**A decentralized chat application with Web3 wallet integration and local account creation**

[🌐 Live Demo](https://your-app.vercel.app) | [📚 Documentation](#features) | [🚀 Deploy to Vercel](#-deploy-to-vercel)

</div>

---

## ✨ Features

### 🔐 Authentication Options

#### Option A - Connect Web3 Wallet
- MetaMask wallet connection simulation
- Wallet address display with copy functionality
- ETH balance tracking
- Web3-native identity

#### Option B - Create Local Account ⭐
- **Username** (3-20 characters, alphanumeric + underscores)
- **Display Name** (2-30 characters)
- **Avatar Selection** (6 preset options)
- **Public/Private Account Toggle**
  - 🌐 **Public**: Profile visible to all users
  - 🔒 **Private**: Profile hidden from other users

### 💬 Chat Features
- Multiple channels (#general-lobby, #alpha-leaks, #defi-degens, etc.)
- Real-time message simulation
- Transaction hash generation for each message
- Block number auto-increment
- Bot responses for realistic chat experience
- Message status indicators (pending/confirmed)

### 👤 Profile Management
- View and edit profile settings
- Toggle account privacy (Public/Private)
- Copy wallet address
- View account type badge
- Disconnect/logout functionality

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Library |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |
| **Vite** | Build Tool |
| **Vercel** | Deployment |

---

## 🚀 Deploy to Vercel

### Method 1: One-Click Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hbtejas/Blockchain)

Click the button above to deploy instantly to Vercel.

### Method 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy the project
vercel

# Deploy to production
vercel --prod
```

### Method 3: GitHub Integration

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "feat: Add EtherChat application"
   git remote add origin https://github.com/hbtejas/Blockchain.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration
   - Click **Deploy**

### Method 4: Manual Deploy

1. Build the project:
   ```bash
   npm install
   npm run build
   ```

2. Drag and drop the `dist` folder to [vercel.com/drop](https://vercel.com/drop)

---

## 📁 Project Structure

```
Blockchain/
├── vercel.json          # Vercel configuration
├── index.html           # Entry point
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
├── tailwind.config.js   # Tailwind config
├── src/
│   ├── main.tsx         # React entry
│   ├── App.tsx          # Main application
│   ├── index.css        # Global styles
│   └── utils/
│       └── cn.ts        # Utility functions
└── public/              # Static assets
```

---

## ⚙️ Environment Variables

No environment variables are required for this project. The application runs entirely on the client side.

---

## 🔧 Local Development

```bash
# Clone the repository
git clone https://github.com/hbtejas/Blockchain.git
cd Blockchain

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📊 Option B Feature Documentation

### Create Account Flow

```
┌─────────────────┐
│   Sign In Btn   │
└────────┬────────┘
         ▼
┌─────────────────┐
│  Auth Choice    │
│  ┌───────────┐  │
│  │ Option A  │  │     ┌─────────────────┐
│  │ Option B  │──────▶│ Create Account   │
│  └───────────┘  │    │ Form            │
└─────────────────┘    │ ┌─────────────┐ │
                       │ │ Username    │ │
                       │ │ Display Name│ │
                       │ │ Avatar      │ │
                       │ │ Privacy     │ │
                       │ └─────────────┘ │
                       │    [Create]     │
                       └────────┬────────┘
                                ▼
                       ┌─────────────────┐
                       │ Chat Dashboard │
                       └─────────────────┘
```

### Privacy Toggle

| Mode | Icon | Visibility |
|------|------|------------|
| Public | 👁️ | Profile visible to all users |
| Private | 👁️‍🗨️ | Profile hidden from other users |

---

## 🎨 Screenshots

| Screen | Description |
|--------|-------------|
| Login | Auth choice modal with Option A & B |
| Create Account | Form with username, display name, avatar, privacy |
| Chat | Main chat interface with channels and messages |
| Profile | User profile with privacy settings |

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Tejas H B**
- GitHub: [@hbtejas](https://github.com/hbtejas)

---

<div align="center">

⭐ Star this repo if you found it helpful!

</div>
