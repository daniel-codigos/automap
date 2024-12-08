// ImporteList.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ImporteList({ importes, onSelectImp, onDeleteImp, selectedImp, indexPar, onAddImp }) {
  return (
    <View style={styles.container}>
      {importes.map((importe, indexImp) => (
        <TouchableOpacity
          key={indexImp}
          style={[
            styles.impButton,
            selectedImp.par === indexPar && selectedImp.imp === indexImp && styles.selected
          ]}
          onPress={() => onSelectImp(indexImp, indexPar)}
          onLongPress={() => onDeleteImp()}
        >
          <Text style={styles.impText}>{importe}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={() => onAddImp(indexPar)}>
        <Text style={styles.addText}>➕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  impButton: {
    backgroundColor: '#74b9ff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 5,
    marginBottom: 5,
  },
  selected: {
    backgroundColor: '#ff7675',
  },
  impText: {
    color: 'white',
    fontSize: 16,
  },
  addText: {
    fontSize: 25,
    color: '#74b9ff',
  },
});
