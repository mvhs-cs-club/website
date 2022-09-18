// react
import { useState, useContext } from 'react';

// mui
import {
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Box,
  IconButton,
  useTheme,
  Grid,
  Chip
} from '@mui/material';
import {
  Add,
  Close,
  Edit
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// firebase
import { addChallenge, deleteChallenge, replaceChallenge } from 'utils/firebase';

// utils
import { utils, classes } from 'utils/style-utils';
import { AdminContext } from 'contexts/UserContext';
import { ChallengesContext } from 'contexts/ChallengesContext';

// components
import Link from 'components/link';
import PageTitle from 'components/page-title';
import FadeIn from 'keyframes/fade-in';
import FadeOut from 'keyframes/fade-out';
import ExpandDown from 'keyframes/expand-down';
import ExpandUp from 'keyframes/expand-up';
import NewChallenge from './NewChallenge';
import PageWrapper from 'components/page-wrapper';

// types
import type {
  ChallengeType,
} from 'src/types/challenge';

const ChallengesWrapper = styled('div')({
  // paddingTop: 0,
  display: 'flex',
  flexDirection: 'column'
});

const ChallengeTitle = styled('div')({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

const ContentWrapper = styled('div')({
  width: '100%',
  paddingTop: utils.itemGap
});

const ControlWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2)
}));

const Challenges = () => {
  const challenges: ChallengeType[] | null = useContext(ChallengesContext);
  const admin = useContext(AdminContext);
  const theme = useTheme();

  const [addingChallenge, setAddingChallenge] = useState<boolean>(false);
  const [contractNewChallenge, setContractNewChallenge] = useState<boolean>(true);
  const [challengeToEdit, setChallengeToEdit] = useState<ChallengeType | null>(null);
  const [editing, setEditing] = useState<boolean>(false);

  const fabSx = {
    position: 'absolute',
    bottom: 30,
    right: 30
  };

  const newChallengeSx = {
    width: '100%',
    ...classes.center,
    padding: utils.contentPadding
  };

  const fullWidthSx = {
    width: '100%'
  };

  const handleAddingChallenge = (): void => {
    setAddingChallenge(true);
    setContractNewChallenge(false);
  };

  const handleNewChallengeCallback = (): void => {
    setAddingChallenge(false);
    setEditing(false);
    setContractNewChallenge(true);
  };

  const handleCancelAddingChallenge = (): void => {
    if (editing) {
      setChallengeToEdit(null);
    }
    setContractNewChallenge(true);
  };

  const handleCreateChallenge = async (challenge: ChallengeType): Promise<void> => {
    if (editing && challengeToEdit !== null && challengeToEdit.name !== challenge.name) {
      replaceChallenge(challengeToEdit.name, challenge);
    } else {
      await addChallenge(challenge);
    }
    handleCancelAddingChallenge();
  };

  const handleDeleteChallenge = async (e: any, name: string): Promise<void> => {
    e.stopPropagation();
    await deleteChallenge(name);
  };

  const handleEdit = (e: any, challenge: ChallengeType): void => {
    e.stopPropagation();
    setChallengeToEdit(challenge);
    setEditing(true);
    setContractNewChallenge(false);
  };

  const NewChallengeEl = () => {
    const challengeDefaults: ChallengeType = {
      name: '',
      description: '',
      languages: [],
      boilerplate: {},
      testCases: {
        inputs: '',
        outputs: ''
      },
      id: '',
      amount: 150
    };

    return (
      <Box
        sx={newChallengeSx}
      >
        <NewChallenge
          onCancel={handleCancelAddingChallenge}
          onCreate={handleCreateChallenge}
          defaults={
            editing
              ? challengeToEdit !== null
                ? challengeToEdit
                : challengeDefaults
              : challengeDefaults
          }
        />
      </Box>
    );
  };

  return (
    <PageWrapper
      sx={{
        paddingTop: 0
      }}
    >
      <ChallengesWrapper>
        {(addingChallenge || editing) && (
          contractNewChallenge
            ? (
              <FadeOut sx={fullWidthSx} length={0.4}>
                <ExpandUp
                  callback={handleNewChallengeCallback}
                >
                  <NewChallengeEl />
                </ExpandUp>
              </FadeOut>
            )
            : (
              <FadeIn sx={fullWidthSx}>
                <ExpandDown>
                  <NewChallengeEl />
                </ExpandDown>
              </FadeIn>
            )
        )}
        <PageTitle sx={{ marginTop: contractNewChallenge ? 4 : 0 }}>
          {challenges === null
            ? "Loading..."
            : challenges.length > 0
              ? "Challenges"
              : "No challenges right now, sorry!"
          }
        </PageTitle>
        {(challenges && challenges.length > 0) && (
          <FadeIn length={0.4}>
            <ContentWrapper>
              {challenges.map(
                (item: ChallengeType, index: number): React.ReactNode => (
                  <Accordion
                    sx={{
                      background: theme.palette.background.default
                    }}
                    key={`${index}-challenge-list`}
                  >
                    <AccordionSummary>
                      <ChallengeTitle>
                        <Grid
                          container
                          spacing={2}
                          sx={{
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Grid item>
                            <span>{item.name}</span>
                          </Grid>
                          <Grid item>
                            <Chip size="small" variant="outlined" label={item.amount} />
                          </Grid>
                        </Grid>
                        <ControlWrapper>
                          <Link to={`/challenges/${item.id}`}>
                            <Button
                              color="info"
                              onClick={(e: any): void => e.stopPropagation()}
                            >
                              Try
                            </Button>
                          </Link>
                          <IconButton
                            color="default"
                            size="small"
                            onClick={(e: any): void => handleEdit(e, item)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={(e: any): Promise<void> => handleDeleteChallenge(e, item.name)}
                          >
                            <Close />
                          </IconButton>
                        </ControlWrapper>
                      </ChallengeTitle>
                    </AccordionSummary>
                    <AccordionDetails>{item.description}</AccordionDetails>
                  </Accordion>
                )
              )}
            </ContentWrapper>
          </FadeIn>
        )}
        {admin && (
          <Fab color="primary" sx={fabSx} onClick={handleAddingChallenge}>
            <Add />
          </Fab>
        )}
      </ChallengesWrapper>
    </PageWrapper>
  );
};

export default Challenges;
