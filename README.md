
# CivicNow: Empowering Community Engagement

![CivicNow Logo](public/favicon.ico)

## 🏆 Hackathon Submission

This project is a submission for the [Hackathon Name] hackathon. CivicNow is a digital civic engagement platform that bridges the gap between local governments and their communities, making democratic participation more accessible, inclusive, and effective.

## 🌟 Vision & Mission

CivicNow reimagines how citizens interact with their local governments by providing a comprehensive digital platform for:

- **Transparent Legislative Tracking**: Citizens can follow local legislation in plain language
- **Community-Driven Decision Making**: Participate in community polls and voting
- **Direct Feedback Channels**: Submit and track feedback on community issues
- **Civic Budget Transparency**: Understand how tax money is being spent
- **Grassroots Initiative Support**: Launch and gather support for community initiatives

Our mission is to increase civic participation, especially among underrepresented communities, by lowering barriers to engagement and creating intuitive digital tools for democratic involvement.

## 🚀 Features

### 📜 Legislation Tracking
- Browse current and upcoming legislation
- Plain language summaries of complex legal documents
- Status tracking from proposal to implementation
- Email notifications for updates on followed legislation

### 🗳️ Community Voting
- Participate in community polls on local issues
- See real-time results and demographic breakdowns
- Support, oppose, or remain neutral on proposals
- Verified voting system using Supabase authentication

### 💬 Community Feedback
- Submit structured feedback on local services and issues
- Track the status of submitted feedback
- Upvote community issues to increase visibility
- Direct response from government officials

### 💰 Budget Transparency
- Interactive visualizations of municipal budgets
- Historical budget comparisons
- Project-specific expenditure tracking
- OCR document uploading for budget documents

### 🌱 Community Initiatives
- Launch grassroots community initiatives
- Gather digital signatures and support
- Track progress from proposal to implementation
- Coordinate volunteer efforts

### 👤 User Authentication
- Secure email and password authentication via Supabase
- Email verification to prevent fraud
- Password reset functionality
- User profile management

## 💻 Technology Stack

### Frontend
- **React**: Component-based UI library
- **TypeScript**: Static typing for robust code
- **Vite**: Fast build tooling and development server
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching and caching
- **Tailwind CSS**: Utility-first styling
- **Shadcn UI**: Pre-built accessible components
- **Lucide Icons**: Beautiful, consistent iconography
- **Recharts**: Data visualization components

### Backend
- **Supabase**: Backend-as-a-Service platform
  - Authentication
  - PostgreSQL Database
  - Storage
  - Edge Functions
  - Realtime subscriptions

## 🔧 Technical Implementation

### Authentication System
CivicNow uses Supabase Authentication for secure user management:
- Email/password authentication
- Email verification
- Password reset functionality
- Session management
- Protected routes for authenticated users

### Database Schema
The application uses a PostgreSQL database through Supabase with the following main tables:

- **users**: Extended user profile data
- **legislation**: Local laws and ordinances
- **polls**: Community voting initiatives
- **votes**: User votes on polls
- **feedback**: Community feedback and reports
- **initiatives**: Community-led projects
- **budget_items**: Municipal budget entries

### API Design
CivicNow implements a clean API pattern using custom hooks that interact with Supabase:

- Authentication API (`/src/lib/auth.ts`)
- Legislation API
- Voting API
- Feedback API
- Initiatives API
- Budget API

## 🏗️ Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── admin/         # Admin dashboard components
│   ├── auth/          # Authentication components
│   ├── budget/        # Budget visualization components
│   ├── feedback/      # Community feedback components
│   ├── impact/        # Impact visualization components
│   ├── initiatives/   # Community initiatives components
│   ├── layout/        # Layout components (navbar, footer)
│   ├── legislation/   # Legislation tracking components
│   ├── notifications/ # User notification components
│   ├── ui/            # Shadcn UI components
│   └── voting/        # Community voting components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and services
│   ├── auth.ts        # Authentication functions
│   ├── AuthContext.tsx # Authentication context provider
│   └── supabase.ts    # Supabase client configuration
├── pages/             # Page components
└── App.tsx            # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/civicnow.git
cd civicnow
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your Supabase project:
   - Create a new project in Supabase
   - Run the SQL setup scripts provided in `database/setup.sql`
   - Create the following tables:
     - polls
     - votes
     - feedback
     - initiatives
     - budget_items

4. Create a `.env.local` file with your Supabase credentials:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:5173](http://localhost:5173) to view the app

## 📱 Responsive Design

CivicNow is built with a mobile-first approach, ensuring a seamless experience across:
- Mobile phones
- Tablets
- Desktop computers
- Large displays

The UI adapts intelligently to different screen sizes while maintaining full functionality.

## ♿ Accessibility

We've prioritized accessibility throughout the application:
- WCAG 2.1 AA compliance
- Semantic HTML
- Proper ARIA attributes
- Keyboard navigation
- Screen reader compatibility
- Color contrast compliance
- Focus management

## 🔒 Security Considerations

CivicNow implements several security measures:
- Authentication via Supabase (industry-standard JWT)
- Input validation and sanitization
- CSRF protection
- XSS prevention
- Rate limiting on API endpoints
- Data encryption in transit and at rest
- Row-level security policies in Supabase

## 🔮 Future Enhancements

- **Multi-language Support**: Translations for diverse communities
- **Accessibility Improvements**: Further WCAG compliance
- **Mobile App**: Native mobile applications
- **Advanced Analytics**: Deeper insights into civic engagement
- **Integration with Government Systems**: API connections to municipal systems
- **Expanded Notification System**: SMS and push notifications
- **Community Forums**: Structured discussion spaces

## 👥 Team

- [Your Name] - Full Stack Developer
- [Team Member 2] - UX/UI Designer
- [Team Member 3] - Backend Developer
- [Team Member 4] - Product Manager

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Supabase for the powerful backend platform
- Shadcn UI for the beautiful component library
- The open source community for the amazing tools and libraries
- [Hackathon Name] for the opportunity to create civic technology

---

Built with ❤️ for communities everywhere.
