import { useState } from 'react';
import { useRouter } from 'next/router';
import { MdOutlineCreditCardOff } from 'react-icons/md';
import { RiVisaLine, RiMastercardFill } from 'react-icons/ri';

import Purchase from './Purchase';

import styles from './styles/card.module.css';

interface CardProps {
	id: number;
	cardType: string;
	cardHolder: string;
	cardNumber: string;
	cardSecurityCode: string;
	sessionAuth: string;
}

export default function Card(props: CardProps) {
	const { sessionAuth, id, cardType, cardHolder, cardNumber, cardSecurityCode } = props;
	const router = useRouter();

	const [purchaseStatus, setPurchaseStatus] = useState<boolean>(false);

	const handleDeleteCard = async () => {
		try {
			const response = await fetch('/api/delete/card', {
				method: 'POST',
				body: JSON.stringify({ id }),
				headers: { 'Content-Type': 'application/json' },
			});

			if (response.status === 200) {
				router.reload();
			}
		} catch (error) {
			console.error('Error deleting card:', error);
		}
	};

	const handlePurchaseStatusChange = () => {
		setPurchaseStatus((status) => !status);
	};

	return (
		<>
			<button onClick={handlePurchaseStatusChange} className={styles.card}>
				<MdOutlineCreditCardOff onClick={handleDeleteCard} className={styles.delete} />
				{cardType === 'visa' ? <RiVisaLine className={styles.icon} /> : <RiMastercardFill className={styles.icon} />}

				<div className={styles.info}>
					<h2>{`**** **** **** ${cardNumber.slice(-4)}`}</h2>
					<h3>{cardHolder.toUpperCase()}</h3>
				</div>
			</button>

			{purchaseStatus && (
				<Purchase
					sessionAuth={sessionAuth}
					cardType={cardType}
					cardNumber={cardNumber.slice(-4)}
					securityCode={cardSecurityCode}
					handleClosePurchase={handlePurchaseStatusChange}
				/>
			)}
		</>
	);
}
