import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const firestore = admin.firestore();

export const resetFoodItemsDaily = functions.pubsub.schedule('every day 00:00').onRun(async (context) => {
    const foodItemsRef = firestore.collection('foodItems');
    const snapshot = await foodItemsRef.get();

    const deletePromises: Promise<FirebaseFirestore.WriteResult>[] = [];
    snapshot.forEach((doc) => {
        deletePromises.push(doc.ref.delete());
    });

    await Promise.all(deletePromises);

    console.log('All food items have been reset.');
    return null;
});
