import { useState, useEffect } from 'react';
import { MdDashboard, MdOutlineMenu } from 'react-icons/md';

import * as GetDBData from 'src/hooks/GetDBData';
import * as StringUtilities from 'src/utils/StringUtilities';
import * as WindowUtilities from 'src/utils/WindowUtilities';

import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';

import Cart from './Cart/Cart';
import HeaderOffline from './header.offline';

import styles from './styles/header.module.css';
import Menu from './Menu/Menu';

export default function Header({ session, sessionAuth }: { session: boolean; sessionAuth: string }) {
	const { width } = WindowUtilities.useWindowDimensions();

	const [windowWidth, setWindowWidth] = useState<number>(0);
	const [menuStatus, setMenuStatus] = useState<boolean>(false);

	useEffect(() => {
		setWindowWidth(width);
	}, [width]);

	const handleChangeMenuStatus = () => {
		setMenuStatus(!menuStatus);
	};

	if (!session) {
		return <HeaderOffline />;
	}

	let userData = GetDBData.GetCurrentUserData({ sessionAuth });

	return (
		<>
			<header className={styles.header}>
				<section className={styles.headerContainer}>
					<h2>Proyecto de Residencias</h2>
					<div className={styles.headerButtonsContainer}>
						<Link className={styles.mdDashBoard} href={{ pathname: '../../' }}>
							<MdDashboard className={styles.icon} />
							<h5>{'Home'}</h5>
						</Link>
						<Cart session={session} sessionAuth={sessionAuth} />
						{windowWidth >= 1367 ? (
							<button
								onClick={handleChangeMenuStatus}
								className={classNames(styles.isLoginMenu, menuStatus ? styles.loginMenuActive : null)}
							>
								{userData?.picture ? (
									<Image
										className={styles.image}
										src={userData.picture}
										alt={`${userData.name} profile picture`}
										width={200}
										height={200}
										priority={true}
									/>
								) : (
									<h4 className={styles.noImage}>
										{StringUtilities.wordsToAcronym({ text: userData ? userData.name : '' })}
									</h4>
								)}
								<div className={styles.info}>
									<h4>{'¡Hola!'}</h4>
									<h5>
										{StringUtilities.wordsToCapitalLetter({
											text: StringUtilities.firstWord({ text: userData ? userData.name : '' }),
										})}
									</h5>
								</div>
							</button>
						) : (
							<button
								onClick={handleChangeMenuStatus}
								className={classNames(styles.buttonMenu, menuStatus ? styles.buttonMenuActive : null)}
							>
								<MdOutlineMenu className={styles.outlineMenu} />
								<h5>{'Menu'}</h5>
							</button>
						)}
					</div>
				</section>
			</header>
			<section className={classNames(styles.sectionMenu, menuStatus ? styles.showSectionMenu : null)}>
				<div className={styles.menu}>
					<Menu username={userData ? userData.name : ''} profilePicture={userData?.picture} />
				</div>
			</section>
		</>
	);
}
