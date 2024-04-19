import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import './App.css'

const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  )
}

function Example() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('http://localhost:3001/api/data').then((res) =>
        res.json(),
      ),
  })
  if (isLoading) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message
  return (
    <div>
      <h1>{data.message}</h1>
    </div>
  )
}

export default App
