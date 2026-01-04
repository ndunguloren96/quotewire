# QuoteWire

QuoteWire is a modern, single-page application (SPA) designed to deliver profound, strategic, and user-centric quotes. It leverages the power of Next.js 16 (App Router), AWS DynamoDB for scalable storage, Clerk for secure authentication, and Google Gemini AI for personalized content generation.

## Features

-   **Daily Inspiration:** A curated "Quote of the Day" that refreshes daily.
-   **Random Discovery:** Instantly discover new profound thoughts from a vast database.
-   **Sharp Aesthetic:** A refined, "sharp" design language focusing on typography, minimalism, and Dark Mode support.
-   **Interactive Experience:** Like, copy, and share quotes seamlessly.
-   **Performance:** Optimized with Next.js App Router and Tailwind CSS.

## Tech Stack

-   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS (Sharp/Minimal Design + Dark Mode)
-   **Database:** AWS DynamoDB (Single Table Design)
-   **Authentication:** [Clerk](https://clerk.com/) (Soft Gate)
-   **AI Engine:** Google Gemini AI
-   **Icons:** Lucide React

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
    Rename `.env.local.example` to `.env.local` and fill in your keys.

4.  **Setup Database:**
    Run the setup script to create the DynamoDB table:
    ```bash
    npx tsx scripts/setup-db.ts
    ```

5.  **Seed Data:**
    Populate the database.
    ```bash
    # Bulk Seed (from external JSONs, ~6k+ quotes)
    npx tsx scripts/seed-bulk.ts

    # AI Seeding (Generates new quotes via Gemini)
    npx tsx scripts/seed-quotes.ts
    ```

6.  **Run Development Server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages and API routes
│   ├── api/             # Backend API endpoints
│   ├── layout.tsx       # Root layout with ThemeProvider
│   └── page.tsx         # Main View (Daily + Random)
├── components/          # UI Components
│   ├── QuoteCard.tsx    # Premium Card
│   └── ThemeToggle.tsx  # Light/Dark Mode Switcher
├── lib/                 # Utilities
└── proxy.ts             # Clerk Middleware
scripts/                 # Database setup and seeding
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source and available under the [MIT License](LICENSE).