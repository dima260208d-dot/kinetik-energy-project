import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface SportDetails {
  id: string;
  name: string;
  icon: string;
  description: string;
  fullDescription: string;
  forWho: string;
  benefits: string[];
  develops: string[];
  images: string[];
}

interface SportDetailModalProps {
  sport: SportDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

const sportDetailsData: Record<string, SportDetails> = {
  skate: {
    id: 'skate',
    name: 'Скейтбординг',
    icon: '🛹',
    description: 'Изучаем основы катания, повороты, торможение и первые трюки',
    fullDescription: 'Скейтбординг — это не просто катание на доске, это целая культура и образ жизни. Мы учим детей основам балансировки, правильной стойке, безопасному катанию и постепенно переходим к освоению трюков.',
    forWho: 'Для детей от 5 лет и взрослых. Подходит как для начинающих, так и для тех, кто хочет улучшить технику.',
    benefits: [
      'Развитие координации и баланса',
      'Укрепление мышц ног и корпуса',
      'Повышение уверенности в себе',
      'Развитие креативности',
      'Улучшение концентрации внимания'
    ],
    develops: [
      'Физическую выносливость',
      'Смелость и решительность',
      'Пространственное мышление',
      'Умение преодолевать страхи',
      'Социальные навыки'
    ],
    images: [
      '/img/80c57862-a5aa-48b3-baa8-bcf7c66948bd.jpg',
      '/img/80c57862-a5aa-48b3-baa8-bcf7c66948bd.jpg'
    ]
  },
  roller: {
    id: 'roller',
    name: 'Ролики',
    icon: '🛼',
    description: 'От первых шагов до слалома и фристайла',
    fullDescription: 'Катание на роликах — универсальный вид спорта, который подходит всем. От базовых навыков катания до освоения слалома и сложных элементов фристайла.',
    forWho: 'Для детей от 4 лет и взрослых любого уровня подготовки.',
    benefits: [
      'Всестороннее физическое развитие',
      'Развитие вестибулярного аппарата',
      'Тренировка сердечно-сосудистой системы',
      'Развитие гибкости и ловкости',
      'Формирование правильной осанки'
    ],
    develops: [
      'Координацию движений',
      'Выносливость',
      'Чувство ритма',
      'Артистизм',
      'Целеустремленность'
    ],
    images: [
      '/img/6b43ceb5-8237-4a8a-b665-26e639e6ba0b.jpg',
      '/img/6b43ceb5-8237-4a8a-b665-26e639e6ba0b.jpg'
    ]
  },
  bike: {
    id: 'bike',
    name: 'Велосипед',
    icon: '🚲',
    description: 'Безопасная езда, трюки и велопрогулки',
    fullDescription: 'Обучение катанию на велосипеде с нуля, освоение техники безопасной езды, базовые трюки и навыки для уверенного передвижения по городу и паркам.',
    forWho: 'Для детей от 4 лет. Обучаем как начинающих, так и тех, кто хочет научиться трюкам.',
    benefits: [
      'Укрепление всех групп мышц',
      'Развитие баланса и координации',
      'Тренировка дыхательной системы',
      'Повышение общей выносливости',
      'Развитие реакции'
    ],
    develops: [
      'Физическую форму',
      'Независимость и самостоятельность',
      'Навыки ориентирования',
      'Уверенность в движении',
      'Экологическое мышление'
    ],
    images: [
      '/img/b6714c59-b345-4642-a647-1fa67951e0e7.jpg',
      '/img/b6714c59-b345-4642-a647-1fa67951e0e7.jpg'
    ]
  },
  bmx: {
    id: 'bmx',
    name: 'BMX',
    icon: '🚴‍♂️',
    description: 'Экстремальная езда, джампы и трюки на рампе',
    fullDescription: 'BMX — экстремальный вид спорта на специальных велосипедах. Обучаем технике прыжков, трюкам на рампе и фристайлу в безопасной среде под присмотром опытных тренеров.',
    forWho: 'Для детей от 7 лет и подростков с базовыми навыками катания на велосипеде.',
    benefits: [
      'Максимальное развитие координации',
      'Укрепление мышечного корсета',
      'Развитие скорости реакции',
      'Повышение стрессоустойчивости',
      'Тренировка концентрации'
    ],
    develops: [
      'Экстремальные навыки',
      'Смелость и решительность',
      'Умение рассчитывать траекторию',
      'Контроль над телом',
      'Спортивный азарт'
    ],
    images: [
      '/img/80c57862-a5aa-48b3-baa8-bcf7c66948bd.jpg',
      '/img/b6714c59-b345-4642-a647-1fa67951e0e7.jpg'
    ]
  },
  scooter: {
    id: 'scooter',
    name: 'Трюковой самокат',
    icon: '🛴',
    description: 'Современный городской экстрим и воздушные трюки',
    fullDescription: 'Трюковой самокат — один из самых популярных видов экстрима среди молодежи. От базовых прыжков до сложных воздушных комбинаций в специально оборудованном парке.',
    forWho: 'Для детей от 6 лет и подростков. Идеально для тех, кто любит активность и скорость.',
    benefits: [
      'Развитие баланса и ловкости',
      'Укрепление ног и корпуса',
      'Развитие пространственного мышления',
      'Улучшение реакции',
      'Повышение уверенности'
    ],
    develops: [
      'Экстремальные навыки',
      'Креативность в трюках',
      'Смелость',
      'Координацию в воздухе',
      'Чувство стиля'
    ],
    images: [
      '/img/80c57862-a5aa-48b3-baa8-bcf7c66948bd.jpg',
      '/img/6b43ceb5-8237-4a8a-b665-26e639e6ba0b.jpg'
    ]
  },
  runbike: {
    id: 'runbike',
    name: 'Беговел',
    icon: '🏃‍♂️',
    description: 'Первые шаги к освоению равновесия для самых маленьких',
    fullDescription: 'Беговел — идеальный первый транспорт для малышей. Помогает развить чувство баланса, подготавливает к катанию на велосипеде без использования дополнительных колес.',
    forWho: 'Для детей от 2 до 5 лет. Это первый шаг в мир катания!',
    benefits: [
      'Развитие равновесия с раннего возраста',
      'Укрепление мышц ног',
      'Развитие моторики',
      'Повышение самостоятельности',
      'Подготовка к велосипеду'
    ],
    develops: [
      'Координацию движений',
      'Уверенность в себе',
      'Физическую активность',
      'Социализацию',
      'Любовь к спорту'
    ],
    images: [
      '/img/b6714c59-b345-4642-a647-1fa67951e0e7.jpg',
      '/img/6b43ceb5-8237-4a8a-b665-26e639e6ba0b.jpg'
    ]
  }
};

export default function SportDetailModal({ sport, isOpen, onClose }: SportDetailModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    childName: '',
    childAge: '',
    message: ''
  });

  const details = sport ? sportDetailsData[sport.id] : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
    setFormData({
      name: '',
      phone: '',
      childName: '',
      childAge: '',
      message: ''
    });
    onClose();
  };

  if (!details) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl flex items-center gap-3">
            <span className="text-4xl">{details.icon}</span>
            {details.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Icon name="Info" size={20} />
              Что это?
            </h3>
            <p className="text-muted-foreground leading-relaxed">{details.fullDescription}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Icon name="Users" size={20} />
              Для кого?
            </h3>
            <p className="text-muted-foreground leading-relaxed">{details.forWho}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Icon name="Award" size={20} />
              Что дает?
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {details.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Icon name="TrendingUp" size={20} />
              Что развивает?
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {details.develops.map((develop, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span className="text-muted-foreground">{develop}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="AlertCircle" size={24} className="text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Важная информация</h3>
                <p className="text-amber-800">Открытие клуба запланировано на <strong>декабрь 2025 года</strong>. Сейчас вы можете оставить заявку, и мы свяжемся с вами, как только начнется набор в группы!</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border-2 border-purple-200">
            <h3 className="text-2xl font-semibold mb-4 text-center">Оставить заявку на занятие</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Ваше имя *</Label>
                  <Input
                    id="name"
                    required
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+7 (999) 123-45-67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="childName">Имя ребенка</Label>
                  <Input
                    id="childName"
                    placeholder="Имя и возраст"
                    value={formData.childName}
                    onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="childAge">Возраст ребенка</Label>
                  <Input
                    id="childAge"
                    type="number"
                    placeholder="5"
                    value={formData.childAge}
                    onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Комментарий (необязательно)</Label>
                <Textarea
                  id="message"
                  placeholder="Расскажите о предыдущем опыте или задайте вопрос..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full rainbow-button text-lg py-6">
                <Icon name="Send" className="mr-2" size={20} />
                Отправить заявку
              </Button>
            </form>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-center">Контакты для связи</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="mailto:info@kinetickids.ru" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                <Icon name="Mail" size={24} className="text-red-500" />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">info@kinetickids.ru</div>
                </div>
              </a>

              <a href="https://vk.com/kinetickids" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                <Icon name="Share2" size={24} className="text-blue-500" />
                <div>
                  <div className="text-sm text-gray-500">ВКонтакте</div>
                  <div className="font-medium">vk.com/kinetickids</div>
                </div>
              </a>

              <a href="https://t.me/kinetickids" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                <Icon name="Send" size={24} className="text-blue-400" />
                <div>
                  <div className="text-sm text-gray-500">Telegram</div>
                  <div className="font-medium">@kinetickids</div>
                </div>
              </a>

              <a href="https://wa.me/79991234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                <Icon name="MessageCircle" size={24} className="text-green-500" />
                <div>
                  <div className="text-sm text-gray-500">WhatsApp</div>
                  <div className="font-medium">+7 (999) 123-45-67</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}