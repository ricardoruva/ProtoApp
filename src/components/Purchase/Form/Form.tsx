import { useRouter } from 'next/router';
import { MdShoppingBag } from 'react-icons/md';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

import Link from 'next/link';
import classNames from 'classnames';

import * as GetDBData from 'src/hooks/GetDBData';
import * as StringUtilities from 'src/utils/StringUtilities';

import styles from './styles/form.module.css';

export default function Form({ sessionAuth }: { sessionAuth: string }) {
	const router = useRouter();
	const currentDate = Date.now();
	const userData = GetDBData.GetCurrentUserData({ sessionAuth });
	const userCart = GetDBData.GetCurrentUserCart({ sessionAuth });

	const [dateMin, setDateMin] = useState<string>('');
	const [dateAdded, setDateAdded] = useState<string>('');

	const [userPricesCart, setUserPricesCart] = useState<string>('');
	const [userProductsCart, setUserProductsCart] = useState<string>('');
	const [userQuantityCart, setUserQuantityCart] = useState<string>('');
	const [userCashback, setUserCashback] = useState<number>(0);

	const [wrongStatus, setWrongStatus] = useState<boolean>(false);
	const [wrongText, setWrongText] = useState<string>('');

	const [cardTypeValue, setCardTypeValue] = useState<string>('visa');
	const [nameCardValue, setNameCardValue] = useState<string>('');
	const [numberCardValue, setNumberCardValue] = useState<string>('');
	const [dateExpireCardValue, setDateExpireCardValue] = useState<string>('');
	const [codeCardValue, setCodeCardValue] = useState<string>('');
	const [fullNameValue, setFullNameValue] = useState<string>('');
	const [countryValue, setCountryValue] = useState<string>('');
	const [locateValue, setLocateValue] = useState<string>('');
	const [firstDirectionValue, setFirstDirectionValue] = useState<string>('');
	const [secondDirectionValue, setSecondDirectionValue] = useState<string>('');
	const [postalCodeValue, setPostalCodeValue] = useState<string>('');
	const [numberPhoneValue, setNumberPhoneValue] = useState<string>('');
	const [saveCardInfo, setSaveCardInfo] = useState<boolean>(false);

	userCart.sort((a, b) => b.dateAdded - currentDate - (a.dateAdded - currentDate));

	useEffect(() => {
		const products = userCart.map((cart) => cart.product);
		const prices = userCart.map((cart) => cart.priceSelected);
		const quantities = userCart.map((cart) => cart.quantity);
		const cashback =
			userCart.reduce((total, cart) => total + cart.cashback * 1, 0) + (userData?.cashback ? Number(userData.cashback) : 0);

		setUserCashback(cashback);
		setUserPricesCart(prices.join(', '));
		setUserProductsCart(products.join(', '));
		setUserQuantityCart(quantities.join(', '));
	}, [userData, userCart]);

	useEffect(() => {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const formattedDate = date.toLocaleDateString('en-GB');

		setDateAdded(formattedDate.replace(/\//g, '-'));
		setDateMin(`${year}-${month > 9 ? month : `0${month}`}`);
	}, []);

	useEffect(() => {
		const firstNumber = numberCardValue.slice(0, 1);
		if (Number(firstNumber) === 4) {
			setCardTypeValue('visa');
		} else if (Number(firstNumber) === 5) {
			setCardTypeValue('mastercard');
		} else if (numberCardValue.length === 0) {
			setCardTypeValue('');
		} else {
			setCardTypeValue('tarjeta inválida');
		}
	}, [numberCardValue]);

	const handleNameCard = (event: ChangeEvent<HTMLInputElement>) => {
		setNameCardValue(event.target.value);
	};

	const handleNumberCard = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.value.length < 20) {
			var inputVal = event.target.value;
			inputVal = inputVal.replace(/[^0-9]/g, '');

			if (inputVal.length > 4 && inputVal.length <= 8) {
				inputVal = inputVal.slice(0, 4) + '-' + inputVal.slice(4);
			} else if (inputVal.length > 8 && inputVal.length <= 12) {
				inputVal = inputVal.slice(0, 4) + '-' + inputVal.slice(4, 8) + '-' + inputVal.slice(8);
			} else if (inputVal.length > 12) {
				inputVal =
					inputVal.slice(0, 4) + '-' + inputVal.slice(4, 8) + '-' + inputVal.slice(8, 12) + '-' + inputVal.slice(12);
			}

			setNumberCardValue(inputVal);
		}
	};

	const handleDateExpireCard = (event: ChangeEvent<HTMLInputElement>) => {
		setDateExpireCardValue(event.target.value);
	};

	const handleCodeCard = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.value.length <= 4) {
			let inputVal = event.target.value;
			inputVal = inputVal.replace(/[^0-9]/g, '');
			setCodeCardValue(inputVal);
		}
	};

	const handleFullName = (event: ChangeEvent<HTMLInputElement>) => {
		setFullNameValue(event.target.value);
	};

	const handleCountry = (event: ChangeEvent<HTMLInputElement>) => {
		setCountryValue(event.target.value);
	};

	const handleLocate = (event: ChangeEvent<HTMLInputElement>) => {
		setLocateValue(event.target.value);
	};

	const handleFirstDirection = (event: ChangeEvent<HTMLInputElement>) => {
		setFirstDirectionValue(event.target.value);
	};

	const handleSecondDirection = (event: ChangeEvent<HTMLInputElement>) => {
		setSecondDirectionValue(event.target.value);
	};

	const handlePostalCode = (event: ChangeEvent<HTMLInputElement>) => {
		setPostalCodeValue(event.target.value);
	};

	const handleNumberPhone = (event: ChangeEvent<HTMLInputElement>) => {
		const number = event.target.value;
		const phoneNumber = number.replace(/\D/g, '');
		let formattedNumber = '';

		for (let i = 0; i < phoneNumber.length; i++) {
			if (i === 0) {
				formattedNumber += `+${phoneNumber[i]}`;
			} else if (i === 2) {
				formattedNumber += ` ${phoneNumber[i]}`;
			} else if (i === 5) {
				formattedNumber += ` ${phoneNumber[i]}`;
			} else if (i === 8) {
				formattedNumber += `-${phoneNumber[i]}`;
			} else if (i >= 12) {
				formattedNumber += '';
			} else {
				formattedNumber += phoneNumber[i];
			}
		}

		setNumberPhoneValue(formattedNumber);
	};

	const handleSaveCardInfo = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.value) {
			setSaveCardInfo(!saveCardInfo);
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (cardTypeValue === 'tarjeta inválida') {
			setWrongStatus(true);
			setWrongText('Tarjeta inválida');
			return;
		}

		const formData = new FormData();

		if (secondDirectionValue) {
			formData.append('secondDirection', secondDirectionValue);
		} else {
			formData.append('secondDirection', 'none');
		}

		formData.append('sessionAuth', sessionAuth);
		formData.append('products', userProductsCart);
		formData.append('productsPrices', userPricesCart);
		formData.append('productsQuantity', userQuantityCart);
		formData.append('date', dateAdded);
		formData.append('dateAdded', currentDate.toString());
		formData.append('cashback', userCashback.toString());
		formData.append('type', cardTypeValue);
		formData.append('holder', nameCardValue);
		formData.append('number', numberCardValue);
		formData.append('expirationDate', dateExpireCardValue);
		formData.append('securityCode', codeCardValue);
		formData.append('fullName', fullNameValue);
		formData.append('country', countryValue);
		formData.append('locality', locateValue);
		formData.append('firstDirection', firstDirectionValue);
		formData.append('postalCode', postalCodeValue);
		formData.append('phoneNumber', numberPhoneValue);
		formData.append('saveCard', saveCardInfo.toString());

		const checking = await fetch('/api/auth/checking-repeated-card-data', {
			method: 'POST',
			body: formData,
		});

		if (checking.status !== 200) {
			setWrongStatus(true);
			setWrongText('Ya existente');
			return;
		}

		const response = await fetch('/api/add/purchase', {
			method: 'POST',
			body: formData,
		});

		if (response.status === 200) {
			router.push({ pathname: '../../purchase-history' });
		}
	};

	return (
		<>
			<section className={styles.buySection}>
				<div className={styles.title}>
					<MdShoppingBag className={styles.icon} />
					<h2>{'Comprar'}</h2>
				</div>
				<form onSubmit={handleSubmit} className={styles.form}>
					<div className={styles.cardInfo}>
						<h3>{'Ingrese los datos de su tarjeta'}</h3>
						<div className={styles.labelType}>
							<label>{'Tipo de tarjeta'}</label>
							<h3>
								{StringUtilities.wordsToCapitalLetter({
									text: cardTypeValue,
								})}
							</h3>
						</div>
						<div className={styles.inputs}>
							<div className={styles.labelInput}>
								<label>{'Nombre a cargo de la tarjeta (*)'}</label>
								<input
									type="text"
									pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+"
									required={true}
									value={nameCardValue}
									onChange={handleNameCard}
								/>
							</div>
							<div className={styles.labelInput}>
								<div className={styles.numberWrong}>
									<label>{'Número de tarjeta (*)'}</label>
									<label className={classNames(wrongStatus ? null : styles.hide)}>{' - '}</label>
									<label className={classNames(styles.wrong, wrongStatus ? null : styles.hide)}>{wrongText}</label>
								</div>
								<input
									type="text"
									pattern="[0-9\-]*"
									minLength={19}
									required={true}
									value={numberCardValue}
									onChange={handleNumberCard}
								/>
							</div>
						</div>
						<div className={styles.inputs}>
							<div className={styles.labelInput}>
								<label>{'Fecha de caducidad (*)'}</label>
								<input
									type="month"
									min={dateMin}
									required={true}
									value={dateExpireCardValue}
									onChange={handleDateExpireCard}
								/>
							</div>
							<div className={styles.labelInput}>
								<label>{'Código de seguridad (*)'}</label>
								<input
									type="text"
									required={true}
									pattern="[0-9]*"
									minLength={3}
									value={codeCardValue}
									onChange={handleCodeCard}
								/>
							</div>
						</div>
					</div>
					<div className={styles.personalInfo}>
						<h3>{'Ingrese sus datos personales'}</h3>
						<div className={styles.inputs}>
							<div className={styles.labelInput}>
								<label>{'Nombre completo (*)'}</label>
								<input
									type="text"
									pattern="[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+"
									required={true}
									value={fullNameValue}
									onChange={handleFullName}
								/>
							</div>
							<div className={styles.labelInput}>
								<label>{'País (*)'}</label>
								<input
									type="text"
									pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+"
									required={true}
									value={countryValue}
									onChange={handleCountry}
								/>
							</div>
						</div>
						<div className={styles.inputs}>
							<div className={styles.labelInput}>
								<label>{'Localidad (*)'}</label>
								<input
									type="text"
									pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+"
									required={true}
									value={locateValue}
									onChange={handleLocate}
								/>
							</div>
							<div className={styles.labelInput}>
								<label>{'1ra Dirección de facturación (*)'}</label>
								<input
									type="text"
									pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s]+"
									required={true}
									value={firstDirectionValue}
									onChange={handleFirstDirection}
								/>
							</div>
						</div>
						<div className={styles.inputs}>
							<div className={styles.labelInput}>
								<label>{'2da Dirección de facturación'}</label>
								<input
									type="text"
									pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s]+"
									value={secondDirectionValue}
									onChange={handleSecondDirection}
								/>
							</div>
							<div className={styles.labelInput}>
								<label>{'Código postal (*)'}</label>
								<input
									type="text"
									pattern="[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s]+"
									required={true}
									value={postalCodeValue}
									onChange={handlePostalCode}
								/>
							</div>
						</div>
						<div className={styles.labelInput}>
							<label>{'Número de telefono (*)'}</label>
							<input
								type="tel"
								pattern="[0-9+\-\s]*"
								minLength={16}
								required={true}
								value={numberPhoneValue}
								onChange={handleNumberPhone}
							/>
						</div>
					</div>
					<h5 className={styles.note}>{'TODAS LAS ENTRADAS QUE TIENEN UN (*) SON OBLIGATORIAS'}</h5>
					<div className={styles.checkbox}>
						<input type="checkbox" onChange={handleSaveCardInfo} />
						<h4>Guardar esta información para una próxima compra</h4>
					</div>
					<div className={styles.buttons}>
						<Link className={styles.button} href={{ pathname: '../../' }}>
							Regresar
						</Link>
						<button className={styles.button} type="submit">
							Confirmar
						</button>
					</div>
				</form>
			</section>
		</>
	);
}
