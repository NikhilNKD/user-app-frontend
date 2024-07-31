import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ShopkeeperMyProducts = ({ route }) => {
    const [categories, setCategories] = useState([]);
    const { userType, shopkeeperName, shopkeeperPhoneNumber, shopID } = route.params;
    const navigation = useNavigation();

    useEffect(() => {
        fetchSelectedProducts();
    }, []);

    const fetchSelectedProducts = async () => {
        try {
            // Fetch the selected products for the shopkeeper
            const response = await fetch(`http://192.168.29.67:3000/api/v1/shopkeeperProducts/myProducts/${shopkeeperPhoneNumber}`);
            if (response.ok) {
                const { data } = await response.json();
                
                // Group the products by category
                const groupedCategories = groupProductsByCategory(data);
                setCategories(groupedCategories);
            } else {
                console.error('Failed to fetch selected products:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching selected products:', error);
        }
    };

    const groupProductsByCategory = (products) => {
        const categoryMap = {};
        products.forEach(product => {
            if (!categoryMap[product.main_category]) {
                categoryMap[product.main_category] = [];
            }
            categoryMap[product.main_category].push(product);
        });
        return Object.keys(categoryMap).map(category => ({
            main_category: category,
            products: categoryMap[category]
        }));
    };

    const renderCategory = ({ item, index }) => (
        <View style={[styles.categoryWrapper, index % 2 === 1 ? styles.rightMargin : null]}>
            <TouchableOpacity
                style={styles.categoryContainer}
                onPress={() => navigation.navigate('CategoryDetails', { category: item, shopkeeperPhoneNumber, userType, shopkeeperName, shopID })}
            >
                <Text style={styles.categoryName}>{item.main_category}</Text>
            </TouchableOpacity>
            <Text style={styles.shopID}>{shopID}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.main_category}
                numColumns={2}
                contentContainerStyle={styles.contentContainer}
            />
        </View>
    );
};

const { width } = Dimensions.get('window');
const itemWidth = (width - 32) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
    },
    contentContainer: {
        alignItems: 'center',
    },
    categoryWrapper: {
        marginBottom: 16,
        width: itemWidth,
        marginHorizontal: 4,
        marginVertical: 8,
        alignItems: 'center',
    },
    categoryContainer: {
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        width: '100%',
    },
    categoryName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    shopID: {
        marginTop: 8,
        fontSize: 16,
        color: '#666',
    },
    rightMargin: {
        marginRight: 0,
    },
});

export default ShopkeeperMyProducts;
