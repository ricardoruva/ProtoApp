import { getServerSideProps } from 'src/utils/SessionAuthenticator';

import * as GetDBData from 'src/hooks/GetDBData';

import classNames from 'classnames';

import { Head, Header, Footer } from 'src/components/shared';
import { Purchase } from 'src/components/PurchaseHistory';

import styles from 'src/styles/purchase-history.module.css';

export default function PurchaseHistory({ session, sessionAuth }: { session: boolean; sessionAuth: string }) {
	const currentDate = Date.now();
	const userPurchases = GetDBData.GetCurrentUserPurchases({ sessionAuth });

	userPurchases.sort((a, b) => b.dateAdded - currentDate - (a.dateAdded - currentDate));

	const purchaseHistory = userPurchases.map((purchase) => {
		return (
			<>
				<article key={purchase.id} className={styles.card}>
					<Purchase
						id={purchase.id}
						date={purchase.date}
						products={purchase.products}
						prices={purchase.prices}
						quantitys={purchase.quantitys}
					/>
				</article>
			</>
		);
	});

	return (
		<>
			<Head title="Mis compras" />

			<Header session={session} sessionAuth={sessionAuth} />

			<section className={styles.purchaseHistory}>
				<h3 className={styles.title}>{'Mis compras'}</h3>
				{purchaseHistory.length <= 0 ? (
					<div className={classNames(styles.purchaseSection, styles.noPurchase)}>
						<h2>{'No has hecho ninguna compra'}</h2>
					</div>
				) : (
					<div className={styles.purchaseSection}>{purchaseHistory}</div>
				)}
			</section>

			<Footer />
		</>
	);
}

export { getServerSideProps };
