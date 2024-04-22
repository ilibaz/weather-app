import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CitiesList from './components/CitiesList';
import CitySearch from './components/CitySearch';
import { WeatherProvider } from './context/WeatherContext';
import { CitiesProvider } from './context/CitiesContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CitiesProvider>
        <WeatherProvider>
          <CitySearch />
          <CitiesList />
        </WeatherProvider>
      </CitiesProvider>
    </QueryClientProvider>
  );
}

export default App;
