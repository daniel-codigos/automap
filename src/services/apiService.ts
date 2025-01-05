import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import ip from '../ips.json';

export const fetchStartData = async () => {
  try {
    const token = await SecureStore.getItemAsync('token_map');
    const response = await axios.get(`http://${ip.ips.elegido}/api/user2/start`, {
      headers: { Authorization: `Bearer ${JSON.parse(token).access}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching start data:', error);
    return null;
  }
};

export const finalizeData = async (listaPartes) => {
  try {
    const token = await SecureStore.getItemAsync('token_map');
    const response = await axios.post(
      `http://${ip.ips.elegido}/api/user2/fin`,
      { info: listaPartes },
      {
        headers: { Authorization: `Bearer ${JSON.parse(token).access}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error finalizing data:', error);
    return null;
  }
};
