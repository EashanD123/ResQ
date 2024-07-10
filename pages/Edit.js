import React, { useState, useEffect } from 'react';
import NavigationMenu2 from '../components/NavigationMenu2';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, Alert } from 'react-native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const Edit = ({ route, navigation }) => {
    const { partner } = route.params;
    const [ngrokUrl, setNgrokUrl] = useState(null);

    const [name, setName] = useState(partner.company.name);
    const [description, setDescription] = useState(partner.company.description);
    const [typeOfOrganization, setTypeOfOrganization] = useState(partner.company.type_of_organization);
    const [email, setEmail] = useState(partner.company.contact.email);
    const [phone, setPhone] = useState(partner.company.contact.phone_number);
    const [street, setStreet] = useState(partner.company.contact.address.street);
    const [city, setCity] = useState(partner.company.contact.address.city);
    const [state, setState] = useState(partner.company.contact.address.state);
    const [zipCode, setZipCode] = useState(partner.company.contact.address.zip_code);
    const [country, setCountry] = useState(partner.company.contact.address.country);
    const [website, setWebsite] = useState(partner.company.contact.website);
    const [resources, setResources] = useState(partner.company.resources_available.map(resource => resource.resource_name).join(', '));

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

    const handleUpdatePartner = async () => {
        if (!name || !description || !typeOfOrganization || !email || !phone || !street || !city || !state || !zipCode || !country || !website || !resources) {
            Alert.alert('Error', 'Please fill in all the fields.');
            return;
        }

        if (!ngrokUrl) {
            Alert.alert('Error', 'Server configuration not loaded.');
            return;
        }

        const resourcesArray = resources.split(',').map(resource => resource.trim()).filter(resource => resource.length > 0)
        console.log(resourcesArray)
        try {
            const partnerData = {
                company: {
                    name: name.toString(),
                    description: description.toString(),
                    type_of_organization: typeOfOrganization.toString(),
                    contact: {
                        email: email.toString(),
                        phone_number: phone.toString(),
                        address: {
                            street: street.toString(),
                            city: city.toString(),
                            state: state.toString(),  // Set state as required
                            zip_code: zipCode.toString(),  // Set zip code as required
                            country: country.toString()  // Set country as required
                        },
                        website: website.toString()
                    },
                    resources_available: resourcesArray.map(resource => ({
                        resource_name: resource.toString()
                    }))
                }
            };
            const response = await axios.put(`${ngrokUrl}/partners/${partner._id}`, partnerData);
            Alert.alert('Success', 'Partner updated successfully.');
            navigation.navigate("ViewPartners"); // Navigate back after successful update
        } catch (error) {
            if (error.response) {
                Alert.alert('Error', error.response.data.message);
            } else {
                Alert.alert('Error', 'An error occurred. Please try again.');
            }
        }
    };

    const handleResourceChange = (index, field, value) => {
        const newResources = [...resources];
        newResources[index][field] = value;
        setResources(newResources);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit</Text>

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
                placeholder="Street"
                value={street}
                onChangeText={setStreet}
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

            {/* {resources.map((resource, index) => (
                <View key={index}>
                    <TextInput
                        style={styles.input}
                        placeholder="Resource Name"
                        value={resource.resource_name}
                        onChangeText={(text) => handleResourceChange(index, 'resource_name', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Resource Description"
                        value={resource.description}
                        onChangeText={(text) => handleResourceChange(index, 'description', text)}
                    />
                </View>
            ))} */}

            <TouchableOpacity style={styles.addButton} onPress={handleUpdatePartner}>
                <Text style={styles.buttonText}>Update</Text>
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

export default Edit;
