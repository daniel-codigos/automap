import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const StartOptions = ({ delCookies, handleNotification, empezamos }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/robot.png')} style={styles.logo} />
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
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#3897f0',
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    width: 150,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StartOptions;
