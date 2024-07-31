import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';

export default function MyProfile({ route }) {
  const { phoneNumber } = route.params;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pincode, setPincode] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [upi, setUpi] = useState('');
  const [pancard, setPancard] = useState('');

  useEffect(() => {
    // Fetch user's existing info
    axios.get(`http://192.168.29.67:3000/api/v1/sales/my-profile/${phoneNumber}`)
      .then(response => {
        const { firstName, lastName, pincode, aadhar, upi, pancard } = response.data;
        setFirstName(firstName);
        setLastName(lastName);
        setPincode(pincode);
        setAadhar(aadhar);
        setUpi(upi);
        setPancard(pancard);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
      });
  }, [phoneNumber]);

  const handleUpdate = () => {
    axios.post('http://192.168.29.67:3000/api/v1/sales/update-profile', {
      phoneNumber,
      firstName,
      lastName,
      pincode,
      aadhar,
      upi,
      pancard
    })
    .then(response => {
      console.log('Profile updated successfully');
	  alert("Profile updated Successfully")
    })
    .catch(error => {
      console.error('Error updating profile:', error);
    });
  };

  return (
    <View style={styles.container}>
      <Text>Mobile Number: {phoneNumber}</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={text => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={text => setLastName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Pincode"
        value={pincode}
        onChangeText={text => setPincode(text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Aadhar Number"
        value={aadhar}
        onChangeText={text => setAadhar(text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="UPI ID"
        value={upi}
        onChangeText={text => setUpi(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Pancard"
        value={pancard}
        onChangeText={text => setPancard(text)}
      />
      <Button title="Update Profile" onPress={handleUpdate} />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
};
