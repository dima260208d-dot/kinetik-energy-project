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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Декоративные элементы 2026 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-lg animate-pulse delay-3000"></div>
      </div>
      
      {/* Сетка в стиле 2026 */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[linear-gradient(rgba(147,51,234,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.3)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Navigation 2026 */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src="https://cdn.poehali.dev/files/424f8693-463c-4c9d-b5ac-863b4376608d.jpg" 
                alt="Kinetic Kids Logo" 
                className="w-12 h-12 rounded-2xl object-cover shadow-xl border-2 border-white/30"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-30 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">KINETIC KIDS</h1>
              <p className="text-purple-200/80 text-sm font-medium">Спорт будущего</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1">
              <a href="#sports" className="nav-pill-2026">Направления</a>
              <a href="#safety" className="nav-pill-2026">Безопасность</a>
              <a href="#faq" className="nav-pill-2026">FAQ</a>
              <a href="#contacts" className="nav-pill-2026">Контакты</a>
            </div>
            
            {!user ? (
              <Button 
                onClick={() => setShowAuth(true)} 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-2.5"
              >
                <Icon name="User" className="w-4 h-4 mr-2" />
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

      {/* Hero Section 2026 */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Динамические фоновые элементы */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/95 to-blue-900/90"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl animate-pulse floating-element"></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl animate-pulse floating-element"></div>
          <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-indigo-500/30 rounded-full blur-3xl animate-pulse floating-element"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          {/* Логотип в центре */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img 
                src="https://cdn.poehali.dev/files/424f8693-463c-4c9d-b5ac-863b4376608d.jpg" 
                alt="Kinetic Kids" 
                className="w-24 h-24 rounded-3xl shadow-2xl border-4 border-white/30 object-cover"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-lg opacity-50 animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-6 text-white neon-text-2026 tracking-tight">
            KINETIC KIDS
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-white/90 font-light max-w-4xl mx-auto leading-relaxed">
            Спортивный клуб нового поколения
          </p>

          <div className="glass-card-2026 max-w-2xl mx-auto p-6 mb-8 transition-all duration-500">
            <p className="text-lg text-white/80 mb-4">
              🛹 Скейт • 🛼 Ролики • 🚴 BMX • 🛴 Самокаты
            </p>
            <p className="text-white/60">
              Современные методики обучения в крытом скейт-парке
            </p>
          </div>

          <Countdown />

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="morphism-button px-8 py-4 text-lg font-semibold rounded-2xl">
              <Icon name="Play" className="w-5 h-5 mr-3" />
              Смотреть видео
            </Button>
            <Button 
              variant="outline"
              className="px-8 py-4 text-lg font-semibold rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-xl"
            >
              <Icon name="MapPin" className="w-5 h-5 mr-3" />
              г. Воронеж
            </Button>
          </div>
        </div>

        {/* Плавающие элементы UI */}
        <div className="absolute bottom-20 left-20 hidden lg:block">
          <div className="glass-card-2026 p-4 tech-border">
            <div className="text-white/60 text-sm">Открытие</div>
            <div className="text-white font-bold text-lg">Май 2026</div>
          </div>
        </div>

        <div className="absolute top-1/3 right-20 hidden lg:block">
          <div className="glass-card-2026 p-4 tech-border">
            <div className="text-white/60 text-sm">Возраст</div>
            <div className="text-white font-bold text-lg">3-18 лет</div>
          </div>
        </div>
      </section>

      {/* Sports Section 2026 */}
      <section id="sports" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-purple-50 to-blue-50"></div>
        
        {/* Фоновые элементы */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Направления
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Современные спортивные программы для развития координации, баланса и уверенности в себе
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sports.map((sport, index) => (
              <div 
                key={sport.id} 
                className="glass-card-2026 group cursor-pointer p-8 text-center transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative mb-6">
                  <div className="text-6xl mb-4 transform group-hover:scale-125 transition-all duration-500 group-hover:rotate-12">
                    {sport.icon}
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-purple-600 transition-colors">
                  {sport.name}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {sport.description}
                </p>

                <div className="pt-4 border-t border-white/20">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 group-hover:text-purple-700 transition-colors">
                    Узнать больше
                    <Icon name="ArrowRight" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Статистика */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">100+</div>
              <div className="text-gray-600">Довольных детей</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">5</div>
              <div className="text-gray-600">Направлений</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">7</div>
              <div className="text-gray-600">Опытных тренеров</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-gray-600">Поддержка</div>
            </div>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
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
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-purple-400 text-base sm:text-lg">Для родителей</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <a href="https://vk.com/kinetickidsvrn?from=groups" target="_blank" className="block hover:text-purple-400 transition-colors">
                  Написать отзыв
                </a>
                <div className="text-gray-300">Дети от 3 лет, взрослые</div>
                <div className="text-gray-300">Группы до 10 человек</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-blue-400 text-base sm:text-lg">CRM Система</h4>
              <div className="space-y-2 text-sm sm:text-base">
                <a 
                  href="/kinetic-crm" 
                  className="block hover:text-blue-300 transition-colors p-2 bg-blue-900/20 rounded-lg border border-blue-400/30"
                >
                  🚀 <strong>Kinetic Kids CRM</strong>
                </a>
                <div className="space-y-1 text-xs sm:text-sm text-gray-300">
                  <div>👥 Управление клиентами</div>
                  <div>📅 Онлайн-запись</div>
                  <div>💳 Система абонементов</div>
                  <div>📊 Аналитика и отчеты</div>
                  <div>🎯 Live Progress Hub</div>
                </div>
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