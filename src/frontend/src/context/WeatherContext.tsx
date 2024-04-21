import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useCities } from './CitiesContext';
import { useQuery } from '@tanstack/react-query';
import { FetchMetolibWeather, degreesToDirection, predictWeather } from '../utils/Metolib';

export type WeatherDescription = 'rain' | 'sunny' | 'windy' | 'cloudy';
export type WindDirrection = 'north' | 'north-east' | 'east' | 'south-east' | 'south' | 'south-west' | 'west' | 'north-west';
export type WeatherInfo = {
    timestamp: number;
    localPlaceKey: string;
    temperature: number;
    windspeedms: number;
    windDirection: WindDirrection;
    precipitation1h: number;
    totalCloudCover: number;
    pressure: number;
    humidity: number;
    condition: WeatherDescription;
};

type WeatherCache = { [key: string]: WeatherInfo };

interface WeatherContextProps {
    backgroundColor?: string;
    isLoading: boolean;
    readWeatherForLocalPlace: (localPlaceKey: string) => WeatherInfo | undefined;
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
    const [cachedWeather, setCachedWeather] = useState<WeatherCache>();
    const [backgroundColor, setBackgroundColor] = useState<string>();

    const updateCachedWeather = useCallback((weatherData: any, localPlaceKey: string) => {
        setCachedWeather(prevCachedWeather => {
            const updatedCache = { ...prevCachedWeather };

            for (const placeKey in weatherData) {
                if (Object.hasOwnProperty.call(weatherData, placeKey)) {
                    const placeData = weatherData[placeKey];

                    updatedCache[placeKey] = {
                        ...placeData,
                        timestamp: Date.now(),
                        localPlaceKey: localPlaceKey,
                        windDirection: degreesToDirection(weatherData[placeKey].windDirection),
                        condition: predictWeather(weatherData[placeKey])
                    };
                }
            }

            return updatedCache;
        });
    }, [setCachedWeather]);

    const readWeatherForLocalPlace = useCallback((localPlaceKey: string): WeatherInfo | undefined => {
        if (cachedWeather) {
            for (const placeKey in cachedWeather) {
                if (cachedWeather[placeKey].localPlaceKey === localPlaceKey) {
                    return cachedWeather[placeKey];
                }
            }
        } else {
            return undefined;
        }
    }, [cachedWeather]);

    const { isLoading, data, error } = useQuery({
        queryKey: ['cityWeather', selectedCity?.city],
        queryFn: () => FetchMetolibWeather([selectedCity!.city]),
        enabled: selectedCity !== undefined,
    });

    useEffect(() => {
        if (!isLoading && !error && selectedCity) {
            updateCachedWeather(data, selectedCity.city);
        }
        if (!isLoading && error) {
            console.error(error);
        }
    }, [isLoading, error, data]);

    return (
        <WeatherContext.Provider
            value={{
                backgroundColor,
                isLoading,
                readWeatherForLocalPlace,
                setBackgroundColor,
            }}
        >
            {children}
        </WeatherContext.Provider>
    );
};
