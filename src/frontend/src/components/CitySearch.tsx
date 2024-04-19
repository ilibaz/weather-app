import { ChangeEvent, useState, useEffect } from 'react';

interface TextSearchProps {
    onSearch: (searchTerm: string) => void;
}

function CitySearch({ onSearch }: TextSearchProps) {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        onSearch(searchTerm);
    }, [searchTerm]);

    return (
        <div className="flex justify-center items-center ">
            <div className="relative min-w-[320px] md:w-4/5 w-full p-4">
                <input
                    type="text"
                    className="bg-[#111827] rounded-lg py-2 px-4 w-full outline-none"
                    placeholder="Search for a city..."
                    value={searchTerm}
                    onChange={handleChange}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-400 absolute top-1/2 right-6 transform -translate-y-1/2 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </div>
        </div>
    );
};

export default CitySearch;
