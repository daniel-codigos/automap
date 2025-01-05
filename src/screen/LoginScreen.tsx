import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Text, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import PartesList from '../componentes/PartesList';
import globalStyles from '../styles/globalStyles';
import { requestPermissions, sendNotification } from '../services/notifications';
import { fetchStartData, finalizeData } from '../services/apiService';

export default function LoginScreen() {
  const [listaPartes, setListaPartes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPar, setLoadingPar] = useState(false);
  const [progress, setProgress] = useState('');
  const [noFin, setNoFin] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        requestPermissions();
        const storedData = await SecureStore.getItemAsync('Linfo');
        if (storedData !== null) {
          setListaPartes(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error fetching data from SecureStore:', error);
      }
    };
    fetchData();
  }, []);

  const handleStart = async () => {
    setLoading(true);
    const data = await fetchStartData();
    if (data) {
      setListaPartes(data.info);
      await SecureStore.setItemAsync('Linfo', JSON.stringify(data.info));
    }
    setLoading(false);
  };

  const handleFinalize = async () => {
    setLoadingPar(true);
    const response = await finalizeData(listaPartes);
    setLoadingPar(false);
    if (response) {
      if (response.info.length > 0) {
        sendNotification('Descuento completado', 'Han quedado partes por descontar! Revisa.');
        setNoFin(response.info);
      } else {
        sendNotification('Descuento completado', '¡Listo! Se ha terminado correctamente!');
        setListaPartes([]);
      }
      setProgress('FIIIIIIIIN');
    }
  };

  const handleDeleteFullList = async () => {
    await SecureStore.deleteItemAsync('Linfo');
    setListaPartes([]);
    setProgress('');
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.container}>
        {listaPartes.length > 0 ? (
          <PartesList
            listaPartes={listaPartes}
            setListaPartes={setListaPartes}
            onFinalize={handleFinalize}
            progress={progress}
            noFin={noFin}
            onDeleteFullList={handleDeleteFullList}
          />
        ) : (
          <View>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                <TouchableOpacity onPress={handleStart} style={globalStyles.startButton}>
                  <Text style={globalStyles.startButtonText}>Empezar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
