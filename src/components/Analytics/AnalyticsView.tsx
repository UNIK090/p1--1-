import React from 'react';
import { BarChart3, TrendingUp, Clock, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AnalyticsView: React.FC = () => {
  // Mock data for charts
  const weeklyData = [
    { day: 'Mon', minutes: 120 },
    { day: 'Tue', minutes: 90 },
    { day: 'Wed', minutes: 150 },
    { day: 'Thu', minutes: 80 },
    { day: 'Fri', minutes: 110 },
    { day: 'Sat', minutes: 200 },
    { day: 'Sun', minutes: 160 }
  ];

  const monthlyProgress = [
    { month: 'Jan', videos: 25, hours: 45 },
    { month: 'Feb', videos: 32, hours: 58 },
    { month: 'Mar', videos: 28, hours: 52 },
    { month: 'Apr', videos: 35, hours: 63 },
    { month: 'May', videos: 42, hours: 78 },
    { month: 'Jun', videos: 38, hours: 69 }
  ];

  const categoryData = [
    { name: 'Web Development', value: 35, color: '#3B82F6' },
    { name: 'Data Structures', value: 25, color: '#8B5CF6' },
    { name: 'IELTS Prep', value: 20, color: '#10B981' },
    { name: 'Design', value: 15, color: '#F59E0B' },
    { name: 'Others', value: 5, color: '#EF4444' }
  ];

  return (
    <div className="ml-64 p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        </div>
        <p className="text-gray-600">Detailed insights into your learning progress</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 rounded-lg p-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">127</div>
              <div className="text-sm text-gray-600">Videos Completed</div>
            </div>
          </div>
          <div className="text-sm text-green-600 font-medium">↑ 23% from last month</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 rounded-lg p-2">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">72h</div>
              <div className="text-sm text-gray-600">Total Watch Time</div>
            </div>
          </div>
          <div className="text-sm text-green-600 font-medium">↑ 18% from last month</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 rounded-lg p-2">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">85%</div>
              <div className="text-sm text-gray-600">Weekly Goal</div>
            </div>
          </div>
          <div className="text-sm text-blue-600 font-medium">510/600 minutes</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 rounded-lg p-2">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">6.2</div>
              <div className="text-sm text-gray-600">Avg. Daily Hours</div>
            </div>
          </div>
          <div className="text-sm text-green-600 font-medium">↑ 12% from last week</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="minutes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Learning Categories */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Learning Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Progress</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyProgress}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="videos" fill="#8B5CF6" />
            <Line yAxisId="right" type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsView;
