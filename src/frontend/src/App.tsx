import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import CitiesList from './components/CitiesList'
import CitySearch from './components/CitySearch'
import BackgroundStyler from './components/BackgroundStyler'
import { WeatherProvider } from './context/WeatherContext'
import { SearchProvider } from './context/CitiesContext'

const queryClient = new QueryClient()

function App() {


  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <WeatherProvider>
          <BackgroundStyler>
            <CitySearch />
            <CitiesList />
          </BackgroundStyler>
        </WeatherProvider>
      </SearchProvider>
    </QueryClientProvider>
  )
}

export default App
