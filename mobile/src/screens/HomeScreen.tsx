import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const C = {
  primary: '#003f87',
  primaryContainer: '#0056b3',
  secondary: '#486176',
  surface: '#f7f9fc',
  onSurface: '#191c1e',
  onSurfaceVariant: '#424752',
  containerLow: '#f2f4f7',
  containerLowest: '#ffffff',
  containerHighest: '#e0e3e6',
  emergency: '#b10f2b',
  outline: '#727784',
  white: '#ffffff',
  secondaryFixed: '#cbe6ff',
  onSecondaryFixedVariant: '#30495d',
  green: '#28A745',
};

interface Props {
  onStartSymptomCheck?: () => void;
  onGoToBodyMap?: () => void;
  onGoToVoiceInput?: () => void;
  onGoToHistory?: () => void;
  onGoToProfile?: () => void;
}

export default function HomeScreen({ onStartSymptomCheck, onGoToBodyMap, onGoToVoiceInput, onGoToHistory, onGoToProfile }: Props) {
  return (
    <SafeAreaView style={s.safe}>
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
        {/* Hero Section */}
        <View style={s.hero}>
          <View style={s.logoWrapper}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRGrh0FEVvwR0LxvqPqtNgk0PTz27lixSDxqCzUJI-_dvhMmeG-N_3VaYrkgaaSV2fwASFyT8dgSF367kA77zSzYqS-XeQGjEkuXdxYstWGP4aFeiNleCy2ttTRHFXKRkY69G9SAMJzxhzi2beM69yLg4Gqw1jqmOz4zbIA-KfKEFG90TSBDi8l_vNcSeDw9t9ZFzYAj3aUsT1NAmvS7d8a5FrHlEl5_aGHpytRwhp-5fHu4JgJLw8Hh4GbrWK1cAnw1iEUgOousI' }}
              style={s.logo} 
            />
          </View>
          <Text style={s.welcomeText}>WELCOME BACK</Text>
          <Text style={s.heroTitle}>How are you feeling today?</Text>
        </View>

        {/* Primary CTA Area */}
        <View style={s.ctaCard}>
          <View style={s.ctaIconBox}>
            <MaterialIcons name="health-and-safety" size={36} color={C.white} />
          </View>
          <Text style={s.ctaTitle}>Check Your Symptoms</Text>
          <Text style={s.ctaDesc}>Fast, clinical-grade analysis using advanced diagnostic protocols.</Text>
          <TouchableOpacity style={s.ctaBtn} onPress={onStartSymptomCheck}>
            <Text style={s.ctaBtnText}>Start Symptom Check</Text>
          </TouchableOpacity>
        </View>

        {/* Bento Quick Options */}
        <View style={s.bentoGrid}>
          <TouchableOpacity style={s.bentoCard} onPress={onGoToVoiceInput}>
            <View style={s.bentoIconBg}>
              <MaterialIcons name="mic" size={24} color={C.onSecondaryFixedVariant} />
            </View>
            <Text style={s.bentoTitle}>Voice Input</Text>
            <Text style={s.bentoDesc}>Describe symptoms orally</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.bentoCard} onPress={onGoToBodyMap}>
            <View style={s.bentoIconBg}>
              <MaterialIcons name="accessibility-new" size={24} color={C.onSecondaryFixedVariant} />
            </View>
            <Text style={s.bentoTitle}>Body Map</Text>
            <Text style={s.bentoDesc}>Locate pain visually</Text>
          </TouchableOpacity>
        </View>

        {/* Secondary Info Cards */}
        <Text style={s.sectionLabel}>HEALTH INSIGHTS</Text>
        
        <View style={s.insightCard}>
          <View style={s.insightIconWhite}>
            <MaterialIcons name="favorite" size={24} color={C.primary} />
          </View>
          <View style={s.insightRight}>
            <View style={s.insightRow}>
              <Text style={s.insightTitle}>Vital Overview</Text>
              <Text style={s.insightTime}>2 mins ago</Text>
            </View>
            <View style={s.progressBarBg}>
              <View style={[s.progressBarFill, { width: '75%' }]} />
            </View>
          </View>
        </View>

        <View style={[s.insightCard, s.insightCardBorder]}>
          <View style={s.insightRight}>
            <Text style={s.tipLabel}>DAILY TIP</Text>
            <Text style={s.tipDesc}>Stay hydrated! Aim for 8 glasses of water today for optimal mental clarity.</Text>
          </View>
          <MaterialIcons name="water-drop" size={24} color={C.onSurfaceVariant} />
        </View>

      </ScrollView>

      {/* Bottom Nav */}
      <View style={s.bottomNav}>
        <TouchableOpacity style={s.navItemActive}>
          <MaterialIcons name="healing" size={24} color={C.primary} />
          <Text style={s.navTextActive}>Home</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, height: 60, backgroundColor: C.surface },
  brand: { flexDirection: 'row', alignItems: 'center' },
  brandText: { fontSize: 17, fontWeight: '800', color: C.primary, marginLeft: 8 },
  emergencyBtn: { backgroundColor: 'rgba(177, 15, 43, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  emergencyText: { color: C.emergency, fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },

  scroll: { padding: 20, paddingBottom: 100 },

  hero: { alignItems: 'center', marginBottom: 32 },
  logoWrapper: { width: 96, height: 96, borderRadius: 48, overflow: 'hidden', marginBottom: 16, backgroundColor: C.white, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  logo: { width: '100%', height: '100%' },
  welcomeText: { fontSize: 10, fontWeight: '800', color: C.onSurfaceVariant, letterSpacing: 1, marginBottom: 8 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: C.onSurface, textAlign: 'center', letterSpacing: -0.5 },

  ctaCard: { backgroundColor: C.primary, padding: 32, borderRadius: 32, alignItems: 'center', marginBottom: 20, shadowColor: C.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 5 },
  ctaIconBox: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 24, marginBottom: 16 },
  ctaTitle: { fontSize: 20, fontWeight: '800', color: C.white, marginBottom: 8 },
  ctaDesc: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 24, lineHeight: 18 },
  ctaBtn: { backgroundColor: C.containerLowest, width: '100%', paddingVertical: 16, borderRadius: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  ctaBtnText: { fontSize: 15, fontWeight: '800', color: C.primary },

  bentoGrid: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  bentoCard: { flex: 1, backgroundColor: C.containerLowest, padding: 24, borderRadius: 24, alignItems: 'center' },
  bentoIconBg: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.secondaryFixed, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  bentoTitle: { fontSize: 14, fontWeight: '700', color: C.onSurface, marginBottom: 4 },
  bentoDesc: { fontSize: 11, color: C.onSurfaceVariant, textAlign: 'center' },

  sectionLabel: { fontSize: 10, fontWeight: '800', color: C.onSurfaceVariant, letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
  insightCard: { backgroundColor: C.containerLow, padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  insightIconWhite: { width: 48, height: 48, backgroundColor: C.white, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  insightRight: { flex: 1 },
  insightRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  insightTitle: { fontSize: 14, fontWeight: '700', color: C.onSurface },
  insightTime: { fontSize: 10, color: C.onSurfaceVariant },
  progressBarBg: { height: 6, backgroundColor: C.containerHighest, borderRadius: 3, width: '100%', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: C.primary, borderRadius: 3 },

  insightCardBorder: { borderLeftWidth: 4, borderLeftColor: C.green },
  tipLabel: { fontSize: 10, fontWeight: '800', color: C.green, letterSpacing: 1, marginBottom: 4 },
  tipDesc: { fontSize: 13, fontWeight: '500', color: C.onSurface, lineHeight: 18 },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: 'rgba(255,255,255,0.92)', borderTopWidth: 1, borderTopColor: '#eceef1', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  navItemActive: { alignItems: 'center', justifyContent: 'center', backgroundColor: C.secondaryFixed, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 6 },
  navText: { fontSize: 10, color: C.onSecondaryFixedVariant, marginTop: 2 },
  navTextActive: { fontSize: 10, fontWeight: 'bold', color: C.primary, marginTop: 2 },
});
