import {
    useQuery,
} from '@tanstack/react-query'
import CityCard, { City } from './CityCard'

function CitiesList() {
    const { isLoading, error, data } = useQuery<City[]>({
        queryKey: ['cities'],
        queryFn: () =>
            fetch('http://localhost:3001/api/cities').then((res) =>
                res.json(),
            ),
    })

    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center p-4">Fetching cities...</div>
    }

    if (error) {
        return 'An error has occurred: ' + error.message
    }

    return (
        <div className="min-h-screen flex justify-center items-center px-4 pb-16">
            <div className="min-w-[320px] md:w-4/5 grid grid-cols-1 gap-4">
                {data && data.sort((a, b) => a.city.localeCompare(b.city)).map((city) =>
                    <CityCard key={"city-" + city.city} city={city} />
                )}
            </div>
        </div>
    )
}

export default CitiesList;