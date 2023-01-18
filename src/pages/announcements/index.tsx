// react
import { useState, useEffect, useContext } from 'react';

// mui
import { CircularProgress, Fab, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';

// firebase
import { getAnnouncements, db } from 'utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

// utils
import { AdminContext, UserContext } from 'contexts/UserContext';
import { v4 } from 'uuid';
import { utils, classes } from 'utils/style-utils';

// types
import type { AnnouncementType } from 'src/types/announcement';

// components
import NewAnnouncement from './NewAnnouncement';
import Announcement from './Announcement';
import PageTitle from 'components/page-title';
import FullCenter from 'components/full-center';
import ExpandDown from 'keyframes/expand-down';
import FadeIn from 'keyframes/fade-in';
import FadeOut from 'keyframes/fade-out';
import ExpandUp from 'keyframes/expand-up';

const AnnouncementsWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflowY: 'scroll',
  ...utils.removeScrollbars
} as any);

const AnnouncementList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '50px',
  width: '100%'
});

const Announcements = () => {
  const user: any = useContext(UserContext);
  const isAdmin: boolean | null = useContext(AdminContext);

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [announcementResponse, setAnnouncementResponse] = useState<boolean>(false);
  const [addingAnnouncement, setAddingAnnouncement] = useState<boolean>(false);
  const [contractNewAnnouncement, setContractNewAnnouncement] = useState<boolean>(false);

  const fabStyles = {
    position: 'absolute',
    bottom: 30,
    right: 30
  };

  const paddingSx = {
    padding: utils.contentPadding
  };

  const fullWidthSx = {
    width: '100%'
  };

  const handleAddingAnnouncement = (): void => {
    setAddingAnnouncement(true);
  };

  const handleCancelAddingAnnouncement = (): void => {
    setContractNewAnnouncement(true);
  };

  useEffect(() => {
    (async (): Promise<void> => {
      const tempAnnouncements = await getAnnouncements();
      setAnnouncements(tempAnnouncements);
      setAnnouncementResponse(true);
    })();
    onSnapshot(collection(db, 'announcements'), (snapshot: any) => {
      const docs = snapshot.docs.map((doc: any) => doc.data());
      setAnnouncements(docs);
    });
  }, []);

  const handleNewAnnouncementCallback = (): void => {
    setAddingAnnouncement(false);
    setContractNewAnnouncement(false);
  };

  const NewAnnoucementEl = (): React.ReactElement => {
    return (
      <Box
        sx={{
          ...paddingSx,
          width: '100%',
          overflow: 'hidden',
          ...classes.center
        }}
      >
        <NewAnnouncement
          user={user}
          onSubmit={handleCancelAddingAnnouncement}
          onCancel={handleCancelAddingAnnouncement}
        />
      </Box>
    );
  };

  return (
    <AnnouncementsWrapper>
      {addingAnnouncement &&
        (contractNewAnnouncement ? (
          <FadeOut
            sx={fullWidthSx}
            length={0.4}
          >
            <ExpandUp callback={handleNewAnnouncementCallback}>
              <NewAnnoucementEl />
            </ExpandUp>
          </FadeOut>
        ) : (
          <FadeIn sx={fullWidthSx}>
            <ExpandDown>
              <NewAnnoucementEl />
            </ExpandDown>
          </FadeIn>
        ))}
      {announcementResponse ? (
        announcements.length > 0 ? (
          <>
            <PageTitle
              length={0}
              sx={{ ...paddingSx, paddingBottom: 0 }}
            >
              Announcements
            </PageTitle>
            <ExpandDown
              wrapperSx={fullWidthSx}
              sx={{ ...paddingSx, ...fullWidthSx }}
              length={0.75}
            >
              <FadeIn sx={fullWidthSx}>
                <AnnouncementList>
                  {announcements
                    .sort((a: AnnouncementType, b: AnnouncementType) => b.timestamp - a.timestamp)
                    .map(
                      (announcement: AnnouncementType): React.ReactNode => (
                        <Announcement
                          key={v4()}
                          announcement={announcement}
                        />
                      )
                    )}
                </AnnouncementList>
              </FadeIn>
            </ExpandDown>
          </>
        ) : (
          <PageTitle sx={paddingSx}>No announcements yet</PageTitle>
        )
      ) : (
        <>
          <PageTitle sx={paddingSx}>Loading announcements...</PageTitle>
          <FullCenter>
            <CircularProgress size={50} />
          </FullCenter>
        </>
      )}
      {isAdmin && (
        <Fab
          sx={fabStyles}
          color="primary"
          onClick={handleAddingAnnouncement}
        >
          <AddIcon />
        </Fab>
      )}
    </AnnouncementsWrapper>
  );
};

export default Announcements;
