import React, { useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PhonePePaymentSDK from 'react-native-phonepe-pg';
import Base64 from 'react-native-base64';
import sha256 from 'crypto-js/sha256'; // Use crypto-js for sha256

export default function Subscription({ route }) {
     

    const [environment, setEnvironment] = useState("SANDBOX");
    const [merchantId, setMerchantID] = useState("PGTESTPAYUAT86");
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
                    amount: (data.amount * 100), // amount should be in paisa
                    mobileNumber: data.mobile,
                    callbackUrl: "",
                    paymentInstrument: {
                        type: "PAY_PAGE",
                        //targetApp: "com.phonepe.app"
                    },
                    //deviceContext: { deviceOS: "ANDROID" }
                };

                console.log('Request body:', requestBody);

                const salt_key = "96434309-7796-489d-8924-ab56988a6076";
                const salt_Index = 1;
                const payload = JSON.stringify(requestBody);
                const payload_main = Base64.encode(payload);
                const string = payload_main + "/pg/v1/pay" + salt_key;
                const checksum = sha256(string).toString() + "###" + salt_Index;

                console.log('Payload main:', payload_main);
                console.log('Checksum:', checksum);

                PhonePePaymentSDK.startTransaction(payload_main, checksum, null, null)
                    .then((resp) => {
                        console.log('Transaction started successfully:', resp);
                    })
                    .catch((err) => {
                        console.error('Error in transaction:', err.message || err);
                    });
            })
            .catch(err => {
                console.error('Error initializing SDK:', err.message || err);
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
                    12 Months + 2 Months FREE   {data.mobile}
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
        marginBottom: 10,
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
        marginLeft: 20,
    },
    bulletPoints: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    bullet: {
        fontSize: 15,
        marginLeft: 20,
        marginBottom: 5,
        fontWeight: '500',
    },
});