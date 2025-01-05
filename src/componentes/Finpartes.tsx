import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FinalView = ({ noFin, deleteFullList }) => {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.title}>Descuentos finalizados!</Text>
      {noFin && noFin.length > 0 ? (
        noFin.map((cada, index) => (
          <View>
            <Text style={styles.title}>Partes no descontados:</Text>
            <Text key={index} style={styles.itemText}>
              {cada.expediente}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.itemText}>Se ha finalizado correctamente.</Text>
      )}
      <TouchableOpacity style={styles.terminarButton} onPress={deleteFullList}>
        <Text style={styles.terminarButtonText}>Cerrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 2,
  },
  terminarButton: {
    marginTop: 20,
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  terminarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FinalView;
