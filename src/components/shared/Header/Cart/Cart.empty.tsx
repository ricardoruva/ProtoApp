import { useState } from 'react';
import { MdShoppingCart, MdClose } from 'react-icons/md';

import Image from 'next/image';
import classNames from 'classnames';

import styles from './styles/cart.module.css';

export default function CartEmpty() {
	const [windowStatus, setWindowStatus] = useState<boolean>(false);

	const handleChangeWindowStatus = () => {
		setWindowStatus(!windowStatus);
	};

	return (
		<>
			<button onClick={handleChangeWindowStatus} className={styles.mdShoppingCart}>
				<MdShoppingCart className={styles.icon} />
				<h5>{'Mi carrito'}</h5>
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
						<div className={classNames(styles.allProducts, styles.noProducts)}>
							<h3>{'No hay productos agregados'}</h3>
						</div>
						<div className={styles.footerCart}>
							<div className={styles.footerInfo}>
								<h3>{'Total a pagar: MX$0'}</h3>
								<h4>{'Cashback: MX$0'}</h4>
							</div>
							<div className={styles.method}>
								<div className={styles.line} />
								<h4>{'Elige tu método de pago'}</h4>
								<div className={styles.line} />
							</div>
							<button className={classNames(styles.footerButton, styles.footerButtonNoProducts)}>
								<Image
									className={styles.image}
									src={'/img/protopay-card.png'}
									alt={'protopay card'}
									width={600}
									height={300}
									priority={true}
								/>
							</button>
						</div>
					</section>
				</>
			) : null}
		</>
	);
}
