import { db, auth } from '@/firebase';
import { setDoc, doc, addDoc, collection, serverTimestamp, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';

export const createSchedule = async (uid) => {
    await setDoc(doc(db, 'schedules', uid), {
      uid: uid,
      breakDuration: 5,
      lessonDuration: 1,
      maxNumberOfLessons: 14,
      scheduleName: 'schedule1',
      startHour: '07:00',
    });
}

export const addSubject = async (subjectData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, "subjects"), {
      ...subjectData,
      uid: user.uid,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding subject:", error);
    throw error;
  }
};

export const getUserSubjects = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const subjectsRef = collection(db, "subjects");
    const q = query(subjectsRef, where("uid", "==", user.uid));

    const querySnapshot = await getDocs(q);

    const subjects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return subjects;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

export const getUserSubjectPositions = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const subjectsRef = collection(db, "subjectPositions");
    const q = query(subjectsRef, where("userID", "==", user.uid));

    const querySnapshot = await getDocs(q);

    const subjectPositions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return subjectPositions;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};



export const saveSubjectPosition = async (subjectId, xPosition, yPosition) => {

  const user = auth.currentUser;

  if (!user) {
    throw new Error('User must be authenticated to save subject positions.');
  }

  try {
    const docRef = await addDoc(collection(db, 'subjectPositions'), {
      userID: user.uid,
      subjectID: subjectId,
      xPosition,
      yPosition,
      createdAt: new Date(),
    });

    console.log('Subject position saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving subject position:', error);
    throw error;
  }
};

export const deleteSubjectPosition = async (xPosition, yPosition) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User must be authenticated to delete subject positions.');
  }

  try {
    const q = query(
      collection(db, 'subjectPositions'),
      where('userID', '==', user.uid),
      where('xPosition', '==', xPosition),
      where('yPosition', '==', yPosition)
    );

    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));

    await Promise.all(deletePromises);

    console.log(`Deleted subject position(s) at (${xPosition}, ${yPosition})`);
  } catch (error) {
    console.error('Error deleting subject position:', error);
    throw error;
  }
};

export const deleteSubjectAndTheirPositions = async (subjectId) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User must be authenticated to delete subjects.');
  }

  try {
    // --- 1️⃣ Delete the subject itself ---
    const subjectRef = doc(db, 'subjects', subjectId);
    await deleteDoc(subjectRef);
    console.log(`Deleted subject ${subjectId}`);

    // --- 2️⃣ Delete all subjectPositions linked to this subject ---
    const q = query(
      collection(db, 'subjectPositions'),
      where('userID', '==', user.uid),
      where('subjectID', '==', subjectId)
    );

    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);

    console.log(`Deleted ${snapshot.size} subject position(s) for subject ${subjectId}`);
  } catch (error) {
    console.error('Error deleting subject and related positions:', error);
    throw error;
  }
};

export const getUserSchedule = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const schedulesRef = collection(db, "schedules");
    const q = query(schedulesRef, where("uid", "==", user.uid));

    const querySnapshot = await getDocs(q);

    const schedule = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(schedule)

    return schedule;
  } catch (error) {
    console.error("Error fetching user schedules:", error);
    throw error;
  }
};

export const updateScheduleStartHour = async (newStartHour) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const schedulesRef = collection(db, "schedules");
    const q = query(schedulesRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("No schedule found for this user.");
    }

    const scheduleDoc = querySnapshot.docs[0].ref; // Assume one schedule per user
    await updateDoc(scheduleDoc, { startHour: newStartHour });

    console.log("✅ startHour updated successfully");
  } catch (error) {
    console.error("Error updating startHour:", error);
    throw error;
  }
};

export const updateScheduleName = async (name) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const schedulesRef = collection(db, "schedules");
    const q = query(schedulesRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("No schedule found for this user.");
    }

    const scheduleDoc = querySnapshot.docs[0].ref; // Assume one schedule per user
    await updateDoc(scheduleDoc, { scheduleName: name });

    console.log("✅ startHour updated successfully");
  } catch (error) {
    console.error("Error updating startHour:", error);
    throw error;
  }
};