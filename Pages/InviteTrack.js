import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../Config/config';

const InviteTrack = ({ navigation }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const baseUrl = Config.baseUrl;

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const sendInvite = async () => {
        console.log("Send invite :::");
        if (!name) {
            Alert.alert('Error', 'Please enter an email address.');
            return;
        }
        setLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                Alert.alert('Permission Denied', 'Please allow location access.');
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            console.log("Location ::>>>", location);
            const { latitude, longitude } = location.coords;
            const apiKey = "ad1f4ec929bb41daada78d52119d4e40";
            const res = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
            );
            const fullAddress = res.data.results[0]?.formatted;

            if (!fullAddress) {
                Alert.alert('Error', 'Unable to fetch address.');
                setLoading(false);
                return;
            }
            await AsyncStorage.setItem('invitedEmail', name);
            await AsyncStorage.setItem('userLocation', fullAddress);
            const response = await axios.post(`${baseUrl}/emergency`, {
                message: 'Please help.. I am in Danger',
                address: fullAddress,
                email: name
            }
            );
            console.log("Invite sent: ", response);
            Alert.alert('Success', `Invitation sent to ${'\n'} ${name}`);
            navigation.navigate('Congractulation');
        } catch (error) {
            console.log("Error in invite:", error);
            Alert.alert('Error', 'Failed to send invitation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logoText}>I'M SAFE <Text style={styles.betaText}>Beta</Text></Text>
            <TouchableOpacity onPress={pickImage}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Image style={styles.defaultImage}
                            source={require('../assets/Images/Invitelogo.png')}
                        />
                    </View>
                )}
            </TouchableOpacity>

            <Text style={styles.bottomText}>Invite Trusted Contact</Text>

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Email"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <Text style={styles.title}>Your Trusted Contacts will receive an SMS notification to install I'm Safe.</Text>

            <TouchableOpacity style={styles.button} onPress={sendInvite}>
                <Text style={styles.buttonText}>
                    {loading ? <ActivityIndicator size="small" color="#fff" /> : 'Send Invite'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default InviteTrack;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 50,
    },
    logoText: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E91E63',
    },
    betaText: {
        fontSize: 14,
        fontWeight: 'normal',
        color: 'grey',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginVertical: 20,
    },
    imagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 120,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        borderColor: '#ddd'
    },
    defaultImage: {
        width: 80,
        height: 80,
        borderRadius: 60,
    },
    bottomText: {
        fontSize: 18,
        color: '#3e3e3e',
        fontWeight: 600,
        textAlign: 'center',
    },
    title: {
        fontSize: 16,
        color: '#3e3e3e',
        marginTop: 20,
        textAlign: 'center',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        width: '100%',
    },
    input: {
        fontSize: 16,
        flex: 1,
        paddingVertical: 10,
    },
    button: {
        backgroundColor: '#9C27B0',
        marginTop: 30,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        letterSpacing: 1,
    },
});
