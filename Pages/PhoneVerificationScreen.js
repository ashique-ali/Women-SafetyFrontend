import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import styles from './PhoneVerificationScreen.style';
import Config from "../Config/config";

export default function PhoneVerificationScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const baseUrl = Config.baseUrl;

    const sendVerificationEmail = async () => {
        setLoading(true);
        try {
            if (email.trim() === '') {
                Alert.alert('Please enter an email address');
                setLoading(false);
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                Alert.alert('Invalid email format');
                setLoading(false);
                return;
            }
            const response = await axios.post(`${baseUrl}/send-otp`, { email });
            if (response.status === 200) {
                Alert.alert('OTP Sent', 'A verification code has been sent to your email');
                navigation.navigate('Verification', { userEmail: email });
                setEmail(null)
            } else {
                Alert.alert('Failed to Send OTP', response.data.message || 'An error occurred');
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error sending OTP:', error);
            Alert.alert('Error', 'An error occurred while sending OTP');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logoText}>I'M SAFE <Text style={styles.betaText}>Beta</Text></Text>
            <Text style={styles.title}>Enter your Email for{'\n'}Verification</Text>
            <Text style={styles.subtitle}>
                This email will be used for all app related {'\n'} communication.
                You will receive an email{'\n'}with a code for verification.
            </Text>

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={sendVerificationEmail}>
                <Text style={styles.buttonText}>{loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    'Send Otp'
                )}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
