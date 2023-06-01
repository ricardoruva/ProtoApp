import styles from './styles/product.module.css';

interface ProductProps {
	productName: string;
	productPrice: number;
	productQuantity: number;
}

export default function Product(props: ProductProps) {
	const { productName, productPrice, productQuantity } = props;

	return (
		<>
			<div className={styles.product}>
				<div className={styles.info}>
					<h3 className={styles.title}>{'Producto/Servicio'}</h3>
					<h3 className={styles.content}>{productName}</h3>
				</div>
				<div className={styles.info}>
					<h3 className={styles.title}>{'Precio'}</h3>
					<h3 className={styles.content}>{productPrice}</h3>
				</div>
				<div className={styles.info}>
					<h3 className={styles.title}>{'Cantidad'}</h3>
					<h3 className={styles.content}>{productQuantity}</h3>
				</div>
			</div>
		</>
	);
}
