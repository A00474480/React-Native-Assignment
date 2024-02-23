    import React, { useState, useEffect } from 'react';
    import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
    import { Card, Title, Paragraph } from 'react-native-paper'; // Import components from react-native-paper
    import { useFocusEffect } from '@react-navigation/native'; 
    import { fetchWeatherData, searchLocation } from '../components/api';
    import { fetchSavedLocations, saveLocationToDB } from '../db';


    const SearchWeatherScreen = () => {
    const [query, setQuery] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [savedLocations, setSavedLocations] = useState([]);

    // Function to fetch saved locations from SQLite database
    const fetchLocations = async () => {
        try {
        const locations = await fetchSavedLocations();
        setSavedLocations(locations);
        } catch (error) {
        console.error('Error fetching saved locations:', error);
        }
    };

    // Call fetchLocations function whenever the screen gains focus
    useFocusEffect(
        React.useCallback(() => {
        fetchLocations();
        }, [])
    );

    // Function to handle the search button press
    const handleSearch = async () => {
        try {
        // Search for the location based on the query string
        const geocodingData = await searchLocation(query);

        // If no location found, set error message
        if (geocodingData.error || geocodingData.results == null) {
            setErrorMsg('Location not found');
            setWeatherData(null);
            return;
        }

        // Extract latitude and longitude from the geocoding data
        const { latitude, longitude } = geocodingData.results[0];

        // Fetch weather data using obtained latitude and longitude
        const data = await fetchWeatherData(latitude, longitude);

        // Set weather data and clear error message
        setWeatherData(data);
        setErrorMsg(null);
        } catch (error) {
            setErrorMsg('Error fetching weather data');
            console.error(error);
            setWeatherData(null);
        }
    };

    // Function to save the current location to the list of saved locations
    const saveLocation = async () => {
        try {
        // if (savedLocations.includes(query)) { // Check if location is already saved
        //     console.log('Location is already saved');
        //     return;
        // }
        
        // if (savedLocations.length >= 4) { // Check if maximum limit reached
        //     console.log('Maximum limit reached');
        //     return;
        // }

        await saveLocationToDB(query); // Save the location to the database

        const updatedLocations = await fetchSavedLocations(); // Fetch and update the list of saved locations
        setSavedLocations(updatedLocations);

        console.log('Location saved successfully');
        } catch (error) {
        if(error == 'Location already saved')
            setErrorMsg(error);
        else
            console.error('Error saving location to database:', error);
            setErrorMsg('Error saving location');
        }
    };

    return (
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            {/* Input field to enter the location query */}
            <TextInput
              style={styles.input}
              placeholder="Enter location"
              value={query}
              onChangeText={setQuery}
            />
            {/* Button to initiate the search */}
            <Button title="Search" onPress={handleSearch} />
          </View>
          <View style={styles.resultContainer}>
            {/* Display error message if any */}
            {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
            {/* Display weather data if available */}
            {weatherData && (
              <Card style={styles.card}>
                <Card.Content>
                  <Title>Weather Information</Title>
                  <Paragraph>Temperature: {weatherData.hourly.temperature_2m[0]}°C</Paragraph>
                  {/* You can add more weather information here */}
                </Card.Content>
              </Card>
            )}
          </View>
          {/* Button to save the current location */}
          <Button title="Save Location" onPress={saveLocation} disabled={!weatherData || savedLocations.length >= 4} />
        </View>
      );
    };

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: '#f0f0f0',
        },
        inputContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
        },
        input: {
          height: 40,
          width: '70%',
          borderColor: 'gray',
          borderWidth: 1,
          paddingHorizontal: 10,
        },
        resultContainer: {
          alignItems: 'center',
          marginBottom: 20,
        },
        card: {
          width: '100%',
        },
        error: {
          color: 'red',
          marginTop: 10,
          marginBottom: 10,
        },
      });

    export default SearchWeatherScreen;
