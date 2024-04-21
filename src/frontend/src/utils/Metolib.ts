// @ts-expect-error
import Metolib from '@fmidev/metolib'
import { WindDirrection } from '../context/WeatherContext';

export function degreesToDirection(degrees: number): WindDirrection {
    const directions = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index] as WindDirrection;
}

export function FetchMetolibWeather(cities: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
        const SERVER_URL = "http://opendata.fmi.fi/wfs";
        const STORED_QUERY_OBSERVATION = "fmi::observations::weather::multipointcoverage";
        const connection = new Metolib.WfsConnection();

        function handleCallback(data: any, errors: any[]) {
            if (errors.length > 0) {
                console.error(errors);
                reject(errors);
            } else {
                const parsedData = parseWeatherData(data.locations);
                resolve(parsedData);
            }
        }

        if (connection.connect(SERVER_URL, STORED_QUERY_OBSERVATION)) {
            // Connection was properly initialized. So, get the data.
            connection.getData({
                requestParameter: "pressure,temperature,humidity,windspeedms,windDirection,precipitation1h,totalCloudCover",
                begin: new Date(),
                end: new Date(),
                timestep: 1 * 60 * 60 * 1000,
                sites: cities,
                callback: function (data: any, errors: any) {
                    // Handle the data and errors object in a way you choose.
                    handleCallback(data, errors);
                    // Disconnect because the flow has finished.
                    connection.disconnect();
                }
            });
        } else {
            reject('Failed to connect to Metolib server');
        }
    });
}

function parseWeatherData(data: any[]) {
    const result: any = {};

    data.forEach(item => {
        const name = item.info.name;
        const weatherData = item.data;

        const parsedData: any = {};
        Object.keys(weatherData).forEach(key => {
            const property = weatherData[key];
            // 2 time-value pairs always there, the second one has NaN values
            if (property.timeValuePairs.length === 2) {
                parsedData[key] = property.timeValuePairs[0].value;
            } else {
                parsedData[key] = property.timeValuePairs.map((pair: any) => ({
                    time: pair.time,
                    value: pair.value
                }));
            }
        });

        result[name] = parsedData;
    });

    return result;
}

