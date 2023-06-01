import { useRouter } from 'next/router';
import { useState, ChangeEvent, FormEvent } from 'react';

import Image from 'next/image';

import { Button } from 'src/components/shared';

import styles from './styles/addcontract.module.css';

export default function AddContract({ handleCloseCartel }: { handleCloseCartel: () => void }) {
	const router = useRouter();
	const selectedService = router.query.service ? router.query.service.toString() : '';

	const currentTime = Date.now();

	const [contractImageValue, setContractImageValue] = useState<File | null>(null);
	const [contractImagePreview, setContractImagePreview] = useState<string>('');
	const [contractNameValue, setContractNameValue] = useState<string>('');
	const [contractDescriptionValue, setContractDescriptionValue] = useState<string>('');
	const [contractCashbackValue, setContractCashbackValue] = useState<string>('');

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setContractImageValue(event.target.files[0]);
			const file = event.target.files[0];
			const reader = new FileReader();

			reader.onloadend = () => {
				setContractImagePreview(reader.result as string);
			};

			reader.readAsDataURL(file);
		} else {
			setContractImagePreview('');
			setContractImageValue(null);
		}
	};

	const handleContractNameChange = (event: ChangeEvent<HTMLInputElement>) => {
		setContractNameValue(event.target.value);
	};

	const handleContractDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
		setContractDescriptionValue(event.target.value);
	};

	const handleContractCashbackChange = (event: ChangeEvent<HTMLInputElement>) => {
		setContractCashbackValue(event.target.value);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData();

		if (contractImageValue) {
			formData.append('contractImage', contractImageValue);
		}

		formData.append('contractAdded', currentTime.toString());
		formData.append('contractName', contractNameValue);
		formData.append('contractDescription', contractDescriptionValue);
		formData.append('contractCashback', contractCashbackValue);
		formData.append('contractService', selectedService);

		try {
			const response = await fetch('/api/add/new-contract', {
				method: 'POST',
				body: formData,
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
			<div className={styles.background} />
			<section className={styles.addContract}>
				<form onSubmit={handleSubmit} className={styles.form}>
					<h2>{'Añade una publicación'}</h2>
					<Image
						className={styles.image}
						src={contractImagePreview ? contractImagePreview : '/img/placeholder-1200x600.png'}
						alt={'Vista previa'}
						width={1000}
						height={1000}
						priority={true}
					/>
					<div className={styles.labelInput}>
						<label>{'Añade una imágen a la publicación'}</label>
						<input
							type="file"
							accept=".png,.jpeg,.jpg,.gif"
							required={true}
							className={styles.file}
							onChange={handleFileChange}
						/>
					</div>
					<div className={styles.labelInput}>
						<label>{'Escriba el nombre de la publicación'}</label>
						<input type="text" required={true} value={contractNameValue} onChange={handleContractNameChange} />
					</div>
					<div className={styles.labelInput}>
						<label>{'Escriba la descripción de la publicación'}</label>
						<input
							type="text"
							required={true}
							value={contractDescriptionValue}
							onChange={handleContractDescriptionChange}
						/>
					</div>
					<div className={styles.labelInput}>
						<label>{'Cashback'}</label>
						<div className={styles.cashback}>
							<input
								type="number"
								max="100"
								required={true}
								value={contractCashbackValue}
								onChange={handleContractCashbackChange}
							/>
							<h3>{'%'}</h3>
						</div>
					</div>
					<div className={styles.buttons}>
						<Button label={'Cancelar'} type={'button'} onClick={handleCloseCartel} />
						<Button label={'Guardar'} type={'submit'} />
					</div>
				</form>
			</section>
		</>
	);
}
