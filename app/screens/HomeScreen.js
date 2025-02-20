import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    StatusBar,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
const HomeScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>SmartEcoCycle</Text>
                </View>

                {/* First Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Recycle anywhere with Smart Ecocycle</Text>
                    <Text style={styles.cardText}>Request a recycler with one tap.</Text>
                    <TextInput style={styles.input} placeholder="Enter Your Address" />
                    <TextInput style={styles.input} placeholder="Select Product Type" />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>See Prices</Text>
                    </TouchableOpacity>
                </View>

                {/* Second Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Recycle when you want, make what you need</Text>
                    <Text style={styles.cardText}>
                        Make money on your schedule with recycling. You can use your own effort or choose a recycler through Smart Ecocycle.
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <Text style={styles.signupText} onPress={() => navigation.navigate("Signup")}>
                        Don’t have an account? <Text style={styles.signupLink}>Sign Up</Text>
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>smartecocycle.com</Text>
                    <View style={styles.footerLinks}>
                        <Text style={styles.footerLink}>About Us</Text>
                        <Text style={styles.footerLink}>Privacy</Text>
                        <Text style={styles.footerLink}>Terms of Service</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#F5F5F5',
    },
    container: {
        padding: 16,
        paddingBottom: 20,
    },
    header: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 10,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    card: {
        backgroundColor: '#E8F5E9',
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#388E3C',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    signupText: {
        marginTop: 10,
        textAlign: 'center',
        color: '#555',
    },
    signupLink: {
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        alignItems: 'center',
    },
    footerText: {
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    footerLinks: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    footerLink: {
        color: '#fff',
        fontSize: 14,
    },
});

export default HomeScreen;
