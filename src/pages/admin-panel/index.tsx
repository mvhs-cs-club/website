// react
import { useState, useEffect, useContext } from 'react';

// mui
import { styled } from '@mui/material/styles';
import {
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Grid
} from '@mui/material';
import { ClearRounded } from '@mui/icons-material';

// firebase
import {
  approveAdminRequest,
  rejectAdminRequest,
  removeAdmin,
  processAdminCol,
  db,
  processRequestCol,
  addPoints
} from 'utils/firebase';
import {
  collection,
  DocumentData,
  onSnapshot,
  QuerySnapshot
} from 'firebase/firestore';

// types
import type { AdminType } from 'types/admin';
import type { UserType } from 'types/user';

// components
import ProfileBox from 'components/profile-box';
import Card from 'components/card';
import CardTitle from 'components/card-title';
import PageTitle from 'components/page-title';
import ProfileBoxWrapper from 'components/profile-box-wrapper';
import FadeIn from 'keyframes/fade-in';
import ExpandDown from 'keyframes/expand-down';
import PageWrapper from 'components/page-wrapper';
import AuthGuard from 'components/auth-guard';

// utils
import { UsersContext } from 'src/contexts/UserContext';

const AdminContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5)
}));

const AdminCards = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: theme.spacing(2.25)
}));

const AdminProfileBoxWrapper = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

interface CurrentRequest {
  request: AdminType;
  index: number;
}

const AdminPanel = () => {
  const theme = useTheme();
  const users = useContext(UsersContext);
  const [requests, setRequests] = useState<AdminType[]>([]);
  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [rejectDialogOpen, setRejectDialogOpen] = useState<boolean>(false);
  const [currentRequest, setCurrentRequest] = useState<CurrentRequest | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<AdminType | null>(null);
  const [removeAdminOpen, setRemoveAdminOpen] = useState<boolean>(false);
  const [managePointsOpen, setManagePointsOpen] = useState<boolean>(false);
  const [managePointsUser, setManagePointsUser] = useState<any>(null);
  const [pointsAmount, setPointsAmount] = useState<string>('');

  const adminCardStyle = {
    minWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.25)
  };

  const removeAdminSx = {
    padding: '5px',
    minWidth: 0
  };

  const removeRequestIndex = (index: number): void => {
    setRequests((prev) => prev.filter((_: any, i: number): boolean => i !== index));
  };

  const handleApproveRequest = (request: AdminType, index: number): void => {
    const requestUser: AdminType = { ...request };
    approveAdminRequest(requestUser);
    removeRequestIndex(index);
  };

  const handleRejectRequest = (): void => {
    if (currentRequest !== null) {
      rejectAdminRequest(currentRequest.request.uid);
      removeRequestIndex(currentRequest.index);
    }
    setRejectDialogOpen(false);
  };

  const handleStartRejectRequest = (request: AdminType, index: number): void => {
    setCurrentRequest({
      request,
      index
    });
    setRejectDialogOpen(true);
  };

  const handleCancelRejectRequest = (): void => {
    setCurrentRequest(null);
    setRejectDialogOpen(false);
  };

  const handleSetCurrentAdmin = (admin: AdminType): void => {
    setCurrentAdmin(admin);
    setRemoveAdminOpen(true);
  };

  const handleCloseRemoveAdmin = (): void => {
    setCurrentAdmin(null);
    setRemoveAdminOpen(false);
  };

  const handleRemoveAdmin = (): void => {
    if (currentAdmin) {
      const adminUid = currentAdmin?.uid;
      removeAdmin(adminUid);
    }
    handleCloseRemoveAdmin();
  };

  const startManagePoints = (user: any): void => {
    setManagePointsUser(user);
    setManagePointsOpen(true);
  };

  const closeManagePoints = (): void => {
    setPointsAmount('');
    setManagePointsUser(null);
    setManagePointsOpen(false);
  };

  const handleAddPoints = async (): Promise<void> => {
    const amount = parseInt(pointsAmount);
    await addPoints(managePointsUser, 'From admin', amount)
    closeManagePoints();
  };

  useEffect(() => {
    (async () => {
      onSnapshot(collection(db, 'admins', 'requests', 'requests'), (doc: QuerySnapshot<DocumentData>) => {
        const processedRequests: AdminType[] = processRequestCol(doc);
        setRequests(processedRequests);
      });

      onSnapshot(collection(db, 'admins', 'admins', 'admins'), (doc: QuerySnapshot<DocumentData>) => {
        const processedAdmins: AdminType[] = processAdminCol(doc);
        setAdmins(processedAdmins);
      });
    })();
  }, []);

  return (
    <AuthGuard>
      <PageWrapper>
        <AdminContent>
          <PageTitle>Admin Panel</PageTitle>
          <FadeIn>
            <AdminCards>
              <Card sx={adminCardStyle}>
                <CardTitle size="large">Give Points</CardTitle>
                {(users !== null && users.length > 0)
                  ? (
                    <ExpandDown>
                      <ProfileBoxWrapper>
                        {users.map((user: UserType, index: number) => (
                          <ProfileBox user={user} key={`user-${index}`}>
                            <Button
                              color="primary"
                              variant="outlined"
                              size="small"
                              onClick={() => startManagePoints(user)}
                            >
                              Manage
                            </Button>
                          </ProfileBox>
                        ))}
                      </ProfileBoxWrapper>
                    </ExpandDown>
                  )
                  : (
                    <CardTitle size="small">No admin requests</CardTitle>
                  )
                }
              </Card>
              <Dialog
                open={managePointsOpen}
                onClose={closeManagePoints}
              >
                <DialogTitle>
                  {"How many points do you want to add or remove"}
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={1.5}>
                    <Grid item>
                      <DialogContentText>
                        Positive points for adding, negative points for removeing
                      </DialogContentText>
                    </Grid>
                    <Grid item>
                      <TextField
                        size="small"
                        label="Amount"
                        onChange={e => setPointsAmount(e.currentTarget.value)}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeManagePoints}>Cancel</Button>
                  <Button
                    onClick={handleAddPoints}
                    autoFocus
                    color="primary"
                    variant="contained"
                  >
                    Give
                  </Button>
                </DialogActions>
              </Dialog>
              <Card sx={adminCardStyle}>
                <CardTitle size="large">Current Admins</CardTitle>
                <Dialog
                  open={removeAdminOpen}
                  onClose={handleCloseRemoveAdmin}
                >
                  <DialogTitle>
                    {"Are you sure you want to remove this admin?"}
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={handleCloseRemoveAdmin}>Cancel</Button>
                    <Button
                      onClick={handleRemoveAdmin}
                      autoFocus
                      variant="contained"
                      color="error"
                    >
                      Remove
                    </Button>
                  </DialogActions>
                </Dialog>
                <ExpandDown>
                  {admins.length > 0 ? (
                    <ProfileBoxWrapper>
                      {admins.map((admin: AdminType, index: number) => (
                        <AdminProfileBoxWrapper key={`admin-${index}`}>
                          <ProfileBox user={admin} />
                          <Button color="error" sx={removeAdminSx} size="small" onClick={() => handleSetCurrentAdmin(admin)}>
                            <ClearRounded />
                          </Button>
                        </AdminProfileBoxWrapper>
                      ))}
                    </ProfileBoxWrapper>
                  ) : (
                    <CardTitle size="small">No admins</CardTitle>
                  )}
                </ExpandDown>
              </Card>
              <Card sx={adminCardStyle}>
                <CardTitle size="large">Admin requests</CardTitle>
                {requests.length > 0 ? (
                  <ExpandDown>
                    <ProfileBoxWrapper>
                      {requests.map((request: AdminType, index: number) => (
                        <ProfileBox user={request} key={`request-${index}`}>
                          <Button
                            color="primary"
                            variant="outlined"
                            size="small"
                            onClick={() => handleApproveRequest(request, index)}
                          >
                            Approve
                          </Button>
                          <Button color="error" onClick={() => handleStartRejectRequest(request, index)}>
                            Reject
                          </Button>
                        </ProfileBox>
                      ))}
                    </ProfileBoxWrapper>
                  </ExpandDown>
                ) : (
                  <CardTitle size="small">No admin requests</CardTitle>
                )}
                <Dialog
                  open={rejectDialogOpen}
                  onClose={handleCancelRejectRequest}
                >
                  <DialogTitle>
                    {"Are you sure you want to reject this request?"}
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={handleCancelRejectRequest}>Cancel</Button>
                    <Button
                      onClick={handleRejectRequest}
                      autoFocus
                      variant="contained"
                      color="error"
                    >
                      Reject
                    </Button>
                  </DialogActions>
                </Dialog>
              </Card>
            </AdminCards>
          </FadeIn>
        </AdminContent>
      </PageWrapper>
    </AuthGuard>
  );
};

export default AdminPanel;
