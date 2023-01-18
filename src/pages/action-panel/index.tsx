// react
import { useState, useContext } from 'react';

// mui
import { Button, Box, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { styled } from '@mui/material/styles';

// firebase
import {
  requestAdminPermissions,
  replaceProblem,
  addProblem,
  removeAdmin,
  deleteUserData
} from 'utils/firebase';

// utils
import { UserContext, AdminContext, UserLoadingContext } from 'contexts/UserContext';
import { classes, utils } from 'utils/style-utils';

// components
import PageWrapper from 'components/page-wrapper';
import Card from 'components/card';
import CardTitle from 'components/card-title';
import FadeIn from 'keyframes/fade-in';
import PageTitle from 'components/page-title';
import ExpandDown from 'keyframes/expand-down';
import FadeOut from 'keyframes/fade-out';
import ExpandUp from 'keyframes/expand-up';
import NewProblem from './NewProblem';

// types
import type { ProblemType } from 'src/types/problem';

const CardWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.spacing(4),
  width: '100%',
  marginTop: theme.spacing(1)
}));

const ActionCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  minWidth: 250
}));

const ActionPanelWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column'
});

const CustomFadeIn = (props: any) => (
  <FadeIn
    {...props}
    length={0.65}
  />
);

const ActionPanel = () => {
  const loading: boolean = useContext(UserLoadingContext);
  const user: any = useContext(UserContext);
  const isAdmin: boolean | null = useContext(AdminContext);
  const [addingProblem, setAddingProblem] = useState<boolean>(false);
  const [contractNewProblem, setContractNewProblem] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [problemToEdit, setProblemToEdit] = useState<ProblemType | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const fullWidthSx = {
    width: '100%'
  };

  const newProblemSx = {
    width: '100%',
    ...classes.center,
    padding: utils.contentPadding
  };

  const handleAddNewProblem = (): void => {
    setAddingProblem(true);
    setContractNewProblem(false);
  };

  const handleNewProblemCallback = (): void => {
    setAddingProblem(false);
    setEditing(false);
    setContractNewProblem(true);
  };

  const handleRequestPermissions = (): void => {
    requestAdminPermissions(user);
  };

  const handleCancelAddingProblem = (): void => {
    if (editing) {
      setProblemToEdit(null);
    }
    setContractNewProblem(true);
  };

  const handleCreateProblem = async (problem: ProblemType): Promise<void> => {
    if (editing && problemToEdit !== null && problemToEdit.title !== problem.title) {
      replaceProblem(problemToEdit.title, problem);
    } else {
      await addProblem(problem);
    }
    handleCancelAddingProblem();
  };

  const handleOpenDialog = (): void => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
  };

  const handleDeleteData = async (): Promise<void> => {
    if (isAdmin) {
      await removeAdmin(user.uid);
    }
    await deleteUserData(user.uid);
    handleCloseDialog();
    window.location.reload();
  };

  const NewProblemEl = () => {
    const problemDefaults: ProblemType = {
      title: '',
      description: '',
      severity: 'low'
    };

    return (
      <Box sx={newProblemSx}>
        <NewProblem
          onCancel={handleCancelAddingProblem}
          onCreate={handleCreateProblem}
          defaults={editing ? (problemToEdit !== null ? problemToEdit : problemDefaults) : problemDefaults}
        />
      </Box>
    );
  };

  return (
    <PageWrapper
      sx={{
        ...(user !== null ? { paddingTop: 0 } : {})
      }}
    >
      {loading ? (
        <PageTitle
          sx={{
            marginTop: 4.25
          }}
        >
          Loading...
        </PageTitle>
      ) : user !== null ? (
        <ActionPanelWrapper>
          {(addingProblem || editing) &&
            (contractNewProblem ? (
              <FadeOut
                sx={fullWidthSx}
                length={0.4}
              >
                <ExpandUp callback={handleNewProblemCallback}>
                  <NewProblemEl />
                </ExpandUp>
              </FadeOut>
            ) : (
              <FadeIn sx={fullWidthSx}>
                <ExpandDown>
                  <NewProblemEl />
                </ExpandDown>
              </FadeIn>
            ))}
          <PageTitle sx={{ marginTop: contractNewProblem ? 4 : 0 }}>Action Panel</PageTitle>
          <CardWrapper>
            {isAdmin === false && (
              <CustomFadeIn>
                <ActionCard>
                  <CardTitle>Request Admin Permissions</CardTitle>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleRequestPermissions}
                  >
                    Request Admin
                  </Button>
                </ActionCard>
              </CustomFadeIn>
            )}
            <CustomFadeIn>
              <ActionCard>
                <CardTitle>Something not working right?</CardTitle>
                <Button
                  color="error"
                  // variant="outlined"
                  onClick={handleAddNewProblem}
                >
                  Report a Problem
                </Button>
              </ActionCard>
            </CustomFadeIn>
            <CustomFadeIn>
              <ActionCard>
                <CardTitle>Delete all of my data</CardTitle>
                <Button
                  color="error"
                  // variant="outlined"
                  onClick={handleOpenDialog}
                >
                  Delete Data
                </Button>
              </ActionCard>
            </CustomFadeIn>
          </CardWrapper>
          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
          >
            <DialogTitle>{'Are you sure you want to delete your data? There is no going back'}</DialogTitle>
            <DialogActions>
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteData}
                variant="contained"
                color="error"
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </ActionPanelWrapper>
      ) : (
        <PageTitle>You must be signed in to view this page.</PageTitle>
      )}
    </PageWrapper>
  );
};

export default ActionPanel;
