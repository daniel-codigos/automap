import React, { useState } from 'react';
import axios from 'axios';
import ip from "../ips.json";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Image, Modal, ScrollView, Dimensions, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const StartOptions = ({ delCookies, handleNotification, empezamos, testinfo}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic'); // Tabs: basic, dictionary
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //const [testOnOff, setTestOnOff] = useState(false);
  //#4caf50 green

  const onoff = async () => {
    console.log("onoff")
    testinfo[1](prev => !prev);
    console.log(testinfo[0])
  }


  const save_user = async () => {
    try {
      const token = await SecureStore.getItemAsync("token_map");
      const info = {'user':username,'pass':password}
      const response = await axios.post('http://'+ip['ips']['elegido']+'/api/user2/saveUser', info ,{
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
      alert("asdasdasdasd6");
      alert(error);
      return null;
    }
  };

  
  return (
    <View style={styles.container}>
      {/* Delete Cookies - Top Left */}
      <TouchableOpacity style={[styles.iconButton, styles.topLeft]} onPress={delCookies}>
        <Text style={styles.iconText}>🗑️</Text>
      </TouchableOpacity>
  
      {/* Settings - Top Right */}
      <TouchableOpacity style={[styles.iconButton, styles.topRight]} onPress={() => {
        setUsername('');
        setPassword('');
        setModalVisible(true);
      }}>
        <Text style={styles.iconText}>⚙️</Text>
      </TouchableOpacity>
  
      {/* Center Content */}
      <View style={styles.centerContent}>
        <Image source={require('../assets/robot.png')} style={styles.logo} />
        <TouchableOpacity style={[styles.button, styles.startButton]} onPress={empezamos}>
          <Text style={styles.buttonText}>🚀 Empezar</Text>
        </TouchableOpacity>
  
        {/* Toggle tests */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Activar Tests</Text>
          <TouchableOpacity
            style={[styles.switch, {  }]}
            onPress={onoff}
          >
            <View style={[styles.switchThumb,{backgroundColor: testinfo[0] ? '#4caf50' : 'black' , alignSelf: testinfo[0] ? 'flex-end' : 'flex-start'}]} />
          </TouchableOpacity>
        </View>
      </View>
  
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.tabContainer}>
              {/* Tab Buttons */}
              <TouchableOpacity
                style={[styles.tabButton, currentTab === 'basic' && styles.activeTab]}
                onPress={() => setCurrentTab('basic')}
              >
                <Text style={styles.tabText}>Básica</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, currentTab === 'dictionary' && styles.activeTab]}
                onPress={() => setCurrentTab('dictionary')}
              >
                <Text style={styles.tabText}>Diccionario</Text>
              </TouchableOpacity>
            </View>

            {currentTab === 'basic' && (
              <View style={styles.tabContent}>
                <Text style={styles.modalTitle}>Configuración Básica</Text>

                {/* Username Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Usuario"
                  value={username}
                  onChangeText={setUsername}
                />

                {/* Password Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={() => save_user()}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              </View>
            )}

            {currentTab === 'dictionary' && (
              <View style={styles.tabContent}>
                <Text style={styles.modalTitle}>Configuración Diccionario</Text>
                <Text style={styles.infoText}>Aquí puedes configurar opciones relacionadas con el diccionario.</Text>
              </View>
            )}

            {/* Close Modal Button */}
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => {
                setUsername('')
                setPassword('')
                setModalVisible(false)
              }}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
  
 
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 70,
    },
    iconButton: {
      position: 'absolute',
      padding: 10,
      backgroundColor: '#e0e0e0',
      borderRadius: 50,
      zIndex: 10,
    },
    iconText: {
      fontSize: 22,
    },
    topLeft: {
      top: 20,
      left: 2,
    },
    topRight: {
      top: 20,
      right: 2,
    },
    centerContent: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 140,
      height: 140,
      marginBottom: 30,
    },
    button: {
      paddingVertical: 14,
      paddingHorizontal: 30,
      borderRadius: 25,
      marginVertical: 10,
      alignItems: 'center',
      width: 220,
    },
    startButton: {
      backgroundColor: '#1d3557',
    },
    saveButton: {
      backgroundColor: '#0077b6',
    },
    closeButton: {
      backgroundColor: '#e63946',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 25,
      alignItems: 'center',
      elevation: 10,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#1d3557',
    },
    input: {
      width: '100%',
      padding: 12,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      marginBottom: 15,
      fontSize: 16,
      backgroundColor: '#f8f9fa',
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
      gap: 10,
    },
    switchLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    switch: {
      width: 50,
      height: 30,
      borderRadius: 20,
      backgroundColor: '#cfd8dc',
      justifyContent: 'center',
      padding: 4,
    },
    switchThumb: {
      width: 22,
      height: 22,
      borderRadius: 11,
    },
      tabContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1d3557',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1d3557',
  },
  tabContent: {
    width: '100%',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },

  
  });
  
export default StartOptions;