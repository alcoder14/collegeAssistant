import { db, auth } from '@/firebase';
import { addDoc, collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export const addTest = async (examData) => {

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, "tests"), {
      ...examData,
      uid: user.uid,
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding exam:", error);
    throw error;
  }

};


export const updateTest = async (id, examData) => {

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = doc(db, "tests", id);

    await updateDoc(docRef, {
      ...examData,
      uid: user.uid,
    });

    return id;
  } catch (error) {
    console.error("Error updating exam:", error);
    throw error;
  }
};


export const getUserTests = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const examsRef = collection(db, "tests");
    const q = query(examsRef, where("uid", "==", user.uid));

    const querySnapshot = await getDocs(q);

    const exams = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return exams;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};


export const deleteTest = async (examId) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User must be authenticated to delete subjects.');
  }

  try {
    // --- 1️⃣ Delete the subject itself ---
    const examRef = doc(db, 'tests', examId);
    await deleteDoc(examRef);
    console.log(`Deleted subject ${examRef}`);


  } catch (error) {
    console.error('Error deleting subject and related positions:', error);
    throw error;
  }
};


export const updateTestResult = async (id, examData) => {

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = doc(db, "tests", id);

    await updateDoc(docRef, {
      ...examData,
      uid: user.uid,
    });

    return id;
  } catch (error) {
    console.error("Error updating exam:", error);
    throw error;
  }
};