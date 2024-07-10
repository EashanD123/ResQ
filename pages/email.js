import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, Provider as PaperProvider } from 'react-native-paper';
import { send } from '@emailjs/react-native';

const { width, height } = Dimensions.get('window');

const EmailSender = ({ route, navigation }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (route.params && route.params.email) {
      setEmail(route.params.email);
    }
  }, [route.params]);

  const sendEmail = async () => {
    const templateParams = {
      from_name: "Novi High School Career and Technical Education Department",
      message: message,
      to_email: email,
    };

    await send('service_ybwp7qs', 'template_x6t2sar', templateParams, { publicKey: 'APqLeD00jvyRKaGwU' })
      .then(response => {
        Alert.alert('Success', 'Email sent successfully!', [{ text: 'OK' }]);
        console.log('SUCCESS!', response.status, response.text);
      })
      .catch(err => {
        Alert.alert('Error', 'Failed to send email. Please try again.', [{ text: 'OK' }]);
        console.error('FAILED...', err);
      });
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Send Email</Title>
            <Paragraph style={styles.paragraph}>Fill in the details below to send an email.</Paragraph>
            <TextInput
              label="To Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              mode="outlined"
              theme={{ colors: { primary: '#3498db', underlineColor: 'transparent' } }}
            />
            <TextInput
              label="Your Message"
              value={message}
              onChangeText={setMessage}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
              mode="outlined"
              theme={{ colors: { primary: '#3498db', underlineColor: 'transparent' } }}
            />
            <Button mode="contained" onPress={sendEmail} style={styles.button} theme={{ colors: { primary: '#3498db' } }}>
              Send Email
            </Button>
          </Card.Content>
        </Card>
      </View>
      <View style={styles.bottomButtons}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, { marginRight: 5 }]}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: '5%',
    backgroundColor: '#2c3e50',
  },
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 4,
    marginTop: 0
  },
  title: {
    fontSize: width * 0.075,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
    color: '#2c3e50',
  },
  paragraph: {
    textAlign: 'center',
    marginBottom: height * 0.02,
    color: '#2c3e50',
  },
  input: {
    marginBottom: 16,
  },
  textArea: {
    height: 100,
  },
  button: {
    marginTop: 16,
  },
});

export default EmailSender;
