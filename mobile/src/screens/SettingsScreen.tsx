import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, Switch, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';




const COLORS = {
  primary: '#003f87',
  secondary: '#486176',
  surface: '#f7f9fc',
  onSurface: '#191c1e',
  containerLow: '#f2f4f7',
  containerHigh: '#e6e8eb',
  containerLowest: '#ffffff',
  emergency: '#b10f2b',
  chipBg: '#cbe6ff',
  chipText: '#001e30',
  outline: '#727784',
  green: '#198754',
  white: '#ffffff',
};

export default function SettingsScreen({ onBack }: { onBack?: () => void }) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.brandContainer}>
          <MaterialIcons name="assignment" size={24} color={COLORS.primary} />
          <Text style={styles.brandText}>MOI DOCTAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emergencyBtn}>
          <Text style={styles.emergencyText}>EMERGENCY</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.heading}>Settings</Text>
          <Text style={styles.subheading}>Customize your clinical experience and data preferences.</Text>
        </View>

        {/* Doctor Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmsu-ji0vZr-94zbRNffGQfKUqUQswh6Wzig1WZhLIrfbgA-s5gVWFRi1gcFj69AxsfhO-cHFo46xwfh3zZUbnaLGx9iXT0MzHJpFRZ4ahVz0dsIEPVFdmFe4bQ4TzWjzbkieFTKAPuVEENLmD8LE2mo-qCxdHtsJfXKs_g0lTUTkkucpvAKxiJWW9Df9lMGemz5cvdnepLTkOaWEtwL4tph0WQbBz9am3b0W7L2APGpfh0f9LnXoNieHJMxWWzkuWIwuKQ1owZuA' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.profileName}>Dr. Julian Vance</Text>
            <Text style={styles.medicalId}>MEDICAL ID: 882-901</Text>
          </View>
        </View>

        {/* Quick Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsKicker}>QUICK STATS</Text>
          <View style={styles.syncRow}>
            <Text style={styles.statsLabel}>Data Sync Status</Text>
            <View style={styles.liveBadge}>
              <MaterialIcons name="cloud-done" size={14} color={COLORS.green} />
              <Text style={styles.liveText}> LIVE</Text>
            </View>
          </View>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
          <Text style={styles.storageText}>12.4GB / 20GB cloud storage used</Text>
        </View>

        {/* Preferences Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>APPLICATION PREFERENCES</Text>
          
          {/* Language Row */}
          <TouchableOpacity style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBg}>
                <MaterialIcons name="language" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Language</Text>
                <Text style={styles.rowSub}>System default: English</Text>
              </View>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowRightText}>English</Text>
              <MaterialIcons name="chevron-right" size={20} color={COLORS.primary} />
            </View>
          </TouchableOpacity>

          {/* Voice Settings Row */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBg}>
                <MaterialIcons name="record-voice-over" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Voice Settings</Text>
                <Text style={styles.rowSub}>AI assistant clarity</Text>
              </View>
            </View>
            <Switch
              value={voiceEnabled}
              onValueChange={setVoiceEnabled}
              trackColor={{ false: COLORS.containerHigh, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>

          {/* Notifications Row */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBg}>
                <MaterialIcons name="notifications-active" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Notifications</Text>
                <Text style={styles.rowSub}>Alerts for vitals</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.containerHigh, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>SECURITY & LEGAL</Text>
          
          {/* Privacy Row */}
          <TouchableOpacity onPress={() => Linking.openURL('https://moidoctar.com/privacy')} style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBg}>
                <MaterialIcons name="security" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Privacy Policy</Text>
                <Text style={styles.rowSub}>Review HIPAA compliance</Text>
              </View>
            </View>
            <MaterialIcons name="open-in-new" size={18} color={COLORS.outline} />
          </TouchableOpacity>

          {/* Disclaimer Row */}
          <TouchableOpacity onPress={() => Linking.openURL('https://moidoctar.com/disclaimer')} style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBg}>
                <MaterialIcons name="gavel" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Disclaimer</Text>
                <Text style={styles.rowSub}>Medical liability</Text>
              </View>
            </View>
            <MaterialIcons name="info" size={18} color={COLORS.outline} />
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>SAVE ALL CHANGES</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav Bar (Simulated) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={onBack} style={styles.navItem}>
          <MaterialIcons name="healing" size={24} color={COLORS.secondary} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="history" size={24} color={COLORS.secondary} />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive}>
          <MaterialIcons name="person" size={24} color={COLORS.primary} />
          <Text style={styles.navTextActive}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eceef1',
    backgroundColor: COLORS.surface,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    marginLeft: 8,
  },
  emergencyBtn: {
    backgroundColor: COLORS.emergency,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  emergencyText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Leave space for bottom nav
  },
  titleSection: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: COLORS.secondary,
    lineHeight: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.containerLowest,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eceef1',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.onSurface,
  },
  medicalId: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.outline,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: COLORS.containerLow,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  statsKicker: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.outline,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  syncRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.green,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: COLORS.containerHigh,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '75%',
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  storageText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: COLORS.secondary,
  },
  sectionCard: {
    backgroundColor: COLORS.containerLowest,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eceef1',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.outline,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f4f7',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.containerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  rowSub: {
    fontSize: 11,
    color: COLORS.secondary,
    marginTop: 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowRightText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 4,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 26,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#eceef1',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  navItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.chipBg,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  navText: {
    fontSize: 10,
    color: COLORS.secondary,
    marginTop: 2,
  },
  navTextActive: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 2,
  },
});
