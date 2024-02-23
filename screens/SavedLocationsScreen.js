import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
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
                setErrorMsg('Location not found');
                return;
            }

            // Extract latitude and longitude from the geocoding data
            const { latitude, longitude } = geocodingData.results[0];
            console.log('Latitude:', latitude);
            console.log('Longitude:', longitude);

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
      <Text style={styles.title}>Saved Locations</Text>
      {savedLocations.map(location => (
        <View key={location.id} style={styles.locationItem}>
          <Text>{location.city}</Text>
          
          {location.weatherData && (
            <Text>Temperature: {location.weatherData.hourly.temperature_2m[0]}°C</Text>
          )}
          <Button
            title="Remove"
            onPress={() => handleRemoveLocation(location.id)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default SavedLocationsScreen;
