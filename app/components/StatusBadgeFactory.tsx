import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  
  switch (status.toLowerCase()) {
    case 'pendente':
      return (
        <View style={[styles.badge, { backgroundColor: "#ffc400" }]}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Pendente</Text>
        </View>
      )
    case 'aprovado':
      return (
        <View style={[styles.badge, { backgroundColor: "#4caf50" }]}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Aprovado</Text>
        </View>
      )
    case 'reprovado':
      return (
        <View style={[styles.badge, { backgroundColor: "#ff1707" }]}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Reprovado</Text>
        </View>
      )
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 5,
  }
})
