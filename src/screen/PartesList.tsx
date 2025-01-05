import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ImporteList from '../componentes/ImporteList';
import ExtraList from '../componentes/ExtraList';
import globalStyles from '../styles/globalStyles';

const PartesList = ({ listaPartes, setListaPartes, onFinalize, progress, noFin, onDeleteFullList }) => {
  return (
    <View>
      <Text style={globalStyles.headerText}>Lista de Partes</Text>
      {listaPartes.map((parte, index) => (
        <View key={index} style={globalStyles.parteCard}>
          <Text>{parte.expediente}</Text>
          <ImporteList importes={parte.importes} />
          <ExtraList extras={parte.itos} />
          <TouchableOpacity
            onPress={() => setListaPartes(listaPartes.filter((_, i) => i !== index))}
            style={globalStyles.deleteButton}
          >
            <Text style={globalStyles.deleteButtonText}>Borrar</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={onFinalize} style={globalStyles.terminarButton}>
        <Text style={globalStyles.terminarButtonText}>Finalizar</Text>
      </TouchableOpacity>
      {progress === 'FIIIIIIIIN' && (
        <View>
          <Text>Partes no descontados:</Text>
          {noFin.map((item, idx) => (
            <Text key={idx}>{item.expediente}</Text>
          ))}
          <TouchableOpacity onPress={onDeleteFullList} style={globalStyles.terminarButton}>
            <Text style={globalStyles.terminarButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default PartesList;
