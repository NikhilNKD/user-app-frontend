import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductInventory = ({ route }) => {
    const { selectedCategory, shopkeeperPhoneNumber, shopkeeperName } = route.params;
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        setProducts([]);
        setFilteredProducts([]);
        setLoading(true);
        fetchProducts();
    }, [shopkeeperPhoneNumber]);

    useEffect(() => {
        filterProducts();
    }, [searchText, products]);

    const filterProducts = () => {
        const filtered = products.filter(product =>
            product.product_name.toLowerCase().includes(searchText.toLowerCase()) ||
            product.brand_name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredProducts(filtered);
    };
    const fetchProducts = async () => {
        try {
            console.log(`Fetching products for category: ${selectedCategory}`);
            // Make sure selectedCategory has a valid value
            if (!selectedCategory) {
                throw new Error('No category selected');
            }
            const response = await fetch(`http://192.168.29.67:3000/api/v1/productInventory/products/${selectedCategory}`);
            if (response.ok) {
                const result = await response.json();
                console.log('Fetched products:', result);
                const productsWithAddedStatus = result.data.map(product => ({ ...product, added: false }));
                await updateProductsAddedStatus(productsWithAddedStatus);
                setProducts(productsWithAddedStatus);
                filterProducts();
            } else {
                console.error('Failed to fetch products:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProductsAddedStatus = async (products) => {
        try {
            const addedProducts = await AsyncStorage.getItem(`addedProducts_${shopkeeperPhoneNumber}`);
            const addedProductsArray = addedProducts ? JSON.parse(addedProducts) : [];
            const updatedProducts = products.map(product => ({
                ...product,
                added: addedProductsArray.includes(product.id)
            }));
            setProducts(updatedProducts);
        } catch (error) {
            console.error('Error updating product added status:', error);
        }
    };

    const handleAddProduct = async (productId, index) => {
        try {
            const response = await fetch('http://192.168.29.67:3000/api/v1/productInventory/addProduct', {  // Updated endpoint path
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shopkeeperPhoneNumber, productId }),
            });

            if (response.ok) {
                const updatedProducts = [...products];
                updatedProducts[index].added = true;
                setProducts(updatedProducts);
                await saveAddedProduct(productId);
                Alert.alert('Success', `Product added successfully`);
            } else {
                console.error('Failed to add product:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const saveAddedProduct = async (productId) => {
        try {
            const addedProducts = await AsyncStorage.getItem(`addedProducts_${shopkeeperPhoneNumber}`);
            const addedProductsArray = addedProducts ? JSON.parse(addedProducts) : [];
            if (!addedProductsArray.includes(productId)) {
                addedProductsArray.push(productId);
                await AsyncStorage.setItem(`addedProducts_${shopkeeperPhoneNumber}`, JSON.stringify(addedProductsArray));
            }
        } catch (error) {
            console.error('Error saving added product:', error);
        }
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.productContainer}>
            <Text style={styles.productName}>{item.main_category}</Text>
            <Text style={styles.productName}>{item.product_name}</Text>
            <Text style={styles.productBrand}>{item.brand_name}</Text>
            <Text style={styles.productPrice}>Price: ${item.price}</Text>
            <Text style={styles.productWeight}>Weight: {item.weight}</Text>
            {item.picture_path ? (
                <Image source={{ uri: `http://192.168.29.67:3000/${item.picture_path}` }} style={styles.productImage} />
            ) : (
                <View style={styles.noImageContainer}>
                    <Text>No Image Available</Text>
                </View>
            )}
            <TouchableOpacity
                onPress={() => handleAddProduct(item.id, index)}
                style={[styles.addButton, { backgroundColor: item.added ? 'gray' : 'green' }]}
                disabled={item.added}
            >
                <Text style={styles.addButtonText}>{item.added ? 'Added' : 'Add'}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.shopkeeperInfo}>Shopkeeper: {selectedCategory} ({shopkeeperPhoneNumber})</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                value={searchText}
                onChangeText={setSearchText}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={filteredProducts.length > 0 ? filteredProducts : products}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    shopkeeperInfo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    productContainer: {
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    productBrand: {
        fontSize: 14,
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        marginBottom: 4,
    },
    productWeight: {
        fontSize: 14,
        marginBottom: 8,
    },
    productImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 8,
    },
    noImageContainer: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        marginBottom: 8,
    },
    addButton: {
        marginTop: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
    },
});

export default ProductInventory;
