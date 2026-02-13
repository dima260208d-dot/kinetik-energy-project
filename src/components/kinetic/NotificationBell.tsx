import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { CharacterNotification } from '@/types/kinetic';
import * as api from '@/services/kineticApi';

interface NotificationBellProps {
  characterId: number;
  onKineticsUpdate?: () => void;
}

const NotificationBell = ({ characterId, onKineticsUpdate }: NotificationBellProps) => {
  const [notifications, setNotifications] = useState<CharacterNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);

  const loadNotifications = useCallback(async () => {
    const { notifications: notifs, unread_count } = await api.getNotifications(characterId);
    setNotifications(notifs);
    setUnreadCount(unread_count);
  }, [characterId]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const handleOpen = async () => {
    setShowPanel(true);
    if (unreadCount > 0) {
      await api.markNotificationsRead(characterId);
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'kinetics': return '💰';
      case 'achievement': return '🏆';
      case 'tricks': return '✅';
      case 'purchase': return '🛍️';
      case 'welcome': return '🎉';
      case 'level_up': return '⬆️';
      default: return '📢';
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'только что';
    if (mins < 60) return `${mins} мин назад`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ч назад`;
    return d.toLocaleDateString('ru-RU');
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleOpen}
        className="relative text-white hover:bg-white/20"
      >
        <Icon name="Bell" className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {showPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50 p-4" onClick={() => setShowPanel(false)}>
          <Card className="w-full max-w-md mt-16 mr-4 max-h-[70vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Уведомления</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowPanel(false)}>
                <Icon name="X" className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="overflow-y-auto flex-1 space-y-2 pb-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🔔</div>
                  <p>Уведомлений пока нет</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-lg border transition-all ${
                      n.is_read
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl mt-0.5">{getTypeIcon(n.notification_type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{n.title}</div>
                        <div className="text-xs text-gray-600 mt-0.5">{n.message}</div>
                        <div className="text-xs text-gray-400 mt-1">{formatDate(n.created_at)}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default NotificationBell;
