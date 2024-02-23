    import * as SQLite from 'expo-sqlite';

    // Open SQLite database
    const db = SQLite.openDatabase('savedLocations.db');

    const API_URL = 'https://api.open-meteo.com/';
    const GEO_API_URL = 'https://geocoding-api.open-meteo.com/';

    // Function to fetch weather data for a given latitude and longitude
    export const fetchWeatherData = async (latitude, longitude) => {
    try {
        const apiUrl = `${API_URL}v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;
        const response = await fetch(`${apiUrl}`);
        if (!response.ok) {
        throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
    };


    // Function to search for a location based on query string
    export const searchLocation = async (query) => {
        try {
        const response = await fetch(`${GEO_API_URL}v1/search?name=${query}`);
        const data = await response.json();
        return data;
        } catch (error) {
        console.error('Error searching location:', error);
        throw error;
        }
    };

    