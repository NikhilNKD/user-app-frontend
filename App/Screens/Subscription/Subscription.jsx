import React, { useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PhonePePaymentSDK from 'react-native-phonepe-pg' 
import Base64 from 'base-64';
import sha256 from 'crypto-js/sha256';

export default function Subscription({ route }) {
    const { selectedSubCategory, selectedSubCategoryId, userType, selectedCategoryType, selectedCategory } = route.params;

    const [environment, setEnvironment] = useState("SANDBOX");
    const [merchantId, setMerchantID] = useState("PGTESTPAYUAT");
    const [appId, setAppID] = useState(null);
    const [enableLogging, setEnableLogging] = useState(true);
    const [data, setData] = useState({
        mobile: "9058206605",  // Static mobile number
        amount: "100",
    });
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const generateTransactionId = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000000);
        const merchantPrefix = "T";
        return `${merchantPrefix}${timestamp}${random}`;
    }

    const submitHandler = () => {
        if (loading) return; // Prevent multiple submissions if already loading

        setLoading(true);
        console.log('Initializing SDK with:', { environment, merchantId, appId, enableLogging });
        PhonePePaymentSDK.init(environment, merchantId, appId, enableLogging)
            .then((res) => {
                console.log('SDK initialized successfully');
                const requestBody = {
                    merchantId: merchantId,
                    merchantTransactionId: generateTransactionId(),
                    merchantUserId: "",
                    callbackUrl: "",
                    amount: data.amount,
                    mobileNumber: data.mobile,
                    paymentInstrument: {
                        type: "PAY_PAGE"
                    }
                };

                console.log('Request body:', requestBody);

                const salt_key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
                const salt_Index = "1";
                const payload = JSON.stringify(requestBody);
                const payload_main = Base64.encode(payload);
                const string = payload_main + "/pg/v1/pay" + salt_key;
                const checksum = sha256(string).toString() + "###" + salt_Index;

                console.log('Payload main:', payload_main);
                console.log('Checksum:', checksum);

                return PhonePePaymentSDK.startTransaction(payload_main, checksum, null, null);
            })
            .then(response => {
                console.log('Transaction started successfully:', response);
            })
            .catch(err => {
                console.error('Error:', err.message || err);
            })
            .finally(() => {
                setLoading(false); // Re-enable the button
                console.log('Transaction process completed, loading state reset');
            });
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/logo.png')} style={styles.logo} />
            <Text style={styles.heading}>Subscription Plan</Text>
            <Text style={styles.price}>₹3650</Text>
            <View style={styles.bulletPoints}>
                <Text style={styles.details}>
                    12 Months + 2 Months FREE {selectedCategoryType} {selectedCategory} {data.mobile}
                </Text>
                <Text style={styles.bullet}>• Per Day Cost Less Than a Cup of Tea</Text>
                <Text style={styles.bullet}>• Get your OWN Online Shop.</Text>
                <Text style={styles.bullet}>• Manage Your Inventory.</Text>
                <Text style={styles.bullet}>• Manage Discounts on Your Fingertips.</Text>
                <Text style={styles.bullet}>• Add or Edit Your Products.</Text>
                <Text style={styles.bullet}>• Manage Billing.</Text>
                <Text style={styles.bullet}>• Manage Your Customers.</Text>
            </View>
            <Button
                title={loading ? "Processing..." : "Pay ₹3650"}
                onPress={submitHandler}
                disabled={loading} // Disable button while processing
                style={styles.button}
            />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10, // Adjust the margin to match the bullet points
    },
    price: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    details: {
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 20, // Align with the bullet points
    },
    bulletPoints: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'left',
    },
    bullet: {
        fontSize: 15,
        marginLeft: 20,
        marginBottom: 5,
        fontWeight: '500',
    },
});
