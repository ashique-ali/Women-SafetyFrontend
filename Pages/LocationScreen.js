import { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../Config/config';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const LocationScreen = ({ navigation, route }) => {
    const { imageUrl } = route.params;
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const baseUrl = Config.baseUrl;

    useEffect(() => {
        const loadSavedAddress = async () => {
            try {
                const savedAddress = await AsyncStorage.getItem('userLocation');
                if (savedAddress) {
                    setAddress(savedAddress);
                    console.log('Loaded saved address:', savedAddress);
                }
            } catch (error) {
                console.error('Error loading saved address:', error);
            }
        };

        loadSavedAddress();
    }, []);

    const getCurrentLocation = async () => {
        setLoading(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                Alert.alert('Permission Denied', 'Please allow location access.');
                setLoading(false);
                return;
            }

            const isLocationEnabled = await Location.hasServicesEnabledAsync();
            if (!isLocationEnabled) {
                Alert.alert("Location Disabled", "Please enable location services.");
                setLoading(false);
                return;
            }

            // Wait 1 second to avoid crash on some devices
            await new Promise(resolve => setTimeout(resolve, 1000));

            const currentLocation = await Location.getCurrentPositionAsync({});
            if (!currentLocation?.coords) {
                Alert.alert("Error", "Location data is unavailable.");
                setLoading(false);
                return;
            }

            const { latitude, longitude } = currentLocation.coords;
            setLocation({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            const apiKey = "ad1f4ec929bb41daada78d52119d4e40";
            const res = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
            );

            const fullAddress = res.data.results?.[0]?.formatted;
            if (fullAddress) {
                setAddress(fullAddress);
                await AsyncStorage.setItem('userLocation', fullAddress);
                console.log('Location saved to AsyncStorage');
            } else {
                Alert.alert('Error', 'Unable to fetch address.');
            }
        } catch (err) {
            console.error('Failed to fetch address:', err);
            Alert.alert('Error', 'Failed to fetch location.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const AddPeople = () => {
        navigation.navigate('track');
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#9C27B0" />
                    <Text style={styles.loadingText}>Fetching your Current location...</Text>
                </View>
            ) : location ? (
                <MapView
                    style={styles.map}
                    region={location}
                    showsUserLocation={true}
                >
                    <Marker coordinate={location} title="Your Location" />
                </MapView>
            ) : (
                <Text style={styles.errorText}>Unable to fetch location</Text>
            )}

            <View style={styles.profileContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.profileImage}
                    alt='Logo'
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.profileText}>Add at least one trusted contact</Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={AddPeople}>
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.trackButton}>
                <>
                    <Icon name="location-on" size={30} color="#fff" style={styles.iconStyle} />
                    <Text style={styles.trackButtonText}>Track Me</Text>
                </>
            </TouchableOpacity>
        </View>
    );
};

export default LocationScreen;

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#9C27B0',
        fontWeight: 'bold',
    },
    errorText: {
        flex: 1,
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: 'red',
    },
    container: {
        flex: 1,
        position: 'relative',
    },
    map: {
        width: width,
        height: height,
    },
    profileContainer: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    profileText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    addButton: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#333',
        fontWeight: '600',
        fontSize: 14,
    },
    trackButton: {
        position: 'absolute',
        bottom: 20,
        height: 100,
        width: 100,
        alignSelf: 'center',
        backgroundColor: '#fe7eb2',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 6,
        borderColor: '#fff',
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 1.3,
        shadowRadius: 5,
        elevation: 8,
    },
    iconStyle: {
        position: 'absolute',
        top: 5,
    },
    trackButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
});
