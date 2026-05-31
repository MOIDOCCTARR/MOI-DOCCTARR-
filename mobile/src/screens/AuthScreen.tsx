import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const C = {
  primary: '#003f87',
  surface: '#f7f9fc',
  onSurface: '#191c1e',
  containerLow: '#f2f4f7',
  containerHighest: '#e0e3e6',
  outline: '#727784',
  white: '#ffffff',
};

interface Props {
  onLogin?: () => void;
}

export default function AuthScreen({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <View style={s.logoContainer}>
          <MaterialIcons name="assignment" size={64} color={C.primary} />
          <Text style={s.brandText}>MOI DOCTAR</Text>
          <Text style={s.subtitle}>Your AI Medical Assistant</Text>
        </View>

        <View style={s.form}>
          <View style={s.inputWrapper}>
            <MaterialIcons name="email" size={20} color={C.outline} style={s.icon} />
            <TextInput
              style={s.input}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={s.inputWrapper}>
            <MaterialIcons name="lock" size={20} color={C.outline} style={s.icon} />
            <TextInput
              style={s.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={s.loginBtn} onPress={onLogin}>
            <Text style={s.loginBtnText}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={s.signupBtn} onPress={onLogin}>
            <Text style={s.signupBtnText}>Create new account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.surface },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 48 },
  brandText: { fontSize: 32, fontWeight: '800', color: C.primary, marginTop: 16, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: C.outline, marginTop: 8 },
  
  form: { gap: 16 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 12, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: C.containerHighest },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: C.onSurface },
  
  loginBtn: { backgroundColor: C.primary, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  loginBtnText: { color: C.white, fontSize: 16, fontWeight: '700' },
  
  signupBtn: { height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  signupBtnText: { color: C.primary, fontSize: 16, fontWeight: '700' },
});
