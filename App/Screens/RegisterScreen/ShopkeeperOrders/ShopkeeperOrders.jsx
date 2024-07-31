import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';

export default function ShopkeeperOrders({ route }) {
  const { shopkeeperPhoneNumber } = route.params;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch orders for the shopkeeper
    fetch(`http://192.168.29.67:3000/shopkeeperOrders/${shopkeeperPhoneNumber}`)
      .then(response => response.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch orders:', err);  // Added error logging
        setError('Failed to fetch orders');
        setLoading(false);
      });
  }, [shopkeeperPhoneNumber]);

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const renderItem = ({ item }) => {
    const cartItems = JSON.parse(item.cartItems);

    return (
      <View style={styles.orderContainer}>
        <Text style={styles.orderTitle}>Order ID: {item.id}</Text>
        <Text style={styles.customerName}>Customer Name: {item.customerName}</Text>
        <Text style={styles.customerInfo}>Customer Phone: {item.custPhoneNumber}</Text>
        <Text style={styles.totalPrice}>Total Price: ${item.totalPrice}</Text>
        
        <FlatList
          data={cartItems}
          keyExtractor={(product) => product.id.toString()}
          renderItem={({ item: product }) => (
            <View style={styles.productContainer}>
              <View style={styles.productDetails}>
                <Text style={styles.productName}>Product Name: {product.product_name}</Text>
                <Text style={styles.productText}>Category: {product.main_category}</Text>
                <Text style={styles.productText}>Brand: {product.brand_name}</Text>
                <Text style={styles.productText}>Price: ${product.price}</Text>
                <Text style={styles.productText}>Quantity: {product.quantity}</Text>
              </View>
              {product.picture_path ? (
                <Image
                  source={{ uri: `http://192.168.29.67:3000/${product.picture_path}` }}
                  style={styles.productImage}
                />
              ) : null}
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}  // Added this to style the content of FlatList
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f8f8f8',
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
  orderContainer: {
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
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2a2a2a',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e90ff',
    marginBottom: 5,
  },
  customerInfo: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d9534f',
    marginBottom: 10,
  },
  productContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productDetails: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  productText: {
    fontSize: 14,
    color: '#666',
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    marginTop: 10,
  },
});
