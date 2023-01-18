// mui
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.background.default)
}));

interface PageTitleProps {
  children: React.ReactNode;
  size: 'small' | 'large' | undefined;
  sx: object;
  length: number | string;
}

const defaultProps = {
  sx: {},
  size: 'large',
  length: '0.5s ease-in-out'
};

type PageTitlePropsType = PageTitleProps;

const PageTitle = ({ children, size, sx, length }: PageTitlePropsType) => {
  let newLength: string | undefined;
  if (typeof length === 'number') {
    newLength = `${length}s ease-in-out`;
  } else {
    newLength = length;
  }
  sx = {
    ...sx,
    transition: `${newLength}, 0.15s color`
  };
  return size === 'large' || !size ? (
    <Title
      variant="h1"
      sx={sx}
    >
      {children}
    </Title>
  ) : (
    <Title
      variant="h2"
      sx={sx}
    >
      {children}
    </Title>
  );
};

PageTitle.defaultProps = defaultProps;

export default PageTitle;
