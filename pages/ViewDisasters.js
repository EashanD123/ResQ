import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, FlatList, Alert, Image, ScrollView } from 'react-native';
import axios from 'axios';
import NavigationMenu1 from '../components/NavigationMenu1';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ViewDisasters = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [disasters, setDisasters] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'https://api.weather.gov/alerts/active/area/MI',
                );
                console.log("----------------------------")
                console.log(response.data.features[0].properties.effective)
                console.log(response.data.features[0].properties.ends)
                console.log(response.data.features[0].properties.event)
                setDisasters(response.data.features)
            } catch (error) {
                console.error('Failed to fetch ngrok URL:', error);
                Alert.alert('Error', 'Failed to fetch server configuration.');
            }
        };

        fetchData();
    }, []);

    const applyFilters = () => {
        let filtered = disasters;

        return filtered.filter(disaster =>
            disaster.properties.event.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    const filteredDisasters = applyFilters()

    function truncate(str, maxlength) {
        return (str.length > maxlength) ?
            str.slice(0, maxlength - 1) + '…' : str;
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchView}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search Disasters..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            {disasters.length < 0 ? (
                <View>
                    <Text>Nothing</Text>
                </View>
            ) : (
                <View style={styles.scrollView}>
                    <FlatList
                        data={filteredDisasters}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listView}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => navigation.navigate('DisasterDetails', { disaster: item })} style={[styles.partnerItem, index === 0 && { marginTop: 0 }]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.navIcon}>
                                        <Image source={require('../assets/flood_warning.jpg')} style={[{ width: '100%', height: '100%' }]} />
                                    </View>
                                    <View>
                                        <Text style={styles.partnerName}>{item.properties.event} - Active</Text>
                                        <Text style={styles.partnerInfo}>Where: {truncate(item.properties.areaDesc, 27)}</Text>
                                        <Text style={styles.partnerInfo}>Start: {item.properties.effective.split("T")[0]}</Text>
                                        <Text style={styles.partnerInfo}>End: {item.properties.ends.split("T")[0]}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            <NavigationMenu1 navigation={navigation} page={"Home"} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#8FBC8F', // Changed background color
        paddingHorizontal: '5%',
        paddingTop: height * 0.03, // Added paddingTop to shift content downwards
    },
    searchView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjusted spacing between search bar and filter button
        alignItems: 'center',
        marginTop: height * 0.04, // Adjusted marginTop
    },
    searchBar: {
        width: width * 0.9, // Adjusted width
        height: width * 0.12,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#ecf0f1',
    },
    scrollView: {
        marginTop: height * 0.02, // Adjusted marginTop
        width: '100%',
        flex: 1,
    },
    listView: {
        flexGrow: 1,
        alignItems: 'center',
    },
    partnerItem: {
        width: width * 0.9,
        height: height * 0.15, // Adjusted height for more spacing
        //justifyContent: 'center',
        backgroundColor: '#2E8B57', // Adjusted item background color
        padding: 15,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'white',
        marginTop: 10,
    },
    partnerName: {
        color: '#ecf0f1',
        fontSize: 20, // Increased fontSize
        fontWeight: 'bold',
    },
    partnerInfo: {
        color: 'white',
        fontSize: 16, // Increased fontSize
        marginTop: 5,
    },
    navIcon: {
        width: 75,
        height: 75,
        borderColor: 'white',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        marginTop: 15
    },
});

export default ViewDisasters;
