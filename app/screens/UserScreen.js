import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
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
  RefreshControl,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import API_BASE_URL from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';




const DashboardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { full_name, rating, total_pickup, total_recycled } = route.params;

  const [isModalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pickupRequests, setPickupRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const intervalRef = useRef(null);
  const isMounted = useRef(true);

  // Centralized fetch with token refresh logic
  const authenticatedFetch = async (url, options = {}) => {
    let tokens = JSON.parse(await AsyncStorage.getItem('@auth_tokens')) || {};
   
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokens.access}`,
    };
  
   
  
    let response = await fetch(url, { ...options, headers });
    
  
    if (response.status === 401) {
      
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: tokens.refresh }),
        });
        
  
        if (!refreshResponse.ok) {
          const errorData = await refreshResponse.json();
          console.error('Refresh failed:', errorData);
          throw new Error('Token refresh failed');
        }
  
        const newTokens = await refreshResponse.json();
        tokens = { ...tokens, access: newTokens.access };
        await AsyncStorage.setItem('@auth_tokens', JSON.stringify(tokens));
        headers['Authorization'] = `Bearer ${newTokens.access}`;
       
        response = await fetch(url, { ...options, headers });
      } catch (error) {
        console.error('Token refresh error:', error);
        handleLogout();
        throw new Error('Session expired');
      }
    }
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Fetch response error:', errorData);
      throw new Error(errorData.detail || errorData.message || 'Request failed');
    }
  
    return response.json();
  };

  const fetchPickupRequests = async () => {
    if (!isMounted.current) return;

    try {
      setRefreshing(true);
      const data = await authenticatedFetch(`${API_BASE_URL}/api/pickup-requests/`);
      if (isMounted.current) setPickupRequests(data);
    } catch (error) {
      if (isMounted.current && error.message !== 'Session expired') {
        console.error('Fetch error:', error);
        Alert.alert('Error', error.message || 'Failed to load pickup requests');
      }
    } finally {
      if (isMounted.current) setRefreshing(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    isMounted.current = true;

    const initialize = async () => {
      // Get location
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location access is required.');
          return;
        }
        const currentLocation = await Location.getCurrentPositionAsync({});
        if (isMounted.current) {
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });
        }
      } catch (error) {
        console.error('Location error:', error);
        Alert.alert('Error', 'Failed to get location.');
      }

      // Initial fetch
      fetchPickupRequests();

      // Fade animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Periodic refresh
      intervalRef.current = setInterval(fetchPickupRequests, 10000);
    };

    initialize();

    return () => {
      isMounted.current = false;
      clearInterval(intervalRef.current);
    };
  }, [fadeAnim]);

  const handleSubmit = async () => {
    if (!address || !quantity || !contact) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
  
    if (!location) {
      Alert.alert('Error', 'Unable to fetch location. Please enable GPS.');
      return;
    }
  
    try {
      setLoading(true);
  
      // Retrieve tokens from AsyncStorage
      const tokens = JSON.parse(await AsyncStorage.getItem('@auth_tokens')) || {};
      
      if (!tokens.access) {
        throw new Error('No access token found. Please log in again.');
      }
  
      // Manual JWT decode
      const tokenParts = tokens.access.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format. Please log in again.');
      }
      const payloadBase64 = tokenParts[1];
      const payloadJson = atob(payloadBase64); // Decode Base64 to JSON string
      const payload = JSON.parse(payloadJson); // Parse JSON string to object
      
  
      // Prepare pickup data with user ID
      const pickupData = {
       
        address,
        quantity,
        contact,
        latitude: location.latitude,
        longitude: location.longitude,
      };
  
      //erasing unnessary debug
  
      await authenticatedFetch(`${API_BASE_URL}/api/pickup-requests/`, {
        method: 'POST',
        body: JSON.stringify(pickupData),
      });
  
      Alert.alert('Success', 'Pickup request submitted successfully!');
      setModalVisible(false);
      setAddress('');
      setQuantity('');
      setContact('');
      fetchPickupRequests();
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', error.message || 'Failed to submit pickup request.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    if (!isMounted.current) return;

    try {
      setLoading(true);
      await authenticatedFetch(`${API_BASE_URL}/api/pickup-requests/${id}/update-status/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchPickupRequests();
    } catch (error) {
      console.error('Update status error:', error);
      Alert.alert('Error', error.message || 'Failed to update status');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      isMounted.current = false;
      clearInterval(intervalRef.current);
      await AsyncStorage.removeItem('@auth_tokens');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout.');
    }
  };

  const getStatusColor = (status) =>
    ({
      pending: '#FFA000',
      assigned: '#1976D2',
      'in progress': '#2196F3',
      completed: '#388E3C',
      cancelled: '#D32F2F',
    }[status?.toLowerCase()] || '#9E9E9E');

  return (
    <View style={styles.safeArea}>
      <LinearGradient colors={['#C8E6C9', '#81C784']} style={styles.gradientBackground}>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchPickupRequests}
              colors={['#388E3C']}
              tintColor="#388E3C"
            />
          }
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={28} color="#1B5E20" />
            </TouchableOpacity>

            <View style={styles.welcomeSection}>
              <View>
                <Text style={styles.welcomeText}>Welcome, {full_name}!</Text>
                <View style={styles.ratingContainer}>
                  <Icon name="star" size={20} color="#FFD700" />
                  <Text style={styles.ratingText}>{rating}/5</Text>
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
                    <Text style={styles.statValue}>{total_pickup}</Text>
                    <Text style={styles.statLabel}>Total Pickups</Text>
                  </View>
                  <View style={styles.statItem}>
                    <LinearGradient colors={['#66BB6A', '#388E3C']} style={styles.iconGradient}>
                      <Icon name="recycling" size={28} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.statValue}>{total_recycled} kg</Text>
                    <Text style={styles.statLabel}>Total Recycled</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.card}>
              <LinearGradient colors={['#E8F5E9', '#F1F8E9']} style={styles.cardGradient}>
                <Text style={styles.sectionTitle}>Your Pickup Requests</Text>
                {pickupRequests.length > 0 ? (
                  pickupRequests.map((request) => (
                    <View key={request.id} style={styles.requestItem}>
                      <LinearGradient colors={['#42A5F5', '#1976D2']} style={styles.requestIconGradient}>
                        <Icon name="location-on" size={24} color="#fff" />
                      </LinearGradient>
                      <View style={styles.requestDetails}>
                        <Text style={styles.requestAddress}>{request.address || 'No address'}</Text>
                        <Text style={styles.requestMaterial}>{request.quantity || 'Unknown'}</Text>
                        <View style={styles.statusRow}>
                          <Text style={styles.requestStatus}>Status: </Text>
                          <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
                            {request.status || 'Pending'}
                          </Text>
                        </View>
                        <Text style={styles.requestDate}>
                          {request.created_at ? new Date(request.created_at).toLocaleString() : 'N/A'}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noRequestsText}>No pickup requests yet</Text>
                )}
              </LinearGradient>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={() => setModalVisible(true)}>
                <LinearGradient colors={['#66BB6A', '#388E3C']} style={styles.buttonGradient}>
                  <Text style={styles.buttonText}>Request New Pickup</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
                <LinearGradient colors={['#EF5350', '#D32F2F']} style={styles.buttonGradient}>
                  <Text style={styles.buttonText}>Logout</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>

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
                <Button title="Submit" onPress={handleSubmit} color="#388E3C" disabled={loading} />
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0,
  },
  gradientBackground: { flex: 1 },
  container: { flexGrow: 1, padding: 20 },
  backButton: { padding: 10, marginTop: 10 },
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
  cardGradient: { padding: 20, borderRadius: 16 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#388E3C',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
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
  iconGradient: { padding: 10, borderRadius: 50, marginBottom: 10 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#333', marginTop: 8 },
  statLabel: { fontSize: 14, color: '#666', fontWeight: '600' },
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
  requestIconGradient: { padding: 8, borderRadius: 50, marginRight: 12 },
  requestDetails: { flex: 1 },
  requestAddress: { fontSize: 18, fontWeight: '600', color: '#333' },
  requestMaterial: { fontSize: 14, color: '#666', marginTop: 4 },
  requestStatus: { fontSize: 14, color: '#1976D2', fontWeight: '600', marginTop: 4 },
  buttonContainer: { marginTop: 25 },
  primaryButton: { borderRadius: 12, marginBottom: 15, overflow: 'hidden' },
  secondaryButton: { borderRadius: 12, overflow: 'hidden' },
  buttonGradient: { padding: 18, alignItems: 'center', borderRadius: 12 },
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
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  ratingText: { fontSize: 16, fontWeight: '600', color: '#008000', marginLeft: 5 },
  noRequestsText: { textAlign: 'center', color: '#757575', marginVertical: 20 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  statusText: { fontWeight: 'bold', fontSize: 14 },
  requestDate: { fontSize: 12, color: '#757575', marginTop: 2 },
});

export default DashboardScreen;