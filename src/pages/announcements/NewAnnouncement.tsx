// react
import { useState, useContext } from 'react';

// mui
import { Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

// firebase
import { addAnnouncement } from 'utils/firebase';

// utils
import { UserContext } from 'contexts/UserContext';

// types
import type { AnnouncementType } from 'src/types/announcement';
import type { ErrorRuleType } from 'types/utils';

// components
import Card from 'components/card';
import PageTitle from 'components/page-title';
import Alert from 'components/alert';

const NewAnnouncementWrapper = styled('div')({
  minWidth: '250px',
  width: '100%',
  maxWidth: '750px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
});

const InputWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px',
  width: '100%'
});

const Controls = styled('div')({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '6px'
});

const AbsoluteAlerts = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  padding: theme.spacing(1.5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  zIndex: 1000
}));

interface Props {
  user: any;
  onSubmit: Function;
  onCancel: Function;
}

const NewAnnouncement = ({ onSubmit, onCancel }: Props) => {
  const user: any = useContext(UserContext);
  const [content, setContent] = useState<string>('');
  const [showingAlerts, setShowingAlerts] = useState<boolean>(false);

  const btnStyles = {
    width: 125
  };

  const validRules: ErrorRuleType[] = [
    {
      rule: content !== '',
      error: 'Announcement must have content.'
    }
  ];

  const formatTime = (time: Date): string => {
    let minutes = time.getMinutes() + '';
    if (minutes.length < 2) {
      minutes = `0${minutes}`;
    }
    let timeString = `${time.getHours()}:${minutes} AM`;
    if (time.getHours() > 12) {
      timeString = `${time.getHours() - 12}:${minutes} PM`;
    }
    return `${timeString} ${new Date().toLocaleDateString()}`;
  };

  const validAnnouncement = (): boolean => {
    return !validRules.map((rule: ErrorRuleType): boolean => rule.rule).includes(false);
  };

  const getCurrentErrors = (): string[] => {
    return validRules
      .map((rule: ErrorRuleType): string => {
        if (!rule.rule) return rule.error;
        return '';
      })
      .filter((err: string): boolean => err !== '');
  };

  const createAnnouncement = async (): Promise<void> => {
    if (validAnnouncement()) {
      let date = new Date();
      const newAnnouncement: AnnouncementType = {
        from: user.displayName,
        fromPhotoUrl: user.photoURL,
        content: content,
        date: formatTime(date),
        timestamp: date.getTime()
      };
      addAnnouncement(newAnnouncement);
      onSubmit();
    } else {
      setShowingAlerts(true);
    }
  };

  const Alerts = () => {
    const errors: string[] = getCurrentErrors();
    return showingAlerts ? (
      <AbsoluteAlerts>
        {errors.map((error: string, index: number) => (
          <Alert
            key={`error-alert-${index}`}
            onClose={() => {}}
            color="error"
            absolute={false}
          >
            {error}
          </Alert>
        ))}
      </AbsoluteAlerts>
    ) : (
      <></>
    );
  };

  return (
    <NewAnnouncementWrapper>
      <Card stretch>
        <Alerts />
        <PageTitle
          sx={{
            marginBottom: 2
          }}
          size="small"
        >
          Create a New Annoucement
        </PageTitle>
        <InputWrapper>
          <TextField
            label="Content"
            variant="filled"
            fullWidth
            multiline
            rows={3}
            onChange={(e: any): void => setContent(e.target.value)}
            value={content}
          />
          <Controls>
            <Button
              sx={btnStyles}
              onClick={() => onCancel()}
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              sx={btnStyles}
              onClick={createAnnouncement}
              variant="outlined"
              color="primary"
            >
              Post
            </Button>
          </Controls>
        </InputWrapper>
      </Card>
    </NewAnnouncementWrapper>
  );
};

export default NewAnnouncement;
