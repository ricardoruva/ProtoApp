import { useState } from 'react';
import { useRouter } from 'next/router';
import { MdDelete, MdKeyboardDoubleArrowUp } from 'react-icons/md';

import * as GetDBData from 'src/hooks/GetDBData';
import * as StringUtilities from 'src/utils/StringUtilities';

import Image from 'next/image';
import classNames from 'classnames';

import EditUserData from './EditUserData/EditUserData';
import DeleteUser from './DeleteUser';

import styles from './styles/usersdata.module.css';

export default function UsersData({ sessionAuth }: { sessionAuth: string }) {
	const router = useRouter();
	const usersData = GetDBData.GetAllUsersData();

	const [messageStatus, setMessageStatus] = useState<boolean>(false);
	const [userSessionAuth, setUserSessionAuth] = useState<string>('');

	const handleChangeMessageStatus = () => {
		setMessageStatus(!messageStatus);
		setUserSessionAuth('');
	};

	const users = usersData.map((currentUser) => {
		const promoteUser = async () => {
			const response = await fetch('/api/promote/user', {
				method: 'POST',
				body: JSON.stringify({ id: currentUser.id }),
				headers: { 'Content-Type': 'application/json' },
			});

			if (response.status === 200) {
				router.reload();
			}
		};

		const handleChangeMessageStatus = () => {
			setMessageStatus(!messageStatus);
			setUserSessionAuth(currentUser.sessionAuth);
		};

		return (
			<div key={currentUser.id} className={styles.user}>
				{currentUser.sessionAuth !== sessionAuth && currentUser.admin !== 1 ? (
					<div className={styles.userInfo}>
						{currentUser.picture ? (
							<Image
								className={styles.profilePicture}
								src={currentUser.picture}
								alt={currentUser.name}
								width={200}
								height={200}
								priority={true}
							/>
						) : (
							<h2 className={styles.noProfilePicture}>
								{StringUtilities.wordsToAcronym({
									text: currentUser.name,
								})}
							</h2>
						)}
						<div className={styles.userEmail}>
							<h3>
								{StringUtilities.wordsToCapitalLetter({
									text: currentUser.name,
								})}
							</h3>
							<h5>{currentUser.email}</h5>
						</div>
					</div>
				) : (
					<div className={classNames(styles.userInfo, styles.userActive)}>
						{currentUser?.picture ? (
							<Image
								className={styles.profilePicture}
								src={currentUser.picture}
								alt={currentUser.name}
								width={200}
								height={200}
								priority={true}
							/>
						) : (
							<h2 className={styles.noProfilePicture}>
								{StringUtilities.wordsToAcronym({
									text: currentUser.name,
								})}
							</h2>
						)}
						<div className={styles.userEmail}>
							<h3>
								{StringUtilities.wordsToCapitalLetter({
									text: currentUser.name,
								})}
							</h3>
							<h5>{currentUser.email}</h5>
						</div>
					</div>
				)}
				{currentUser.sessionAuth !== sessionAuth ? (
					currentUser.admin !== 1 ? (
						<div className={styles.userButtons}>
							<EditUserData
								id={currentUser.id}
								email={currentUser.email}
								password={currentUser.password}
								username={currentUser.name}
								birthdate={currentUser.birthdate}
								profilePicture={currentUser.picture}
								windowTitle={`Cambiando la información de ${StringUtilities.wordsToCapitalLetter({
									text: currentUser.name,
								})}`}
							/>
							<MdKeyboardDoubleArrowUp onClick={promoteUser} className={styles.button} />
							<MdDelete onClick={handleChangeMessageStatus} className={styles.button} />
						</div>
					) : null
				) : null}
			</div>
		);
	});

	return (
		<>
			{messageStatus && <DeleteUser sessionAuth={userSessionAuth} closeMessage={handleChangeMessageStatus} />}

			<section className={styles.usersInfoSection}>
				<h3 className={styles.sectionTitle}>{'Administración de cuentas'}</h3>
				<div className={styles.users}>{users}</div>
			</section>
		</>
	);
}
