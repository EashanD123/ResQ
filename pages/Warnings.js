import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const WeatherAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const apiKey = '6b0275d866af9c5f1d7225a94e36c6d3'; // Replace with your OpenWeatherMap API key
  const lat = '42.3314'; // Latitude of Detroit, Michigan
  const lon = '-83.0458'; // Longitude of Detroit, Michigan

  useEffect(() => {
    const fetchWeatherAlerts = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${apiKey}`);
        if (response.data.alerts) {
          setAlerts(response.data.alerts);
        }
      } catch (err) {
        setError(err.message || 'Error fetching weather alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherAlerts();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <View key={index} style={styles.alert}>
            <Text style={styles.title}>{alert.event}</Text>
            <Text>{alert.description}</Text>
          </View>
        ))
      ) : (
        <Text>No alerts at this time</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  alert: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default WeatherAlerts;
