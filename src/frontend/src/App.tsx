import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import CitiesList from './components/CitiesList'
import CitySearch from './components/CitySearch'
import BackgroundStyler from './components/BackgroundStyler'
import { WeatherProvider } from './context/WeatherContext'

const queryClient = new QueryClient()

function App() {

  const onSearch = (city: string) => {
    console.log(city);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WeatherProvider>
        <BackgroundStyler>
          <CitySearch onSearch={onSearch} />
          <CitiesList />
        </BackgroundStyler>
      </WeatherProvider>
    </QueryClientProvider>
  )
}

export default App
