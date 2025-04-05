import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Animated,
  Easing
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import API_BASE_URL from './config';

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Leaf animation values
  const leafAnimations = Array(5).fill().map(() => ({
    translateY: new Animated.Value(0),
    rotate: new Animated.Value(0),
    scale: new Animated.Value(1)
  }));

  // Start leaf animations
  React.useEffect(() => {
    leafAnimations.forEach((leaf, index) => {
      // Different timing for each leaf
      const duration = 8000 + Math.random() * 5000;
      const delay = index * 1000;
      
      // Floating up and down animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(leaf.translateY, {
            toValue: 50,
            duration,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(leaf.translateY, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ])
      ).start();

      // Rotation animation
      Animated.loop(
        Animated.timing(leaf.rotate, {
          toValue: 1,
          duration: duration * 2,
          delay,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();

      // Gentle pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(leaf.scale, {
            toValue: 1.1,
            duration: duration/2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(leaf.scale, {
            toValue: 1,
            duration: duration/2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ])
      ).start();
    });
  }, []);

  const handleSignup = async () => {
    // Existing signup logic remains unchanged
    try {
      const response = await fetch(`${API_BASE_URL}/app/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role: "user",
          center_name: null,
          location: null,
          contact: null,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Signup successful!");
        navigation.navigate("Login");
      } else {
        alert("Signup failed: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#e8f5e9', '#c8e6c9', '#a5d6a7']}
        style={styles.gradient}
      >
        {/* Floating Leaves using MaterialCommunityIcons */}
        {leafAnimations.map((leaf, index) => {
          const rotation = leaf.rotate.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', `${Math.random() > 0.5 ? '-' : ''}360deg`]
          });
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.leaf,
                {
                  left: `${10 + (index * 15)}%`,
                  top: `${10 + (index * 10)}%`,
                  transform: [
                    { translateY: leaf.translateY },
                    { rotate: rotation },
                    { scale: leaf.scale }
                  ]
                }
              ]}
            >
              <Icon 
                name="leaf" 
                size={30} 
                color="#2e7d32" 
                style={{ opacity: 0.7 }} 
              />
            </Animated.View>
          );
        })}

        {/* Home Button */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="home" size={28} color="#1b5e20" />
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>

          <View style={styles.inputContainer}>
            <Icon name="account" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#81c784"
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="email" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#81c784"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#81c784"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <LinearGradient
              colors={['#2e7d32', '#388e3c']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
              <Icon name="arrow-right" size={24} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate("Login")}
            style={styles.switchContainer}
          >
            <Text style={styles.switchText}>Already have an account? </Text>
            <Text style={styles.switchLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#1b5e20',
  },
  inputContainer: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1b5e20',
  },
  button: {
    width: '80%',
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  switchText: {
    color: '#1b5e20',
  },
  switchLink: {
    color: '#1b5e20',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  leaf: {
    position: 'absolute',
  },
  homeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
  },
});

export default SignupScreen;