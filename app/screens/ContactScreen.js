import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet, useWindowDimensions, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';

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

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (!formData.contactFullName || !formData.contactEmail || !formData.contactMessage) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        try {
            const response = await fetch('http://192.168.0.106:8000/api/contact/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                Alert.alert('Success', 'Your message has been sent successfully!');
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
                    <Text style={styles.header}>Contact Us</Text>

                    <View style={isLargeScreen ? styles.row : {}}>
                        <TextInput
                            style={[styles.input, isLargeScreen && styles.halfInput]}
                            placeholder="Full Name"
                            placeholderTextColor="#4F7942"
                            value={formData.contactFullName}
                            onChangeText={(value) => handleChange('contactFullName', value)}
                        />
                        <TextInput
                            style={[styles.input, isLargeScreen && styles.halfInput]}
                            placeholder="Email"
                            placeholderTextColor="#4F7942"
                            value={formData.contactEmail}
                            onChangeText={(value) => handleChange('contactEmail', value)}
                        />
                    </View>

                    <View style={isLargeScreen ? styles.row : {}}>
                        <TextInput
                            style={[styles.input, isLargeScreen && styles.halfInput]}
                            placeholder="Phone Number"
                            placeholderTextColor="#4F7942"
                            value={formData.contactPhoneNumber}
                            onChangeText={(value) => handleChange('contactPhoneNumber', value)}
                        />
                        <TextInput
                            style={[styles.input, isLargeScreen && styles.halfInput]}
                            placeholder="Subject"
                            placeholderTextColor="#4F7942"
                            value={formData.contactSubject}
                            onChangeText={(value) => handleChange('contactSubject', value)}
                        />
                    </View>

                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Your Message"
                        placeholderTextColor="#4F7942"
                        multiline
                        numberOfLines={4}
                        value={formData.contactMessage}
                        onChangeText={(value) => handleChange('contactMessage', value)}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Send Message</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#E8F5E9' },
    keyboardAvoiding: { flex: 1 },
    contentContainer: { flexGrow: 1, justifyContent: 'center', padding: 20, alignItems: 'center' },
    header: { fontSize: 32, fontWeight: 'bold', color: '#2E7D32', marginBottom: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    halfInput: { width: '48%' },
    input: { height: 50, borderColor: '#66BB6A', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, backgroundColor: '#FFFFFF', color: '#2E7D32', marginBottom: 10 },
    textArea: { height: 120, textAlignVertical: 'top' },
    button: { backgroundColor: '#2E7D32', padding: 15, borderRadius: 10, alignItems: 'center', width: '100%', marginTop: 10 },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});

export default ContactUsScreen;
