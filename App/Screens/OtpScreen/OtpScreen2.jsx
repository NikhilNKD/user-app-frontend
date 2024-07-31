//import React, { useState, useRef } from 'react';
//import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Dimensions, Image } from 'react-native';
//import { useNavigation } from '@react-navigation/native';

//const windowWidth = Dimensions.get('window').width;
//const windowHeight = Dimensions.get('window').height;

//export default function OtpScreen2({ route }) {
//    const { phoneNumber, userType } = route.params;
//    const [otp, setOtp] = useState(Array(6).fill(''));
//    const [isCorrectOtp, setIsCorrectOtp] = useState(true);
//    const [isResent, setIsResent] = useState(false);
//    const navigation = useNavigation();
//    const otpInputs = useRef([]);

//    const handleOtpChange = (text, index) => {
//        let newOtp = [...otp];
//        newOtp[index] = text;
//        setOtp(newOtp);

//        // Move to the next input if a digit is entered
//        if (text.length === 1 && index < 5) {
//            otpInputs.current[index + 1].focus();
//        }
//        // Move to the previous input if backspace is pressed
//        if (text.length === 0 && index > 0) {
//            otpInputs.current[index - 1].focus();
//        }
//        setIsCorrectOtp(true);
//    };

//    const handleSubmit = async () => {
//        try {
//            const otpString = otp.join('');
//            console.log('Submitting OTP:', { phoneNumber, otp: otpString });

//            // Check if the entered OTP is '123456'
//            if (otpString !== '123456') {
//                setIsCorrectOtp(false);
//                return;
//            }

//            setIsCorrectOtp(true);
//            console.log('Performing Login:', { phoneNumber, userType });

//            const loginResponse = await fetch('http://192.168.29.67:3000/api/v1/auth/login', {
//                method: 'POST',
//                headers: {
//                    'Content-Type': 'application/json',
//                },
//                body: JSON.stringify({ phoneNumber, userType, token: 'dummy-token' }), // Using a dummy token
//            });

//            if (!loginResponse.ok) {
//                const errorText = await loginResponse.text();
//                throw new Error(`Server Error: ${errorText}`);
//            }

//            const loginData = await loginResponse.json();
//            console.log('Login Response:', loginData);

//            if (loginData.status === 'unregistered') {
//                navigation.navigate('Register', { phoneNumber, userType });
//                console.log('Navigating to Register:', { phoneNumber, userType });
//            } else if (userType === 'shopkeeper') {
//                const { shopkeeperType, selectedCategory } = loginData;
//                if (shopkeeperType === 'service') {
//                    navigation.navigate('ShopkeeperHome', { phoneNumber, userType: 'shopkeeper', shopkeeperType, selectedCategory });
//                    console.log('Navigating to ShopkeeperHome:', { phoneNumber, userType, shopkeeperType, selectedCategory });
//                } else if (shopkeeperType === 'product') {
//                    navigation.navigate('ShopkeeperProductHome', { phoneNumber, userType: 'shopkeeper', shopkeeperType, selectedCategory });
//                    console.log('Navigating to ShopkeeperProductHome:', { phoneNumber, userType, shopkeeperType, selectedCategory });
//                }
//            } else if (userType === 'customer') {
//                navigation.navigate('CustomerHomePage', { phoneNumber, userType });
//                console.log('Navigating to CustomerHomePage:', { phoneNumber, userType });
//            }
//        } catch (error) {
//            console.error('Error:', error.message);
//        }
//    };

//    const handleResend = () => {
//        setIsResent(true);
//        setIsCorrectOtp(true);
//    };

//    return (
//        <View style={styles.container}>
//            <View style={styles.imageContainer}>
//                <Image
//                    source={require('../../../assets/logo.png')}
//                    style={styles.logo}
//                />
//            </View>
//            <Text style={styles.heading}>Enter OTP :{userType}</Text>
//            <View style={styles.blueBox}>
//                <View style={styles.countryCodeContainer}>
//                    <Text style={styles.countryCode}>+91</Text>
//                </View>
//                <TextInput
//                    style={[styles.input, { width: '100%' }]}
//                    placeholder="10 digits mobile number"
//                    keyboardType="phone-pad"
//                    value={phoneNumber || ''}
//                    editable={false}
//                />
//            </View>
//            <View style={styles.subheadingContainer}>
//                <Text style={[styles.subheading, { textAlign: 'left' }]}>Enter the OTP below *</Text>
//                <View style={styles.otpMainContainer}>
//                    <View style={styles.otpContainer}>
//                        {[0, 1, 2, 3, 4, 5].map((index) => (
//                            <TextInput
//                                key={index}
//                                ref={el => otpInputs.current[index] = el}
//                                style={styles.otpInput}
//                                placeholder="0"
//                                keyboardType="numeric"
//                                maxLength={1}
//                                value={otp[index]}
//                                onChangeText={(text) => handleOtpChange(text, index)}
//                            />
//                        ))}
//                    </View>
//                    <TouchableOpacity onPress={handleResend}>
//                        <Text style={styles.resendText}>Resend OTP</Text>
//                    </TouchableOpacity>
//                </View>
//            </View>
//            <View style={styles.buttonContainer}>
//                <Button
//                    title="Submit"
//                    onPress={handleSubmit}
//                />
//            </View>
//            <View style={styles.sentTextContainer}>
//                <Text style={[styles.sentText, !isCorrectOtp && styles.errorText]}>
//                    {isCorrectOtp ? (isResent ? "We have resent OTP," : "We have sent OTP,") : "Oops! You entered the wrong OTP"}
//                </Text>
//                {!isCorrectOtp && <Text style={styles.errorText}>Please try again.</Text>}
//            </View>
//        </View>
//    );
//}

//const styles = StyleSheet.create({
//    container: {
//        flex: 1,
//        justifyContent: 'center',
//        alignItems: 'center',
//        padding: 20,
//    },
//    imageContainer: {
//        marginBottom: windowHeight * 0.05,
//    },
//    logo: {
//        resizeMode: 'contain',
//        width: windowWidth * 0.4,
//        height: windowHeight * 0.2,
//    },
//    heading: {
//        fontSize: 26,
//        fontWeight: 'bold',
//        textAlign: 'center',
//        marginBottom: 10,
//    },
//    subheadingContainer: {
//        alignItems: 'flex-start',
//        marginBottom: 10,
//    },
//    subheading: {
//        fontSize: 16,
//        fontWeight: '500',
//        color: '#484848',
//    },
//    otpMainContainer: {
//        alignItems: 'center',
//    },
//    otpContainer: {
//        flexDirection: 'row',
//        justifyContent: 'center',
//        width: '70%',
//    },
//    otpInput: {
//        width: '15%',
//        height: 30,
//        borderWidth: 1,
//        borderColor: '#707070',
//        textAlign: 'center',
//        fontSize: 18,
//        borderRadius: 5,
//        marginHorizontal: 5,
//    },
//    resendText: {
//        fontSize: 14,
//        marginTop: 10,
//    },
//    sentTextContainer: {
//        width: '60%',
//        alignItems: 'center',
//    },
//    sentText: {
//        color: 'blue',
//        padding: 3,
//        textAlign: 'center',
//    },
//    errorText: {
//        color: 'red',
//    },
//    blueBox: {
//        flexDirection: 'row',
//        alignItems: 'center',
//        width: '70%',
//        borderWidth: 1,
//        marginBottom: 10,
//    },
//    countryCodeContainer: {
//        backgroundColor: '#007bff',
//        paddingHorizontal: 8,
//        paddingVertical: 10,
//    },
//    countryCode: {
//        color: '#fff',
//        fontSize: 18,
//    },
//    input: {
//        flex: 1,
//        height: 39,
//        paddingHorizontal: 8,
//        fontSize: 18,
//    },
//    buttonContainer: {
//        width: '70%',
//        marginTop: 20,
//    },
//});
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function OtpScreen2({ route }) {
    const { phoneNumber, userType } = route.params;
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [isCorrectOtp, setIsCorrectOtp] = useState(true);
    const [isResent, setIsResent] = useState(false);
    const navigation = useNavigation();
    const otpInputs = useRef([]);
    const handleOtpChange = (text, index) => {
        let newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        // Move to the next input if a digit is entered
        if (text.length === 1 && index < 5) {
            otpInputs.current[index + 1].focus();
        }
        // Move to the previous input if backspace is pressed
        if (text.length === 0 && index > 0) {
            otpInputs.current[index - 1].focus();
        }
        setIsCorrectOtp(true);
    };
    const handleSubmit = async () => {
        try {
            const otpString = otp.join('');
            console.log('Submitting OTP Validation:', { phoneNumber, otp: otpString });
            const response = await fetch('http://192.168.29.67:3000/api/v1/otp/validate-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber, otp: otpString }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server Error: ${errorText}`);
            }
            const data = await response.json();
            console.log('OTP Validation Response:', data);
            if (data.message === 'Invalid or expired OTP') {
                setIsCorrectOtp(false);
                return;
            }
            setIsCorrectOtp(true);
            const { token, phoneNumber: responsePhoneNumber } = data;
            console.log('OTP Validation Token:', token);
            console.log('Phone Number from OTP Validation Response:', responsePhoneNumber);
            if (phoneNumber !== responsePhoneNumber) {
                console.error('Phone number mismatch:', { phoneNumber, responsePhoneNumber });
                return;
            }
            console.log('Performing Login:', { phoneNumber, userType, token });
            const loginResponse = await fetch('http://192.168.29.67:3000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber, userType, token }),
            });
            if (!loginResponse.ok) {
                const errorText = await loginResponse.text();
                throw new Error(`Server Error: ${errorText}`);
            }
            const loginData = await loginResponse.json();
            console.log('Login Response:', loginData);
            if (loginData.status === 'unregistered') {
                navigation.navigate('Register', { phoneNumber, userType });
                console.log('Navigating to Register:', { phoneNumber, userType });
            } else if (userType === 'shopkeeper') {
                const { shopkeeperType, selectedCategory } = loginData;
                if (shopkeeperType === 'service') {
                    navigation.navigate('ShopkeeperHome', { phoneNumber, userType: 'shopkeeper', shopkeeperType, selectedCategory });
                    console.log('Navigating to ShopkeeperHome:', { phoneNumber, userType, shopkeeperType, selectedCategory });
                } else if (shopkeeperType === 'product') {
                    navigation.navigate('ShopkeeperProductHome', { phoneNumber, userType: 'shopkeeper', shopkeeperType, selectedCategory });
                    console.log('Navigating to ShopkeeperProductHome:', { phoneNumber, userType, shopkeeperType, selectedCategory });
                }
            } else if (userType === 'customer') {
                navigation.navigate('CustomerHomePage', { phoneNumber, userType });
                console.log('Navigating to CustomerHomePage:', { phoneNumber, userType });
            }
        } catch (error) {
            console.error('Error:', error.message);
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
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <TextInput
                                key={index}
                                ref={el => otpInputs.current[index] = el}
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
                    onPress={handleSubmit}
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
        marginBottom: windowHeight * 0.05,
    },
    logo: {
        resizeMode: 'contain',
        width: windowWidth * 0.4,
        height: windowHeight * 0.2,
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
        width: '70%',
    },
    otpInput: {
        width: '15%',
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
        paddingHorizontal: 8,
        fontSize: 18,
    },
    buttonContainer: {
        width: '70%',
        marginTop: 20,
    },
});
