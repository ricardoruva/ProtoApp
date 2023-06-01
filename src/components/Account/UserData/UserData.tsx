import * as GetDBData from 'src/hooks/GetDBData';
import * as StringUtilities from 'src/utils/StringUtilities';

import Image from 'next/image';

import EditUserData from '../UsersData/EditUserData/EditUserData';

import styles from './styles/userdata.module.css';

export default function UserData({ sessionAuth }: { sessionAuth: string }) {
	const userData = GetDBData.GetCurrentUserData({ sessionAuth });

	return (
		<>
			<section className={styles.userDataSection}>
				<div className={styles.profilePictureUsernameEdit}>
					<div className={styles.profilePictureUsername}>
						{userData?.picture ? (
							<Image
								className={styles.profilePicture}
								src={userData.picture}
								alt={userData.name}
								width={200}
								height={200}
								priority={true}
							/>
						) : (
							<h2 className={styles.noProfilePicture}>
								{StringUtilities.wordsToAcronym({ text: `${userData?.name}` })}
							</h2>
						)}
						<h2 className={styles.username}>{StringUtilities.wordsToCapitalLetter({ text: `${userData?.name}` })}</h2>
					</div>
					{userData ? (
						<EditUserData
							id={userData.id}
							email={userData.email}
							password={userData.password}
							username={userData.name}
							birthdate={userData.birthdate}
							profilePicture={userData.picture}
							windowTitle={'Cambia tu información'}
						/>
					) : null}
				</div>
				<div className={styles.otherInformation}>
					<h3>{`Fecha de nacimiento: ${userData?.birthdate}`}</h3>
					<h3>{`Correo electrónico: ${userData?.email}`}</h3>
					{userData?.admin ? <h3>{'Pertenece a la administración de esta página'}</h3> : null}
				</div>
			</section>
		</>
	);
}
