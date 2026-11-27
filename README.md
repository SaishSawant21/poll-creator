# Pollify 📊

A modern, full-stack polling application where users can create, share, and vote on polls with live, interactive charts.

🔗 **Live Demo:** [https://polify-six.vercel.app/](https://polify-six.vercel.app/)

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **React Version:** React 19
- **Styling:** Tailwind CSS v4, shadcn/ui, Lucide Icons
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma 8 (Release Candidate, Contract-based workflow)
- **Authentication:** Custom JWT sessions with HTTP-Only Cookies
- **Charts:** React Google Charts
- **Form Handling:** React Hook Form

## ✨ Features

- **Secure Authentication:** User registration, login, and protected API routes using a custom `withAuth` Higher-Order Function. JWT tokens are stored securely in HTTP-only cookies.
- **Dynamic Poll Creation:** Create polls with dynamic options. Users can seamlessly add or remove options before publishing.
- **Voting Modes & Privacy:** Support for `PUBLIC`, `UNLISTED`, and `PRIVATE` polls, as well as `ANYONE` vs. `LOGIN_REQUIRED` voting modes.
- **Anti-Spam Voting:** Enforces one vote per user/guest per poll using database-level unique constraints and strict `@@check` identities (preventing duplicate votes from authenticated users and anonymous tokens).
- **Live Results:** Real-time results displayed with responsive Google Bar Charts.
- **Modern UI/UX:** Indigo/Slate theme, glassmorphism effects, and Sonner Toast notifications for user feedback.
- **Responsive:** Mobile-friendly layouts across the entire platform.

## 📈 Architecture Highlights

- **Controller/Service Layer Pattern:** Business logic is separated from Next.js Route Handlers, making the code modular, testable, and clean.
- **Database Integrity:** Utilizes Prisma 8's contract system to enforce strict SQL constraints, including composite foreign keys and identity checks at the database level.
- **Higher-Order Functions:** API routes are protected using a reusable `withAuth` HOF, eliminating repetitive authentication logic across the backend.
- **Suspense Boundaries:** Properly utilizes React `<Suspense>` to handle Next.js 16 dynamic routing and hydration boundaries cleanly.

## 🛠️ Local Development

1. **Clone the repository:**

   ~~~bash
   git clone https://github.com/SaishSawant21/poll-creator.git
   cd poll-creator
   ~~~

2. **Install dependencies:**

   ~~~bash
   npm install
   ~~~

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:

   ~~~env
   # Your Neon Serverless PostgreSQL connection string
   DATABASE_URL="postgresql://your_neon_db_connection_string?sslmode=require&connect_timeout=15"

   # A secure secret string for signing JWT tokens
   JWT_SECRET="your_super_secret_jwt_key_here"
   ~~~

4. **Synchronize the Prisma 8 Contract:**

   Generate the Prisma contract and update the database schema:

   ~~~bash
   npx prisma contract emit
   npx prisma db update
   ~~~

5. **Run the development server:**

   ~~~bash
   npm run dev
   ~~~

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.