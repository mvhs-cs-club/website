// mui
import { styled } from '@mui/material/styles';

// utils
import { utils } from 'utils/style-utils';

interface Props {
	children: React.ReactNode;
	sx?: object;
}

const defaultProps = {
	sx: {}
};

type PropsType = Props & typeof defaultProps;

const Wrapper = styled('div')({
	padding: utils.contentPadding
});

const PageWrapper = ({ children, sx }: PropsType) => {
	return <Wrapper sx={sx}>{children}</Wrapper>;
};

PageWrapper.defaultProps = defaultProps;

export default PageWrapper;
