import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';

export default function ShopkeeperCustomer({ route }) {
  const { shopkeeperPhoneNumber } = route.params;
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch customer phone numbers based on shopkeeper's phone number
    fetch(`http://192.168.29.67:3000/shopkeeperCustomerDetails/${shopkeeperPhoneNumber}`)
      .then(response => response.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch customer phone numbers:', err);  // Added error logging
        setError('Failed to fetch customer phone numbers');
        setLoading(false);
      });
  }, [shopkeeperPhoneNumber]);

  const fetchCustomerDetails = (phoneNumber) => {
    fetch(`http://192.168.29.67:3000/shopkeeperCustomerDetails/${phoneNumber}`)
      .then(response => response.json())
      .then(data => {
        setSelectedCustomer(data);  // Update selected customer details
      })
      .catch(err => {
        console.error('Failed to fetch customer details:', err);
        setError('Failed to fetch customer details');
      });
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {selectedCustomer ? (
        <View style={styles.customerDetailsContainer}>
          <Text style={styles.customerName}>Customer Name: {selectedCustomer.name}</Text>
          <Text>Phone Number: {selectedCustomer.phoneNumber}</Text>
          <Text>Address: {selectedCustomer.address}</Text>
          <Text>Pincode: {selectedCustomer.pincode}</Text>
          <Text>City: {selectedCustomer.city}</Text>
          <Text>State: {selectedCustomer.state}</Text>
          <Text>Shop ID: {selectedCustomer.shop_id}</Text>
          <TouchableOpacity onPress={() => setSelectedCustomer(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to Customer List</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item.custPhoneNumber}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => fetchCustomerDetails(item.custPhoneNumber)}>
              <View style={styles.customerContainer}>
                <Text style={styles.customerPhoneNumber}>{item.custPhoneNumber}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}  // Added this to style the content of FlatList
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'red',
  },
  customerContainer: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  customerPhoneNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  customerDetailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 10,
  },
});
