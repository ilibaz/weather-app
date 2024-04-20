import { ReactNode, useEffect, useState } from "react";
import { useWeather } from "../context/WeatherContext";

interface BackgroundStylerProps {
    children: ReactNode;
}

const BackgroundStyler: React.FC<BackgroundStylerProps> = ({ children }) => {
    const { setBackgroundColor, weatherDescription } = useWeather();
    const [backgroundGradient, setBackgroundGradient] = useState<string>('');

    useEffect(() => {
        let newBackgroundGradient = '';
        let newBackgroundColor = '';

        if (weatherDescription === "cloudy") {
            newBackgroundGradient = 'from-[#97d0f8] to-[#69bbf6]';
            newBackgroundColor = '#6dc6e3';
        } else if (weatherDescription === "rain") {
            newBackgroundGradient = 'from-[#5084e4] to-[#4872c2]';
            newBackgroundColor = '#7d9dd9';
        } else if (weatherDescription === "sunny") {
            newBackgroundGradient = 'from-[#6ad1fa] to-[#5dbce1]';
            newBackgroundColor = '#7cb3f0';
        }

        setBackgroundGradient(newBackgroundGradient);
        setBackgroundColor(newBackgroundColor);
    }, [weatherDescription]);

    return (
        <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient}`}>
            {children}
        </div>
    );
}

export default BackgroundStyler;