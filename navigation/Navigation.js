    import React from 'react';
    import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
    import CurrentLocationWeatherScreen from '../screens/CurrentLocationWeatherScreen';
    import SearchWeatherScreen from '../screens/SearchWeatherScreen';
    import SavedLocationsScreen from '../screens/SavedLocationsScreen';

    const Tab = createBottomTabNavigator();

    const Navigation = () => {
    return (
        <Tab.Navigator>
        <Tab.Screen name="Current Location" component={CurrentLocationWeatherScreen} />
        <Tab.Screen name="Search" component={SearchWeatherScreen} />
        <Tab.Screen name="Saved Locations" component={SavedLocationsScreen} />
        </Tab.Navigator>
    );
    };

    export default Navigation;