import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Dimensions, Image,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function OtpScreen2({ route }) {
    const { phoneNumber, userType } = route.params;
    const [otp, setOtp] = useState('');
    const [isCorrectOtp, setIsCorrectOtp] = useState(true);
    const [isResent, setIsResent] = useState(false);
    const navigation = useNavigation();

    const handleOtpChange = (text, index) => {
        let newOtp = otp.split('');
        newOtp[index] = text;
        setOtp(newOtp.join(''));
        setIsCorrectOtp(true);
    };

     
    
    const handleSubmit = async (phoneNumber, otp) => {
        // Log phoneNumber and otp to the console
        console.log('Phone Number:', phoneNumber);
        console.log('OTP:', otp);

        // Perform OTP validation
        try {
            const response = await fetch('https://9c33-49-43-101-167.ngrok-free.app/api/v1/otp/validate-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                // OTP validation successful
                Alert.alert('Success', data.message);
                // Navigate to a different screen or handle success accordingly
                navigation.navigate('Subscription'); // Update this with the appropriate screen name
            } else {
                // OTP validation failed
                Alert.alert('Error', data.message || 'Invalid OTP. Please try again.');
                setIsCorrectOtp(false);
            }
        } catch (error) {
            console.error('An error occurred while validating the OTP:', error);
            Alert.alert('Error', 'An error occurred while validating the OTP.');
        }
    };

    const handleResend = () => {
        setIsResent(true);
        setIsCorrectOtp(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../../../assets/logo.png')}
                    style={styles.logo}
                />
            </View>
            <Text style={styles.heading}>Enter OTP :{userType}</Text>
            <View style={styles.blueBox}>
                <View style={styles.countryCodeContainer}>
                    <Text style={styles.countryCode}>+91</Text>
                </View>
                <TextInput
                    style={[styles.input, { width: '100%' }]}
                    placeholder="10 digits mobile number"
                    keyboardType="phone-pad"
                    value={phoneNumber || ''}
                    editable={false}
                />
            </View>
            <View style={styles.subheadingContainer}>
                <Text style={[styles.subheading, { textAlign: 'left' }]}>Enter the OTP below *</Text>
                <View style={styles.otpMainContainer}>
                    <View style={styles.otpContainer}>
                        {[0, 1, 2, 3 ,4, 5].map((index) => (
                            <TextInput
                                key={index}
                                style={styles.otpInput}
                                placeholder="0"
                                keyboardType="numeric"
                                maxLength={1}
                                value={otp[index]}
                                onChangeText={(text) => handleOtpChange(text, index)}
                            />
                        ))}
                    </View>
                    <TouchableOpacity onPress={handleResend}>
                        <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Submit"
                    onPress={() => handleSubmit(phoneNumber, otp)}
                />
            </View>
            <View style={styles.sentTextContainer}>
                <Text style={[styles.sentText, !isCorrectOtp && styles.errorText]}>
                    {isCorrectOtp ? (isResent ? "We have resent OTP," : "We have sent OTP,") : "Oops! You entered the wrong OTP"}
                </Text>
                {!isCorrectOtp && <Text style={styles.errorText}>Please try again.</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    imageContainer: {
        marginBottom: windowHeight * 0.05, // Adjust margin bottom based on device height
    },
    logo: {
        resizeMode: 'contain',
        width: windowWidth * 0.4, // Adjust width based on device width
        height: windowHeight * 0.2, // Adjust height based on device height
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subheadingContainer: {
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    subheading: {
        fontSize: 16,
        fontWeight: '500',
        color: '#484848',
    },
    otpMainContainer: {
        alignItems: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '40%',
    },
    otpInput: {
        width: '22%',
        height: 30,
        borderWidth: 1,
        borderColor: '#707070',
        textAlign: 'center',
        fontSize: 18,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    resendText: {
        fontSize: 14,
        marginTop: 10,
    },
    sentTextContainer: {
        width: '60%',
        alignItems: 'center',
    },
    sentText: {
        color: 'blue',
        padding: 3,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
    },
    blueBox: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '70%',
        borderWidth: 1,
        marginBottom: 10,
    },
    countryCodeContainer: {
        backgroundColor: '#007bff',
        paddingHorizontal: 8,
        paddingVertical: 10,
    },
    countryCode: {
        color: '#fff',
        fontSize: 18,
    },
    input: {
        flex: 1,
        height: 39,
        color: '#707070',
        fontSize: 18,
        marginLeft: 10,
    },
    buttonContainer: {
        width: '50%',
        marginBottom: 20,
    },
});
