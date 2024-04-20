import { City, useCities } from "../context/CitiesContext";
import { useWeather } from "../context/WeatherContext";

interface CityCardProps {
    city: City;
}

function CityCard({ city }: CityCardProps) {
    const { backgroundColor, weatherInSelectedCity } = useWeather();
    const { selectedCity, setSelectedCity, setSearchTerm } = useCities();

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
                <p className="mb-2">
                    <span className="text-gray-800 text-xl font-bold">{city.city}</span>
                    <span className="text-gray-800 text-xs"> | {city.admin_name}</span>
                </p>
                {isSelected && weatherInSelectedCity && (
                    <div className="text-gray-800">
                        <p>Temperature: {weatherInSelectedCity.temperature}°</p>
                        <p>Wind Speed: {weatherInSelectedCity.windSpeed} m/s</p>
                        <p>Wind Direction: {weatherInSelectedCity.windDirection}</p>
                        <p>Condition: {weatherInSelectedCity.condition}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CityCard;