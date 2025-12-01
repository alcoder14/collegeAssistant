import { db, auth } from '@/firebase';
import { addDoc, collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { generateDate, generateTime } from './general';

export const addNote = async (noteData) => {

  let dateNow = generateDate()
  let timeNow = generateTime()

  try {
    const user = auth.currentUser;
    const docRef = await addDoc(collection(db, "notes"), {
      ...noteData,
      uid: user.uid,
      date: dateNow,
      time: timeNow
    });

    return docRef.id;
  } catch (error) {
    console.log(error)
    throw error;
  }
};


export const updateNote = async (id, noteData) => {
  try {
    const user = auth.currentUser;
    const docRef = doc(db, "notes", id);
    await updateDoc(docRef, {
      ...noteData,
      uid: user.uid,
    });

    return id;
  } catch (error) {
    console.log(error)
    throw error;
  }
};


export const getUserNotes = async () => {
  try {
    const user = auth.currentUser;
    const notesRef = collection(db, "notes");
    const q = query(notesRef, where("uid", "==", user.uid));

    const querySnapshot = await getDocs(q);

    const notes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return notes;
  } catch (error) {
    console.log(error)
    throw error;
  }
};


export const deleteNote = async (noteID) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated to delete subjects.');
  }
  try {
    const noteRef = doc(db, 'notes', noteID);
    await deleteDoc(noteRef);

  } catch (error) {
    console.error(error);
    throw error;
  }
};