import React from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions, Image } from 'react-native';

const AboutUsScreen = () => {
    const { width } = useWindowDimensions();
    const isLargeScreen = width > 600;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.header}>About Us</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Mission</Text>
                    <Text style={styles.sectionText}>
                        To create a simple, user-friendly platform that makes recycling easier, encourages reusing products, and reduces visual pollution in Bangladesh. Our goal is to protect the environment, cut down on waste, and raise awareness about recycling.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>The Problem</Text>
                    <Text style={styles.sectionText}>
                        In Bangladesh, recycling systems are not advanced, and there is a lack of accessible digital tools to support recycling efforts. This leads to environmental problems like visual pollution, where piles of waste in public spaces harm both the environment and public health.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Solution</Text>
                    <Text style={styles.sectionText}>
                        We are building a web platform that allows users to collect, sort, and recycle items efficiently. The app will include features like locating nearby recycling centers, scheduling pickups for recyclable items, and educating users about proper recycling methods.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Why It Matters</Text>
                    <Text style={styles.sectionText}>
                        By promoting recycling and reducing waste, we aim to create a cleaner, healthier environment for everyone. Our platform empowers individuals and communities to take action against visual pollution and contribute to a sustainable future.
                    </Text>
                </View>

                <Image
                    source={require('../assets/recycling.jpg')} // Replace with your own image
                    style={styles.image}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#0A1D37' // Dark blue background
    },
    contentContainer: { 
        padding: 20, 
        alignItems: 'center' 
    },
    header: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        color: '#fff', 
        marginBottom: 30, 
        textShadowColor: 'rgba(0, 0, 0, 0.75)', 
        textShadowOffset: { width: -1, height: 1 }, 
        textShadowRadius: 10 
    },
    section: { 
        width: '100%', 
        marginBottom: 25, 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: 15, 
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    sectionTitle: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#00eaff', // Cyan color for titles
        marginBottom: 10 
    },
    sectionText: { 
        fontSize: 16, 
        color: '#fff', 
        lineHeight: 24 
    },
    image: { 
        width: '100%', 
        height: 200, 
        borderRadius: 15, 
        marginTop: 20 
    }
});

export default AboutUsScreen;