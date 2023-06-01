import { getServerSideProps } from 'src/utils/SessionAuthenticator';

import { Head, Header, Footer } from 'src/components/shared';
import { Cards, Summary, Form } from 'src/components/Purchase';

import styles from 'src/styles/purchase.module.css';

export default function Purchase({ session, sessionAuth }: { session: boolean; sessionAuth: string }) {
	return (
		<>
			<Head title={'Comprar'} />

			<Header session={session} sessionAuth={sessionAuth} />

			<Cards sessionAuth={sessionAuth} />

			<section className={styles.summaryPurchase}>
				<Summary sessionAuth={sessionAuth} />
				<Form sessionAuth={sessionAuth} />
			</section>

			<Footer />
		</>
	);
}

export { getServerSideProps };
