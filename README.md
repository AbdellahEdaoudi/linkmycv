<div align="center">

# LinkMyCV

**Your CV in a Single, Shareable Link.**

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)

[🌐 Live Demo](https://linkmycv.site) · [📬 Contact](https://linkmycv.site/contact) · [🔐 Register](https://linkmycv.site/auth/register)

</div>

---

## 📖 About

**LinkMyCV** is a modern web platform that lets professionals share their entire resume — experience, skills, education, and contact channels — through a single clean link.

No more heavy PDF attachments. Just share `linkmycv.site/yourname` everywhere.

---

## ✨ Features

- 🔗 **Personal Link** — Get your own `linkmycv.site/username` page instantly
- 📄 **PDF Export** — Download a clean resume PDF anytime
- 📱 **QR Code** — Auto-generated QR code for your CV link
- 🌍 **Multilingual CV** — Support for 20+ languages
- ✏️ **Live Editing** — Update your CV anytime; visitors always see the latest version
- 🔒 **Secure Auth** — JWT-based authentication with HTTP-only cookies
- 📊 **Admin Dashboard** — Full admin panel to manage users and messages
- 📬 **Contact System** — Built-in contact & messaging system
- 🖼️ **Image Upload** — Cloudinary-powered profile photo upload with compression

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 3 |
| HTTP Client | Axios |
| Auth | JWT + HTTP-only Cookies |
| Image Hosting | Cloudinary |
| QR Code | qrcode.react |
| Analytics | Vercel Analytics |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 20.x`
- npm `>= 10.x`

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdellahEdaoudi/linkmycv.git
cd linkmycv

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Fill in your environment variables

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root with the following:

```env
NEXT_PUBLIC_SERVER_URL=https://your-api-url.com
NEXT_PUBLIC_CLIENT_URL=https://linkmycv.site
```

---

## 📁 Project Structure

```
front/
├── app/
│   ├── [username]/        # Public CV profile page
│   ├── admin/             # Admin panel
│   ├── auth/              # Login & Register
│   ├── contact/           # Contact & messages
│   ├── dashboard/         # User dashboard (edit CV)
│   ├── components/        # Shared UI components
│   └── utils/             # Utility helpers
├── public/                # Static assets & flags
└── tailwind.config.js
```

---

## 🔗 Related Repositories

- **Backend API:** [server-linkmycv](https://github.com/AbdellahEdaoudi/server-linkmycv)

---

## 👨‍💻 Author

**Abdellah Edaoudi**

[![GitHub](https://img.shields.io/badge/GitHub-AbdellahEdaoudi-181717?logo=github)](https://github.com/AbdellahEdaoudi)

---

<div align="center">

© 2024 LinkMyCV · All rights reserved.

</div>
