import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

import { Gradients } from '@/theme';
import { GradientScreen, GradientButton } from '@/components/ui';
import { PaymentOption } from '@/features/payment/components/PaymentOption';
import { PaymentTags } from '@/features/payment/components/PaymentTags';
import { paymentStyles as styles } from '@/features/payment/styles';

export default function PaymentScreen() {
  const [selectedMethod, setSelectedMethod] = useState('apple-pay');

  return (
    <GradientScreen
      colors={Gradients.darkFlat as unknown as [string, string, ...string[]]}
      scrollable
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
    >
      <Text style={styles.title}>Métodos de Pago</Text>

      {/* Recharge Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recargar Monedero</Text>
        <Text style={styles.sectionSubtitle}>Selecciona tu fuente de fondos</Text>
      </View>

      <PaymentOption
        icon={<FontAwesome5 name="apple-pay" size={26} color="#fff" />}
        label="Apple Pay"
        sublabel="Recarga instantánea"
        selected={selectedMethod === 'apple-pay'}
        onPress={() => setSelectedMethod('apple-pay')}
      />
      <PaymentOption
        icon={<MaterialCommunityIcons name="credit-card" size={26} color="#fff" />}
        label="Nueva Tarjeta"
        sublabel="Débito o Crédito"
        selected={selectedMethod === 'card'}
        onPress={() => setSelectedMethod('card')}
      />
      <PaymentOption
        icon={<Ionicons name="cash-outline" size={26} color="#fff" />}
        label="Efectivo"
        sublabel="Oxxo, 7-Eleven o ventanilla"
        selected={selectedMethod === 'cash'}
        onPress={() => setSelectedMethod('cash')}
      />

      <View style={styles.divider} />

      {/* Bus Payments Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pagos en el Autobús</Text>
        <Text style={styles.sectionSubtitle}>Tipos de pago admitidos con QR</Text>
      </View>

      <PaymentTags />

      <GradientButton label="Confirmar Recarga" />
    </GradientScreen>
  );
}
