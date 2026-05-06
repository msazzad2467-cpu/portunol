import { messaging } from './firebaseConfig';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const notificationService = {
  async requestPermission(uid: string) {
    if (!messaging) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, { 
          vapidKey: 'YOUR_VAPID_KEY_HERE' // This will be set by the user in Firebase Console
        });
        
        if (token) {
          const userRef = doc(db, 'users', uid);
          await updateDoc(userRef, { fcmToken: token });
          console.log('FCM Token saved');
        }
      }
    } catch (e) {
      console.error('Notification permission failed', e);
    }
  },

  onForegroundMessage() {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      // You could show a toast here
    });
  }
};
