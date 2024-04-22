import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    useQuery,
} from '@tanstack/react-query'

export interface City {
    city: string;
    lat: string;
    lng: string;
    country: string;
    iso2: string;
    admin_name: string;
    capital: string;
    population: string;
    population_proper: string;
}

interface CitiesContextProps {
    filteredCities: City[];
    isLoading: boolean;
    error: Error | null;
    searchTerm: string;

    visibleCities: City[];
    addVisibleCity: (city: City) => void;
    removeVisibleCity: (city: City) => void;

    setSearchTerm: (term: string) => void;
    resetSearchTerm: () => void;
}

const CitiesContext = createContext<CitiesContextProps | undefined>(undefined);

export const useCities = () => {
    const context = useContext(CitiesContext);
    if (!context) {
        throw new Error('useCities must be used within a SearchProvider');
    }
    return context;
};

interface CitiesProviderProps {
    children: ReactNode;
}

export const CitiesProvider: React.FC<CitiesProviderProps> = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredCities, setFilteredCities] = useState<City[]>([]);
    const [visibleCities, setVisibleCities] = useState<City[]>([]);

    const addVisibleCity = (city: City) => {
        setVisibleCities(prevVisibleCities => {
            if (!prevVisibleCities.includes(city)) {
                return [...prevVisibleCities, city];
            }
            return prevVisibleCities;
        });
    };

    const removeVisibleCity = (city: City) => {
        setVisibleCities(prevVisibleCities =>
            prevVisibleCities.filter(visibleCity => visibleCity.city !== city.city)
        );
    };

    const { isLoading, error, data: cities } = useQuery<City[]>({
        queryKey: ['cities'],
        queryFn: () =>
            fetch('http://localhost:3001/api/cities').then((res) =>
                res.json(),
            ),
    })

    useEffect(() => {
        if (searchTerm && cities) {
            setFilteredCities(cities.filter(city =>
                city.city.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        } else {
            setFilteredCities(cities || []);
        }
    }, [cities, searchTerm]);

    const resetSearchTerm = () => {
        setSearchTerm('');
    }

    return (
        <CitiesContext.Provider
            value={{
                filteredCities,
                isLoading,
                error,
                searchTerm,
                visibleCities,
                addVisibleCity,
                removeVisibleCity,
                setSearchTerm,
                resetSearchTerm
            }}
        >
            {children}
        </CitiesContext.Provider>
    );
};
