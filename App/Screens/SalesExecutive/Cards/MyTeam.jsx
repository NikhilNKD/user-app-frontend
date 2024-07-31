import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';

export default function MyTeam({ route }) {
    const { phoneNumber } = route.params;
    const [teamMembers, setTeamMembers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://192.168.29.67:3000/api/v1/sales/my-team/${phoneNumber}`)
            .then(response => {
                if (response.data.success) {
                    if (response.data.message.length === 0) {
                        Alert.alert('No Team Members', 'No team members found for this phone number.');
                    } else {
                        setTeamMembers(response.data.message);
                    }
                } else {
                    setError(response.data.message);
                    Alert.alert('Error', 'Failed to fetch team members.');
                }
            })
            .catch(error => {
                console.error('Error fetching team members:', error);
                setError('Error fetching team members');
                Alert.alert('Error', 'Error fetching team members. Please try again later.');
            });
    }, [phoneNumber]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>My Team ({phoneNumber})</Text>
            {error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                teamMembers.length > 0 ? (
                    teamMembers.map(member => (
                        <View key={member.phoneNumber} style={styles.memberContainer}>
                            <Text style={styles.memberName}>{member.firstName} {member.lastName}</Text>
                            <Text style={styles.memberInfo}>Mobile: {member.phoneNumber}</Text>
                            <Text style={styles.memberInfo}>Pincode: {member.pincode}</Text>
                            <Text style={styles.memberInfo}>Aadhar: {member.aadhar}</Text>
                            <Text style={styles.memberInfo}>UPI: {member.upi}</Text>
                            <Text style={styles.memberInfo}>Pancard: {member.pancard}</Text>
                            <Text style={styles.memberInfo}>Level: {member.level}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noData}>No team members available</Text>
                )
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    memberContainer: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        width: '100%',
    },
    memberName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    memberInfo: {
        fontSize: 16,
        color: '#555',
        marginVertical: 2,
    },
    noData: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});
