import { ReactNode, useEffect, useState } from "react";
import { useWeather } from "../context/WeatherContext";

interface BackgroundStylerProps {
    children: ReactNode;
}

const BackgroundStyler: React.FC<BackgroundStylerProps> = ({ children }) => {
    const { weatherInSelectedCity, setBackgroundColor } = useWeather();
    const [backgroundGradient, setBackgroundGradient] = useState<string>('');
    const [additionalEffect, setAdditionalEffect] = useState<string>('');

    useEffect(() => {
        if (weatherInSelectedCity) {
            if (weatherInSelectedCity.condition === "cloudy") {
                setBackgroundGradient('from-[#97d0f8] to-[#69bbf6]');
                setAdditionalEffect("radial-gradient(circle at left top, rgb(200, 200, 200) 1%, transparent 30%)");
                setBackgroundColor('#6dc6e3');
            } else if (weatherInSelectedCity.condition === "rain") {
                setBackgroundGradient('from-[#dce2f6] to-[#c7d0ea]');
                setAdditionalEffect("radial-gradient(circle at left top, rgb(25, 50, 155) 24%, transparent 100%)");
                setBackgroundColor('#7d9dd9');
            } else if (weatherInSelectedCity.condition === "sunny") {
                setBackgroundGradient('from-[#bfe3f4] to-[#93d6d1]');
                setAdditionalEffect("radial-gradient(circle at left top, rgb(100, 200, 200) -15%, transparent 45%)");
                setBackgroundColor('#7cb3f0');
            }
        } else {
            // default to sunny
            setBackgroundGradient('from-[#bfe3f4] to-[#93d6d1]');
            setAdditionalEffect("radial-gradient(circle at left top, rgb(100, 200, 200) -15%, transparent 45%)");
            setBackgroundColor('#7cb3f0');
        }
    }, [weatherInSelectedCity]);

    return (
        <div className={`min-h-screen bg-gradient-to-br transition-all duration-5000 ${backgroundGradient}`} style={{ transition: 'background 1s linear' }}>
            <div className="fixed top-0 bottom-0 left-0 right-0 transition-all duration-5000" style={{ background: additionalEffect, transition: 'background 1s linear' }}></div>
            {children}
        </div>
    );
}

export default BackgroundStyler;