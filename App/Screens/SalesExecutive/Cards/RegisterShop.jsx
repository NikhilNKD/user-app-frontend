import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function RegisterShop({ route }) {
    const [shopkeeperName, setShopKeeperName] = useState('');
    const [shopID, setShopId] = useState('');
    const [pincode, setPincode] = useState('');
    const [shopState, setShopState] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [shopkeeperPhoneNumber, setShopkeeperPhoneNumber] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const navigation = useNavigation();
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
	 
    const [isLoading, setIsLoading] = useState(true);
       const [selectedCategoryType, setSelectedCategoryType] = useState('');
  
 
	
	const {phoneNumber} = route.params;

    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://192.168.29.67:3000/api/v1/category/categories');
                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Fetched categories:', responseData);
                    if (responseData.success) {
                        setCategories(responseData.data); // Ensure data has `type` field
                    } else {
                        console.error('Failed to fetch categories:', responseData.message);
                    }
                } else {
                    console.error('Failed to fetch categories:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setIsLoading(false); // Set loading to false after fetching
            }
        };
        fetchCategories();
    }, []);
    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                if (selectedCategoryId) {
                    const response = await fetch(`http://192.168.29.67:3000/api/v1/category/subcategories/${selectedCategoryId}`);
                    if (response.ok) {
                        const responseData = await response.json();
                        console.log('Fetched subcategories:', responseData);
                        if (responseData.success) {
                            setSubCategories(responseData.data);
                        } else {
                            console.error('Failed to fetch sub-categories:', responseData.message);
                        }
                    } else {
                        console.error('Failed to fetch sub-categories:', response.statusText);
                    }
                }
            } catch (error) {
                console.error('Error fetching sub-categories:', error);
            }
        };
    
        fetchSubCategories();
    }, [selectedCategoryId]);
    

    const handleSubmit = async () => {
        if (!shopkeeperName.trim() || !shopID.trim() || !pincode.trim() || !shopState.trim() || !city.trim() || !address.trim() || !phoneNumber || !selectedCategory) {
            Alert.alert("Missing Fields", "Please fill in all required fields.");
            return;
        }
    
        try {
            const response = await fetch('http://192.168.29.67:3000/api/v1/sales/register-sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: shopkeeperPhoneNumber,
                    shopkeeperName,
                    shopID,
                    pincode,
                    shopState,
                    city,
                    address,
                    salesAssociateNumber: phoneNumber, // Use mobileNumber from route params
                    selectedCategory,
                    selectedSubCategory,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to register shopkeeper');
            }

            const responseData = await response.json();
            console.log('Shopkeeper registered successfully:', responseData); // Log successful registration
            alert("Shopkeeper registered");
    
            navigation.navigate('Subscription', {
                phoneNumber: shopkeeperPhoneNumber,
                selectedSubCategory: selectedSubCategory,
                selectedSubCategoryId: selectedSubCategoryId,
            });
        } catch (error) {
            console.error('Error registering shopkeeper:', error);
            Alert.alert('Error', 'Failed to register shopkeeper. Please try again later.');
        }
    };
    
    const handleCategoryChange = (itemValue) => {
        setSelectedCategory(itemValue);
        const category = categories.find(cat => cat.name === itemValue);
        if (category) {
            setSelectedCategoryId(category.id);
            setSelectedCategoryType(category.type); // Set the type of the category
        } else {
            setSelectedCategoryId('');
            setSelectedCategoryType(''); // Clear the type if category not found
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <Text style={styles.heading}>Shopkeeper Registration:{phoneNumber}</Text>
				<View style={styles.inputContainer}>
                <Text style={styles.label}>Shopkeeper Phone Number</Text>
                <TextInput
                    style={styles.input}
                    value={shopkeeperPhoneNumber}
                    onChangeText={setShopkeeperPhoneNumber}
                    placeholder="Enter Shopkeeper Phone Number"
                    keyboardType="numeric"
                />
            </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Your Name *</Text>
                    <TextInput
                        style={[styles.input]}
                        placeholder="Your Name"
                        value={shopkeeperName}
                        onChangeText={(value) => setShopKeeperName(value)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Your Store Name*</Text>
                    <TextInput
                        style={[styles.input]}
                        placeholder="Your Store Name"
                        value={shopID}
                        onChangeText={(value) => setShopId(value)}
                    />
                </View>
                <View style={styles.inputContainer}>
                <Text style={styles.label}>Sales Associate's Number (Optional)</Text>
                <TextInput
                    style={[styles.input]}
                    placeholder="Sales Associate's Number"
                    value={phoneNumber} // Set the value to mobileNumber
                    editable={false} // Make it read-only
                    keyboardType="numeric"
                />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Your Pincode*</Text>
                    <TextInput
                        style={[styles.input]}
                        placeholder="Your Pincode"
                        value={pincode}
                        onChangeText={(value) => setPincode(value)}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>State*</Text>
                    <TextInput
                        style={[styles.input]}
                        placeholder="Your State"
                        value={shopState}
                        onChangeText={(value) => setShopState(value)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>City*</Text>
                    <TextInput
                        style={[styles.input]}
                        placeholder="Your City"
                        value={city}
                        onChangeText={(value) => setCity(value)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Complete Address *</Text>
                    <TextInput
                        style={[styles.input, { height: windowHeight * 0.1, textAlignVertical: 'top' }]}
                        placeholder="Complete Address"
                        value={address}
                        onChangeText={(value) => setAddress(value)}
                        multiline
                    />
                </View>
                <View style={styles.inputContainer}>
                <Text style={styles.label}>Your Shop Category*</Text>
                <Picker
                    selectedValue={selectedCategory}
                    onValueChange={handleCategoryChange}
                    style={styles.picker}
                >
                    <Picker.Item label="Select a category" value="" />
                    {categories.map((category) => (
                        <Picker.Item key={category.id} label={category.name} value={category.name} />
                    ))}
                </Picker>
            </View>

                
            {selectedCategoryId == '5' && (
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Type of shop</Text>
                    <Picker
                        selectedValue={selectedSubCategory}
                        onValueChange={(itemValue) => {
                            setSelectedSubCategory(itemValue);
                            const subCategory = subCategories.find(sub => sub.sub_category === itemValue); // Adjust based on actual field names
                            setSelectedSubCategoryId(subCategory ? subCategory.id : '');
                        }}
                        style={styles.picker}
                        enabled={!!subCategories.length}
                    >
                        <Picker.Item label="Select a subcategory" value="" />
                        {subCategories.map((subCategory) => (
                            <Picker.Item key={subCategory.id} label={subCategory.sub_category} value={subCategory.sub_category} /> // Adjust based on actual field names
                        ))}
                    </Picker>
                </View>
            )}

                <Button
                    title="Submit"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
    },
    picker: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        backgroundColor: 'white', // Add background color here
    },
    heading: {
        fontSize: windowWidth * 0.06,
        fontWeight: 'bold',
        marginBottom: windowHeight * 0.03,
        textAlign: 'center',
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        marginBottom: windowHeight * 0.02,
    },
    label: {
        color: 'black',
        marginBottom: 5,
    },
    input: {
        width: '100%',
        height: windowHeight * 0.05,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    submitButton: {
        marginTop: 40, // Adjust this value to change the vertical spacing
    },
});
