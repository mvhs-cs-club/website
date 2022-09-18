// react
import { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// mui
import {
  Breadcrumbs,
  Link,
  Typography,
  Button,
  Menu,
  MenuItem,
  Grid,
  useTheme
} from '@mui/material';
import {
  LoadingButton
} from '@mui/lab';
import { styled } from '@mui/material/styles';

// codemirror
import CodeMirror from '@uiw/react-codemirror';
import extensions from 'utils/codeMirrorExtensions';

// firebase
import {
  addPoints,
  getChallengeData,
  updateChallengeStatus,
  updateChallengeCode
} from 'utils/firebase';

// utils
import { ChallengesContext } from 'contexts/ChallengesContext';
import axios from 'axios';
import { getDevMode } from 'utils/dev';

// components
import PageTitle from 'components/page-title';
import CardTitle from 'components/card-title';
import FadeIn from 'keyframes/fade-in';
import ExpandDown from 'keyframes/expand-down';
import PageWrapper from 'components/page-wrapper';
import FadeOut from 'keyframes/fade-out';
import ExpandUp from 'keyframes/expand-up';
import Tests from './Tests';

// types
import type { ChallengeStatus, ChallengeType, CodeType, TestRes } from 'types/challenge';
import { UserContext } from 'src/contexts/UserContext';

const ChallengeWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
});

const InfoWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5)
}));

const Challenge = () => {
  const location = useLocation();
  const challenges: ChallengeType[] | null = useContext(ChallengesContext);
  const devMode = getDevMode();
  const theme = useTheme();
  const user = useContext(UserContext);

  const challengeId: string | undefined = location.pathname.match(/challenges\/(\w+)/)?.[1];

  const findChallenge = (id: string): ChallengeType | null => {
    if (challenges) {
      for (let i = 0; i < challenges.length; i++) {
        if (challenges[i].id === id) return challenges[i];
      }
    }
    return null;
  };

  const [challenge, setChallenge] = useState<ChallengeType | null>(null);
  const [language, setLanguage] = useState<string>('');
  const [code, setCode] = useState<CodeType>({});
  const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [switching, setSwitching] = useState<boolean>(false);
  const [ranTests, setRanTests] = useState<TestRes[]>([]);
  const [awaiting, setAwaiting] = useState<boolean>(false);
  const [contractTests, setContractTests] = useState<boolean>(true);
  const [challengeCompleted, setChallengeCompleted] = useState<boolean>(false);
  const languageMenuOpen = Boolean(languageMenuAnchorEl);

  const editorSx = {
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflow: 'hidden'
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchorEl(null);
  };

  const handleSetLanguage = (lang: string): void => {
    if (lang !== language) {
      setSwitching(true);
      setLanguage(lang);
    }
    handleLanguageMenuClose();
  };

  const handleSetCode = (val: string, lang: string): void => {
    if (val === undefined) return;
    setCode((prev: CodeType): CodeType => {
      let copy = { ...prev };
      copy[lang as keyof CodeType] = val;
      return copy;
    });
  };

  useEffect(() => {
    if (challenges !== null && challengeId) {
      (async (): Promise<void> => {
        const tempChallenge: ChallengeType | null = findChallenge(challengeId);
        const challengeData: ChallengeStatus | null = await getChallengeData(challengeId);
        if (tempChallenge !== null && challengeData !== null) {
          const completed = challengeData.status === 'complete';
          setChallengeCompleted(completed);
          setChallenge(tempChallenge)
          const lang: string = tempChallenge.languages[0];
          if (challengeData.code[lang as keyof CodeType] === '') {
            handleSetCode(tempChallenge.boilerplate[lang], lang);
          } else {
            const code = challengeData.code[lang as keyof CodeType];
            if (code !== undefined) {
              handleSetCode(code, lang);
            }
          }
          handleSetLanguage(lang);
          setTimeout(() => {
            setSwitching(false);
          }, 10);
        }
      })();
    }
  }, [challenges, challengeId]);

  useEffect(() => {
    setSwitching(false);
  }, [language]);

  useEffect(() => {
    if (!switching) {
      if (!code[language as keyof CodeType] || code[language as keyof CodeType] === '') {
        handleSetCode(challenge?.boilerplate[language], language);
      }
    }
  }, [switching]);

  const handleLanguageMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchorEl(e.currentTarget);
  };

  const handleExpandTestsCallback = () => {
    setRanTests([]);
  };

  const checkCompletedChallenge = (tests: TestRes[]): boolean => {
    for (let i = 0; i < tests.length; i++) {
      if (!tests[i].success) return false;
    }
    return true;
  };

  const handleSaveCode = (): void => {
    if (challengeId) {
      updateChallengeCode(challengeId, code);
    }
  };

  const handleSubmitCode = async (): Promise<void> => {
    const devPort = 3000;

    setAwaiting(true);
    setContractTests(true);

    if (challenge !== null) {
      let url;
      if (devMode) {
        url = `http://localhost:${devPort}`
      } else {
        url = 'https://mvcs-club-api.onrender.com';
      }
      const res = await axios.post(`${url}/submit`, {
        code: code[language as keyof CodeType],
        language,
        input: challenge.testCases.inputs,
        output: challenge.testCases.outputs
      }).catch(() => {
        if (devMode) {
          console.warn(`Unable to reach server. Check that local server is running on http://localhost:${devMode}`)
        }
      });
      setAwaiting(false);
      setContractTests(false);
      if (res) {
        const data: { res: TestRes[] } = res.data;
        setRanTests(data.res);
        if (challengeId) {
          handleSaveCode();
          if (checkCompletedChallenge(data.res)) {
            updateChallengeStatus(challengeId, 'complete');
            addPoints(user, challenge.name, challenge.amount);
            setChallengeCompleted(true);
          }
        }
      }
    } else {
      console.warn("Challenge is null");
    }
  };

  return (
    <PageWrapper>
      <ChallengeWrapper>
        {challenges !== null
          ? (
            <FadeIn>
              <InfoWrapper>
                <Breadcrumbs>
                  <Link href="/challenges" underline="hover" color="inherit">
                    Challenges
                  </Link>
                  <Typography>{challenge?.name}</Typography>
                </Breadcrumbs>
                <PageTitle>{challenge?.name}</PageTitle>
                {language !== '' && (
                  <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    onClick={handleLanguageMenuOpen}
                  >
                    {language}
                  </Button>
                )}
                {challenge?.languages && (
                  <Menu
                    anchorEl={languageMenuAnchorEl}
                    open={languageMenuOpen}
                    onClose={handleLanguageMenuClose}
                  >
                    {challenge.languages.map(
                      (language: string, index: number): React.ReactNode => (
                        <MenuItem
                          key={`${index}-language-menu-item`}
                          onClick={() => handleSetLanguage(language)}
                        >
                          {language}
                        </MenuItem>
                      )
                    )}
                  </Menu>
                )}
                <CardTitle>{challenge?.description}</CardTitle>
              </InfoWrapper>
              <Grid container spacing={1.5}>
                <Grid item xs={12}>
                  {(!switching && language !== '') && (
                    <ExpandDown>
                      <CodeMirror
                        height="300px"
                        width="100%"
                        theme={theme.palette.mode}
                        style={editorSx}
                        value={code[language as keyof CodeType]}
                        extensions={extensions[language]}
                        onChange={!challengeCompleted ? (value: string): void => handleSetCode(value, language) : () => { }}
                      />
                      <Typography
                        variant="caption"
                        color="GrayText"
                      >
                        Saved After Submit
                      </Typography>
                    </ExpandDown>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item>
                      <LoadingButton
                        color="primary"
                        onClick={handleSubmitCode}
                        variant="contained"
                        loading={awaiting}
                        disabled={challengeCompleted}
                      >
                        {challengeCompleted ? 'Completed' : 'Submit'}
                      </LoadingButton>
                    </Grid>
                    <Grid item>
                      <Button
                        color="primary"
                        variant="outlined"
                        onClick={handleSaveCode}
                      >Save</Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  {ranTests.length > 0 && (
                    contractTests
                      ? (
                        <FadeOut>
                          <ExpandUp
                            callback={handleExpandTestsCallback}
                          >
                            <Tests tests={ranTests} />
                          </ExpandUp>
                        </FadeOut>
                      )
                      : (
                        <FadeIn>
                          <ExpandDown>
                            <Tests tests={ranTests} />
                          </ExpandDown>
                        </FadeIn>
                      )
                  )}
                </Grid>
              </Grid>
            </FadeIn>
          ) : <PageTitle size="large">Loading...</PageTitle>
        }
      </ChallengeWrapper >
    </PageWrapper>
  );
};

export default Challenge;
