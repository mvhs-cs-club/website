// react
import { useContext } from 'react';

// mui
import { styled } from '@mui/material/styles';
import { Button, CircularProgress } from '@mui/material';

// firebase
import { addPoints } from 'utils/firebase';

// utils
import { v4 } from 'uuid';
import {
  AdminContext,
  UsersContext,
  AdminIdsContext
} from 'contexts/UserContext';

// types
import type { PointHistory } from 'types/utils';
import type { UserType } from 'types/user';

// components
import Card from 'components/card';
import ProfileBox from 'components/profile-box';
import PageTitle from 'components/page-title';
import ProfileBoxWrapper from 'components/profile-box-wrapper';
import ExpandDown from 'keyframes/expand-down';
import FadeIn from 'keyframes/fade-in';
import FullCenter from 'components/full-center';
import PageWrapper from 'components/page-wrapper';

const AttendanceWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1)
}));

const AttendanceCards = styled('div')({
  display: 'flex',
  gap: '24px'
});

const Attendance = () => {
  const isAdmin: boolean | null = useContext(AdminContext);
  const users: UserType[] | null = useContext(UsersContext);
  const adminIds: string[] | null = useContext(AdminIdsContext);

  const memberCardStyle = {
    minWidth: 400
  };

  const getCurrentDateString = (): string => {
    return new Date().toLocaleDateString();
  };

  const checkAlreadyMarked = (member: any): boolean => {
    let alreadyMarked: boolean = false;
    member.history.forEach((val: PointHistory) => {
      if (val.reason === 'attending meeting' && val.date === new Date().toLocaleDateString()) {
        alreadyMarked = true;
        return;
      }
    });
    return alreadyMarked;
  };

  const markAsPresent = async (member: any) => {
    if (!checkAlreadyMarked(member)) {
      await addPoints(member, 'attending meeting', 50);
    }
  };

  const CurrentDate = (): React.ReactElement => {
    return <>{getCurrentDateString()}</>;
  };

  return (
    <PageWrapper>
      <AttendanceWrapper>
        {isAdmin ? (
          <>
            <PageTitle>Attendance for {<CurrentDate />}</PageTitle>
            <AttendanceCards>
              {adminIds !== null && (
                <FadeIn>
                  <Card sx={memberCardStyle}>
                    <ExpandDown>
                      <ProfileBoxWrapper>
                        {users !== null
                          ? (
                            users
                              .filter((member: UserType) => !adminIds.includes(member.uid))
                              .map((member: UserType) => (
                                <ProfileBox user={member} key={v4()}>
                                  <Button
                                    color="info"
                                    onClick={() => markAsPresent(member)}
                                    disabled={checkAlreadyMarked(member)}
                                  >
                                    Present
                                  </Button>
                                </ProfileBox>
                              ))
                          ) : (
                            <FullCenter>
                              <CircularProgress color="info" />
                            </FullCenter>
                          )
                        }
                      </ProfileBoxWrapper>
                    </ExpandDown>
                  </Card>
                </FadeIn>
              )}
            </AttendanceCards>
          </>
        ) : (
          <PageTitle>You do not have access to this page. Sorry!</PageTitle>
        )}
      </AttendanceWrapper>
    </PageWrapper>
  );
};

export default Attendance;
