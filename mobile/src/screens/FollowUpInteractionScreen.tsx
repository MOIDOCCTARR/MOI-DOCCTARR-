import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
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
  containerHigh: '#e6e8eb',
  containerHighest: '#e0e3e6',
  emergency: '#b10f2b',
  outline: '#727784',
  outlineVariant: '#c2c6d4',
  white: '#ffffff',
  secondaryContainer: '#cbe6ff',
  secondaryFixed: '#cbe6ff',
  onSecondaryContainer: '#4e677c',
  onSecondaryFixedVariant: '#30495d',
};

const windowWidth = Dimensions.get('window').width;

interface Props {
  onBack?: () => void;
  onNext?: () => void;
}

export default function FollowUpInteractionScreen({ onBack, onNext }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handlePress = () => {
    onNext?.();
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.brand}>
          <MaterialIcons name="assignment" size={22} color={C.primary} />
          <Text style={s.brandText}>MOI DOCTAR</Text>
        </View>
        <View style={s.headerRight}>
          <Text style={s.sessionText}>SESSION ID: #8291</Text>
          <TouchableOpacity style={s.emergencyBtn}>
            <Text style={s.emergencyText}>EMERGENCY</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Progress Indicator */}
        <View style={s.progressSection}>
          <View style={s.progressRow}>
            <Text style={s.progressLabel}>TRIAGE PROGRESS</Text>
            <Text style={s.progressValue}>4 of 7 Questions</Text>
          </View>
          <View style={s.progressBarBg}>
            <View style={[s.progressBarFill, { width: '57%' }]} />
          </View>
        </View>

        {/* Chat Interface */}
        <View style={s.chatSection}>
          {/* Assistant Msg */}
          <View style={s.msgWrapper}>
            <View style={s.assistantLabelRow}>
              <View style={s.avatarBox}>
                <MaterialIcons name="smart-toy" size={14} color={C.primary} />
              </View>
              <Text style={s.assistantLabelText}>CLINICAL ASSISTANT</Text>
            </View>
            <View style={s.bubble}>
              <Text style={s.bubbleHeadline}>Have you had a fever for more than 48 hours?</Text>
              <Text style={s.bubbleBody}>
                A prolonged fever helps us determine the severity of a potential infection and necessary intervention levels.
              </Text>
            </View>
          </View>

          {/* Choices */}
          <View style={s.choices}>
            {[
              { label: 'Yes, I have', icon: 'check-circle' },
              { label: "No, I haven't", icon: 'cancel' },
              { label: "I'm not sure", icon: 'help' }
            ].map((choice, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                onPress={handlePress}
                style={s.choiceBtn}
              >
                <View style={s.choiceLeft}>
                  <View style={s.choiceIconBox}>
                    <MaterialIcons name={choice.icon as any} size={20} color={C.primary} />
                  </View>
                  <Text style={s.choiceText}>{choice.label}</Text>
                </View>
                <MaterialIcons name="arrow-forward" size={20} color={C.outlineVariant} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Guidance Note */}
          <View style={s.guidanceBox}>
            <MaterialIcons name="info" size={20} color={C.onSecondaryContainer} />
            <Text style={s.guidanceText}>
              Your data is encrypted. We use this information to prioritize your care in our clinical queue.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Contextual Controls */}
      <View style={s.bottomControls}>
        <TouchableOpacity onPress={onBack} style={s.prevBtn}>
          <MaterialIcons name="arrow-back" size={20} color={C.onSecondaryFixedVariant} />
          <Text style={s.prevText}>PREVIOUS</Text>
        </TouchableOpacity>
        
        <View style={s.bottomRight}>
          {windowWidth > 380 && (
            <View style={s.estTimeBox}>
              <Text style={s.estTimeLabel}>EST. TIME REMAINING</Text>
              <Text style={s.estTimeValue}>2 Minutes</Text>
            </View>
          )}
          <TouchableOpacity style={s.pauseBtn}>
            <MaterialIcons name="pause" size={24} color={C.onSecondaryFixedVariant} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, height: 60, backgroundColor: C.surface },
  brand: { flexDirection: 'row', alignItems: 'center' },
  brandText: { fontSize: 17, fontWeight: '800', color: C.primary, marginLeft: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sessionText: { fontSize: 10, fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: 1, display: 'none' }, // Can be hidden on very small screens, let's keep it if fits. Let's just rely on flex wrap or hidden if needed. For now keeping it.
  emergencyBtn: { backgroundColor: C.emergency, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  emergencyText: { color: C.white, fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },

  scroll: { padding: 20, paddingBottom: 100 },

  progressSection: { marginBottom: 32 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressLabel: { fontSize: 10, fontWeight: '800', color: C.onSurfaceVariant, letterSpacing: 1 },
  progressValue: { fontSize: 10, fontWeight: '800', color: C.primary },
  progressBarBg: { width: '100%', height: 6, backgroundColor: C.container, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: C.primary, borderRadius: 3 },

  chatSection: { gap: 40 },
  msgWrapper: { gap: 8 },
  assistantLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4 },
  avatarBox: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.secondaryFixed, alignItems: 'center', justifyContent: 'center' },
  assistantLabelText: { fontSize: 10, fontWeight: '800', color: C.onSurfaceVariant, letterSpacing: 1 },
  bubble: { backgroundColor: C.containerLowest, padding: 24, borderRadius: 24, borderTopLeftRadius: 0, borderWidth: 1, borderColor: 'rgba(114,119,132,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 16, elevation: 1 },
  bubbleHeadline: { fontSize: 24, fontWeight: '800', color: C.onSurface, letterSpacing: -0.5, marginBottom: 12, lineHeight: 30 },
  bubbleBody: { fontSize: 15, color: C.onSurfaceVariant, lineHeight: 22 },

  choices: { gap: 12 },
  choiceBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.containerLowest, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(114,119,132,0.1)' },
  choiceLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  choiceIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.container, alignItems: 'center', justifyContent: 'center' },
  choiceText: { fontSize: 16, fontWeight: '600', color: C.onSurface },

  guidanceBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: 'rgba(203, 230, 255, 0.3)', padding: 16, borderRadius: 16 },
  guidanceText: { flex: 1, fontSize: 13, color: C.onSecondaryFixedVariant, lineHeight: 18 },

  bottomControls: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  prevBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 12 },
  prevText: { fontSize: 12, fontWeight: '800', color: C.onSecondaryFixedVariant, letterSpacing: 1 },
  bottomRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  estTimeBox: { alignItems: 'flex-end' },
  estTimeLabel: { fontSize: 9, fontWeight: '800', color: C.onSurfaceVariant, letterSpacing: 1 },
  estTimeValue: { fontSize: 12, fontWeight: '800', color: C.primary },
  pauseBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.containerHigh, alignItems: 'center', justifyContent: 'center' },
});
