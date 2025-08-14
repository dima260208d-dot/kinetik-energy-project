import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('group');
  const [openFAQ, setOpenFAQ] = useState(null);

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

  const plans = {
    trial: [
      { name: 'Пробное', duration: '1 час', price: '750₽' },
      { name: 'Пробное+', duration: '1.5 часа', price: '1000₽' }
    ],
    group: [
      { name: 'Старт', sessions: '4 занятия', duration: '1 час', price: '3350₽' },
      { name: 'Старт+', sessions: '4 занятия', duration: '1.5 часа', price: '5000₽' },
      { name: 'Актив', sessions: '8 занятий', duration: '1 час', price: '5650₽' },
      { name: 'Актив+', sessions: '8 занятий', duration: '1.5 часа', price: '7900₽' },
      { name: 'Мега', sessions: '12 занятий', duration: '1 час', price: '8150₽' },
      { name: 'Мега+', sessions: '12 занятий', duration: '1.5 часа', price: '12700₽' },
      { name: 'Годовой', sessions: '50 занятий', duration: '1 час', price: '40150₽' },
      { name: 'Годовой+', sessions: '50 занятий', duration: '1.5 часа', price: '55200₽' }
    ],
    individual: [
      { name: 'Лайт', sessions: '3 занятия', duration: '1 час', price: '3650₽' },
      { name: 'Лайт+', sessions: '3 занятия', duration: '1.5 часа', price: '5100₽' },
      { name: 'Индивидуальное', sessions: '5 занятий', duration: '1 час', price: '6350₽' },
      { name: 'Индивидуальное+', sessions: '5 занятий', duration: '1.5 часа', price: '8100₽' },
      { name: 'Премиум', sessions: '10 занятий', duration: '1 час', price: '12150₽' },
      { name: 'Премиум+', sessions: '10 занятий', duration: '1.5 часа', price: '15900₽' }
    ],
    family: [
      { name: 'Лайт', sessions: '2 занятия', duration: '1 час', price: '2250₽' },
      { name: 'Лайт+', sessions: '2 занятия', duration: '1.5 часа', price: '3200₽' },
      { name: 'Семейный', sessions: '4 занятия', duration: '1 час', price: '4150₽' },
      { name: 'Семейный+', sessions: '4 занятия', duration: '1.5 часа', price: '5800₽' },
      { name: 'Премиум', sessions: '8 занятий', duration: '1 час', price: '8150₽' },
      { name: 'Премиум+', sessions: '8 занятий', duration: '1.5 часа', price: '11200₽' },
      { name: 'Мега', sessions: '16 занятий (8+8)', duration: '1 час', price: '16100₽' },
      { name: 'Мега+', sessions: '16 занятий (8+8)', duration: '1.5 часа', price: '21400₽' }
    ],
    special: [
      { name: 'Ночной заезд', sessions: 'Пт/Вс 22:00-01:00', duration: '3 часа', price: '3000₽', note: 'Строго 18+' },
      { name: 'BMX-марафон', sessions: '6 занятий', duration: '2 часа', price: '15500₽' },
      { name: 'Прогрессия', sessions: '4 индив + 8 групп', duration: '1 час', price: '2960₽' },
      { name: 'Детсад', sessions: '20 занятий Пн-Пт', duration: '09:00-12:00', price: '25000₽' },
      { name: 'Свободное катание', sessions: 'Аренда зала + инвентарь', duration: '1 час', price: '600₽' }
    ]
  };

  const faqData = [
    {
      question: 'С какого возраста можно заниматься?',
      answer: 'Мы обучаем детей с 3 лет и взрослых. Для малышей от 3-4 лет рекомендуем беговел, с 5 лет можно осваивать все остальные направления.'
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="https://cdn.poehali.dev/files/819f034c-b5eb-4287-b8ab-14036c8c696f.jpg" 
              alt="Kinetic Kids Logo" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <h1 className="text-2xl font-bold rainbow-text">KINETIC KIDS</h1>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#sports" className="interactive-icon transition-colors font-medium">Направления</a>
            <a href="#safety" className="interactive-icon transition-colors font-medium">Безопасность</a>
            <a href="#plans" className="interactive-icon transition-colors font-medium">Абонементы</a>
            <a href="#faq" className="interactive-icon transition-colors font-medium">FAQ</a>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">г. Воронеж</div>
            <div className="text-sm font-semibold rainbow-text">Открытие в мае 2026</div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(/img/5d5454a8-c097-429d-bc2a-467924cebc88.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h2 className="text-6xl md:text-8xl font-black mb-6 text-white drop-shadow-2xl">
            KINETIC KIDS
          </h2>
          <p className="text-2xl md:text-3xl mb-8 text-white font-light drop-shadow-lg">
            Обучение без страха, катание без границ!
          </p>
          <div className="rainbow-card p-8 mb-12">
            <div className="text-2xl font-bold text-gray-800 mb-4">📅 Открытие в мае 2026!</div>
            <p className="text-lg text-gray-700 mb-6">Школа экстремального спорта для детей от 3 лет и взрослых в Воронеже</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:89204163606" className="rainbow-button text-lg">
                📞 8 920 416 36 06
              </a>
              <a href="https://t.me/kinetik_kids_vrn" target="_blank" className="rainbow-button text-lg">
                💬 Telegram консультация
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section id="sports" className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
            Направления обучения
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sports.map((sport) => (
              <div key={sport.id} className="rainbow-card group cursor-pointer">
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {sport.icon}
                  </div>
                  <CardTitle className="text-gray-800 text-xl group-hover:scale-105 transition-all">
                    {sport.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {sport.description}
                  </CardDescription>
                </CardHeader>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
            Безопасность превыше всего
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="rainbow-card text-center">
              <CardHeader>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center rainbow-button">
                  <Icon name="Shield" size={32} className="text-white" />
                </div>
                <CardTitle className="text-gray-800">
                  Полная защита
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Шлем, наколенники, налокотники и перчатки для каждого ученика</p>
              </CardContent>
            </div>
            
            <div className="rainbow-card text-center">
              <CardHeader>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center rainbow-button">
                  <Icon name="Users" size={32} className="text-white" />
                </div>
                <CardTitle className="text-gray-800">
                  Малые группы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Не более 10 человек в группе для индивидуального подхода</p>
              </CardContent>
            </div>
            
            <div className="rainbow-card text-center">
              <CardHeader>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center rainbow-button">
                  <Icon name="Heart" size={32} className="text-white" />
                </div>
                <CardTitle className="text-gray-800">
                  Опытные тренеры
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Квалифицированные специалисты с медицинской подготовкой</p>
              </CardContent>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-800">
            Абонементы
          </h2>
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-4">
              💡 <strong>Важно:</strong> Стоимость включает аренду всего инвентаря. 
              При наличии своего инвентаря - скидка. 
            </p>
            <p className="text-orange-600 font-semibold">
              🎁 Купите абонемент в день пробного занятия - и пробное бесплатно!
            </p>
          </div>
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-white border">
              <TabsTrigger value="trial" className="text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Пробные
              </TabsTrigger>
              <TabsTrigger value="group" className="text-sm data-[state=active]:bg-teal-500 data-[state=active]:text-white">
                Групповые
              </TabsTrigger>
              <TabsTrigger value="individual" className="text-sm data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                Индивидуальные
              </TabsTrigger>
              <TabsTrigger value="family" className="text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Семейные
              </TabsTrigger>
              <TabsTrigger value="special" className="text-sm data-[state=active]:bg-green-500 data-[state=active]:text-white">
                Специальные
              </TabsTrigger>
            </TabsList>
            
            {Object.entries(plans).map(([category, categoryPlans]) => (
              <TabsContent key={category} value={category}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryPlans.map((plan, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="text-xl text-gray-800">{plan.name}</CardTitle>
                        {plan.sessions && (
                          <CardDescription className="text-gray-600">
                            {plan.sessions} • {plan.duration}
                          </CardDescription>
                        )}
                        {plan.duration && !plan.sessions && (
                          <CardDescription className="text-gray-600">
                            {plan.duration}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-orange-500 mb-2">
                          {plan.price}
                        </div>
                        {plan.note && (
                          <div className="text-sm text-red-600 font-semibold">{plan.note}</div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="text-center mt-12">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg max-w-2xl mx-auto">
              <p className="text-gray-700 mb-2">
                <strong>📞 Все акции и скидки уточняйте по телефону:</strong>
              </p>
              <a href="tel:89204163606" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
                8 920 416 36 06
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
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
                    <CardTitle className="text-lg text-gray-800">{faq.question}</CardTitle>
                    <Icon name={openFAQ === index ? "ChevronUp" : "ChevronDown"} size={20} />
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
      <section className="py-20 bg-gradient-to-r from-orange-500/10 to-teal-500/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800">
            Готовы к приключениям?
          </h2>
          <p className="text-xl mb-12 text-gray-600 max-w-2xl mx-auto">
            Свяжитесь с нами уже сегодня и узнайте больше о том, что нас ждет в мае 2026!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://t.me/kinetik_kids_vrn" target="_blank" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 text-xl">
              💬 Telegram консультация
            </a>
            <a href="tel:89204163606" className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 text-xl">
              📞 Позвонить нам
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img 
                src="https://cdn.poehali.dev/files/2799c2eb-0c3f-4244-9101-eccb835271d7.jpg" 
                alt="Kinetic Kids Logo" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-xl font-bold">KINETIC KIDS</span>
            </div>
            <div className="text-center md:text-right">
              <div className="text-lg font-semibold mb-2">г. Воронеж</div>
              <div className="text-orange-400">Открытие в мае 2026 года</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4 text-orange-400">Контакты</h4>
              <div className="space-y-2">
                <a href="tel:89204163606" className="block hover:text-orange-400 transition-colors">
                  📞 8 920 416 36 06
                </a>
                <a href="mailto:kinetic.kids@bk.ru" className="block hover:text-orange-400 transition-colors">
                  ✉️ kinetic.kids@bk.ru
                </a>
                <a href="https://t.me/kinetik_kids_vrn" target="_blank" className="block hover:text-orange-400 transition-colors">
                  💬 Telegram
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-teal-400">Направления</h4>
              <div className="space-y-1 text-sm text-gray-300">
                <div>🛹 Скейтбординг</div>
                <div>🛼 Ролики</div>
                <div>🚲 Велосипед & BMX</div>
                <div>🛴 Трюковой самокат</div>
                <div>🏃‍♂️ Беговел</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-purple-400">Для родителей</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block hover:text-purple-400 transition-colors">
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
    </div>
  );
}