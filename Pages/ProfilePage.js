import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import Config from '../Config/config';

const ProfilePage = () => {
    const baseUrl = Config.baseUrl;
    const [name, setName] = useState('');
    const [selectedGender, setSelectedGender] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const genders = ['Male', 'Female', 'Other'];

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

    const handleSubmit = async () => {
        setLoading(true);
        if (!name) {
            alert('Please enter your name');
            setLoading(false);
            return;
        }
        if (!selectedGender) {
            alert("Please select your gender");
        }

        if (!profileImage) {
            alert("Please upload a profile picture");
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('gender', selectedGender);
            formData.append('profileImage', {
                uri: profileImage,
                name: 'profile.jpg',
                type: 'image/jpeg'
            });
            const response = await axios.post(`${baseUrl}/submit-profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data.message);
            navigation.navigate('Location', {
                imageUrl: response.data.imageUrl,
                name: name,
                gender: selectedGender
            });

            setName('');
            setSelectedGender(null);
            // setProfileImage(null);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error submitting profile:', error.response?.data || error.message);
            alert('Submission failed');
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
                            source={require('../assets/Images/previewlogo.png')}
                        />
                    </View>
                )}
            </TouchableOpacity>

            <Text style={styles.bottomText}>Profile Picture is mandatory and this{'\n'}cannot be changed</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your Name"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <Text style={styles.label}>Gender</Text>
            <View style={styles.radioRow}>
                {genders.map((gender, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.radioContainer}
                        onPress={() => setSelectedGender(gender)}
                    >
                        <View style={styles.outerCircle}>
                            {selectedGender === gender && <View style={styles.innerCircle} />}
                        </View>
                        <Text style={styles.radioText}>{gender}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                    {loading ? <ActivityIndicator size="small" color="#fff" /> : 'Submit'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfilePage;

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
    defaultImage: {
        width: 120,
        height: 120,
        borderRadius: 60
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
        borderRadius: 60,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    bottomText: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center'
    },
    button: {
        backgroundColor: '#9C27B0',
        marginTop: 30,
        paddingVertical: 12,
        paddingHorizontal: 35,
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 22,
        letterSpacing: 1,
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
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        marginTop: 20,
        color: '#333',
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
    radioRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    outerCircle: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#555',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    innerCircle: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#555',
    },
    radioText: {
        fontSize: 16,
        color: '#333',
    },
});
