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
    setSearchTerm: (term: string) => void;
}

const CitiesContext = createContext<CitiesContextProps | undefined>(undefined);

export const useCities = () => {
    const context = useContext(CitiesContext);
    if (!context) {
        throw new Error('useCities must be used within a SearchProvider');
    }
    return context;
};

interface SearchProviderProps {
    children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredCities, setFilteredCities] = useState<City[]>([]);

    const { isLoading, error, data: cities } = useQuery<City[]>({
        queryKey: ['cities'],
        queryFn: () =>
            fetch('http://localhost:3001/api/cities').then((res) =>
                res.json(),
            ),
    })

    useEffect(() => {
        let filtered: City[] = [];

        if (cities) {
            filtered = cities;
        }

        if (searchTerm) {
            filtered = cities ? cities.filter(city =>
                city.city.toLowerCase().includes(searchTerm.toLowerCase())
            ) : [];
        }

        setFilteredCities(filtered);
    }, [cities, searchTerm]);

    return (
        <CitiesContext.Provider
            value={{ filteredCities, isLoading, error, searchTerm, setSearchTerm }}
        >
            {children}
        </CitiesContext.Provider>
    );
};