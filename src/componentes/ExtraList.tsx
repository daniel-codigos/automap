// ExtraList.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ExtraList({ extras, onSelectExtra, onDeleteExtra, selectedExtras, par }) {
  return (
    <View style={styles.container}>
      {extras && (
        <View>
          <TouchableOpacity
            onPress={() => onSelectExtra(par, "rele")}
            onLongPress={() => onDeleteExtra(par, 'rele')}
            style={[
              styles.extraButton,
              selectedExtras.cual === "rele" && selectedExtras.parte === par && styles.selected
            ]}
          >
            <Text style={styles.extraText}>{extras.rele !== "" ? "Información relevante: " + extras.rele : ""}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSelectExtra(par, "exclu")}
            onLongPress={() => onDeleteExtra(par, 'exclu')}
            style={[
              styles.extraButton,
              selectedExtras.cual === "exclu" && selectedExtras.parte === par && styles.selected
            ]}
          >
            <Text style={styles.extraText}>{extras.exclu !== "" ? "Exclusión: " + extras.exclu : ""}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  extraButton: {
    backgroundColor: '#dfe6e9',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  selected: {
    backgroundColor: '#fab1a0',
  },
  extraText: {
    fontSize: 14,
    color: '#2d3436',
  },
});
