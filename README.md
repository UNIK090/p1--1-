# LearnSync - YouTube Learning Progress Tracker

A full-stack Next.js application that helps you track your YouTube learning progress, organize playlists, and build consistent learning habits.

## 🚀 Features

### Core Functionality
- **YouTube Integration**: Real YouTube API integration for playlist and video data
- **Progress Tracking**: Track completion status of individual videos
- **Learning Analytics**: Detailed insights with interactive charts
- **Streak Management**: Build and maintain daily learning streaks
- **Folder Organization**: Organize playlists into custom folders

### Advanced Features
- **Real-time Search**: Search YouTube for educational content
- **Channel Browser**: Discover and explore educational channels
- **Interactive Calendar**: Visual learning activity heatmap
- **Goal Setting**: Set and track daily/weekly learning goals
- **Export/Import**: Export your learning data
- **Social Features**: Share progress and achievements

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: NextAuth.js with Google OAuth
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **API**: YouTube Data API v3

## 📋 Prerequisites

Before running this application, you need:

1. **Google OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

2. **YouTube Data API Key**
   - In the same Google Cloud project
   - Enable YouTube Data API v3
   - Create an API key credential
   - Restrict the key to YouTube Data API v3 (recommended)

## 🚀 Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd learnsync
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your credentials:
   \`\`\`env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   YOUTUBE_API_KEY=your-youtube-api-key-here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configure the consent screen if prompted
6. Set application type to "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### YouTube API Setup
1. In the same Google Cloud project
2. Navigate to "APIs & Services" > "Library"
3. Search for "YouTube Data API v3" and enable it
4. Go to "Credentials" and create an API key
5. Restrict the API key to YouTube Data API v3 for security

## 📁 Project Structure

\`\`\`
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth.js configuration
│   │   ├── youtube/       # YouTube API integration
│   │   ├── folders/       # Folder management
│   │   └── playlists/     # Playlist management
│   ├── dashboard/         # Dashboard page
│   ├── calendar/          # Calendar view
│   ├── analytics/         # Analytics dashboard
│   ├── settings/          # User settings
│   └── browse/            # Content discovery
├── components/            # Reusable React components
├── lib/                   # Utility functions
└── public/               # Static assets
\`\`\`

## 🎯 Key Features Explained

### YouTube Integration
- **Real API Integration**: Fetches actual playlist and video data from YouTube
- **Smart URL Parsing**: Automatically extracts playlist IDs from YouTube URLs
- **Video Duration**: Displays actual video durations from YouTube
- **Channel Information**: Shows channel details and subscriber counts

### Progress Tracking
- **Video-level Tracking**: Mark individual videos as complete/incomplete
- **Automatic Calculations**: Progress percentages calculated in real-time
- **Streak Management**: Track daily learning streaks
- **Goal Setting**: Set and monitor learning goals

### Analytics Dashboard
- **Interactive Charts**: Multiple chart types using Recharts
- **Learning Patterns**: Analyze your learning habits and peak times
- **Progress Insights**: Detailed breakdowns by category and time period
- **Export Functionality**: Download your learning data

## 🔒 Security Features

- **OAuth Authentication**: Secure Google OAuth integration
- **API Key Protection**: YouTube API key secured server-side
- **Session Management**: Secure session handling with NextAuth.js
- **CORS Protection**: Proper API route protection

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update Google OAuth redirect URIs with your production domain
5. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- YouTube Data API for providing access to YouTube content
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Recharts for beautiful, composable charts
- All the open-source contributors who made this possible

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Happy Learning! 🎓**
