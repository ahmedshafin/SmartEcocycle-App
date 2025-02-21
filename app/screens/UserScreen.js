import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Button, Platform, StatusBar, Alert } from 'react-native';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DashboardScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState(null);

  // Get user's current location
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
  }, []);

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
      const response = await fetch('http://192.168.0.106:8000/api/pickup-requests/', {
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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome, User!</Text>
          <Icon name="account-circle" size={40} color="#4CAF50" />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Recycling Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon name="local-shipping" size={24} color="#FF9800" />
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Total Pickups</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="recycling" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>25 kg</Text>
              <Text style={styles.statLabel}>Total Recycled</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Pickup Requests</Text>
          <View style={styles.requestItem}>
            <Icon name="location-on" size={20} color="#2196F3" />
            <View style={styles.requestDetails}>
              <Text style={styles.requestAddress}>123 Main St</Text>
              <Text style={styles.requestMaterial}>Plastic</Text>
              <Text style={styles.requestStatus}>Status: Pending</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Request New Pickup</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Pickup Request Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Pickup</Text>

            <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
            <TextInput style={styles.input} placeholder="Quantity (e.g., 5 kg)" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Contact Number" value={contact} onChangeText={setContact} keyboardType="phone-pad" />


            <View style={styles.modalButtonContainer}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#F44336" />
              <Button title="Submit" onPress={handleSubmit} color="#4CAF50" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flexGrow: 1, padding: 16 },
  welcomeSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20, shadowColor: '#000', elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', marginTop: 8 },
  statLabel: { fontSize: 14, color: '#666' },
  requestItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  requestDetails: { marginLeft: 10 },
  requestAddress: { fontSize: 16, fontWeight: '500' },
  requestMaterial: { fontSize: 14, color: '#666' },
  requestStatus: { fontSize: 14, color: '#2196F3' },
  buttonContainer: { marginTop: 20 },
  primaryButton: { backgroundColor: '#4CAF50', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 10 },
  secondaryButton: { backgroundColor: '#F44336', borderRadius: 8, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 16 },
  locationText: { fontSize: 14, color: '#555', marginBottom: 10, textAlign: 'center' },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
});

export default DashboardScreen;
