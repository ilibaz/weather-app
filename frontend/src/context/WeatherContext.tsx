import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { City, useCities } from './CitiesContext';
import { useQuery } from '@tanstack/react-query';
import { useDebounce, useLocalStorage } from '@uidotdev/usehooks';
import {
  FetchMetolibWeather,
  degreesToDirection,
  predictWeather,
} from '../utils/Metolib';

const WEATHER_FETCH_INTERVAL = 15 * 60 * 1000; // 15 min
const FETCH_DEBOUNCE_DELAY = 500; // 1 sec

export type WeatherDescription = 'rain' | 'sunny' | 'windy' | 'cloudy';
export type WindDirrection =
  | 'north'
  | 'north-east'
  | 'east'
  | 'south-east'
  | 'south'
  | 'south-west'
  | 'west'
  | 'north-west';
export type WeatherInfo = {
  error: boolean;
  timestamp: number;
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
  readWeatherForCity: (city: string) => WeatherInfo | undefined;
  isWeatherLoadingForCity: (city: City) => boolean;
}

const WeatherContext = createContext<WeatherContextProps | undefined>(
  undefined,
);

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

export const WeatherProvider: React.FC<WeatherProviderProps> = ({
  children,
}) => {
  const { visibleCities } = useCities();
  const [cachedWeather, setCachedWeather] = useLocalStorage<WeatherCache>(
    'cachedWeather',
    {},
  );
  const debouncedVisibleCities = useDebounce<City[]>(
    visibleCities,
    FETCH_DEBOUNCE_DELAY,
  );

  const updateCachedWeather = useCallback(
    (weatherData: WeatherCache) => {
      setCachedWeather(prevCachedWeather => {
        const updatedCache = { ...prevCachedWeather };

        for (const placeKey in weatherData) {
          if (Object.hasOwnProperty.call(weatherData, placeKey)) {
            const placeData = weatherData[placeKey];

            updatedCache[placeKey] = {
              ...placeData,
              timestamp: Date.now(),
              windDirection: degreesToDirection(
                weatherData[placeKey].windDirection as unknown as number,
              ),
              condition: predictWeather(weatherData[placeKey]),
            };
          }
        }

        return updatedCache;
      });
    },
    [setCachedWeather],
  );

  const isWeatherLoadingForCity = useCallback(
    (city: City): boolean => {
      const cityIsInDebounced =
        debouncedVisibleCities.findIndex(vc => vc.city === city.city) > -1;
      return cachedWeather
        ? cityIsInDebounced && !cachedWeather[city.city]
        : cityIsInDebounced;
    },
    [cachedWeather, debouncedVisibleCities],
  );

  const readWeatherForCity = useCallback(
    (place: string): WeatherInfo | undefined => {
      if (cachedWeather) {
        return cachedWeather[place];
      } else {
        return undefined;
      }
    },
    [cachedWeather],
  );

  const prepareCitiesForFetching = useCallback(
    (cities: City[]): string[] => {
      const resultCities: City[] = [];
      const currentTimestamp = Date.now();

      if (cachedWeather) {
        cities.forEach(city => {
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
        resultCities.push(...cities);
      }

      return resultCities.map(city => city.city);
    },
    [cachedWeather],
  );

  const { isLoading, data, error } = useQuery({
    queryKey: ['weather', prepareCitiesForFetching(debouncedVisibleCities)],
    queryFn: () =>
      FetchMetolibWeather(prepareCitiesForFetching(debouncedVisibleCities)),
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
        readWeatherForCity,
        isWeatherLoadingForCity,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
