import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Button, Image, Modal } from 'react-native';

export default function SubSalonService({ route, navigation }) {
    const { mainServiceId, shopkeeperPhoneNumber, shopkeeperName } = route.params;

    const [subServices, setSubServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentServiceId, setCurrentServiceId] = useState(null);
    const [enteredPrices, setEnteredPrices] = useState({});

    useEffect(() => {
        const fetchSubServices = async () => {
            try {
                const response = await fetch(`http://192.168.29.67:3000/api/v1/services/subServices/${mainServiceId}`);
                const data = await response.json();
                if (Array.isArray(data.data)) {
                    setSubServices(data.data);
                } else {
                    console.error('Unexpected data format:', data);
                }
            } catch (error) {
                console.error('Error fetching sub-services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubServices();
    }, [mainServiceId]);

    const handleServiceSelect = (serviceId, price) => {
        setCurrentServiceId(serviceId);
        setModalVisible(true);
    };

    const addServiceWithPrice = () => {
        const price = parseFloat(enteredPrices[currentServiceId]);
        if (!isNaN(price) && price >= 0) {
            const selectedServiceIndex = selectedServices.findIndex(service => service.id === currentServiceId);
            if (selectedServiceIndex !== -1) {
                const updatedServices = [...selectedServices];
                updatedServices[selectedServiceIndex].price = price;
                setSelectedServices(updatedServices);
            } else {
                setSelectedServices(prevSelectedServices => [...prevSelectedServices, { id: currentServiceId, price }]);
            }
            setModalVisible(false);
        } else {
            Alert.alert('Invalid Price', 'Please enter a valid price.');
        }
    };

    const getPriceForService = (serviceId) => {
        return enteredPrices[serviceId] || '';
    };

    const filteredSubServices = subServices.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const goToMyServices = async () => {
        try {
            await fetch('http://192.168.29.67:3000/api/v1/services/saveSelectedServices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: shopkeeperPhoneNumber,
                    selectedServices: selectedServices.map(service => ({
                        mainServiceId,
                        subServiceId: service.id,
                        price: service.price
                    }))
                }),
            });

            setSelectedServices([]);
            navigation.navigate('MyServices', { shopkeeperPhoneNumber: shopkeeperPhoneNumber });
        } catch (error) {
            console.error('Error navigating to MyServices:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Image source={require('../../../../../../assets/logo.png')} style={styles.storeImage} />
                <View style={styles.headerText}>
                    <Text style={styles.welcomeText}>Welcome: {shopkeeperName}{mainServiceId}</Text>
                    <Text style={styles.shoppingAt}>Shop ID: {shopkeeperPhoneNumber}</Text>
                    <Text style={styles.shoppingAt}>Subscription Valid till 10 October 2024</Text>
                </View>
            </View>

            <TextInput
                style={styles.searchBar}
                placeholder="Search sub-services..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={filteredSubServices}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.itemText}>{item.name}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                            <Text style={styles.itemText}>Price: ₹{getPriceForService(item.id)}</Text>
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    selectedServices.find(service => service.id === item.id) && styles.buttonSelected
                                ]}
                                onPress={() => handleServiceSelect(item.id, item.price)}
                            >
                                <Text style={styles.buttonText}>
                                    {selectedServices.find(service => service.id === item.id) ? 'Selected' : 'Select'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Enter the price:</Text>
                        <TextInput
                            style={styles.priceInput}
                            placeholder="Price"
                            keyboardType="numeric"
                            value={enteredPrices[currentServiceId] || ''}
                            onChangeText={(text) => setEnteredPrices({ ...enteredPrices, [currentServiceId]: text })}
                        />
                        <Button title="Add Service" onPress={addServiceWithPrice} />
                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                style={styles.navigateButton}
                onPress={goToMyServices}
            >
                <Text style={styles.navigateButtonText}>Go to My Services</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f4f7',
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
    searchBar: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    card: {
        padding: 15,
        margin: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    button: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    buttonSelected: {
        backgroundColor: '#5cb85c',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 15,
        textAlign: 'center',
    },
    priceInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        width: 200,
        backgroundColor: '#fff',
    },
     navigateButton: {
        backgroundColor: '#007BFF', // Blue background color
        paddingVertical: 10, // Vertical padding
        paddingHorizontal: 20, // Horizontal padding
        borderRadius: 5, // Rounded corners
        alignItems: 'center', // Center the text
        marginVertical: 10, // Vertical margin
    },
    navigateButtonText: {
        color: '#FFFFFF', // White text color
        fontSize: 16, // Font size
        fontWeight: 'bold', // Bold text
    },
});
