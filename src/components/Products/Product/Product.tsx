import { useRouter } from 'next/router';
import { MdDelete } from 'react-icons/md';
import { useState, ChangeEvent, FormEvent } from 'react';
import { GetCurrentUserData } from 'root/src/hooks/GetDBData';

import Image from 'next/image';
import classNames from 'classnames';

import styles from './styles/product.module.css';

interface ProductProps {
	id: number;
	product: string;
	image: string;
	description: string;
	price: string[];
	cashback: string;
	type: string;
	sessionAuth: string;
}

export default function Product(props: ProductProps) {
	const { id, product, image, description, price, cashback, type, sessionAuth } = props;
	const router = useRouter();
	const userData = GetCurrentUserData({ sessionAuth });

	const dateAdded = Date.now();

	const [selectedPrice, setSelectedPrice] = useState<string>('0');
	const [selectQuantity, setSelectQuantity] = useState<number>(1);

	const [selectedOne, setSelectedOne] = useState<boolean>(false);
	const [selectedTwo, setSelectedTwo] = useState<boolean>(false);
	const [selectedThree, setSelectedThree] = useState<boolean>(false);

	const setPriceOne = () => {
		setSelectedOne(!selectedOne);
		setSelectedTwo(false);
		setSelectedThree(false);
		if (selectedOne !== false) {
			setSelectedPrice('0');
		} else {
			setSelectedPrice(price[0]);
		}
	};

	const setPriceTwo = () => {
		setSelectedOne(false);
		setSelectedTwo(!selectedTwo);
		setSelectedThree(false);
		if (selectedTwo !== false) {
			setSelectedPrice('0');
		} else {
			setSelectedPrice(price[1]);
		}
	};

	const setPriceThree = () => {
		setSelectedOne(false);
		setSelectedTwo(false);
		setSelectedThree(!selectedThree);
		if (selectedThree !== false) {
			setSelectedPrice('0');
		} else {
			setSelectedPrice(price[2]);
		}
	};

	const handleSelectQuantity = (event: ChangeEvent<HTMLInputElement>) => {
		setSelectQuantity(Number(event.target.value));
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const cashbackTo100 = Number(cashback) / 100;

		const formData = new FormData();
		let totalCashback: number = 0;
		let priceSelected: number | string = 0;

		formData.append('sessionAuth', sessionAuth);
		formData.append('dateAdded', dateAdded.toString());
		formData.append('product', product);
		formData.append('quantity', selectQuantity.toString());

		if (type === 'gift-card') {
			if (selectedPrice === '0') {
				console.log('falta seleccionar el precio');
				return;
			}

			totalCashback = Number(selectedPrice) * selectQuantity * cashbackTo100;
			priceSelected = selectedPrice;
		} else {
			totalCashback = Number(price) * selectQuantity * cashbackTo100;
			priceSelected = price.toString();
		}

		formData.append('price', priceSelected);
		formData.append('cashback', totalCashback.toString());

		const response = await fetch('/api/add/product-to-cart', {
			method: 'POST',
			body: formData,
		});

		if (response.status === 200) {
			router.reload();
		}
	};

	const handleDeleteProduct = async () => {
		try {
			const response = await fetch('/api/delete/product', {
				method: 'POST',
				body: JSON.stringify({ id, image }),
				headers: { 'Content-Type': 'application/json' },
			});

			if (response.ok) {
				router.reload();
			}
		} catch (err) {
			throw err;
		}
	};

	return (
		<>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.card}>
					<div className={styles.startSectionCard}>
						<div className={styles.imageButton}>
							<Image className={styles.image} src={image} alt={product} width={400} height={200} priority={true} />
							{userData && userData.admin ? <MdDelete className={styles.button} onClick={handleDeleteProduct} /> : null}
						</div>
						<h2>{product}</h2>
						<h4>{description}</h4>
					</div>
					<div className={styles.endSectionCard}>
						{type === 'gift-card' ? (
							<div className={styles.threePrices}>
								<h4>{'Precio:'}</h4>
								<div>
									<button
										type="button"
										onClick={setPriceOne}
										className={classNames(styles.predefinedPrice, selectedOne ? styles.selectPredefinedPrice : null)}
									>{`MX$${price[0]}`}</button>
									<button
										type="button"
										onClick={setPriceTwo}
										className={classNames(styles.predefinedPrice, selectedTwo ? styles.selectPredefinedPrice : null)}
									>{`MX$${price[1]}`}</button>
									<button
										type="button"
										onClick={setPriceThree}
										className={classNames(styles.predefinedPrice, selectedThree ? styles.selectPredefinedPrice : null)}
									>{`MX$${price[2]}`}</button>
								</div>
							</div>
						) : (
							<div className={styles.onePrice}>
								<h4>{'Precio:'}</h4>
								<h4>{`MX$${price}`}</h4>
							</div>
						)}
						<div className={styles.quantity}>
							<h4>Cantidad:</h4>
							<input type="number" min="1" value={selectQuantity} onChange={handleSelectQuantity} />
						</div>
						<button type="submit" className={styles.addToCart}>
							Agregar al carrito
						</button>
					</div>
				</div>
			</form>
		</>
	);
}
