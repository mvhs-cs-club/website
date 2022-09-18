// mui
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.background.default)
}));

interface Props {
  children?: React.ReactNode;
  size?: 'large' | 'small' | undefined;
  sx?: object;
}

const defaultProps = {
  size: 'small'
};

type PropsType = Props & typeof defaultProps;

const CardTitle = ({ children, size, sx = {} }: PropsType) => {
  return (
    (size === 'small' || !size)
      ? <Title variant="h4" style={sx}>{children}</Title>
      : <Title variant="h3" style={sx}>{children}</Title>
  );
};

CardTitle.defaultProps = defaultProps;

export default CardTitle;
