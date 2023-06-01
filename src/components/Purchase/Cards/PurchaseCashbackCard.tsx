import { useRouter } from 'next/router';
import { useState, useEffect, FormEvent } from 'react';

import * as GetDBData from 'src/hooks/GetDBData';

import styles from './styles/purchasecashbackcard.module.css';

interface PurchaseCashbackCardProps {
	sessionAuth: string;
	handleClosePurchase: () => void;
}

export default function PurchaseCashbackCard({ sessionAuth, handleClosePurchase }: PurchaseCashbackCardProps) {
	const userData = GetDBData.GetCurrentUserData({ sessionAuth });
	const userCart = GetDBData.GetCurrentUserCart({ sessionAuth });

	const router = useRouter();
	const currentDate = Date.now();

	const [insufficientBalance, setInsufficientBalance] = useState<boolean>(false);

	const [buyPrice, setBuyPrice] = useState<string>('');
	const [buyCashback, setBuyCashback] = useState<string>('');
	const [userPricesCart, setUserPricesCart] = useState<string>('');
	const [userProductsCart, setUserProductsCart] = useState<string>('');
	const [userQuantityCart, setUserQuantityCart] = useState<string>('');
	const [userCashback, setUserCashback] = useState<number>(0);
	const [dateAdded, setDateAdded] = useState<string>('');
	const [newCashback, setNewCashback] = useState<string>('');

	useEffect(() => {
		const products = userCart.map((cart) => cart.product);
		const prices = userCart.map((cart) => cart.priceSelected);
		const quantities = userCart.map((cart) => cart.quantity);
		const cashback =
			userCart.reduce((total, cart) => total + cart.cashback * 1, 0) +
			(userData?.cashback ? Number(userData.cashback) : 0);

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

	useEffect(() => {
		let totalPrice: number = 0;
		let totalCashback: number = 0;

		userCart.forEach((cart) => {
			totalPrice += cart.priceSelected * cart.quantity;
			totalCashback += cart.cashback * 1;
		});

		if (totalPrice > Number(userCashback)) {
			setInsufficientBalance(true);
		} else {
			const cashback = Number(userCashback) - totalPrice;

			setNewCashback(cashback.toString());
		}

		setBuyPrice(totalPrice.toString());
		setBuyCashback(totalCashback.toString());
	}, [userCart, userCashback]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append('sessionAuth', sessionAuth);
		formData.append('products', userProductsCart);
		formData.append('productsPrices', userPricesCart);
		formData.append('productsQuantity', userQuantityCart);
		formData.append('date', dateAdded);
		formData.append('cashback', newCashback.toString());
		formData.append('dateAdded', currentDate.toString());
		formData.append('saveCard', 'false');

		try {
			const purchasing = await fetch('/api/add/purchase', {
				method: 'POST',
				body: formData,
			});

			if (purchasing.ok) {
				router.push({ pathname: '../../purchase-history' });
			}
		} catch (err) {
			throw err;
		}
	};

	return (
		<>
			<section className={styles.purchase}>
				<div className={styles.background} />
				<form onSubmit={handleSubmit} className={styles.form}>
					<h3>{'Comprar'}</h3>
					{insufficientBalance ? (
						<div className={styles.insufficientBalanceText}>
							<p>{'Saldo insuficiente en el monedero para realizar esta compra'}</p>
						</div>
					) : (
						<div className={styles.summary}>
							<div className={styles.data}>
								<p className={styles.text}>{'Saldo'}</p>
								<p className={styles.money}>{`MX$${userData?.cashback}`}</p>
							</div>
							<div className={styles.data}>
								<p className={styles.text}>{'Cashback'}</p>
								<p className={styles.green}>{`MX$${buyCashback}`}</p>
							</div>
							<div className={styles.data}>
								<p className={styles.text}>{'Monto a pagar'}</p>
								<p className={styles.red}>{`MX$${buyPrice}`}</p>
							</div>
							<div className={styles.line}></div>
							<div className={styles.data}>
								<p className={styles.text}>{'Lo que te quedará'}</p>
								<p className={styles.money}>{`MX$${newCashback}`}</p>
							</div>
						</div>
					)}
					<div className={styles.buttons}>
						{insufficientBalance ? (
							<button type={'button'} onClick={handleClosePurchase} className={styles.cancel}>
								{'Cerrar'}
							</button>
						) : (
							<>
								<button type={'button'} onClick={handleClosePurchase} className={styles.cancel}>
									{'Cancelar'}
								</button>
								<button type={'submit'} className={styles.buy}>
									{'Comprar'}
								</button>
							</>
						)}
					</div>
				</form>
			</section>
		</>
	);
}
