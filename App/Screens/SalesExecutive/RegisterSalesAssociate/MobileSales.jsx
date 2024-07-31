import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function MobileSales() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();

  const generateOtp = async (phoneNumber) => {
    try {
      const response = await axios.post('http://192.168.29.67:3000/api/v1/otp/generate-otp', { phoneNumber });
      return response.data;
    } catch (error) {
      console.error('Error generating OTP:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (phoneNumber.trim() !== '') {
      try {
        const response = await axios.post('http://192.168.29.67:3000/api/v1/sales/check-user', { phoneNumber });
        await generateOtp(phoneNumber);
        if (response.data.exists) {
          navigation.navigate('OtpScreen', { phoneNumber, userType: 'sales' });
        } else {
          navigation.navigate('RegisterSales', { phoneNumber });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      alert('Please enter a valid mobile number');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Enter Mobile Number</Text>
      <TextInput
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
        placeholder="Mobile Number"
        value={phoneNumber}
        onChangeText={text => setPhoneNumber(text)}
        keyboardType="phone-pad"
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}
