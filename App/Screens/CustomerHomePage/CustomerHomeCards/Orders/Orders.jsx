import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CustomerContext } from '../../../../Context/ContextApi'; // Adjust the import based on your context setup

const Orders = () => {
  const navigation = useNavigation();
  const { custPhoneNumber } = useContext(CustomerContext);  // Fetch phone number from context

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://192.168.29.67:3000/getOrders?custPhoneNumber=${custPhoneNumber}`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders.');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        Alert.alert('Failed to fetch orders. Please try again.');
      }
    };

    if (custPhoneNumber) {
      fetchOrders();
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
        data={orders}
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
