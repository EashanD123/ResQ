import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import axios from 'axios';

const OPENAI_API_KEY = 'sk-proj-54iz8WwzQlCYgZhxM5dBT3BlbkFJpQ960IzwfTpVQMdrcjur';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello! How can I assist you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
          avatar: 'https://placeimg.com/140/140/any', // Replace with your chatbot avatar URL
        },
      },
    ]);
  }, []);

  const onSend = async (newMessages = []) => {
    const userMessage = newMessages[0].text;

    // Update the UI with the user's message immediately
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

    // Prepare the payload for OpenAI API
    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userMessage },
      ],
    };

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        payload,
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const chatbotResponse = response.data.choices[0].message.content.trim();
      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: chatbotResponse,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
          avatar: 'https://placeimg.com/140/140/any', // Replace with your chatbot avatar URL
        },
      };

      // Append the bot's message to the UI after receiving the response
      setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
    } catch (error) {
      console.error('Error fetching response from OpenAI:', error);
    }
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#0078fe',
          },
          left: {
            backgroundColor: '#f0f0f0',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
          left: {
            color: '#000',
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          borderTopWidth: 1,
          borderTopColor: '#e8e8e8',
          backgroundColor: '#fff',
        }}
        primaryStyle={{ alignItems: 'center' }}
      />
    );
  };

  return (
    <ImageBackground
      style={styles.background} // Adjusted style to include backgroundColor
    >
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#8FBC8F', // Changed background color to dark sea green
    resizeMode: 'cover',
  },
});

export default Chatbot;
