import { useRouter } from 'next/router';
import { MdPowerSettingsNew, MdInfoOutline, MdOutlineListAlt } from 'react-icons/md';

import * as StringUtilities from 'src/utils/StringUtilities';

import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';

import styles from './styles/menu.module.css';

interface MenuProps {
	username: string;
	profilePicture: string | null | undefined;
}

export default function Menu({ username, profilePicture }: MenuProps) {
	const router = useRouter();

	const handleSignOut = () => {
		fetch('/api/auth/sign-out', {
			method: 'GET',
		}).then((response) => {
			if (response.status === 200) {
				router.reload();
			}
		});
	};

	return (
		<>
			<div className={classNames(styles.isLoginMenu)}>
				{profilePicture ? (
					<Image
						className={styles.image}
						src={profilePicture}
						alt={`${username} profile picture`}
						width={200}
						height={200}
						priority={true}
					/>
				) : (
					<h4 className={styles.noImage}>{StringUtilities.wordsToAcronym({ text: username })}</h4>
				)}
				<div className={styles.info}>
					<h4>{'¡Hola!'}</h4>
					<h5>{StringUtilities.wordsToCapitalLetter({ text: StringUtilities.firstWord({ text: username }) })}</h5>
				</div>
			</div>
			<Link className={styles.button} href={{ pathname: './account/' }}>
				<MdInfoOutline className={styles.icon} />
				<h4 className={styles.text}>{'Información'}</h4>
			</Link>
			<Link className={styles.button} href={{ pathname: './purchase-history/' }}>
				<MdOutlineListAlt className={styles.icon} />
				<h4 className={styles.text}>{'Mis compras'}</h4>
			</Link>
			<button onClick={handleSignOut} className={styles.button}>
				<MdPowerSettingsNew className={styles.icon} />
				<h4 className={styles.text}>{'Cerrar Sesión'}</h4>
			</button>
		</>
	);
}
