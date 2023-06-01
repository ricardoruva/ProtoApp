import { useRouter } from 'next/router';
import { MdShoppingBag } from 'react-icons/md';
import { getServerSideProps } from 'src/utils/SessionAuthenticator';

import * as GetDBData from 'src/hooks/GetDBData';
import * as StringUtilities from 'src/utils/StringUtilities';

import classNames from 'classnames';

import { Head, Header, Footer } from 'src/components/shared';
import { Product, AddProducts } from 'src/components/Products';

import styles from 'src/styles/products.module.css';

export default function Products({ session, sessionAuth }: { session: boolean; sessionAuth: string }) {
	const userData = GetDBData.GetCurrentUserData({ sessionAuth });

	const router = useRouter();
	const selectedCategory = router.query.category !== undefined ? router.query.category.toString() : 'NULL';

	const currentProducts = GetDBData.GetProducts({ category: selectedCategory });

	if (currentProducts.length <= 0) {
		return (
			<>
				<Head title="Productos" />

				<Header session={session} sessionAuth={sessionAuth} />

				<section className={styles.category}>
					<div className={styles.iconTitle}>
						<MdShoppingBag className={styles.icon} />
						<h2>{StringUtilities.wordsToCapitalLetter({ text: selectedCategory.toString() })}</h2>
					</div>
				</section>

				<section className={classNames(styles.products, styles.noProducts)}>
					<h2>{'No hay productos disponibles'}</h2>
					{userData?.admin === 1 ? <AddProducts type="text" /> : null}
				</section>

				<Footer />
			</>
		);
	}

	const allSelectedProducts = currentProducts.map((selectedProduct) => {
		return (
			<Product
				key={selectedProduct.id}
				id={selectedProduct.id}
				product={selectedProduct.name}
				image={selectedProduct.image}
				description={selectedProduct.description}
				price={selectedProduct.price}
				cashback={selectedProduct.cashback}
				type={selectedProduct.type}
				sessionAuth={sessionAuth}
			/>
		);
	});

	return (
		<>
			<Head title={StringUtilities.wordsToCapitalLetter({ text: selectedCategory.toString() })} />

			<Header session={session} sessionAuth={sessionAuth} />

			<section className={styles.category}>
				<div className={styles.iconTitle}>
					<MdShoppingBag className={styles.icon} />
					<h2>{StringUtilities.wordsToCapitalLetter({ text: selectedCategory.toString() })}</h2>
				</div>
				{userData?.admin === 1 ? <AddProducts type="icon" /> : null}
			</section>

			<section className={styles.products}>{allSelectedProducts}</section>

			<Footer />
		</>
	);
}

export { getServerSideProps };
