// react
import { useState, useContext } from 'react';

// mui
import { styled } from '@mui/material/styles';
import {
  Accordion,
  AccordionSummary,
  IconButton,
  AccordionDetails,
  Grid,
  useTheme
} from '@mui/material';
import {
  Close,
  Check
} from '@mui/icons-material';

// firebase
import { deleteProblem } from 'utils/firebase';

// utils
import { AdminContext } from 'contexts/UserContext';
import { ProblemsContext } from 'contexts/ProblemsContext';

// components
import PageTitle from 'components/page-title';
import FadeIn from 'keyframes/fade-in';
import CardTitle from 'components/card-title';
import PageWrapper from 'components/page-wrapper';
import AuthGuard from 'components/auth-guard';

// types 
import type { ProblemType } from 'src/types/problem';

const ProblemWrapper = styled('div')({
  paddingTop: 0,
  display: 'flex',
  flexDirection: 'column'
});

const ContentWrapper = styled('div')({
  width: '100%',
});

const ProblemTitle = styled('div')({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

const ControlWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2)
}));

const Problems = () => {
  const admin = useContext(AdminContext);
  const problems = useContext(ProblemsContext);
  const theme = useTheme();

  const handleDeleteProblem = (e: any, title: string): void => {
    e.stopPropagation();
    deleteProblem(title);
  };

  return (
    <AuthGuard>
      <PageWrapper>
        <ProblemWrapper>
          <Grid container spacing={2}>
            <Grid item>
              <PageTitle>
                Problems
              </PageTitle>
            </Grid>
            {problems !== null && (
              <Grid item xs={12}>
                {problems.length === 0
                  ? (
                    <CardTitle size="large">
                      Woohoo! No problems at the moment.
                    </CardTitle>
                  )
                  : (
                    <FadeIn length={0.4}>
                      <ContentWrapper>
                        {problems.map(
                          (item: ProblemType, index: number): React.ReactNode => (
                            <Accordion
                              sx={{
                                background: theme.palette.background.default
                              }}
                              key={`${index}-challenge-list`}
                            >
                              <AccordionSummary>
                                <ProblemTitle>
                                  <span>{item.title}</span>
                                  {admin && (
                                    <ControlWrapper>
                                      <IconButton
                                        color="error"
                                        size="small"
                                        onClick={(e: any) => handleDeleteProblem(e, item.title)}
                                      >
                                        <Close />
                                      </IconButton>
                                      <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={(e: any) => handleDeleteProblem(e, item.title)}
                                      >
                                        <Check />
                                      </IconButton>
                                    </ControlWrapper>
                                  )}
                                </ProblemTitle>
                              </AccordionSummary>
                              <AccordionDetails>{item.description}</AccordionDetails>
                            </Accordion>
                          )
                        )}
                      </ContentWrapper>
                    </FadeIn>
                  )}
              </Grid>
            )}
          </Grid>
        </ProblemWrapper>
      </PageWrapper>
    </AuthGuard>
  );
};

export default Problems;
