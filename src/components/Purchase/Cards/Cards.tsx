import { MdCreditCard } from 'react-icons/md';

import * as GetDBData from 'src/hooks/GetDBData';

import Card from './Card';
import CashbackCard from './CashbackCard';

import styles from './styles/cards.module.css';

interface CardsProps {
	sessionAuth: string;
}

type CardData = {
	id: number;
	type: string;
	holder: string;
	number: string;
	securityCode: number;
};

export default function Cards({ sessionAuth }: CardsProps) {
	const userCards = GetDBData.GetCurrentUserCards({ sessionAuth });

	const renderCards = () => {
		return (
			<div className={styles.cardsContainer}>
				<CashbackCard sessionAuth={sessionAuth} />
				{userCards.map((card: CardData) => (
					<Card
						key={card.id}
						id={card.id}
						cardType={card.type}
						cardHolder={card.holder}
						cardNumber={card.number}
						cardSecurityCode={card.securityCode.toString()}
						sessionAuth={sessionAuth}
					/>
				))}
			</div>
		);
	};

	return (
		<section className={styles.cardsSection}>
			<div className={styles.title}>
				<MdCreditCard className={styles.icon} />
				<h2>{'Mis tarjetas'}</h2>
			</div>
			{renderCards()}
		</section>
	);
}
