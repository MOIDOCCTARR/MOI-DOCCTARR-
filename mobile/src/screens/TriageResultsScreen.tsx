import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const C = {
  primary: '#003f87',
  secondary: '#486176',
  surface: '#f7f9fc',
  onSurface: '#191c1e',
  onSurfaceVariant: '#424752',
  containerLow: '#f2f4f7',
  containerLowest: '#ffffff',
  container: '#eceef1',
  emergency: '#b10f2b',
  outline: '#727784',
  outlineVariant: '#c2c6d4',
  chipBg: '#cbe6ff',
  white: '#ffffff',
  amber: '#f59e0b',
  amberLight: '#fef3c7',
  amberDark: '#92400e',
  secondaryFixed: '#cbe6ff',
};

const conditions = [
  { icon: 'medication' as const, match: '82% Match', name: 'Acute Sinusitis', desc: 'Inflammation of the sinuses caused by viral infection or allergies.' },
  { icon: 'thermostat' as const, match: '45% Match', name: 'Allergic Rhinitis', desc: 'A seasonal response to environmental triggers like pollen or dust.' },
];

const followUps = [
  'Are you experiencing a persistent fever over 101°F?',
  'Has the headache worsened in the last hour?',
];

interface Props { onBack?: () => void; onGoToProfile?: () => void; onGoToHistory?: () => void; }

export default function TriageResultsScreen({ onBack, onGoToProfile, onGoToHistory }: Props) {
  const [answers, setAnswers] = useState<Record<number, 'yes' | 'no' | null>>({ 0: null, 1: null });

  const toggle = (i: number, val: 'yes' | 'no') =>
    setAnswers(prev => ({ ...prev, [i]: prev[i] === val ? null : val }));



  
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
        {/* Urgency Card */}
        <View style={s.urgencyCard}>
          <View style={s.urgencyAccent} />
          <View style={s.urgencyBody}>
            <View style={s.urgencyLeft}>
              <View style={s.urgencyBadge}>
                <Text style={s.urgencyBadgeText}>URGENCY LEVEL: ELEVATED</Text>
              </View>
              <Text style={s.urgencyHeadline}>Moderate Concern.</Text>
              <Text style={s.urgencySubtext}>
                Your symptoms suggest a need for professional evaluation within the next 24 hours.
              </Text>
            </View>
            <View style={s.urgencyIcon}>
              <MaterialIcons name="warning" size={48} color={C.amber} />
              <Text style={s.yellowZone}>Yellow Zone</Text>
            </View>
          </View>
        </View>

        {/* Possible Conditions */}
        <Text style={s.sectionTitle}>Possible Conditions</Text>
        <View style={s.conditionsGrid}>
          {conditions.map((cond, i) => (
            <View key={i} style={[s.condCard, i === 1 && { backgroundColor: C.containerLow }]}>
              <View style={s.condCardHeader}>
                <View style={s.condIconBg}>
                  <MaterialIcons name={cond.icon} size={20} color={C.primary} />
                </View>
                <Text style={s.matchText}>{cond.match}</Text>
              </View>
              <Text style={s.condName}>{cond.name}</Text>
              <Text style={s.condDesc}>{cond.desc}</Text>
            </View>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={s.disclaimer}>
          <MaterialIcons name="info" size={18} color={C.outline} style={{ marginTop: 2 }} />
          <Text style={s.disclaimerText}>
            DISCLAIMER: This is an automated assessment. It is NOT a clinical diagnosis. Call emergency services immediately for severe symptoms.
          </Text>
        </View>

        {/* Recommendation Card */}
        <View style={s.recCard}>
          <Text style={s.recKicker}>RECOMMENDED NEXT STEP</Text>
          <Text style={s.recTitle}>Schedule a Virtual Consultation</Text>
          <Text style={s.recBody}>
            A certified clinician can review your symptoms via video call to confirm treatment needs.
          </Text>
          <TouchableOpacity style={s.bookBtn}>
            <Text style={s.bookBtnText}>Book Appointment</Text>
            <MaterialIcons name="arrow-forward" size={16} color={C.primary} />
          </TouchableOpacity>
        </View>

        {/* Refine Results */}
        <View style={s.refineCard}>
          <Text style={s.refineTitle}>Refine Results</Text>
          {followUps.map((q, i) => (
            <View key={i} style={s.question}>
              <Text style={s.questionText}>{q}</Text>
              <View style={s.answerRow}>
                {(['yes', 'no'] as const).map(val => (
                  <TouchableOpacity
                    key={val}
                    onPress={() => toggle(i, val)}
                    style={[s.answerBtn, answers[i] === val && s.answerBtnActive]}
                  >
                    <Text style={[s.answerBtnText, answers[i] === val && s.answerBtnTextActive]}>
                      {val.charAt(0).toUpperCase() + val.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav (History active) */}
      <View style={s.bottomNav}>
        <TouchableOpacity onPress={onBack} style={s.navItem}>
          <MaterialIcons name="healing" size={24} color={C.secondary} />
          <Text style={s.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onGoToHistory} style={s.navItemActive}>
          <MaterialIcons name="history" size={24} color={C.primary} />
          <Text style={s.navTextActive}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onGoToProfile} style={s.navItem}>
          <MaterialIcons name="person" size={24} color={C.secondary} />
          <Text style={s.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, height: 60, borderBottomWidth: 1, borderBottomColor: '#eceef1', backgroundColor: C.containerLow },
  brand: { flexDirection: 'row', alignItems: 'center' },
  brandText: { fontSize: 17, fontWeight: '800', color: C.primary, marginLeft: 8 },
  emergencyBtn: { backgroundColor: C.emergency, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  emergencyText: { color: C.white, fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  scroll: { padding: 20, paddingBottom: 100 },

  // Urgency card
  urgencyCard: { backgroundColor: C.containerLowest, borderRadius: 20, marginBottom: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  urgencyAccent: { height: 4, backgroundColor: C.amber },
  urgencyBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, gap: 12 },
  urgencyLeft: { flex: 1 },
  urgencyBadge: { alignSelf: 'flex-start', backgroundColor: C.amberLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10 },
  urgencyBadgeText: { fontSize: 9, fontWeight: '800', color: C.amberDark, letterSpacing: 0.5 },
  urgencyHeadline: { fontSize: 28, fontWeight: '800', color: C.onSurface, marginBottom: 8 },
  urgencySubtext: { fontSize: 13, color: C.onSurfaceVariant, lineHeight: 19 },
  urgencyIcon: { alignItems: 'center', backgroundColor: C.container, borderRadius: 20, padding: 16, borderWidth: 3, borderColor: C.white },
  yellowZone: { fontSize: 11, fontWeight: '700', color: C.amberDark, marginTop: 6 },

  // Conditions
  sectionTitle: { fontSize: 18, fontWeight: '800', color: C.onSurface, marginBottom: 12 },
  conditionsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  condCard: { flex: 1, backgroundColor: C.containerLowest, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#eceef1' },
  condCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  condIconBg: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.secondaryFixed, alignItems: 'center', justifyContent: 'center' },
  matchText: { fontSize: 9, fontWeight: '800', color: C.outline, letterSpacing: 0.5 },
  condName: { fontSize: 14, fontWeight: '800', color: C.onSurface, marginBottom: 6 },
  condDesc: { fontSize: 11, color: C.onSurfaceVariant, lineHeight: 16 },

  // Disclaimer
  disclaimer: { flexDirection: 'row', gap: 10, backgroundColor: C.container, borderRadius: 12, padding: 14, borderLeftWidth: 4, borderLeftColor: C.outlineVariant, marginBottom: 20 },
  disclaimerText: { flex: 1, fontSize: 10, color: C.onSurfaceVariant, fontWeight: '600', letterSpacing: 0.3, lineHeight: 16 },

  // Recommendation
  recCard: { backgroundColor: C.primary, borderRadius: 24, padding: 24, marginBottom: 16 },
  recKicker: { fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.6)', letterSpacing: 0.8, marginBottom: 10 },
  recTitle: { fontSize: 20, fontWeight: '800', color: C.white, marginBottom: 10 },
  recBody: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 20, marginBottom: 20 },
  bookBtn: { backgroundColor: C.containerLowest, borderRadius: 24, height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  bookBtnText: { color: C.primary, fontWeight: '800', fontSize: 15 },

  // Refine
  refineCard: { backgroundColor: C.containerLowest, borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#eceef1' },
  refineTitle: { fontSize: 17, fontWeight: '800', color: C.onSurface, marginBottom: 16 },
  question: { marginBottom: 20 },
  questionText: { fontSize: 13, fontWeight: '600', color: C.onSurfaceVariant, marginBottom: 10, lineHeight: 18 },
  answerRow: { flexDirection: 'row', gap: 10 },
  answerBtn: { flex: 1, height: 38, borderRadius: 20, borderWidth: 1, borderColor: C.outlineVariant, alignItems: 'center', justifyContent: 'center' },
  answerBtnActive: { backgroundColor: C.chipBg, borderColor: C.primary },
  answerBtnText: { fontSize: 13, fontWeight: '700', color: C.onSurface },
  answerBtnTextActive: { color: C.primary },

  // Bottom Nav
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: 'rgba(255,255,255,0.92)', borderTopWidth: 1, borderTopColor: '#eceef1', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  navItemActive: { alignItems: 'center', justifyContent: 'center', backgroundColor: C.chipBg, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 6 },
  navText: { fontSize: 10, color: C.secondary, marginTop: 2 },
  navTextActive: { fontSize: 10, fontWeight: 'bold', color: C.primary, marginTop: 2 },
});
