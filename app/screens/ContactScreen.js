import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    ScrollView,
    StyleSheet,
    useWindowDimensions,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Pressable,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import API_BASE_URL from './config';

const ContactUsScreen = () => {
    const [formData, setFormData] = useState({
        contactFullName: '',
        contactEmail: '',
        contactPhoneNumber: '',
        contactSubject: '',
        contactMessage: ''
    });

    const { width } = useWindowDimensions();
    const isLargeScreen = width > 600;
    const navigation = useNavigation();

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handleHomePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const handleHomePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (!formData.contactFullName || !formData.contactEmail || !formData.contactMessage) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/contact/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                Alert.alert('Success', 'Your message has been sent successfully!');
                navigation.navigate('Home');

                setFormData({
                    contactFullName: '',
                    contactEmail: '',
                    contactPhoneNumber: '',
                    contactSubject: '',
                    contactMessage: ''
                });
            } else {
                Alert.alert('Error', 'Failed to send your message. Please try again later.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoiding}
            >
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    {/* Header with Home Button */}
                    <View style={styles.headerContainer}>
                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <TouchableOpacity 
                                onPressIn={handleHomePressIn}
                                onPressOut={handleHomePressOut}
                                onPress={() => navigation.navigate('Home')}
                                style={styles.homeButton}
                            >
                                <Ionicons name="home" size={24} color="#fff" />
                            </TouchableOpacity>
                        </Animated.View>
                        <Text style={styles.header}>Contact Us</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Mail Icon */}
                    <View style={styles.iconContainer}>
                        <Ionicons name="mail-open" size={60} color="#4CAF50" />
                    </View>

                    {/* Subheader */}
                    <Text style={styles.subHeader}>
                        {`We'd love to hear from you!`}
                    </Text>

                    {/* Form Inputs */}
                    <View style={isLargeScreen ? styles.row : { width: '100%' }}>
                        <TextInput
                            style={[styles.input, isLargeScreen && styles.halfInput]}
                            placeholder="Full Name *"
                            placeholderTextColor="#888"
                            value={formData.contactFullName}
                            onChangeText={(value) => handleChange('contactFullName', value)}
                        />
                        <TextInput
                            style={[styles.input, isLargeScreen && styles.halfInput]}
                            placeholder="Email *"
                            placeholderTextColor="#888"
                            keyboardType="email-address"
                            value={formData.contactEmail}
                            onChangeText={(value) => handleChange('contactEmail', value)}
                        />
                    </View>

                    <View style={isLargeScreen ? styles.row : { width: '100%' }}>
                        <TextInput
                            style={[styles.input, isLargeScreen && styles.halfInput]}
                            placeholder="Phone Number"
                            placeholderTextColor="#888"
                            keyboardType="phone-pad"
                            value={formData.contactPhoneNumber}
                            onChangeText={(value) => handleChange('contactPhoneNumber', value)}
                        />
                        <TextInput
                            style={[styles.input, isLargeScreen && styles.halfInput]}
                            placeholder="Subject"
                            placeholderTextColor="#888"
                            value={formData.contactSubject}
                            onChangeText={(value) => handleChange('contactSubject', value)}
                        />
                    </View>

                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Your Message *"
                        placeholderTextColor="#888"
                        multiline
                        numberOfLines={4}
                        value={formData.contactMessage}
                        onChangeText={(value) => handleChange('contactMessage', value)}
                    />

                    {/* Submit Button */}
                    <Pressable
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={handleSubmit}
                        style={{ width: '100%', marginTop: 10 }}
                    >
                        <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
                            <Text style={styles.buttonText}>Send Message</Text>
                            <Ionicons name="send" size={20} color="#fff" style={styles.sendIcon} />
                        </Animated.View>
                    </Pressable>

                    {/* Contact Information */}
                    <View style={styles.contactInfo}>
                        <View style={styles.contactItem}>
                            <Ionicons name="mail" size={20} color="#4CAF50" />
                            <Text style={styles.contactText}>shafin.ahmed03@northsouth.edu</Text>
                        </View>
                        <View style={styles.contactItem}>
                            <Ionicons name="call" size={20} color="#4CAF50" />
                            <Text style={styles.contactText}>+880 1883915655</Text>
                        </View>
                        <View style={styles.contactItem}>
                            <Ionicons name="location" size={20} color="#4CAF50" />
                            <Text style={styles.contactText}>North South University (NSU)</Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    keyboardAvoiding: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 25,
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    homeButton: {
        backgroundColor: '#4CAF50',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    header: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2E7D32',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    subHeader: {
        fontSize: 18,
        color: '#555',
        marginBottom: 30,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        width: '100%',
        marginBottom: 16,
    },
    halfInput: {
        flex: 1,
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 16,
        fontSize: 16,
        color: '#333',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    textArea: {
        height: 150,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    sendIcon: {
        marginLeft: 10,
    },
    contactInfo: {
        marginTop: 30,
        width: '100%',
        padding: 20,
        backgroundColor: '#f1f8e9',
        borderRadius: 12,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    contactText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#555',
    },
});

export default ContactUsScreen;