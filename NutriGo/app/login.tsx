import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, firestore } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../context/UserContext';
import { User } from '@/models/User';

const LoginForm = () => {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setSuccess('Login successful!');
      setError('');
      console.log('User logged in:', user);

      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as Omit<User, 'id' | 'email'>;
        setUser({
          id: user.uid,
          email: user.email || '',
          ...userData,
        });
        router.push('/profile');
      } else {
        setError('No user data available. Please contact support.');
        setSuccess('');
        console.error('No user data available.');
      }
    } catch (error: unknown) {
      let errorMessage = 'Login failed. Please try again.';
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === 'auth/wrong-password') {
          errorMessage = 'Invalid email or password';
        } else if (firebaseError.code === 'auth/user-not-found') {
          errorMessage = 'User not found';
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email';
        }
      }
      setError(errorMessage);
      setSuccess('');
      console.error('Error logging in:', error);
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <LinearGradient
        colors={['#92a3fd', '#9dceff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
        </View>
      </LinearGradient>
      <LinearGradient
        colors={['#92a3fd', '#9dceff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
      </LinearGradient>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <LinearGradient
          colors={['#92a3fd', '#9dceff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}
      <Text style={styles.registerText}>Do not have an account?</Text>
      <TouchableOpacity onPress={() => router.push('/register')} style={styles.registerButton}>
        <LinearGradient
          colors={['#92a3fd', '#9dceff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.registerButtonBackground}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5', // Ensure this matches the splash screen background color
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  gradientBorder: {
    width: '100%',
    padding: 2,
    borderRadius: 25,
    marginVertical: 10,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 25,
    overflow: 'hidden',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 0,
    borderRadius: 25,
    color: '#000',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    overflow: 'hidden',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    position: 'relative',
    zIndex: 1,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  success: {
    color: 'green',
    marginTop: 10,
  },
  registerText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    marginTop: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  registerButtonBackground: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default LoginForm;
