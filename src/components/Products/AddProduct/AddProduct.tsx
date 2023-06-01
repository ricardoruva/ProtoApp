import { useRouter } from 'next/router';
import { MdOutlineAdd } from 'react-icons/md';
import { useState, ChangeEvent, FormEvent } from 'react';

import Image from 'next/image';
import classNames from 'classnames';

import styles from './styles/addproduct.module.css';

export default function AddProducts({ type }: { type: 'icon' | 'text' }) {
	const router = useRouter();
	const dateAdded = Date.now();
	const category = router.query.category ? router.query.category.toString() : '';

	const [showAddProducts, setShowAddProducts] = useState<boolean>(false);

	const [productImagePreview, setProductImagePreview] = useState<string>('');
	const [productImage, setProductImage] = useState<File | null>(null);
	const [productName, setProductName] = useState<string>('');
	const [productDescription, setProductDescription] = useState<string>('');
	const [productType, setProductType] = useState<string>('product');
	const [productPrice, setProductPrice] = useState<string>('');
	const [productPriceOne, setProductPriceOne] = useState<string>('');
	const [productPriceTwo, setProductPriceTwo] = useState<string>('');
	const [productPriceThree, setProductPriceThree] = useState<string>('');
	const [productCashback, setProductCashback] = useState<string>('');
	const [productCategory, setProductCategory] = useState<string>(category);

	const handleShowAddProduct = () => {
		setShowAddProducts(!showAddProducts);

		setProductImagePreview('');
		setProductImage(null);
		setProductName('');
		setProductDescription('');
		setProductType('product');
		setProductPrice('');
		setProductPriceOne('');
		setProductPriceTwo('');
		setProductPriceThree('');
		setProductCashback('');
		setProductCategory(category);
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setProductImage(event.target.files[0]);
			const file = event.target.files[0];
			const reader = new FileReader();

			reader.onloadend = () => {
				setProductImagePreview(reader.result as string);
			};

			reader.readAsDataURL(file);
		} else {
			setProductImagePreview('');
		}
	};

	const handleProductNameChange = (event: ChangeEvent<HTMLInputElement>) => {
		setProductName(event.target.value);
	};

	const handleProductDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
		setProductDescription(event.target.value);
	};

	const handleProductTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setProductType(event.target.value);
	};

	const handleProductPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
		setProductPrice(event.target.value);
	};

	const handleProductPriceOneChange = (event: ChangeEvent<HTMLInputElement>) => {
		setProductPriceOne(event.target.value);
	};

	const handleProductPriceTwoChange = (event: ChangeEvent<HTMLInputElement>) => {
		setProductPriceTwo(event.target.value);
	};

	const handleProductPriceThreeChange = (event: ChangeEvent<HTMLInputElement>) => {
		setProductPriceThree(event.target.value);
	};

	const handleProductCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setProductCategory(event.target.value);
	};

	const handleProductCashbackChange = (event: ChangeEvent<HTMLInputElement>) => {
		setProductCashback(event.target.value);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData();

		if (productType === 'gift-card') {
			formData.append('price', `${productPriceOne}, ${productPriceTwo}, ${productPriceThree}`);
		} else {
			formData.append('price', productPrice);
		}

		if (productImage) {
			formData.append('image', productImage);
		}

		formData.append('dateAdded', dateAdded.toString());
		formData.append('name', productName);
		formData.append('type', productType);
		formData.append('category', productCategory);
		formData.append('cashback', productCashback);
		formData.append('description', productDescription);

		const response = await fetch('/api/add/product', {
			method: 'POST',
			body: formData,
		});

		if (response.status === 200) {
			if (productCategory === category) {
				router.reload();
			} else {
				const category = productCategory;
				router.push({ pathname: '../../products', query: { category } });
				handleShowAddProduct();
			}
		}
	};

	return (
		<>
			{type === 'icon' ? (
				<MdOutlineAdd onClick={handleShowAddProduct} className={classNames(styles.button, styles.iconButton)} />
			) : (
				<button onClick={handleShowAddProduct} className={styles.button}>
					{'Añade un nuevo producto'}
				</button>
			)}
			{showAddProducts ? (
				<section className={styles.addProduct}>
					<div className={styles.background} />
					<form onSubmit={handleSubmit} className={styles.addProductCartel}>
						<h2>{'Añade un producto'}</h2>
						<Image
							className={styles.styledImage}
							src={productImagePreview ? productImagePreview : '/img/placeholder-1200x600.png'}
							alt={'Vista previa'}
							width={1000}
							height={1000}
							priority={true}
						/>
						<div className={styles.labelInputFile}>
							<label>{'Añade una imágen a la publicación'}</label>
							<h5>{'Preferentemente 1200x600'}</h5>
							<input type="file" accept=".png,.jpeg,.jpg,.gif" required={true} onChange={handleFileChange} />
						</div>
						<div className={styles.labelInput}>
							<label>{'Escriba el nombre de la publicación'}</label>
							<input type="text" required={true} value={productName} onChange={handleProductNameChange} />
						</div>
						<div className={styles.labelInput}>
							<label>{'Escriba la descripción de la publicación'}</label>
							<input type="text" required={true} value={productDescription} onChange={handleProductDescriptionChange} />
						</div>
						<div className={styles.typeCategory}>
							<div className={styles.labelInput}>
								<label>{'Tipo'}</label>
								<select defaultValue="product" required={true} onChange={handleProductTypeChange}>
									<option value="product">{'Producto normal'}</option>
									<option value="gift-card">{'Tarjeta de regalo'}</option>
								</select>
							</div>
							<div className={styles.labelInput}>
								<label>{'Categoría'}</label>
								<select required={true} defaultValue={category} onChange={handleProductCategoryChange}>
									<option value="cinemex">{'Cinemex'}</option>
									<option value="cinepolis">{'Cinepolis'}</option>
									<option value="entertainment">{'Entretenimiento'}</option>
									<option value="food">{'Comida'}</option>
									<option value="games">{'Juegos'}</option>
								</select>
							</div>
						</div>

						{productType === 'product' ? (
							<div className={styles.labelInput}>
								<label>{'Precio'}</label>
								<input type="number" required={true} min="1" value={productPrice} onChange={handleProductPriceChange} />
							</div>
						) : (
							<div className={styles.labelInput}>
								<label>{'Precios fijos'}</label>
								<div className={styles.inputs}>
									<input
										type="number"
										max="10000"
										required={true}
										value={productPriceOne}
										onChange={handleProductPriceOneChange}
									/>
									<input
										type="number"
										max="10000"
										required={true}
										value={productPriceTwo}
										onChange={handleProductPriceTwoChange}
									/>
									<input
										type="number"
										max="10000"
										required={true}
										value={productPriceThree}
										onChange={handleProductPriceThreeChange}
									/>
								</div>
							</div>
						)}
						<div className={styles.labelInput}>
							<label>{'Cashback'}</label>
							<div className={styles.cashback}>
								<input
									type="number"
									max="100"
									required={true}
									value={productCashback}
									onChange={handleProductCashbackChange}
								/>
								<h3>{'%'}</h3>
							</div>
						</div>
						<div className={styles.buttons}>
							<button type="submit">{'Guardar'}</button>
							<button type="button" onClick={handleShowAddProduct}>
								{'Cancelar'}
							</button>
						</div>
					</form>
				</section>
			) : null}
		</>
	);
}
