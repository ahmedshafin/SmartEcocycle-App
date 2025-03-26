import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Button, 
  Platform, 
  StatusBar, 
  Alert,
  Animated 
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import API_BASE_URL from './config';

const DashboardScreen = () => {
  const navigation = useNavigation(); // Access navigation object
  const [isModalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Hide the Stack Navigator header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the default header
    });
  }, [navigation]);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location access is required to request a pickup.');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Failed to get current location.');
      }
    };

    getLocation();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSubmit = async () => {
    if (!address || !quantity || !contact) {
      alert('Please fill out all fields.');
      return;
    }

    if (!location) {
      alert('Unable to fetch location. Please enable GPS and try again.');
      return;
    }

    const pickupData = {
      address,
      quantity,
      contact,
      latitude: location.latitude,
      longitude: location.longitude,
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/pickup-requests/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pickupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to submit pickup request:', errorData);
        alert(`Failed: ${errorData.detail || 'Unknown error'}`);
        return;
      }

      alert('Pickup request submitted successfully!');
      setModalVisible(false);
      setAddress('');
      setQuantity('');
      setContact('');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit pickup request. Please try again.');
    }
  };

  return (
    <View style={styles.safeArea}>
      <LinearGradient colors={['#C8E6C9', '#81C784']} style={styles.gradientBackground}>
        <ScrollView contentContainerStyle={styles.container}>
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Back Arrow */}
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()} // Navigate back using Stack Navigator
            >
              <Icon name="arrow-back" size={28} color="#1B5E20" />
            </TouchableOpacity>

            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <View>
                <Text style={styles.welcomeText}>Welcome, User!</Text>
                {/* Rating Component */}
                <View style={styles.ratingContainer}>
                  <Icon name="star" size={20} color="#FFD700" />
                  <Text style={styles.ratingText}>4.8/5</Text>
                </View>
              </View>
              <Icon name="account-circle" size={50} color="#388E3C" />
            </View>

            <View style={styles.card}>
              <LinearGradient colors={['#E8F5E9', '#F1F8E9']} style={styles.cardGradient}>
                <Text style={styles.sectionTitle}>Your Recycling Stats</Text>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <LinearGradient colors={['#FFB300', '#F57C00']} style={styles.iconGradient}>
                      <Icon name="local-shipping" size={28} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.statValue}>5</Text>
                    <Text style={styles.statLabel}>Total Pickups</Text>
                  </View>
                  <View style={styles.statItem}>
                    <LinearGradient colors={['#66BB6A', '#388E3C']} style={styles.iconGradient}>
                      <Icon name="recycling" size={28} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.statValue}>25 kg</Text>
                    <Text style={styles.statLabel}>Total Recycled</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.card}>
              <LinearGradient colors={['#E8F5E9', '#F1F8E9']} style={styles.cardGradient}>
                <Text style={styles.sectionTitle}>Your Pickup Requests</Text>
                <View style={styles.requestItem}>
                  <LinearGradient colors={['#42A5F5', '#1976D2']} style={styles.requestIconGradient}>
                    <Icon name="location-on" size={24} color="#fff" />
                  </LinearGradient>
                  <View style={styles.requestDetails}>
                    <Text style={styles.requestAddress}>123 Main St</Text>
                    <Text style={styles.requestMaterial}>Plastic</Text>
                    <Text style={styles.requestStatus}>Status: Pending</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={() => setModalVisible(true)}>
                <LinearGradient colors={['#66BB6A', '#388E3C']} style={styles.buttonGradient}>
                  <Text style={styles.buttonText}>Request New Pickup</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <LinearGradient colors={['#EF5350', '#D32F2F']} style={styles.buttonGradient}>
                  <Text style={styles.buttonText}>Logout</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Pickup Request Modal */}
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <LinearGradient colors={['#E8F5E9', '#F1F8E9']} style={styles.modalContent}>
              <Text style={styles.modalTitle}>Request Pickup</Text>

              <TextInput 
                style={styles.input} 
                placeholder="Address" 
                value={address} 
                onChangeText={setAddress} 
                placeholderTextColor="#888"
              />
              <TextInput 
                style={styles.input} 
                placeholder="Quantity (e.g., 5 kg)" 
                value={quantity} 
                onChangeText={setQuantity} 
                keyboardType="numeric" 
                placeholderTextColor="#888"
              />
              <TextInput 
                style={styles.input} 
                placeholder="Contact Number" 
                value={contact} 
                onChangeText={setContact} 
                keyboardType="phone-pad" 
                placeholderTextColor="#888"
              />

              <View style={styles.modalButtonContainer}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} color="#F44336" />
                <Button title="Submit" onPress={handleSubmit} color="#388E3C" />
              </View>
            </LinearGradient>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 
  },
  gradientBackground: {
    flex: 1,
  },
  container: { 
    flexGrow: 1, 
    padding: 20, 
  },
  backButton: {
    padding: 10,
    marginTop: 10,
  },
  welcomeSection: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeText: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#1B5E20',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    marginBottom: 25, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 12, 
    elevation: 8,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#388E3C', 
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around',
  },
  statItem: { 
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconGradient: {
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  statValue: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#333', 
    marginTop: 8,
  },
  statLabel: { 
    fontSize: 14, 
    color: '#666', 
    fontWeight: '600',
  },
  requestItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requestIconGradient: {
    padding: 8,
    borderRadius: 50,
    marginRight: 12,
  },
  requestDetails: { 
    flex: 1,
  },
  requestAddress: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333',
  },
  requestMaterial: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 4,
  },
  requestStatus: { 
    fontSize: 14, 
    color: '#1976D2', 
    fontWeight: '600', 
    marginTop: 4,
  },
  buttonContainer: { 
    marginTop: 25,
  },
  primaryButton: { 
    borderRadius: 12, 
    marginBottom: 15, 
    overflow: 'hidden',
  },
  secondaryButton: { 
    borderRadius: 12, 
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 18,
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: { 
    width: '85%', 
    borderRadius: 16, 
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#388E3C', 
    marginBottom: 20, 
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: { 
    height: 48, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 10, 
    paddingHorizontal: 12, 
    marginBottom: 20, 
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalButtonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#008000',
    marginLeft: 5,
  },
});

export default DashboardScreen;