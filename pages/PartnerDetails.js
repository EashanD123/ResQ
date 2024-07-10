import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, Platform, ScrollView } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import axios from 'axios';
import NavigationMenu4 from '../components/NavigationMenu4';

const { width, height } = Dimensions.get('window');

const PartnerDetails = ({ route, navigation }) => {
    const { partnerName } = route.params;
    const [partner, setPartner] = useState(null);
    const [ngrokUrl, setNgrokUrl] = useState(null);
    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
    });

    const [coordinates, setCoordinates] = useState({
        latitude: 0,
        longitude: 0,
    });

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

    const getCoordinates = async (data) => {
        const apiKey = 'AIzaSyDNatdfiiM0sE5k1ltYGHXRRKlyuSCkJ40'; // Replace with your actual API key
        const address = data.company.contact.address.street + ', ' + data.company.contact.address.city ; // Assuming this is where you want to fetch coordinates

        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    address: address,
                    key: apiKey
                }
            });

            if (response.data.status === 'OK') {
                const location = response.data.results[0].geometry.location;

                setRegion(prevRegion => ({
                    ...prevRegion,
                    latitude: location.lat,
                    longitude: location.lng
                }));

                setCoordinates({
                    latitude: location.lat,
                    longitude: location.lng
                });

                // Alert.alert('Success', `Latitude: ${location.lat}, Longitude: ${location.lng}`);
            } else {
                Alert.alert('Error', 'Failed to get coordinates. Please check the address and try again.');
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };

    useEffect(() => {
        const fetchPartnerDetails = async () => {
            try {
                if (ngrokUrl) {
                    const response = await axios.get(`${ngrokUrl}/partners`);
                    const partnerData = response.data.find(p => p.company.name === partnerName);
                    getCoordinates(partnerData);
                    setPartner(partnerData);
                }
            } catch (error) {
                console.error('Error fetching partner details:', error);
            }
        };

        fetchPartnerDetails();
    }, [ngrokUrl]);

    const handleDeletePartner = async () => {
        try {
            await axios.delete(`${ngrokUrl}/partners/${partner._id}`);
            Alert.alert('Success', 'Partner deleted successfully');
            navigation.navigate('ViewPartners'); // Navigate back to the list after deletion
        } catch (error) {
            console.error('Error deleting partner:', error);
            Alert.alert('Error', 'Failed to delete partner');
        }
    };

    if (!partner) {
        return (
            <View style={styles.container2}>
                <Text style={styles.loadingText}>Loading...</Text>
                <NavigationMenu4 />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleBox}>
                <Text style={styles.title}>{partner.company.name}</Text>
            </View>
            <View style={styles.infoBox}>
                <ScrollView>
                    <Text style={styles.label}>Description:</Text>
                    <Text style={styles.text}>{partner.company.description}</Text>
                    <Text style={styles.label}>Type of Organization:</Text>
                    <Text style={styles.text}>{partner.company.type_of_organization}</Text>
                    <Text style={styles.label}>Email:</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Email', { email: partner.company.contact.email })}>
                        <Text style={styles.linkText}>{partner.company.contact.email}</Text>
                    </TouchableOpacity>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.text}>{partner.company.contact.phone_number}</Text>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.text}>{partner.company.contact.address.street}</Text>
                    <Text style={styles.label}>Website:</Text>
                    <Text style={styles.text}>{partner.company.contact.website}</Text>
                    <Text style={styles.label}>Resources Available:</Text>
                    <Text style={styles.text}>{partner.company.resources_available[0].resource_name}</Text>
                </ScrollView>
            </View>
            <View style={styles.mapBox}>
                <MapView
                    style={styles.map}
                    provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                    region={region}
                    onRegionChange={newRegion => setRegion(newRegion)}>
                    <Marker coordinate={coordinates} />
                </MapView>
            </View>
            <View style={styles.buttonContainer}>
                {/* <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('Edit', { partner: partner })}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePartner}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
            <NavigationMenu4 navigation={navigation} page={"PartnerDetails"} partner={partner}/>
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
    container2: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    loadingText: {
        color: '#ecf0f1',
        fontSize: 20,
    },
    infoBox: {
        backgroundColor: '#34495e',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: 'white',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
        marginVertical: 10,
        width: width * 0.9,
        height: height * 0.485,
        marginTop: height * 0.001,
        justifyContent: 'center'
    },
    mapBox: {
        backgroundColor: '#34495e',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: 'white',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        width: width * 0.9,
        height: height * 0.16,
        marginTop: height * 0.001,
        justifyContent: 'center'
    },
    titleBox: {
        backgroundColor: '#34495e',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: 'white',
        marginVertical: 10,
        width: width * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.055,
        height: height * 0.055,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    title: {
        color: '#ecf0f1',
        fontSize: 24,
    },
    label: {
        color: '#bdc3c7',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    text: {
        color: '#ecf0f1',
        fontSize: 20,
        marginBottom: 5,
    },
    linkText: {
        color: '#3498db', // Link color
        fontSize: 20,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: height * 0.011,
        //justifyContent: 'space-between',
        width: '100%',
    },
    editButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
        paddingHorizontal: 12
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        padding: 10,
        borderRadius: 5,
        paddingHorizontal: 12,
        width: '100%',
        marginTop: 2
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 22,
        textAlign: 'center'
    },
    map: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: 'white'
    },
});

export default PartnerDetails;
