import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const AppleSignInButton = () => {
  const handleAppleSignIn = () => {
    // Handle Apple Sign-In logic here
    console.log('Apple Sign-In');
  };

  return (
    <TouchableOpacity style={styles.asiMaterialButton} onPress={handleAppleSignIn}>
      <View style={styles.asiMaterialButtonContentWrapper}>
        <View style={styles.asiMaterialButtonIcon}>
          <Svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-6 0 48 48" width="26" height="32" transform={{ }}>
            <Path d="M33.91 21.14c-.07-7.29 6.15-10.81 6.42-10.98-3.52-5.16-8.98-5.86-10.92-5.95-4.62-.47-9.03 2.71-11.38 2.71-2.33 0-5.95-2.65-9.77-2.57-5.03.07-9.7 2.92-12.28 7.44-5.25 9.07-1.33 22.45 3.77 29.79 2.51 3.57 5.48 7.6 9.39 7.45 3.75-.15 5.18-2.42 9.72-2.42 4.55 0 5.85 2.42 9.77 2.36 3.92-.07 6.41-3.6 8.88-7.21 1.48-2.19 2.64-4.47 3.61-6.84C40.59 32.39 34.02 30.69 33.91 21.14zM30.28 2.22c2.07-2.5 3.45-5.95 3.07-9.22-2.97.12-6.62 2.04-8.75 4.56-1.9 2.21-3.56 5.75-3.11 9.11 3.89-2.78 7.64-4.64 8.79-6.45z" fill="#000"/>
          </Svg>
        </View>
        <Text style={styles.asiMaterialButtonContents}>Sign in with Apple</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  asiMaterialButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    height: 40,
    width: '100%',
    maxWidth: 400,
    minWidth: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  asiMaterialButtonContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginRight: 10
  },
  asiMaterialButtonIcon: {
    marginRight: 20,
  },
  asiMaterialButtonContents: {
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
  },
});

export default AppleSignInButton;
