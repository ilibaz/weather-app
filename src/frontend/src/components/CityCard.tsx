import { City, useCities } from "../context/CitiesContext";
import { useWeather } from "../context/WeatherContext";

interface CityCardProps {
    city: City;
}

function CityCard({ city }: CityCardProps) {
    const { backgroundColor } = useWeather();
    const { selectedCity, setSelectedCity } = useCities();
    const { setSearchTerm } = useCities();

    const isSelected = selectedCity ? selectedCity.city === city.city : false;

    const handleCardClick = () => {
        setSelectedCity(city);
        setSearchTerm(city.city);
    };

    return (
        <div
            className={`w-full relative rounded-lg shadow-lg p-4 cursor-pointer ${isSelected ? 'h-40' : 'h-20'}`}
            onClick={handleCardClick}
        >
            <div className="absolute inset-0 backdrop-filter backdrop-blur-lg rounded-lg"></div>
            <div
                className="absolute inset-0 bg-gray-200 opacity-50 rounded-lg"
                style={{ backgroundColor: backgroundColor ? backgroundColor : undefined }}
            ></div>
            <div className="relative z-10">
                <h2 className="text-gray-700 text-xl font-bold mb-2">{city.city}</h2>
                <p className="text-gray-700">25°, 10 m/s, North</p>
            </div>
        </div>
    );
};

export default CityCard;