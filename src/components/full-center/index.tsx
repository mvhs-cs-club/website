// mui
import { styled } from '@mui/material/styles';

// utils
import { classes } from 'utils/style-utils';

const Wrapper = styled('div')({
  ...classes.full,
  ...classes.center
});

interface Props {
  children: React.ReactNode;
  sx?: object;
}

const FullCenter = ({ children, sx }: Props) => {
  return <Wrapper style={sx}>{children}</Wrapper>;
};

export default FullCenter;
