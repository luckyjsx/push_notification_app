import { View, Text, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

const App = () => {

  useEffect(() => {
    requestPermissionsAndroid();
    requestNotifeePermission();
  }, [])

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onDisplayNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);
  const requestPermissionsAndroid = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // Alert.alert('Notification permission granted');
      getToken()
    } else {
      // Alert.alert('Notification permission denied');
    }
  }

  const requestNotifeePermission = async () => {
    const settings = await notifee.requestPermission();
    if (settings.authorizationStatus >= notifee.AuthorizationStatus.AUTHORIZED) {
      console.log('Notifee permission granted');
    } else {
      console.log('Notifee permission denied');
    }
  };

  const onDisplayNotification = async (remoteMessage) => {
    console.log("laxman...", remoteMessage);
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });


    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage.notification?.title || 'Default Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  const getToken = async () => {
    const token = await messaging().getToken();
    if (token) {
      console.log('FCM Token:', token);
    } else {
      console.log('No FCM token received');
    }
  }
  return (
    <View>
      <Text>App</Text>
    </View>
  )
}

export default App