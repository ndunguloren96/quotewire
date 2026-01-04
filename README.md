# QuoteWire

QuoteWire is a modern, single-page application (SPA) designed to deliver profound, strategic, and user-centric quotes. It leverages the power of Next.js 16 (App Router), AWS DynamoDB for scalable storage, and Google Gemini AI for content generation and discovery.

## Features

-   **Daily Inspiration:** A curated "Quote of the Day" that refreshes daily.
-   **Random Discovery:** Instantly discover new profound thoughts from a vast database of thousands of quotes.
-   **Total Quote Counter:** Real-time counter showing the total number of quotes available on the platform.
-   **Sharp Aesthetic:** A refined, "sharp" design language focusing on typography, minimalism, and premium UX.
-   **Advanced Search:** Search for quotes by author or keywords with professionally handled empty states.
-   **Premium Dark Mode:** Custom-built, animated theme toggle with a smooth, high-quality feel.
-   **No Authentication Required:** A seamless, friction-free experience for all users.
-   **Mobile Friendly:** Fully responsive design that adapts beautifully to any device.
-   **SEO Optimized:** Comprehensive metadata for search engine visibility and social sharing.

## Tech Stack

-   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS (Sharp/Minimal Design + Custom Palettes)
-   **Database:** AWS DynamoDB (Single Table Design)
-   **AI Engine:** Google Gemini AI
-   **Icons:** Lucide React
-   **Animations:** Framer Motion

## Getting Started

### Prerequisites

-   Node.js (v18+)
-   AWS Account (for DynamoDB)
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
    Create a `.env.local` file and fill in your keys:
    ```bash
    AWS_ACCESS_KEY_ID=your_access_key
    AWS_SECRET_ACCESS_KEY=your_secret_key
    AWS_REGION=your_region
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Setup Database:**
    Run the setup script to create the DynamoDB table:
    ```bash
    npx tsx scripts/setup-db.ts
    ```

5.  **Seed Data:**
    Populate the database with thousands of quotes:
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
│   ├── api/             # Backend API endpoints (Daily, Random, Search, etc.)
│   ├── layout.tsx       # Root layout with SEO and ThemeProvider
│   └── page.tsx         # Main View (Daily + Random + Search)
├── components/          # Reusable UI Components
│   ├── Header.tsx       # Integrated, sticky header
│   ├── QuoteCard.tsx    # Premium sharp card component
│   └── ThemeToggle.tsx  # Custom animated theme switcher
├── lib/                 # Utilities (DynamoDB client, types)
scripts/                 # Database setup and seeding scripts
```

## Credits

Built by [@loren_kamau](https://x.com/loren_kamau)

## License

This project is open-source and available under the [MIT License](LICENSE).
