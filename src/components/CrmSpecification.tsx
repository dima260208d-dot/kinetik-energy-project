import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const CrmSpecification = () => {
  const features = [
    {
      icon: 'Users',
      title: 'Модуль клиентов',
      items: [
        'Карточка клиента с полной историей: посещения, покупки, абонементы, прогресс, заметки тренеров',
        'Группировка по тегам: «новичок», «постоянный», «детская группа», «взрослая группа», «заморожен»',
        'Система уведомлений: SMS/email-напоминания о занятиях, окончании абонемента, персональные предложения'
      ]
    },
    {
      icon: 'Calendar',
      title: 'Модуль записи и расписания',
      items: [
        'Визуальное расписание на неделю с цветовой кодировкой занятий (групповые, индивидуальные, свободное время)',
        'Онлайн-запись для клиентов через сайт с выбором тренера, времени и направления',
        'Автоматический контроль занятости зала и тренеров (исключение двойных броней)'
      ]
    },
    {
      icon: 'CreditCard',
      title: 'Модуль финансов и абонементов',
      items: [
        'Гибкая система абонементов: фиксированные, с привязкой к сроку/количеству посещений, заморозка',
        'Учет разовых посещений и продаж мерча',
        'Интеграция с онлайн-кассой и эквайрингом',
        'Автоматический расчет долгов и формирование счетов'
      ]
    },
    {
      icon: 'UserCog',
      title: 'Модуль сотрудников',
      items: [
        'Учет графика работы и отпусков',
        'Расчет зарплаты на основе отработанных часов, процента от продаж и абонементов',
        'Разделение прав доступа: директор, администратор, тренер',
        'Функции найма (создание учетной записи) и увольнения (архивация профиля)'
      ]
    },
    {
      icon: 'BarChart3',
      title: 'Аналитика и отчетность',
      items: [
        'Статистика по посещаемости, выручке, заполняемости зала',
        'Отчеты по эффективности тренеров (удержание клиентов, продажи)',
        'Финансовые отчеты за любой период'
      ]
    }
  ];

  const uniqueFeatures = [
    {
      icon: 'Video',
      title: 'Интеграция с видеоаналитикой',
      description: 'Система автоматически помечает в карточке клиента видеоуспехи! Тренер через мобильное приложение за 30 секунд снимает, как ученик впервые сделал трюк, и прикрепляет видео к его профилю.'
    },
    {
      icon: 'Trophy',
      title: 'Геймификация для клиентов',
      description: 'Ученики получают цифровые значки (NFT-achievements) за достижения: «Первый прыжок», «5 занятий подряд», «Победитель челленджа». Значки можно коллекционировать и получать за них скидки.'
    },
    {
      icon: 'Brain',
      title: 'Персональный AI-тренер',
      description: 'На основе истории посещений и успехов система формирует индивидуальные рекомендации: «Тебе стоит посетить мастер-класс по грайндам, 80% твоего уровня уже его освоили!»'
    },
    {
      icon: 'Zap',
      title: 'Система лояльности «Kinetic Energy»',
      description: 'Клиенты копят «энергию» (баллы) за посещения, покупки и рекомендации друзьям. Энергию можно тратить на мерч, дополнительные занятия или кофе в баре.'
    }
  ];

  const clientFeatures = [
    'Запись онлайн: Наглядное расписание с свободными «окнами»',
    'История посещений и покупок: Что посетил, что купил, сколько осталось занятий',
    'Прогресс-трекер: График прогресса, видеоуспехи, коллекция цифровых достижений',
    'Баланс бонусной «энергии»: Сколько накопил, на что можно потратить',
    'Возможность купить/продлить абонемент онлайн'
  ];

  const staffRoles = [
    {
      role: 'Тренер',
      icon: 'Dumbbell',
      features: [
        'Свое расписание на день',
        'Список учеников в группе с их прогрессом и заметками',
        'Мобильное приложение для быстрой отметки посещения и загрузки видео',
        'Доступ к своей статистике и зарплате'
      ]
    },
    {
      role: 'Администратор',
      icon: 'Settings',
      features: [
        'Полный доступ к записи, клиентам, финансам',
        'Уведомления о предстоящих занятиях и просроченных платежах',
        'Возможность выставлять счета и печатать отчеты'
      ]
    },
    {
      role: 'Директор',
      icon: 'Crown',
      features: [
        'Вся статистика в реальном времени на дашборде: выручка за день, количество записей, топ-тренеры',
        'Модуль расчета зарплат: Умный калькулятор с автоматическим подсчетом отработанных часов, продаж и удержаний',
        'Глубокая аналитика: Отчеты по LTV клиента, оттоку, эффективности рекламных каналов',
        'Мониторинг активности: Журнал всех действий сотрудников в системе'
      ]
    }
  ];

  const integrations = [
    { name: '1С или другое бухгалтерское ПО', description: 'Обмен данными по финансам' },
    { name: 'СМС-провайдер и email-рассылки', description: 'Mailchimp, UniSender' },
    { name: 'Социальные сети и мессенджеры', description: 'Автоматическая публикация расписания и сбор заявок' },
    { name: 'Сайт клуба и онлайн-касса', description: 'Например, ЮKassa' }
  ];

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full">
          <Icon name="Rocket" className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Kinetic Control</h1>
        </div>
        <p className="text-xl text-gray-700 max-w-4xl mx-auto">
          Комплексная CRM-система для спортивного клуба, объединяющая функционал YClients с уникальными решениями для специфики спортивного клуба
        </p>
      </div>

      <Separator />

      {/* Базовый функционал */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Building" className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Базовый функционал</h2>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            Аналогично YClients
          </Badge>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon name={feature.icon as any} className="w-5 h-5 text-blue-600" />
                  </div>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm">
                      <Icon name="ChevronRight" className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Уникальный функционал */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Sparkles" className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Live Progress Hub</h2>
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            Уникальная фишка
          </Badge>
        </div>
        
        <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <p className="text-lg text-gray-700 leading-relaxed">
            Запатентованное решение, которое превращает CRM из системы учета в инструмент мотивации и удержания клиентов.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {uniqueFeatures.map((feature, index) => (
            <Card key={index} className="border-purple-200 hover:border-purple-300 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Icon name={feature.icon as any} className="w-5 h-5 text-purple-600" />
                  </div>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Что видят клиенты */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Eye" className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Личный кабинет клиентов</h2>
        </div>
        
        <Card className="border-green-200">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clientFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Icon name="Check" className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Что видят сотрудники */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Users" className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-800">Кабинеты сотрудников</h2>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          {staffRoles.map((role, index) => (
            <Card key={index} className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Icon name={role.icon as any} className="w-5 h-5 text-orange-600" />
                  </div>
                  {role.role}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {role.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm">
                      <Icon name="ArrowRight" className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Технические требования */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Cpu" className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">Технические требования</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Icon name="Smartphone" className="w-5 h-5 text-indigo-600" />
                Платформы
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Веб-приложение</Badge>
                <span className="text-sm text-gray-600">Основная платформа</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">iOS/Android</Badge>
                <span className="text-sm text-gray-600">Мобильное приложение для тренеров</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Icon name="Shield" className="w-5 h-5 text-indigo-600" />
                Безопасность
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="Lock" className="w-4 h-4 text-indigo-500" />
                <span className="text-sm">Разграничение прав доступа</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Lock" className="w-4 h-4 text-indigo-500" />
                <span className="text-sm">Шифрование персональных данных</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Lock" className="w-4 h-4 text-indigo-500" />
                <span className="text-sm">Соответствие ФЗ-152</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Icon name="Plug" className="w-5 h-5 text-indigo-600" />
              Интеграции
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {integrations.map((integration, index) => (
                <div key={index} className="p-4 bg-indigo-50 rounded-lg">
                  <div className="font-medium text-gray-800 mb-1">{integration.name}</div>
                  <div className="text-sm text-gray-600">{integration.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Заключение */}
      <section className="text-center">
        <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
          <CardContent className="pt-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Icon name="Target" className="w-8 h-8 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-800">Итоговая цель</h3>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              Система «Kinetic Control» не просто учитывает записи, а становится цифровым ядром клуба, 
              автоматизируя рутину, повышая лояльность клиентов через геймификацию и давая руководству 
              всю информацию для прибыльного управления бизнесом.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default CrmSpecification;