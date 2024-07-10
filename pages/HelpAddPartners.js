import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, FlatList, TouchableOpacity } from 'react-native';
import NavigationMenu2 from '../components/NavigationMenu2';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const HelpAddPartners = ({ navigation }) => {
    const [ngrokUrl, setNgrokUrl] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const faqData = [
        {
            question: "Q: How do I add a new partner?",
            answer: "A: To add a new partner, fill in all the required fields (Name, Description, Type of Organization, Email, Phone, Address, City, Website, and Resources) and then press the 'Add Partner' button."
        },
        {
            question: "Q: What if I forget to fill in a required field?",
            answer: "A: If any required field is left empty, an error alert will appear asking you to fill in all the fields."
        },
        {
            question: "Q: What should I do if I encounter an error while adding a partner?",
            answer: "A: If an error occurs while adding a partner, an error alert will appear with the appropriate message. Please try again."
        },
        {
            question: "Q: How can I ensure that the partner data is correctly formatted?",
            answer: "A: Ensure that all fields are correctly filled with appropriate values before pressing the 'Add Partner' button. Double-check the format of the email and phone number."
        },
        {
            question: "Q: What should I do after successfully adding a partner?",
            answer: "A: After successfully adding a partner, a success alert will appear, and you will be navigated back to the previous screen."
        }
    ];

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

    const renderFaqItem = ({ item }) => (
        <View style={styles.faqItem}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
        </View>
    );

    const handleNext = () => {
        const nextIndex = currentIndex + 1 < faqData.length ? currentIndex + 1 : 0;
        setCurrentIndex(nextIndex);
        flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
    };

    const handlePrev = () => {
        const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : faqData.length - 1;
        setCurrentIndex(prevIndex);
        flatListRef.current.scrollToIndex({ animated: true, index: prevIndex });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.instructionsTitle}>How to Use Add Partners</Text>
            <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsText}>1. Fill in the Partner Details: Enter the partner's name, description, type of organization, email, phone number, address, city, website, and available resources.</Text>
                <Text style={styles.instructionsText}>2. Add Partner: After filling in all the required fields, press the "Add Partner" button to submit the information.</Text>
                <Text style={styles.instructionsText}>3. Error Handling: If there is an error (e.g., missing fields, server configuration issues), appropriate error alerts will be displayed.</Text>
                <Text style={styles.instructionsText}>4. Success: Upon successful addition, a success alert will appear and you will be navigated back to the previous screen.</Text>
            </View>
            <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
            <View style={styles.listView}>
                <FlatList
                    data={faqData}
                    renderItem={renderFaqItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={event => {
                        const index = Math.floor(event.nativeEvent.contentOffset.x / width);
                        setCurrentIndex(index);
                    }}
                    extraData={currentIndex}
                    ref={flatListRef}
                />
            </View>
            <View style={styles.navigationArrows}>
                <TouchableOpacity onPress={handlePrev}>
                    <Text style={styles.arrow}>{"<"}</Text>
                </TouchableOpacity>
                <Text style={styles.pageNumber}>{currentIndex + 1}/{faqData.length}</Text>
                <TouchableOpacity onPress={handleNext}>
                    <Text style={styles.arrow}>{">"}</Text>
                </TouchableOpacity>
            </View>
            <NavigationMenu2 navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        alignItems: 'center',
        backgroundColor: '#2c3e50',
        paddingHorizontal: '5%',
    },
    instructionsTitle: {
        fontSize: 24,
        color: '#fff',
        marginTop: height * 0.115,
        marginBottom: height * 0.01,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    instructionsContainer: {
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: height * 0.03,
        width: '100%',
        alignItems: 'center',
    },
    instructionsText: {
        fontSize: 16,
        color: '#ecf0f1',
        textAlign: 'center',
        marginBottom: 10,
    },
    faqTitle: {
        fontSize: 22,
        color: '#fff',
        marginTop: height * 0.01,
        marginBottom: height * 0.01,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    faqItem: {
        width: width * 0.9,
        height: height * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderWidth: 1, 
        borderColor: 'white',
        borderRadius: 10,
        marginHorizontal: width * 0.05,
    },
    question: {
        fontSize: 18,
        color: '#1abc9c',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    answer: {
        fontSize: 16,
        color: '#ecf0f1',
        textAlign: 'center',
        marginTop: 10,
    },
    listView: {
        justifyContent: 'center', 
        alignItems: 'center', 
        width: width,
        height: height * 0.2,
    },
    navigationArrows: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width * 0.5,
        marginTop: 10,
    },
    arrow: {
        fontSize: 24,
        color: '#fff',
    },
    pageNumber: {
        fontSize: 18,
        color: '#fff',
    },
});

export default HelpAddPartners;
