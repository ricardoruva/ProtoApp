import { getServerSideProps } from 'src/utils/SessionAuthenticator';

import * as GetDBData from 'src/hooks/GetDBData';
import * as StringUtilities from 'src/utils/StringUtilities';

import { Head, Header, Footer } from 'src/components/shared';
import { UserData, UsersData, PurchaseHistory } from 'src/components/Account';

import styles from 'src/styles/account.module.css';

export default function Account({ session, sessionAuth }: { session: boolean; sessionAuth: string }) {
	const userData = GetDBData.GetCurrentUserData({ sessionAuth });

	let username: string = StringUtilities.firstWord({
		text: StringUtilities.wordsToCapitalLetter({ text: userData ? userData.name : '' }),
	});

	return (
		<>
			<Head title={`Cuenta de ${username}`} />

			<Header session={session} sessionAuth={sessionAuth} />

			{userData?.admin ? (
				<section className={styles.adminSection}>
					<UserData sessionAuth={sessionAuth} />
					<UsersData sessionAuth={sessionAuth} />
					<PurchaseHistory />
					<Footer />
				</section>
			) : (
				<section className={styles.noAdminSection}>
					<UserData sessionAuth={sessionAuth} />
					<Footer />
				</section>
			)}
		</>
	);
}

export { getServerSideProps };
