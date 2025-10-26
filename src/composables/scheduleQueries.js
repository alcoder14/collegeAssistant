import { db } from '@/firebase';
import { setDoc, doc } from 'firebase/firestore';

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