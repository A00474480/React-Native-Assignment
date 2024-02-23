import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
import { Button, Card, Title, Paragraph } from 'react-native-paper'; // Import components from react-native-paper
import { fetchSavedLocations, removeSavedLocation } from '../db';
import { fetchWeatherData, searchLocation } from '../components/api';

const SavedLocationsScreen = () => {
  const [savedLocations, setSavedLocations] = useState([]);

  // Fetch saved locations from SQLite database when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchLocations = async () => {
        try {
          const locations = await fetchSavedLocations();
          // Fetch weather data for each saved location
          const updatedLocations = await Promise.all(locations.map(async location => {
            // Search for the location based on the query string
            const geocodingData = await searchLocation(location.city);

            // If no location found, set error message
            if (geocodingData.error) {
                console.error('Error fetching location data:', geocodingData.error);
                return location; // Return the location without weather data
            }

            // Extract latitude and longitude from the geocoding data
            const { latitude, longitude } = geocodingData.results[0];

            // Fetch weather data using obtained latitude and longitude
            const weatherData = await fetchWeatherData(latitude, longitude);

            return { ...location, weatherData };
          }));
          setSavedLocations(updatedLocations);
        } catch (error) {
          console.error('Error fetching saved locations:', error);
        }
      };

      fetchLocations();
    }, [])
  );

  // Function to handle removal of a saved location
  const handleRemoveLocation = async (id) => {
    try {
      await removeSavedLocation(id);
      // Update saved locations after removal
      const updatedLocations = savedLocations.filter(location => location.id !== id);
      setSavedLocations(updatedLocations);
    } catch (error) {
      console.error('Error removing saved location:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Saved Locations</Title>
      {savedLocations.map(location => (
        <Card key={location.id} style={styles.card}>
          <Card.Content>
            <Title>{location.city}</Title>
            {location.weatherData && (
              <Paragraph>Temperature: {location.weatherData.hourly.temperature_2m[0]}°C</Paragraph>
            )}
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => handleRemoveLocation(location.id)}>Remove</Button>
          </Card.Actions>
        </Card>
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f0f0f0',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    card: {
      marginBottom: 10,
    },
  });
export default SavedLocationsScreen;
