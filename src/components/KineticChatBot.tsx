import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { ChatMessage, QuickAction } from '@/types/chatbot';
import { kineticKidsKnowledge, categories, findAnswer } from '@/data/kineticKidsKnowledge';

interface KineticChatBotProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const KineticChatBot: React.FC<KineticChatBotProps> = ({ 
  isOpen = false, 
  onToggle 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Привет! Я помощник клуба Kinetic Kids 🛹\n\nЯ знаю всё о наших занятиях, тренерах и мероприятиях. О чём хотите узнать?',
      isUser: false,
      timestamp: new Date(),
      quickActions: [
        { text: '📝 Записаться', value: 'записаться', emoji: '📝' },
        { text: '🛹 Направления', value: 'направления', emoji: '🛹' },
        { text: '👨‍🏫 Тренеры', value: 'тренеры', emoji: '👨‍🏫' }
      ]
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Добавляем сообщение пользователя
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Ищем ответ в базе знаний
    setTimeout(() => {
      const response = findAnswer(text.trim());
      
      let botMessage: ChatMessage;
      
      if (response) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: response.answer,
          isUser: false,
          timestamp: new Date(),
          quickActions: response.quickActions
        };
      } else {
        // Если не нашли точного ответа, предлагаем категории
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Не совсем понял ваш вопрос 🤔\n\nВозможно, вам поможет одна из категорий:',
          isUser: false,
          timestamp: new Date(),
          quickActions: categories.map(cat => ({
            text: `${cat.emoji} ${cat.name}`,
            value: `category_${cat.id}`,
            emoji: cat.emoji
          }))
        };
      }
      
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleQuickAction = (action: QuickAction) => {
    if (action.value.startsWith('category_')) {
      const categoryId = action.value.replace('category_', '');
      showCategoryQuestions(categoryId);
    } else {
      handleSendMessage(action.value);
    }
  };

  const showCategoryQuestions = (categoryId: string) => {
    const category = kineticKidsKnowledge[categoryId];
    if (!category) return;

    const categoryMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `${categories.find(c => c.id === categoryId)?.emoji} **${category.name}**\n\nВот что я знаю по этой теме:`,
      isUser: false,
      timestamp: new Date(),
      quickActions: category.questions.slice(0, 6).map(qa => ({
        text: qa.question,
        value: qa.question
      }))
    };

    setMessages(prev => [...prev, categoryMessage]);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line.includes('**') ? (
          <strong>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</strong>
        ) : (
          line
        )}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-6 z-50">
        <Button
          onClick={onToggle}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
        >
          <Icon name="MessageCircle" className="w-8 h-8 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] max-h-[70vh]">
      <Card className="shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Icon name="Zap" className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Kinetic Kids</CardTitle>
                <p className="text-sm opacity-90">Виртуальный помощник</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-white/20 w-8 h-8 p-0"
            >
              <Icon name="X" className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Категории */}
          {showCategories && (
            <div className="border-b bg-gray-50 p-4">
              <div className="grid grid-cols-2 gap-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant="outline"
                    size="sm"
                    onClick={() => showCategoryQuestions(category.id)}
                    className="justify-start text-left h-auto py-2"
                  >
                    <span className="mr-2">{category.emoji}</span>
                    <div>
                      <div className="font-medium text-xs">{category.name}</div>
                      <div className="text-xs opacity-60">{category.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Сообщения */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    {formatMessageText(message.text)}
                  </div>
                  
                  {/* Быстрые действия */}
                  {message.quickActions && (
                    <div className="mt-3 space-y-1">
                      {message.quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuickAction(action)}
                          className={`w-full justify-start text-left h-auto py-1 px-2 text-xs ${
                            message.isUser 
                              ? 'text-white hover:bg-white/20' 
                              : 'text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {action.emoji && <span className="mr-1">{action.emoji}</span>}
                          {action.text}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Поле ввода */}
          <div className="border-t p-4">
            <form onSubmit={handleInputSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Напишите ваш вопрос..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <Button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Icon name="Send" className="w-4 h-4" />
              </Button>
            </form>
            
            <div className="flex justify-between items-center mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCategories(!showCategories)}
                className="text-xs text-gray-500 p-1 h-auto"
              >
                <Icon name="Grid3X3" className="w-3 h-3 mr-1" />
                Категории
              </Button>
              
              <div className="flex gap-1">
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleSendMessage('телефон')}
                  className="text-xs text-gray-500 p-1 h-auto"
                >
                  📞 Позвонить
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KineticChatBot;