import { ReactNode, useEffect, useState } from "react";
import { useWeather } from "../context/WeatherContext";

interface BackgroundStylerProps {
    children: ReactNode;
}

const BackgroundStyler: React.FC<BackgroundStylerProps> = ({ children }) => {
    const { setBackgroundColor, weatherDescription } = useWeather();
    const [backgroundGradient, setBackgroundGradient] = useState<string>('');
    const [additionalEffect, setAdditionalEffect] = useState<string>('');

    useEffect(() => {
        if (weatherDescription === "cloudy") {
            setBackgroundGradient('from-[#97d0f8] to-[#69bbf6]');
            setAdditionalEffect("radial-gradient(circle at left top, rgb(200, 200, 200) 1%, transparent 30%)");
            setBackgroundColor('#6dc6e3');
        } else if (weatherDescription === "rain") {
            setBackgroundGradient('from-[#5084e4] to-[#4872c2]');
            setAdditionalEffect("radial-gradient(circle at left top, rgb(25, 50, 155) 24%, transparent 100%)");
            setBackgroundColor('#7d9dd9');
        } else if (weatherDescription === "sunny") {
            setBackgroundGradient('from-[#4bb5d8] to-[#39add3]');
            setAdditionalEffect("radial-gradient(circle at left top, rgb(255, 255, 100) 1%, transparent 30%)");
            setBackgroundColor('#7cb3f0');
        }
    }, [weatherDescription]);

    return (
        <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient}`}>
            <div className="fixed top-0 bottom-0 left-0 right-0" style={{ background: additionalEffect }}></div>
            {children}
        </div>
    );
}

export default BackgroundStyler;