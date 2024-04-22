import { ReactNode, useEffect, useState } from 'react';
import { WeatherInfo } from '../context/WeatherContext';

interface BackgroundStylerProps {
  children: ReactNode;
  weather?: WeatherInfo;
}

const BackgroundStyler: React.FC<BackgroundStylerProps> = ({
  children,
  weather,
}) => {
  const [backgroundGradient, setBackgroundGradient] = useState<string>('');
  const [additionalEffect, setAdditionalEffect] = useState<string>('');

  useEffect(() => {
    if (weather) {
      if (weather.condition === 'cloudy') {
        setBackgroundGradient('from-[#97d0f8] to-[#69bbf6]');
        setAdditionalEffect(
          'radial-gradient(circle at left top, rgb(200, 200, 200) 25%, transparent 75%)',
        );
      } else if (weather.condition === 'rain') {
        setBackgroundGradient('from-[#dce2f6] to-[#c7d0ea]');
        setAdditionalEffect(
          'radial-gradient(circle at left top, rgb(25, 50, 155) 24%, transparent 100%)',
        );
      } else if (weather.condition === 'sunny') {
        setBackgroundGradient('from-[#bfe3f4] to-[#93d6d1]');
        setAdditionalEffect(
          'radial-gradient(circle at left top, rgb(200, 200, 70) 5%, transparent 50%)',
        );
      } else if (weather.condition === 'windy') {
        setBackgroundGradient('from-[#bbbbbb] to-[#cccccc]');
        setAdditionalEffect(
          'radial-gradient(circle at left top, rgb(250, 250, 250) 1%, transparent 30%)',
        );
      }
    } else {
      // default
      setBackgroundGradient('bg-gray-300');
      setAdditionalEffect('none');
    }
  }, [weather]);

  return (
    <div
      className={`relative rounded-lg overflow-hidden bg-gradient-to-br ${backgroundGradient}`}
    >
      <div
        className="absolute top-0 bottom-0 left-0 right-0"
        style={{ background: additionalEffect }}
      ></div>
      {children}
    </div>
  );
};

export default BackgroundStyler;
