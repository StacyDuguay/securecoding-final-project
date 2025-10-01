import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

import serviceAccount from "../assignment-3-d1e09-firebase-adminsdk-fbsvc-4af1a21265.json";

initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
});


const db: Firestore = getFirestore();

export { db };