import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Orders = ({ route }) => {
  const navigation = useNavigation();
  const { custPhoneNumber } = route.params;
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        console.log('Fetching orders for phone number:', custPhoneNumber);  // Verify phone number
        const response = await fetch(`http://192.168.29.67:3000/api/v1/customerOrders/getCustomerOrder/${custPhoneNumber}`);
        console.log('Response Status:', response.status);  // Check the response status
        if (!response.ok) {
          throw new Error('Failed to fetch shops.');
        }
        const data = await response.json();
        console.log('Fetched Orders:', data);  // Log data to inspect
        setShops(groupOrdersByShop(data.orders));  // Group orders by shopID and set data to shops state
      } catch (error) {
        console.error('Error fetching shops:', error);
        Alert.alert('Failed to fetch shops. Please try again.');
      }
    };

    if (custPhoneNumber) {
      fetchShops();
    } else {
      console.error('custPhoneNumber is undefined');
    }
  }, [custPhoneNumber]);

  const groupOrdersByShop = (orders) => {
    if (!orders || orders.length === 0) return [];
    const grouped = orders.reduce((acc, order) => {
      const { shopID } = order;
      if (!acc[shopID]) {
        acc[shopID] = [];
      }
      acc[shopID].push(order);
      return acc;
    }, {});
    return Object.entries(grouped).map(([shopID, orders]) => ({ shopID, orders }));
  };

  const renderItem = ({ item }) => {
    const { shopID, orders } = item;

    return (
      <View style={styles.shopContainer}>
        <Text style={styles.shopHeader}>Shop: {shopID}</Text>
        <TouchableOpacity
          style={styles.viewOrderButton}
          onPress={() => navigation.navigate('ViewOrder', { shopID, custPhoneNumber, orders })}
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
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
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
    marginTop: 8,
  },
  viewOrderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
});

export default Orders;
