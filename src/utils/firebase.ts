import { initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  signInWithPopup,
  browserLocalPersistence,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  getFirestore,
  deleteDoc,
  limit,
  query,
  updateDoc,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { languages } from 'utils/languages';
import type { ChallengeType, ChallengeStatus, CodeType } from 'types/challenge';
import type { AdminType } from 'types/admin';
import type { AnnouncementType } from 'src/types/announcement';
import type { UserType } from 'types/user';
import type { ProblemType } from 'types/problem';
import { AttendanceUser } from 'src/types/attendance';
import { uuid } from './utils';

const config = {
  apiKey: 'AIzaSyDV-jaVv4Nfs-VJGw5AxUve0QonRfeZDLg',
  authDomain: 'mvhs-cs-club-website.firebaseapp.com',
  projectId: 'mvhs-cs-club-website',
  storageBucket: 'mvhs-cs-club-website.appspot.com',
  messagingSenderId: '34476205353',
  appId: '1:34476205353:web:4845cecb8831704e8c0338',
  measurementId: 'G-199L7JP5FX'
};

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

export const handleSignOut = async (): Promise<void> => {
  await signOut(auth);
};

export const getAnnouncements = async (): Promise<AnnouncementType[]> => {
  let announcements: AnnouncementType[] = [];
  const announcementsColRef = collection(db, 'announcements');
  const announcementsQuery = query(announcementsColRef, limit(80));
  const announcementsSnap = await getDocs(announcementsQuery);
  announcementsSnap.forEach((announcement: any) => {
    const announcementData: AnnouncementType = {
      ...announcement.data(),
      id: announcement.id
    };
    announcements.push(announcementData);
  });
  announcements.sort((a, b) => {
    if (a.timestamp === null || typeof a.timestamp !== typeof 0) return 1;
    if (b.timestamp === null || typeof b.timestamp !== typeof 0) return -1;
    return b.timestamp - a.timestamp;
  });
  return announcements;
};

export const requestAdminPermissions = (user: any) => {
  const request: AdminType = {
    name: user.displayName,
    email: user.email,
    photoUrl: user.photoURL,
    uid: user.uid
  };
  setDoc(doc(db, 'admins', 'requests', 'requests', user.uid), request);
};

export const approveAdminRequest = async (user: any): Promise<void> => {
  const uid = user.uid;
  const admins = await getDoc(doc(db, 'admins', 'admins'));
  let ids: string[] = admins.data()?.ids;
  if (!ids.includes(uid)) {
    const adminObj: AdminType = {
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
      uid
    };
    ids.push(uid);
    setDoc(doc(db, 'admins', 'admins'), { ids });
    setDoc(doc(db, 'admins', 'admins', 'admins', uid), adminObj);
  }
  deleteDoc(doc(db, 'admins', 'requests', 'requests', uid));
};

export const createDefaultUser = async (user: any): Promise<UserType> => {
  const defaultUser: UserType = {
    email: user.email,
    history: [],
    name: user.displayName,
    photoUrl: user.photoURL,
    uid: user.uid
  };
  await setDoc(doc(db, 'users', user.uid), defaultUser);
  return defaultUser;
};

export const processRequestCol = (requestCol: QuerySnapshot<DocumentData>): AdminType[] => {
  const requests: any[] = [];
  requestCol.forEach((request) => {
    requests.push(request.data());
  });
  return requests;
};

export const getRequests = async (): Promise<AdminType[]> => {
  const requestsCol = await getDocs(collection(db, 'admins', 'requests', 'requests'));
  return processRequestCol(requestsCol);
};

export const addAnnouncement = async (announcement: AnnouncementType): Promise<void> => {
  const id = uuid();
  announcement.id = id;
  setDoc(doc(db, 'announcements', id), announcement);
};

export const processAdminCol = (adminsCol: QuerySnapshot<DocumentData>): AdminType[] => {
  let admins: any[] = [];
  adminsCol.forEach((admin) => {
    admins.push(admin.data());
  });
  return admins;
};

export const getAdminObjs = async (): Promise<AdminType[]> => {
  const adminsCol = await getDocs(collection(db, 'admins', 'admins', 'admins'));
  return processAdminCol(adminsCol);
};

export const getLeaderboard = async (): Promise<UserType[]> => {
  const leaderboard: any[] = [];
  const snap = await getDocs(collection(db, 'users'));
  snap.forEach((request) => {
    leaderboard.push(request.data());
  });
  return leaderboard;
};

export const getUserData = async (user: any): Promise<UserType> => {
  const uid = user.uid;
  const snap = await getDoc(doc(db, 'users', uid));
  if (snap.exists()) {
    return snap.data() as UserType;
  } else {
    const newUser = await createDefaultUser(user);
    return newUser;
  }
};

export const addPoints = async (user: any, reason: string, amount: number): Promise<void> => {
  const uid = user.uid;
  const data = await getUserData(user);
  const newUserObj: any = {
    history: [
      {
        amount,
        reason,
        timestamp: Date.now(),
        date: new Date().toLocaleDateString()
      },
      ...data.history
    ]
  };
  updateDoc(doc(db, 'users', uid), newUserObj);
};

export const updateAnnouncement = (id: string | undefined, value: string) => {
  if (id) updateDoc(doc(db, 'announcements', id), { content: value });
};

export const deleteAnnouncement = (id: string | undefined) => {
  if (id) deleteDoc(doc(db, 'announcements', id));
};

export const rejectAdminRequest = (uid: string): void => {
  deleteDoc(doc(db, 'admins', 'requests', 'requests', uid));
};

export const removeAdmin = async (uid: string): Promise<void> => {
  let adminDoc = await getDoc(doc(db, 'admins', 'admins'));
  if (adminDoc.exists()) {
    let adminIds: string[] = adminDoc.data().ids;
    adminIds = adminIds.filter((id: string): boolean => id !== uid);
    await deleteDoc(doc(db, 'admins', 'admins', 'admins', uid));
    await setDoc(doc(db, 'admins', 'admins'), { ids: adminIds });
  }
};

export const addChallenge = async (challenge: ChallengeType): Promise<void> => {
  await setDoc(doc(db, 'challenges', challenge.name), challenge);
};

export const getChallenges = async (): Promise<ChallengeType[]> => {
  const challenges: any = await getDocs(collection(db, 'challenges'));
  let data: ChallengeType[] = [];
  challenges.forEach((challenge: DocumentData): void => {
    data.push(challenge.data());
  });
  return data;
};

export const deleteChallenge = async (name: string): Promise<void> => {
  await deleteDoc(doc(db, 'challenges', name));
};

export const replaceChallenge = async (from: string, to: ChallengeType): Promise<void> => {
  await deleteDoc(doc(db, 'challenges', from));
  await setDoc(doc(db, 'challenges', to.name), to);
};

export const signIn = async (): Promise<void> => {
  await setPersistence(auth, browserLocalPersistence)
    .then(() => {
      const provider = new GoogleAuthProvider();
      return signInWithPopup(auth, provider);
    })
    .catch(() => {});
  const user = auth.currentUser;
  if (user !== null) {
    const newUser = await getDoc(doc(db, 'users', user.uid));
    if (!newUser.exists()) {
      await createDefaultUser(user);
    }
  }
};

export const addProblem = async (problem: ProblemType): Promise<void> => {
  await setDoc(doc(db, 'problems', problem.title), problem);
};

export const deleteProblem = async (title: string): Promise<void> => {
  await deleteDoc(doc(db, 'problems', title));
};

export const replaceProblem = async (from: string, to: ProblemType): Promise<void> => {
  await deleteDoc(doc(db, 'problems', from));
  await setDoc(doc(db, 'problems', to.title), to);
};

export const deleteUserData = async (uid: string): Promise<void> => {
  await deleteDoc(doc(db, 'users', uid));
  await handleSignOut();
};

export const getChallengeData = async (id: string): Promise<ChallengeStatus | null> => {
  const user = auth.currentUser;
  if (user === null) return null;
  const challengeDoc = await getDoc(doc(db, 'users', user.uid, 'challenges', id));
  if (challengeDoc.exists()) {
    return challengeDoc.data() as ChallengeStatus;
  } else {
    const defaults: ChallengeStatus = {
      id,
      status: 'inprogress',
      code: languages.reduce((prev, current) => {
        let copy = { ...prev };
        copy[current] = '';
        return copy;
      }, {} as any)
    };
    await setDoc(doc(db, 'users', user.uid, 'challenges', id), defaults);
    return defaults;
  }
};

export const updateChallengeStatus = async (id: string, status: 'complete' | 'inprogress'): Promise<void> => {
  const user = auth.currentUser;
  if (user === null) return;
  await updateDoc(doc(db, 'users', user.uid, 'challenges', id), {
    status
  } as Partial<ChallengeStatus>);
};

export const updateChallengeCode = async (id: string, code: CodeType): Promise<void> => {
  const user = auth.currentUser;
  if (user === null) return;
  await updateDoc(doc(db, 'users', user.uid, 'challenges', id), {
    code
  });
};

export const requestAttendance = async (user: AttendanceUser) => {
  const dateString = new Date().toLocaleDateString().replace(/\//g, '-');
  const todaysRequest = await getDoc(doc(db, 'attendance_requests', dateString));
  const data: { [key: string]: AttendanceUser } = todaysRequest.data() || {};
  if (data[user.uid] === undefined) {
    data[user.uid] = user;
    setDoc(doc(db, 'attendance_requests', dateString), data);
  }
};

export const removeAttendanceRequest = async (date: string, uid: string) => {
  const reqs = await getDoc(doc(db, 'attendance_requests', date));
  let data = reqs.data();
  if (!data) return;
  if (!data[uid]) return;
  delete data[uid];
  if (Object.keys(data).length === 0) {
    deleteDoc(doc(db, 'attendance_requests', date));
  } else {
    setDoc(doc(db, 'attendance_requests', date), data);
  }
};

export const logAttendance = async (member: AttendanceUser, date: string) => {
  const todaysLog = await getDoc(doc(db, 'attendance_log', date));
  const data: { [key: string]: AttendanceUser } = todaysLog.data() || {};
  if (data[member.uid] === undefined) {
    data[member.uid] = member;
    setDoc(doc(db, 'attendance_log', date), data);
  }
};
