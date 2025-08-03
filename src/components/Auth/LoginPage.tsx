import React from 'react';
import { Play, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LoginPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left side - Hero */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-3">
                  <Play className="h-8 w-8 text-white" fill="currentColor" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Learn<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Sync</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">Track. Learn. Conquer.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Start Your Learning Journey
              </h2>
              
              <button
                onClick={handleSignIn}
                className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-3 group"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="group-hover:text-gray-900 transition-colors">Continue with Google</span>
              </button>
              
              <p className="text-sm text-gray-500 text-center mt-6">
                Sync your YouTube learning progress and build consistent habits
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Features */}
        <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center px-8 py-12">
          <div className="max-w-md w-full text-white">
            <h3 className="text-3xl font-bold mb-8">Why LearnSync?</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 rounded-lg p-2">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Organize Playlists</h4>
                  <p className="text-blue-100">Create folders for different subjects and track your progress across multiple YouTube playlists.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-white/20 rounded-lg p-2">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Build Streaks</h4>
                  <p className="text-blue-100">Maintain daily learning streaks and watch your consistency grow over time.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-white/20 rounded-lg p-2">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Visual Progress</h4>
                  <p className="text-blue-100">See your learning journey with beautiful calendar views and detailed analytics.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-white/10 rounded-xl backdrop-blur">
              <p className="text-sm text-blue-100">
                "LearnSync helped me maintain a 45-day learning streak and complete 12 courses this year!"
              </p>
              <p className="text-xs text-blue-200 mt-2">- Sarah, Full-Stack Developer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
