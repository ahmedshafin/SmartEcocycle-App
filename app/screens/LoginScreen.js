import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert  } from "react-native";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password.');
        return;
    }

    try {
        const response = await fetch('http://192.168.0.106:8000/app/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            Alert.alert('Success', 'Login successful!');

            // Navigate based on user role
            if (data.role === 'user') {
                navigation.navigate('User');
            } 
        } else {
            Alert.alert('Login Failed', data.message || 'Invalid credentials.');
        }
    } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to connect to server.');
    }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart EcoCycle</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2e7d32",
  },
  input: {
    width: "80%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#2e7d32",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#388e3c",
    padding: 15,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    marginTop: 10,
    color: "#1b5e20",
  },
});

export default LoginScreen;
