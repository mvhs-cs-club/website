// react
import { useState } from 'react';

// mui
import { styled } from '@mui/material/styles';
import {
	TextField,
	Button,
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio
} from '@mui/material';

// components
import Card from 'components/card';
import PageTitle from 'components/page-title';
import Alert from 'components/alert';

// utils
import { utils } from 'utils/style-utils';

// types
import type { ProblemType, SeverityType } from 'types/problem';
import type { ErrorRuleType } from 'types/utils';

const NewProblemWrapper = styled('div')({
	minWidth: '250px',
	width: '100%',
	maxWidth: '725px',
	display: 'flex',
	flexDirection: 'column'
});

const InputWrapper = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	gap: theme.spacing(1.5)
}));

const Controls = styled('div')(({ theme }) => ({
	width: '100%',
	display: 'flex',
	justifyContent: 'flex-end',
	gap: theme.spacing(0.75)
}));

const AbsoluteAlerts = styled('div')({
	position: 'absolute',
	top: 0,
	left: '50%',
	transform: 'translateX(-50%)',
	padding: utils.contentPadding,
	display: 'flex',
	flexDirection: 'column',
	gap: utils.itemGap,
	zIndex: 1000
});

interface Props {
	onCancel: () => void;
	onCreate: (problem: ProblemType) => void;
	defaults: ProblemType
}

const NewProblem = ({ onCancel, onCreate, defaults }: Props) => {
	const [title, setTitle] = useState<string>(defaults.title);
	const [desc, setDesc] = useState<string>(defaults.description);
	const [severity, setSeverity] = useState<SeverityType>(defaults.severity);
	const [showingAlerts, setShowingAlerts] = useState<boolean>(false);

	const nameSx = {
		width: 'fit-content'
	};

	const btnStyles = {
		width: 125
	};

	const validRules: ErrorRuleType[] = [
		{
			rule: title !== '',
			error: 'Title must have a value'
		},
		{
			rule: desc !== '',
			error: 'Description must have a value'
		}
	];

	const handleCreate = (): void => {
		setShowingAlerts(true);
		if (validProblem()) {
			const problem: ProblemType = {
				title,
				description: desc,
				severity: severity
			};
			onCreate(problem);
		}
	};

	const handleSeverityChange = (e: any): void => {
		setSeverity(e.target.value);
	};

	const validProblem = (): boolean => {
		return !validRules.map((rule: ErrorRuleType): boolean => rule.rule).includes(false);
	};

	const getCurrentErrors = (): string[] => {
		return validRules
			.map((rule: ErrorRuleType): string => {
				return !rule.rule ? rule.error : '';
			})
			.filter((err: string): boolean => err !== '');
	};

	const Alerts = () => {
		const errors: string[] = getCurrentErrors();
		return (
			showingAlerts
				? (
					<AbsoluteAlerts>
						{errors.map((error: string, index: number) => (
							<Alert key={`error-alert-${index}`} onClose={() => { }} color="error" absolute={false}>
								{error}
							</Alert>
						))}
					</AbsoluteAlerts>
				)
				: <></>
		)
	};

	const handleCancel = (): void => {
		setTitle('');
		setDesc('');
		setSeverity('low');
		onCancel();
	};

	return (
		<NewProblemWrapper>
			<Alerts />
			<Card stretch>
				<PageTitle
					sx={{
						marginBottom: 2
					}}
					size="small"
				>Report New Problem</PageTitle>
				<InputWrapper>
					<TextField
						label="Name"
						variant="outlined"
						onChange={(e: any): void => setTitle(e.target.value)}
						value={title}
						size="small"
						sx={nameSx}
					/>
					<TextField
						label="Description"
						variant="filled"
						fullWidth
						multiline
						rows={2}
						onChange={(e: any): void => setDesc(e.target.value)}
						value={desc}
					/>
					<FormControl>
						<FormLabel>Problem Severity</FormLabel>
						<RadioGroup
							aria-labelledby="problem-severity-radio"
							defaultValue="low"
							name="problem-severity"
							value={severity}
							onChange={handleSeverityChange}
						>
							<FormControlLabel
								value="high"
								control={<Radio color="primary" />}
								label="High"
							/>
							<FormControlLabel
								value="medium"
								control={<Radio color="primary" />}
								label="Medium"
							/>
							<FormControlLabel
								value="low"
								control={<Radio color="primary" />}
								label="Low"
							/>
						</RadioGroup>
					</FormControl>
					<Controls>
						<Button
							sx={btnStyles}
							color="inherit"
							onClick={handleCancel}
						>
							Cancel
						</Button>
						<Button
							sx={btnStyles}
							variant="outlined"
							onClick={handleCreate}
							color="primary"
						>
							Create
						</Button>
					</Controls>
				</InputWrapper>
			</Card>
		</NewProblemWrapper>
	);
};

export default NewProblem;
