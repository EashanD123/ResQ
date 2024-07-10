import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import axios from 'axios';
import GoogleSignInButton from '../components/GoogleSignInButton';

const { width, height } = Dimensions.get('window');
const ngrokUrl = 'https://b45b-83-137-6-227.ngrok-free.app';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ngrokUrl, setNgrokUrl] = useState(null);

  useEffect(() => {
    const config = {
      headers: { 'Authorization': "Bearer 2hsoEyQpmPX4VkdVTitaAGgnJE7_6dFvuuendEo5DM1ry44rX", 'Ngrok-Version': '2' }
    };

    const bodyParameters = {
      'Ngrok-Version': '2'
    };

    const fetchNgrokUrl = async () => {
      try {
        console.log('here')
        const response = await axios.get(
          'https://api.ngrok.com/endpoints',
          config
        );
        const url = response.data.endpoints[0].public_url
        setNgrokUrl(url);
      } catch (error) {
        console.error('Failed to fetch ngrok URL:', error);
        Alert.alert('Error', 'Failed to fetch server configuration.');
      }
    };

    fetchNgrokUrl();
  }, []);

  const handleLogin = async () => {
    if (!ngrokUrl) {
      Alert.alert('Error', 'Server configuration not loaded.');
      return;
    }

    try {
      const response = await axios.post(`${ngrokUrl}/login`, { email, password });
      const { token } = response.data;
      console.log('Login successful, token:', token);
      navigation.navigate('Home');
    } catch (error) {
      if (error.response) {
        Alert.alert('Login Error', error.response.data.message);
      } else {
        Alert.alert('Login Error', 'An error occurred. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/spartner_logo.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to SPartner</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.linkView}>
        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerButtonText}>Don't have an account?</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerButtonText}>Forgot Password? </Text>
        </TouchableOpacity> */}
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
    marginTop: height * 0.17,
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
  loginButton: {
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
  orSeparatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#ccc',
  },
  authenticationCont: {
    width: '100%',
    alignItems: 'center',
    marginTop: -10,
  },
  linkView: {
    flexDirection: 'row',
    width: width * 0.9,
    justifyContent: 'space-between'
  },
  registerButton: {
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default Login;