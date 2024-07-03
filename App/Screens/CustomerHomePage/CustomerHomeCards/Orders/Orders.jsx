import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CustomerContext } from '../../../../Context/ContextApi'; // Adjust the import based on your context setup

const Orders = () => {
  const navigation = useNavigation();
  const { custPhoneNumber } = useContext(CustomerContext);  // Fetch phone number from context

  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(`http://192.168.29.67:3000/getCustomerStores?custPhoneNumber=${custPhoneNumber}`);
        console.log('Response Status:', response.status);  // Log response status
        if (!response.ok) {
          throw new Error('Failed to fetch shops.');
        }
        const data = await response.json();
        console.log('Fetched Shops:', data);  // Log the data to inspect structure
        setShops(data);  // Set data to shops state
      } catch (error) {
        console.error('Error fetching shops:', error);
        Alert.alert('Failed to fetch shops. Please try again.');
      }
    };

    if (custPhoneNumber) {
      fetchShops();
    }
  }, [custPhoneNumber]);

  const renderItem = ({ item }) => {
    const { shopID } = item;

    return (
      <View style={styles.shopContainer}>
        <Text style={styles.shopHeader}>Shop: {shopID}</Text>
        <TouchableOpacity
          style={styles.viewOrderButton}
          onPress={() => navigation.navigate('ViewOrder', { shopID, custPhoneNumber })}
        >
          <Text style={styles.viewOrderButtonText}>View Order</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={shops}
        renderItem={renderItem}
        keyExtractor={(item) => item.shopID}
      />
      <TouchableOpacity
        style={styles.searchShopsButton}
        onPress={() => navigation.navigate('SearchShops')}
      >
        <Text style={styles.searchShopsButtonText}>Back to search shops</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  shopContainer: {
    marginBottom: 16,
  },
  shopHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  viewOrderButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
  },
  viewOrderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchShopsButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  searchShopsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Orders;
