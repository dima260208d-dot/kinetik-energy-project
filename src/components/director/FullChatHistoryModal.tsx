import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ChatMessage, User } from '@/types/auth';

interface FullChatHistoryModalProps {
  chatMessages: ChatMessage[];
  users: User[];
  onClose: () => void;
}

const FullChatHistoryModal = ({ chatMessages, users, onClose }: FullChatHistoryModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">💬 Полная история чат-бота</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
            >
              <Icon name="X" className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            Всего диалогов: {chatMessages.length} | От пользователей: {new Set(chatMessages.map(m => m.userId)).size}
          </div>
        </CardHeader>
        <CardContent className="max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="space-y-3">
            {chatMessages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Сообщений пока нет</p>
            ) : (
              chatMessages
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map(msg => {
                  const messageUser = users.find(u => u.id === msg.userId);
                  return (
                    <div key={msg.id} className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                            {messageUser?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="font-medium">{messageUser?.name || 'Неизвестный пользователь'}</div>
                            <div className="text-xs text-gray-500">{messageUser?.email || 'Email неизвестен'}</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleString('ru-RU')}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="p-3 bg-white rounded border-l-4 border-blue-500">
                          <div className="text-sm text-gray-600 mb-1">👤 Вопрос пользователя:</div>
                          <div className="text-blue-800">{msg.message}</div>
                        </div>
                        
                        <div className="p-3 bg-white rounded border-l-4 border-green-500">
                          <div className="text-sm text-gray-600 mb-1">🤖 Ответ бота:</div>
                          <div className="text-green-800">{msg.response}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FullChatHistoryModal;
