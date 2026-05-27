import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';






const COLORS = {
  primary: '#003f87',
  secondary: '#486176',
  surface: '#f7f9fc',
  onSurface: '#191c1e',
  containerLow: '#f2f4f7',
  containerHigh: '#e6e8eb',
  emergency: '#b10f2b',
  darkBlue: '#30495d',
  outline: '#727784',
  white: '#ffffff',
  chipBg: '#cbe6ff',
  chipText: '#001e30',
};

export default function ConnectionLostScreen({ onAccessOfflineData }: { onAccessOfflineData?: () => void }) {

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <MaterialIcons name="assignment" size={24} color={COLORS.primary} />
          <Text style={styles.brandText}>MOI DOCTAR</Text>
        </View>
        <TouchableOpacity style={styles.emergencyBtn}>
          <Text style={styles.emergencyText}>EMERGENCY</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Visual Element */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChCbAwQktOBL8iP1b8MplXUgFKnbY6EmCc9wQKIvdKXdfcoxqjUlPbIrIvAQZhb8XNTK2DKblF0KiQx0MkWIRC4NKahqKH2bWoBby9mrH-r2byFHOAOLeFVqfFqiP9VYHEplP6IOXuS5DIArLfUXE22EdjfYK-VKNJwM2QUVJz3N7W8mIinLqZ1Qy2A6qNwEBnQPtRgcW5nLYgeNxSdOzo_9WmZUUp6B0Iyy6iN15vyDORM-58Fw2dn6ketsqWT8FbrNEemdqUwkM' }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Overlaid status card */}
          <View style={styles.statusOverlay}>
            <View style={styles.statusRow}>
              <View style={styles.statusIconCircle}>
                <MaterialIcons name="portable-wifi-off" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.statusOverlayText}>CONNECTIVITY STATUS</Text>
            </View>
          </View>
        </View>

        {/* Message Content */}
        <View style={styles.contentContainer}>
          <View style={styles.offlineChip}>
            <Text style={styles.offlineChipText}>OFFLINE MODE</Text>
          </View>
          
          <Text style={styles.heading}>We've lost the heartbeat of your connection.</Text>
          
          <Text style={styles.description}>
            Don't worry, your health records are safe. It looks like your device isn't currently connected to the internet. Let's get you back online.
          </Text>

          {/* Guidance Cards */}
          <View style={styles.guidanceContainer}>
            <View style={[styles.guideCard, { borderLeftColor: COLORS.primary }]}>
              <View style={styles.guideHeader}>
                <MaterialIcons name="wifi" size={20} color={COLORS.primary} />
                <Text style={styles.guideTitle}>Check Wi-Fi</Text>
              </View>
              <Text style={styles.guideText}>Ensure your router is active or try switching networks.</Text>
            </View>

            <View style={[styles.guideCard, { borderLeftColor: COLORS.secondary }]}>
              <View style={styles.guideHeader}>
                <MaterialIcons name="signal-cellular-alt" size={20} color={COLORS.secondary} />
                <Text style={styles.guideTitle}>Mobile Data</Text>
              </View>
              <Text style={styles.guideText}>Check signal strength or if data limits are reached.</Text>
            </View>
          </View>

          {/* Action Cluster */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Try Connecting Again</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onAccessOfflineData} style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>Access Saved Offline Data</Text>
            </TouchableOpacity>

          </View>

          {/* Help Link */}
          <TouchableOpacity onPress={() => Linking.openURL('https://moidoctar.com/support')} style={styles.helpLink}>
            <MaterialIcons name="help-outline" size={16} color={COLORS.outline} />
            <Text style={styles.helpText}>Need further assistance? Contact support</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <MaterialIcons name="verified-user" size={14} color={COLORS.outline} />
            <Text style={styles.footerText}>SECURE CLINICAL ENVIRONMENT</Text>
          </View>
          <Text style={styles.copyright}>© 2024 MOI DOCTAR HEALTH SYSTEMS</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLinkText} onPress={() => Linking.openURL('https://moidoctar.com/privacy')}>Privacy</Text>
            <Text style={[styles.footerLinkText, { marginLeft: 16 }]} onPress={() => Linking.openURL('https://moidoctar.com/terms')}>Terms</Text>
          </View>
        </View>
      </ScrollView>
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
    fontFamily: 'System', // Standard System font is cleanest/most concise fallback in RN
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
    padding: 24,
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    maxWidth: 360,
    aspectRatio: 1,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: COLORS.containerHigh,
    position: 'relative',
    marginBottom: 28,
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  statusOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statusOverlayText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.chipText,
    letterSpacing: 0.5,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 480,
  },
  offlineChip: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.chipBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  offlineChipText: {
    color: COLORS.chipText,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    lineHeight: 36,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.secondary,
    marginBottom: 24,
  },
  guidanceContainer: {
    gap: 12,
    marginBottom: 28,
  },
  guideCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.containerLow,
    borderLeftWidth: 4,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.onSurface,
    marginLeft: 8,
  },
  guideText: {
    fontSize: 13,
    color: COLORS.secondary,
    lineHeight: 18,
  },
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.containerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: COLORS.darkBlue,
    fontSize: 15,
    fontWeight: '600',
  },
  helpLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 40,
  },
  helpText: {
    fontSize: 13,
    color: COLORS.outline,
    marginLeft: 6,
    textDecorationLine: 'underline',
  },
  footer: {
    width: '100%',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.containerLow,
    alignItems: 'center',
    gap: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.outline,
    letterSpacing: 0.5,
  },
  copyright: {
    fontSize: 10,
    color: COLORS.outline,
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerLinkText: {
    fontSize: 11,
    color: COLORS.outline,
    textDecorationLine: 'underline',
  },
});
