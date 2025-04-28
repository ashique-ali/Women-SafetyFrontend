import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Image
                    source={require('../assets/Images/logos.png')}
                    style={styles.logo}
                />
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity>
                    <Text style={styles.bottomText}>Sign Up / Login with mobile number</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PhoneVerification')}>
                    <Text style={styles.buttonText}>Let's Go</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        color: '#E91E63',
        fontWeight: 'bold',
        marginTop: 20,
    },
    bottomContainer: {
        alignItems: 'center',
        marginBottom: 100,
    },
    bottomText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#B76DF5',
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
