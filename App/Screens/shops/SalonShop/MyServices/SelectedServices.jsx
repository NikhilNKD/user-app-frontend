import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../../../../Context/ContextApi';

const SubServices = ({ route }) => {
  const { shopPhoneNumber, mainServiceId, userType, firstcustomerName, custPhoneNumber } = route.params;
  const { addToCart, setCustPhoneNumber } = useCart();
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopID, setShopID] = useState('');

  useEffect(() => {
    fetchSubServices();
    fetchShopDetails();
    setCustPhoneNumber(custPhoneNumber);
  }, [shopPhoneNumber, mainServiceId, setCustPhoneNumber]);

  const fetchSubServices = async () => {
    try {
      const response = await fetch(`http://192.168.29.67:3000/shopkeeper/selectedSubServices/${shopPhoneNumber}/${mainServiceId}`);
      if (response.ok) {
        const data = await response.json();
        setSubServices(data);
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
      const response = await fetch(`http://192.168.29.67:3000/shopkeeperServiceDetails/${shopPhoneNumber}`);
      if (response.ok) {
        const data = await response.json();
        setShopID(data.shopID);
      } else {
        console.error('Failed to fetch shop details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching shop details:', error);
    }
  };

  const renderSubService = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.detailsContainer}>
        <Text style={styles.subServiceName}>{item.subServiceName || 'N/A'}</Text>
        <Text style={styles.subServicePrice}>Price: ₹{item.subServicePrice || 'N/A'}</Text>

        {userType === 'customer' && (
          <TouchableOpacity onPress={() => addToCart(custPhoneNumber, item, shopPhoneNumber, shopID, 'service')} style={styles.addToCartButton}>
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);

    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ id: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }

    return data;
  };

  const numColumns = 2;

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome: {firstcustomerName}</Text>
      <Text style={styles.welcomeText}>Shop Phone number: {shopID}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : subServices.length === 0 ? (
        <Text>No sub services found for this main service</Text>
      ) : (
        <FlatList
          data={formatData(subServices, numColumns)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            if (item.empty) {
              return <View style={[styles.card, styles.invisibleCard]} />;
            }
            return renderSubService({ item });
          }}
          numColumns={numColumns}
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
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  subServicePrice: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
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
