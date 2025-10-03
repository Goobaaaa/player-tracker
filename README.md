# Player Tracker

A dark-themed, modern web application to track players' assets, finances, tasks, and documents for video game settings.

## Features

- **Authentication**: Secure login system with Supabase
- **Dashboard**: Overview with summary widgets, task lists, and activity feed
- **Player Management**: Add, view, and manage players with detailed profiles
- **Asset & Finance Tracking**: Track player assets, valuations, and financial transactions
- **Document Management**: Upload files and link Google Docs
- **Task Management**: Create, assign, and track tasks with progress indicators
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Sleek, modern interface with dark theme

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Query
- **UI Components**: Radix UI with custom styling

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase project (create at [supabase.com](https://supabase.com))
- Git installed

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd player-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   npm run setup
   ```
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   DATABASE_URL=your_database_url
   GOOGLE_DOCS_API_KEY=your_google_docs_api_key (optional)
   JWT_SECRET=your_jwt_secret (optional)
   ```

4. **Set up Supabase database**
   - Go to your Supabase project dashboard
   - Run the SQL migration script from `supabase/migrations.sql`
   - Set up Row Level Security (RLS) policies

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Schema

The application uses the following main tables:

- `users` - User authentication and roles
- `players` - Player profiles and information
- `assets` - Player assets and valuations
- `finance_transactions` - Player financial transactions
- `tasks` - Task management and assignments
- `documents` - File uploads and Google Docs links

### Seed Data

To populate the database with sample data:

```bash
npm run seed
```

Sample data includes:
- 5 players with aliases and notes
- Various assets (weapons, equipment, vehicles)
- Financial transactions
- 6 tasks with different statuses and priorities
- Sample documents

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
player-tracker/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── dashboard/       # Dashboard page
│   │   ├── players/         # Player management
│   │   ├── documents/       # Document management
│   │   ├── tasks/           # Task management
│   │   ├── settings/        # Settings and admin
│   │   └── login/           # Authentication
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components
│   │   └── ...             # Feature components
│   ├── lib/                # Utilities and configurations
│   └── types/              # TypeScript type definitions
├── supabase/               # Database migrations
├── scripts/                # Utility scripts
├── public/                 # Static assets
└── README.md
```

## API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/dashboard/summary` - Dashboard summary data
- `GET /api/players` - List and search players
- `POST /api/players` - Create new player
- `GET /api/players/[id]` - Player details
- `POST /api/players/[id]/assets` - Add asset to player
- `POST /api/documents` - Upload/create document
- `POST /api/tasks` - Create task
- `GET /api/tasks` - List tasks

## Security Features

- Password hashing via Supabase Auth
- Role-based access control (Admin/User)
- Input validation and sanitization
- Row Level Security (RLS) on database tables
- Environment variable configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the Supabase documentation
- Review the Next.js and Tailwind CSS documentation