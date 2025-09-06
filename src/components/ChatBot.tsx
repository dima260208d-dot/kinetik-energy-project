import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Привет! 🤖 Я бот KINETIC KIDS! Могу ответить на вопросы о клубе или соединить с администратором через WhatsApp.',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const clubPhone = '+79999999999'; // Замените на реальный номер клуба

  const botResponses = {
    'возраст': 'Обучаем детей с 3 лет, а также взрослых! Для малышей от 3-4 лет рекомендуем беговел, с 5 лет можно осваивать все направления.',
    'инвентарь': 'Стоимость всех абонементов уже включает аренду инвентаря. Если у вас есть свой инвентарь, абонемент будет дешевле.',
    'занятие': 'Занятия можно переносить при предварительном уведомлении администратора за 2 часа до начала.',
    'скидки': 'Да! Если в день пробного занятия вы покупаете абонемент, то пробное занятие становится бесплатным.',
    'группа': 'В группах не более 10 человек для обеспечения индивидуального подхода и безопасности.',
    'защита': 'Полный комплект защиты предоставляется клубом: шлем, наколенники, налокотники, перчатки. Нужна только удобная спортивная одежда.',
    'адрес': 'Мы находимся в г. Воронеж. Открытие планируется в мае 2026 года.',
    'контакты': 'Для записи и вопросов свяжитесь с нами через WhatsApp!',
    'направления': 'У нас есть: скейтбординг, ролики, велосипед, BMX, трюковой самокат и беговел для малышей.'
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Поиск ключевых слов в сообщении
    const lowerText = inputText.toLowerCase();
    let botResponse = '';
    
    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerText.includes(key)) {
        botResponse = response;
        break;
      }
    }

    if (!botResponse) {
      botResponse = 'Не нашел ответ на ваш вопрос 😅 Нажмите "Связаться с администратором" для получения подробной консультации!';
    }

    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputText('');
  };

  const handleWhatsAppContact = () => {
    const message = 'Здравствуйте! Обращаюсь с сайта KINETIC KIDS. Хотел бы получить консультацию.';
    const whatsappUrl = `https://wa.me/${clubPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          <img 
            src="https://cdn.poehali.dev/files/819f034c-b5eb-4287-b8ab-14036c8c696f.jpg" 
            alt="KINETIC KIDS Bot" 
            className="w-10 h-10 rounded-full object-cover group-hover:scale-110 transition-transform"
          />
        </button>
      </div>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isOpen ? 'scale-100' : 'scale-0'}`}>
        <Card className="w-80 h-96 shadow-2xl border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img 
                  src="https://cdn.poehali.dev/files/819f034c-b5eb-4287-b8ab-14036c8c696f.jpg" 
                  alt="KINETIC KIDS Bot" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <CardTitle className="text-sm font-semibold">KINETIC BOT</CardTitle>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 h-64 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-purple-500 text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp Button */}
            <div className="p-3 border-t">
              <button
                onClick={handleWhatsAppContact}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 mb-2"
              >
                <Icon name="MessageCircle" className="w-4 h-4" />
                <span>Связаться с администратором</span>
              </button>
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-gray-50">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Напишите ваш вопрос..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <Icon name="Send" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}