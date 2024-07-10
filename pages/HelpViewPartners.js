import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, FlatList, TouchableOpacity } from 'react-native';
import NavigationMenu2 from '../components/NavigationMenu2';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const HelpViewPartners = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const faqData = [
        {
            question: "Q: How do I search for a partner?",
            answer: "A: You can search for a partner by typing the partner's name into the search bar located at the top of the 'View Partners' page."
        },
        {
            question: "Q: How do I filter the list of partners?",
            answer: "A: Press the filter button (sliders icon) next to the search bar to open filter options. Select the types of businesses you want to view and press 'Close' to apply the filters."
        },
        {
            question: "Q: What information is displayed about each partner?",
            answer: "A: Each partner's name and a brief description of their business are displayed. Tap on a partner's name to view more detailed information."
        },
        {
            question: "Q: What should I do if I cannot see any partners?",
            answer: "A: Ensure you have a stable internet connection. If the problem persists, try refreshing the page or restarting the app."
        }
    ];

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
            <Text style={styles.instructionsTitle}>How to Use View Partners </Text>
            <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsText}>1. Search: Use the search bar at the top of the 'View Partners' page to find partners by name.</Text>
                <Text style={styles.instructionsText}>2. Filter: Press the filter button next to the search bar to open filter options. Select from a wide range of filters including the types of businesses you want to view and press 'Close' to apply the filters.</Text>
                <Text style={styles.instructionsText}>3. Partner Details: Tap on a partner's name to view more detailed information about that partner.</Text>
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
        marginTop: height * 0.125,
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
        textAlign: 'center',
        color: '#ecf0f1',
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

export default HelpViewPartners;
