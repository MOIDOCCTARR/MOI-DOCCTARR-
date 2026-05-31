import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  amber: '#eab308', // yellow-500
  amberBg: '#fef3c7', // yellow-100
  amberText: '#92400e', // yellow-800
  green: '#28A745',
  tertiaryContainer: '#b10f2b',
  tertiaryContainer10: 'rgba(177, 15, 43, 0.1)',
  secondaryContainer: '#cbe6ff',
};

const historyItems = [
  {
    date: 'OCT 24, 2023 • 08:15 AM',
    title: 'Acute Chest Pressure',
    badge: 'Emergency',
    badgeType: 'emergency',
    tags: ['Shortness of breath', 'Dizziness'],
    icon: 'medical-information' as const,
    recText: 'Recommended: ER Visit',
    iconColor: C.tertiaryContainer,
    stripe: '#b10f2b',
  },
  {
    date: 'OCT 12, 2023 • 02:30 PM',
    title: 'Persistent Migraine',
    badge: 'Urgent Care',
    badgeType: 'urgent',
    tags: ['Light sensitivity', 'Nausea'],
    icon: 'home-work' as const,
    recText: 'Recommended: Rest & Hydration',
    iconColor: '#ca8a04', // yellow-600
    stripe: C.amber,
  },
  {
    date: 'SEP 29, 2023 • 09:10 AM',
    title: 'Seasonal Allergy Flare',
    badge: 'Self Care',
    badgeType: 'self',
    tags: ['Sneezing', 'Itchy eyes'],
    icon: 'vaccines' as const,
    recText: 'Recommended: Antihistamines',
    iconColor: '#16a34a', // green-600
    stripe: C.green,
  },
  {
    date: 'SEP 15, 2023 • 06:45 PM',
    title: 'Minor Ankle Sprain',
    badge: 'Self Care',
    badgeType: 'self',
    tags: ['Mild swelling', 'Bruising'],
    icon: 'ice-skating' as const,
    recText: 'Recommended: R.I.C.E Method',
    iconColor: '#16a34a',
    stripe: C.green,
  },
];

interface Props { onGoToHome?: () => void; onGoToProfile?: () => void; }

export default function SymptomHistoryScreen({ onGoToHome, onGoToProfile }: Props) {
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
        <Text style={s.label}>CLINICAL RECORDS</Text>
        <Text style={s.title}>Symptom History</Text>
        <Text style={s.subtitle}>Review your past health assessments and clinical triage results.</Text>

        {/* Stats Grid */}
        <View style={s.statsGrid}>
          <View style={[s.statCard, s.statCardMain]}>
            <MaterialIcons name="analytics" size={20} color={C.primary} />
            <Text style={s.statLabel}>TOTAL CHECKS</Text>
            <Text style={s.statValueMain}>14</Text>
          </View>
          <View style={s.statsCol}>
            <View style={[s.statCardSmall, { backgroundColor: C.secondaryContainer, marginBottom: 16 }]}>
              <MaterialIcons name="check-circle" size={20} color="#30495d" />
              <Text style={[s.statLabel, { color: '#30495d' }]}>RESOLVED</Text>
              <Text style={[s.statValueSmall, { color: '#001e30' }]}>12</Text>
            </View>
            <View style={[s.statCardSmall, { backgroundColor: C.tertiaryContainer10 }]}>
              <MaterialIcons name="emergency" size={20} color="#88001c" />
              <Text style={[s.statLabel, { color: '#88001c' }]}>CRITICAL</Text>
              <Text style={[s.statValueSmall, { color: '#88001c' }]}>02</Text>
            </View>
          </View>
        </View>

        {/* History List */}
        <View style={s.list}>
          {historyItems.map((item, i) => (
            <TouchableOpacity key={i} style={s.card}>
              <View style={[s.cardStripe, { backgroundColor: item.stripe }]} />
              <View style={s.cardTop}>
                <View style={s.cardTitles}>
                  <Text style={s.cardDate}>{item.date}</Text>
                  <Text style={s.cardTitle}>{item.title}</Text>
                </View>
                <View style={[
                  s.badge,
                  item.badgeType === 'emergency' && s.badgeEmergency,
                  item.badgeType === 'urgent' && s.badgeUrgent,
                  item.badgeType === 'self' && s.badgeSelf,
                ]}>
                  <Text style={[
                    s.badgeText,
                    item.badgeType === 'emergency' && s.badgeTextEmergency,
                    item.badgeType === 'urgent' && s.badgeTextUrgent,
                    item.badgeType === 'self' && s.badgeTextSelf,
                  ]}>{item.badge}</Text>
                </View>
              </View>

              <View style={s.tagsRow}>
                {item.tags.map(t => (
                  <View key={t} style={s.tag}>
                    <Text style={s.tagText}>{t}</Text>
                  </View>
                ))}
              </View>

              <View style={s.cardBottom}>
                <View style={s.recRow}>
                  <MaterialIcons name={item.icon} size={16} color={item.iconColor} />
                  <Text style={s.recText}>{item.recText}</Text>
                </View>
                <View style={s.viewBtnRow}>
                  <Text style={s.viewBtnText}>VIEW SUMMARY</Text>
                  <MaterialIcons name="chevron-right" size={16} color={C.primary} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={s.loadMoreBtn}>
          <Text style={s.loadMoreText}>Load More Records</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={s.bottomNav}>
        <TouchableOpacity onPress={onGoToHome} style={s.navItem}>
          <MaterialIcons name="healing" size={24} color={C.secondary} />
          <Text style={s.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.navItemActive}>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, height: 60, backgroundColor: C.surface },
  brand: { flexDirection: 'row', alignItems: 'center' },
  brandText: { fontSize: 17, fontWeight: '800', color: C.primary, marginLeft: 8 },
  emergencyBtn: { backgroundColor: '#88001c', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  emergencyText: { color: C.white, fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  scroll: { padding: 20, paddingBottom: 100 },
  label: { fontSize: 10, fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: '800', color: C.onSurface, marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#30495d', marginBottom: 32, lineHeight: 22 },

  // Stats Grid
  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  statCard: { backgroundColor: C.containerLowest, borderRadius: 16, padding: 20, flex: 1 },
  statCardMain: { borderLeftWidth: 4, borderLeftColor: C.primary },
  statsCol: { flex: 1 },
  statCardSmall: { borderRadius: 16, padding: 16 },
  statLabel: { fontSize: 10, fontWeight: '700', color: C.onSurfaceVariant, letterSpacing: 1, marginTop: 8, marginBottom: 4 },
  statValueMain: { fontSize: 36, fontWeight: '800', color: C.onSurface },
  statValueSmall: { fontSize: 24, fontWeight: '700' },

  // List
  list: { gap: 24 },
  card: { backgroundColor: C.containerLowest, borderRadius: 16, padding: 20, overflow: 'hidden' },
  cardStripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 6 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  cardTitles: { flex: 1, paddingRight: 10 },
  cardDate: { fontSize: 10, fontWeight: '700', color: C.onSurfaceVariant, letterSpacing: 1, marginBottom: 6 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: C.onSurface },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeEmergency: { backgroundColor: C.tertiaryContainer },
  badgeUrgent: { backgroundColor: C.amberBg },
  badgeSelf: { backgroundColor: C.secondaryContainer },
  badgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  badgeTextEmergency: { color: C.white },
  badgeTextUrgent: { color: C.amberText },
  badgeTextSelf: { color: '#30495d' },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tag: { backgroundColor: C.container, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagText: { fontSize: 11, color: C.onSurfaceVariant },

  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: C.container },
  recRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  recText: { fontSize: 12, fontWeight: '500', color: C.onSurfaceVariant },
  viewBtnRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewBtnText: { fontSize: 11, fontWeight: '700', color: C.primary },

  loadMoreBtn: { backgroundColor: '#e6e8eb', paddingVertical: 14, borderRadius: 24, alignItems: 'center', marginTop: 40, marginBottom: 40 },
  loadMoreText: { fontSize: 14, fontWeight: '600', color: '#30495d' },

  // Bottom Nav
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: 'rgba(255,255,255,0.92)', borderTopWidth: 1, borderTopColor: '#eceef1', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  navItemActive: { alignItems: 'center', justifyContent: 'center', backgroundColor: C.chipBg, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 6 },
  navText: { fontSize: 10, color: C.secondary, marginTop: 2 },
  navTextActive: { fontSize: 10, fontWeight: 'bold', color: C.primary, marginTop: 2 },
});
