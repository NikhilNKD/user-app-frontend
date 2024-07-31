import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView , Alert } from 'react-native';
import { useCart, useCustomer } from '../../Context/ContextApi';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { MaterialIcons } from '@expo/vector-icons';

 
const CartScreen = () => {
  const { cartItems, removeFromCart, setCartItems, custPhoneNumber, shopID, shopkeeperPhoneNumber } = useCart();
  const { firstCustomerName } = useCustomer();
  const navigation = useNavigation();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const renderItem = (item) => (
    <View key={item.id} style={styles.itemContainer}>
      <View style={styles.itemInfoContainer}>
        <Text style={styles.itemName}>{item.main_category}</Text>
        <Text>{item.type === 'service' ? item.subServiceName : item.product_name}</Text>
        {item.type !== 'service' && <Text>Brand: {item.brand_name}</Text>}
        <Text>Store Name: {item.shopID}</Text>
        {item.type !== 'service' && <Text>Weight: {item.weight}</Text>}
        <Text>Shopkeeper Phone number: {item.shopkeeperPhoneNumber}</Text>
        <Text>Shopkeeper Name: {item.shopkeeperName}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(custPhoneNumber, item.id)} style={styles.removeButton}>
        <MaterialIcons name="remove-circle" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  const updateQuantity = (productId, value) => {
    if (!cartItems[custPhoneNumber]) {
      return;  // No cart items for this customer
    }

    const updatedCartItems = { ...cartItems };
    updatedCartItems[custPhoneNumber] = updatedCartItems[custPhoneNumber].map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + value);
        return {
          ...item,
          quantity: newQuantity,
        };
      }
      return item;
    });

    setCartItems(updatedCartItems);
  };

  const calculateTotalPrice = () => {
    if (!cartItems[custPhoneNumber]) {
      return 0;
    }

    return cartItems[custPhoneNumber].reduce((totalPrice, item) => {
      return totalPrice + (item.type === 'service' ? parseFloat(item.subServicePrice) : parseFloat(item.price)) * item.quantity;
    }, 0).toFixed(2);
  };

  const handlePayAtShop = () => {
    const hasService = cartItems[custPhoneNumber].some(item => item.type === 'service');

    if (hasService && (!selectedDate || !selectedTime)) {
      Alert.alert('Please select both date and time for your appointment.');
      return;
    }

    navigation.navigate('Checkout', {
      totalPrice: calculateTotalPrice(),
      cartItems: cartItems[custPhoneNumber] || [],
      firstCustomerName,
      custPhoneNumber,
      shopkeeperPhoneNumber,
      shopID,
      selectedDate: selectedDate ? selectedDate.toISOString() : null,
      selectedTime: selectedTime ? selectedTime.toISOString() : null,
    });
  };

  const showDatePicker = () => setDatePickerVisibility(true);

  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
    showTimePicker();
  };

  const showTimePicker = () => setTimePickerVisibility(true);

  const hideTimePicker = () => setTimePickerVisibility(false);

  const handleTimeConfirm = (time) => {
    setSelectedTime(time);
    hideTimePicker();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require("../../../assets/logo.png")} style={styles.storeImage} />
        <View style={styles.headerText}>
          <Text style={styles.welcomeText}>Welcome: {firstCustomerName} {custPhoneNumber}</Text>
        </View>
      </View>
      {cartItems[custPhoneNumber] && cartItems[custPhoneNumber].length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty!</Text>
      ) : (
        cartItems[custPhoneNumber]?.map(item => renderItem(item))
      )}
      {cartItems[custPhoneNumber] && cartItems[custPhoneNumber].some(item => item.type === 'service') && (
        <View style={styles.appointmentContainer}>
          <TouchableOpacity
            onPress={() => showDatePicker()}
            style={styles.appointmentButton}
          >
            <Text style={styles.appointmentButtonText}>Schedule Appointment</Text>
          </TouchableOpacity>
          {selectedDate && selectedTime && (
            <View style={styles.appointmentSummaryContainer}>
              <Text style={styles.appointmentSummaryTitle}>Appointment Details:</Text>
              <Text style={styles.appointmentSummaryText}>Date: {moment(selectedDate).format('YYYY-MM-DD')}</Text>
              <Text style={styles.appointmentSummaryText}>Time: {moment(selectedTime).format('HH:mm')}</Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.footerContainer}>
        <Text style={styles.totalPrice}>Total Price: ₹{calculateTotalPrice()}</Text>
        <TouchableOpacity onPress={handlePayAtShop} style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
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
  emptyCartText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
  itemContainer: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfoContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: '#ddd',
    padding: 8,
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#555',
  },
  itemQuantity: {
    marginHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    marginLeft: 12,
  },
  appointmentContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 16,
  },
  appointmentButton: {
    padding: 12,
    borderRadius: 5,
    borderColor: '#007BFF',
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  appointmentButtonText: {
    fontSize: 16,
    color: '#007BFF',
    textAlign: 'center',
  },
  appointmentSummaryContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 16,
  },
  appointmentSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  appointmentSummaryText: {
    fontSize: 16,
    textAlign: 'center',
  },
  footerContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 5,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CartScreen;
