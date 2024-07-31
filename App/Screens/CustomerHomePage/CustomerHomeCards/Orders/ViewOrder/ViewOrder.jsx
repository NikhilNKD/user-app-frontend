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
        const response = await fetch(`http://192.168.29.67:3000/api/v1/customerOrders/getOrderDetails/${shopID}/${custPhoneNumber}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details.');
        }
        const data = await response.json();
        console.log('Fetched Order Details:', data);  // Log the data to inspect structure
        setOrders(data.orders);  // Set data to orders state
      } catch (error) {
        console.error('Error fetching order details:', error);
        Alert.alert('Failed to fetch order details. Please try again.');
      }
    };

    fetchOrderDetails();
  }, [shopID, custPhoneNumber]);

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
      {orders.map((order) => (
        <View key={order.id} style={styles.orderContainer}>
          <Text style={styles.orderDetail}>Customer Name: {order.customerName}</Text>
          <Text style={styles.orderDetail}>Selected Date: {order.selectedDate}</Text>
          <Text style={styles.orderDetail}>Selected Time: {order.selectedTime}</Text>
          <Text style={styles.orderDetail}>Total Price: ₹{order.totalPrice}</Text>
          <FlatList
            data={order.cartItems}
            renderItem={({ item }) => (
              <View style={styles.cartItemContainer}>
                {item.type === 'service' ? (
                  <>
                    <Text style={styles.productName}>Subservice Name: {item.subServiceName}</Text>
                    <Text>Price: ₹{item.subServicePrice}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.productName}>Product Name: {item.product_name}</Text>
                    <Text>Brand: {item.brand_name}</Text>
                    <Text>Price: ₹{item.price}</Text>
                    <Text>Weight: {item.weight}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                    <Text>Total: ₹{item.price * item.quantity}</Text>
                  </>
                )}
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
