import { useEffect, useMemo, useState } from "react";
import { CloudSVG, LoadingSpinner, RainSVG, SunSVG, WindSVG } from "../assets/SVGElements";
import { City, useCities } from "../context/CitiesContext";
import { WeatherDescription, useWeather } from "../context/WeatherContext";
import useIsVisible from "../hooks/useIsVisible";
import BackgroundStyler from "../utils/BackgroundStyler";

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
    const { readWeatherForCity, isWeatherLoadingForCity } = useWeather();
    const { searchTerm, addVisibleCity, removeVisibleCity } = useCities();
    const [isSelected, setIsSelected] = useState<boolean>(false);
    const { ref, isVisible } = useIsVisible<HTMLDivElement>(searchTerm);

    const weatherInfo = readWeatherForCity(city.city);
    const isLoading = useMemo(() => {
        return isWeatherLoadingForCity(city);
    }, [city, isWeatherLoadingForCity]);

    const handleCardClick = () => {
        setIsSelected(!isSelected);
        addVisibleCity(city);
    };

    useEffect(() => {
        if (isVisible) {
            addVisibleCity(city);
        } else {
            removeVisibleCity(city);
        }

        return () => {
            removeVisibleCity(city);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible, city, searchTerm]);

    return (
        <BackgroundStyler weather={weatherInfo}>
            <div
                className={`w-full h-auto relative shadow-lg p-4 cursor-pointer`}
                onClick={handleCardClick}
                ref={ref}
            >

                <div className="absolute inset-0 backdrop-filter backdrop-blur-lg"></div>
                <div
                    className="absolute inset-0 bg-gray-200 opacity-50"
                ></div>
                <div className="relative z-10">
                    <div className={`flex flex-row items-center ${isSelected ? 'mb-4' : ''}`}>
                        <span className="text-gray-800 text-xl font-bold pr-2">{city.city}</span>
                        <span className="text-gray-800 font-semibold text-sm pr-4"> | {city.admin_name}</span>
                        {isLoading && (
                            <LoadingSpinner />
                        )}
                    </div>

                    {isSelected && !isLoading && weatherInfo && (
                        <div className="flex flex-col">
                            <div className="w-full flex flex-row mb-4">
                                <div className="w-full flex md:w-1/2 mb-4 md:mb-0">
                                    {weatherSVGs[weatherInfo.condition]}
                                </div>
                                {weatherInfo.windDirection && (
                                    <div className="w-full flex md:w-1/2 md:mb-0 ">
                                        <div className="compass translate-x-1/2 translate-y-1/2 text-gray-800 font-semibold">
                                            <div className={`arrow ${weatherInfo.windDirection}`}></div>
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
                                    <p>Temperature: {weatherInfo.temperature} °</p>
                                    <p>Pressure: {weatherInfo.pressure} hPa</p>
                                    <p>Condition: {weatherInfo.condition}</p>
                                </div>
                                <div className="text-gray-800 font-semibold">
                                    <p>Precipitation: {weatherInfo.precipitation1h} mm</p>
                                    <p>Wind Speed: {weatherInfo.windspeedms} m/s</p>
                                    <p>Direction: {weatherInfo.windDirection}</p>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </BackgroundStyler>
    );
}

export default CityCard;