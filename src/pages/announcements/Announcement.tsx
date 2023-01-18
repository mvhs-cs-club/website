// react
import { useContext, useState } from 'react';

// mui
import { IconButton, TextField, Typography, Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DeleteOutlineRounded, EditRounded, DoneRounded } from '@mui/icons-material';

// utils
import { AdminContext } from 'contexts/UserContext';
import { utils } from 'utils/style-utils';

// firebase
import { updateAnnouncement, deleteAnnouncement } from 'src/utils/firebase';

// types
import type { AnnouncementType } from 'src/types/announcement';

// components
import Card from 'components/card';

const AnnouncementWrapper = styled('div')({
  width: '100%',
  maxWidth: '750px',
  minWidth: '250px',
  display: 'flex',
  flexDirection: 'column',
  p: {
    margin: 0
  }
});

const Info = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
});

const Controls = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  gap: '4px'
});

const From = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  alignItems: 'center'
});

const FromInfo = styled('div')({
  display: 'flex',
  flexDirection: 'column'
});

const FromName = styled((props: any) => (
  <Typography
    variant="span"
    {...props}
  />
))(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 500,
  color: theme.palette.text.primary
}));

const Timestamp = styled('span')({
  fontSize: '12px',
  fontWeight: 400,
  color: '#8f8f8f'
});

const EditContainer = styled('div')({
  padding: '0 34px',
  wordBreak: 'break-word'
});

interface Props {
  announcement: AnnouncementType;
}

const Announcement = ({ announcement }: Props) => {
  const isAdmin: boolean | null = useContext(AdminContext);
  const [editing, setEditing] = useState<boolean>(false);
  const [newValue, setNewValue] = useState<string>(announcement.content);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleButtonStyle = {
    minWidth: '0',
    padding: '3.25px'
  };

  const handleStartEdit = (): void => {
    setEditing(true);
  };

  const handleSubmitEdit = (): void => {
    setEditing(false);
    updateAnnouncement(announcement.id, newValue);
  };

  const handleStartDelete = (): void => {
    setDialogOpen(true);
  };

  const handleDelete = (): void => {
    setDialogOpen(false);
    setTimeout(() => {
      deleteAnnouncement(announcement.id);
    }, 250);
  };

  const imgSx = {
    width: 26,
    height: 26,
    borderRadius: 100
  };

  const cardSx = {
    display: 'flex',
    flexDirection: 'column',
    gap: utils.itemGap
  };

  const handleDialogClose = (): void => {
    setDialogOpen(false);
  };

  return (
    <AnnouncementWrapper>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle>{'Are you sure you want to delete this announcement?'}</DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleDelete}
            autoFocus
            variant="contained"
            color="error"
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
      <Card
        sx={cardSx}
        stretch
      >
        <Info>
          <From>
            <img
              src={announcement.fromPhotoUrl}
              alt=""
              style={imgSx}
              referrerPolicy="no-referrer"
            />
            <FromInfo>
              <FromName>{announcement.from}</FromName>
              <Timestamp>{announcement.date}</Timestamp>
            </FromInfo>
          </From>
          {isAdmin && (
            <Controls>
              {editing ? (
                <IconButton
                  color="primary"
                  onClick={handleSubmitEdit}
                  sx={handleButtonStyle}
                >
                  <DoneRounded />
                </IconButton>
              ) : (
                <IconButton
                  color="default"
                  sx={handleButtonStyle}
                  onClick={handleStartEdit}
                >
                  <EditRounded />
                </IconButton>
              )}
              {!editing && (
                <IconButton
                  color="error"
                  sx={handleButtonStyle}
                  onClick={handleStartDelete}
                >
                  <DeleteOutlineRounded />
                </IconButton>
              )}
            </Controls>
          )}
        </Info>
        <EditContainer>
          {editing ? (
            <TextField
              label="Content"
              variant="filled"
              fullWidth
              multiline
              rows={3}
              onChange={(e: any): void => setNewValue(e.target.value)}
              value={newValue}
            />
          ) : (
            announcement.content.split('\n').map((line: string, index: number, array: string[]) => (
              <span key={`announcement-content-${index}`}>
                {line}
                {index < array.length - 1 && <br />}
              </span>
            ))
          )}
        </EditContainer>
      </Card>
    </AnnouncementWrapper>
  );
};

export default Announcement;
