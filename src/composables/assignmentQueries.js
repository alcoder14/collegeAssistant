import { db, auth } from '@/firebase';
import { addDoc, collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { transformDate } from './general';

export const addDueAssignment = async (assignmentData) => {

  assignmentData.date = transformDate(assignmentData.date)

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, "dueAssignments"), {
      ...assignmentData,
      uid: user.uid,
    });

    return docRef.id;
  } catch (error) {
    console.log(error)
    throw error;
  }

};


export const updateDueAssignment = async (id, assignmentData) => {
  // Transform date (keep consistent)
  assignmentData.date = transformDate(assignmentData.date);

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = doc(db, "dueAssignments", id);

    await updateDoc(docRef, {
      ...assignmentData,
      uid: user.uid,
    });

    return id;
  } catch (error) {
    console.log(error)
    throw error;
  }
};


export const getUserAssignments = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const assignmentsRef = collection(db, "dueAssignments");
    const q = query(assignmentsRef, where("uid", "==", user.uid));

    const querySnapshot = await getDocs(q);

    const assignments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return assignments;
  } catch (error) {
    console.log(error)
    throw error;
  }
};


export const deleteDueAssignment = async (assignmentID) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User must be authenticated to delete subjects.');
  }

  try {
    // --- 1️⃣ Delete the subject itself ---
    const assignmentRef = doc(db, 'dueAssignments', assignmentID);
    await deleteDoc(assignmentRef);

  } catch (error) {
    console.error('Error deleting subject and related positions:', error);
    throw error;
  }
};