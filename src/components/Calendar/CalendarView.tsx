import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView: React.FC = () => {
  // Mock data for demonstration
  const generateCalendarData = () => {
    const data = [];
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1);
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Random learning activity for demo
      const hasActivity = Math.random() > 0.3;
      const intensity = hasActivity ? Math.floor(Math.random() * 4) + 1 : 0;
      
      data.push({
        date: date.toISOString().split('T')[0],
        count: intensity,
        level: intensity
      });
    }
    return data;
  };

  const calendarData = generateCalendarData();
  
  const getIntensityColor = (level: number) => {
    const colors = [
      'bg-gray-100', // No activity
      'bg-green-200', // Low
      'bg-green-300', // Medium
      'bg-green-500', // High
      'bg-green-600'  // Very high
    ];
    return colors[level] || colors[0];
  };

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="ml-64 p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Learning Calendar</h1>
        </div>
        <p className="text-gray-600">Track your daily learning progress over time</p>
      </div>

      {/* Calendar Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900 mb-1">247</div>
          <div className="text-sm text-gray-600">Total learning days</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900 mb-1">12</div>
          <div className="text-sm text-gray-600">Current streak</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900 mb-1">23</div>
          <div className="text-sm text-gray-600">Longest streak</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900 mb-1">68%</div>
          <div className="text-sm text-gray-600">This year</div>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">12 months of learning activity</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getIntensityColor(level)}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">More</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Month labels */}
            <div className="flex gap-1 mb-2 ml-8">
              {months.map((month, index) => (
                <div key={month} className="text-xs text-gray-600 w-16 text-center">
                  {index % 2 === 0 ? month : ''}
                </div>
              ))}
            </div>
            
            {/* Weekday labels and calendar grid */}
            <div className="flex gap-1">
              <div className="flex flex-col gap-1 mr-2">
                {weekdays.map((day, index) => (
                  <div key={day} className="text-xs text-gray-600 h-3 flex items-center">
                    {index % 2 === 1 ? day : ''}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-53 gap-1">
                {calendarData.map((day, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-sm ${getIntensityColor(day.level)} hover:ring-2 hover:ring-gray-400 cursor-pointer transition-all`}
                    title={`${day.date}: ${day.count} learning sessions`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 text-xs text-gray-600">
          <p>Each square represents a day. Darker squares indicate more learning activity.</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { date: 'Today', activity: 'Completed 3 videos in "React Fundamentals"', time: '2h 15m' },
            { date: 'Yesterday', activity: 'Watched 2 videos in "JavaScript Algorithms"', time: '1h 30m' },
            { date: '2 days ago', activity: 'Finished playlist "CSS Grid Mastery"', time: '3h 45m' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <div className="font-medium text-gray-900">{item.activity}</div>
                <div className="text-sm text-gray-600">{item.date}</div>
              </div>
              <div className="text-sm text-blue-600 font-semibold">{item.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
