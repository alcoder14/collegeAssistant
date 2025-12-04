import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db, auth } from '@/firebase';

export const getLastNote = async () => {
  try {
    const user = auth.currentUser;
    const notesRef = collection(db, "notes");

    const q = query(
      notesRef,
      where("uid", "==", user.uid),
      orderBy("date", "desc"), // newest first
      limit(1)                 // only one result
    );

    const querySnapshot = await getDocs(q);

    const notes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return notes; // will contain 0 or 1 item
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getNextAssignment = async () => {
  try {
    const user = auth.currentUser;
    const assignmentsRef = collection(db, "assignments");

    // Format today's date as yyyy-mm-dd
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const q = query(
      assignmentsRef,
      where("uid", "==", user.uid),
      where("completed", "==", false),
      where("date", ">=", todayStr),
      orderBy("date", "asc"),
      limit(1)
    );

    const snapshot = await getDocs(q);

    const assignments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return assignments; // returns [] or [assignment]
  } catch (error) {
    console.log(error);
    throw error;
  }
};