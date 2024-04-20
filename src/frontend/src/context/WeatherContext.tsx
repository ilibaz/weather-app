import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

type WeatherDescription = "rain" | "sunny" | "cloudy";

interface WeatherContextProps {
    cityName?: string;
    temperature?: number;
    windSpeed?: number;
    windDirection?: string;
    weatherDescription: WeatherDescription;
    backgroundColor?: string;
    setCityName: (cityName: string) => void;
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
    const [cityName, setCityName] = useState<string>();
    const [temperature, setTemperature] = useState<number>();
    const [windSpeed, setWindSpeed] = useState<number>();
    const [windDirection, setWindDirection] = useState<string>();
    const [weatherDescription, setWeatherDescription] = useState<WeatherDescription>("cloudy");
    const [backgroundColor, setBackgroundColor] = useState<string>();

    useEffect(() => {
        console.log(cityName);
    }, [cityName]);

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
                cityName,
                temperature,
                windSpeed,
                windDirection,
                weatherDescription,
                backgroundColor,
                setBackgroundColor,
                setCityName,
                updateWeatherInfo,
            }}
        >
            {children}
        </WeatherContext.Provider>
    );
};
