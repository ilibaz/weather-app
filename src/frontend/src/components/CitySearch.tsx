import { ChangeEvent } from 'react';
import { useCities } from '../context/CitiesContext';

function CitySearch() {
    const { searchTerm, setSearchTerm, setSelectedCity } = useCities();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setSelectedCity(undefined);
    };

    return (
        <div className="sticky top-[-1px] z-50">
            <div className="absolute inset-x-0 flex justify-center items-center backdrop-filter backdrop-blur-lg p-4">
                <div className="relative min-w-[320px] md:w-4/5 w-full">
                    <input
                        type="text"
                        className="bg-white bg-opacity-25 rounded-lg py-2 px-4 w-full outline-none placeholder-gray-600 text-gray-700"
                        placeholder="Start by searching for a city..."
                        value={searchTerm}
                        onChange={handleChange}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-700 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default CitySearch;
