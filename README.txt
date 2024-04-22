Things that slowed me down:

- API is serving only XML
- the JS library (which is already unsupported for a few years) is untyped
- API does not return errors if it's not finding certain city at all cases
- figuring out how to host both BE and FE in one docker container



Comments:

- all fetched data is stored in local storage and evaluated individually on per-city basis if it needs to be refetched
(15 mins timeout in WEATHER_FETCH_INTERVAL)

- weather fetch itself is debounced by 500ms in FETCH_DEBOUNCE_DELAY

- weather is fetched/retrieved from cache automatically once city card is visible on the screen

- each city card displays a simple background gradient to tell user what's the weather like, sunny/clouds/rain/windy
(although API does not provide that but I decided to guess the condition based on weather parameters)

- press the city name/card to expand and see more details

- if city weather fetch silently failed (like it happens with this API) the city card will be gray and have an error
displayed inside

- when searching for cities the app acts in the same way - fetches whatever is left on the screen automatically,
however if there is only one city left - it will expand that city to show details instantly

- simplistic icons for weather and compass, didn't have time to improve the looks

- not 100% clean code, quite a big project in general, for this reason if you see something stupid feel free to ask
me why did I do that



Build from root folder & Run using these commands:

docker build -t arca .
docker run -e "NODE_ENV=production" -p 3001:3001 -d arca