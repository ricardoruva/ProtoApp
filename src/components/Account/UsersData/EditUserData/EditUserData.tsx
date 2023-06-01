import { MdEdit } from 'react-icons/md';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';

import Image from 'next/image';

import styles from './styles/edituserdata.module.css';

interface EditUserDataProps {
	id: number;
	email: string;
	password: string;
	username: string;
	birthdate: string;
	profilePicture: string;
	windowTitle: string;
}

export default function EditUserData(props: EditUserDataProps) {
	const { id, email, password, username, birthdate, profilePicture, windowTitle } = props;
	const router = useRouter();

	const [currentDay, setCurrentDay] = useState<number>(0);
	const [currentYear, setCurrentYear] = useState<number>(0);
	const [currentMonth, setCurrentMonth] = useState<number>(0);

	const [errorStatus, setErrorStatus] = useState<boolean>(false);
	const [windowStatus, setWindowStatus] = useState<boolean>(false);
	const [passwordStatus, setPasswordStatus] = useState<boolean>(false);

	const [handleUsername, setHandleUsername] = useState<string>('');
	const [handleBirthdate, setHandleBirthdate] = useState<string>('');
	const [handleEmail, setHandleEmail] = useState<string>('');
	const [handlePassword, setHandlePassword] = useState<string>('');
	const [handleProfilePicture, setHandleProfilePicture] = useState<File | null>(null);
	const [handleProfilePicturePreview, setHandleProfilePicturePreview] = useState<string>('');

	useEffect(() => {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();

		setCurrentYear(year);
		setCurrentMonth(month);
		setCurrentDay(day);
	}, []);

	const handleChangeWindowStatus = useCallback(() => {
		setWindowStatus((status) => !status);
		setErrorStatus(false);
		setPasswordStatus(false);
		setHandleUsername('');
		setHandleBirthdate('');
		setHandleEmail('');
		setHandlePassword('');
		setHandleProfilePicture(null);
		setHandleProfilePicturePreview('');
	}, []);

	const handleShowPassword = useCallback(() => {
		setPasswordStatus((status) => !status);
	}, []);

	const handleEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setHandleEmail(event.target.value);
	}, []);

	const handlePasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setHandlePassword(event.target.value);
	}, []);

	const handleUsernameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setHandleUsername(event.target.value);
	}, []);

	const handleBirthdateChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setHandleBirthdate(event.target.value);
	}, []);

	const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setHandleProfilePicture(event.target.files[0]);
			const file = event.target.files[0];
			const reader = new FileReader();

			reader.onloadend = () => {
				setHandleProfilePicturePreview(reader.result as string);
			};

			if (file) {
				reader.readAsDataURL(file);
			}
		}
	}, []);

	const handleSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const formData = new FormData();

			if (
				handleUsername.trim() === '' &&
				handleBirthdate.trim() === '' &&
				handleEmail.trim() === '' &&
				handlePassword.trim() === '' &&
				handleProfilePicture === null
			) {
				handleChangeWindowStatus();
				return;
			}

			try {
				if (handleEmail.trim() !== '') {
					const checking = await fetch('/api/auth/checking-repeated-data', {
						method: 'POST',
						body: JSON.stringify({ email: handleEmail }),
						headers: { 'Content-Type': 'application/json' },
					});

					if (checking.status !== 200) {
						setErrorStatus(true);
						return;
					}

					formData.append('id', id.toString());
					formData.append('oldEmail', email);

					formData.append('username', handleUsername.length === 0 ? username : handleUsername);
					formData.append('oldUsername', username);
					formData.append('birthdate', handleBirthdate.length === 0 ? birthdate : handleBirthdate);
					formData.append('email', handleEmail.length === 0 ? email : handleEmail);
					formData.append('newPassword', handlePassword.length === 0 ? password : handlePassword);
					formData.append('oldPassword', password);

					if (handleProfilePicture !== null) {
						formData.append('profilePicture', handleProfilePicture);
					} else {
						formData.append('oldProfilePicture', profilePicture);
					}

					const update = await fetch('/api/update/user', {
						method: 'POST',
						body: formData,
					});

					if (update.status === 200) {
						router.reload();
					}
				} else {
					formData.append('id', id.toString());
					formData.append('oldEmail', email);

					formData.append('username', handleUsername.length === 0 ? username : handleUsername);
					formData.append('oldUsername', username);
					formData.append('birthdate', handleBirthdate.length === 0 ? birthdate : handleBirthdate);
					formData.append('email', handleEmail.length === 0 ? email : handleEmail);
					formData.append('newPassword', handlePassword.length === 0 ? password : handlePassword);
					formData.append('oldPassword', password);

					if (handleProfilePicture !== null) {
						formData.append('profilePicture', handleProfilePicture);
					} else {
						formData.append('oldProfilePicture', profilePicture);
					}

					const update = await fetch('/api/update/user', {
						method: 'POST',
						body: formData,
					});

					if (update.status === 200) {
						router.reload();
					}
				}
			} catch (error) {
				throw error;
			}
		},
		[
			id,
			username,
			birthdate,
			email,
			password,
			profilePicture,
			handleBirthdate,
			handleEmail,
			handlePassword,
			handleProfilePicture,
			handleUsername,
			handleChangeWindowStatus,
			router,
		],
	);

	return (
		<>
			<MdEdit onClick={handleChangeWindowStatus} className={styles.button} />

			{windowStatus ? <div className={styles.background} /> : null}
			{windowStatus ? (
				<section className={styles.editUserDataSection}>
					<form onSubmit={handleSubmit} className={styles.form}>
						<div className={styles.windowTitle}>
							<h3>{windowTitle}</h3>
							<h5>{'(Deja en blanco las secciones que no quieras cambiar)'}</h5>
						</div>
						<div className={styles.labelInput}>
							<label>{'Nombre completo'}</label>
							<input type="text" value={handleUsername} minLength={1} maxLength={64} placeholder={username} onChange={handleUsernameChange} />
						</div>
						<div className={styles.labelInput}>
							<label>{'Fecha de nacimiento'}</label>
							<input
								type="date"
								min={`${currentYear - 100}-${currentMonth > 9 ? currentMonth : `0${currentMonth}`}-${
									currentDay > 9 ? currentDay : `0${currentDay}`
								}`}
								max={`${currentYear}-${currentMonth > 9 ? currentMonth : `0${currentMonth}`}-${
									currentDay > 9 ? currentDay : `0${currentDay}`
								}`}
								value={handleBirthdate}
								placeholder={birthdate}
								onChange={handleBirthdateChange}
							/>
						</div>
						<div className={styles.labelInput}>
							<div className={styles.labelEmail}>
								<label>{'Correo electrónico'}</label>
								{errorStatus ? <label>{' - '}</label> : null}
								{errorStatus ? <label className={styles.error}>{'Correo electrónico ya registrado'}</label> : null}
							</div>
							<input type="email" value={handleEmail} minLength={1} maxLength={64} placeholder={email} onChange={handleEmailChange} />
						</div>
						<div className={styles.labelInput}>
							<div className={styles.labelPassword}>
								<label>{'Contraseña - '}</label>
								<label className={styles.showPassword} onClick={handleShowPassword}>
									{passwordStatus ? 'Ocultar contraseña' : 'Mostrar contraseña'}
								</label>
							</div>
							<input
								type={passwordStatus ? 'text' : 'password'}
								value={handlePassword}
								onChange={handlePasswordChange}
							/>
						</div>
						<div className={styles.uploadImage}>
							<Image
								className={styles.profilePicture}
								src={
									handleProfilePicturePreview
										? handleProfilePicturePreview
										: profilePicture
										? profilePicture
										: '/img/placeholder-200x200.png'
								}
								alt={'Vista previa'}
								width={200}
								height={200}
								priority={true}
							/>
							<div className={styles.labelInput}>
								<label>{'Carga tu imagen de usuario'}</label>
								<h5>{'(Relación de aspecto 1:1)'}</h5>
								<input type="file" accept=".png,.jpeg,.jpg,.gif" onChange={handleFileChange} />
							</div>
						</div>
						<div className={styles.buttons}>
							<button type="submit">{'Guardar'}</button>
							<button type="button" onClick={handleChangeWindowStatus}>
								{'Cancelar'}
							</button>
						</div>
					</form>
				</section>
			) : null}
		</>
	);
}
