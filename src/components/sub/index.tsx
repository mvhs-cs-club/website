// mui
import { styled } from '@mui/material/styles';

const SubWrapper = styled('div')({
  color: '#868e96',
  fontSize: 'smaller'
});

interface SubProps {
  children: React.ReactNode;
  sx: object;
}

const defaultProps = {
  sx: {}
};

type SubPropsType = SubProps & typeof defaultProps;

const Sub = ({ children, sx }: SubPropsType) => {
  return <SubWrapper sx={sx}>{children}</SubWrapper>;
};

Sub.defaultProps = defaultProps;

export default Sub;
