import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const C = {
  primary: '#003f87',
  primaryContainer: '#0056b3',
  secondary: '#486176',
  surface: '#f7f9fc',
  onSurface: '#191c1e',
  onSurfaceVariant: '#424752',
  containerLow: '#f2f4f7',
  containerHighest: '#e0e3e6',
  containerLowest: '#ffffff',
  container: '#eceef1',
  containerHigh: '#e6e8eb',
  emergency: '#b10f2b',
  outline: '#727784',
  white: '#ffffff',
  secondaryFixed: '#cbe6ff',
  onSecondaryFixedVariant: '#30495d',
  primaryFixed: '#d7e2ff',
};

const suggestedSymptoms = ['Headache', 'Fever', 'Cough', 'Sore Throat', 'Dizziness'];

interface Props {
  onContinue?: () => void;
  onGoToHome?: () => void;
  onGoToHistory?: () => void;
  onGoToProfile?: () => void;
}

export default function SymptomInputScreen({ onContinue, onGoToHome, onGoToHistory, onGoToProfile }: Props) {
  const [text, setText] = useState('');

  const appendSymptom = (s: string) => {
    setText(prev => (prev ? `${prev}, ${s}` : s));
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Decorative Background Blobs */}
      <View style={s.bgBlobTop} />
      <View style={s.bgBlobBottom} />

      {/* Header */}
      <View style={s.header}>
        <View style={s.brand}>
          <MaterialIcons name="assignment" size={22} color={C.primary} />
          <Text style={s.brandText}>MOI DOCTAR</Text>
        </View>
        <TouchableOpacity style={s.emergencyBtn}>
          <Text style={s.emergencyText}>EMERGENCY</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Editorial Headline */}
        <View style={s.headlineSection}>
          <Text style={s.kicker}>PATIENT TRIAGE</Text>
          <Text style={s.title}>How are you feeling right now?</Text>
          <Text style={s.subtitle}>
            Describe your symptoms in your own words. Our AI assistant will help guide your consultation.
          </Text>
        </View>

        {/* Text Input Area */}
        <View style={s.inputContainer}>
          <TextInput
            style={s.textArea}
            multiline
            placeholder="Describe your symptoms..."
            placeholderTextColor="rgba(114, 119, 132, 0.6)"
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />
          <TouchableOpacity style={s.micBtn}>
            <MaterialIcons name="mic" size={24} color={C.white} />
          </TouchableOpacity>
        </View>

        {/* Suggested Chips */}
        <View style={s.suggestionsSection}>
          <Text style={s.suggestionsLabel}>SUGGESTED SYMPTOMS</Text>
          <View style={s.chipsRow}>
            {suggestedSymptoms.map(symp => (
              <TouchableOpacity key={symp} style={s.chip} onPress={() => appendSymptom(symp)}>
                <Text style={s.chipText}>{symp}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bento Boxes */}
        <View style={s.bentoGrid}>
          <View style={s.bentoCard}>
            <MaterialIcons name="verified-user" size={24} color={C.primary} />
            <View style={s.bentoTextCol}>
              <Text style={s.bentoTitle}>Secure & Private</Text>
              <Text style={s.bentoDesc}>Your data is encrypted and only visible to medical staff.</Text>
            </View>
          </View>
          <View style={s.bentoCard}>
            <MaterialIcons name="speed" size={24} color={C.primary} />
            <View style={s.bentoTextCol}>
              <Text style={s.bentoTitle}>Instant Analysis</Text>
              <Text style={s.bentoDesc}>Real-time severity assessment based on your input.</Text>
            </View>
          </View>
        </View>

        {/* Continue CTA */}
        <TouchableOpacity style={s.continueBtn} onPress={onContinue}>
          <Text style={s.continueBtnText}>Continue to Triage</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={s.bottomNav}>
        <TouchableOpacity onPress={onGoToHome} style={s.navItem}>
          <MaterialIcons name="healing" size={24} color={C.onSecondaryFixedVariant} />
          <Text style={s.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onGoToHistory} style={s.navItem}>
          <MaterialIcons name="history" size={24} color={C.onSecondaryFixedVariant} />
          <Text style={s.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onGoToProfile} style={s.navItem}>
          <MaterialIcons name="person" size={24} color={C.onSecondaryFixedVariant} />
          <Text style={s.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.surface },
  bgBlobTop: { position: 'absolute', top: '10%', right: -100, width: 300, height: 300, backgroundColor: 'rgba(0,63,135,0.05)', borderRadius: 150 },
  bgBlobBottom: { position: 'absolute', bottom: '10%', left: -50, width: 250, height: 250, backgroundColor: 'rgba(72,97,118,0.05)', borderRadius: 125 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, height: 60 },
  brand: { flexDirection: 'row', alignItems: 'center' },
  brandText: { fontSize: 17, fontWeight: '800', color: C.primary, marginLeft: 8 },
  emergencyBtn: { backgroundColor: 'transparent', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  emergencyText: { color: C.primary, fontSize: 13, fontWeight: 'bold', letterSpacing: 0.5 },

  scroll: { padding: 20, paddingBottom: 100 },

  headlineSection: { marginBottom: 32 },
  kicker: { fontSize: 11, fontWeight: '700', color: C.onSurfaceVariant, letterSpacing: 1, marginBottom: 8 },
  title: { fontSize: 36, fontWeight: '800', color: C.primary, lineHeight: 42, marginBottom: 16, letterSpacing: -1 },
  subtitle: { fontSize: 16, color: C.secondary, lineHeight: 24 },

  inputContainer: { position: 'relative', marginBottom: 32 },
  textArea: { backgroundColor: C.containerLow, minHeight: 220, borderRadius: 16, padding: 24, fontSize: 18, color: C.onSurface, paddingTop: 24 },
  micBtn: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },

  suggestionsSection: { marginBottom: 32 },
  suggestionsLabel: { fontSize: 11, fontWeight: '700', color: C.onSurfaceVariant, letterSpacing: 1, marginBottom: 16 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { backgroundColor: C.secondaryFixed, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24 },
  chipText: { fontSize: 14, fontWeight: '600', color: C.onSecondaryFixedVariant },

  bentoGrid: { gap: 16, marginBottom: 32 },
  bentoCard: { backgroundColor: C.container, padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  bentoTextCol: { flex: 1 },
  bentoTitle: { fontSize: 15, fontWeight: '700', color: C.onSurface, marginBottom: 4 },
  bentoDesc: { fontSize: 13, color: C.onSurfaceVariant, lineHeight: 18 },

  continueBtn: { backgroundColor: C.primary, paddingVertical: 18, borderRadius: 30, alignItems: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 },
  continueBtnText: { fontSize: 16, fontWeight: '800', color: C.white, letterSpacing: 0.5 },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: 'rgba(255,255,255,0.92)', borderTopWidth: 1, borderTopColor: '#eceef1', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  navText: { fontSize: 12, fontWeight: '500', color: C.onSecondaryFixedVariant, marginTop: 4 },
});
