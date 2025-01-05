import React, { useState } from 'react';
import axios from 'axios';
import ip from "../ips.json";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Image, Modal, ScrollView, Dimensions, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const StartOptions = ({ delCookies, handleNotification, empezamos }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic'); // Tabs: basic, dictionary
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
      alert(error);
      return null;
    }
  };

  
  return (
    <View style={styles.container}>
      {/* Delete Cookies Button */}
      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={delCookies}>
        <Text style={styles.buttonText}>Delete Cookies</Text>
      </TouchableOpacity>

      {/* Logo */}
      <Image source={require('../assets/robot.png')} style={styles.logo} />

      {/* Start Button */}
      <TouchableOpacity style={[styles.button, styles.startButton]} onPress={empezamos}>
        <Text style={styles.buttonText}>Empezar</Text>
      </TouchableOpacity>

      {/* Open Settings Button */}
      <TouchableOpacity
        style={[styles.button, styles.settingsButton]}
        onPress={() => {
          setUsername('')
          setPassword('')
          setModalVisible(true)
        }}
      >
        <Text style={styles.buttonText}>Configuración</Text>
      </TouchableOpacity>

      {/* Settings Modal */}
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 25,
    width: 200,
    alignItems: 'center',
    marginVertical: 10,
  },
  deleteButton: {
    backgroundColor: '#e63946',
  },
  startButton: {
    backgroundColor: '#457b9d',
  },
  settingsButton: {
    backgroundColor: '#1d3557',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1d3557',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
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
  closeButton: {
    backgroundColor: '#e76f51',
  },
  saveButton: {
    backgroundColor: 'blue',
  },
});

export default StartOptions;
