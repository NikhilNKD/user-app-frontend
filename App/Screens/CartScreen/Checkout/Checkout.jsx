import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Checkout = ({ route }) => {
  const { cartItems, totalPrice, shopID, custName, selectedDate, selectedTime, firstCustomerName, custPhoneNumber } = route.params;
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
          console.log(`Fetching details for phone number: ${phoneNumber}`); // Debugging line
          const response = await fetch(`http://192.168.29.67:3000/api/v1/shopkeeperDetails/details/${phoneNumber}`);
          if (response.ok) {
            const data = await response.json();
            console.log('Fetched shopkeeper details:', data); // Debugging line
            setShopkeeperDetails(prevDetails => ({
              ...prevDetails,
              [phoneNumber]: data,
            }));
          } else {
            console.error('Failed to fetch shopkeeper details:', response.status); // Debugging line
            Alert.alert('Failed to fetch shopkeeper details. Please try again.');
          }
        } catch (error) {
          console.error('Error fetching shopkeeper details:', error);
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
  
        // Calculate total price for the current shop
        const shopTotalPrice = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  
        const orderData = {
          custName: firstCustomerName,
          cartItems: items,
          totalPrice: shopTotalPrice, // Total price for the current shop
          selectedDate,
          selectedTime,
          shopID, // Current shopID from the loop (store name)
          shopkeeperName,
          custPhoneNumber,
          shopkeeperPhoneNumber,
        };
  
        const response = await fetch('http://192.168.29.67:3000/api/v1/customerOrders/saveOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to save the order.');
        }
  
        console.log('Order data:', orderData);
        Alert.alert('Order placed successfully!');
      }
  
      navigation.navigate('Pay', { custPhoneNumber: custPhoneNumber }); // Navigate to the payment screen
    } catch (error) {
      console.error('Error saving order:', error);
      Alert.alert('Failed to save the order. Please try again.');
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header section */}
      <View style={styles.headerContainer}>
        <Image source={require('../../../../assets/logo.png')} style={styles.storeImage} />
        <View style={styles.headerText}>
          <Text style={styles.welcomeText}>Welcome: {firstCustomerName}</Text>
          <Text style={styles.shoppingAt}>Shopping at: {custPhoneNumber}</Text>
        </View>
      </View>

      {/* Checkout title */}
      <View>
        <Text style={styles.checkout}>CheckOut</Text>
      </View>

      {/* Display cart items grouped by shop */}
      {Object.keys(groupedCartItems).map(shopID => (
        <View key={shopID}>
          <Text style={styles.shopHeader}>Shop ID: {shopID}</Text>
          {groupedCartItems[shopID].map((item, index) => (
            <View key={item.id}>
              {/* Item details */}
              <View style={styles.itemContainer}>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemText}>{item.product_name || item.service_name}</Text>
                  <Text style={styles.itemPrice}>Price: ₹{item.price}</Text>
                  <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                  <Text style={styles.itemTotal}>Total: ₹{item.price * item.quantity}</Text>
                  <Text style={styles.itemTotal}>Shopkeeper Phone: {item.shopkeeperPhoneNumber}</Text>
                </View>
              </View>
              {/* Divider between items */}
              {index < groupedCartItems[shopID].length - 1 && <View style={styles.line} />}
            </View>
          ))}
        </View>
      ))}

      {/* Display total price */}
      <Text style={styles.totalPrice}>Total Price: ₹{totalPrice}</Text>

      {/* Payment button */}
      <View style={styles.paymentContainer}>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={saveOrder} // Call saveOrder function on button press
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
  shopHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  itemContainer: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  itemDetails: {
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#333',
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  shopkeeperDetailsContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  shopkeeperDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  shopkeeperDetail: {
    fontSize: 14,
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
    alignItems: 'center',
  },
  paymentButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Checkout;
