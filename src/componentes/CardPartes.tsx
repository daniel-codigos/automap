import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';

const ParteCard = ({
    cadaParte,
    indexPar,
    selectedImp,
    selectImp,
    deleteImp,
    setNewImpWin,
    setcualnewimp,
    setNewExtraWin,
    setcualnewextra,
    selectExtra,
    deleteExtra,
    selectedExtras,
    deleteParte,
    saveParte,
}) => {
  const [editedText, setEditedText] = useState('');
  const [isModalVisiblEditText, setModalVisiblEditText] = useState(false);

  const handleSave = () => {
    //updateDescripcion(editedText); // Llama a la función para actualizar el texto
    //cadaParte.descripcion = 
    //setEditedText()
    cadaParte.modText = true
    cadaParte.descripcion = editedText
    console.log(editedText)
    console.log(cadaParte)
    setModalVisiblEditText(false); // Cierra el modal
  };

    return (
        <View key={indexPar} style={styles.parteCard}>
            <View style={{flexDirection:"row",justifyContent: "flex-end"}}>
                <TouchableOpacity onPress={() => saveParte(indexPar)} style={styles.saveParteButton}>
                    <Text style={styles.deleteParteButtonText}>saveit!</Text>
                </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteParte(indexPar)} style={styles.deleteParteButton}>
                    <Text style={styles.deleteParteButtonText}>X</Text>
                </TouchableOpacity>
            </View>
          <View style={styles.parteHeader}>
            <Text style={styles.parteHeaderText}>NºExp: {cadaParte.expediente}</Text>
            <Text style={styles.parteHeaderText}>CP: {cadaParte.cp}</Text>
            <Text style={styles.parteHeaderText}>{cadaParte.f_asignacion}</Text>
            <Text style={styles.parteHeaderText}>{cadaParte.calle}</Text>
            {cadaParte.brico === 'si' && (
              <Text style={[styles.parteHeaderText, styles.bricoText]}>Brico</Text>
            )}
            <Text
              style={[
                styles.parteHeaderText,
                cadaParte.tipo !== 'ELECTRICIDAD' && styles.nonElectricText,
              ]}
            >
              {cadaParte.tipo}
            </Text>
            {cadaParte.urgencia === 'si' && (
              <Text style={[styles.parteHeaderText, styles.urgenciaText]}>URGENCIA</Text>
            )}
          </View>

          <View>
      <Text style={styles.parteDescription} selectable={true}>
        {cadaParte.descripcion}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <TouchableOpacity
          onPress={() => {
            setModalVisiblEditText(true)
            setEditedText(cadaParte.descripcion)
          }}
          style={styles.editParte}
        >
          <Text style={styles.editParteButtonText}>Editar Texto</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para editar el texto */}
      <Modal
        visible={isModalVisiblEditText}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisiblEditText(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Descripción</Text>
            <TextInput
              style={styles.textInput}
              multiline={true}
              value={editedText}
              onChangeText={setEditedText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisiblEditText(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>

          <View style={styles.importesContainer}>
            {cadaParte.importes.map((cadaImporte: string, indexImp: number) => (
              <TouchableOpacity
                key={indexImp}
                style={[
                  styles.impBtn,
                  selectedImp.par === indexPar && selectedImp.imp === indexImp && styles.selectedImpBtn,
                ]}
                onPress={() => selectImp(indexImp, indexPar)}
                onLongPress={() => deleteImp()}
              >
                <Text style={styles.importeText}>{cadaImporte}</Text>
              </TouchableOpacity>
            ))}
    
            <TouchableOpacity
              onPress={() => {
                setNewImpWin(true);
                setcualnewimp(indexPar);
              }}
            >
              <Text style={styles.addImpText}>➕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.extrasContainer}>
            <TouchableOpacity
              style={styles.extrasButton}
              onPress={() => {
                setNewExtraWin(true);
                setcualnewextra(indexPar);
              }}
            >
              <Text style={styles.extrasButtonText}>Extras</Text>
            </TouchableOpacity>
            {cadaParte.itos && (
              <View style={styles.extrasTextContainer}>
                <TouchableOpacity
                  onPress={() => selectExtra(indexPar, 'rele')}
                  onLongPress={() => deleteExtra(indexPar, 'rele')}
                  style={
                    selectedExtras.cual === 'rele' && selectedExtras.parte === indexPar
                      ? { backgroundColor: 'red' }
                      : undefined
                  }
                >
                  <Text style={styles.extrasText}>
                    {cadaParte.itos.rele !== ''
                      ? 'Informacion relevante: ' + cadaParte.itos.rele
                      : ''}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => selectExtra(indexPar, 'exclu')}
                  onLongPress={() => deleteExtra(indexPar, 'exclu')}
                  style={
                    selectedExtras.cual === 'exclu' && selectedExtras.parte === indexPar
                      ? { backgroundColor: 'red' }
                      : undefined
                  }
                >
                  <Text style={styles.extrasText}>
                    {cadaParte.itos.exclu !== ''
                      ? 'Exclusion: ' + cadaParte.itos.exclu
                      : ''}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

        </View>
      );
    };
    

const styles = StyleSheet.create({
  parteCard: {
    backgroundColor: '#FCDC94',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  parteHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  parteHeaderText: {
    fontSize: 16,
    marginRight: 10,
    color: '#2d3436',
  },
  bricoText: {
    color: '#00b894',
  },
  nonElectricText: {
    color: '#d63031',
  },
  urgenciaText: {
    color: '#e17055',
  },
  parteDescription: {
    fontSize: 16,
    marginBottom: 10,
    color: '#2d3436',
  },
  importesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  impBtn: {
    backgroundColor: '#74b9ff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 5,
    marginBottom: 5,
  },
  selectedImpBtn: {
    backgroundColor: '#ff7675',
  },
  importeText: {
    color: 'white',
    fontSize: 16,
  },
  addImpText: {
    fontSize: 25,
    color: '#74b9ff',
  },
  extrasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  extrasButton: {
    backgroundColor: '#55efc4',
    padding: 10,
    borderRadius: 20,
  },
  extrasButtonText: {
    color: 'white',
    fontSize: 16,
  },
  extrasTextContainer: {
    marginLeft: 10,
  },
  extrasText: {
    fontSize: 14,
    color: '#2d3436',
  },
  deleteParteButton: {
    backgroundColor: '#ff7675',
    borderRadius: 15,
    padding: 5,
    width:25
  },
  saveParteButton:{
    width:60,
    backgroundColor: '#160092',
    borderRadius: 15,
    padding: 5,
    marginRight:10,
  },
  editParte:{
    width:90,
    backgroundColor: '#160092',
    borderRadius: 15,
    padding: 5,
    //marginRight:10,
  },
  deleteParteButtonText: {
    color: 'white',
    fontSize: 16,
  },
  editParteButtonText: {
    color: "#ffffff",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    width: "80%",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#2196f3",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
  },
});

export default ParteCard;
