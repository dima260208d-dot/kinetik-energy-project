import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, UserActivity } from '@/types/auth';

interface ActivityHistoryProps {
  userActivities: UserActivity[];
  users: User[];
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ userActivities, users }) => {
  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle>📊 История активности</CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        <div className="space-y-2">
          {userActivities
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 20)
            .map(activity => {
              const user = users.find(u => u.id === activity.userId);
              return (
                <div key={activity.id} className="text-sm p-2 bg-gray-50 rounded">
                  <div className="font-medium">{user?.name || 'Неизвестный'}</div>
                  <div>{activity.details}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString('ru-RU')}
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityHistory;