import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Дата открытия - 1 декабря 2025 года
    const targetDate = new Date('2025-12-01T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-8 mb-12">
      <div className="text-3xl font-bold text-gray-800 mb-6 text-center">
        🚀 До открытия осталось:
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-4 shadow-lg">
            <div className="text-3xl font-bold">{timeLeft.days}</div>
            <div className="text-sm opacity-90">дней</div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg p-4 shadow-lg">
            <div className="text-3xl font-bold">{timeLeft.hours}</div>
            <div className="text-sm opacity-90">часов</div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-4 shadow-lg">
            <div className="text-3xl font-bold">{timeLeft.minutes}</div>
            <div className="text-sm opacity-90">минут</div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4 shadow-lg">
            <div className="text-3xl font-bold">{timeLeft.seconds}</div>
            <div className="text-sm opacity-90">секунд</div>
          </div>
        </div>
      </div>

      <div className="text-center text-2xl font-semibold text-gray-700 mb-4">
        📅 Открытие 1 декабря 2025 года!
      </div>
      <p className="text-lg text-gray-700 mb-6 text-center">Обучаем детей с трех лет, а также взрослых</p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="tel:89204163606" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg">
          📞 8 920 416 36 06
        </a>
        <a href="https://t.me/kinetik_kids_vrn" target="_blank" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg">
          💬 Telegram консультация
        </a>
        <a href="https://wa.me/message/WQFGATD3QMSHI1" target="_blank" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg">
          📱 WhatsApp
        </a>
      </div>
    </div>
  );
}