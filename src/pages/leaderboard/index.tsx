// react
import { useContext, useEffect, useState } from 'react';

// mui
import { CircularProgress, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// utils
import { UsersContext } from 'contexts/UserContext';

// types
import type { PointHistory } from 'types/utils';
import type { UserType } from 'types/user';

// components
import Card from 'components/card';
import PageTitle from 'components/page-title';
import Sub from 'components/sub';
import FadeIn from 'keyframes/fade-in';
import FullCenter from 'components/full-center';
import ExpandDown from 'keyframes/expand-down';
import PageWrapper from 'components/page-wrapper';

const LeaderboardWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  maxHeight: '100%'
}));

const LeaderboardHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: theme.spacing(2.5),
  paddingBottom: theme.spacing(1.5),
  position: 'sticky',
  top: 0,
  background: 'white',
  zIndex: 5
}));

const LeaderboardContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(2.5),
  paddingTop: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5)
}));

const LeaderboardItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const PlaceWrapper = styled('span')({
  height: 24,
  width: 24,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 1px 0 1px'
});

const AbsolutePlaceWrapper = styled('span')({
  position: 'relative',
  span: {
    position: 'absolute',
    top: '3.5px',
    left: '9.5px',
    color: 'white',
    fontSize: '10px'
  }
});

const DataWrapper = styled('span')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  gap: theme.spacing(1.5)
}));

const Leaderboard = () => {
  const leaderboard: UserType[] | null = useContext(UsersContext);
  const [leaderbaordScroll, setLeaderboardScroll] = useState<number>(0);
  const theme = useTheme();
  const goldColor = '#f5ce00';
  const silverColor = '#C0C0C0';
  const bronzeColor = '#CD7F32';

  const handleScroll = (e: any): void => {
    setLeaderboardScroll(e.target.scrollTop);
  };

  const getPointsFromHistory = (history: PointHistory[]) => {
    return history.map((item: any) => item.amount).reduce((acc: number, curr: number) => acc + curr, 0);
  };

  const leaderboardSx = {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    minWidth: '400px',
    maxWidth: '800px',
    maxHeight: '100%',
    overflowY: 'scroll'
  };

  const leaderboardShadowSx = {
    boxShadow: '0px 0px 10px 1px rgb(0 0 0 / 20%)'
  };

  return (
    <PageWrapper>
      <LeaderboardWrapper>
        <PageTitle>Leaderboard</PageTitle>
        <FadeIn>
          <Card
            sx={leaderboardSx}
            onScroll={handleScroll}
          >
            <LeaderboardHeader
              sx={{
                background: theme.palette.background.default,
                ...(leaderbaordScroll > 0 ? leaderboardShadowSx : {})
              }}
            >
              <Sub>Name</Sub>
              <Sub>Points</Sub>
            </LeaderboardHeader>
            {leaderboard !== null ? (
              <FadeIn>
                <ExpandDown>
                  <LeaderboardContent>
                    {leaderboard.length > 0 &&
                      leaderboard
                        .sort(
                          (a: UserType, b: UserType) =>
                            getPointsFromHistory(b.history) - getPointsFromHistory(a.history)
                        )
                        .map((data: UserType, i: number) => (
                          <LeaderboardItem key={`leaderbaord-item-${i}`}>
                            {i === 0 ? (
                              <AbsolutePlaceWrapper>
                                <EmojiEventsIcon sx={{ color: goldColor }} />
                                <span>1</span>
                              </AbsolutePlaceWrapper>
                            ) : i === 1 ? (
                              <AbsolutePlaceWrapper>
                                <EmojiEventsIcon sx={{ color: silverColor }} />
                                <span>2</span>
                              </AbsolutePlaceWrapper>
                            ) : i === 2 ? (
                              <AbsolutePlaceWrapper>
                                <EmojiEventsIcon sx={{ color: bronzeColor }} />
                                <span>3</span>
                              </AbsolutePlaceWrapper>
                            ) : (
                              <PlaceWrapper>{i + 1}</PlaceWrapper>
                            )}
                            <DataWrapper>
                              <span>{data.name}</span>
                              <span>{getPointsFromHistory(data.history)}</span>
                            </DataWrapper>
                          </LeaderboardItem>
                        ))}
                  </LeaderboardContent>
                </ExpandDown>
              </FadeIn>
            ) : (
              <FullCenter
                sx={{
                  marginBottom: 20
                }}
              >
                <CircularProgress color="info" />
              </FullCenter>
            )}
          </Card>
        </FadeIn>
      </LeaderboardWrapper>
    </PageWrapper>
  );
};

export default Leaderboard;
