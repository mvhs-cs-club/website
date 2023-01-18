// react
import { useContext } from 'react';

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

const RequestAttendance = () => {
  const user = useContext(UserContext);
  const users = useContext(UsersContext);
  const userLoading = useContext(UserLoadingContext);

  const getUser = (users: UserType[], user: User): UserType | null => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].uid === user.uid) return users[i];
    }
    return null;
  };

  const handleRequestAttendance = () => {
    if (!user || !users) return;
    const userInfo = getUser(users, user);
    if (!userInfo) return;
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
        {userLoading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="outlined"
            size="large"
            onClick={handleRequestAttendance}
          >
            Request Attendance
          </Button>
        )}
      </Card>
    </PageWrapper>
  );
};

export default RequestAttendance;
