# Weather App

This React Native application allows users to fetch and display weather information based on their current location or a specified city. Users can also save their favorite locations for easy access later.

## Features

### Screen 1: Current Location Weather

- Automatically displays temperature for the user's current location using Expo Location.

### Screen 2: Search & Display Weather

- Enables users to search for weather information by entering the name of a city.
- Displays temperature for the searched locations.
- Provides a "Save Location" button to add the searched locations to the list of saved locations.
- Limits saving to only 4 cities and disables the "Save Location" button when the maximum limit is reached.

### Screen 3: Saved Locations

- Lists the locations saved by the user for easy access.
- Fetches and displays weather data for the saved locations.
- Allows users to remove locations from the saved list as needed.

### Data Fetching

- Utilizes the Open Meteo API for accessing weather and geocoding data.
- Fetches weather data based on location input using the geocoding feature of the API.

### Location Services

- Integrates Expo Location to obtain the user's current location for Screen 1.

### Data Storage

- Manages the list of saved locations using Expo SQLite for local data storage.
- Saves the city names of the locations in the SQLite database when a location is saved.

### User Interface

- Designed with React Native Paper for a user-friendly and responsive UI.
- Ensures an intuitive user experience with easy navigation between screens.
- Implements creative UI features to enhance visual appeal and usability.

## Instructions for Running the Application

1. Clone the repository to your local machine.
2. Install dependencies using `npm install`.
3. Ensure you have Expo CLI installed globally (`npm install -g expo-cli`).
4. Run the application using `npx expo start`.
5. Use an Android emulator, iOS simulator, or scan the QR code with the Expo Go app on your mobile device to view the application.
