    import * as SQLite from 'expo-sqlite';

    // Open or create the SQLite database
    const db = SQLite.openDatabase('savedLocations.db');

    // Create a table to store saved locations
    export const initDatabase = () => {
        db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS savedLocations (id INTEGER PRIMARY KEY AUTOINCREMENT, city TEXT)'
        );
        });
    };

    // Function to fetch saved locations from SQLite database
    export const fetchSavedLocations = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM savedLocations',
            [],
            (_, { rows }) => resolve(rows._array), // Return saved locations as an array
            (_, error) => reject(error)
        );
        });
    });
    };

    // Function to remove a saved location from SQLite database
    export const removeSavedLocation = async id => {
    try {
        db.transaction(tx => {
        tx.executeSql('DELETE FROM savedLocations WHERE id = ?', [id]); // Delete location with the specified id
        });
    } catch (error) {
        console.error('Error removing saved location:', error);
        throw error;
    }
    };

    // Function to save a location to the SQLite database
    export const saveLocationToDB = (city) => {
        return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
            'INSERT INTO savedLocations (city) VALUES (?)',
            [city],
            (_, result) => resolve(result.insertId), // Return the ID of the inserted row
            (_, error) => reject(error)
            );
        });
        });
    };
