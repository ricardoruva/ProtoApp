import { useState } from 'react';

import * as GetDBData from 'src/hooks/GetDBData';

import Image from 'next/image';

import PurchaseCashbackCard from './PurchaseCashbackCard';

import styles from './styles/cashbackcard.module.css';

export default function CashbackCard({ sessionAuth }: { sessionAuth: string }) {
	const userData = GetDBData.GetCurrentUserData({ sessionAuth });

	const [purchaseStatus, setPurchaseStatus] = useState<boolean>(false);

	const purchase = () => {
		setPurchaseStatus((status) => !status);
	};

	return (
		<>
				<button onClick={purchase} className={styles.card}>
					<Image
						className={styles.image}
						src={'/img/protopay-card-img.png'}
						alt={'protopay card'}
						width={1000}
						height={1000}
						priority={true}
					/>
					<div className={styles.info}>
						<h2>{userData?.name.toUpperCase()}</h2>
						{userData && (
							<h3>
								{userData.cashback
									? `Saldo en la tarjeta $${Number(userData.cashback).toFixed(2)}`
									: 'No tiene saldo en la tarjeta'}
							</h3>
						)}
					</div>
				</button>

			{purchaseStatus && <PurchaseCashbackCard sessionAuth={sessionAuth} handleClosePurchase={purchase} />}
		</>
	);
}
