import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from 'react-native';
import Config from '../Config/config';

const VerificationScreen = ({ navigation, route }) => {
    const baseUrl = Config.baseUrl;
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputsRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const { userEmail } = route.params;
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        startTimer();
    }, []);

    const startTimer = () => {
        setTimer(30);
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
    };

    const handleChange = (text, index) => {
        if (/^\d$/.test(text)) {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);
            if (index < 3) {
                inputsRef.current[index + 1].focus();
            }
        } else if (text === '') {
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const verifyOtp = async () => {
        const enteredOtp = otp.join('');
        const email = userEmail;
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp: enteredOtp }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data?.message);
                navigation.navigate('profile');
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert('Verification failed. Try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        if (timer > 0) return;

        setResendLoading(true);
        try {
            const response = await fetch(`${baseUrl}/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data?.message);
                startTimer();
            } else {
                alert(data.message || 'Failed to resend OTP.');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logoText}>
                I'M SAFE <Text style={styles.betaText}>Beta</Text>
            </Text>
            <Image
                source={require('../assets/Images/girl.png')}
                style={{ width: 200, height: 200, resizeMode: 'contain' }}
            />
            <Text style={styles.title}>Enter Access Code</Text>
            <Text style={styles.subtitle}>
                Please enter the four digit{'\n'}Access code sent to {'\n'} your Email
            </Text>

            <View style={styles.inputContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        style={styles.input}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        ref={(ref) => inputsRef.current[index] = ref}
                    />
                ))}
            </View>

            {/* 🔥 Timer Text */}
            {timer > 0 ? (
                <Text style={{ marginTop: 10, color: '#C71585' }}>
                    Resend available in {timer} sec
                </Text>
            ) : (
                <TouchableOpacity style={styles.resendButton} onPress={resendOtp}>
                    {resendLoading ? (
                        <ActivityIndicator size="small" color="#C71585" />
                    ) : (
                        <Text style={styles.resendText}>↻ Resend</Text>
                    )}
                </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.verifyButton} onPress={verifyOtp}>
                <Text style={styles.verifyText}>{loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    'Verify Otp'
                )}
                </Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 60,
        justifyContent: 'center'
    },
    logoText: {
        fontSize: 20,
        color: '#C71585',
        fontWeight: 'bold',
    },
    betaText: {
        fontSize: 14,
        fontWeight: 'normal',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginVertical: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
        marginVertical: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        gap: 10,
        width: '70%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        width: 50,
        height: 50,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 18,
    },
    resendButton: {
        marginTop: 20,
    },
    resendText: {
        color: '#C71585',
        fontWeight: '500',
    },
    verifyButton: {
        backgroundColor: '#B76DF5',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 30,
        marginTop: 30,
    },
    verifyText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default VerificationScreen;
