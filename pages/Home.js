import React from 'react';
import NavigationMenu1 from '../components/NavigationMenu1';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';

// Get device dimensions
const { width, height } = Dimensions.get('window');

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Logo image */}
      <Image source={require('../assets/spartner_logo.png')} style={styles.logo} />

      {/* Title text */}
      <Text style={styles.title}>Welcome to the Novi High School Career and Technical Education Department</Text>

      {/* Navigation buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ViewPartners')}
      >
        <Text style={styles.buttonText}>View Partners</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Download')}
      >
        <Text style={styles.buttonText}>Download Report</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Calendar')}
      >
        <Text style={styles.buttonText}>Calendar</Text>
      </TouchableOpacity>

      {/* Bottom navigation menu */}
      <NavigationMenu1 navigation={navigation} page={"Home"} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Main container styling
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    paddingHorizontal: '5%',
  },
  // Logo styling
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    borderWidth: 3,
    borderColor: '#fff',
    marginTop: height * 0.09,
    marginBottom: height * 0.06,
  },
  // Title text styling
  title: {
    fontSize: width * 0.07,
    color: '#fff',
    textAlign: 'center',
    marginBottom: height * 0.05,
  },
  // Button styling
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#3498db', // Match button color with Login screen
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
  },
  // Button text styling
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Bottom navigation bar styling
  bottomNavBar: {
    width: width * 0.9,
    height: 75, // Increased height to accommodate icons
    bottom: height * 0.04,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 0.5,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#34495e',
  },
  // Navigation button styling
  navButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  // Navigation icon styling
  navIcon: {
    width: 22,
    height: 22,
    marginBottom: 4,
  },
  // Navigation button text styling
  navButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Home;
