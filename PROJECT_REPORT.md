# EtherChat - Decentralized Chat Application
## Technical Project Report
### Option B: Local Account Creation System

---

## 1. PROJECT OVERVIEW

### 1.1 Project Name
**EtherChat** - A Web3 Decentralized Chat Application

### 1.2 Project Type
Full-stack Web Application (React + TypeScript)

### 1.3 Core Functionality
EtherChat is a decentralized chat application that allows users to connect via two methods:
- **Option A**: Connect Web3 Wallet (MetaMask/WalletConnect)
- **Option B**: Create Local Account (Traditional registration without blockchain)

### 1.4 Target Users
- Cryptocurrency enthusiasts
- Web3 developers and communities
- Anyone seeking decentralized communication platforms

---

## 2. OPTION B: LOCAL ACCOUNT CREATION SYSTEM

### 2.1 Feature Description

Option B provides a traditional account creation system for users who want to join EtherChat without connecting a Web3 wallet. This feature enables broader accessibility to the platform.

### 2.2 Technical Implementation

#### 2.2.1 Account Creation Form Fields

| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| Username | String | 3-20 chars, lowercase, alphanumeric + underscores | Unique identifier for the account |
| Display Name | String | 2-50 characters | Human-readable name shown in chat |
| Avatar | Image Selector | 6 predefined options | Visual representation of user |

#### 2.2.2 Avatar Selection System
Users can select from 6 predefined avatar options:
1. 🟣 Purple Orb
2. 🔵 Blue Sphere
3. 🟢 Green Circle
4. 🟠 Orange Flame
5. 🔴 Red Diamond
6. ⚪ White Star

### 2.3 User Flow Diagram

```
┌─────────────────────────────────────────┐
│         Landing Page                    │
│    "Connect to EtherChat"               │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Authentication Modal             │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │ Option A    │  │ Option B        │   │
│  │ Connect     │  │ Create Local    │   │
│  │ Wallet      │  │ Account         │   │
│  └─────────────┘  └─────────────────┘   │
└─────────────────┬───────────────────────┘
                  │
                  ▼ (Option B Selected)
┌─────────────────────────────────────────┐
│         Account Creation Form            │
│  - Username Input                        │
│  - Display Name Input                    │
│  - Avatar Selector                       │
│  - Public/Private Toggle                 │
│  - Create Account Button                │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Success State                    │
│  - Welcome Message                       │
│  - Navigate to Chat Interface            │
└─────────────────────────────────────────┘
```

---

## 3. PUBLIC/PRIVATE ACCOUNT SYSTEM

### 3.1 Feature Overview

EtherChat implements a dual-mode privacy system that gives users control over their profile visibility.

### 3.2 Account Privacy Modes

| Mode | Icon | Description | Visibility |
|------|------|-------------|------------|
| **Public** | 👁️ | Profile visible to all users | Full visibility |
| **Private** | 👁️‍🗨️ | Profile hidden from other users | Hidden except owner |

### 3.3 Privacy Toggle Implementation

```typescript
interface AccountPrivacy {
  mode: 'public' | 'private';
  lastUpdated: Date;
  canBeChanged: boolean;
}
```

### 3.4 Privacy Feature Flow

```
┌─────────────────────────────────────────┐
│         Profile Settings                 │
│  ┌─────────────────────────────────┐     │
│  │ Privacy Control                  │     │
│  │ ┌─────────┐  ┌────────────────┐  │     │
│  │ │ PUBLIC  │  │ ● PRIVATE      │  │     │
│  │ │  ( )    │  │   ( )         │  │     │
│  │ └─────────┘  └────────────────┘  │     │
│  │                                  │     │
│  │ 🔓 Private accounts hide:       │     │
│  │    - Profile details            │     │
│  │    - Username                   │     │
│  │    - Avatar                     │     │
│  │    - Join date                  │     │
│  └─────────────────────────────────┘     │
└─────────────────────────────────────────┘
```

---

## 4. TECHNICAL ARCHITECTURE

### 4.1 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 18 | UI Framework |
| Language | TypeScript | Type Safety |
| Styling | Tailwind CSS | Responsive Design |
| Icons | Lucide React | Icon System |
| Animations | Framer Motion | Smooth Transitions |
| State | React useState/useContext | State Management |
| Build Tool | Vite | Fast Development |

### 4.2 Component Architecture

```
src/
├── App.tsx                 # Main application component
├── components/
│   ├── Authentication/      # Auth-related components
│   │   ├── AuthChoice.tsx  # Option A/B selection
│   │   ├── CreateAccount.tsx # Account creation form
│   │   └── WalletConnect.tsx # Web3 connection
│   ├── Chat/               # Chat interface components
│   │   ├── Sidebar.tsx     # Channel navigation
│   │   ├── ChatArea.tsx    # Message display
│   │   └── MessageInput.tsx # Message composer
│   └── Profile/            # Profile management
│       └── ProfileSettings.tsx # Privacy controls
```

### 4.3 Data Models

#### User Account Schema (Local)
```typescript
interface LocalAccount {
  id: string;                    // UUID
  username: string;              // Unique username
  displayName: string;           // User's display name
  avatar: string;                // Avatar emoji
  accountType: 'local';          // Account type identifier
  privacy: 'public' | 'private'; // Privacy setting
  createdAt: Date;               // Account creation timestamp
  lastActive: Date;              // Last activity timestamp
}
```

#### Privacy Settings Schema
```typescript
interface PrivacySettings {
  mode: 'public' | 'private';
  showOnlineStatus: boolean;
  showJoinDate: boolean;
  allowDirectMessages: boolean;
}
```

---

## 5. SECURITY CONSIDERATIONS

### 5.1 Client-Side Security

| Feature | Implementation |
|---------|----------------|
| Input Validation | All form inputs sanitized before processing |
| XSS Prevention | React's built-in escaping prevents injection |
| Username Uniqueness | Client-side check before account creation |

### 5.2 Privacy Protections

- Private accounts have all profile data hidden from other users
- No real blockchain data stored for local accounts
- Session data cleared on browser close

### 5.3 Data Storage

| Data Type | Storage Method | Duration |
|-----------|----------------|----------|
| Account Info | React State (Memory) | Session only |
| Preferences | React State | Session only |
| Chat Messages | React State | Session only |

---

## 6. USER INTERFACE SPECIFICATIONS

### 6.1 Color Palette

| Purpose | Color | Hex Code |
|---------|-------|----------|
| Primary Background | Dark Navy | #0a0a0f |
| Secondary Background | Deep Purple | #1a1a2e |
| Accent Primary | Electric Purple | #8b5cf6 |
| Accent Secondary | Cyan | #06b6d4 |
| Text Primary | White | #ffffff |
| Text Secondary | Gray | #9ca3af |
| Success | Green | #22c55e |
| Warning | Amber | #f59e0b |

### 6.2 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headings | System Sans | 24px | Bold |
| Body | System Sans | 14px | Normal |
| Usernames | System Sans | 14px | Semibold |
| Timestamps | System Sans | 12px | Normal |

### 6.3 Component States

#### Create Account Button
| State | Appearance |
|-------|------------|
| Default | Purple gradient, full opacity |
| Hover | Brighter gradient, slight scale |
| Disabled | Gray, 50% opacity |
| Loading | Spinner animation |

#### Privacy Toggle
| State | Visual Indicator |
|-------|------------------|
| Public | Eye icon, purple highlight |
| Private | Eye-off icon, cyan highlight |

---

## 7. FEATURE SCREENSHOTS DESCRIPTIONS

### 7.1 Authentication Choice Modal
- **Layout**: Centered modal with backdrop blur
- **Content**: Two cards side by side
- **Option A Card**: Wallet icon, "Connect Web3 Wallet" title, purple border
- **Option B Card**: User Plus icon, "Create Local Account" title, cyan border

### 7.2 Account Creation Form
- **Layout**: Stacked form elements
- **Username Field**: Text input with @ prefix
- **Display Name Field**: Text input with user icon
- **Avatar Grid**: 2x3 grid of selectable avatars
- **Privacy Toggle**: Switch component with labels
- **Submit Button**: Full-width purple button

### 7.3 Profile Settings Panel
- **Layout**: Slide-in sidebar from right
- **Header**: User avatar, display name, username
- **Privacy Section**: Toggle switch with explanation
- **Account Info**: Account type badge, creation date
- **Actions**: Disconnect button

---

## 8. ADVANTAGES OF OPTION B

### 8.1 Accessibility Benefits
1. **No Wallet Required**: Users can join without cryptocurrency
2. **Lower Barrier to Entry**: Familiar registration experience
3. **Anonymous Usage**: No blockchain exposure

### 8.2 Privacy Benefits
1. **Complete Privacy Control**: Users choose visibility
2. **No Blockchain Trace**: No permanent record on blockchain
3. **Reversible Settings**: Can change privacy anytime

### 8.3 User Experience Benefits
1. **Faster Onboarding**: Quick account creation
2. **Familiar Patterns**: Traditional form-based signup
3. **Customizable Profile**: Avatar and display name options

---

## 9. FUTURE ENHANCEMENTS

| Feature | Description | Priority |
|---------|-------------|----------|
| Persistent Storage | Save accounts to localStorage | High |
| Password Protection | Add password to local accounts | Medium |
| Profile Editing | Edit username, avatar, display name | Medium |
| Account Export | Export account data as JSON | Low |
| Social Features | Add friends, direct messages | Low |

---

## 10. CONCLUSION

Option B - Create Local Account provides an essential alternative for users who want to experience EtherChat without the complexity of Web3 wallets. The inclusion of a Public/Private account system gives users granular control over their privacy, balancing the transparent nature of blockchain technology with traditional privacy expectations.

This feature demonstrates:
- Modern React development practices
- Type-safe TypeScript implementation
- Accessible UI/UX design
- Flexible authentication strategies
- Privacy-first thinking

---

## 11. REFERENCES

### Libraries Used
- React 18: https://react.dev/
- TypeScript: https://www.typescriptlang.org/
- Tailwind CSS: https://tailwindcss.com/
- Lucide React: https://lucide.dev/
- Framer Motion: https://www.framer.com/motion/

### Development Tools
- Vite: https://vitejs.dev/
- Node.js: https://nodejs.org/

---

**Report Generated for College Project Documentation**
**Project**: EtherChat - Decentralized Chat Application
**Feature**: Option B - Local Account Creation with Public/Private Privacy System
**Date**: 2026
