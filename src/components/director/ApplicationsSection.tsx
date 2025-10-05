import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Application } from '@/types/auth';

interface ApplicationsSectionProps {
  applications: Application[];
  onApplicationAction: (appId: string, action: 'approved' | 'rejected') => void;
}

const ApplicationsSection: React.FC<ApplicationsSectionProps> = ({ 
  applications, 
  onApplicationAction 
}) => {
  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle>📋 Заявки клиентов</CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        <div className="space-y-3">
          {applications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Заявок пока нет</p>
          ) : (
            applications.map(app => (
              <div key={app.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{app.userName}</div>
                    <div className="text-sm text-gray-600">{app.userEmail}</div>
                  </div>
                  <Badge variant={
                    app.status === 'approved' ? 'default' : 
                    app.status === 'rejected' ? 'destructive' : 'secondary'
                  }>
                    {app.status === 'approved' ? '✅ Одобрено' : 
                     app.status === 'rejected' ? '❌ Отклонено' : '⏳ Ожидает'}
                  </Badge>
                </div>
                <div className="text-sm mb-2">
                  <strong>Программа:</strong> {app.program}
                </div>
                <div className="text-sm mb-3">{app.message}</div>
                {app.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onApplicationAction(app.id, 'approved')}
                      className="rainbow-button"
                    >
                      Одобрить
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onApplicationAction(app.id, 'rejected')}
                    >
                      Отклонить
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationsSection;