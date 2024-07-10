import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, FlatList, TouchableOpacity } from 'react-native';
import NavigationMenu2 from '../components/NavigationMenu2';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const HelpHome = ({ navigation }) => {
    const [ngrokUrl, setNgrokUrl] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const faqData = [
        {
            question: "Q: What is the purpose of the \"View Partners\" button?",
            answer: "A: The \"View Partners\" button navigates you to a page that displays a list of partners associated with the Novi High School Career and Technical Education Department."
        },
        {
            question: "Q: What happens when I press the \"Download Report\" button?",
            answer: "A: Pressing the \"Download Report\" button takes you to a page where you can download and analyze information about partners associated with Novi High School."
        },
        {
            question: "Q: What is the purpose of the \"Calendar\" button?",
            answer: "A: Pressing the \"Calendar\" button enables users to connect with various partners and discuss certain topics."
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
            <Text style={styles.instructionsTitle}>How to Use Home </Text>
            <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsText}>1. View Partners: Press the "View Partners" button to navigate to a page where you can see a list of partners associated with the department.</Text>
                <Text style={styles.instructionsText}>2. Download Report: Press the "Download Report" button to navigate to a page where you can download relevant reports.</Text>
                <Text style={styles.instructionsText}>3. Calendar: Press the "Calendar" button to schedule and view meetings with associated partners.</Text>
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

export default HelpHome;
