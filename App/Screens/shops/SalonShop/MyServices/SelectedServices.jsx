import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../../../../Context/ContextApi';

const SubServices = ({ route }) => {
  const { shopkeeperPhoneNumber, mainServiceId, userType, firstCustomerName, custPhoneNumber, shopkeeperName } = route.params;
  const { addToCart, setCustPhoneNumber } = useCart();
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopID, setShopID] = useState('');

  useEffect(() => {
    fetchSubServices();
    fetchShopDetails();
    setCustPhoneNumber(custPhoneNumber);
  }, [shopkeeperPhoneNumber, mainServiceId, setCustPhoneNumber]);

  const fetchSubServices = async () => {
    try {
      const response = await fetch(`http://192.168.29.67:3000/api/v1/services/selectedSubServices/${shopkeeperPhoneNumber}/${mainServiceId}`);
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.data)) {
          const filteredData = data.data
            .filter(subService => 
              subService.subService?.id && subService.subService?.name && subService.price
            )
            .map(subService => ({
              id: subService.subService.id.toString(),
              subServiceName: subService.subService.name,
              subServicePrice: subService.price.toString(),
              shopkeeperPhoneNumber: subService.phoneNumber // Ensure this is available
            }));
          console.log('Filtered Data:', filteredData);
          setSubServices(filteredData);
        } else {
          console.error('Expected data.data to be an array, but got:', data);
          setSubServices([]);
        }
      } else {
        console.error('Failed to fetch selected sub services:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching selected sub services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShopDetails = async () => {
    try {
      const response = await fetch(`http://192.168.29.67:3000/api/v1/shopkeeperDetails/service/${shopkeeperPhoneNumber}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched Shop Details:', data);
        setShopID(data.data.shopID);
      } else {
        console.error('Failed to fetch shop details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching shop details:', error);
    }
  };

  const renderSubService = ({ item }) => {
    console.log('Rendering item:', item);
    return (
      <View style={styles.card}>
        <View style={styles.detailsContainer}>
          <Text style={styles.subServiceName}>{item.subServiceName}</Text>
          <Text style={styles.subServicePrice}>Price: ₹{item.subServicePrice}</Text>
          {userType === 'customer' && (
            <TouchableOpacity 
              onPress={() => addToCart(custPhoneNumber, item, shopkeeperName, item.shopkeeperPhoneNumber, shopID, 'service')} 
              style={styles.addToCartButton}
            >
              <Text style={styles.addToCartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome: {shopkeeperName}</Text>
      <Text style={styles.welcomeText}>Shop Phone number: {shopkeeperPhoneNumber}</Text>
      <Text style={styles.welcomeText}>Customer PhoneNumber: {custPhoneNumber}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : subServices.length === 0 ? (
        <Text>No sub services found for this main service</Text>
      ) : (
        <FlatList
          data={subServices}
          keyExtractor={(item) => item.id}
          renderItem={renderSubService}
          numColumns={2}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    padding: 15,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#4A90E2',
  },
  invisibleCard: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  detailsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subServiceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  subServicePrice: {
    fontSize: 14,
    color: '#666',
  },
  addToCartButton: {
    backgroundColor: '#45CE30',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  addToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default SubServices;
