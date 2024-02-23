    import React, { useEffect, useState } from 'react';
    import { View, Text, StyleSheet } from 'react-native';
    import { Card, Title, Paragraph } from 'react-native-paper'; 
    import * as Location from 'expo-location';
    import { fetchWeatherData } from '../components/api'; // Import the fetchWeatherData function

    const CurrentLocationWeatherScreen = () => {
    const [location, setLocation] = useState(null); // State to store the user's location
    const [errorMsg, setErrorMsg] = useState(null); // State to store any error messages
    const [weatherData, setWeatherData] = useState(null); // State to store the fetched weather data

    useEffect(() => {
        // Function to fetch user's current location
        const getCurrentLocation = async () => {
        try {
            // Request permission to access location
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
            }

            // Get user's current location
            const location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            // Fetch weather data using obtained location coordinates
            const data = await fetchWeatherData(location.coords.latitude, location.coords.longitude);
            setWeatherData(data);
        } catch (error) {
            setErrorMsg('Error fetching location or weather data');
            console.error(error);
        }
        };

        // Call the function to fetch user's current location
        getCurrentLocation();
    }, []);

    // Render loading message while fetching location and weather data
    if (!location || !weatherData) {
        return (
        <View style={styles.container}>
            <Text>Loading...</Text>
        </View>
        );
    }

    // Render error message if there's an error
    if (errorMsg) {
        return (
        <View style={styles.container}>
            <Text style={styles.error}>{errorMsg}</Text>
        </View>
        );
    }

    // Render weather data
    return (
        <View style={styles.container}>
        <Card style={styles.card}>
            <Card.Content>
            <Title>Current Weather</Title>
            <Paragraph>Temperature: {weatherData.hourly.temperature_2m[0]} °C</Paragraph>
            </Card.Content>
        </Card>
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '80%',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
    });

    export default CurrentLocationWeatherScreen;
        