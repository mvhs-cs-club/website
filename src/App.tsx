// react
import { useState, useEffect } from 'react';

// mui
import { styled } from '@mui/material/styles';

// firebase
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, getChallenges, db } from 'utils/firebase';
import { onSnapshot, collection, DocumentData, QuerySnapshot, doc } from 'firebase/firestore';

// utils
import {
  UserContext,
  UserLoadingContext,
  AdminContext,
  UserResponseContext,
  UsersContext,
  AdminIdsContext
} from 'contexts/UserContext';
import { ChallengesContext } from 'contexts/ChallengesContext';
import { ProblemsContext } from 'contexts/ProblemsContext';
import { utils } from 'utils/style-utils';

// components
import Header from 'components/header';
import Sidebar from 'components/sidebar';
import Router from 'pages/router';

// types
import type { ChallengeType } from 'types/challenge';
import type { UserType } from 'types/user';
import type { ProblemType } from 'types/problem';
import { AttendanceRequestContext } from './contexts/AttendanceContext';
import { AttendanceMap } from './types/attendance';

const AppWrapper = styled('div')({
  maxHeight: '100vh',
  height: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column'
});

const Content = styled('div')({
  height: '100%',
  width: '100vw',
  maxHeight: `calc(100vh - ${utils.headerHeight})`,
  display: 'flex'
});

const App = () => {
  const [user, loading, error] = useAuthState(auth);
  // admin; null = loading, false = not admin
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userResponse, setUserResponse] = useState<boolean>(false);
  const [challenges, setChallenges] = useState<ChallengeType[] | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<UserType[] | null>(null);
  const [problems, setProblems] = useState<ProblemType[] | null>(null);
  const [adminIds, setAdminIds] = useState<string[] | null>(null);
  const [attendanceRequests, setAttendanceRequests] = useState<AttendanceMap | null>(null);

  useEffect(() => {
    (async () => {
      onSnapshot(collection(db, 'users'), (docs: QuerySnapshot<DocumentData>) => {
        let userChanges: UserType[] = [];
        docs.forEach((change: DocumentData): void => {
          userChanges.push(change.data());
        });
        setLeaderboardData(userChanges);
      });

      onSnapshot(collection(db, 'problems'), (docs: QuerySnapshot<DocumentData>) => {
        let newDocs: ProblemType[] = [];
        docs.forEach((doc: DocumentData): void => {
          newDocs.push(doc.data());
        });
        setProblems(newDocs);
      });

      onSnapshot(doc(db, 'admins', 'admins'), (data: DocumentData) => {
        setAdminIds(data.data().ids);
      });
    })();
  }, []);

  useEffect((): void => {
    if (user?.uid !== undefined) {
      (async (): Promise<void> => {
        onSnapshot(collection(db, 'attendance_requests'), (v) => {
          let tempAttReqMap: AttendanceMap = {};
          v.forEach((doc) => {
            tempAttReqMap[doc.id] = doc.data() as Partial<UserType>;
          });
          setAttendanceRequests(tempAttReqMap);
        });

        onSnapshot(doc(db, 'admins', 'admins'), (doc: DocumentData) => {
          const data = doc.data().ids;
          let tempIsAdmin: boolean = data.includes(user.uid);
          setIsAdmin(tempIsAdmin);
        });

        const dbChallenges: ChallengeType[] = await getChallenges();
        setChallenges(dbChallenges);

        onSnapshot(collection(db, 'challenges'), (docs: QuerySnapshot<DocumentData>) => {
          let newDocs: ChallengeType[] = [];
          docs.forEach((doc: DocumentData): void => {
            newDocs.push(doc.data());
          });
          setChallenges(newDocs);
        });
      })();
    }
  }, [user?.uid]);

  useEffect(() => {
    if (loading === false) {
      setUserResponse(true);
    }
  }, [loading]);

  return (
    <UserContext.Provider value={user}>
      <UserResponseContext.Provider value={userResponse}>
        <UserLoadingContext.Provider value={loading}>
          <AdminContext.Provider value={isAdmin}>
            <AdminIdsContext.Provider value={adminIds}>
              <ChallengesContext.Provider value={challenges}>
                <UsersContext.Provider value={leaderboardData}>
                  <ProblemsContext.Provider value={problems}>
                    <AttendanceRequestContext.Provider value={attendanceRequests}>
                      <AppWrapper>
                        <Header />
                        <Content>
                          <Sidebar />
                          <Router />
                        </Content>
                      </AppWrapper>
                    </AttendanceRequestContext.Provider>
                  </ProblemsContext.Provider>
                </UsersContext.Provider>
              </ChallengesContext.Provider>
            </AdminIdsContext.Provider>
          </AdminContext.Provider>
        </UserLoadingContext.Provider>
      </UserResponseContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
