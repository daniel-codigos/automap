/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ip from "./ips.json";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Image, Modal, ScrollView, Dimensions, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AddImporteModal from './AddImporteModal';
import AddExtraModal from './AddExtraModal'; // Importa tu nuevo modal
import { sendNotification, requestPermissions } from "./usePushNotifications";
import StartOptions from './componentes/Inicio'; 
import FinalView from './componentes/Finpartes'; // Ajusta la ruta si está en una subcarpeta
import ParteCard from './componentes/CardPartes'; // Importa el componente
import BackgroundTimer from 'react-native-background-timer';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [listaPartes, setListaPartes] = useState([]);
  const [empezar, setEmpezar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cualnewimp, setcualnewimp] = useState(0);
  const [newImpWin, setNewImpWin] = useState(false);
  const [selectedImp, setSelectedImp] = useState({ par: null, imp: null });
  const [selectedExtras, setSelectedExtras] = useState({});
  const [cualnewextra, setcualnewextra] = useState(0);
  const [newExtraWin, setNewExtraWin] = useState(false);
  const [loadingPar, setLoadingPar] = useState(false);
  const [progress, setProgress] = useState('');
  const [progressChannels, setProgressChannels] = useState([]);
  const [noFin, setNoFin] = useState([])
  const [terminado, setTerminado] = useState(false)
  const [finInfo, setFinFinfo] = useState(false)
  const [testOnOff, setTestOnOff] = useState(false);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        requestPermissions()
        const storedData = await SecureStore.getItemAsync('Linfo');
        if (storedData !== null) {
          setListaPartes(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error fetching data from SecureStore', error);
      }
    };

    fetchData();
  }, []);

  const deleteParte = async(index) => {
    const nuevoListaPartes = listaPartes.filter((item, i) => i !== index);
    setListaPartes(nuevoListaPartes);
  } 

  const saveParte = async (index) => {
      try {
        const token = await SecureStore.getItemAsync("token_map");
        const response = await axios.post('http://'+ip['ips']['elegido']+'/api/user2/savebad', {'user':'user','info':listaPartes[index]},{
          headers: {
            'Authorization': `Bearer ${String(JSON.parse(token).access)}`,
          }
        });
        console.log(await response.data);
        console.log(response.status);
        if (response.status == 200 || response.status == 201) {
          alert('guardado correctamente')
        }
        return response.data;
      } catch (error) {
        console.error('Error al verificar el token:', error);
        alert("asdasdasdasd2");
        alert(error);
        return null;
      }
    };
  const deleteFullList = () => {
    SecureStore.deleteItemAsync('Linfo');
    setListaPartes([]);
    setNoFin([])
    setProgress('')
    //setTerminado(true)
    setEmpezar(false)
    setFinFinfo(false)
  } 

  const deleteImp = () => {
    let par = selectedImp.par;
    let imp = selectedImp.imp;
    let newList = [...listaPartes];

    if (par >= 0 && par < newList.length) {
      let element = { ...newList[par] };

      if (element.importes && element.importes[imp] !== undefined) {
        element.importes.splice(imp, 1);
      }

      newList[par] = element;
      setListaPartes(newList);
      setSelectedImp({'par':null,'imp':null})
      console.log(element);
    } else {
      console.error('Índice fuera de rango');
    }
  };
  const selectExtra = (par,cual) => {
    if (selectedExtras.cual === cual && selectedExtras.parte === par){
      setSelectedExtras({})
    }else{
      setSelectedExtras({'parte':par,'cual':cual})
    }
    
  };
  const deleteExtra = (par,cual) => {
    let newList = [... listaPartes];
    if (par >= 0 && par < newList.length) {
      let element = { ...newList[par] };
      element.itos[cual] = ""
      console.log(element.itos[cual])
      newList[par] = element;
      setListaPartes(newList);
      setSelectedExtras({})
    }else {
      console.error('Índice fuera de rango');
    }

}


  const selectImp = (imp, par) => {
    setSelectedImp(prevSelected => {
      if (prevSelected.par === par && prevSelected.imp === imp) {
        return { par: null, imp: null };
      } else {
        return { par, imp };
      }
    });
  };

  const empezamos = async () => {
    try {
      setLoading(true)
      const token = await SecureStore.getItemAsync("token_map");
      const response = await axios.post('http://'+ip['ips']['elegido']+'/api/user2/start', {'infotest':testOnOff},{
        headers: {
          'Authorization': `Bearer ${String(JSON.parse(token).access)}`,
        }
      });
      console.log(await response.data);
      console.log(response.status);
      if (response.status == 200 || response.status == 201) {
        setLoading(false)
        let data = response.data;
        if (data.length === 0) {
          console.log("No hay partes para descontar!");
        } else {
          setListaPartes(data.info);
          await SecureStore.setItemAsync('Linfo', JSON.stringify(data));
          sendNotification('Lista disponible', '¡Listo! Se ha terminado la lista de partes!.');
          //data.forEach(cada_parte => {
            //console.log(cada_parte);v26762951
          //});
        }
        setLoading(false);
        setEmpezar(true);
      }
      return response.data;
    } catch (error) {
      console.error('Error al verificar el token:', error);
      alert("asdasdasdasd12");
      alert(error);
      return null;
    }
  };

  const handleNotification = () => {
    sendNotification('Descuento completado', '¡Listo! Se ha terminado de descontar correctamente!.');
  };

  async function delCookies() {
    console.log("delete cookies")
    const token2 = await SecureStore.getItemAsync('token_map');
    console.log(token2)
    //SecureStore.deleteItemAsync('token_map');
  };

  const finPartes = async () => {
    BackgroundTimer.start()
    setLoadingPar(true);
    await SecureStore.deleteItemAsync('Linfo');
    setEmpezar(false)
    setTerminado(true);
    setFinFinfo(true)
    console.log("Vamos a enviar los datos");
    console.log(listaPartes);
  
    let ws;
  
    try {
      const token = await SecureStore.getItemAsync("token_map");
  
      // Inicializar el WebSocket
      const ws = new WebSocket(`ws://${ip.ips.elegido}/ws/process?user=cogollos&token=${JSON.parse(token).access}`);
  
      ws.onopen = () => {
        console.log("WebSocket conectado");
      };
  
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log(data)
          if (data) {
            console.log("Progreso recibido:", data.data.expediente);
            setProgressChannels((prevChannels) => [...prevChannels, data]);
          }
        } catch (error) {
          console.error("Error al procesar mensaje de WebSocket:", error);
        }
      };
      
      ws.onerror = (error) => {
        console.error("Error en WebSocket:", error);
      };
  
      ws.onclose = () => {
        console.log("WebSocket cerrado");
      };
  
      // Enviar datos iniciales a la API
      const response = await axios.post(
        `http://${ip.ips.elegido}/api/user2/fin`,
        { info: listaPartes },
        {
          headers: {
            Authorization: `Bearer ${String(JSON.parse(token).access)}`,
          },
          timeout: 1800000, // 30 minutos
        }
      );
  
      if (response.status === 200) {
        console.log(response.data.info);
        setListaPartes([]);
        if (response.data.info.length > 0) {
          sendNotification(
            "Descuento completado",
            "Han quedado partes por descontar! Revisa!."
          );
        } else {
          sendNotification(
            "Descuento completado",
            "¡Listo! Se ha terminado de descontar correctamente!."
          );
        }
        setNoFin(response.data.info);
        BackgroundTimer.stop()
        console.log(
          "FIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIN"
        );
        setProgress("FIIIIIIIIN");
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      } else {
        console.error("Error al enviar los datos:", response.status);
        alert("Error al enviar los datos. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error inesperado. Revisa la conexión o los datos.");
    } finally {
      setLoadingPar(false);
  
      // Cerrar WebSocket si está abierto
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    }
  };
  
  

  const handleAddImporte = (importes) => {
    let newList = [...listaPartes];
    let final_info = []; // Inicializar como array vacío
  
    importes.forEach(cada_impor => {
      console.log('atention')
      console.log(cada_impor)
      if (cada_impor.tipo === "Normal") {
        final_info.push([cada_impor.importe, cada_impor.cantidad]); // Agregar elementos al array
      } else if (cada_impor.tipo === "Urgencia") {
        final_info.push("guardia"); // Agregar elementos al array
      } else if (cada_impor.tipo === "zb9" || cada_impor.tipo === "fueraT") {
        final_info.push([cada_impor.cantidad, cada_impor.tipo]); // Agregar elementos al array
      } else {
        final_info.push([cada_impor.cantidad, cada_impor.importe]); // Agregar elementos al array
      }
    });
  
    console.log("ya vamos a terminar de add imp");
    console.log(final_info);
    final_info.forEach(cada_info => {
      newList[cualnewimp].importes.push(cada_info);
    });
    console.log(newList[cualnewimp].importes);
    
    setListaPartes(newList); // Actualizar el estado
  };

  const handleAddExtra = (extras) => {
    let newList = [...listaPartes];
    let final_info = extras[0];
    newList[cualnewextra].itos = final_info;
    setListaPartes(newList);
  };







  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {empezar ? (
          <View style={styles.partesContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Lista de Partes</Text>
              <TouchableOpacity onPress={deleteFullList} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Borrar lista completa</Text>
              </TouchableOpacity>
            </View>

            {listaPartes.map((cadaParte, indexPar) => (
              <ParteCard
                key={indexPar}
                cadaParte={cadaParte}
                indexPar={indexPar}
                selectedImp={selectedImp}
                selectImp={selectImp}
                deleteImp={deleteImp}
                setNewImpWin={setNewImpWin}
                setcualnewimp={setcualnewimp}
                setNewExtraWin={setNewExtraWin}
                setcualnewextra={setcualnewextra}
                selectExtra={selectExtra}
                deleteExtra={deleteExtra}
                selectedExtras={selectedExtras}
                deleteParte={deleteParte}
                saveParte={saveParte}
                testinfo={testOnOff}
            />
            ))}
            {!terminado && !loadingPar && (
              <TouchableOpacity style={styles.terminarButton} onPress={finPartes}>
                <Text style={styles.terminarButtonText}>Terminar</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (

          <View style={styles.startContainer}>
          {!loadingPar && !finInfo ? 
                    <StartOptions
                          delCookies={delCookies}
                          handleNotification={handleNotification}
                          empezamos={empezamos}
                          testinfo={[testOnOff,setTestOnOff]}
                    />

                        :
                        null
          }
          </View>
        )}

        <Modal
          transparent={true}
          animationType="none"
          visible={loading}
          onRequestClose={() => { console.log('close modal') }}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator animating={loading} size="large" color="#0000ff" />
              <Text>Por favor, espere...</Text>
            </View>
          </View>
        </Modal>
        {loadingPar && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Descontando... {progressChannels.length}/{listaPartes.length}</Text>
        </View>
      )}
        {progress === "FIIIIIIIIN" && (
          <FinalView noFin={noFin} deleteFullList={deleteFullList} />
        )}
        <AddImporteModal
          visible={newImpWin}
          onClose={() => setNewImpWin(false)}
          onSave={handleAddImporte}
        />

        <AddExtraModal
          visible={newExtraWin}
          onClose={() => setNewExtraWin(false)}
          onSave={handleAddExtra}
        />

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  partesContainer: {
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6c5ce7',
  },
  deleteButton: {
    backgroundColor: '#ff7675',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
  terminarButton: {
    backgroundColor: '#74b9ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  terminarButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startContainer: {
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 120,
    width: 150,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});