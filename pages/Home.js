import React from 'react';
import NavigationMenu1 from '../components/NavigationMenu1';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Logo text */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.accountButton} onPress={() => navigation.navigate('Account')}>
          <Image source={require('../assets/user.png')} style={styles.accountImage} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>ResQ</Text>
      </View>

      {/* Slogan */}
      <View style={styles.sloganContainer}>
        <Text style={styles.slogan}>Your Natural Disaster Response Chatbot</Text>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <View style={styles.descriptionBox}>
          <Text style={styles.description}>
            ResQ is your personal assistant during natural disasters, providing real-time guidance and information to keep you safe. Whether it's hurricane preparedness or earthquake safety tips, ResQ is here to help you navigate through emergencies. 
          </Text>
        </View>
      </View>

      {/* Bottom navigation menu */}
      <NavigationMenu1 navigation={navigation} page={"Home"} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Main container styling
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8FBC8F', // Light green background from the login screen
    paddingHorizontal: '5%',
  },
  header: {
    width: width,
    height: height * 0.15,
    backgroundColor: '#2E8B57',
    top: height * -0.19,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  logoutButton: {
    backgroundColor: 'red', // Red button background
    borderRadius: 10, // Rounded corners
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    marginTop: 55,
    marginLeft: 210,
    borderColor: "white",
    borderWidth: 1,
    height: height * 0.05
  },
  // Logout button text styling
  logoutButtonText: {
    color: '#fff', // White text color
    fontSize: 16, // Font size
    fontWeight: 'bold', // Bold text
    textAlign: 'center'
  },
  // Logo container styling
  logoContainer: {
    backgroundColor: '#2E8B57', // Sea green background for the logo text
    borderRadius: 10, // Rounded corners for the container
    paddingVertical: 10, // Padding around the logo text
    paddingHorizontal: 30, // Increased horizontal padding for wider text
    marginBottom: height * 0.03, // Spacing below the logo text
    alignItems: 'center', // Center align text horizontally
    transform: [{ translateY: -height * 0.1 }]
  },
  // Logo text styling
  logoText: {
    fontSize: width * 0.15, // Increased font size for larger text
    fontWeight: 'bold',
    color: '#fff', // White text color
  },
  // Slogan container styling
  sloganContainer: {
    marginTop: 10, // Adjusted margin top for separation from the logo
    transform: [{ translateY: -height * 0.1 }]
  },
  accountButton: {
    marginTop: 55,
    width: 40, 
    height: 40
  },
  accountImage: {
    height: '100%', 
    width: '100%'
  },
  // Slogan styling
  slogan: {
    fontSize: width * 0.04, // Adjusted font size for slogan
    color: 'white', // Sea green text color
    textAlign: 'center',
    marginTop: -20
  },
  // Description container styling
  descriptionContainer: {
    width: '100%', // Full width
    alignItems: 'center', // Center align content horizontally
    marginTop: 20, // Margin top for separation from the slogan
    transform: [{ translateY: -height * 0.08 }]
  },
  // Description box styling
  descriptionBox: {
    backgroundColor: '#2E8B57', // Sea green background for the description box
    padding: 20, // Padding inside the description box
    borderRadius: 10, // Rounded corners
    borderWidth: 2, // Border width
    borderColor: '#4CAF50', // Border color
    width: '90%', // Width of the description box
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20, // Margin top for separation from the slogan
  },
  // Description text styling
  description: {
    fontSize: width * 0.05, // Adjusted font size for description
    color: 'white', // White text color
    textAlign: 'center',
    lineHeight: 24, // Line height for better readability
    fontStyle: 'italic', // Italic font style for emphasis
  },
});

export default Home;
