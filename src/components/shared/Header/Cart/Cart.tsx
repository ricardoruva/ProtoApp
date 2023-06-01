import { useState } from 'react';
import { useRouter } from 'next/router';
import { MdShoppingCart, MdClose, MdDelete } from 'react-icons/md';

import * as GetDBData from 'src/hooks/GetDBData';

import Link from 'next/link';
import Image from 'next/image';

import CartEmpty from './Cart.empty';

import styles from './styles/cart.module.css';

interface CartProps {
	session: boolean;
	sessionAuth: string;
}

export default function Cart({ session, sessionAuth }: CartProps) {
	const router = useRouter();
	const userCart = GetDBData.GetCurrentUserCart({ sessionAuth });

	const [windowStatus, setWindowStatus] = useState<boolean>(false);

	let totalPrice = 0;
	let totalCashback = 0;

	const handleChangeWindowStatus = () => {
		if (session) {
			setWindowStatus(!windowStatus);
		}
	};

	if (userCart && userCart.length <= 0) {
		return <CartEmpty />;
	}

	const userCartHTML = userCart?.map((currentProduct) => {
		const handleAbortBuy = async () => {
			const response = await fetch('/api/delete/product-cart', {
				method: 'POST',
				body: JSON.stringify({ id: currentProduct.id }),
				headers: { 'Content-Type': 'application/json' },
			});

			if (response.status === 200) {
				router.reload();
			}
		};

		totalPrice += currentProduct.priceSelected * currentProduct.quantity;
		totalCashback += currentProduct.cashback * 1;

		return (
			<div key={currentProduct.id} className={styles.product}>
				<div className={styles.productButtonInfo}>
					<MdDelete onClick={handleAbortBuy} className={styles.trashButton} />
					<div className={styles.productInfo}>
						<h3>{currentProduct.product}</h3>
						<h5>{`Precio individual: ${currentProduct.priceSelected}`}</h5>
					</div>
				</div>
				<h4>{`Cantidad: ${currentProduct.quantity}`}</h4>
			</div>
		);
	});

	return (
		<>
			<button onClick={handleChangeWindowStatus} className={styles.mdShoppingCart}>
				<MdShoppingCart className={styles.icon} />
				<h5>{'Mi carrito'}</h5>
				<h5 className={styles.quantity}>{userCartHTML.length}</h5>
			</button>

			{windowStatus === true ? (
				<>
					<div className={styles.background} />
					<section className={styles.cart}>
						<div className={styles.headerCart}>
							<div className={styles.headerTitle}>
								<MdShoppingCart className={styles.icon} />
								<h2>{'Mis compras'}</h2>
							</div>
							<MdClose onClick={handleChangeWindowStatus} className={styles.icon} />
						</div>
						<div className={styles.allProducts}>{userCartHTML}</div>
						<div className={styles.footerCart}>
							<div className={styles.footerInfo}>
								<h3>{`Total a pagar: MX$${totalPrice}`}</h3>
								<h4>{`Cashback: MX$${totalCashback.toFixed(2)}`}</h4>
							</div>
							<div className={styles.method}>
								<div className={styles.line} />
								<h4>{'Elige tu método de pago'}</h4>
								<div className={styles.line} />
							</div>

							<Link href={{ pathname: '../../purchase/' }} className={styles.footerButton}>
								<Image
									className={styles.image}
									src={'/img/protopay-card.png'}
									alt={'protopay card'}
									width={600}
									height={300}
									priority={true}
								/>
							</Link>
						</div>
					</section>
				</>
			) : null}
		</>
	);
}
