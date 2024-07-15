import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, Image } from 'react-native';
import { CheckBox } from 'react-native-elements';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ngrokUrl, setNgrokUrl] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const config = {
      headers: { 'Authorization': "Bearer 2hsoEyQpmPX4VkdVTitaAGgnJE7_6dFvuuendEo5DM1ry44rX", 'Ngrok-Version': '2' }
    };

    const fetchNgrokUrl = async () => {
      try {
        const response = await axios.get('https://api.ngrok.com/endpoints', config);
        const url = response.data.endpoints[0].public_url;
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

  const handleForgotPassword = () => {
    // Navigate to the forgot password screen
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    // Navigate to the registration screen
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.cont1}>
        <View style={styles.imgCont}> 
          <Image source={require('../assets/login_img.png')} style={styles.image} />
        </View>
      </View>
      <View style={styles.cont2}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>ResQ</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#000"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input2}
            placeholder="Password"
            placeholderTextColor="#000"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.optionsContainer}>
          <TouchableOpacity activeOpacity={1.0} style={styles.rememberMeContainer}>
            <CheckBox
              checked={rememberMe}
              onPress={() => setRememberMe(!rememberMe)}
              containerStyle={styles.checkboxContainer}
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8FBC8F', // Dark sea green background
  },
  cont1: {
    width: width,
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cont2: {
    width: width,
    height: height * 0.65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 30
  },
  imgCont: {
    height: height * 0.35,
    width: width * 0.92,
    marginTop: height * 0.045,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2E8B57', // Matching the button background color
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#2E8B57', // Matching the button background color
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    color: '#000',
    backgroundColor: '#fff', // White background for input fields
  },
  input2: {
    height: 50,
    width: '100%',
    borderColor: '#2E8B57', // Matching the button background color
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginTop: -10,
    marginBottom: 20,
    color: '#000',
    backgroundColor: '#fff', // White background for input fields
  },
  optionsContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  rememberMeText: {
    fontSize: 16,
    color: '#000',
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#2E8B57',
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2E8B57', // Sea green button background
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    width: '80%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4682B4', // Steel blue button background
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Login;
