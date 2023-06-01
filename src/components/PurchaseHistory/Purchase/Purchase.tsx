import { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

import classNames from 'classnames';

import Product from './Product';

import styles from './styles/purchase.module.css';

interface PurchaseProps {
	id: number;
	date: string;
	products: string[];
	prices: number[];
	quantitys: number[];
}

export default function Purchase(props: PurchaseProps) {
	let totalPrice: number = 0;
	const [productStatus, setProductStatus] = useState<boolean>(false);
	const { id, date, products, prices, quantitys } = props;

	const changeProductStatus = () => {
		setProductStatus(!productStatus);
	};

	const productHTML = products.map((product, index) => {
		totalPrice += prices[index] * quantitys[index];
		return (
			<Product key={index} productName={product} productPrice={prices[index]} productQuantity={quantitys[index]} />
		);
	});

	return (
		<>
			<section className={styles.infoButton}>
				<div className={styles.purchaseCard}>
					<div className={styles.info}>
						<h3 className={styles.title}>{'Fecha de pedido'}</h3>
						<h3 className={styles.content}>{date}</h3>
					</div>
					<div className={styles.info}>
						<h3 className={styles.title}>{'Número de pedido'}</h3>
						<h3 className={styles.content}>{id}</h3>
					</div>
					<div className={styles.info}>
						<h3 className={styles.title}>{'Total'}</h3>
						<h3 className={styles.content}>{`MX$${totalPrice}`}</h3>
					</div>
				</div>
				<button onClick={changeProductStatus} className={styles.button}>
					<MdKeyboardArrowDown className={classNames(styles.icon, productStatus ? styles.selectedButton : null)} />
				</button>
			</section>
			{productStatus ? <section className={styles.products}>{productHTML}</section> : null}
		</>
	);
}
