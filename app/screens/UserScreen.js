import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, PermissionsAndroid, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';




const UserScreen = () => {
    const navigation = useNavigation();
    
    const recyclingHistory = [
        { id: '1', date: '2025-02-01', items: 'Plastic, Glass' },
        { id: '2', date: '2025-02-05', items: 'Paper, Metal' },
    ];


    //Additional code
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Permission",
                    message: "This app requires access to your location.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };



    const sendPickupRequest = async () => {
        console.log("Requesting Location Permission...");
        const hasPermission = await requestLocationPermission();
        
        if (!hasPermission) {
            Alert.alert("Permission Denied", "Location permission is required.");
            return;
        }
    
        console.log("Getting Location...");
        
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log("Location Retrieved:", latitude, longitude);

               
                // Send location to backend
                fetch('http://192.168.0.106:8000/api/pickup-request/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ latitude, longitude }),
                })
                .then(response => response.json())
                .then(data => Alert.alert('Success', 'Pickup request sent!'))
                .catch(error => Alert.alert('Error', 'Failed to send request'));
            },
            (error) => {
                Alert.alert('Error', 'Failed to get location: ' + error.message);
                console.log("Location Error:", error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: 'white' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Recycling Dashboard</Text>
            
            <TouchableOpacity 
                style={{ backgroundColor: '#007bff', padding: 12, borderRadius: 5, marginBottom: 12 }}
                onPress={sendPickupRequest}>
                <Text style={{ color: 'white', textAlign: 'center' }}>Send Pickup Request</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={{ backgroundColor: '#28a745', padding: 12, borderRadius: 5, marginBottom: 12 }}
                onPress={() => navigation.navigate('SetAddress')}>
                <Text style={{ color: 'white', textAlign: 'center' }}>Set Address</Text>
            </TouchableOpacity>
            
            <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 16 }}>Recycling History</Text>
            <FlatList
                data={recyclingHistory}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                        <Text style={{ fontSize: 16 }}>{item.date}: {item.items}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default UserScreen;
