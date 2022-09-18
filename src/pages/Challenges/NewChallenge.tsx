// react
import { useState, useEffect } from 'react';

// mui
import {
  TextField,
  Button,
  Menu,
  MenuItem,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Typography,
  Grid,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';

// codebox
import CodeMirror from '@uiw/react-codemirror';

// components
import Card from 'components/card';
import PageTitle from 'components/page-title';
import Alert from 'components/alert';
import ExpandDown from 'keyframes/expand-down';

// utils
import { languages, boilerplates } from 'utils/languages';
import { v4 } from 'uuid';
import { utils } from 'utils/style-utils';
import extensions from 'utils/codeMirrorExtensions';

// types
import type {
  ChallengeType,
  BoilerplateType,
} from 'types/challenge';
import type { ErrorRuleType } from 'types/utils'

const InputWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '12px'
});

const NewChallengeWrapper = styled('div')({
  minWidth: '250px',
  width: '100%',
  maxWidth: '725px',
  display: 'flex',
  flexDirection: 'column'
});

const Controls = styled('div')({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '6px'
});

const JustifyLeft = styled('div')({
  display: 'flex',
  justifyContent: 'flex-start'
});

const AbsoluteAlerts = styled('div')({
  position: 'absolute',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  padding: utils.contentPadding,
  display: 'flex',
  flexDirection: 'column',
  gap: utils.itemGap,
  zIndex: 1000
});

interface Props {
  onCancel: () => void;
  onCreate: (challenge: ChallengeType) => void;
  defaults: ChallengeType;
}

const NewChallenge = ({ onCancel, onCreate, defaults }: Props) => {

  const [name, setName] = useState<string>(defaults.name);
  const [desc, setDesc] = useState<string>(defaults.description);
  const [language, setLanguage] = useState<string>('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(defaults.languages);
  const [boilerplate, setBoilerplate] = useState<BoilerplateType>(defaults.boilerplate);
  const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [showingAlerts, setShowingAlerts] = useState<boolean>(false);
  const [inputs, setInputs] = useState<string>(defaults.testCases.inputs);
  const [outputs, setOutputs] = useState<string>(defaults.testCases.outputs);
  const [amount, setAmount] = useState<number>(150);
  const languageMenuOpen = Boolean(languageMenuAnchorEl);
  const [switching, setSwitching] = useState<boolean>(false);
  const theme = useTheme();

  const validBoilerplate = (): boolean => {
    return !Object.values(boilerplate)
      .map((item: any): any => item !== '')
      .includes(false);
  };

  const validTestCases = (): boolean => {
    return (
      inputs !== '' &&
      outputs !== ''
    );
  };

  const validRules: ErrorRuleType[] = [
    {
      rule: name !== '',
      error: 'Name field must have a value.'
    },
    {
      rule: desc !== '',
      error: 'Description field must have a value.'
    },
    {
      rule: validBoilerplate(),
      error: 'All languages must have a boilerplate.'
    },
    {
      rule: validTestCases(),
      error: 'Test cases must have values'
    },
    {
      rule: selectedLanguages.length !== 0,
      error: 'You must select at least one language.'
    }
  ];

  const btnStyles = {
    width: 125
  };

  const editorSx = {
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflow: 'hidden'
  };

  const getCodeMirrorExtension = (): any[] => {
    if (extensions[language]) return extensions[language];
    return [];
  };

  const validChallenge = (): boolean => {
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

  const handleCreate = (): void => {
    if (validChallenge()) {
      const challenge: ChallengeType = {
        name,
        description: desc,
        languages: selectedLanguages,
        boilerplate,
        id: v4().replace(/-/g, ''),
        testCases: {
          inputs,
          outputs
        },
        amount
      };
      onCreate(challenge);
    } else {
      setShowingAlerts(true);
    }
  };

  const handleLanguageMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchorEl(e.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchorEl(null);
  };

  useEffect(() => {
    if (selectedLanguages.length === 0) {
      setLanguage('');
    } else if (!selectedLanguages.includes(language)) {
      setSwitching(true);
      setLanguage(selectedLanguages[0]);
    } else {
      if (language.length === 0) {
        setLanguage(selectedLanguages[0]);
      }
    }
  }, [selectedLanguages, language]);

  const toggleLanguage = (lang: string): void => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages((prev: string[]): string[] => {
        let copy = [...prev];
        return copy.filter((l: string): boolean => l !== lang);
      });
      if (language === lang) {
        let newLang = selectedLanguages[0];
        newLang = newLang ? newLang : '';
        setLanguage(newLang);
      }
      setBoilerplate((prev: any): any => {
        let obj: any = {};
        Object.keys(prev).forEach((key: string): void => {
          if (key === lang) return;
          obj[key] = prev[key];
        });
        return obj;
      });
    } else {
      setSelectedLanguages((prev: string[]): string[] => {
        return [...prev, lang];
      });
    }
  };

  const updateBoilerplate = (value: string, lang?: string): void => {
    const l = lang ? lang : language;
    if (l === '') return;
    setBoilerplate((prev: any) => {
      let copy = { ...prev };
      copy[l] = value;
      return copy;
    });
  };

  useEffect(() => {
    setSwitching(false);
  }, [language]);

  useEffect(() => {
    if (!switching) {
      if (!boilerplate[language as keyof BoilerplateType] || boilerplate[language as keyof BoilerplateType] === '') {
        updateBoilerplate(boilerplates[language]);
      }
    }
  }, [switching]);

  const handleSetLanguage = (lang: string): void => {
    if (lang !== language) {
      setSwitching(true);
      setLanguage(lang);
    }
    handleLanguageMenuClose();
  };

  const Alerts = () => {
    const errors: string[] = getCurrentErrors();
    return showingAlerts ? (
      <AbsoluteAlerts>
        {errors.map((error: string, index: number) => (
          <Alert key={`error-alert-${index}`} onClose={() => { }} color="error" absolute={false}>
            {error}
          </Alert>
        ))}
      </AbsoluteAlerts>
    ) : (
      <></>
    );
  };

  return (
    <NewChallengeWrapper>
      <Alerts />
      <Card stretch>
        <PageTitle
          sx={{
            marginBottom: 2
          }}
          size="small"
        >Create New Challenge</PageTitle>
        <InputWrapper>
          <TextField
            label="Name"
            variant="outlined"
            onChange={(e: any): void => setName(e.target.value)}
            value={name}
            size="small"
          />
          <TextField
            label="Description"
            variant="filled"
            fullWidth
            multiline
            rows={2}
            onChange={(e: any): void => setDesc(e.target.value)}
            value={desc}
          />
          <TextField
            type="number"
            size="small"
            value={amount}
            onChange={(e: any): void => setAmount(+e.target.value)}
            sx={{
              width: 'fit-content'
            }}
          />
          <FormGroup>
            <FormLabel component="legend">Languages</FormLabel>
            {languages.map((language: string, index: number) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedLanguages.includes(language)}
                    name={language}
                    color="primary"
                    onChange={() => toggleLanguage(language)}
                  />
                }
                label={language}
                key={`form-item-${index}`}
              />
            ))}
          </FormGroup>
          <JustifyLeft>
            <Button
              size="small"
              color="primary"
              variant="outlined"
              onClick={handleLanguageMenuOpen}
            >
              {selectedLanguages.length === 0 || language.length === 0
                ? 'No Language Selected'
                : language
              }
            </Button>
          </JustifyLeft>
          <Menu
            anchorEl={languageMenuAnchorEl}
            open={languageMenuOpen}
            onClose={handleLanguageMenuClose}
          >
            {selectedLanguages.map((language: string, index: number): React.ReactNode => (
              <MenuItem
                key={`${index}-language-menu-item`}
                onClick={() => handleSetLanguage(language)}
              >
                {`${language.substring(0, 1).toUpperCase()}${language.substring(1)}`}
              </MenuItem>
            ))}
            {(selectedLanguages.length === 0) && (
              <Typography
                sx={{
                  marginRight: 1,
                  marginLeft: 1
                }}
              >
                No Lanugages Selected
              </Typography>
            )}
          </Menu>
          {(!switching && language !== '') && (
            <ExpandDown>
              <CodeMirror
                height="325px"
                placeholder="Enter boilerplate code"
                width="100%"
                theme={theme.palette.mode}
                style={editorSx}
                extensions={getCodeMirrorExtension()}
                value={boilerplate[language as keyof BoilerplateType]}
                onChange={(value: string): void => updateBoilerplate(value, language)}
              />
            </ExpandDown>
          )}
          {(!switching && language !== '') && (
            <ExpandDown>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Inputs"
                    placeholder="Seperated by space or surrounded by double quotes. Each input on a seperate line."
                    variant="filled"
                    fullWidth
                    multiline
                    rows={3}
                    value={inputs}
                    onChange={(e: any): void => setInputs(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Expected Outputs"
                    placeholder="Stand alone or surrounded by double quotes"
                    variant="filled"
                    fullWidth
                    multiline
                    rows={3}
                    value={outputs}
                    onChange={(e: any): void => setOutputs(e.target.value)}
                  />
                </Grid>
              </Grid>
            </ExpandDown>
          )}
          <Controls>
            <Button
              sx={btnStyles}
              color="inherit"
              onClick={() => onCancel()}
            >
              Cancel
            </Button>
            <Button
              sx={btnStyles}
              variant="outlined"
              onClick={handleCreate}
              color="primary"
            >
              Create
            </Button>
          </Controls>
        </InputWrapper>
      </Card>
    </NewChallengeWrapper>
  );
};

export default NewChallenge;
