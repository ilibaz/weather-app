import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import CitiesList from './components/CitiesList'
import CitySearch from './components/CitySearch'

const queryClient = new QueryClient()

function App() {

  const onSearch = (city: string) => {
    console.log(city);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <CitySearch onSearch={onSearch} />
      <CitiesList />
    </QueryClientProvider>
  )
}

export default App
