// react
import { useContext, useEffect, useState } from 'react';

// mui
import { Button, CircularProgress } from '@mui/material';

// contexts
import { UserContext, UsersContext } from 'src/contexts/UserContext';
import { UserLoadingContext } from 'src/contexts/UserContext';

// db
import { requestAttendance } from 'utils/firebase';
import { UserType } from 'types/user';
import { User } from 'firebase/auth';

// components
import PageTitle from 'components/page-title';
import PageWrapper from 'components/page-wrapper';
import Card from 'components/card';
import CardTitle from 'src/components/card-title';
import { AttendanceRequestContext } from 'src/contexts/AttendanceContext';
import { AttendanceMap } from 'src/types/attendance';

const RequestAttendance = () => {
  const user = useContext(UserContext);
  const users = useContext(UsersContext);
  const userLoading = useContext(UserLoadingContext);
  const [userInfo, setUserInfo] = useState<UserType | null>(null);
  const [canRequest, setCanRequest] = useState(false);
  const attendanceRequests = useContext(AttendanceRequestContext);

  const getUser = (users: UserType[], user: User): UserType | null => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].uid === user.uid) return users[i];
    }
    return null;
  };

  const checkAlreadyMarked = (member: UserType): boolean => {
    for (let i = 0; i < member.history.length; i++) {
      const val = member.history[i];
      if (val.reason === 'Attending meeting' && val.date === new Date().toLocaleDateString()) {
        return true;
      }
    }
    return false;
  };

  const checkCanRequest = (requests: AttendanceMap, user: UserType): boolean => {
    console.log(requests);
    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    if (requests[date]) {
      const alreadyMarked = checkAlreadyMarked(user);
      return Boolean(requests[date][user.uid]) || alreadyMarked;
    }
    return false;
  };

  useEffect(() => {
    if (user && users && attendanceRequests) {
      const tempUserInfo = getUser(users, user);
      setUserInfo(tempUserInfo);
    }
  }, [user, users, attendanceRequests]);

  useEffect(() => {
    if (userInfo && attendanceRequests && !checkCanRequest(attendanceRequests, userInfo)) {
      setCanRequest(true);
    } else {
      setCanRequest(false);
    }
  }, [userInfo, attendanceRequests]);

  const handleRequestAttendance = () => {
    if (!userInfo || !attendanceRequests || checkCanRequest(attendanceRequests, userInfo)) return;
    requestAttendance(userInfo);
  };

  return (
    <PageWrapper>
      <PageTitle>Request Attendance</PageTitle>
      <Card
        sx={{
          width: '100%',
          maxWidth: '350px',
          height: '150px',
          marginTop: '36px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '30px'
        }}
      >
        {!userLoading ? (
          !user ? (
            <CardTitle
              size="small"
              sx={{ textAlign: 'center' }}
            >
              Sorry, you must be logged in to request attendance
            </CardTitle>
          ) : (
            <Button
              variant="outlined"
              size="large"
              onClick={handleRequestAttendance}
              disabled={!canRequest}
            >
              {canRequest ? 'Request Attendance' : 'Already requested'}
            </Button>
          )
        ) : (
          <CircularProgress />
        )}
      </Card>
    </PageWrapper>
  );
};

export default RequestAttendance;
