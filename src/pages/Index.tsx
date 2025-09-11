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
    <div className="min-h-screen tech-organic-bg relative overflow-hidden">
      {/* Органические плавающие элементы */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[#00C2FF]/30 to-[#00FF99]/20 rounded-full blur-2xl floating-organic"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-[#FF6B00]/25 to-[#00C2FF]/20 rounded-[60%_40%_30%_70%] blur-xl floating-organic"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-[#00FF99]/20 to-[#00C2FF]/15 rounded-[50%_80%_20%_60%] blur-3xl floating-organic"></div>
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-gradient-to-r from-[#FF6B00]/30 to-[#00FF99]/25 rounded-[70%_30%_80%_40%] blur-lg floating-organic"></div>
      </div>
      
      {/* Техно-сетка */}
      <div className="absolute inset-0 opacity-10 organic-pattern"></div>

      {/* Техно-органическая навигация */}
      <nav className="fixed top-0 w-full z-50 tech-nav">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src="https://cdn.poehali.dev/files/424f8693-463c-4c9d-b5ac-863b4376608d.jpg" 
                alt="Kinetic Kids Logo" 
                className="w-12 h-12 rounded-2xl object-cover shadow-lg border-2 border-[#00C2FF]/30"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00C2FF] to-[#00FF99] rounded-2xl blur opacity-20 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0A0A18] tracking-tight">KINETIC KIDS</h1>
              <p className="text-[#0A0A18]/60 text-sm font-medium">Техно-органический спорт</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1">
              <a href="#sports" className="px-4 py-2 text-sm font-medium text-[#0A0A18]/70 hover:text-[#00C2FF] rounded-xl transition-all duration-300 hover:bg-[#00C2FF]/10">Направления</a>
              <a href="#safety" className="px-4 py-2 text-sm font-medium text-[#0A0A18]/70 hover:text-[#00C2FF] rounded-xl transition-all duration-300 hover:bg-[#00C2FF]/10">Безопасность</a>
              <a href="#faq" className="px-4 py-2 text-sm font-medium text-[#0A0A18]/70 hover:text-[#00C2FF] rounded-xl transition-all duration-300 hover:bg-[#00C2FF]/10">FAQ</a>
              <a href="#contacts" className="px-4 py-2 text-sm font-medium text-[#0A0A18]/70 hover:text-[#00C2FF] rounded-xl transition-all duration-300 hover:bg-[#00C2FF]/10">Контакты</a>
            </div>
            
            {!user ? (
              <Button 
                onClick={() => setShowAuth(true)} 
                className="tech-button"
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

      {/* Hero Section Техно-органика */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          {/* Логотип с техно-эффектами */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img 
                src="https://cdn.poehali.dev/files/424f8693-463c-4c9d-b5ac-863b4376608d.jpg" 
                alt="Kinetic Kids" 
                className="w-28 h-28 rounded-3xl shadow-2xl border-4 border-[#00C2FF]/50 object-cover"
              />
              <div className="absolute -inset-3 bg-gradient-to-r from-[#00C2FF] via-[#00FF99] to-[#FF6B00] rounded-3xl blur-lg opacity-30 animate-pulse"></div>
              <div className="absolute -inset-1 rounded-3xl border border-[#00C2FF]/30 animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black mb-6 tech-gradient-text tracking-tight neon-glow-cyan">
            KINETIC KIDS
          </h1>
          
          <p className="text-2xl md:text-3xl lg:text-4xl mb-8 text-white/90 font-light max-w-4xl mx-auto leading-relaxed">
            Техно-органический спорт будущего
          </p>

          {/* Информационная карта */}
          <div className="organic-card max-w-3xl mx-auto p-8 mb-10 tech-wire">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🛹</div>
                <div className="text-[#0A0A18]/80 font-medium">Скейт</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🛼</div>
                <div className="text-[#0A0A18]/80 font-medium">Ролики</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🚴</div>
                <div className="text-[#0A0A18]/80 font-medium">BMX</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🛴</div>
                <div className="text-[#0A0A18]/80 font-medium">Самокаты</div>
              </div>
            </div>
            <p className="text-[#0A0A18]/70 text-lg">
              Инновационные методики обучения в высокотехнологичном скейт-парке
            </p>
          </div>

          <Countdown />

          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button className="tech-button text-lg">
              <Icon name="Play" className="w-5 h-5 mr-3" />
              Смотреть видео
            </Button>
            <Button className="tech-button-outline text-lg">
              <Icon name="MapPin" className="w-5 h-5 mr-3" />
              г. Воронеж
            </Button>
          </div>
        </div>

        {/* Техно-органические информационные панели */}
        <div className="absolute bottom-24 left-8 hidden lg:block">
          <div className="organic-card p-6 tech-wire">
            <div className="text-[#0A0A18]/60 text-sm mb-1">Открытие</div>
            <div className="text-[#00C2FF] font-bold text-xl neon-glow-cyan">Май 2026</div>
          </div>
        </div>

        <div className="absolute top-1/3 right-8 hidden lg:block">
          <div className="organic-card p-6 tech-wire">
            <div className="text-[#0A0A18]/60 text-sm mb-1">Возраст</div>
            <div className="text-[#00FF99] font-bold text-xl neon-glow-green">3-18 лет</div>
          </div>
        </div>

        <div className="absolute bottom-1/3 left-8 hidden lg:block">
          <div className="organic-card p-6 tech-wire">
            <div className="text-[#0A0A18]/60 text-sm mb-1">Формат</div>
            <div className="text-[#FF6B00] font-bold text-xl">Крытый зал</div>
          </div>
        </div>
      </section>

      {/* Sports Section Техно-органика */}
      <section id="sports" className="py-24 relative overflow-hidden bg-white">
        {/* Органические фоновые элементы */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-[#00C2FF]/10 to-[#00FF99]/5 rounded-[60%_40%_30%_70%] blur-2xl floating-organic"></div>
          <div className="absolute bottom-20 right-20 w-52 h-52 bg-gradient-to-r from-[#FF6B00]/8 to-[#00C2FF]/6 rounded-[50%_80%_20%_60%] blur-3xl floating-organic"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-[#00FF99]/12 to-[#FF6B00]/8 rounded-[70%_30%_80%_40%] blur-xl floating-organic"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-black mb-8 tech-gradient-text">
              Направления
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#00C2FF] to-[#00FF99] mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-[#0A0A18]/70 max-w-4xl mx-auto leading-relaxed">
              Инновационные спортивные программы, объединяющие технологии и природную биомеханику движения
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {sports.map((sport, index) => (
              <div 
                key={sport.id} 
                className="organic-card group cursor-pointer p-10 text-center"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative mb-8">
                  <div className="text-7xl mb-6 transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-700">
                    {sport.icon}
                  </div>
                  <div className="absolute -inset-6 bg-gradient-to-r from-[#00C2FF]/20 via-[#00FF99]/15 to-[#FF6B00]/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
                
                <h3 className="text-2xl font-bold mb-6 text-[#0A0A18] group-hover:text-[#00C2FF] transition-colors duration-300">
                  {sport.name}
                </h3>
                
                <p className="text-[#0A0A18]/70 leading-relaxed mb-8 text-base">
                  {sport.description}
                </p>

                <div className="pt-6 border-t border-[#00C2FF]/20 tech-wire">
                  <span className="inline-flex items-center gap-3 text-sm font-semibold text-[#00C2FF] group-hover:text-[#00FF99] transition-colors">
                    Изучить программу
                    <Icon name="ArrowRight" className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Техно-статистика */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="organic-card p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl font-black tech-gradient-text mb-3 neon-glow-cyan">500+</div>
              <div className="text-[#0A0A18]/70 font-medium">Обученных детей</div>
            </div>
            <div className="organic-card p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl font-black tech-gradient-text mb-3 neon-glow-green">5</div>
              <div className="text-[#0A0A18]/70 font-medium">Спорт-программ</div>
            </div>
            <div className="organic-card p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl font-black tech-gradient-text mb-3 neon-glow-cyan">12</div>
              <div className="text-[#0A0A18]/70 font-medium">Про-тренеров</div>
            </div>
            <div className="organic-card p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-5xl font-black tech-gradient-text mb-3">∞</div>
              <div className="text-[#0A0A18]/70 font-medium">Возможностей</div>
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