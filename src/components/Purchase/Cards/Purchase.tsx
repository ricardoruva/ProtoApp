import { useRouter } from 'next/router';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

import * as GetDBData from 'src/hooks/GetDBData';

import styles from './styles/purchase.module.css';

interface PurchaseProps {
	sessionAuth: string;
	cardType: string;
	cardNumber: string;
	securityCode: string;
	handleClosePurchase: () => void;
}

export default function Purchase(props: PurchaseProps) {
	const { sessionAuth, cardType, cardNumber, securityCode, handleClosePurchase } = props;

	const router = useRouter();
	const currentDate = Date.now();

	const userCart = GetDBData.GetCurrentUserCart({ sessionAuth });
	const userData = GetDBData.GetCurrentUserData({ sessionAuth });

	const [errorStatus, setErrorStatus] = useState<boolean>(false);

	const [codeCardValue, setCodeCardValue] = useState<string>('');
	const [userPricesCart, setUserPricesCart] = useState<string>('');
	const [userProductsCart, setUserProductsCart] = useState<string>('');
	const [userQuantityCart, setUserQuantityCart] = useState<string>('');
	const [userCashback, setUserCashback] = useState<number>(0);
	const [dateAdded, setDateAdded] = useState<string>('');

	useEffect(() => {
		const products = userCart.map((cart) => cart.product);
		const prices = userCart.map((cart) => cart.priceSelected);
		const quantities = userCart.map((cart) => cart.quantity);
		const cashback =
			userCart.reduce((total, cart) => total + cart.cashback * 1, 0) + (userData?.cashback ? Number(userData.cashback) : 0);

		setUserCashback(cashback);
		setUserPricesCart(prices.join(', '));
		setUserProductsCart(products.join(', '));
		setUserQuantityCart(quantities.join(', '));
	}, [userData, userCart]);

	useEffect(() => {
		const date = new Date();
		const formattedDate = date.toLocaleDateString('en-GB');

		setDateAdded(formattedDate.replace(/\//g, '-'));
	}, []);

	const handleCodeCardChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.value.length <= 4) {
			setCodeCardValue(event.target.value);
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData();

		if (securityCode.toString() !== codeCardValue) {
			setErrorStatus(true);
			return;
		}

		formData.append('sessionAuth', sessionAuth);
		formData.append('products', userProductsCart);
		formData.append('productsPrices', userPricesCart);
		formData.append('productsQuantity', userQuantityCart);
		formData.append('date', dateAdded);
		formData.append('cashback', userCashback.toString());
		formData.append('dateAdded', currentDate.toString());
		formData.append('saveCard', 'false');

		const response = await fetch('/api/add/purchase', {
			method: 'POST',
			body: formData,
		});

		if (response.status === 200) {
			router.push({ pathname: '../../purchase-history' });
		}
	};

	return (
		<>
			<section className={styles.purchase}>
				<div className={styles.background} />
				<form onSubmit={handleSubmit} className={styles.message}>
					<h3>{'Confirmar compra'}</h3>
					<h4>{`Método de pago: ${cardType} que termina en ${cardNumber}`}</h4>
					<div className={styles.labelInput}>
						<div className={styles.labelError}>
							<label>{'Código de seguridad'}</label>
							{errorStatus && (
								<>
									<label>{' - '}</label>
									<label className={styles.error}>{'Código incorrecto'}</label>
								</>
							)}
						</div>
						<input
							type="text"
							required={true}
							pattern="[0-9]*"
							minLength={3}
							value={codeCardValue}
							onChange={handleCodeCardChange}
						/>
					</div>
					<div className={styles.buttons}>
						<button type="button" onClick={handleClosePurchase}>
							{'Cancelar'}
						</button>
						<button type="submit">{'Confirmar'}</button>
					</div>
				</form>
			</section>
		</>
	);
}
