// pages/Account.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import NavigationMenu2 from '../components/NavigationMenu2';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const Account = ({ navigation }) => {
  const [accountDetails, setAccountDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [ngrokUrl, setNgrokUrl] = useState(null);

  useEffect(() => {
    const config = {
      headers: { 'Authorization': "Bearer YOUR_ACCESS_TOKEN", 'Ngrok-Version': '2' }
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

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!ngrokUrl) {
        return;
      }
      try {
        const response = await axios.get(`${ngrokUrl}/accountDetails`, {
          headers: { 'Authorization': 'Bearer YOUR_ACCESS_TOKEN' },
        });
        setAccountDetails(response.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
        Alert.alert('Error', 'Failed to fetch account details.');
      }
    };

    fetchAccountDetails();
  }, [ngrokUrl]);

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Details</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>First Name:</Text>
        <Text style={styles.value}>{accountDetails.firstName}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Last Name:</Text>
        <Text style={styles.value}>{accountDetails.lastName}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{accountDetails.email}</Text>
      </View>
      <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      <NavigationMenu2 navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    paddingHorizontal: '5%',
    paddingTop: '10%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  detailContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#34495e',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#ecf0f1',
  },
  value: {
    fontSize: 16,
    color: '#ecf0f1',
  },
  changePasswordButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Account;
