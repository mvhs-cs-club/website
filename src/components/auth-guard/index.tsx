// react
import { useContext } from "react";

// utils
import { AdminContext } from 'contexts/UserContext'

// components
import CardTitle from 'components/page-title';
import PageWrapper from 'components/page-wrapper';

interface Props {
	children: React.ReactNode;
}

const AuthGuard = ({ children }: Props) => {
	const admin = useContext(AdminContext);

	return (
		admin === true
			? <>{children}</>
			: (
				<PageWrapper>
					{admin === null
						? <CardTitle size="large">Loading...</CardTitle>
						: <CardTitle size="small">Sorry, you do not have the permissions to view this page.</CardTitle>
					}
				</PageWrapper>
			)
	);
};

export default AuthGuard;
