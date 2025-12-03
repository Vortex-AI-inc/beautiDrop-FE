# BeautyDrop AI

BeautyDrop AI is a modern, AI-powered platform designed to transform the beauty industry. It connects customers with salons while providing salon owners with powerful tools to manage their business, including AI voice agents, automated scheduling, and customer engagement features.

## 🚀 Key Features

### For Salon Owners (Business Portal)
*   **AI-Powered Management:** Leverage AI to automatically import services, pricing, and durations.
*   **Comprehensive Dashboard:** Manage your shop's profile, business hours, and staff members.
*   **Service Management:** Create and organize services with categories, prices, and durations.
*   **Staff Coordination:** Assign staff to specific services and manage their availability.
*   **Appointment Handling:** View and manage upcoming bookings and schedules.

### For Customers
*   **Seamless Booking:** Browse salons, view services, and book appointments instantly.
*   **Customer Dashboard:** Track upcoming and past appointments.
*   **Salon Discovery:** Find top-rated salons with detailed profiles and service lists.

## 🛠️ Tech Stack

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
*   **Language:** TypeScript
*   **Authentication:** [Clerk](https://clerk.com/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **UI Components:** [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
*   **Forms & Validation:** React Hook Form + Zod
*   **Charts:** Recharts

## 📦 Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Vortex-AI-inc/beautiDrop-FE
    cd beautiDrop-FE
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory and add your Clerk keys (see `CLERK_AUTH_NOTES.md` for details):
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
    CLERK_SECRET_KEY=your_secret_key
    NEXT_PUBLIC_BACKEND_URL=your_backend_url
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
/app
  ├── (auth)              # Authentication routes (login, signup)
  ├── (private)           # Protected routes
  │   ├── customer-dashboard  # Customer-facing dashboard
  │   └── portal              # Business/Shop owner portal
  ├── (public)            # Public marketing pages (About, Pricing, etc.)
  └── api                 # API routes
/components               # Reusable UI components
/lib                      # Utility functions and API clients
/types                    # TypeScript type definitions
```

## 🔐 Security

This project uses Clerk for secure authentication.
*   **Public Key:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (Safe for browser)
*   **Secret Key:** `CLERK_SECRET_KEY` (Server-side only)
