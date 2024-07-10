import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Button } from 'react-native';
import axios from 'axios';

// Update this with the ngrok URL provided in your terminal
const ngrokUrl = 'https://bfca-2607-fb91-17cd-d647-e856-f2b4-e320-96e.ngrok-free.app';

export default function Sample() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${ngrokUrl}/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error.message);
      if (error.response) {
        console.error('Server responded with status code:', error.response.status);
      } else if (error.request) {
        console.error('Request made but no response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
  };

  const addItem = async () => {
    try {
      const response = await axios.post(`${ngrokUrl}/items`, { name: input });
      setItems([...items, response.data]);
      setInput('');
    } catch (error) {
      console.error('Error adding item:', error.message);
      if (error.response) {
        console.error('Server responded with status code:', error.response.status);
      } else if (error.request) {
        console.error('Request made but no response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Items</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
      <TextInput
        style={styles.input}
        placeholder="New Item"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Add Item" onPress={addItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '100%',
  },
});
