import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const sports = [
    { 
      id: 'skate', 
      name: 'Скейтбordinг', 
      icon: '🛹',
      description: '97% учеников делают олли за 2 недели',
      price: '2800₽/мес',
      neonColor: 'neon-orange',
      gradient: 'from-neon-orange to-orange-600'
    },
    { 
      id: 'roller', 
      name: 'Роликовые коньки', 
      icon: '⛸️',
      description: 'От первых шагов до слалома',
      price: '2500₽/мес',
      neonColor: 'neon-cyan',
      gradient: 'from-neon-cyan to-cyan-600'
    },
    { 
      id: 'bike', 
      name: 'BMX Велосипед', 
      icon: '🚲',
      description: 'Трюки и экстремальная езда',
      price: '3200₽/мес',
      neonColor: 'neon-green',
      gradient: 'from-neon-green to-green-600'
    },
    { 
      id: 'scooter', 
      name: 'Трюковый самокат', 
      icon: '🛴',
      description: 'Современный городской экстрим',
      price: '2600₽/мес',
      neonColor: 'neon-purple',
      gradient: 'from-neon-purple to-purple-600'
    }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Базовый',
      price: '2500₽',
      neonColor: 'neon-cyan',
      features: ['4 занятия в месяц', 'Групповые тренировки', 'Аренда защиты']
    },
    {
      id: 'premium',
      name: 'Премиум',
      price: '4200₽',
      neonColor: 'neon-orange',
      features: ['8 занятий в месяц', 'Персональный тренер', 'Полный комплект защиты', 'Доступ к событиям']
    },
    {
      id: 'pro',
      name: 'Про',
      price: '6800₽',
      neonColor: 'neon-purple',
      features: ['Безлимитные занятия', 'Индивидуальные тренировки', 'Премиум защита', 'Участие в соревнованиях', 'Kinetik ID профиль']
    }
  ];

  const trainers = [
    { name: 'Алекс Нео', sport: 'Скейт', rating: 4.9, experience: '8 лет', speciality: 'Street & Vert', neonColor: 'neon-orange' },
    { name: 'Мария Спид', sport: 'Ролики', rating: 4.8, experience: '6 лет', speciality: 'Слалом & Фристайл', neonColor: 'neon-cyan' },
    { name: 'Макс Эйр', sport: 'BMX', rating: 5.0, experience: '10 лет', speciality: 'Dirt & Park', neonColor: 'neon-green' },
    { name: 'Катя Флай', sport: 'Самокат', rating: 4.9, experience: '5 лет', speciality: 'Street & Спайн', neonColor: 'neon-purple' }
  ];

  return (
    <div className="min-h-screen bg-kinetik-dark text-foreground cyber-grid">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-kinetik-dark/90 backdrop-blur-md border-b border-neon-cyan/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-neon-orange to-neon-purple rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">K</span>
            </div>
            <h1 className="text-2xl font-bold neon-text text-neon-orange">KINETIK KIDS</h1>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#sports" className="hover:text-neon-cyan transition-colors font-medium interactive-icon">Направления</a>
            <a href="#safety" className="hover:text-neon-purple transition-colors font-medium interactive-icon">Безопасность</a>
            <a href="#plans" className="hover:text-neon-orange transition-colors font-medium interactive-icon">Абонементы</a>
            <a href="#trainers" className="hover:text-neon-cyan transition-colors font-medium interactive-icon">Тренеры</a>
          </div>
          <Button className="cyber-button">
            Записаться
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden hero-parallax"
        style={{
          backgroundImage: `url(/img/5d5454a8-c097-429d-bc2a-467924cebc88.jpg)`
        }}>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 animate-slide-up">
          <h2 className="text-6xl md:text-8xl font-black mb-6 neon-text text-neon-orange">
            KINETIK KIDS
          </h2>
          <p className="text-2xl md:text-3xl mb-8 text-neon-cyan font-light animate-glow">
            Обучение без страха, катание без границ!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="cyber-button text-xl px-8 py-4 animate-float">
              Выбрать абонемент
            </Button>
            <Button size="lg" variant="outline" className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black text-xl px-8 py-4 neon-glow">
              Пробное занятие
            </Button>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            <div className="sport-card p-6">
              <div className="digital-counter text-neon-orange mb-2">0</div>
              <div className="text-gray-300 text-sm">серьезных травм</div>
            </div>
            <div className="sport-card p-6">
              <div className="digital-counter text-neon-purple mb-2">97%</div>
              <div className="text-gray-300 text-sm">довольных детей</div>
            </div>
            <div className="sport-card p-6">
              <div className="digital-counter text-neon-cyan mb-2">2</div>
              <div className="text-gray-300 text-sm">года опыта</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section id="sports" className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 neon-text text-neon-cyan">
            Направления обучения
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sports.map((sport) => (
              <Card key={sport.id} className="sport-card group cursor-pointer">
                <CardHeader className="text-center">
                  <div className={`text-6xl mb-4 group-hover:animate-bounce-slow interactive-icon text-${sport.neonColor}`}>
                    {sport.icon}
                  </div>
                  <CardTitle className={`text-white text-xl group-hover:text-${sport.neonColor} transition-colors`}>
                    {sport.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {sport.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className={`text-2xl font-bold text-${sport.neonColor} mb-4 digital-counter`}>
                    {sport.price}
                  </div>
                  <Button className={`w-full bg-${sport.neonColor} hover:bg-${sport.neonColor}/80 text-black font-bold neon-glow`}>
                    Подробнее
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 neon-text text-neon-purple">
            Технологии безопасности
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="sport-card text-center group">
              <CardHeader>
                <div className="energy-shield w-20 h-20 bg-gradient-to-r from-neon-orange to-neon-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Shield" size={32} className="text-white" />
                </div>
                <CardTitle className="text-white group-hover:text-neon-orange transition-colors">
                  Энергетический щит
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Полная защита: шлем, наколенники, налокотники и перчатки для каждого ученика</p>
              </CardContent>
            </Card>
            
            <Card className="sport-card text-center group">
              <CardHeader>
                <div className="energy-shield w-20 h-20 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Heart" size={32} className="text-white" />
                </div>
                <CardTitle className="text-white group-hover:text-neon-purple transition-colors">
                  Медицинский контроль
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Квалифицированный медик на каждой тренировке и постоянный мониторинг здоровья</p>
              </CardContent>
            </Card>
            
            <Card className="sport-card text-center group">
              <CardHeader>
                <div className="energy-shield w-20 h-20 bg-gradient-to-r from-neon-cyan to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Users" size={32} className="text-white" />
                </div>
                <CardTitle className="text-white group-hover:text-neon-cyan transition-colors">
                  Малые группы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Максимум 6 детей на тренера для индивидуального подхода и контроля</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-16">
            <div className="sport-card inline-block p-8">
              <div className="digital-counter text-6xl mb-4 text-neon-orange">0</div>
              <p className="text-xl text-gray-300">серьезных травм за 2 года работы</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 neon-text text-neon-orange">
            Конструктор абонементов
          </h2>
          <Tabs value={selectedPlan} onValueChange={setSelectedPlan} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-kinetik-darker/80 border border-neon-cyan/30">
              {plans.map((plan) => (
                <TabsTrigger 
                  key={plan.id} 
                  value={plan.id}
                  className={`text-base data-[state=active]:bg-${plan.neonColor} data-[state=active]:text-black font-bold neon-glow`}
                >
                  {plan.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {plans.map((plan) => (
              <TabsContent key={plan.id} value={plan.id}>
                <Card className="sport-card">
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-white mb-4">{plan.name}</CardTitle>
                    <div className={`digital-counter text-5xl text-${plan.neonColor} mb-4`}>
                      {plan.price}
                    </div>
                    <CardDescription className="text-xl text-gray-400">в месяц</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <div className={`w-5 h-5 bg-${plan.neonColor} rounded-full flex items-center justify-center`}>
                            <Icon name="Check" className="text-black" size={12} />
                          </div>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full cyber-button bg-${plan.neonColor} hover:bg-${plan.neonColor}/80 text-black font-bold text-lg py-4`}>
                      Выбрать план
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 neon-text text-neon-green">
            Праздники в стиле Kinetik
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Организуем незабываемые дни рождения и мероприятия с экстремальным спортом, 
            профессиональной съемкой и призами для именинника
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="sport-card group">
              <CardHeader>
                <div className="text-4xl mb-4 text-neon-pink group-hover:animate-bounce-slow">🎉</div>
                <CardTitle className="text-2xl text-white group-hover:text-neon-pink transition-colors">
                  День рождения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">2 часа экстрима + торт + подарки</p>
                <div className="digital-counter text-3xl text-neon-pink">от 15000₽</div>
              </CardContent>
            </Card>
            
            <Card className="sport-card group">
              <CardHeader>
                <div className="text-4xl mb-4 text-neon-cyan group-hover:animate-bounce-slow">🏢</div>
                <CardTitle className="text-2xl text-white group-hover:text-neon-cyan transition-colors">
                  Корпоратив
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">Тимбилдинг на колесах + фуршет</p>
                <div className="digital-counter text-3xl text-neon-cyan">от 25000₽</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section id="trainers" className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 neon-text text-neon-purple">
            Тренеры-легенды
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((trainer, index) => (
              <Card key={index} className="trainer-card group">
                <CardHeader className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r from-${trainer.neonColor} to-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl group-hover:animate-spin-slow`}>
                    👨‍🏫
                  </div>
                  <CardTitle className={`text-white group-hover:text-${trainer.neonColor} transition-colors`}>
                    {trainer.name}
                  </CardTitle>
                  <CardDescription>
                    <Badge variant="secondary" className={`mb-2 bg-${trainer.neonColor} text-black`}>
                      {trainer.sport}
                    </Badge>
                    <div className="text-gray-400">{trainer.speciality}</div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-yellow-400 animate-pulse">★</span>
                    <span className="text-white font-bold digital-counter text-lg">{trainer.rating}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{trainer.experience} опыта</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative bg-gradient-to-r from-neon-orange/20 to-neon-purple/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 neon-text text-white animate-glow">
            Взорви асфальт вместе с нами!
          </h2>
          <p className="text-xl mb-12 text-gray-300 max-w-2xl mx-auto">
            Присоединяйся к Kinetik Kids и почувствуй ветер в лице еще до первой тренировки
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="cyber-button bg-neon-cyan hover:bg-neon-cyan/80 text-black font-bold text-xl px-8 py-4">
              <Icon name="MessageCircle" className="mr-2" />
              Telegram консультация
            </Button>
            <Button size="lg" variant="outline" className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black text-xl px-8 py-4 neon-glow">
              Записаться на пробное
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-neon-cyan/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-neon-orange to-neon-purple rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">K</span>
            </div>
            <span className="text-neon-orange font-bold text-xl">KINETIK KIDS</span>
          </div>
          <p className="text-gray-400 mb-6">Школа экстремального спорта для детей</p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-neon-orange transition-colors interactive-icon">Контакты</a>
            <a href="#" className="text-gray-400 hover:text-neon-purple transition-colors interactive-icon">Правила</a>
            <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors interactive-icon">Telegram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}