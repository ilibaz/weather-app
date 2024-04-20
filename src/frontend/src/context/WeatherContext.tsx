import React, { ReactNode, createContext, useContext, useState } from 'react';

type WeatherDescription = "rain" | "sunny" | "cloudy";

interface WeatherContextProps {
    temperature?: number;
    windSpeed?: number;
    windDirection?: string;
    weatherDescription: WeatherDescription;
    backgroundColor?: string;
    setBackgroundColor: (color: string) => void;
    updateWeatherInfo: (
        temperature: number,
        windSpeed: number,
        windDirection: string,
        weatherDescription: WeatherDescription
    ) => void;
}

const WeatherContext = createContext<WeatherContextProps | undefined>(undefined);

export const useWeather = () => {
    const context = useContext(WeatherContext);
    if (!context) {
        throw new Error('useWeather must be used within a WeatherProvider');
    }
    return context;
};

interface WeatherProviderProps {
    children: ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children }) => {
    const [temperature, setTemperature] = useState<number>();
    const [windSpeed, setWindSpeed] = useState<number>();
    const [windDirection, setWindDirection] = useState<string>();
    const [weatherDescription, setWeatherDescription] = useState<WeatherDescription>("sunny");
    const [backgroundColor, setBackgroundColor] = useState<string>();

    const updateWeatherInfo = (
        temperature: number,
        windSpeed: number,
        windDirection: string,
        weatherDescription: WeatherDescription
    ) => {
        setTemperature(temperature);
        setWindSpeed(windSpeed);
        setWindDirection(windDirection);
        setWeatherDescription(weatherDescription);
    };

    return (
        <WeatherContext.Provider
            value={{
                temperature,
                windSpeed,
                windDirection,
                weatherDescription,
                backgroundColor,
                setBackgroundColor,
                updateWeatherInfo,
            }}
        >
            {children}
        </WeatherContext.Provider>
    );
};
