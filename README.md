# Shahriar Assets

> **Architect Your Digital Legacy.**
> A curated arsenal of high-fidelity assets for the next generation of builders.

Shahriar Assets is a modern, high-performance digital asset marketplace built with the latest web technologies. It allows creators to sell digital products with a seamless user experience, from browsing to checkout and secure downloading.

![Project Banner](public/og-image.png)

## 🚀 Tech Stack

Built with a focus on performance, type safety, and developer experience.

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [Better Auth](https://www.better-auth.com/)
- **Payments:** [Stripe](https://stripe.com/)
- **Storage:** AWS S3 / Cloudflare R2
- **State Management:** [Nuqs](https://nuqs.47ng.com/) (URL-based state)

## ✨ Features

- **🛍️ Digital Storefront:** Clean, responsive grid layout for showcasing digital products.
- **🔐 Secure Authentication:** Robust user management using Better Auth.
- **💳 Payment Integration:** Seamless checkout flow with Stripe.
- **📦 Admin Dashboard:** Comprehensive tools to manage products, view orders, and handle functionality.
- **⬇️ Secure Downloads:** Presigned URLs for secure file delivery.
- **🎨 Modern UI/UX:** Glassmorphism effects, smooth animations, and dark mode support.

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v20+)
- pnpm (v9+)
- A PostgreSQL database (e.g., Neon)
- A Stripe account
- An S3-compatible storage bucket (e.g., Cloudflare R2)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/binary-daydream.git
    cd binary-daydream
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root directory and add the following:

    ```env
    # Database
    DATABASE_URL="postgresql://..."

    # Authentication (Better Auth)
    BETTER_AUTH_SECRET="your_generated_secret"
    BETTER_AUTH_URL="http://localhost:3000"

    # Stripe
    STRIPE_SECRET_KEY="sk_test_..."
    STRIPE_WEBHOOK_SECRET="whsec_..."
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

    # Storage (R2/S3)
    R2_ACCOUNT_ID="your_account_id"
    R2_ACCESS_KEY_ID="your_access_key"
    R2_SECRET_ACCESS_KEY="your_secret_key"
    R2_BUCKET_NAME="your_bucket_name"

    # App
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ```

4.  **Initialize the database:**

    Push the schema to your database:

    ```bash
    pnpm db:push
    ```

5.  **Run the development server:**

    ```bash
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📂 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (admin)/         # Admin dashboard routes
│   ├── (auth)/          # Authentication routes (sign-in, etc.)
│   ├── (root)/          # Public storefront routes
│   └── api/             # API routes
├── components/          # Reusable UI components
│   ├── admin/           # Admin-specific components
│   ├── store/           # Store-specific components
│   └── ui/              # Base UI components (buttons, inputs, etc.)
├── db/                  # Drizzle ORM schema and connection
├── lib/                 # Utility functions, hooks, and configuration
│   ├── auth.ts          # Authentication config
│   ├── stripe.ts        # Stripe config
│   └── r2.ts            # Storage config
└── hooks/               # Custom React hooks
```

## 📜 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript check
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:push` - Push schema changes to database

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
