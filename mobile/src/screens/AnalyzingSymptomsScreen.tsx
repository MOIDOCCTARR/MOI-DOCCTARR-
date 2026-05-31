import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, ImageBackground } from 'react-native';
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
  containerLowest: '#ffffff',
  container: '#eceef1',
  emergency: '#b10f2b',
  outline: '#727784',
  outlineVariant: '#c2c6d4',
  white: '#ffffff',
  secondaryContainer: '#cbe6ff',
};

interface Props { onFinishAnalysis?: () => void; }

export default function AnalyzingSymptomsScreen({ onFinishAnalysis }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Looping pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Simulate finish analysis after some time (optional, can be hooked up if user wants)
    // const timer = setTimeout(() => { onFinishAnalysis?.(); }, 4000);
    // return () => clearTimeout(timer);
  }, [pulseAnim, onFinishAnalysis]);

  return (
    <ImageBackground
      source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXsSvrqw9IP8deMl7Ek7apXTI6h8rozx7gIO-RWTYt9LanS76x2jk3YOnNWjbAuSgjYTl1A9rABz6_YYlDKHR66UTnJv5OdiJnGpvi-5X5nXZMlU3sPPImmyE9xdtGAwLxzuiwI_Z3tKnSwXeZV4DLlC44PoJ6sf5ctrpvzSeHV3jML2ybQwPMY-kjmC2P1j1Ve3HERLubG7m6hTa_nDFDi6ZwQyVOWGgQH8jtiV41EZEQsibUI2TlF7j4kPu2SUXbfgSWLGGRldc' }}
      style={s.bgImage}
      imageStyle={{ opacity: 0.15 }}
    >
      <SafeAreaView style={s.safe}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.brand}>
            <MaterialIcons name="assignment" size={22} color={C.primary} />
            <Text style={s.brandText}>MOI DOCTAR</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.statusText}>STATUS: PROCESSING</Text>
            <TouchableOpacity style={s.emergencyBtn}>
              <Text style={s.emergencyText}>EMERGENCY</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.main}>
          {/* Animated Hub */}
          <Animated.View style={[s.hubContainer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={s.hubCircle}>
              <MaterialIcons name="psychology" size={54} color={C.white} />
            </View>
          </Animated.View>

          <Animated.Text style={[s.title, { transform: [{ scale: pulseAnim }], opacity: pulseAnim }]}>
            Analyzing your symptoms...
          </Animated.Text>
          <Text style={s.subtitle}>This will only take a moment</Text>

          {/* Progress Breakdown */}
          <View style={s.grid}>
            {/* Step 1 */}
            <View style={s.card}>
              <View style={s.cardHeader}>
                <View style={[s.iconBox, { backgroundColor: C.secondaryContainer }]}>
                  <MaterialIcons name="storage" size={20} color={C.primary} />
                </View>
              </View>
              <Text style={s.cardLabel}>PROCESSING</Text>
              <Text style={s.cardTitle}>Cross-referencing database</Text>
              <View style={s.barBg}><View style={[s.barFill, { width: '100%', backgroundColor: C.primary }]} /></View>
            </View>

            {/* Step 2 */}
            <View style={s.card}>
              <View style={s.cardHeader}>
                <View style={[s.iconBox, { backgroundColor: C.secondaryContainer }]}>
                  <MaterialIcons name="monitor-heart" size={20} color={C.primary} />
                </View>
              </View>
              <Text style={s.cardLabel}>STATUS</Text>
              <Text style={s.cardTitle}>Identifying patterns</Text>
              <View style={s.barBg}><View style={[s.barFill, { width: '75%', backgroundColor: C.primary }]} /></View>
            </View>

            {/* Step 3 */}
            <View style={s.card}>
              <View style={s.cardHeader}>
                <View style={[s.iconBox, { backgroundColor: C.container }]}>
                  <MaterialIcons name="assignment" size={20} color={C.outline} />
                </View>
              </View>
              <Text style={s.cardLabel}>NEXT STEP</Text>
              <Text style={s.cardTitle}>Generating report</Text>
              <View style={s.barBg}><View style={[s.barFill, { width: '15%', backgroundColor: C.outlineVariant }]} /></View>
            </View>
          </View>

          {/* Footnote */}
          <TouchableOpacity onPress={onFinishAnalysis} style={s.footnote}>
            <MaterialIcons name="verified-user" size={16} color={C.primary} />
            <Text style={s.footnoteText}>AI-Assisted Triage. For information only.</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bgImage: { flex: 1, backgroundColor: C.surface },
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, height: 60 },
  brand: { flexDirection: 'row', alignItems: 'center' },
  brandText: { fontSize: 17, fontWeight: '800', color: C.primary, marginLeft: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusText: { fontSize: 9, fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: 1 },
  emergencyBtn: { backgroundColor: C.emergency, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  emergencyText: { color: C.white, fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },

  main: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  
  hubContainer: { marginBottom: 40, alignItems: 'center', justifyContent: 'center' },
  hubCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  
  title: { fontSize: 28, fontWeight: '800', color: C.onSurface, textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: C.onSurfaceVariant, textAlign: 'center', marginBottom: 50 },

  grid: { width: '100%', gap: 16, maxWidth: 500 },
  card: { backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.4)' },
  cardHeader: { flexDirection: 'row', marginBottom: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  cardLabel: { fontSize: 10, fontWeight: '700', color: C.onSurfaceVariant, letterSpacing: 1, marginBottom: 4 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: C.onSurface, marginBottom: 12 },
  barBg: { height: 4, width: '100%', backgroundColor: C.container, borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },

  footnote: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.containerLow, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, marginTop: 50 },
  footnoteText: { fontSize: 11, fontWeight: '500', color: '#30495d' },
});
