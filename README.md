# Stora – Storage Management System

A **Next.js monolithic web application** for managing files and folders, inspired by Google Drive. It provides secure upload, folder organization, file sharing, and user management all built with a modern full-stack architecture.
*File upload and management features run via internal API routes for enhanced control and scalability.*

## Demo

* 🌐 Live App: [https://stora-storage-management.vercel.app](https://stora-storage-management.vercel.app)
* 📂 Repository: [GitHub](https://github.com/ubaydillah1/-stora-storage-management.git)

🧑‍💻 Test Account

* User: [user@gmail.com](mailto:user@gmail.com) / user123

## About

**Stora** is a full-featured cloud storage management system that combines both backend and frontend inside a single **Next.js monolith**.
It allows users to upload, view, organize, and manage files and folders securely. Each user’s files are stored and isolated with authentication-based access.
Supports folder hierarchy, metadata tracking, storage limits, and file type filtering.

## Features

* 📁 File and folder CRUD (create, rename, delete)
* ☁️ File upload and storage via Supabase Storage
* 🔐 Custom JWT-based authentication system
* 👥 User-based file access and ownership
* 📤 Shareable file links with permission control
* 📊 Dashboard to track usage and storage size
* 🧾 File metadata (type, size, created date, owner)
* 🌙 Dark mode and responsive UI

## Technology

Built using **Next.js** monolithic architecture for full-stack capabilities.
Implements **Prisma ORM** for database modeling and queries, while **Supabase Storage** handles secure file uploads.
Authentication and authorization are handled with a custom **JWT-based system**, providing better control over session lifecycle.

## Key Stack

* ⚡ Next.js (Monolith)
* 🔐 JWT Authentication
* 🛠️ Prisma ORM
* 🗄️ Supabase Storage / PostgreSQL
* 💾 Cloud Upload System
* ☁️ Vercel

## Installation

Clone the repository:

```bash
git clone https://github.com/ubaydillah1/-stora-storage-management.git
cd -stora-storage-management
```

Install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

## Environment Variables

Create a `.env` file in the root directory with the following:

```bash
NODE_ENV=
JWT_SECRET=

DATABASE_URL=
DIRECT_URL=

SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_BUCKET_NAME=

MAX_UPLOAD_SIZE=
```

Fill these values according to your configuration (JWT secret, Supabase credentials, and database URLs).

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The app will start on http://localhost:3000
