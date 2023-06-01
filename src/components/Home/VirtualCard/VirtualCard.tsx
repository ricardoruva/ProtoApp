import { MdCreditCard } from 'react-icons/md';

import * as GetDBData from 'src/hooks/GetDBData';

import Image from 'next/image';

import styles from './styles/virtualcard.module.css';

export default function VirtualCard({ sessionAuth }: { sessionAuth: string }) {
	const userData = GetDBData.GetCurrentUserData({ sessionAuth });

	return (
		<>
			<section className={styles.section}>
				<article className={styles.container}>
					<div className={styles.titleSection}>
						<MdCreditCard className={styles.icon} />
						<h2>{'Tarjeta virtual'}</h2>
						<div className={styles.line} />
					</div>
					<h3>{'Disfruta de tu tarjeta virtual'}</h3>
					<div className={styles.card}>
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
									{userData.cashback ? `Saldo en la tarjeta $${Number(userData.cashback).toFixed(2)}` : 'No tiene saldo en la tarjeta'}
								</h3>
							)}
						</div>
					</div>
				</article>
			</section>
		</>
	);
}
