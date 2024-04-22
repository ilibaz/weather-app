import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { City, useCities } from './CitiesContext';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
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

export type WeatherCache = { [key: string]: WeatherInfo };

interface WeatherContextProps {
    isLoading: boolean;
    readWeatherForLocalPlace: (localPlaceKey: string) => WeatherInfo | undefined;
}

const WeatherContext = createContext<WeatherContextProps | undefined>(undefined);

export const useWeather = () => {
    const context = useContext(WeatherContext);
    if (!context) {
        throw new Error('useWeather must be used within a WeatherProvider');
    }
    return context;
};

const WEATHER_FETCH_INTERVAL = 15 * 60 * 1000; // 15 min

interface WeatherProviderProps {
    children: ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children }) => {
    const { visibleCities } = useCities();
    const [cachedWeather, setCachedWeather] = useState<WeatherCache>();
    const debouncedVisibleCities = useDebounce<City[]>(visibleCities, 1000);

    const updateCachedWeather = useCallback((weatherData: WeatherCache) => {
        setCachedWeather(prevCachedWeather => {
            const updatedCache = { ...prevCachedWeather };

            for (const placeKey in weatherData) {
                if (Object.hasOwnProperty.call(weatherData, placeKey)) {
                    const placeData = weatherData[placeKey];

                    updatedCache[placeKey] = {
                        ...placeData,
                        timestamp: Date.now(),
                        windDirection: degreesToDirection(weatherData[placeKey].windDirection as unknown as number),
                        condition: predictWeather(weatherData[placeKey])
                    };
                }
            }

            return updatedCache;
        });
    }, [setCachedWeather]);

    const readWeatherForLocalPlace = useCallback((place: string): WeatherInfo | undefined => {
        if (cachedWeather) {
            return cachedWeather[place];
        } else {
            return undefined;
        }
    }, [cachedWeather]);

    const prepareCitiesForFetching = useCallback((cities: City[]): string[] => {
        let resultCities: City[] = [];
        const currentTimestamp = Date.now();

        if (cachedWeather) {
            cities.forEach((city) => {
                if (!Object.hasOwnProperty.call(cachedWeather, city.city)) {
                    resultCities.push(city);
                } else {
                    const cityWeather = cachedWeather[city.city];
                    const timeSinceLastFetch = currentTimestamp - cityWeather.timestamp;
                    if (timeSinceLastFetch >= WEATHER_FETCH_INTERVAL) {
                        resultCities.push(city);
                    }
                }
            });
        } else {
            resultCities = [...cities];
        }

        return resultCities.map(city => city.city);
    }, [cachedWeather]);

    const { isLoading, data, error } = useQuery({
        queryKey: ['weather', prepareCitiesForFetching(debouncedVisibleCities)],
        queryFn: () => FetchMetolibWeather(prepareCitiesForFetching(debouncedVisibleCities)),
        enabled: prepareCitiesForFetching(debouncedVisibleCities).length > 0,
    });

    useEffect(() => {
        if (!isLoading && !error && data) {
            updateCachedWeather(data);
        }
        if (!isLoading && error) {
            console.error(error);
        }
    }, [isLoading, error, data, updateCachedWeather]);

    return (
        <WeatherContext.Provider
            value={{
                isLoading,
                readWeatherForLocalPlace,
            }}
        >
            {children}
        </WeatherContext.Provider>
    );
};
