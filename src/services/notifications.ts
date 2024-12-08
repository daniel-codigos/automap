import * as Notifications from 'expo-notifications';

export const requestPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') {
      alert('Permisos para notificaciones no concedidos.');
    }
  }
};

export const sendNotification = async (title, body) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: null,
  });
};
