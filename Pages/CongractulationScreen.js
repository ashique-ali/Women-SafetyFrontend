import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
const CongractulationScreen = ({ navigation }) => {

    const ContinueHandler = () => {
        navigation.navigate('HomePage');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>I'M SAFE</Text>
            <View style={styles.imagePlaceholder}>
                <Image style={styles.defaultImage}
                    source={require('../assets/Images/congra.png')}
                />
            </View>
            <Text style={styles.message}>
                We are glad that you are back to safety. {'\n'} You can view the files captured in SOS {'\n'} history module in profile
            </Text>
            <TouchableOpacity style={styles.button} onPress={ContinueHandler}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};
export default CongractulationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#f7d2e1',
    },
    defaultImage: {
        width: '350',
        height: '500',
    },
    header: {
        fontSize: 18,
        color: '#FF5A5F',
        fontWeight: 'bold',
        marginTop: 0,
        backgroundColor: '#fff',
        width: '500',
        padding: '15',
        textAlign: 'center'
    },
    congrats: {
        fontSize: 28,
        color: '#FF5A5F',
        fontWeight: 'bold',
        marginTop: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: 20,
    },
    message: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#9C27B0',
        paddingVertical: 14,
        paddingHorizontal: 50,
        borderRadius: 30,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});