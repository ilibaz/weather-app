// @ts-expect-error because not typed
import Metolib from '@fmidev/metolib';
import {
  WeatherDescription,
  WeatherInfo,
  WindDirrection,
} from '../context/WeatherContext';

export function degreesToDirection(degrees: number): WindDirrection {
  const directions = [
    'north',
    'north-east',
    'east',
    'south-east',
    'south',
    'south-west',
    'west',
    'north-west',
  ];
  const index = Math.round(degrees / 45) % 8;
  return directions[index] as WindDirrection;
}

export function predictWeather(weatherData: WeatherInfo): WeatherDescription {
  if (weatherData.precipitation1h > 0) {
    return 'rain';
  }

  if (weatherData.totalCloudCover > 2) {
    return 'cloudy';
  }

  if (weatherData.windspeedms > 10) {
    return 'windy';
  }

  return 'sunny';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FetchMetolibWeather(cities: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const SERVER_URL = 'http://opendata.fmi.fi/wfs';
    const STORED_QUERY_OBSERVATION =
      'fmi::forecast::harmonie::surface::point::multipointcoverage';
    const connection = new Metolib.WfsConnection();

    console.info('Requesting weather for: ' + cities.join(', '));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleCallback(data: any, errors: any[]) {
      if (errors.length > 0) {
        console.error(errors);
        reject(errors);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsedData = parseWeatherData((data as any).locations, cities);
        resolve(parsedData);
      }
    }

    if (connection.connect(SERVER_URL, STORED_QUERY_OBSERVATION)) {
      const currentTimeInHelsinki = new Date().toLocaleString('en-US', {
        timeZone: 'Europe/Helsinki',
      });
      const timestamp = new Date(currentTimeInHelsinki).getTime();

      // Connection was properly initialized. So, get the data.
      connection.getData({
        requestParameter:
          'pressure,temperature,humidity,windspeedms,windDirection,precipitation1h,totalCloudCover',
        begin: timestamp,
        end: timestamp,
        timestep: 60 * 60 * 1000,
        sites: cities,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: function (data: any, errors: any) {
          // Handle the data and errors object in a way you choose.
          handleCallback(data, errors);
          // Disconnect because the flow has finished.
          connection.disconnect();
        },
      });
    } else {
      reject('Failed to connect to Metolib server');
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseWeatherData(data: any[], cities: string[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = {};

  data.forEach(item => {
    const name = item.info.name;
    const weatherData = item.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsedData: any = {
      error: false,
    };
    Object.keys(weatherData).forEach(key => {
      const property = weatherData[key];
      // 2 time-value pairs always there, the second one is the most recent
      if (property.timeValuePairs.length === 2) {
        parsedData[key] = property.timeValuePairs[1].value;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parsedData[key] = property.timeValuePairs.map((pair: any) => ({
          time: pair.time,
          value: pair.value,
        }));
      }
    });

    result[name] = parsedData;
  });

  cities.forEach(city => {
    if (result[city] === undefined) {
      result[city] = {
        error: true,
        timestamp: new Date(),
        temperature: 0,
        windspeedms: 0,
        windDirection: 'north',
        precipitation1h: 0,
        totalCloudCover: 0,
        pressure: 0,
        humidity: 0,
        condition: 'sunny',
      };
    }
  });

  return result;
}
