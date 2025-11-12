import { db, auth } from '@/firebase';
import { addDoc, collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { transformDate } from './general';

export const addExamDate = async (examData) => {

  console.log("here")
  examData.date = transformDate(examData.date)

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, "examDates"), {
      ...examData,
      uid: user.uid,
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding exam:", error);
    throw error;
  }

};

export const getUserExams = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const examsRef = collection(db, "examDates");
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


export const deleteExam = async (examId) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User must be authenticated to delete subjects.');
  }

  try {
    // --- 1️⃣ Delete the subject itself ---
    const examRef = doc(db, 'examDates', examId);
    await deleteDoc(examRef);
    console.log(`Deleted subject ${examRef}`);


  } catch (error) {
    console.error('Error deleting subject and related positions:', error);
    throw error;
  }
};