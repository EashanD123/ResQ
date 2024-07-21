import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const Register = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNext = () => {
    if (currentPage === 3) {
      // Handle registration logic here
      // navigation.navigate('Home'); // Or another action
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage === 1) {
      navigation.navigate('Login'); // Navigate back to the login page
    } else {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imgCont}>
        <Image source={require('../assets/login_img.png')} style={styles.image} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.logoText}>ResQ</Text>
        {currentPage === 1 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#000"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#000"
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#000"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </>
        )}
        {currentPage === 2 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Street"
              placeholderTextColor="#000"
              value={street}
              onChangeText={setStreet}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor="#000"
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              placeholderTextColor="#000"
              value={state}
              onChangeText={setState}
            />
            <TextInput
              style={styles.input}
              placeholder="Zip Code"
              placeholderTextColor="#000"
              value={zip}
              onChangeText={setZip}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Country"
              placeholderTextColor="#000"
              value={country}
              onChangeText={setCountry}
            />
          </>
        )}
        {currentPage === 3 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#000"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#000"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleBack}>
            <Text style={styles.buttonText}>{currentPage === 1 ? 'Back to Login' : 'Back'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>{currentPage === 3 ? 'Register' : 'Next'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8FBC8F',
  },
  imgCont: {
    height: height * 0.35,
    width: width * 0.92,
    marginBottom: height * 0.025,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    marginTop: height * 0.04
  },
  formContainer: {
    width: width,
    height: height * 0.65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#2E8B57',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    color: '#000',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    width: '45%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2E8B57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Register;
