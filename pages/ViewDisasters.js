import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, FlatList, Alert, Modal } from 'react-native';
import axios from 'axios';
import NavigationMenu1 from '../components/NavigationMenu1';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ViewDisasters = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [partners, setPartners] = useState([]);
    const [ngrokUrl, setNgrokUrl] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        soleProprietorship: false,
        partnership: false,
        corporation: false,
        nonProfit: false,
        llc: false,
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

    useFocusEffect(
        useCallback(() => {
            const fetchPartners = async () => {
                if (!ngrokUrl) {
                    return;
                }
                try {
                    const response = await axios.get(`${ngrokUrl}/partners`);
                    setPartners(response.data);
                } catch (error) {
                    console.error('Error fetching partners:', error);
                    Alert.alert('Error', 'Failed to fetch partners');
                }
            };

            fetchPartners();
        }, [ngrokUrl])
    );

    const handleFilterChange = (filter) => {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            [filter]: !prevFilters[filter],
        }));
    };

    const applyFilters = () => {
        let filtered = partners;

        if (selectedFilters.soleProprietorship) {
            filtered = filtered.filter(partner => partner.company.type_of_organization === 'FireS');
        }
        if (selectedFilters.partnership) {
            filtered = filtered.filter(partner => partner.company.type_of_organization === 'Hurricanes');
        }
        if (selectedFilters.corporation) {
            filtered = filtered.filter(partner => partner.company.type_of_organization === 'Storms');
        }
        if (selectedFilters.nonProfit) {
            filtered = filtered.filter(partner => partner.company.type_of_organization === 'Floods');
        }
        if (selectedFilters.llc) {
            filtered = filtered.filter(partner => partner.company.type_of_organization === 'EarthQuakes');
        }

        return filtered.filter(partner =>
            partner.company.name.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    const filteredPartners = applyFilters();

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
            <View style={styles.scrollView}>
                <FlatList
                    data={filteredPartners}
                    keyExtractor={item => item._id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listView}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('DisasterDetails', { partnerName: item.company.name })} style={[styles.partnerItem, index === 0 && { marginTop: 0 }]}>
                            <Text style={styles.partnerName}>{item.company.name}</Text>
                            <Text style={styles.partnerInfo}>{item.company.description}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
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
        justifyContent: 'center',
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
});

export default ViewDisasters;
