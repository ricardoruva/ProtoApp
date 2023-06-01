import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { MdShoppingBag } from 'react-icons/md';

import * as StringUtilities from 'src/utils/StringUtilities';

import Image from 'next/image';

import styles from './styles/categories.module.css';

export default function Categories({ session }: { session: boolean }) {
	const router = useRouter();

	const [categoriesEN, setCategoriesEN] = useState<string[]>([]);
	const [categoriesES, setCategoriesES] = useState<string[]>([]);

	useEffect(() => {
		const categoriesEN = ['cinemex', 'cinepolis', 'entertainment', 'food', 'games'];
		const categoriesES = ['cinemex', 'cinepolis', 'entretenimiento', 'comida', 'juegos'];

		setCategoriesEN(categoriesEN);
		setCategoriesES(categoriesES);
	}, []);

	const categories = categoriesEN.map((category, index) => {
		return {
			id: index,
			categoryEN: category,
			categoryES: categoriesES[index],
			image: `/img/categories/${category}.png`,
		};
	});

	const allCategories = categories.map((currentCategory) => {
		const category = currentCategory.categoryEN;

		const goToCategory = () => {
			if (session) {
				router.push({ pathname: './products', query: { category } });
			}
		};

		return (
			<button onClick={goToCategory} key={currentCategory.id} className={styles.category}>
				<Image
					className={styles.image}
					src={currentCategory.image}
					alt={currentCategory.categoryEN}
					width={200}
					height={200}
					priority={true}
				/>
				<h3 className={styles.title}>{StringUtilities.wordsToCapitalLetter({ text: currentCategory.categoryES })}</h3>
			</button>
		);
	});

	return (
		<>
			<section className={styles.categoriesSection}>
				<div className={styles.categoriesContainer}>
					<div className={styles.titleSection}>
						<MdShoppingBag className={styles.icon} />
						<h2>{'Productos'}</h2>
						<div className={styles.line} />
					</div>
					<h3>{'Busca entre las siguientes categorías y sorpréndete'}</h3>
					<div className={styles.allCategories}>{allCategories}</div>
				</div>
			</section>
		</>
	);
}
