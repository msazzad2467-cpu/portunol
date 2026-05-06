import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';

admin.initializeApp();

/**
 * League Reset Function
 * Runs every Monday at 00:00 UTC
 */
export const leagueReset = onSchedule('0 0 * * 1', async (event) => {
  const db = admin.firestore();
  const tiers = ['Bronze', 'Prata', 'Ouro', 'Diamante'];

  for (const tier of tiers) {
    const snap = await db.collection('users')
      .where('leagueTier', '==', tier)
      .orderBy('weeklyXP', 'desc')
      .get();

    const users = snap.docs;
    if (users.length === 0) continue;

    const batch = db.batch();

    users.forEach((doc, idx) => {
      let nextTier = tier;
      
      // Promotion logic
      if (idx < 5 && tier !== 'Diamante') {
        const nextIdx = tiers.indexOf(tier) + 1;
        nextTier = tiers[nextIdx];
      }
      
      // Demotion logic
      if (idx > users.length - 3 && tier !== 'Bronze') {
        const nextIdx = tiers.indexOf(tier) - 1;
        nextTier = tiers[nextIdx];
      }

      batch.update(doc.ref, {
        leagueTier: nextTier,
        weeklyXP: 0,
        lastLeagueRank: idx + 1
      });
    });

    await batch.commit();
  }
  
  console.log('League reset complete');
});

/**
 * Daily Notification Trigger
 * Runs daily at 09:00 local time (simplified as UTC)
 */
export const dailyReminder = onSchedule('0 9 * * *', async (event) => {
  const db = admin.firestore();
  
  const snap = await db.collection('users').get();
  
  const notifications: Promise<any>[] = [];

  snap.forEach(userDoc => {
    const data = userDoc.data();
    if (!data.fcmToken) return;

    // Logic for SRS count or Streak
    const payload = {
      notification: {
        title: '🔥 Não perca sua ofensiva!',
        body: 'Pratique 5 minutos de espanhol para manter seu streak vivo.',
        icon: 'https://your-app.com/logo.png'
      },
      token: data.fcmToken
    };

    notifications.push(admin.messaging().send(payload));
  });

  await Promise.all(notifications);
});
