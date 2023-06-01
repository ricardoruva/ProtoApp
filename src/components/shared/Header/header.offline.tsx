import { useState, useEffect } from 'react';
import { MdDashboard, MdOutlineMenu } from 'react-icons/md';

import * as WindowUtilities from 'src/utils/WindowUtilities';

import Link from 'next/link';
import classNames from 'classnames';

import Menu from './Menu/Menu';
import Auth from './Auth/Auth';

import styles from './styles/header.module.css';

export default function HeaderOffline() {
	const { width } = WindowUtilities.useWindowDimensions();

	const [windowWidth, setWindowWidth] = useState<number>(0);

	const [menuStatus, setMenuStatus] = useState<boolean>(false);
	const [windowStatus, setWindowStatus] = useState<boolean>(false);

	useEffect(() => {
		setWindowWidth(width);
	}, [width]);

	const handleChangeWindowStatus = () => {
		setWindowStatus(!windowStatus);
	};

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
						{windowWidth >= 1367 ? (
							<button
								onClick={handleChangeWindowStatus}
								className={classNames(styles.noLogin, windowStatus ? styles.noLoginActive : null)}
							>
								<h4>{'MI CUENTA'}</h4>
								<h5>{'Entrar'}</h5>
							</button>
						) : (
							<button
								onClick={handleChangeWindowStatus}
								className={classNames(styles.buttonMenu, windowStatus ? styles.buttonMenuActive : null)}
							>
								<MdOutlineMenu className={styles.outlineMenu} />
								<h5>{'Menu'}</h5>
							</button>
						)}
					</div>
				</section>
			</header>
			<section className={classNames(styles.loginWindow, windowStatus ? styles.openLoginWindow : null)}>
				<Auth />
			</section>
		</>
	);
}
