  import React from 'react';
  import { NavigationContainer } from '@react-navigation/native';
  import Navigation from './navigation/Navigation';
  import { initDatabase, clearDatabase } from './db';

  initDatabase();
  clearDatabase();

  const App = () => {
    return (
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    );
  };

  export default App;
