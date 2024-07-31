import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

export default function MyTotalCommission({ route }) {
    const [totalCommission, setTotalCommission] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state
    const { phoneNumber } = route.params; // Assuming you retrieve the mobile number from route params

    useEffect(() => {
        // Fetch total commission data for the logged-in user from the backend
        const fetchTotalCommission = async () => {
            try {
                const response = await fetch(`http://192.168.29.67:3000/api/v1/sales/my-total-commission?phoneNumber=${phoneNumber}`);
                if (response.ok) {
                    const data = await response.json();
                    const commission = Number(data.totalCommission);
                    setTotalCommission(commission);
                } else {
                    // Alert only if fetch was unsuccessful
                    Alert.alert('Error', 'Failed to fetch total commission. Please try again later.');
                }
            } catch (error) {
                // Alert only if there was an error in fetching data
                Alert.alert('Error', 'Error fetching total commission. Please try again later.');
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };

        fetchTotalCommission();
    }, [phoneNumber]);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Total Commission</Text>
            {loading ? (
                <Text style={styles.noData}>Loading...</Text>
            ) : totalCommission !== null ? (
                totalCommission > 0 ? (
                    <Text style={styles.commissionAmount}>
                        ₹{totalCommission.toFixed(2)}
                    </Text>
                ) : (
                    <Text style={styles.noData}>No commission allotted</Text>
                )
            ) : (
                <Text style={styles.noData}>No data available</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    commissionAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#4caf50',
    },
    noData: {
        fontSize: 18,
        color: '#888',
    },
});
