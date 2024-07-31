import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function OtpScreen({ navigation, route }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  
  const { phoneNumber, userType } = route.params;

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch('http://192.168.29.67:3000/api/v1/otp/validate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${errorText}`);
      }

      const data = await response.json();

      if (data.message === 'Invalid or expired OTP') {
        setError('Incorrect OTP. Please try again.');
        return;
      }

      const { token, phoneNumber: responsePhoneNumber } = data;

      if (phoneNumber !== responsePhoneNumber) {
        setError('Phone number mismatch. Please try again.');
        return;
      }

      // Navigate to SalesHomePage with the phone number and token
      navigation.navigate('SalesHomePage', { phoneNumber: responsePhoneNumber, token });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter OTP : {phoneNumber}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={text => setOtp(text)}
        keyboardType="numeric"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Verify OTP" onPress={handleVerifyOtp} />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
};
