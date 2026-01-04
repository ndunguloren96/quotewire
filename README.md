# QuoteWire

QuoteWire is a modern, single-page application (SPA) designed to deliver profound, strategic, and user-centric quotes. It leverages the power of Next.js 16 (App Router), AWS DynamoDB for scalable storage, Clerk for secure authentication, and Google Gemini AI for personalized content generation.

## Features

-   **Daily Inspiration:** A curated "Quote of the Day" that refreshes daily.
-   **AI-Powered Personalization:** The "For You" tab uses Google Gemini AI to suggest quotes based on your likes and interests.
-   **Smart Discovery:** Browse quotes by category (A-Z) or search by author/keyword.
-   **Interactive Experience:** Like, copy, and share quotes seamlessly.
-   **Push Notifications:** Subscribe to receive daily inspiration directly to your device.
-   **Performance:** Optimized with Next.js App Router, Tailwind CSS, and Framer Motion for smooth transitions.

## Tech Stack

-   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **Database:** AWS DynamoDB (Single Table Design)
-   **Authentication:** [Clerk](https://clerk.com/)
-   **AI Engine:** Google Gemini AI (via Vercel AI SDK / Google Generative AI SDK)
-   **Icons:** Lucide React
-   **Animations:** Framer Motion

## Getting Started

### Prerequisites

-   Node.js (v18+)
-   AWS Account (for DynamoDB)
-   Clerk Account (for Auth)
-   Google Cloud/AI Studio Account (for Gemini API)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/quotewire.git
    cd quotewire
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Rename `.env.local.example` to `.env.local` and fill in your keys:
    ```bash
    cp .env.local.example .env.local
    ```
    Required keys:
    -   `AWS_ACCESS_KEY_ID`
    -   `AWS_SECRET_ACCESS_KEY`
    -   `AWS_REGION`
    -   `GEMINI_API_KEY`
    -   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
    -   `CLERK_SECRET_KEY`

4.  **Setup Database:**
    Run the setup script to create the DynamoDB table:
    ```bash
    npx tsx scripts/setup-db.ts
    ```

5.  **Seed Data:**
    Populate the database with initial quotes using AI or fallback data:
    ```bash
    # AI Seeding (requires Gemini Key)
    npx tsx scripts/seed-quotes.ts

    # Fallback Seeding (static data)
    npx tsx scripts/seed-fallback.ts
    ```

6.  **Run Development Server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages and API routes
│   ├── api/             # Backend API endpoints (Daily, Random, AI, etc.)
│   ├── layout.tsx       # Root layout with Clerk provider and Service Worker
│   └── page.tsx         # Main SPA view (Tabs: Daily, For You, Discover)
├── components/          # Reusable UI components (QuoteCard, CategorySidebar)
├── lib/                 # Utilities (DynamoDB client, Categories list)
└── proxy.ts             # Clerk Authentication Middleware
scripts/                 # Database setup and seeding scripts
public/                  # Static assets and Service Worker (sw.js)
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source and available under the [MIT License](LICENSE).