import React, { useState } from 'react';
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
  containerHighest: '#e0e3e6',
  containerLowest: '#ffffff',
  container: '#eceef1',
  containerHigh: '#e6e8eb',
  emergency: '#b10f2b',
  outline: '#727784',
  white: '#ffffff',
  secondaryContainer: '#cbe6ff',
  onSecondaryFixedVariant: '#30495d',
  green: '#28A745',
};

interface Props {
  onBack?: () => void;
  onContinue?: () => void;
}

export default function BodyMapScreen({ onBack, onContinue }: Props) {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [selected, setSelected] = useState<string[]>(['Chest Area']);

  const toggleRegion = (region: string) => {
    setSelected(prev => 
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const isSelected = (region: string) => selected.includes(region);

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
        {/* Instructional Header */}
        <View style={s.instructionSection}>
          <Text style={s.stepText}>STEP 1 OF 3</Text>
          <Text style={s.title}>Where is the pain?</Text>
          <Text style={s.subtitle}>Tap the regions on the body map to specify the location of your symptoms.</Text>
        </View>

        {/* Body Map Area */}
        <View style={s.mapContainer}>
          {/* Toggle Front/Back */}
          <View style={s.toggleWrapper}>
            <View style={s.toggleBg}>
              <TouchableOpacity
                style={[s.toggleBtn, view === 'front' && s.toggleBtnActive]}
                onPress={() => setView('front')}
              >
                <Text style={[s.toggleText, view === 'front' && s.toggleTextActive]}>Front</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.toggleBtn, view === 'back' && s.toggleBtnActive]}
                onPress={() => setView('back')}
              >
                <Text style={[s.toggleText, view === 'back' && s.toggleTextActive]}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Image & Hotspots */}
          <View style={s.imageWrapper}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKZkpw7OuhKNaDd1m-yOtcU3Z2CKiEJwk9iUWfRtSfvyU3izsdtZOpU6WN5lAallH_cDcm2FSLSaMKwXxlX0qkt-RD9QL01PS0saG5gqz0WWq2JSB1JCURV-6jUE2imgDr3tXYW8tbpDP2jGgoSeTE6XA9vvPDAfQjYkpgHcW6dbBcWh0XB6XpQOEHvoHeDr_4KaKKw7PZl-F9LJWvTFUB1mM7sKipmBy8mdxUUTonQF2sUf_oscRfbJB2autawlCjDefYZ34DvKI' }}
              style={[s.bodyImage, { transform: [{ scaleX: view === 'back' ? -1 : 1 }] }]}
              resizeMode="contain"
            />
            
            {/* Interactive Regions (Approximated positions for demonstration) */}
            {view === 'front' && (
              <>
                {/* Head */}
                <TouchableOpacity
                  onPress={() => toggleRegion('Head')}
                  style={[s.hotspot, s.hotspotHead, isSelected('Head') && s.hotspotActive]}
                >
                  {isSelected('Head') && <MaterialIcons name="check" size={14} color={C.primary} />}
                  {!isSelected('Head') && <MaterialIcons name="add" size={14} color={C.primary} style={s.hotspotAdd} />}
                </TouchableOpacity>

                {/* Chest */}
                <TouchableOpacity
                  onPress={() => toggleRegion('Chest Area')}
                  style={[s.hotspot, s.hotspotChest, isSelected('Chest Area') && s.hotspotActive]}
                >
                  {isSelected('Chest Area') && <MaterialIcons name="check" size={18} color={C.primary} />}
                  {!isSelected('Chest Area') && <MaterialIcons name="add" size={18} color={C.primary} style={s.hotspotAdd} />}
                </TouchableOpacity>

                {/* Abdomen */}
                <TouchableOpacity
                  onPress={() => toggleRegion('Abdomen')}
                  style={[s.hotspot, s.hotspotAbdomen, isSelected('Abdomen') && s.hotspotActive]}
                >
                  {isSelected('Abdomen') && <MaterialIcons name="check" size={14} color={C.primary} />}
                  {!isSelected('Abdomen') && <MaterialIcons name="add" size={14} color={C.primary} style={s.hotspotAdd} />}
                </TouchableOpacity>

                {/* Knees */}
                <TouchableOpacity
                  onPress={() => toggleRegion('Left Knee')}
                  style={[s.hotspot, s.hotspotKneeL, isSelected('Left Knee') && s.hotspotActive]}
                />
                <TouchableOpacity
                  onPress={() => toggleRegion('Right Knee')}
                  style={[s.hotspot, s.hotspotKneeR, isSelected('Right Knee') && s.hotspotActive]}
                />
              </>
            )}
          </View>

          {/* Zoom Controls */}
          <View style={s.zoomControls}>
            <TouchableOpacity style={s.zoomBtn}>
              <MaterialIcons name="zoom-in" size={20} color={C.onSurface} />
            </TouchableOpacity>
            <TouchableOpacity style={s.zoomBtn}>
              <MaterialIcons name="zoom-out" size={20} color={C.onSurface} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Selected Regions Summary */}
        <View style={s.selectedSection}>
          <Text style={s.selectedTitle}>SELECTED ({selected.length})</Text>
          <View style={s.chipsRow}>
            {selected.map(region => (
              <View key={region} style={s.chip}>
                <Text style={s.chipText}>{region}</Text>
                <TouchableOpacity onPress={() => toggleRegion(region)} style={s.chipClose}>
                  <MaterialIcons name="close" size={16} color={C.onSecondaryFixedVariant} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={s.footer}>
        <TouchableOpacity style={s.clearBtn} onPress={() => setSelected([])}>
          <Text style={s.clearBtnText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.continueBtn} onPress={onContinue}>
          <Text style={s.continueBtnText}>Continue</Text>
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
  emergencyBtn: { backgroundColor: '#b10f2b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  emergencyText: { color: C.white, fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },

  scroll: { padding: 20, paddingBottom: 40 },

  instructionSection: { marginBottom: 24 },
  stepText: { fontSize: 10, fontWeight: '800', color: C.onSurfaceVariant, letterSpacing: 1, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: C.onSurface, marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: C.onSecondaryFixedVariant, lineHeight: 22 },

  mapContainer: { backgroundColor: C.containerLow, borderRadius: 24, padding: 16, alignItems: 'center', height: 420, overflow: 'hidden' },
  
  toggleWrapper: { position: 'absolute', top: 20, zIndex: 10 },
  toggleBg: { flexDirection: 'row', backgroundColor: C.containerHighest, borderRadius: 24, padding: 4 },
  toggleBtn: { paddingHorizontal: 24, paddingVertical: 8, borderRadius: 20 },
  toggleBtnActive: { backgroundColor: C.containerLowest, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  toggleText: { fontSize: 12, fontWeight: '700', color: C.onSurfaceVariant },
  toggleTextActive: { color: C.primary },

  imageWrapper: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  bodyImage: { width: '100%', height: '100%', opacity: 0.9 },

  // Hotspots
  hotspot: { position: 'absolute', borderWidth: 2, borderColor: 'rgba(0,63,135,0.2)', backgroundColor: 'rgba(0,63,135,0.05)', alignItems: 'center', justifyContent: 'center' },
  hotspotActive: { backgroundColor: 'rgba(0,63,135,0.15)', borderColor: C.primary },
  hotspotAdd: { opacity: 0.5 },
  
  hotspotHead: { top: '8%', width: 48, height: 48, borderRadius: 24 },
  hotspotChest: { top: '22%', width: 80, height: 96, borderRadius: 16 },
  hotspotAbdomen: { top: '38%', width: 64, height: 64, borderRadius: 16 },
  hotspotKneeL: { top: '68%', left: '38%', width: 32, height: 32, borderRadius: 16 },
  hotspotKneeR: { top: '68%', right: '38%', width: 32, height: 32, borderRadius: 16 },

  zoomControls: { position: 'absolute', bottom: 20, right: 20, gap: 8 },
  zoomBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.containerLowest, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },

  selectedSection: { marginTop: 24 },
  selectedTitle: { fontSize: 10, fontWeight: '800', color: C.onSurfaceVariant, letterSpacing: 1, marginBottom: 12 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.secondaryContainer, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderLeftWidth: 4, borderLeftColor: C.green },
  chipText: { fontSize: 14, fontWeight: '600', color: C.onSecondaryFixedVariant },
  chipClose: { alignItems: 'center', justifyContent: 'center' },

  footer: { flexDirection: 'row', gap: 16, padding: 20, paddingTop: 10, backgroundColor: C.surface },
  clearBtn: { flex: 1, paddingVertical: 16, backgroundColor: C.containerHigh, borderRadius: 30, alignItems: 'center' },
  clearBtnText: { fontSize: 16, fontWeight: '700', color: C.onSecondaryFixedVariant },
  continueBtn: { flex: 2, paddingVertical: 16, backgroundColor: C.primary, borderRadius: 30, alignItems: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 4 },
  continueBtnText: { fontSize: 16, fontWeight: '700', color: C.white },
});
