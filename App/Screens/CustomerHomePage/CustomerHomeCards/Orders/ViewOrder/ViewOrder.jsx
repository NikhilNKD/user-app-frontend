import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ViewOrder = () => {
  const route = useRoute();
  const { shopID, custPhoneNumber } = route.params;

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Fetch order details with route parameters
        const response = await fetch(`http://192.168.29.67:3000/api/v1/customerOrders/getOrderDetails/${shopID}/${custPhoneNumber}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details.');
        }
        const data = await response.json();
        console.log('Fetched Order Details:', data);  // Log the data to inspect structure
        setOrders(data.orders);  // Set data to orders state; adjust based on the structure of the response
      } catch (error) {
        console.error('Error fetching order details:', error);
        Alert.alert('Failed to fetch order details. Please try again.');
      }
    };
  
    fetchOrderDetails();
  }, [shopID, custPhoneNumber]);  // Add dependencies for `shopID` and `custPhoneNumber`
  
    

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No orders found for this shop.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Order Details for Shop: {shopID}</Text>
      {orders.map((order, index) => (
        <View key={index} style={styles.orderContainer}>
          <Text>Total Price: ₹{order.totalPrice}</Text>
          <FlatList
            data={order.cartItems}  // Assuming cartItems is already an array
            renderItem={({ item }) => (
              <View style={styles.cartItemContainer}>
                <Text style={styles.productName}>{item.product_name}</Text>
                <Text>Price: ₹{item.price}</Text>
                <Text>Quantity: {item.quantity}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  orderContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cartItemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ViewOrder;
