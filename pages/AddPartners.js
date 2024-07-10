import React, { useState, useEffect } from 'react';
import NavigationMenu2 from '../components/NavigationMenu2';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, Alert } from 'react-native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const AddPartners = ({ navigation }) => {
    const [ngrokUrl, setNgrokUrl] = useState(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [typeOfOrganization, setTypeOfOrganization] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [website, setWebsite] = useState('');
    const [resources, setResources] = useState('');

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

    const handleAddPartner = async () => {
        if (!name || !description || !typeOfOrganization || !email || !phone || !address || !website || !resources || !city) {
            Alert.alert('Error', 'Please fill in all the fields.');
            return;
        }

        if (!ngrokUrl) {
            Alert.alert('Error', 'Server configuration not loaded.');
            return;
        }

        const partnerData = {
            company: {
                name: name.toString(),
                description: description.toString(),
                type_of_organization: typeOfOrganization.toString(),
                contact: {
                    email,
                    phone_number: phone.toString(),
                    address: {
                        street: address.toString(),
                        city: city.toString(),
                        state: 'MI',  // Set state as required
                        zip_code: '48375',  // Set zip code as required
                        country: 'USA'  // Set country as required
                    },
                    website: website.toString()
                },
                resources_available: [
                    {
                        resource_name: resources.toString(),
                    }
                ]
            }
        };

        try {
            const response = await axios.post(`${ngrokUrl}/addPartner`, partnerData);
            Alert.alert('Success', 'Partner added successfully.');
            navigation.goBack(); // Navigate back after successful addition
        } catch (error) {
            if (error.response) {
                Alert.alert('Error', error.response.data.message);
            } else {
                Alert.alert('Error', 'An error occurred. Please try again.');
            }
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Partner</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Type of Organization"
                value={typeOfOrganization}
                onChangeText={setTypeOfOrganization}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
            />
            <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
            />
            <TextInput
                style={styles.input}
                placeholder="Website"
                value={website}
                onChangeText={setWebsite}
            />
            <TextInput
                style={styles.input}
                placeholder="Resources Available"
                value={resources}
                onChangeText={setResources}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddPartner}>
                <Text style={styles.buttonText}>Add Partner</Text>
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
    },
    title: {
        fontSize: width * 0.075,
        fontWeight: 'bold',
        marginTop: height * 0.125,
        marginBottom: height * 0.02,
        textAlign: 'center',
        color: '#fff',
    },
    input: {
        height: 40,
        width: '100%',
        borderRadius: 5,
        marginBottom: height * 0.015,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    addButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#3498db', // Match button color with Login screen
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddPartners;
