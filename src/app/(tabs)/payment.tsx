import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '@/theme';
import { paymentStyles as styles } from '@/features/payment/styles';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';

const RECHARGE_AMOUNTS = [10, 25, 50, 100];

const PAYMENT_METHODS = [
  {
    id: 'pago-movil',
    name: 'Pago Móvil',
    detail: '•••• 4532',
    iconName: 'cellphone' as const,
    iconColor: Colors.salmon,
    iconBg: Colors.peach,
  },
  {
    id: 'zelle',
    name: 'Zelle',
    detail: '•••• 8821',
    iconName: 'credit-card-outline' as const,
    iconColor: '#8B5CF6',
    iconBg: '#EDE9FE',
  },
  {
    id: 'binance',
    name: 'Binance Pay',
    detail: '',
    iconName: 'bitcoin' as const,
    iconColor: '#F59E0B',
    iconBg: '#FEF3C7',
  },
];

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { onScroll } = useTabBarVisibility();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={(e) => onScroll(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.profileAvatar}
              onPress={() => router.push('/profile')}
              activeOpacity={0.8}
            >
              <FontAwesome name="user" size={18} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerName}>Guayaba</Text>
          </View>

        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Actual</Text>
          <Text style={styles.balanceValue}>Bs. 45.80</Text>
          <View style={styles.balanceStats}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Este mes</Text>
              <Text style={styles.statValue}>-Bs. 38.20</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Promedio/día</Text>
              <Text style={styles.statValue}>Bs. 2.55</Text>
            </View>
          </View>
        </View>

        {/* Quick Recharge */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recarga Rápida</Text>
        </View>

        <View style={styles.rechargeGrid}>
          {RECHARGE_AMOUNTS.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.rechargeOption,
                selectedAmount === amount && styles.rechargeOptionSelected,
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedAmount(amount)}
            >
              <Text style={styles.rechargeOptionText}>Bs. {amount}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.rechargeButton} activeOpacity={0.85}>
          <Text style={styles.rechargeButtonText}>Recargar Ahora</Text>
        </TouchableOpacity>

        {/* Payment Methods */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Métodos de Pago</Text>
        </View>

        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={styles.methodCard}
            activeOpacity={0.75}
          >
            <View style={[styles.methodIcon, { backgroundColor: method.iconBg }]}>
              <MaterialCommunityIcons
                name={method.iconName}
                size={22}
                color={method.iconColor}
              />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>{method.name}</Text>
              {method.detail ? (
                <Text style={styles.methodDetail}>{method.detail}</Text>
              ) : null}
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.grayNeutral}
              style={styles.methodArrow}
            />
          </TouchableOpacity>
        ))}

        {/* Add Method */}
        <TouchableOpacity style={styles.addMethodButton} activeOpacity={0.7}>
          <Ionicons name="add" size={20} color={Colors.grayNeutral} />
          <Text style={styles.addMethodText}>Agregar Método de Pago</Text>
        </TouchableOpacity>

        {/* Bank Transfer Card */}
        <View style={styles.bankTransferCard}>
          <View style={styles.bankTransferIcon}>
            <MaterialCommunityIcons name="bank-transfer" size={22} color="#fff" />
          </View>
          <View style={styles.bankTransferInfo}>
            <Text style={styles.bankTransferTitle}>Transferencia Bancaria</Text>
            <Text style={styles.bankTransferDesc}>
              También puedes recargar mediante transferencia o Pago Móvil a nuestra cuenta empresarial.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
