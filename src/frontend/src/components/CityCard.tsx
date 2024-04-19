export interface City {
    city: string;
    temperature?: number;
    windSpeed?: number;
    windDirection?: string;
}

interface CityCardProps {
    city: City;
}

function CityCard({ city }: CityCardProps) {
    return (
        <div className="bg-[#374151] w-full rounded-lg shadow-lg p-4">
            <h2 className="text-gray-100 text-xl font-bold mb-2">{city.city}</h2>
            <p className="text-gray-100">25°, 10 m/s, North</p>
        </div>
    );
};

export default CityCard;