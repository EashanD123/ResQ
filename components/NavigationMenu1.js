import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const NavigationMenu1 = ({ navigation, page }) => (
  <View style={styles.bottomNavBar}>
    <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
      <Image source={require('../assets/home.png')} style={styles.navIcon} />
      <Text style={styles.navButtonText}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Chatbot')}>
      <Image source={require('../assets/chatbot.png')} style={styles.navIcon} />
      <Text style={styles.navButtonText}>Chatbot</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.navButton}
      onPress={() => {
        if (page === 'Home') {
          navigation.navigate('Warnings');
        } else {
          // Handle other cases or do nothing
        }
      }}
    >
      <Image source={require('../assets/disasters.png')} style={styles.navIcon3} />
      <Text style={styles.navButtonText}>Disasters</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
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
    backgroundColor: '#2E8B57', // Sea green background to match Home and Login screens
  },
  navButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  navIcon: {
    width: 25,
    height: 25,
    marginBottom: 4,
  },
  navIcon3: {
    width: 30,
    height: 30,
    marginBottom: 4,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default NavigationMenu1;
