import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ngrokUrl, setNgrokUrl] = useState(null);

  const [reload, setReload] = useState("Register")
  const [missing, setMissing] = useState([false, false, false])

  useEffect(() => {
    const config = {
      headers: { 'Authorization': "Bearer 2hsoEyQpmPX4VkdVTitaAGgnJE7_6dFvuuendEo5DM1ry44rX", 'Ngrok-Version': '2' }
    };

    const fetchNgrokUrl = async () => {
      try {
        const response = await axios.get(
          'https://api.ngrok.com/endpoints',
          config
        );
        const url = response.data.endpoints[0].public_url;
        setNgrokUrl(url);
      } catch (error) {
        console.error('Failed to fetch ngrok URL:', error);
        Alert.alert('Error', 'Failed to fetch server configuration.');
      }
    };

    fetchNgrokUrl();
  }, []);

  const handleRegister = async () => {
    let temp = missing
    for (let i = 0; i < 3; i++) {
      temp[i] = false
    }
    console.log(email)
    if (email == "") {
      temp[0] = true
    }
    if (password == "") {
      temp[1] = true
    }
    if (confirmPassword == "") {
      temp[2] = true
    }


    for (let i = 0; i < 3; i++) {
      if (temp[i]) {
        setMissing(temp)
        setReload("Register")
        Alert.alert('Error', 'Please fill in the missing fields.')
        return
      }
    }

    if (!ngrokUrl) {
      Alert.alert('Error', 'Server configuration not loaded.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      temp[2] = true
      setMissing(temp)
      setReload("Register")
      return;
    }
    setMissing(temp)
    setReload("Register")
    
    try {
      const response = await axios.post(`${ngrokUrl}/register`, { email, password });
      Alert.alert('Registration Successful', 'You have registered successfully. Please log in.');
      navigation.navigate('Login');
    } catch (error) {
      if (error.response) {
        Alert.alert('Registration Error', error.response.data.message);
      } else {
        Alert.alert('Registration Error', 'An error occurred. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/spartner_logo.png')} style={styles.logo} />
      <Text style={styles.title}>Create an Account</Text>
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={{ textAlign: 'left', fontSize: 15, marginTop: 2, marginLeft: -15, color: missing[0] ? 'red' : 'white' }}> * </Text>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={{ textAlign: 'left', fontSize: 15, marginTop: 2, marginLeft: -15, color: missing[1] ? 'red' : 'white' }}> * </Text>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <Text style={{ textAlign: 'left', fontSize: 15, marginTop: 2, marginLeft: -15, color: missing[2] ? 'red' : 'white' }}> * </Text>
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}> {reload} </Text>
      </TouchableOpacity>
      <View style={styles.linkView}>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButtonText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    paddingHorizontal: '5%',
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    borderWidth: 3,
    borderColor: '#fff',
    marginTop: height * 0.09,
    marginBottom: height * 0.06,
  },
  title: {
    fontSize: width * 0.075,
    fontWeight: 'bold',
    marginBottom: height * 0.015,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    height: 40,
    width: '100%',
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  registerButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkView: {
    marginTop: 10,
  },
  loginButton: {
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default Register;