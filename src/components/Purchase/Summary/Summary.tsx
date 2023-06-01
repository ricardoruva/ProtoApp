import { MdWysiwyg, MdMail } from 'react-icons/md';

import * as GetDBData from 'src/hooks/GetDBData';

import styles from './styles/summary.module.css';

export default function Summary({ sessionAuth }: { sessionAuth: string }) {
	const userData = GetDBData.GetCurrentUserData({ sessionAuth });
	const userCart = GetDBData.GetCurrentUserCart({ sessionAuth });

	let totalPrice = 0;
	let totalCashback = 0;

	userCart.forEach((cart) => {
		totalPrice += cart.priceSelected * cart.quantity;
		totalCashback += cart.cashback * 1;
	})

	return (
		<>
			<section className={styles.summarySection}>
				<div className={styles.title}>
					<MdWysiwyg className={styles.icon} />
					<h2>{'Resumen'}</h2>
				</div>
				<div className={styles.cartel}>
					<div className={styles.info}>
						<h4>{'Comprador'}</h4>
						<div className={styles.email}>
							<MdMail className={styles.icon} />
							<h4>{userData?.email}</h4>
						</div>
					</div>
					<div className={styles.info}>
						<h4>{'Monto'}</h4>
						<h4 className={styles.text}>{`MX$${totalPrice}`}</h4>
					</div>
					<div className={styles.info}>
						<h4>{'Cashback'}</h4>
						<h4 className={styles.text}>{`MX$${totalCashback.toFixed(2)}`}</h4>
					</div>
				</div>
			</section>
		</>
	);
}
