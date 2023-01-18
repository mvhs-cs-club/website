// react
import { useEffect, useState, useContext } from 'react';

// mui
import { Backdrop, Box, CircularProgress, useTheme, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// firebase
import { createDefaultUser, db } from 'utils/firebase';
import { onSnapshot, doc, DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { User } from 'firebase/auth';

// utils
import { UserContext } from 'contexts/UserContext';

// types
import { PointHistory } from 'types/utils';

// components
import Card from 'components/card';
import CardTitle from 'components/card-title';
import PageTitle from 'components/page-title';
import Sub from 'components/sub';
import FadeIn from 'keyframes/fade-in';
import FullCenter from 'components/full-center';
import ExpandDown from 'keyframes/expand-down';
import PageWrapper from 'components/page-wrapper';

const HomeWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5)
}));

const HomeCards = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '28px'
});

const Points = styled('div')({
  display: 'flex',
  flexDirection: 'column'
});

const PointsWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between'
});

const FullHistoryLink = styled('span')(({ theme }) => ({
  color: theme.palette.mode === 'light' ? '#007bff' : '#49a1ff',
  cursor: 'pointer',
  userSelect: 'none',
  '--webkit-user-select': 'none',
  '--moz-user-select': 'none',
  '--ms-user-select': 'none',
  alignSelf: 'flex-start',
  fontSize: '14px',
  svg: {
    height: '20px',
    aspectRatio: 1,
    transform: 'translateY(4px)'
  }
}));

const CurrentPoints = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  width: 'fit-content'
});

const History = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1)
}));

const FullHistoryWrapper = styled('div')({
  padding: '0 20px 20px 20px'
});

const HistoryItem = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

const Amount = styled('span')({
  fontSize: '12px',
  borderRadius: '50px',
  display: 'flex',
  alignItems: 'center',
  padding: '6px 10px'
});

const NegativeSignedValue = styled('div')({
  marginLeft: '10px',
  position: 'relative',
  '&::before': {
    content: "''",
    position: 'absolute',
    top: '50%',
    left: 'calc(-50% + 19px)',
    height: '1px',
    width: '7px',
    background: 'red'
  }
});

const HistoryTitle = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  background: theme.palette.background.paper,
  padding: '20px 20px 12px 20px',
  zIndex: 200,
  transition: '0.1s'
}));

const Home = () => {
  const user: User | null | undefined = useContext(UserContext);
  const theme = useTheme();

  const [points, setPoints] = useState<number | null>(null);
  const [history, setHistory] = useState<PointHistory[]>([]);
  const [showingFullHistory, setShowingFullHistory] = useState<boolean>(false);
  const [historyScrollTop, setHistoryScrollTop] = useState<number>(0);
  const [hasUserResponse, setHasUserResponse] = useState<boolean>(false);

  const cardStyle = {
    minWidth: 300
  };

  const historyCardSx = {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '400px',
    maxHeight: '600px',
    overflowY: 'scroll',
    scrollBehavior: 'smooth',
    padding: '0 !important',
    transition: '0.15s',
    background: theme.palette.background.paper
  };

  const shadowSx: string = '0px 0px 10px 1px rgb(0 0 0 / 20%)';

  const handleShowFullHistory = () => {
    setShowingFullHistory(true);
  };

  const handleCloseFullHistory = (): void => {
    setShowingFullHistory(false);
  };

  useEffect(() => {
    if (user) {
      (async (): Promise<void> => {
        onSnapshot(doc(db, 'users', user.uid), (snapshot: DocumentSnapshot<DocumentData>) => {
          setHasUserResponse(true);
          if (snapshot.exists()) {
            const data = snapshot.data();
            const points = data.history
              .map((item: any) => item.amount)
              .reduce((acc: number, curr: number) => acc + curr, 0);
            setPoints(points);
            setHistory(data.history);
          } else {
            createDefaultUser(user);
          }
        });
      })();
    }
  }, [user]);

  const handleHistoryCardScroll = (e: any): void => {
    setHistoryScrollTop(e.target.scrollTop);
  };

  const SignedValue = ({ value }: { value: number }) => {
    const temp = Math.abs(value);

    return value >= 0 ? <>+ {temp}</> : <NegativeSignedValue>{temp}</NegativeSignedValue>;
  };

  return (
    <PageWrapper>
      <HomeWrapper>
        {user && <PageTitle>Signed in as {user?.displayName}</PageTitle>}
        <HomeCards>
          {user ? (
            <Card sx={cardStyle}>
              <FadeIn>
                <Points
                  sx={{
                    gap: theme.spacing(history.length > 0 ? 2.25 : 1)
                  }}
                >
                  <PointsWrapper>
                    <CurrentPoints>
                      <Sub>Points</Sub>
                      <span>{points}</span>
                    </CurrentPoints>
                    {hasUserResponse && (
                      <FadeIn
                        sx={{
                          marginTop: '-2px'
                        }}
                      >
                        <FullHistoryLink onClick={handleShowFullHistory}>
                          Show all
                          <ChevronRightIcon
                            sx={{
                              height: '16.5px !important'
                            }}
                          />
                        </FullHistoryLink>
                      </FadeIn>
                    )}
                  </PointsWrapper>
                  <FadeIn>
                    <ExpandDown>
                      <History>
                        {hasUserResponse ? (
                          history.length > 0 ? (
                            history
                              .filter((_: any, index: number): boolean => index < 4)
                              .map((value: PointHistory, index: number) => (
                                <HistoryItem key={`history-item-${index}`}>
                                  <Box>
                                    {value.reason}
                                    <Sub>{value.date}</Sub>
                                  </Box>
                                  <Amount
                                    sx={
                                      value.amount >= 0
                                        ? {
                                            color: '#28a745',
                                            border: '1px solid #28a745'
                                          }
                                        : {
                                            color: '#dc3545',
                                            border: '1px solid #dc3545'
                                          }
                                    }
                                  >
                                    <SignedValue value={value.amount} />
                                  </Amount>
                                </HistoryItem>
                              ))
                          ) : (
                            <Typography
                              sx={{
                                marginTop: '8px'
                              }}
                              variant="body1"
                            >
                              No Point History
                            </Typography>
                          )
                        ) : (
                          <FullCenter>
                            <CircularProgress
                              color="info"
                              size={26}
                              thickness={5}
                            />
                          </FullCenter>
                        )}
                      </History>
                    </ExpandDown>
                  </FadeIn>
                  <Backdrop
                    sx={{
                      color: '#fff',
                      zIndex: (theme: any) => theme.zIndex.drawer + 1,
                      backdropFilter: 'blur(4px)'
                    }}
                    open={showingFullHistory}
                    onClick={handleCloseFullHistory}
                  >
                    <Card
                      sx={historyCardSx}
                      onClick={(e: any) => e.stopPropagation()}
                      onScroll={(e: any) => handleHistoryCardScroll(e)}
                    >
                      <HistoryTitle
                        sx={{
                          ...(historyScrollTop > 0
                            ? {
                                boxShadow: shadowSx
                              }
                            : {})
                        }}
                      >
                        <CardTitle size="large">Point history</CardTitle>
                      </HistoryTitle>
                      <FullHistoryWrapper>
                        <History>
                          {history.length > 0 ? (
                            history.map((value: PointHistory, index: number) => (
                              <HistoryItem key={`full-history-item-${index}`}>
                                <Box>
                                  {value.reason}
                                  <Sub>{value.date}</Sub>
                                </Box>
                                <Amount
                                  sx={
                                    value.amount >= 0
                                      ? {
                                          color: '#28a745',
                                          border: '1px solid #28a745'
                                        }
                                      : {
                                          color: '#dc3545',
                                          border: '1px solid #dc3545'
                                        }
                                  }
                                >
                                  <SignedValue value={value.amount} />
                                </Amount>
                              </HistoryItem>
                            ))
                          ) : (
                            <Typography variant="body1">No Point History</Typography>
                          )}
                        </History>
                      </FullHistoryWrapper>
                    </Card>
                  </Backdrop>
                </Points>
              </FadeIn>
            </Card>
          ) : (
            <PageTitle>Not logged in</PageTitle>
          )}
        </HomeCards>
      </HomeWrapper>
    </PageWrapper>
  );
};

export default Home;
