// mui
import {
	Grid,
	Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

// types
import type { TestRes } from 'types/challenge';

const TestWrapper = styled((props: any) => <div {...props} />, {
	shouldForwardProp: (prop: string): boolean => true
})(({ theme, success }: any) => {
	const mode = theme.palette.mode === 'light' ? 'main' : 'dark';
	return {
		padding: theme.spacing(1.5),
		background: success === 'true' ? theme.palette.success[mode] : theme.palette.error[mode],
		borderRadius: 4
	} as any;
});

interface TestProps {
	test: TestRes;
}

const Test = ({ test }: TestProps) => {
	const formatTestCase = (text: string): string => {
		return text.split(' ').join(', ');
	};

	return (
		<TestWrapper success={test.success.toString()}>
			<Grid container spacing={1}>
				<Grid item xs={12}>
					<Typography variant="h3">
						Test Case: {formatTestCase(test.test)}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="body1">
						Result:
						<br />
						{test.output !== '' ? test.output : 'No value'}
					</Typography>
				</Grid>
			</Grid>
		</TestWrapper>
	);
}

interface TestsProps {
	tests: TestRes[];
}

const Tests = ({ tests }: TestsProps) => {
	return (
		<Grid container spacing={1}>
			{tests.map((test: TestRes, index: number) => (
				<Grid item xs={12} key={`test-res-${index}`}>
					<Test test={test} />
				</Grid>
			))}
		</Grid>
	)
};

export default Tests;
