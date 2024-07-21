import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, Platform, ScrollView, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, PROVIDER_DEFAULT, Polygon } from 'react-native-maps';
import axios from 'axios';
import NavigationMenu1 from '../components/NavigationMenu1';

const { width, height } = Dimensions.get('window');

const DisasterDetails = ({ route, navigation }) => {
    const { disaster } = route.params;
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

    const getCoordinates = async () => {
        const apiKey = 'GOOGLE MAPS API KEY'; // Replace with your actual API key
        const address = '24463 Perceval Ln'; // Assuming this is where you want to fetch coordinates

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
        // const fetchPartnerDetails = async () => {
        //     try {
        //         if (ngrokUrl) {
        //             const response = await axios.get(`${ngrokUrl}/partners`);
        //             const partnerData = response.data.find(p => p.company.name === partnerName);
        //             
        //             setPartner(partnerData);
        //         }
        //     } catch (error) {
        //         console.error('Error fetching partner details:', error);
        //     }
        // };

        // fetchPartnerDetails();
    }, [ngrokUrl]);

    if (!disaster) {
        return (
            <View style={styles.container2}>
                <Text style={styles.loadingText}>Loading...</Text>
                <NavigationMenu1 />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.titleBox, { flexDirection: 'row' }]}>
                <Text style={styles.title}>{disaster.properties.event}</Text>
                <View style={styles.navIcon}>
                    <Image source={require('../assets/caution.png')} style={[{ width: '100%', height: '100%' }]} />
                </View>
            </View>
            <View style={styles.infoBox}>
                <ScrollView>
                    <Text style={[styles.label, { textAlign: 'center' }]}>{disaster.properties.headline}</Text>
                    <Text style={[styles.text, { marginTop: 15 }]}>{disaster.properties.description}</Text>
                        <Text style={[styles.text, { fontWeight: 'bold', color: 'black', marginTop: 5 }]}>Instructions: </Text>
                        <Text style={[styles.text, { marginTop: 0 }]}> {disaster.properties.instruction}</Text>

                </ScrollView>
                {/* <ScrollView>
                    <Text style={styles.label}>Description:</Text>
                    <Text style={styles.text}>{partner.company.description}</Text>
                    <Text style={styles.label}>Type of Disaster:</Text>
                    <Text style={styles.text}>{partner.company.type_of_organization}</Text>
                    <Text style={styles.label}>Email Contact Information:</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Email', { email: partner.company.contact.email })}>
                        <Text style={styles.linkText}>{partner.company.contact.email}</Text>
                    </TouchableOpacity>
                    <Text style={styles.label}>Help Phone:</Text>
                    <Text style={styles.text}>{partner.company.contact.phone_number}</Text>
                    <Text style={styles.label}>Nearest Location:</Text>
                    <Text style={styles.text}>{partner.company.contact.address.street}</Text>
                    <Text style={styles.label}>More Information:</Text>
                    <Text style={styles.text}>{partner.company.contact.website}</Text>
                </ScrollView> */}
            </View>
            <View style={styles.mapBox}>
                <MapView
                    style={styles.map}
                    provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                    region={{
                        latitude: 41.969999999999999,
                        longitude: -85.540000000000006,
                        latitudeDelta: 0.25,
                        longitudeDelta: 0.25,
                    }}
                >
                    <Polygon coordinates={[
                        {
                            "latitude": 41.859999999999999,
                            "longitude": -85.680000000000007
                        },
                        {
                            "latitude": 41.969999999999999,
                            "longitude": -85.640000000000001
                        },
                        {
                            "latitude": 41.969999999999999,
                            "longitude": -85.540000000000006
                        },
                        {
                            "latitude": 41.960000000000001,
                            "longitude": -85.540000000000006
                        },
                        {
                            "latitude": 41.93,
                            "longitude": -85.609999999999999
                        },
                        {
                            "latitude": 41.839999999999996,
                            "longitude": -85.659999999999997
                        },
                        {
                            "latitude": 41.859999999999999,
                            "longitude": -85.680000000000007
                        }
                    ]}
                        fillColor={"red"}
                    />
                </MapView>
            </View>

            <NavigationMenu1 navigation={navigation} page={"Home"} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#8FBC8F',
        paddingHorizontal: '5%',
    },
    container2: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8FBC8F',
    },
    navIcon: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10
    },
    loadingText: {
        color: 'white',
        fontSize: 20,
    },
    infoBox: {
        backgroundColor: '#2E8B57',
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
        backgroundColor: '#2E8B57',
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
        color: 'black',
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

export default DisasterDetails;
