import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Countdown from '@/components/Countdown';
import ChatBot from '@/components/ChatBot';
import Auth from '@/components/Auth';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();

  const sports = [
    { 
      id: 'skate', 
      name: 'Скейтбординг', 
      icon: '🛹',
      description: 'Изучаем основы катания, повороты, торможение и первые трюки',
      color: 'kinetic-red'
    },
    { 
      id: 'roller', 
      name: 'Ролики', 
      icon: '🛼',
      description: 'От первых шагов до слалома и фристайла',
      color: 'kinetic-blue'
    },
    { 
      id: 'bike', 
      name: 'Велосипед', 
      icon: '🚲',
      description: 'Безопасная езда, трюки и велопрогулки',
      color: 'kinetic-green'
    },
    { 
      id: 'bmx', 
      name: 'BMX', 
      icon: '🚴‍♂️',
      description: 'Экстремальная езда, джампы и трюки на рампе',
      color: 'kinetic-orange'
    },
    { 
      id: 'scooter', 
      name: 'Трюковой самокат', 
      icon: '🛴',
      description: 'Современный городской экстрим и воздушные трюки',
      color: 'kinetic-purple'
    },
    { 
      id: 'runbike', 
      name: 'Беговел', 
      icon: '🏃‍♂️',
      description: 'Первые шаги к освоению равновесия для самых маленьких',
      color: 'kinetic-teal'
    }
  ];



  const faqData = [
    {
      question: 'С какого возраста можно заниматься?',
      answer: 'Обучаем детей с трех лет, а также взрослых. Для малышей от 3-4 лет рекомендуем беговел, с 5 лет можно осваивать все остальные направления.'
    },
    {
      question: 'Нужно ли покупать свой инвентарь?',
      answer: 'Нет, стоимость всех абонементов уже включает аренду инвентаря. Если у вас есть свой инвентарь, абонемент будет дешевле.'
    },
    {
      question: 'Что делать, если пропустил занятие?',
      answer: 'Занятия можно переносить при предварительном уведомлении администратора за 2 часа до начала.'
    },
    {
      question: 'Есть ли скидки при покупке абонемента после пробного?',
      answer: 'Да! Если в день пробного занятия вы покупаете абонемент, то пробное занятие становится бесплатным.'
    },
    {
      question: 'Сколько детей в группе?',
      answer: 'В группах не более 10 человек для обеспечения индивидуального подхода и безопасности.'
    },
    {
      question: 'Какая экипировка нужна?',
      answer: 'Полный комплект защиты предоставляется клубом: шлем, наколенники, налокотники, перчатки. Нужна только удобная спортивная одежда.'
    }
  ];

  return (
    <div className="min-h-screen rainbow-pattern">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b-2 border-transparent shadow-lg">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img 
                src="https://cdn.poehali.dev/files/424f8693-463c-4c9d-b5ac-863b4376608d.jpg" 
                alt="Kinetic Kids Logo" 
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover"
              />
              <h1 className="text-base sm:text-2xl font-bold rainbow-text">KINETIC KIDS</h1>
            </div>
            
            {/* Мобильная кнопка входа/кабинета */}
            <div className="md:hidden">
              {!user ? (
                <Button 
                  onClick={() => setShowAuth(true)} 
                  className="rainbow-button text-xs px-3 py-1"
                  size="sm"
                >
                  Войти
                </Button>
              ) : (
                <Navigation currentPage="home" />
              )}
            </div>
            
            <div className="sm:hidden md:block text-right text-xs">
              <div className="text-gray-600">Воронеж</div>
              <div className="font-semibold rainbow-text">Май 2026</div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#sports" className="interactive-icon transition-colors font-medium">Направления</a>
            <a href="#safety" className="interactive-icon transition-colors font-medium">Безопасность</a>
            <a href="#faq" className="interactive-icon transition-colors font-medium">FAQ</a>
            <a href="#contacts" className="interactive-icon transition-colors font-medium">Контакты</a>
            {!user ? (
              <Button 
                onClick={() => setShowAuth(true)} 
                className="rainbow-button"
                size="sm"
              >
                Войти
              </Button>
            ) : (
              <Navigation currentPage="home" />
            )}
          </div>
          
          <div className="hidden sm:block text-right text-xs sm:text-sm">
            <div className="text-gray-600 mb-1">г. Воронеж</div>
            <div className="font-semibold rainbow-text">Открытие в мае 2026</div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-32"
        style={{
          backgroundImage: `url(/img/59057680-eb39-4b41-bb3c-c4f54d321177.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-4 sm:mb-6 text-white drop-shadow-2xl leading-tight">
            KINETIC KIDS
          </h2>
          <p className="text-base sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 text-white font-light drop-shadow-lg px-2">
            Обучение без страха, катание без границ!
          </p>
          <Countdown />
        </div>
      </section>

      {/* Sports Section */}
      <section id="sports" className="py-12 sm:py-16 lg:py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-12 lg:mb-16 text-gray-800">
            Направления обучения
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sports.map((sport) => (
              <div key={sport.id} className="rainbow-card group cursor-pointer">
                <CardHeader className="text-center p-4 sm:p-6">
                  <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    {sport.icon}
                  </div>
                  <CardTitle className="text-gray-800 text-lg sm:text-xl group-hover:scale-105 transition-all mb-2">
                    {sport.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {sport.description}
                  </CardDescription>
                </CardHeader>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-12 sm:py-16 lg:py-20 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 text-gray-800">
            Безопасность превыше всего
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="rainbow-card text-center">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center rainbow-button">
                  <span className="text-2xl sm:text-3xl">🛡️</span>
                </div>
                <CardTitle className="text-gray-800 text-lg sm:text-xl">
                  Полная защита
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-gray-600 text-sm sm:text-base">Шлем, наколенники, налокотники и перчатки для каждого ученика</p>
              </CardContent>
            </div>
            
            <div className="rainbow-card text-center">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center rainbow-button">
                  <span className="text-2xl sm:text-3xl">👥</span>
                </div>
                <CardTitle className="text-gray-800 text-lg sm:text-xl">
                  Малые группы
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-gray-600 text-sm sm:text-base">Не более 10 человек в группе для индивидуального подхода</p>
              </CardContent>
            </div>
            
            <div className="rainbow-card text-center">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center rainbow-button">
                  <span className="text-2xl sm:text-3xl">👨‍🏫</span>
                </div>
                <CardTitle className="text-gray-800 text-lg sm:text-xl">
                  Опытные тренеры
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-gray-600 text-sm sm:text-base">Квалифицированные специалисты с медицинской подготовкой</p>
              </CardContent>
            </div>
          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 text-gray-800">
            Частые вопросы
          </h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base sm:text-lg text-gray-800 pr-4">{faq.question}</CardTitle>
                    <Icon name={openFAQ === index ? "ChevronUp" : "ChevronDown"} className="w-5 h-5 flex-shrink-0" />
                  </div>
                </CardHeader>
                {openFAQ === index && (
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-orange-500/10 to-teal-500/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-gray-800">
            Готовы к приключениям?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 text-gray-600 max-w-2xl mx-auto px-2">
            Свяжитесь с нами уже сегодня и узнайте больше о том, что нас ждет в мае 2026!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-4xl mx-auto">
            <a href="https://t.me/kinetik_kids_vrn" target="_blank" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 sm:py-4 sm:px-8 rounded-xl transition-all duration-300 text-base sm:text-lg lg:text-xl">
              💬 Telegram консультация
            </a>
            <a href="https://wa.me/message/WQFGATD3QMSHI1" target="_blank" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 sm:py-4 sm:px-8 rounded-xl transition-all duration-300 text-base sm:text-lg lg:text-xl">
              📱 WhatsApp
            </a>
            <a href="tel:89204163606" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 sm:py-4 sm:px-8 rounded-xl transition-all duration-300 text-base sm:text-lg lg:text-xl">
              📞 Позвонить нам
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacts" className="py-8 sm:py-12 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 md:mb-0">
              <img 
                src="https://cdn.poehali.dev/files/2799c2eb-0c3f-4244-9101-eccb835271d7.jpg" 
                alt="Kinetic Kids Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
              />
              <span className="text-lg sm:text-xl font-bold">KINETIC KIDS</span>
            </div>
            <div className="text-center md:text-right">
              <div className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">г. Воронеж</div>
              <div className="text-orange-400 text-sm sm:text-base">Открытие в мае 2026 года</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-orange-400 text-base sm:text-lg">Контакты</h4>
              <div className="space-y-2 text-sm sm:text-base">
                <a href="tel:89204163606" className="block hover:text-orange-400 transition-colors">
                  📞 8 920 416 36 06
                </a>
                <a href="mailto:kinetic.kids@bk.ru" className="block hover:text-orange-400 transition-colors">
                  ✉️ kinetic.kids@bk.ru
                </a>
                <a href="https://t.me/kinetik_kids_vrn" target="_blank" className="block hover:text-orange-400 transition-colors">
                  💬 Telegram
                </a>
                <a href="https://wa.me/message/WQFGATD3QMSHI1" target="_blank" className="block hover:text-orange-400 transition-colors">
                  📱 WhatsApp
                </a>
                <a href="https://vk.com/kinetickidsvrn?from=groups" target="_blank" className="block hover:text-orange-400 transition-colors">
                  🌐 ВКонтакте
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-teal-400 text-base sm:text-lg">Направления</h4>
              <div className="space-y-1 text-xs sm:text-sm text-gray-300">
                <div>🛹 Скейтбординг</div>
                <div>🛼 Ролики</div>
                <div>🚲 Велосипед & BMX</div>
                <div>🛴 Трюковой самокат</div>
                <div>🏃‍♂️ Беговел</div>
              </div>
            </div>
            
            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="font-semibold mb-3 sm:mb-4 text-purple-400 text-base sm:text-lg">Для родителей</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <a href="https://vk.com/kinetickidsvrn?from=groups" target="_blank" className="block hover:text-purple-400 transition-colors">
                  Написать отзыв
                </a>
                <div className="text-gray-300">Дети от 3 лет, взрослые</div>
                <div className="text-gray-300">Группы до 10 человек</div>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-8 border-t border-gray-700">
            <p className="text-gray-400">
              © 2024 Kinetic Kids. Школа экстремального спорта в Воронеже
            </p>
          </div>
        </div>
      </footer>

      {/* Chat Bot */}
      <ChatBot />

      {/* Auth Modal */}
      {showAuth && (
        <Auth onClose={() => setShowAuth(false)} />
      )}
    </div>
  );
}