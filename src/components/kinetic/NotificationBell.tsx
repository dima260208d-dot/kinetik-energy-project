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

const NotificationBell = ({ characterId }: NotificationBellProps) => {
  const [notifications, setNotifications] = useState<CharacterNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<CharacterNotification | null>(null);

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
      case 'tournament': return '🏟️';
      case 'weekly_results': return '📊';
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

  const parseData = (dataStr?: string) => {
    if (!dataStr) return null;
    try { return JSON.parse(dataStr); } catch { return null; }
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={handleOpen} className="relative text-white hover:bg-white/20">
        <Icon name="Bell" className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {showPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50 p-4" onClick={() => { setShowPanel(false); setSelectedNotif(null); }}>
          <Card className="w-full max-w-md mt-16 mr-4 max-h-[70vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">
                {selectedNotif ? 'Детали' : 'Уведомления'}
              </CardTitle>
              <div className="flex gap-1">
                {selectedNotif && (
                  <Button variant="ghost" size="icon" onClick={() => setSelectedNotif(null)}>
                    <Icon name="ArrowLeft" className="w-5 h-5" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => { setShowPanel(false); setSelectedNotif(null); }}>
                  <Icon name="X" className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto flex-1 space-y-2 pb-4">
              {selectedNotif ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{getTypeIcon(selectedNotif.notification_type)}</div>
                    <div>
                      <div className="font-bold text-lg">{selectedNotif.title}</div>
                      <div className="text-sm text-gray-500">{formatDate(selectedNotif.created_at)}</div>
                    </div>
                  </div>
                  <p className="text-gray-700">{selectedNotif.message}</p>

                  {selectedNotif.notification_type === 'weekly_results' && (() => {
                    const d = parseData(selectedNotif.data);
                    if (!d) return null;
                    return (
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <h4 className="font-bold">Результаты турнира: {d.week}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-3xl font-bold text-purple-600">#{d.rank}</div>
                            <div className="text-xs text-gray-500">место из {d.total_participants}</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-3xl font-bold text-orange-600">{d.score}</div>
                            <div className="text-xs text-gray-500">общих очков</div>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between"><span>🎮 Мини-игры:</span><span className="font-bold">{d.games_score} очков</span></div>
                          <div className="flex justify-between"><span>🛹 Трюки:</span><span className="font-bold">{d.tricks_score} очков</span></div>
                          <div className="flex justify-between"><span>🏋️ Тренировки:</span><span className="font-bold">{d.training_score} очков</span></div>
                        </div>
                      </div>
                    );
                  })()}

                  {selectedNotif.notification_type === 'tournament' && (() => {
                    const d = parseData(selectedNotif.data);
                    if (!d) return null;
                    return (
                      <div className="bg-orange-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Турнир #{d.tournament_id}. Вступите за 100 кинетиков в разделе Турниры!</p>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <>
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🔔</div>
                      <p>Уведомлений пока нет</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id}
                        className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${n.is_read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}
                        onClick={() => setSelectedNotif(n)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl mt-0.5">{getTypeIcon(n.notification_type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm">{n.title}</div>
                            <div className="text-xs text-gray-600 mt-0.5 line-clamp-2">{n.message}</div>
                            <div className="text-xs text-gray-400 mt-1">{formatDate(n.created_at)}</div>
                          </div>
                          <Icon name="ChevronRight" className="w-4 h-4 text-gray-400 mt-1" />
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default NotificationBell;
