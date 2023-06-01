import { useRouter } from 'next/router';
import { MdDelete } from 'react-icons/md';
import { GetCurrentUserData } from 'src/hooks/GetDBData';
import { useState, ChangeEvent, FormEvent } from 'react';

import Image from 'next/image';

import { Button } from 'src/components/shared';

import styles from './styles/contract.module.css';

interface ContractProps {
	id: number;
	name: string;
	description: string;
	image: string;
	service: string;
	cashback: number;
	sessionAuth: string;
}

export default function Contract(props: ContractProps) {
	const { id, name, description, image, service, cashback, sessionAuth } = props;

	const router = useRouter();
	const currentTime = Date.now();
	const userData = GetCurrentUserData({ sessionAuth });

	const [contractAmountValue, setContractAmountValue] = useState<string>('');
	const [contractNumberValue, setContractNumberValue] = useState<string>('');

	const handleContractAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
		setContractAmountValue(event.target.value);
	};

	const handleContractNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
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

		setContractNumberValue(formattedNumber);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		let totalCashback: number = 0;
		const formData = new FormData();
		const cashbackTo100 = Number(cashback) / 100;

		formData.append('sessionAuth', sessionAuth);
		formData.append('dateAdded', currentTime.toString());
		formData.append('product', name);
		formData.append('quantity', '1');

		totalCashback = Number(contractAmountValue) * cashbackTo100;

		formData.append('price', contractAmountValue);
		formData.append('cashback', totalCashback.toString());

		const response = await fetch('/api/add/product-to-cart', {
			method: 'POST',
			body: formData,
		});

		if (response.status === 200) {
			router.reload();
		}
	};

	const handleDeleteContract = async () => {
		try {
			const response = await fetch('/api/delete/contract', {
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
			<form onSubmit={handleSubmit} className={styles.form}>
				<section className={styles.info}>
					<div className={styles.imageButton}>
						<Image className={styles.image} src={image} alt={name} width={300} height={600} priority={true} />
						{userData && userData.admin ? <MdDelete className={styles.button} onClick={handleDeleteContract} /> : null}
					</div>
					<h2>{name}</h2>
					<h4>{description}</h4>
				</section>
				<section className={styles.inputs}>
					<div className={styles.labelInput}>
						<label>{'Monto'}</label>
						<div className={styles.input}>
							<label>{'MX$'}</label>
							<input
								type="number"
								min={1}
								placeholder={'500'}
								required={true}
								value={contractAmountValue}
								onChange={handleContractAmountChange}
							/>
						</div>
					</div>
					<div className={styles.labelInput}>
						<label>{'Número de contrato'}</label>
						<input
							type="tel"
							pattern="[0-9+\-\s]*"
							minLength={16}
							required={true}
							placeholder={'+11 111 111-1111'}
							value={contractNumberValue}
							onChange={handleContractNumberChange}
						/>
					</div>
				</section>
				<Button label={'Pagar'} type={'submit'} />
			</form>
		</>
	);
}
