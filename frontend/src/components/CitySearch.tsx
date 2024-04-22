import { ChangeEvent } from 'react';
import { useCities } from '../context/CitiesContext';

function CitySearch() {
  const { searchTerm, setSearchTerm, resetSearchTerm } = useCities();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="sticky top-[-1px] z-50">
      <div className="absolute inset-x-0 flex justify-center items-center backdrop-filter backdrop-blur-lg p-4 shadow-lg">
        <div className="relative min-w-[300px] md:w-4/5 w-full">
          <input
            type="text"
            className="bg-gray-300 bg-opacity-100 rounded-lg py-2 px-4 w-full outline-none font-bold placeholder-gray-500 text-gray-800"
            placeholder="Start by searching for a city..."
            value={searchTerm}
            onChange={handleChange}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-800 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={() => resetSearchTerm()}
            style={{ display: searchTerm !== '' ? 'block' : 'none' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default CitySearch;
