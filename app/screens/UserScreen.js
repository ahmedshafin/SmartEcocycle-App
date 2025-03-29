import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  StatusBar,
  Alert,
  RefreshControl,
  Animated,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import API_BASE_URL from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import Logo from '../assets/logo.jpg'; 

const { width } = Dimensions.get('window');

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

  // Fetch function with token refresh (unchanged logic)
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
        if (!refreshResponse.ok) throw new Error('Token refresh failed');
        const newTokens = await refreshResponse.json();
        tokens = { ...tokens, access: newTokens.access };
        await AsyncStorage.setItem('@auth_tokens', JSON.stringify(tokens));
        headers['Authorization'] = `Bearer ${newTokens.access}`;
        response = await fetch(url, { ...options, headers });
      } catch (error) {
        handleLogout();
        throw error;
      }
    }
    if (!response.ok) throw new Error('Request failed');
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
        Alert.alert('Error', 'Failed to load pickup requests');
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
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access required');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      if (isMounted.current) {
        setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      }
      fetchPickupRequests();
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
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
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }
    if (!location) {
      Alert.alert('Error', 'Location unavailable');
      return;
    }
    try {
      setLoading(true);
      const tokens = JSON.parse(await AsyncStorage.getItem('@auth_tokens')) || {};
      const pickupData = { address, quantity, contact, ...location };
      await authenticatedFetch(`${API_BASE_URL}/api/pickup-requests/`, {
        method: 'POST',
        body: JSON.stringify(pickupData),
      });
      Alert.alert('Success', 'Pickup request submitted!');
      setModalVisible(false);
      setAddress('');
      setQuantity('');
      setContact('');
      fetchPickupRequests();
    } catch (error) {
      Alert.alert('Error', 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@auth_tokens');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const getStatusColor = (status) =>
    ({
      pending: '#FFA000',
      assigned: '#1976D2',
      'in progress': '#2196F3',
      completed: '#388E3C',
      cancelled: '#D32F2F',
    }[status?.toLowerCase()] || '#9E9E9E');

  const getStatusIcon = (status) =>
    ({
      pending: 'hourglass-empty',
      assigned: 'assignment-ind',
      'in progress': 'directions-car',
      completed: 'check-circle',
      cancelled: 'cancel',
    }[status?.toLowerCase()] || 'help');

  return (
    <View style={styles.safeArea}>
      <LinearGradient colors={['#E8F5E9', '#C8E6C9']} style={styles.gradientBackground}>
        <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
        
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
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            {/* Header */}
            <View style={styles.header}>
              {/* logo */}
              <View style={styles.logoContainer}>
                {/* Replace with your actual logo component or image */}
                <Image source={Logo} style={styles.logoImage} />
                <Text style={styles.appName}>Smart EcoCycle</Text>
              </View>
              
              <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
                <Icon name="logout" size={28} color="#2E7D32" />
              </TouchableOpacity>
            </View>

            {/* Profile Section */}
            <View style={styles.profileContainer}>
              <LinearGradient 
                colors={['#4CAF50', '#388E3C']}
                style={styles.profileCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.profileContent}>
                  <View style={styles.avatarContainer}>
                    <Icon name="account-circle" size={60} color="#fff" />
                  </View>
                  <View style={styles.profileText}>
                    <Text style={styles.userName}>{full_name}</Text>
                    <View style={styles.ratingContainer}>
                      <Icon name="star" size={20} color="#FFD700" />
                      <Text style={styles.ratingText}>{rating}/5</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Icon name="local-shipping" size={24} color="#388E3C" />
                  </View>
                  <Text style={styles.statNumber}>{total_pickup}</Text>
                  <Text style={styles.statLabel}>Pickups</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Icon name="recycling" size={24} color="#388E3C" />
                  </View>
                  <Text style={styles.statNumber}>{total_recycled}kg</Text>
                  <Text style={styles.statLabel}>Recycled</Text>
                </View>
              </View>
            </View>

            {/* Request Button */}
            <TouchableOpacity 
              onPress={() => setModalVisible(true)}
              style={styles.requestButton}
              activeOpacity={0.9}
            >
              <LinearGradient 
                colors={['#4CAF50', '#388E3C']}
                style={styles.requestButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="add-circle" size={28} color="#fff" />
                <Text style={styles.requestButtonText}>Request New Pickup</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Active Requests */}
            <Text style={styles.sectionTitle}>Your Active Requests</Text>
            
            {pickupRequests.length > 0 ? (
              pickupRequests.map((request, index) => (
                <Animated.View
                  key={request.id}
                  style={[
                    styles.requestCard,
                    {
                      transform: [
                        {
                          translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50 * (index + 1), 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.requestHeader}>
                    <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(request.status) }]} />
                    <Icon 
                      name={getStatusIcon(request.status)} 
                      size={20} 
                      color={getStatusColor(request.status)} 
                      style={styles.statusIcon}
                    />
                    <Text style={[styles.requestStatus, { color: getStatusColor(request.status) }]}>
                      {request.status.toUpperCase()}
                    </Text>
                    <Text style={styles.requestDate}>
                      {new Date(request.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.requestAddress}>{request.address}</Text>
                  <View style={styles.requestDetails}>
                    <View style={styles.detailItem}>
                      <Icon name="scale" size={18} color="#4CAF50" />
                      <Text style={styles.detailText}>{request.quantity} kg</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Icon name="phone" size={18} color="#4CAF50" />
                      <Text style={styles.detailText}>{request.contact}</Text>
                    </View>
                  </View>
                </Animated.View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="inbox" size={60} color="#BDBDBD" />
                <Text style={styles.emptyStateText}>No active requests yet</Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>

        {/* Modal */}
        <Modal visible={isModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <Animated.View 
              style={styles.modalContainer}
              entering={Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              })}
            >
              <LinearGradient 
                colors={['#FFFFFF', '#F1F8E9']}
                style={styles.modalContent}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>New Pickup Request</Text>
                  <Icon name="grass" size={30} color="#4CAF50" />
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="location-on" size={20} color="#4CAF50" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Address"
                    placeholderTextColor="#757575"
                    value={address}
                    onChangeText={setAddress}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="scale" size={20} color="#4CAF50" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Weight (kg)"
                    placeholderTextColor="#757575"
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="phone" size={20} color="#4CAF50" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Contact Number"
                    placeholderTextColor="#757575"
                    value={contact}
                    onChangeText={setContact}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Submit Request</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  gradientBackground: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileContainer: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileCard: {
    padding: 24,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  profileText: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
  },
  requestButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  requestButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 16,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusIcon: {
    marginRight: 8,
  },
  requestStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 'auto',
  },
  requestDate: {
    fontSize: 12,
    color: '#757575',
  },
  requestAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 12,
  },
  requestDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#424242',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#2E7D32',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#757575',
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
  },
  iconButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  logoImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 12,
  },
});

export default DashboardScreen;