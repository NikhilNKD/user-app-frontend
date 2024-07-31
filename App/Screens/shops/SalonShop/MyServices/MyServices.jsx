import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../../../../Context/ContextApi';

const MyServices = ({ route, navigation }) => {
    const { shopkeeperPhoneNumber, userType, shopID, firstcustomerName, custPhoneNumber, shopkeeperName } = route.params;
    const [mainServices, setMainServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setGlobalPhoneNumber } = useCart();

    useEffect(() => {
        const fetchMainServices = async () => {
            try {
                const response = await fetch(`http://192.168.29.67:3000/api/v1/services/selectedMainServices/${shopkeeperPhoneNumber}`);
                
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    console.log('Fetched data:', data);
                    setMainServices(data.data || []); // Ensure 'data.data' is correctly set
                } else {
                    const text = await response.text();
                    console.error('Unexpected response format:', text);
                    throw new Error('Unexpected response format');
                }
            } catch (error) {
                console.error('Error fetching selected main services:', error);
            } finally {
                setLoading(false);
            }
        };
        setGlobalPhoneNumber(shopkeeperPhoneNumber);
    
        fetchMainServices();
    }, [shopkeeperPhoneNumber, setGlobalPhoneNumber]);
    
    const handleMainServiceClick = (id) => {
        navigation.navigate('SelectedServices', { shopkeeperPhoneNumber: shopkeeperPhoneNumber, mainServiceId: id, userType, shopID, firstcustomerName, custPhoneNumber,shopkeeperName:shopkeeperName });
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Image source={require('../../../../../assets/logo.png')} style={styles.storeImage} />
                <View style={styles.headerText}>
                    <Text style={styles.welcomeText}>Welcome: {shopkeeperName}</Text>
                    <Text style={styles.welcomeText}>Phone: {shopkeeperPhoneNumber}</Text>
                    <Text style={styles.welcomeText}>Phone: {custPhoneNumber}</Text>
                  
                    {userType !== 'customer' && (
                        <Text style={styles.shoppingAt}>Subscription Valid till 10 October 2024</Text>
                    )}
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : mainServices.length === 0 ? (
                <Text style={styles.noServicesText}>No selected services found for this phone number: {shopkeeperPhoneNumber}</Text>
            ) : (
                <FlatList
                    data={mainServices}
                    keyExtractor={(item) => item.id ? item.id.toString() : 'unknown'} // Default key if undefined
                    renderItem={({ item }) => {
                        console.log('Rendering item:', item);
                        return (
                            <TouchableOpacity
                                onPress={() => handleMainServiceClick(item.id)}
                                style={styles.item}
                            >
                                <MaterialIcons name="people-alt" size={24} color="black" style={styles.icon} />
                                <Text style={styles.itemText}>{item.name || 'Unnamed Service'}</Text>
                            </TouchableOpacity>
                        );
                    }}
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
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    storeImage: {
        width: 90,
        height: 90,
        borderRadius: 10,
    },
    headerText: {
        flex: 1,
        marginLeft: 20,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    shoppingAt: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    noServicesText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 20, // Adjust the space between rows
    },
    item: {
        width: '47%', // Adjust for spacing
        height: 156,
        backgroundColor: '#44C7F4',
        padding: 20,
        marginBottom: 10, // Space between items vertically
        marginHorizontal: 5, // Space between items horizontally
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginBottom: 10,
    },
    itemText: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
    },
});
export default MyServices;
