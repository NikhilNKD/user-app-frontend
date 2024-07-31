import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useCart} from '../../../Context/ContextApi';
 
const Checkout = ({ route }) => {
  const {
    cartItems,
    totalPrice,
    selectedDate: selectedDateString,
    selectedTime: selectedTimeString,
    firstCustomerName,
    custPhoneNumber
  } = route.params;
  
  const {clearCart} = useCart();

  // Convert ISO strings back to Date objects
  const selectedDate = new Date(selectedDateString);
  const selectedTime = new Date(selectedTimeString);

  const navigation = useNavigation();
  const [shopkeeperDetails, setShopkeeperDetails] = useState({});

  // Group cart items by shopID
  const groupedCartItems = cartItems.reduce((acc, item) => {
    if (!acc[item.shopID]) {
      acc[item.shopID] = [];
    }
    acc[item.shopID].push(item);
    return acc;
  }, {});

  // Fetch details for all unique shopkeepers
  useEffect(() => {
    const fetchShopkeeperDetails = async () => {
      const shopkeeperPhones = [...new Set(cartItems.map(item => item.shopkeeperPhoneNumber))];

      for (const phoneNumber of shopkeeperPhones) {
        try {
          const response = await fetch(`http://192.168.29.67:3000/api/v1/shopkeeperDetails/details/${phoneNumber}`);
          if (response.ok) {
            const data = await response.json();
            setShopkeeperDetails(prevDetails => ({
              ...prevDetails,
              [phoneNumber]: data,
            }));
          } else {
            Alert.alert('Failed to fetch shopkeeper details. Please try again.');
          }
        } catch (error) {
          Alert.alert('Failed to fetch shopkeeper details. Please try again.');
        }
      }
    };

    fetchShopkeeperDetails();
  }, [cartItems]);

  const saveOrder = async () => {
    try {
      for (const [shopID, items] of Object.entries(groupedCartItems)) {
        const shopkeeperPhoneNumber = items[0]?.shopkeeperPhoneNumber;
        const shopkeeperName = shopkeeperDetails[shopkeeperPhoneNumber]?.shopkeeperName || items[0]?.shopkeeperName;
  
        const shopTotalPrice = items.reduce((sum, item) => {
          const price = item.type === 'service' ? parseFloat(item.subServicePrice) : parseFloat(item.price);
          return sum + (price * (item.quantity || 0));
        }, 0);
  
        // Format the time to HH:MM
        const formattedTime = selectedTime ? selectedTime.toISOString().slice(11, 16) : null; // HH:MM
  
        const orderData = {
          customerName: firstCustomerName,
          cartItems: items,
          totalPrice: shopTotalPrice.toFixed(2),
          selectedDate: selectedDate ? selectedDate.toISOString().slice(0, 10) : null, // YYYY-MM-DD
          selectedTime: formattedTime,
          shopID,
          shopkeeperName,
          custPhoneNumber,
          shopkeeperPhoneNumber,
        };
  
        console.log("Order Data to be sent:", orderData);  // Log the order data
  
        const response = await fetch('http://192.168.29.67:3000/api/v1/customerOrders/placeOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to save the order.');
        }
  
        Alert.alert('Order placed successfully!');
      }
      clearCart(custPhoneNumber); 
      navigation.navigate('Pay', { custPhoneNumber: custPhoneNumber });
    } catch (error) {
      Alert.alert('Failed to save the order. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../../../../assets/logo.png')} style={styles.storeImage} />
        <View style={styles.headerText}>
          <Text style={styles.welcomeText}>Welcome: {firstCustomerName}</Text>
          <Text style={styles.shoppingAt}>Shopping at: {custPhoneNumber}</Text>
        </View>
      </View>

      <View>
        <Text style={styles.checkout}>CheckOut</Text>
      </View>

      {Object.keys(groupedCartItems).map(shopID => {
        const items = groupedCartItems[shopID];
        const shopkeeperPhoneNumber = items[0]?.shopkeeperPhoneNumber;
        const shopkeeperName = shopkeeperDetails[shopkeeperPhoneNumber]?.shopkeeperName || items[0]?.shopkeeperName;

        return (
          <View key={shopID} style={styles.cardContainer}>
            <Text style={styles.shopHeader}>Shop ID: {shopID}</Text>
            <Text style={styles.cardDetails}>Shopkeeper Name: {shopkeeperName}</Text>
            <Text style={styles.cardDetails}>Shopkeeper Phone: {shopkeeperPhoneNumber}</Text>
            {items.map((item, index) => (
              <View key={item.id} style={styles.card}>
                {item.type === 'product' ? (
                  <>
                    <Text style={styles.cardTitle}>{item.product_name}</Text>
                    <Text style={styles.cardDetails}>Price: ₹{item.price}</Text>
                    <Text style={styles.cardDetails}>Quantity: {item.quantity}</Text>
                    <Text style={styles.cardDetails}>Total: ₹{(item.price || 0) * (item.quantity || 0)}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.cardDetails}>Service Name: {item.subServiceName}</Text>
                    <Text style={styles.cardDetails}>Appointment Date: {selectedDate.toDateString()}</Text>
                    <Text style={styles.cardDetails}>Appointment Time: {selectedTime.toLocaleTimeString()}</Text>
                  </>
                )}
                {index < items.length - 1 && <View style={styles.line} />}
              </View>
            ))}
          </View>
        );
      })}

      <Text style={styles.totalPrice}>Total Price: ₹{totalPrice}</Text>

      <View style={styles.paymentContainer}>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={saveOrder}
        >
          <Text style={styles.paymentButtonText}>Pay At Shop</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  storeImage: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  shoppingAt: {
    fontSize: 14,
  },
  checkout: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  paymentContainer: {
    marginTop: 20,
  },
  paymentButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Checkout;
