import * as GetDBData from 'src/hooks/GetDBData';

import classNames from 'classnames';

import Purchase from './Purchase';

import styles from './styles/purchasehistory.module.css';

export default function PurchaseHistory() {
	const allPurchases = GetDBData.GetAllPurchases();

	const currentDate = Date.now();

	allPurchases.sort((a, b) => b.dateAdded - currentDate - (a.dateAdded - currentDate));

	const purchaseHistory = allPurchases.map((purchase) => {
		return (
			<>
				<article key={purchase.id} className={styles.card}>
					<Purchase
						id={purchase.id}
						name={purchase.username}
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
			<section className={styles.purchaseHistorySection}>
				<h3>{'Administración de historial de compras'}</h3>
				<div className={classNames(styles.purchaseContainer, purchaseHistory.length > 0 ? null : styles.noPurchases)}>
					{purchaseHistory.length > 0 ? purchaseHistory : <h3>{'No hay historial disponible'}</h3>}
				</div>
			</section>
		</>
	);
}
