// mui
import { styled } from '@mui/material/styles';

// utils
import { utils } from 'utils/style-utils';

interface ProfileBoxWrapperProps {
  children: React.ReactNode;
}

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: utils.itemGap
});

const ProfileBoxWrapper = ({ children }: ProfileBoxWrapperProps) => {
  return <Wrapper>{children}</Wrapper>;
};

export default ProfileBoxWrapper;
