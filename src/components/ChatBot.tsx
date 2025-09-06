import React, { useState, useRef, useEffect } from 'react';
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
      text: 'Привет! 🤖 Я KINETIC BOT!\n\n🎯 Знаю всё о нашем клубе:\n• Направления (скейт, ролики, BMX, самокат, беговел)\n• Цены и расписание\n• Программы обучения\n• Безопасность и экипировку\n• Возрастные группы\n\n❓ Задайте любой вопрос или нажмите кнопку для связи с администратором!',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const clubPhone = '+79204163606';

  // Автоматическая прокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = {
    // Возраст и уровни
    'возраст': 'Обучаем с 3 лет! 👶 Беговел (3-4 года) → Скейт/ролики/самокат (5+ лет) → BMX/велосипед (7+ лет). Взрослых тоже учим! 💪',
    'лет': 'Обучаем с 3 лет! 👶 Беговел (3-4 года) → Скейт/ролики/самокат (5+ лет) → BMX/велосипед (7+ лет). Взрослых тоже учим! 💪',
    'малыш': 'Для малышей 3-4 лет идеально подходит беговел! Развивает координацию и равновесие. Занятия по 30 минут в игровой форме 🏃‍♂️',
    'взрослый': 'Конечно обучаем взрослых! Никогда не поздно начать. Программы адаптированы под любой возраст и физическую подготовку 💪',
    
    // Инвентарь и экипировка
    'инвентарь': 'Весь инвентарь включен в стоимость! 🛹🛼🚲 Скейты, ролики, самокаты, BMX, беговелы. Свой инвентарь = скидка на абонемент!',
    'защита': 'Полная защита от клуба: шлем, наколенники, налокотники, перчатки 🛡️ Вам нужна только спортивная одежда и хорошее настроение!',
    'шлем': 'Шлемы обязательны! У нас качественные шлемы разных размеров. Безопасность превыше всего! ⛑️',
    'экипировка': 'Полная защита предоставляется: шлем, наколенники, налокотники, перчатки. Размеры от детских до взрослых 🛡️',
    
    // Направления детально
    'скейт': 'Скейтбординг 🛹 Учим: стойку, баланс, повороты, торможение, олли, кикфлип. От новичка до продвинутого уровня!',
    'ролики': 'Ролики 🛼 Программа: базовые движения, повороты, торможение, слалом, фристайл, агрессив катание!',
    'велосипед': 'Велосипед 🚲 Обучение: посадка, баланс, повороты, торможение, безопасная езда, трюки, велопрогулки по городу!',
    'bmx': 'BMX 🚴‍♂️ Экстрим программа: базовая езда, джампы, грайнды, воздушные трюки, работа на рампе!',
    'самокат': 'Трюковой самокат 🛴 Современный городской спорт: базовые трюки, воздушные элементы, стрит и парк катание!',
    'беговел': 'Беговел 🏃‍♂️ Для малышей 3-4 лет. Развивает равновесие, координацию. Подготовка к велосипеду и самокату!',
    
    // Занятия и расписание
    'занятие': 'Занятия можно переносить за 2 часа до начала 📞 Длительность: 60 мин (45 мин для малышей). Есть индивидуальные и групповые!',
    'расписание': 'Занятия 7 дней в неделю! Утренние, дневные, вечерние группы. Расписание подстраиваем под вас 📅',
    'время': 'Работаем каждый день! Утром с 9:00, днем с 14:00, вечером до 20:00. Выбирайте удобное время 🕐',
    'группа': 'Максимум 10 человек в группе для качественного обучения. Есть группы по возрастам и уровням подготовки 👥',
    'индивидуал': 'Есть индивидуальные занятия! Максимум внимания тренера, программа под ваши цели. Быстрый прогресс гарантирован! 🎯',
    
    // Цены и скидки
    'цена': 'Цены от 800 руб за занятие. Абонементы выгоднее! Пробное занятие 500 руб (становится бесплатным при покупке абонемента) 💰',
    'стоимость': 'Разовое 800₽, абонемент 4 занятия 2800₽, 8 занятий 5200₽, 12 занятий 7200₽. Пробное 500₽ 💳',
    'скидки': 'Много скидок! 🎉 Пробное бесплатно при покупке абонемента, семейные скидки, скидки за свой инвентарь, студенческие!',
    'абонемент': 'Абонементы на 4, 8, 12 занятий. Действуют 2 месяца. Можно заморозить на время болезни 📋',
    'пробное': 'Пробное занятие 500₽! Если в тот же день купите абонемент - пробное бесплатно! Приходите знакомиться! 🤝',
    
    // Безопасность
    'безопасность': 'Безопасность - приоритет №1! Обязательная защита, опытные тренеры, медицинская страховка, первая помощь 🏥',
    'травма': 'Риск травм минимален! Полная защита, правильная техника, постепенное усложнение. У нас медицинская страховка 🛡️',
    'страховка': 'Все участники застрахованы! Медицинская страховка покрывает травмы на занятиях. Ваше здоровье под защитой 🏥',
    
    // Локация и открытие
    'адрес': 'г. Воронеж, точный адрес сообщим ближе к открытию в мае 2026! Следите за новостями 📍',
    'воронеж': 'Да, открываемся в Воронеже в мае 2026! Будем первой профессиональной школой экстремальных видов спорта в городе! 🏆',
    'открытие': 'Грандиозное открытие в мае 2026! Готовим крутую площадку, набираем лучших тренеров. Скоро будем готовы! 🎊',
    'май': 'Открытие запланировано на май 2026 года! Активно готовимся, ищем идеальную локацию в Воронеже 📅',
    '2026': 'В 2026 году откроемся! Май 2026 - старт нашей большой мечты. Будем лучшей школой экстрима в Воронеже! 🚀',
    
    // Контакты и связь
    'контакты': 'Связь со мной: WhatsApp +7 920 416-36-06, Telegram @kinetik_kids_vrn, email kinetic.kids@bk.ru 📞',
    'телефон': 'Наш телефон: +7 920 416-36-06. Звоните или пишите в WhatsApp любое время! 📱',
    'whatsapp': 'WhatsApp: +7 920 416-36-06. Самый быстрый способ связи! Отвечаем моментально 💬',
    'telegram': 'Telegram: @kinetik_kids_vrn. Там все новости, фото с тренировок, общение! 🗨️',
    'email': 'Email: kinetic.kids@bk.ru для официальных вопросов и документов 📧',
    'вк': 'ВКонтакте: kinetickidsvrn - фото, видео, отзывы, новости клуба! 📸',
    
    // Общие вопросы
    'тренер': 'Тренеры - профессионалы с многолетним опытом! Мастера спорта, призеры соревнований, любят детей и умеют учить 🏆',
    'программа': 'Авторские программы обучения по всем направлениям! От новичка до профи. Структурированно и безопасно 📚',
    'результат': 'Результат уже через месяц! Базовые навыки за 4-6 занятий, уверенное катание за 2-3 месяца 📈',
    'соревнования': 'Организуем соревнования, участвуем в городских и региональных турнирах! Растим чемпионов! 🏅',
    'лагерь': 'Планируем летние лагеря и выездные сборы! Катание + отдых + новые друзья 🏕️',
    
    // Родителям
    'родители': 'Родители могут наблюдать за занятиями, получают фото/видео прогресса детей, общаются в родительском чате 👨‍👩‍👧‍👦',
    'ребенок': 'Ваш ребенок полюбит спорт! Развитие координации, смелости, дисциплины. Здоровье и характер! 💪',
    'девочка': 'Девочки катают не хуже мальчиков! У нас много талантливых девочек. Приходите, будет круто! 👧',
    'мальчик': 'Мальчишкам у нас раздолье! Скорость, адреналин, крутые трюки. Станет настоящим экстремалом! 👦'
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
    
    // Отправляем вопрос в WhatsApp для отслеживания активности
    const currentTime = new Date().toLocaleString('ru-RU');
    const trackingMessage = `🤖 НОВЫЙ ВОПРОС С САЙТА

⏰ Время: ${currentTime}
❓ Вопрос: "${inputText}"
📊 Статистика активности сайта`;
    
    // Открываем WhatsApp с вопросом (в фоновом режиме или по желанию)
    const trackingUrl = `https://wa.me/${clubPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(trackingMessage)}`;
    
    // Улучшенный поиск ключевых слов в сообщении
    const lowerText = inputText.toLowerCase();
    let botResponse = '';
    let matchedKeys: string[] = [];
    
    // Ищем все совпадения
    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerText.includes(key)) {
        matchedKeys.push(key);
      }
    }
    
    // Выбираем наиболее релевантный ответ
    if (matchedKeys.length > 0) {
      // Приоритет более длинным/специфичным ключевым словам
      const bestMatch = matchedKeys.sort((a, b) => b.length - a.length)[0];
      botResponse = botResponses[bestMatch];
      
      // Добавляем дополнительные ответы, если нашли несколько совпадений
      if (matchedKeys.length > 1) {
        const additionalKeys = matchedKeys.filter(key => key !== bestMatch).slice(0, 2);
        for (const key of additionalKeys) {
          botResponse += `\n\n➕ Также: ${botResponses[key]}`;
        }
      }
    }
    
    // Проверяем на общие приветствия и благодарности
    if (!botResponse) {
      if (lowerText.match(/(привет|здравствуй|добр|хай|hi)/)) {
        botResponse = 'Привет! 👋 Я KINETIC BOT! Готов ответить на любые вопросы о нашем клубе. Что тебя интересует?';
      } else if (lowerText.match(/(спасибо|благодар|thx|thanks)/)) {
        botResponse = 'Пожалуйста! 😊 Рад был помочь! Если есть еще вопросы - спрашивайте. До встречи в KINETIC KIDS! 🤘';
      } else if (lowerText.match(/(пока|до свидания|bye|увидимся)/)) {
        botResponse = 'До встречи! 👋 Приходите к нам в мае 2026! KINETIC KIDS ждет вас! 🚀';
      } else {
        botResponse = 'Интересный вопрос! 🤔 Я передал его администратору. Попробуйте спросить по-другому или нажмите "Связаться с администратором" для детального обсуждения!';
      }
    }

    // Автоматически отправляем уведомление в WhatsApp (тихо, в фоне)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = trackingUrl;
    document.body.appendChild(iframe);
    setTimeout(() => document.body.removeChild(iframe), 3000);

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
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm whitespace-pre-line ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-purple-500 text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
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