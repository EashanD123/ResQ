import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, FlatList, TouchableOpacity } from 'react-native';
import NavigationMenu2 from '../components/NavigationMenu2';

const { width, height } = Dimensions.get('window');

const HelpPartnerDetails = ({ navigation }) => {
    const faqData = [
        {
            question: "Q: What is the purpose of the \"View Partner Details\" screen?",
            answer: "A: The \"Partner Details\" screen displays detailed information about a specific partner associated with Novi High School Career and Technical Education Department."
        },
        {
            question: "Q: How can I view a partner's information?",
            answer: "A: Upon selecting a partner from the list, you'll be navigated to a screen showing their company details, including description, type of organization, contact information, and available resources."
        },
        {
            question: "Q: How do I delete a partner from the list?",
            answer: "A: On the \"Partner Details\" screen, press the \"Delete\" button to remove the partner from the database. This action cannot be undone."
        },
        {
            question: "Q: What does the map display on the screen represent?",
            answer: "A: The map section shows the location of the partner's address using Google Maps. You can zoom in or out to view the location details."
        }
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.instructionsTitle}>How to Use Partner Details</Text>
            <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsText}>1. View Partner Details: Navigate to a partner's page to see detailed information about their organization.</Text>
                <Text style={styles.instructionsText}>2. Edit or Delete Partner: Use the options available on the partner's page to edit their information or delete the partner entirely.</Text>
                <Text style={styles.instructionsText}>3. View Location: Explore the partner's location on the map to understand their geographical proximity.</Text>
            </View>
            <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
            <View style={styles.listView}>
                <FlatList
                    data={faqData}
                    renderItem={({ item }) => (
                        <View style={styles.faqItem}>
                            <Text style={styles.question}>{item.question}</Text>
                            <Text style={styles.answer}>{item.answer}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                />
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
});

export default HelpPartnerDetails;
