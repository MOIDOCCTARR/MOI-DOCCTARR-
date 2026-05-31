import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons as VectorIcons } from '@expo/vector-icons';





const COLORS = {
  primary: '#003f87',
  secondary: '#486176',
  surface: '#f7f9fc',
  onSurface: '#191c1e',
  containerLow: '#f2f4f7',
  containerLowest: '#ffffff',
  emergency: '#b10f2b',
  outline: '#727784',
  chipBg: '#cbe6ff',
  error: '#ba1a1a',
  white: '#ffffff',
  containerHigh: '#e6e8eb',
};

interface ProfileScreenProps {
  onBack?: () => void;
  onGoToSettings?: () => void;
  onGoToHistory?: () => void;
  onGoToHome?: () => void;
}

export default function ProfileScreen({ onBack, onGoToSettings, onGoToHistory, onGoToHome }: ProfileScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.brandContainer}>
          <VectorIcons name="assignment" size={24} color={COLORS.primary} />
          <Text style={styles.brandText}>MOI DOCTAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emergencyBtn}>
          <Text style={styles.emergencyText}>EMERGENCY</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Profile Section */}
        <View style={styles.heroSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUed2bUo-F_SJ1ua7h2IAcjpb3v1nIXa8OZ_C4md-we-eER1Y_xlp6I81Xh9J6qz60tHTSZpSnngEycJDmalNzb0lDXGuK2XHZD0rppEpihX9GMcNEdYQadG2QS6pFw34Jh1pSEoyW5W51rLp--rGiLByVAIH_-kFoDoFIjVu5c45TEhBGgJuxBU3Pxizym-hBObpelBK5z2-vWKcEvs7WPSgF7RhODSZESPZwGrSI9ESrpmqCYJGqWQcOK9xsMz8Nz-2WVx0TLEo' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editBtn}>
              <VectorIcons name="edit" size={14} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>Adrian Thorne</Text>
          <Text style={styles.patientId}>PATIENT ID: #MD-8829-X</Text>
        </View>

        {/* Bento Grid Stats */}
        <View style={styles.bentoGrid}>
          <View style={styles.bentoCard}>
            <VectorIcons name="bloodtype" size={28} color={COLORS.primary} />
            <View>
              <Text style={styles.bentoLabel}>BLOOD GROUP</Text>
              <Text style={styles.bentoValue}>O Positive</Text>
            </View>
          </View>
          
          <View style={styles.bentoCard}>
            <VectorIcons name="favorite" size={28} color={COLORS.primary} />
            <View>
              <Text style={styles.bentoLabel}>LAST CHECKUP</Text>
              <Text style={styles.bentoValue}>12 Oct, 2023</Text>
            </View>
          </View>
        </View>

        {/* Personal Details Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <TouchableOpacity><Text style={styles.editLink}>Edit Details</Text></TouchableOpacity>
          </View>

          <View style={styles.contactList}>
            {/* Email Address */}
            <View style={styles.contactRow}>
              <View style={styles.iconBg}>
                <VectorIcons name="mail" size={18} color={COLORS.secondary} />
              </View>
              <View>
                <Text style={styles.contactLabel}>EMAIL ADDRESS</Text>
                <Text style={styles.contactValue}>adrian.thorne@example.health</Text>
              </View>
            </View>

            {/* Primary Contact */}
            <View style={styles.contactRow}>
              <View style={styles.iconBg}>
                <VectorIcons name="call" size={18} color={COLORS.secondary} />
              </View>
              <View>
                <Text style={styles.contactLabel}>PRIMARY CONTACT</Text>
                <Text style={styles.contactValue}>+1 (555) 012-3456</Text>
              </View>
            </View>

            {/* Primary Address */}
            <View style={styles.contactRow}>
              <View style={styles.iconBg}>
                <VectorIcons name="location-on" size={18} color={COLORS.secondary} />
              </View>
              <View>
                <Text style={styles.contactLabel}>PRIMARY ADDRESS</Text>
                <Text style={styles.contactValue}>821 Medical Plaza, NY 10012</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Navigation entry points */}
        <View style={styles.listCard}>
          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemLeft}>
              <VectorIcons name="health-and-safety" size={22} color={COLORS.secondary} />
              <Text style={styles.listItemText}>Insurance & Billing</Text>
            </View>
            <VectorIcons name="chevron-right" size={20} color={COLORS.outline} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onGoToSettings} style={styles.listItem}>
            <View style={styles.listItemLeft}>
              <VectorIcons name="notifications-active" size={22} color={COLORS.secondary} />
              <Text style={styles.listItemText}>Notification Settings</Text>
            </View>
            <VectorIcons name="chevron-right" size={20} color={COLORS.outline} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onGoToSettings} style={styles.listItemLast}>
            <View style={styles.listItemLeft}>
              <VectorIcons name="settings" size={22} color={COLORS.secondary} />
              <Text style={styles.listItemText}>Account Settings</Text>
            </View>
            <VectorIcons name="chevron-right" size={20} color={COLORS.outline} />
          </TouchableOpacity>
        </View>

        {/* Logout Action */}
        <TouchableOpacity style={styles.logoutBtn}>
          <VectorIcons name="logout" size={18} color={COLORS.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={onGoToHome} style={styles.navItem}>
          <VectorIcons name="healing" size={24} color={COLORS.outline} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onGoToHistory} style={styles.navItem}>
          <VectorIcons name="history" size={24} color={COLORS.outline} />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive}>
          <VectorIcons name="person" size={24} color={COLORS.primary} />
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
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.onSurface,
    marginBottom: 4,
  },
  patientId: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondary,
    letterSpacing: 0.5,
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  bentoCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: COLORS.containerLowest,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eceef1',
  },
  bentoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.outline,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bentoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.onSurface,
  },
  sectionCard: {
    backgroundColor: COLORS.containerLowest,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eceef1',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.onSurface,
  },
  editLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  contactList: {
    gap: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  contactLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.outline,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.onSurface,
  },
  listCard: {
    backgroundColor: COLORS.containerLowest,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eceef1',
    overflow: 'hidden',
    marginBottom: 24,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f4f7',
  },
  listItemLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(186, 26, 26, 0.05)',
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.error,
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
