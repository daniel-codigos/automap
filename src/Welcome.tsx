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
  const [noFin, setNoFin] = useState([])

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
        alert(error);
        return null;
      }
    };
  const deleteFullList = () => {
    SecureStore.deleteItemAsync('Linfo');
    setListaPartes([]);
    setNoFin([])
    setProgress('')
    setEmpezar(false)
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
      const response = await axios.get('http://'+ip['ips']['elegido']+'/api/user2/start', {
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
          //data.forEach(cada_parte => {
            //console.log(cada_parte);
          //});
        }
        setLoading(false);
        setEmpezar(true);
      }
      return response.data;
    } catch (error) {
      console.error('Error al verificar el token:', error);
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
    setLoadingPar(true);
    await SecureStore.deleteItemAsync('Linfo');
    setListaPartes([]);
  
    console.log("vamos a enviar los datos");
    console.log(listaPartes);
  
    try {
      const token = await SecureStore.getItemAsync("token_map");

      const response = await axios.post(`http://${ip.ips.elegido}/api/user2/fin`, { 'info': listaPartes }, {
        headers: {
          'Authorization': `Bearer ${String(JSON.parse(token).access)}`,
        }
      });

      console.log(await response.status);
      if (response.status === 200) {
        setLoadingPar(false);
        
        console.log(response.data.info);
        if (response.data.info.length > 0) {
          sendNotification('Descuento completado', 'Han quedado partes por descontar! Revisa!.');
        }else{
          sendNotification('Descuento completado', '¡Listo! Se ha terminado de descontar correctamente!.');
        }
        setNoFin(response.data.info)
        console.log("FIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIN");
        setProgress("FIIIIIIIIN");
        
      } else {
        setLoadingPar(false);
        console.error('Error al enviar los datos:', response.status);
        alert('Error al enviar los datos. Inténtalo de nuevo.');
      }
  
      
    } catch (error) {
      console.error("Error:", error);
      setLoadingPar(false);
    }
  };
  

  const terminarPartes = async () => {
    console.log("terinaaar")
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
        {empezar || listaPartes.length > 0 ? (
          <View style={styles.partesContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Lista de Partes</Text>
              <TouchableOpacity onPress={deleteFullList} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Borrar lista completa</Text>
              </TouchableOpacity>
            </View>

            {listaPartes.map((cadaParte, indexPar) => (
              <View key={indexPar} style={styles.parteCard}>
                <View style={styles.parteHeader}>
                  <Text style={styles.parteHeaderText}>NºExp: {cadaParte.expediente}</Text>
                  <Text style={styles.parteHeaderText}>CP: {cadaParte.cp}</Text>
                  <Text style={styles.parteHeaderText}>{cadaParte.f_asignacion}</Text>
                  <Text style={styles.parteHeaderText}>{cadaParte.calle}</Text>
                  {cadaParte.brico === "si" && <Text style={[styles.parteHeaderText, styles.bricoText]}>Brico</Text>}
                  <Text style={[styles.parteHeaderText, cadaParte.tipo !== "ELECTRICIDAD" && styles.nonElectricText]}>{cadaParte.tipo}</Text>
                  {cadaParte.urgencia === "si" && <Text style={[styles.parteHeaderText, styles.urgenciaText]}>URGENCIA</Text>}
                </View>
                <Text style={styles.parteDescription} selectable={true}>{cadaParte.descripcion}</Text>
                <View style={styles.importesContainer}>
                  {cadaParte.importes.map((cadaImporte, indexImp) => (
                    <TouchableOpacity
                      key={indexImp}
                      style={[
                        styles.impBtn,
                        selectedImp.par === indexPar && selectedImp.imp === indexImp && styles.selectedImpBtn
                      ]}
                      onPress={() => selectImp(indexImp, indexPar)}
                      onLongPress={() => deleteImp()}
                    >
                      <Text style={styles.importeText}>{cadaImporte}</Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity onPress={() => {
                    setNewImpWin(true);
                    setcualnewimp(indexPar);
                  }}>
                    <Text style={styles.addImpText}>➕</Text>
                  </TouchableOpacity>

                </View>
                <View style={styles.extrasContainer}>
                  <TouchableOpacity style={styles.extrasButton} onPress={() => {
                    //on press extras
                    setNewExtraWin(true);
                    setcualnewextra(indexPar);
                  }}>
                    <Text style={styles.extrasButtonText}>Extras</Text>
                  </TouchableOpacity>
                  {cadaParte.itos && (
                    <View style={styles.extrasTextContainer}>
                      <TouchableOpacity 
                        onPress={() => selectExtra(indexPar,"rele")}
                        onLongPress={() => deleteExtra(indexPar,'rele')}
                        style={selectedExtras.cual === "rele" && selectedExtras.parte == indexPar ? {backgroundColor:'red'} : null}
                      >
                        <Text style={styles.extrasText}>{cadaParte.itos.rele !== "" ? "Informacion relevante: " + cadaParte.itos.rele : ""}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => selectExtra(indexPar,"exclu")}
                        onLongPress={() => deleteExtra(indexPar,'exclu')}
                        style={selectedExtras.cual === "exclu" && selectedExtras.parte === indexPar ? {backgroundColor:'red'} : null}
                      >
                        <Text style={styles.extrasText}>{cadaParte.itos.exclu !== "" ? "Exclusion: " + cadaParte.itos.exclu : ""}</Text>
                      </TouchableOpacity>
                      
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={() => deleteParte(indexPar)} style={styles.deleteParteButton}>
                  <Text style={styles.deleteParteButtonText}>X</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => saveParte(indexPar)} style={styles.saveParteButton}>
                  <Text style={styles.deleteParteButtonText}>saveit!</Text>
                </TouchableOpacity>
              </View>
            ))}
            {progress === '' && (
            <TouchableOpacity style={styles.terminarButton} onPress={finPartes}>
              <Text style={styles.terminarButtonText}>Terminar</Text>
            </TouchableOpacity>
            )}
          </View>
        ) : (

          <View style={styles.startContainer}>
          {!loadingPar ? 
                      <View>
                        <Image source={require('./assets/robot.png')} style={styles.logo} />
                        <TouchableOpacity style={styles.startButton} onPress={delCookies}>
                          <Text style={styles.startButtonText}>delete Cookies</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.startButton} onPress={handleNotification}>
                          <Text style={styles.startButtonText}>test botify</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.startButton} onPress={empezamos}>
                          <Text style={styles.startButtonText}>Empezar</Text>
                        </TouchableOpacity>
                      </View>

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
          <Text>Procesando... {progress}</Text>
        </View>
      )}
        {progress === "FIIIIIIIIN" && (
          <View style={styles.loadingContainer}>
            <Text>Partes no descontados:</Text>
            {noFin && noFin.length > 0 ? (
              // Aquí verificamos que noFin es un array y tiene elementos
              noFin.map((cada, index) => (
                  <Text key={index}>{cada.expediente}</Text>
              ))
            ) : (
              <Text>No hay datos para mostrar.</Text>
            )}
            <TouchableOpacity style={styles.terminarButton} onPress={deleteFullList}>
              <Text style={styles.terminarButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
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
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
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
  parteCard: {
    backgroundColor: '#FCDC94',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
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
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff7675',
    borderRadius: 15,
    padding: 5,
  },
  saveParteButton:{
    position: 'absolute',
    top: 10,
    right: 40,
    backgroundColor: '#160092',
    borderRadius: 15,
    padding: 5,
  },
  deleteParteButtonText: {
    color: 'white',
    fontSize: 16,
  },
  terminarButton: {
    backgroundColor: '#fdcb6e',
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
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
});
