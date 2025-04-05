import React, { useEffect, useState, useRef} from 'react';
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
    Image,
    Animated,
    Easing,
    Dimensions,
    Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    const navigation = useNavigation();
    
    const [priceModalVisible, setPriceModalVisible] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(100)).current;
    const logoRotate = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(0.95)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const footerOpacity = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideUpAnim, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.back(2)),
                useNativeDriver: true,
            }),
            Animated.spring(logoRotate, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
            Animated.spring(cardScale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
                delay: 300,
            }),
            Animated.timing(footerOpacity, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const logoSpin = logoRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['-15deg', '15deg']
    });

    const onButtonPressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const onButtonPressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.container}>
                {/* Animated Header */}
                <Animated.View 
                    style={[
                        styles.header,
                        { 
                            opacity: fadeAnim,
                            transform: [
                                { translateY: slideUpAnim },
                                { rotate: logoSpin }
                            ] 
                        }
                    ]}
                >
                    <Animated.Image
                        source={require('../assets/logo.jpg')}
                        style={[
                            styles.logo,
                            { 
                                transform: [
                                    { scale: logoRotate.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.8, 1]
                                    }) }
                                ] 
                            }
                        ]}
                    />
                    <Text style={styles.title}>SmartEcoCycle ♻️</Text>
                </Animated.View>

                {/* Floating Cards */}
                <Animated.View 
                    style={[
                        styles.card,
                        { 
                            transform: [
                                { translateY: slideUpAnim },
                                { scale: cardScale }
                            ],
                            opacity: fadeAnim
                        }
                    ]}
                >
                    <View style={styles.cardHeader}>
                        <Ionicons name="location" size={24} color="#2E7D32" />
                        <Text style={styles.cardTitle}>Recycle Anywhere</Text>
                    </View>
                    <Text style={styles.cardText}>Request a recycler with one tap</Text>
                    
                    <View style={styles.inputContainer}>
                        <Ionicons name="map" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Enter Your Address" 
                            placeholderTextColor="#888"
                        />
                    </View>
                    
                    <View style={styles.inputContainer}>
                        <Ionicons name="cube" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Select Product Type" 
                            placeholderTextColor="#888"
                        />
                    </View>

                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <TouchableOpacity 
                            style={[styles.button, styles.buttonElevated]}
                            onPressIn={onButtonPressIn}
                            onPressOut={onButtonPressOut}
                            onPress={() => setPriceModalVisible(true)}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.buttonText}>See Prices 💰</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>

                {/* Second Card */}
                <Animated.View 
                    style={[
                        styles.card,
                        { 
                            transform: [
                                { translateY: slideUpAnim },
                                { scale: cardScale }
                            ],
                            opacity: fadeAnim
                        }
                    ]}
                >
                    <View style={styles.cardHeader}>
                        <Ionicons name="cash" size={24} color="#2E7D32" />
                        <Text style={styles.cardTitle}>Earn While Recycling</Text>
                    </View>
                    <Text style={styles.cardText}>
                        Make money on your schedule. Choose your recycling method ♻️
                    </Text>

                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <TouchableOpacity 
                            style={[styles.button, styles.buttonElevated]}
                            onPress={() => navigation.navigate("Login")}
                            onPressIn={onButtonPressIn}
                            onPressOut={onButtonPressOut}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.buttonText}>Get Started 🚀</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity 
                        style={styles.signupContainer}
                        onPress={() => navigation.navigate("Signup")}
                    >
                        <Text style={styles.signupText}>
                            New here? <Text style={styles.signupLink}>Create Account →</Text>
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Animated Footer */}
                <Animated.View 
                    style={[
                        styles.footer,
                        { opacity: footerOpacity }
                    ]}
                >
                    <Image
                        source={require('../assets/logo.jpg')}
                        style={[styles.footerLogo, styles.footerLogoPulse]}
                    />
                    <Text style={styles.footerText}>smartecocycle.com 🌍</Text>
                    <View style={styles.footerLinks}>
                        {['About Us', 'Contact', 'Recycler Login'].map((text, index) => (
                            <TouchableOpacity 
                                key={index}
                                style={styles.footerLinkContainer}
                                onPress={() => navigation.navigate(text.replace(' ', ''))}
                            >
                                <Text style={styles.footerLink}>{text}</Text>
                                <View style={styles.linkUnderline} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Modal for Prices */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={priceModalVisible}
                onRequestClose={() => setPriceModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>📦 Current Rates</Text>
                        <View style={styles.priceRow}><Text style={styles.material}>Plastic</Text><Text style={styles.price}>Tk. 100/kg</Text></View>
                        <View style={styles.priceRow}><Text style={styles.material}>Metal</Text><Text style={styles.price}>Tk. 200/kg</Text></View>
                        <View style={styles.priceRow}><Text style={styles.material}>Paper</Text><Text style={styles.price}>Tk. 50/kg</Text></View>
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={() => setPriceModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    container: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        backgroundColor: '#4CAF50',
        paddingVertical: 25,
        borderRadius: 20,
        marginBottom: 25,
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 15,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 1.2,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 25,
        borderRadius: 20,
        marginBottom: 25,
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2E7D32',
        marginLeft: 10,
    },
    cardText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        lineHeight: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    inputIcon: {
        position: 'absolute',
        left: 15,
        zIndex: 1,
    },
    input: {
        backgroundColor: '#F8F9FA',
        padding: 15,
        paddingLeft: 45,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9ECEF',
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    button: {
        backgroundColor: '#388E3C',
        padding: 18,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    buttonElevated: {
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
        marginRight: 10,
    },
    signupContainer: {
        marginTop: 20,
        padding: 10,
        borderRadius: 8,
    },
    signupText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
    },
    signupLink: {
        color: '#2E7D32',
        fontWeight: '700',
    },
    footer: {
        marginTop: 30,
        padding: 25,
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        alignItems: 'center',
    },
    footerLogo: {
        width: 80,
        height: 80,
        marginBottom: 15,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 8,
    },
    footerLogoPulse: {
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    footerText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
        marginBottom: 15,
        letterSpacing: 1.1,
    },
    footerLinks: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    
    footerLinkContainer: {
        position: 'relative',
        marginVertical: 6, // <-- added spacing between links
    },
    footerLink: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        paddingVertical: 8,
    },
    linkUnderline: {
        position: 'absolute',
        bottom: 5,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#fff',
        opacity: 0.3,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.85,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2E7D32',
        marginBottom: 20,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 5,
    },
    material: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    price: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4CAF50',
    },
    closeButton: {
        marginTop: 25,
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default HomeScreen;
