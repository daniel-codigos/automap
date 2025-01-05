/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface AddImporteModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (importes: { tipo: string, importe: string, cantidad: string }[]) => void;
}

const AddImporteModal: React.FC<AddImporteModalProps> = ({ visible, onClose, onSave ,imporData}) => {
  const [importes, setImportes] = useState([{ tipo: 'Normal', importe: '', cantidad: '' }]);

  const handleSave = () => {
    onSave(importes);
    setImportes([{ tipo: 'Normal', importe: '', cantidad: '' }]);
    onClose();
  };

  const addNewImporte = () => {
    setImportes([...importes, { tipo: 'Normal', importe: '', cantidad: '' }]);
  };

  const updateImporte = (index, field, value) => {
    const newImportes = [...importes];
    newImportes[index][field] = value;
    console.log(newImportes)
    setImportes(newImportes);
  };

  const deleteImporte = (index) => {
    const newImportes = [...importes];
    newImportes.splice(index, 1);
    setImportes(newImportes);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Agregar Importe</Text>
          {importes.map((item, index) => (
            <View key={index} style={styles.importeRow}>
              <Picker
                style={styles.picker}
                selectedValue={item.tipo}
                onValueChange={(itemValue) => updateImporte(index, 'tipo', itemValue)}
              >
                <Picker.Item label={"Normal"} value="Normal" />
                <Picker.Item label="fueraT" value="fueraT" />
                <Picker.Item label="Urgencia" value="Urgencia" />
                <Picker.Item label="zb9" value="zb9" />
              </Picker>
              {item.tipo === 'Normal' && (
                <TextInput
                  style={styles.input}
                  placeholder="Importe"
                  value={item.importe}
                  onChangeText={(text) =>  updateImporte(index, 'importe', text)}
                />
              )}
              {item.tipo !== 'Urgencia' && (
                
                <TextInput
                  style={styles.input}
                  placeholder="Cantidad"
                  value={item.cantidad}
                  onChangeText={(text) => updateImporte(index, 'cantidad', text)}
                />
              )}
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImporte(index)}>
                <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addNewImporte}>
            <Text style={styles.buttonText}>Agregar Nuevo Importe</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  importeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  picker: {
    width: 120,
    height: 40,
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 10,
    paddingLeft: 10,
    height: 40,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
  },
  deleteButton: {
    marginLeft: 5,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddImporteModal;
