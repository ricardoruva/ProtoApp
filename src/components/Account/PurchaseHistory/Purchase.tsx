import { useState } from 'react';
import { useRouter } from 'next/router';
import { MdDelete, MdKeyboardArrowDown } from 'react-icons/md';

import classNames from 'classnames';

import Product from './Product';

import styles from './styles/purchase.module.css';

interface PurchaseProps {
	id: number;
	name: string;
	date: string;
	products: string[];
	prices: number[];
	quantitys: number[];
}

export default function Purchase(props: PurchaseProps) {
	const router = useRouter();
	let totalPrice: number = 0;
	const [productStatus, setProductStatus] = useState<boolean>(false);
	const { id, name, date, products, prices, quantitys } = props;

	const handleDeleteHistory = async () => {
		const response = await fetch('/api/delete/purchase', {
			method: 'POST',
			body: JSON.stringify({ id: id }),
			headers: { 'Content-Type': 'application/json' },
		});

		if (response.status === 200) {
			router.reload();
		}
	};

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
						<h3 className={styles.title}>{'Usuario'}</h3>
						<h3 className={styles.content}>{name}</h3>
					</div>
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
				<button onClick={handleDeleteHistory} className={styles.button}>
					<MdDelete className={styles.icon} />
				</button>
				<button onClick={changeProductStatus} className={styles.button}>
					<MdKeyboardArrowDown className={classNames(styles.icon, productStatus ? styles.selectedButton : null)} />
				</button>
			</section>
			{productStatus ? <section className={styles.products}>{productHTML}</section> : null}
		</>
	);
}
