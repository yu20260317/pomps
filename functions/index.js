const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
admin.initializeApp();

exports.midnightReset = onSchedule("0 0 * * *", async (event) => {
  const db = admin.firestore();
  
  // 1. Reset the counter to 0
  await db.collection("counts").doc("court_1").update({player_count: 0});

  // 2. Clear all active 'tickets'
  const tickets = await db.collection("tickets").get();
  const batch = db.batch();
  tickets.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  console.log("Midnight Reset successful.");
});
