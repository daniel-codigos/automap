/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AddExtraModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (extras: { exclu: string, rele: string }[]) => void;
}

const AddExtraModal: React.FC<AddExtraModalProps> = ({ visible, onClose, onSave }) => {
  const [exclusion, setExclusion] = useState("");
  const [infoRele, setInfoRele] = useState("");

  const handleSave = () => {
    onSave([{ exclu: exclusion, rele: infoRele }]);
    setExclusion("");
    setInfoRele("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Agregar Extras</Text>
          <Text style={styles.label}>Información relevante:</Text>
          <TextInput
            style={styles.input}
            placeholder="Información relevante"
            value={infoRele}
            onChangeText={(text) => setInfoRele(text)}
          />
          <Text style={styles.label}>Exclusión:</Text>
          <TextInput
            style={styles.input}
            placeholder="Exclusión"
            value={exclusion}
            onChangeText={(text) => setExclusion(text)}
          />
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
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddExtraModal;
