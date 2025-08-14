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
      name: 'Скейтбординг', 
      icon: '🛹',
      description: '97% учеников делают олли за 2 недели',
      price: '2800₽/мес'
    },
    { 
      id: 'roller', 
      name: 'Роликовые коньки', 
      icon: '⛸️',
      description: 'От первых шагов до слалома',
      price: '2500₽/мес'
    },
    { 
      id: 'bike', 
      name: 'BMX Велосипед', 
      icon: '🚲',
      description: 'Трюки и экстремальная езда',
      price: '3200₽/мес'
    },
    { 
      id: 'scooter', 
      name: 'Трюковый самокат', 
      icon: '🛴',
      description: 'Современный городской экстрим',
      price: '2600₽/мес'
    }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Базовый',
      price: '2500₽',
      features: ['4 занятия в месяц', 'Групповые тренировки', 'Аренда защиты']
    },
    {
      id: 'premium',
      name: 'Премиум',
      price: '4200₽',
      features: ['8 занятий в месяц', 'Персональный тренер', 'Полный комплект защиты', 'Доступ к событиям']
    },
    {
      id: 'pro',
      name: 'Про',
      price: '6800₽',
      features: ['Безлимитные занятия', 'Индивидуальные тренировки', 'Премиум защита', 'Участие в соревнованиях', 'Kinetik ID профиль']
    }
  ];

  const trainers = [
    { name: 'Алекс Нео', sport: 'Скейт', rating: 4.9, experience: '8 лет', speciality: 'Street & Vert' },
    { name: 'Мария Спид', sport: 'Ролики', rating: 4.8, experience: '6 лет', speciality: 'Слалом & Фристайл' },
    { name: 'Макс Эйр', sport: 'BMX', rating: 5.0, experience: '10 лет', speciality: 'Dirt & Park' },
    { name: 'Катя Флай', sport: 'Самокат', rating: 4.9, experience: '5 лет', speciality: 'Street & Спайн' }
  ];

  return (
    <div className="min-h-screen bg-kinetik-dark text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-kinetik-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold neon-text text-neon-orange">KINETIK KIDS</h1>
          <div className="hidden md:flex space-x-6">
            <a href="#sports" className="hover:text-neon-cyan transition-colors">Направления</a>
            <a href="#safety" className="hover:text-neon-purple transition-colors">Безопасность</a>
            <a href="#plans" className="hover:text-neon-orange transition-colors">Абонементы</a>
            <a href="#trainers" className="hover:text-neon-cyan transition-colors">Тренеры</a>
          </div>
          <Button className="bg-neon-orange hover:bg-neon-orange/80 text-black font-bold neon-glow">
            Записаться
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url(/img/b05da7ba-96b9-412d-a4a4-09133630986e.jpg)`,
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 gradient-bg opacity-20" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h2 className="text-6xl md:text-8xl font-black mb-6 neon-text text-white">
            KINETIK KIDS
          </h2>
          <p className="text-2xl md:text-3xl mb-8 text-neon-cyan font-light">
            Обучение без страха, катание без границ!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-neon-orange hover:bg-neon-orange/80 text-black font-bold text-xl px-8 py-4 neon-glow hover-scale">
              Выбрать абонемент
            </Button>
            <Button size="lg" variant="outline" className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black text-xl px-8 py-4">
              Пробное занятие
            </Button>
          </div>
          <div className="mt-12 flex justify-center items-center space-x-8 text-sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-orange neon-text">0</div>
              <div className="text-gray-300">серьезных травм</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-purple neon-text">97%</div>
              <div className="text-gray-300">довольных детей</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-cyan neon-text">2</div>
              <div className="text-gray-300">года опыта</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section id="sports" className="py-20 bg-kinetik-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            Направления обучения
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sports.map((sport) => (
              <Card key={sport.id} className="bg-card border-white/20 hover-scale group cursor-pointer">
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {sport.icon}
                  </div>
                  <CardTitle className="text-neon-orange text-xl">{sport.name}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {sport.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-neon-cyan mb-4">{sport.price}</div>
                  <Button className="w-full bg-secondary hover:bg-secondary/80">
                    Подробнее
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            Технологии безопасности
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-card border-neon-orange/30 text-center">
              <CardHeader>
                <Icon name="Shield" size={48} className="text-neon-orange mx-auto mb-4 neon-glow" />
                <CardTitle className="text-neon-orange">Энергетический щит</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Полная защита: шлем, наколенники, налокотники и перчатки для каждого ученика</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-neon-purple/30 text-center">
              <CardHeader>
                <Icon name="Heart" size={48} className="text-neon-purple mx-auto mb-4 neon-glow" />
                <CardTitle className="text-neon-purple">Медицинский контроль</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Квалифицированный медик на каждой тренировке и постоянный мониторинг здоровья</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-neon-cyan/30 text-center">
              <CardHeader>
                <Icon name="Users" size={48} className="text-neon-cyan mx-auto mb-4 neon-glow" />
                <CardTitle className="text-neon-cyan">Малые группы</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Максимум 6 детей на тренера для индивидуального подхода и контроля</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <div className="text-6xl font-black text-neon-orange neon-text mb-4">0</div>
            <p className="text-xl text-gray-300">серьезных травм за 2 года работы</p>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 bg-kinetik-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            Конструктор абонементов
          </h2>
          <Tabs value={selectedPlan} onValueChange={setSelectedPlan} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-card">
              {plans.map((plan) => (
                <TabsTrigger 
                  key={plan.id} 
                  value={plan.id}
                  className="text-base data-[state=active]:bg-neon-orange data-[state=active]:text-black"
                >
                  {plan.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {plans.map((plan) => (
              <TabsContent key={plan.id} value={plan.id}>
                <Card className="bg-card border-neon-orange/30">
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-neon-orange">{plan.name}</CardTitle>
                    <div className="text-5xl font-black text-white my-4">{plan.price}</div>
                    <CardDescription className="text-xl">в месяц</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <Icon name="Check" className="text-neon-cyan" size={20} />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-neon-orange hover:bg-neon-orange/80 text-black font-bold text-lg py-3 neon-glow">
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
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Праздники в стиле Kinetik
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Организуем незабываемые дни рождения и мероприятия с экстремальным спортом, 
            профессиональной съемкой и призами для именинника
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card border-neon-pink/30">
              <CardHeader>
                <CardTitle className="text-neon-pink text-2xl">День рождения</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">2 часа экстрима + торт + подарки</p>
                <div className="text-3xl font-bold text-white">от 15000₽</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-neon-cyan/30">
              <CardHeader>
                <CardTitle className="text-neon-cyan text-2xl">Корпоратив</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">Тимбилдинг на колесах + фуршет</p>
                <div className="text-3xl font-bold text-white">от 25000₽</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section id="trainers" className="py-20 bg-kinetik-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            Тренеры-легенды
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((trainer, index) => (
              <Card key={index} className="bg-card border-white/20 hover-scale group">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-gradient-bg rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    👨‍🏫
                  </div>
                  <CardTitle className="text-neon-orange">{trainer.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary" className="mb-2">{trainer.sport}</Badge>
                    <div className="text-neon-cyan">{trainer.speciality}</div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-bold">{trainer.rating}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{trainer.experience} опыта</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-black">
            Взорви асфальт вместе с нами!
          </h2>
          <p className="text-xl mb-12 text-black/80 max-w-2xl mx-auto">
            Присоединяйся к Kinetik Kids и почувствуй ветер в лицо еще до первой тренировки
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-black hover:bg-black/80 text-white font-bold text-xl px-8 py-4">
              <Icon name="MessageCircle" className="mr-2" />
              Telegram консультация
            </Button>
            <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white text-xl px-8 py-4">
              Записаться на пробное
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-kinetik-dark border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-neon-orange mb-4 neon-text">KINETIK KIDS</h3>
          <p className="text-gray-400 mb-6">Школа экстремального спорта для детей</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-neon-cyan transition-colors">Контакты</a>
            <a href="#" className="hover:text-neon-purple transition-colors">Правила</a>
            <a href="#" className="hover:text-neon-orange transition-colors">Telegram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}