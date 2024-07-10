import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList, Modal, TextInput, Image, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import { jsonToCSV } from 'react-native-csv';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import NavigationMenu5 from '../components/NavigationMenu5';

const { width, height } = Dimensions.get('window');

const Download = ({ navigation }) => {
  const [partners, setPartners] = useState([]);
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [ngrokUrl, setNgrokUrl] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [downloadList, setDownloadList] = useState([]);

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

  const makeCSV = async () => {
    // Map downloadList to a suitable format for CSV conversion
    const jsonData = downloadList.map(item => ({
      "Company Name": item.company.name,
      "Description": item.company.description,
      "Type of Organization": item.company.type_of_organization,
      "Contact Email": item.company.contact.email,
      "Phone Number": item.company.contact.phone_number,
      "Street": item.company.contact.address.street,
      "City": item.company.contact.address.city,
      "State": item.company.contact.address.state,
      "Zip Code": item.company.contact.address.zip_code,
      "Country": item.company.contact.address.country,
      "Website": item.company.contact.website,
      "Resources": item.company.resources_available.map(resource => resource.resource_name).join(", ")
    }));

    const CSV = jsonToCSV(jsonData);

    // Name the file
    const directoryUri = FileSystem.documentDirectory;
    const fileUri = directoryUri + 'partnerData.csv';

    // Write the file to the file system
    await FileSystem.writeAsStringAsync(fileUri, CSV);

    try {
      // Check if sharing is available
      if (await Sharing.isAvailableAsync()) {
        // Share the file using the Sharing API
        await Sharing.shareAsync(fileUri);
        Alert.alert('Download Successful', 'CSV file has been saved and can be found in the Files app.');
      } else {
        Alert.alert('Sharing Not Available', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Download Failed', 'There was an error saving the CSV file.');
    }
  };

  const applyFilter = (criteria) => {
    const filteredPartners = partners.filter(partner => {
      return partner.company.type === criteria;
    });
    setSelectedPartners([...selectedPartners, ...filteredPartners]);
    setShowFilter(false);
  };

  const filteredPartners = partners.filter(partner =>
    partner.company.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const removeTag = (tag) => {
    setDownloadList(downloadList.filter(item => item !== tag));
  };

  const renderItem = ({ item }) => (
    <View style={styles.tagContainer}>
      <Text style={styles.tagText}>{item.company.name}</Text>
      <TouchableOpacity onPress={() => removeTag(item)} style={styles.removeButton}>
        <Icon name="close" size={16} color="#555" />
      </TouchableOpacity>
    </View>
  );

  const addToDownloadList = (item) => {
    if (downloadList.length === 0) {
      setDownloadList([item]);
    } else {
      if (!downloadList.some(downloadItem => downloadItem._id === item._id)) {
        setDownloadList([...downloadList, item]);
      }
    }
  };

  const downloadAll = () => {
    let tempDownloadList = downloadList;
    for (let i = 0; i < filteredPartners.length; i++) {
      if (!tempDownloadList.some(downloadItem => downloadItem._id === filteredPartners[i]._id)) {
        tempDownloadList = [...tempDownloadList, filteredPartners[i]];
      }
    }
    setDownloadList(tempDownloadList);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchView}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search partners..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilter(true)}>
          <Image source={require('../assets/settings-sliders.png')} style={styles.filterIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={downloadAll}>
          <Image source={require('../assets/addAll.png')} style={[styles.downloadIcon]} />
        </TouchableOpacity>
      </View>
      <View style={styles.scrollView}>
        <FlatList
          data={filteredPartners}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listView}
          renderItem={({ item, index }) => (
            <View style={[styles.partnerItem, index === 0 && { marginTop: 0 }]}>
              <Text style={styles.partnerName}>{item.company.name}</Text>
              <TouchableOpacity style={styles.navButton} onPress={() => addToDownloadList(item)}>
                <Image source={require('../assets/add.png')} style={styles.navIcon} />
              </TouchableOpacity>
              {/* <Text style={styles.partnerInfo}>{item.company.description}</Text> */}
            </View>
          )}
        />
      </View>
      <View style={styles.selectedPartnersList}>
        <FlatList
          data={downloadList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={true}
        />
      </View>
      <Modal
        visible={showFilter}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setShowFilter(false)}
      >
        <View style={styles.filterModal}>
          <Text style={styles.filterHeaderText}>Filter Options</Text>
          <View style={styles.filterOption}>
            <TouchableOpacity style={styles.checkbox} onPress={() => {/* Handle checkbox state for Option 1 */ }}>
              {/* Add your checkbox UI for Option 1 here */}
              <Text style={styles.checkboxText}>Sole Proprietership</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filterOption}>
            <TouchableOpacity style={styles.checkbox} onPress={() => {/* Handle checkbox state for Option 2 */ }}>
              {/* Add your checkbox UI for Option 2 here */}
              <Text style={styles.checkboxText}>Partnership</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filterOption}>
            <TouchableOpacity style={styles.checkbox} onPress={() => {/* Handle checkbox state for Option 3 */ }}>
              {/* Add your checkbox UI for Option 3 here */}
              <Text style={styles.checkboxText}>Corporation</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filterOption}>
            <TouchableOpacity style={styles.checkbox} onPress={() => {/* Handle checkbox state for Option 4 */ }}>
              {/* Add your checkbox UI for Option 4 here */}
              <Text style={styles.checkboxText}>Non-Profit Corporations</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filterOption}>
            <TouchableOpacity style={styles.checkbox} onPress={() => {/* Handle checkbox state for Option 5 */ }}>
              {/* Add your checkbox UI for Option 5 here */}
              <Text style={styles.checkboxText}>LLC</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.filterCloseButton} onPress={() => setShowFilter(false)}>
            <Text style={styles.filterCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* <View style={styles.bottomButtons}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, { marginRight: 5 }]}>
                <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AddPartners')} style={[styles.button, { marginLeft: 5 }]}>
                <Text style={styles.buttonText}>Add Partners</Text>
            </TouchableOpacity>
        </View> */}
      <NavigationMenu5 navigation={navigation} makeCSV={makeCSV} />
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
  tagList: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.9,
  },
  selectedPartnersList: {
    marginTop: height * 0.015,
    width: width * 0.9,
    height: height * 0.308,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    padding: 2,
    flexDirection: 'row', // Arrange items horizontally
    flexWrap: 'wrap', // Allow items to wrap to the next line
    alignItems: 'flex-start', // Align items at the start of each line
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    alignSelf: 'flex-start', // Ensure it sizes dynamically
  },
  tagText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  removeButton: {
    marginLeft: 5,
  },
  searchBar: {
    width: width * 0.655,
    height: width * 0.12,
    marginRight: width * 0.005,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ecf0f1',
  },
  filterButton: {
    width: width * 0.12,
    height: width * 0.12,
    marginLeft: width * 0.005,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#1abc9c',
  },
  filterIcon: {
    width: 24,
    height: 24,
  },
  downloadIcon: {
    width: 35,
    height: 35,
  },
  searchView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.06,
  },
  partnerItem: {
    width: width * 0.9,
    height: 50,
    alignItems: 'center',
    backgroundColor: '#34495e',
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'white',
    marginTop: 10,
    flexDirection: 'row'
  },
  button: {
    width: '48%',
    height: 50,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  partnerName: {
    color: '#ecf0f1',
    fontSize: 18,
    fontWeight: 'bold',
    width: '90%'
  },
  partnerInfo: {
    color: '#bdc3c7',
    fontSize: 14,
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listView: {
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
  },
  scrollView: {
    marginTop: height * 0.015,
    width: width,
    height: height * 0.4
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: '5%',
    width: '100%',
  },
  filterModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  filterCloseButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  filterCloseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxText: {
    color: '#fff',
    fontSize: 16,
  },
  navButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  navIcon: {
    width: 22,
    height: 22,
    marginBottom: 4,
  },
});

export default Download;
