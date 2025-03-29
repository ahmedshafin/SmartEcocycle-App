import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
  StatusBar,
  Dimensions,
  Platform,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import API_BASE_URL from './config';
import Logo from '../assets/logo.jpg';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;
  const emailLineWidth = useRef(new Animated.Value(0)).current;
  const passLineWidth = useRef(new Animated.Value(0)).current;

  // Initialize leaves data
  const leaves = Array.from({ length: 8 }).map(() => ({
    left: Math.random() * width,
    top: Math.random() * height * 0.6,
    rotation: Math.random() * 360,
    size: Math.random() * 20 + 20,
    translateY: new Animated.Value(0)
  }));

  useEffect(() => {
    // Fade in screen
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Logo rotation
    Animated.loop(
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();

    // Button pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Leaves animation
    leaves.forEach(leaf => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(leaf.translateY, {
            toValue: 20,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(leaf.translateY, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/app/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('@auth_tokens', JSON.stringify(data.tokens));
        if (data.role === 'user') {
          navigation.navigate('User', {
            full_name: data.full_name,
            rating: data.rating,
            total_pickup: data.total_pickup,
            total_recycled: data.total_recycled,
          });
        }
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonPulse, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonPulse, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => handleLogin());
  };

  const handleInputFocus = (lineAnim) => {
    Animated.timing(lineAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleInputBlur = (lineAnim) => {
    Animated.timing(lineAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const logoRotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.fullScreen}>
      <StatusBar backgroundColor="#1B5E20" barStyle="light-content" />
      <LinearGradient
        colors={['#1B5E20', '#388E3C']}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating Leaves */}
        {leaves.map((leaf, i) => (
          <Animated.View
            key={i}
            style={[
              styles.floatingLeaf,
              {
                left: leaf.left,
                top: leaf.top,
                transform: [
                  { rotate: leaf.rotation + 'deg' },
                  { translateY: leaf.translateY }
                ],
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.6]
                })
              }
            ]}
          >
            <Icon name="leaf" size={leaf.size} color="#76FF03" />
          </Animated.View>
        ))}

        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          {/* Logo Section with your image logo */}
          <View style={styles.logoContainer}>
            <Animated.View
              style={[
                styles.logoCircle,
                {
                  transform: [
                    { rotate: logoRotation },
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1]
                      })
                    }
                  ]
                }
              ]}
            >
              <Image 
                source={Logo} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </Animated.View>
            <Text style={styles.title}>Smart EcoCycle</Text>
            <Text style={styles.subtitle}>Sustainable Waste Management</Text>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <View style={styles.inputBox}>
              <Icon name="envelope" size={20} color="#FFF" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.7)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => handleInputFocus(emailLineWidth)}
                onBlur={() => handleInputBlur(emailLineWidth)}
              />
              <Animated.View
                style={[
                  styles.inputLine,
                  {
                    width: emailLineWidth.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]}
              />
            </View>

            <View style={styles.inputBox}>
              <Icon name="lock" size={20} color="#FFF" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => handleInputFocus(passLineWidth)}
                onBlur={() => handleInputBlur(passLineWidth)}
                onSubmitEditing={handleLogin}
              />
              <Animated.View
                style={[
                  styles.inputLine,
                  {
                    width: passLineWidth.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]}
              />
            </View>
          </View>

          {/* Login Button */}
          <Animated.View style={{ transform: [{ scale: buttonPulse }] }}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleButtonPress}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#76FF03', '#64DD17']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Icon name="leaf" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Login</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer Links */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.footerLink}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerLink}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.linkText}>Create New Account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#1B5E20'
  },
  gradientContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30
  },
  floatingLeaf: {
    position: 'absolute'
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#76FF03',
    overflow: 'hidden'
  },
  logoImage: {
    width: '90%',
    height: '90%',
    borderRadius: 60
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic'
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  icon: {
    marginRight: 10
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16
  },
  inputLine: {
    position: 'absolute',
    bottom: -2,
    height: 2,
    backgroundColor: '#76FF03',
    borderRadius: 2
  },
  loginButton: {
    width: width * 0.7,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#76FF03',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    alignSelf: 'center'
  },
  buttonGradient: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10
  },
  footer: {
    marginTop: 30,
    alignItems: 'center'
  },
  footerLink: {
    padding: 10
  },
  linkText: {
    color: '#FFF',
    fontSize: 14,
    textDecorationLine: 'underline'
  }
});

export default LoginScreen;