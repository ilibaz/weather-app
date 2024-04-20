import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useCities } from './CitiesContext';
import { useQuery } from '@tanstack/react-query';

type WeatherDescription = 'rain' | 'sunny' | 'cloudy';
type WindDirrection = 'North' | 'East' | 'South' | 'West';

export type WeatherInfo = {
    temperature: number;
    windSpeed: number;
    windDirection: WindDirrection;
    condition: WeatherDescription;
};

interface WeatherContextProps {
    weatherInSelectedCity?: WeatherInfo;
    backgroundColor?: string;
    setBackgroundColor: (color: string) => void;
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
    const { selectedCity } = useCities();
    const [weatherInSelectedCity, setWeatherInSelectedCity] = useState<WeatherInfo>();
    const [backgroundColor, setBackgroundColor] = useState<string>();

    const { isLoading, data, error } = useQuery({
        queryKey: ['cityWeather', selectedCity?.city],
        queryFn: ({ signal }) =>
            fetch(`http://localhost:3001/api/weather/${selectedCity?.city}`, { signal }).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch city weather');
                }
                return res.json();
            }),
        enabled: selectedCity !== undefined,
    });

    useEffect(() => {
        if (!isLoading && !error && data) {
            setWeatherInSelectedCity(data);
        }

        if (error) {
            console.error(error);
        }
    }, [isLoading, error, data]);

    return (
        <WeatherContext.Provider
            value={{
                backgroundColor,
                setBackgroundColor,
                weatherInSelectedCity,
            }}
        >
            {children}
        </WeatherContext.Provider>
    );
};