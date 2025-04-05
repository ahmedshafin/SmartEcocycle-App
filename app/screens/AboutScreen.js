import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  useWindowDimensions, 
  Image, 
  Animated,
  TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const AboutUsScreen = () => {
    const { width } = useWindowDimensions();
    const scrollY = new Animated.Value(0);
    const isLargeScreen = width > 600;
    const navigation = useNavigation();

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [220, 120],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.7],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
                <LinearGradient
                    colors={['#1A3C34', '#4CAF50']}
                    style={styles.gradient}
                >
                    <Animated.Text style={[styles.header, { opacity: headerOpacity }]}>
                        About Us
                    </Animated.Text>
                    <Icon 
                        name="recycling" 
                        size={50} 
                        color="#C8E6C9" 
                        style={styles.headerIcon} 
                    />
                    <TouchableOpacity 
                        style={styles.homeButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Icon name="home" size={30} color="#C8E6C9" />
                        <Text style={styles.homeButtonText}>Home</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </Animated.View>

            <ScrollView 
                contentContainerStyle={styles.contentContainer}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <FeatureCard
                    icon="flag"
                    title="Our Mission"
                    text="To create a simple, user-friendly platform that makes recycling easier, encourages reusing products, and reduces visual pollution in Bangladesh."
                />

                <FeatureCard
                    icon="warning"
                    title="The Problem"
                    text="In Bangladesh, recycling systems are not advanced, leading to environmental issues like visual pollution and public health concerns."
                />

                <FeatureCard
                    icon="build"
                    title="Our Solution"
                    text="A web platform for efficient recycling management with features like location tracking, pickup scheduling, and educational resources."
                />

                <FeatureCard
                    icon="eco"
                    title="Why It Matters"
                    text="Promoting recycling and waste reduction to create a cleaner, healthier environment and sustainable future for communities."
                />

                <View style={styles.imageContainer}>
                    <Image
                        source={require('../assets/recycling.jpg')}
                        style={styles.image}
                    />
                    <LinearGradient
                        colors={['rgba(26, 60, 52, 0.3)', 'rgba(76, 175, 80, 0.7)']}
                        style={styles.imageOverlay}
                    />
                    <Text style={styles.imageText}>Join the Green Revolution</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const FeatureCard = ({ icon, title, text }) => {
    const scale = new Animated.Value(1);

    const onPressIn = () => {
        Animated.spring(scale, {
            toValue: 1.05,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
            <LinearGradient
                colors={['rgba(76, 175, 80, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                style={styles.cardGradient}
            >
                <View 
                    onTouchStart={onPressIn}
                    onTouchEnd={onPressOut}
                    style={styles.cardHeader}
                >
                    <Icon name={icon} size={30} color="#4CAF50" />
                    <Text style={styles.cardTitle}>{title}</Text>
                </View>
                <Text style={styles.cardText}>{text}</Text>
            </LinearGradient>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#1A3C34'
    },
    headerContainer: {
        overflow: 'hidden',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        elevation: 5,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        position: 'relative',
    },
    header: {
        fontSize: 40,
        fontWeight: '900',
        color: '#C8E6C9',
        textTransform: 'uppercase',
        letterSpacing: 3,
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    headerIcon: {
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 15,
        marginVertical: 10,
    },
    homeButton: {
        position: 'absolute',
        top: 100, // Moved lower to be below the icon
        left: 20,
        flexDirection: 'row',
        alignItems: `center`,
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(200, 230, 201, 0.3)',
    },
    homeButtonText: {
        color: '#C8E6C9',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 5,
    },
    contentContainer: { 
        padding: 25,
        paddingTop: 40,
    },
    card: {
        width: '100%',
        marginBottom: 25,
        borderRadius: 25,
        overflow: 'hidden',
    },
    cardGradient: {
        padding: 25,
        borderWidth: 1,
        borderColor: 'rgba(76, 175, 80, 0.3)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#4CAF50',
        marginLeft: 15,
    },
    cardText: {
        fontSize: 16,
        color: '#E8F5E9',
        lineHeight: 24,
        opacity: 0.95,
    },
    imageContainer: {
        borderRadius: 25,
        overflow: 'hidden',
        marginTop: 20,
        height: 280,
        justifyContent: 'flex-end',
        elevation: 5,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    imageText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#C8E6C9',
        padding: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
    },
});

export default AboutUsScreen;