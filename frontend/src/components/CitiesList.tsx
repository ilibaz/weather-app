import CityCard from './CityCard'
import { useCities } from '../context/CitiesContext'

function CitiesList() {
    const { filteredCities, isLoading, error } = useCities();

    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center p-4">Fetching cities...</div>
    }

    if (error) {
        return 'An error has occurred: ' + error.message
    }

    return (
        <div className="min-h-screen flex justify-center items-start px-4 pt-24 pb-16">
            <div className="min-w-[300px] w-4/5 lg:w-2/3 grid grid-cols-1 gap-4">
                {filteredCities && filteredCities.sort((a, b) => a.city.localeCompare(b.city)).map((city) =>
                    <CityCard key={"city-" + city.city} city={city} />
                )}
            </div>
        </div>
    )
}

export default CitiesList;