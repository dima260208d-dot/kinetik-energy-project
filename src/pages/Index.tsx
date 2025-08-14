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
      price: '2800₽/мес',
      color: 'from-orange-400 to-red-500'
    },
    { 
      id: 'roller', 
      name: 'Роликовые коньки', 
      icon: '⛸️',
      description: 'От первых шагов до слалома',
      price: '2500₽/мес',
      color: 'from-blue-400 to-cyan-500'
    },
    { 
      id: 'bike', 
      name: 'BMX Велосипед', 
      icon: '🚲',
      description: 'Трюки и экстремальная езда',
      price: '3200₽/мес',
      color: 'from-green-400 to-emerald-500'
    },
    { 
      id: 'scooter', 
      name: 'Трюковый самокат', 
      icon: '🛴',
      description: 'Современный городской экстрим',
      price: '2600₽/мес',
      color: 'from-purple-400 to-pink-500'
    }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Базовый',
      price: '2500₽',
      color: 'from-blue-400 to-blue-600',
      features: ['4 занятия в месяц', 'Групповые тренировки', 'Аренда защиты']
    },
    {
      id: 'premium',
      name: 'Премиум',
      price: '4200₽',
      color: 'from-orange-400 to-red-500',
      features: ['8 занятий в месяц', 'Персональный тренер', 'Полный комплект защиты', 'Доступ к событиям']
    },
    {
      id: 'pro',
      name: 'Про',
      price: '6800₽',
      color: 'from-purple-400 to-pink-500',
      features: ['Безлимитные занятия', 'Индивидуальные тренировки', 'Премиум защита', 'Участие в соревнованиях', 'Kinetik ID профиль']
    }
  ];

  const trainers = [
    { name: 'Алекс Нео', sport: 'Скейт', rating: 4.9, experience: '8 лет', speciality: 'Street & Vert', color: 'from-orange-400 to-red-500' },
    { name: 'Мария Спид', sport: 'Ролики', rating: 4.8, experience: '6 лет', speciality: 'Слалом & Фристайл', color: 'from-blue-400 to-cyan-500' },
    { name: 'Макс Эйр', sport: 'BMX', rating: 5.0, experience: '10 лет', speciality: 'Dirt & Park', color: 'from-green-400 to-emerald-500' },
    { name: 'Катя Флай', sport: 'Самокат', rating: 4.9, experience: '5 лет', speciality: 'Street & Спайн', color: 'from-purple-400 to-pink-500' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 watercolor-shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img src="https://cdn.poehali.dev/files/fff3aebf-bdbd-42b4-9ece-b07735d4cc68.jpg" alt="Kinetik Kids" className="h-10" />
          <div className="hidden md:flex space-x-8">
            <a href="#sports" className="hover:text-primary transition-colors font-medium">Направления</a>
            <a href="#safety" className="hover:text-secondary transition-colors font-medium">Безопасность</a>
            <a href="#plans" className="hover:text-accent transition-colors font-medium">Абонементы</a>
            <a href="#trainers" className="hover:text-primary transition-colors font-medium">Тренеры</a>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold watercolor-shadow">
            Записаться
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(/img/0bc28b8a-5305-40c1-9c74-565d6b79f573.jpg)`,
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-white/30" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h2 className="text-6xl md:text-8xl font-black mb-6 watercolor-text">
            KINETIK KIDS
          </h2>
          <p className="text-2xl md:text-3xl mb-8 text-gray-700 font-light">
            Обучение без страха, катание без границ!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl px-8 py-4 watercolor-shadow hover-float">
              Выбрать абонемент
            </Button>
            <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground text-xl px-8 py-4 hover-float">
              Пробное занятие
            </Button>
          </div>
          <div className="mt-12 flex justify-center items-center space-x-8 text-sm">
            <div className="text-center watercolor-card rounded-xl p-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">0</div>
              <div className="text-gray-600">серьезных травм</div>
            </div>
            <div className="text-center watercolor-card rounded-xl p-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">97%</div>
              <div className="text-gray-600">довольных детей</div>
            </div>
            <div className="text-center watercolor-card rounded-xl p-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-cyan-500 bg-clip-text text-transparent">2</div>
              <div className="text-gray-600">года опыта</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section id="sports" className="py-20 bg-gradient-to-b from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 watercolor-text">
            Направления обучения
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sports.map((sport) => (
              <Card key={sport.id} className="watercolor-card hover-float group cursor-pointer border-0 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${sport.color}`} />
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {sport.icon}
                  </div>
                  <CardTitle className="text-gray-800 text-xl">{sport.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {sport.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${sport.color} bg-clip-text text-transparent mb-4`}>
                    {sport.price}
                  </div>
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    Подробнее
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-20 bg-gradient-to-b from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 watercolor-text">
            Технологии безопасности
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="watercolor-card border-0 text-center hover-float">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Shield" size={32} className="text-white" />
                </div>
                <CardTitle className="text-gray-800">Энергетический щит</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Полная защита: шлем, наколенники, налокотники и перчатки для каждого ученика</p>
              </CardContent>
            </Card>
            
            <Card className="watercolor-card border-0 text-center hover-float">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Heart" size={32} className="text-white" />
                </div>
                <CardTitle className="text-gray-800">Медицинский контроль</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Квалифицированный медик на каждой тренировке и постоянный мониторинг здоровья</p>
              </CardContent>
            </Card>
            
            <Card className="watercolor-card border-0 text-center hover-float">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Users" size={32} className="text-white" />
                </div>
                <CardTitle className="text-gray-800">Малые группы</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Максимум 6 детей на тренера для индивидуального подхода и контроля</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12 watercolor-card rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-6xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-4">0</div>
            <p className="text-xl text-gray-700">серьезных травм за 2 года работы</p>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 watercolor-text">
            Конструктор абонементов
          </h2>
          <Tabs value={selectedPlan} onValueChange={setSelectedPlan} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/90 backdrop-blur-sm">
              {plans.map((plan) => (
                <TabsTrigger 
                  key={plan.id} 
                  value={plan.id}
                  className="text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {plan.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {plans.map((plan) => (
              <TabsContent key={plan.id} value={plan.id}>
                <Card className="watercolor-card border-0 overflow-hidden">
                  <div className={`h-3 bg-gradient-to-r ${plan.color}`} />
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-gray-800">{plan.name}</CardTitle>
                    <div className={`text-5xl font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent my-4`}>
                      {plan.price}
                    </div>
                    <CardDescription className="text-xl text-gray-600">в месяц</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                            <Icon name="Check" className="text-white" size={12} />
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-3 watercolor-shadow">
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
      <section className="py-20 bg-gradient-to-b from-green-50 to-emerald-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 watercolor-text">
            Праздники в стиле Kinetik
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Организуем незабываемые дни рождения и мероприятия с экстремальным спортом, 
            профессиональной съемкой и призами для именинника
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="watercolor-card border-0 overflow-hidden hover-float">
              <div className="h-3 bg-gradient-to-r from-pink-400 to-rose-500" />
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">День рождения</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">2 часа экстрима + торт + подарки</p>
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">от 15000₽</div>
              </CardContent>
            </Card>
            
            <Card className="watercolor-card border-0 overflow-hidden hover-float">
              <div className="h-3 bg-gradient-to-r from-blue-400 to-cyan-500" />
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Корпоратив</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Тимбилдинг на колесах + фуршет</p>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">от 25000₽</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section id="trainers" className="py-20 bg-gradient-to-b from-cyan-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 watercolor-text">
            Тренеры-легенды
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((trainer, index) => (
              <Card key={index} className="watercolor-card border-0 hover-float group overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${trainer.color}`} />
                <CardHeader className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${trainer.color} rounded-full mx-auto mb-4 flex items-center justify-center text-2xl`}>
                    👨‍🏫
                  </div>
                  <CardTitle className="text-gray-800">{trainer.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary" className="mb-2">{trainer.sport}</Badge>
                    <div className="text-gray-600">{trainer.speciality}</div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-gray-800 font-bold">{trainer.rating}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{trainer.experience} опыта</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 watercolor-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Взорви асфальт вместе с нами!
          </h2>
          <p className="text-xl mb-12 text-white/90 max-w-2xl mx-auto">
            Присоединяйся к Kinetik Kids и почувствуй ветер в лицо еще до первой тренировки
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white hover:bg-white/90 text-gray-800 font-bold text-xl px-8 py-4 watercolor-shadow">
              <Icon name="MessageCircle" className="mr-2" />
              Telegram консультация
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-800 text-xl px-8 py-4">
              Записаться на пробное
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <img src="https://cdn.poehali.dev/files/fff3aebf-bdbd-42b4-9ece-b07735d4cc68.jpg" alt="Kinetik Kids" className="h-8 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">Школа экстремального спорта для детей</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-primary transition-colors">Контакты</a>
            <a href="#" className="hover:text-secondary transition-colors">Правила</a>
            <a href="#" className="hover:text-accent transition-colors">Telegram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}