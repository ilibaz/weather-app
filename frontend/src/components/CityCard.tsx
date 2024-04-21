import { CloudSVG, LoadingSpinner, RainSVG, SunSVG, WindSVG } from "../assets/SVGElements";
import { City, useCities } from "../context/CitiesContext";
import { WeatherDescription, useWeather } from "../context/WeatherContext";

interface CityCardProps {
    city: City;
}

type WeatherSVGMap = {
    [key in WeatherDescription]: JSX.Element;
};

const weatherSVGs: WeatherSVGMap = {
    rain: (
        <RainSVG />
    ),
    sunny: (
        <SunSVG />
    ),
    windy: (
        <WindSVG />
    ),
    cloudy: (
        <CloudSVG />
    ),
};

function CityCard({ city }: CityCardProps) {
    const { backgroundColor, isLoading, readWeatherForLocalPlace } = useWeather();
    const { selectedCity, setSelectedCity, setSearchTerm } = useCities();

    const isSelected = selectedCity ? selectedCity.city === city.city : false;
    const weatherInSelectedCity = readWeatherForLocalPlace(city.city);

    const handleCardClick = () => {
        setSelectedCity(city);
        setSearchTerm(city.city);
    };

    return (
        <div
            className={`w-full h-auto relative rounded-lg shadow-lg p-4 cursor-pointer`}
            onClick={handleCardClick}
        >
            <div className="absolute inset-0 backdrop-filter backdrop-blur-lg rounded-lg"></div>
            <div
                className="absolute inset-0 bg-gray-200 opacity-50 rounded-lg"
                style={{ backgroundColor: backgroundColor ? backgroundColor : undefined }}
            ></div>
            <div className="relative z-10">
                <p className={isSelected ? 'mb-4' : ''}>
                    <span className="text-gray-800 text-xl font-bold">{city.city}</span>
                    <span className="text-gray-800 font-semibold text-sm"> | {city.admin_name}</span>
                </p>
                {isLoading && (
                    <LoadingSpinner />
                )}
                {isSelected && !isLoading && weatherInSelectedCity && (
                    <div className="flex flex-col">
                        <div className="w-full flex flex-row mb-4">
                            <div className="w-full flex md:w-1/2 mb-4 md:mb-0">
                                {weatherSVGs[weatherInSelectedCity.condition]}
                            </div>
                            {weatherInSelectedCity.windDirection && (
                                <div className="w-full flex md:w-1/2 md:mb-0 ">
                                    <div className="compass translate-x-1/2 translate-y-1/2 text-gray-800 font-semibold">
                                        <div className={`arrow ${weatherInSelectedCity.windDirection}`}></div>
                                        <div className="compass-west">W</div>
                                        <div className="compass-east">E</div>
                                        <div className="compass-north">N</div>
                                        <div className="compass-south">S</div>
                                    </div>
                                </div>)
                            }
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                            <div className="text-gray-800 font-semibold">
                                <p>Temperature: {weatherInSelectedCity.temperature} °</p>
                                <p>Condition: {weatherInSelectedCity.condition}</p>
                                <p>Pressure: {weatherInSelectedCity.pressure} hPa</p>
                            </div>
                            <div className="text-gray-800 font-semibold">
                                <p>Wind Speed: {weatherInSelectedCity.windspeedms} m/s</p>
                                <p>Direction: {weatherInSelectedCity.windDirection}</p>
                                <p>Precipitation: {weatherInSelectedCity.precipitation1h} mm</p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

export default CityCard;