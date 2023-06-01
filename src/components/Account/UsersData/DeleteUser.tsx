import { useState } from 'react';
import { useRouter } from 'next/router';

import * as GetDBData from 'src/hooks/GetDBData';

import styles from './styles/deteleuser.module.css';

interface DeleteUserProps {
	sessionAuth: string;
	closeMessage: () => void;
}

export default function DeleteUser({ sessionAuth, closeMessage }: DeleteUserProps) {
	const router = useRouter();

	const userData = GetDBData.GetCurrentUserData({ sessionAuth });
	const userCart = GetDBData.GetCurrentUserCart({ sessionAuth });

	const deleteUser = async () => {
		const response = await fetch('/api/delete/user', {
			method: 'POST',
			body: JSON.stringify({ id: userData?.id }),
			headers: { 'Content-Type': 'application/json' },
		});

		if (response.status === 200) {
			router.reload();
		}
	};

	return (
		<>
			<div className={styles.background} />
			<section className={styles.message}>
				<div className={styles.desing}>
					<h3>{`¿Quieres eliminar al usuario ${userData?.name}?`}</h3>
					{userCart.length <= 0 ? (
						<p>{'Este usuario no tiene productos agregados al carrito'}</p>
					) : (
						<p>{`Este usuario tiene ${userCart.length} productos agregados al carrito`}</p>
					)}
					<div>
						<button onClick={closeMessage}>{'Cancelar'}</button>
						<button onClick={deleteUser}>{'Confirmar'}</button>
					</div>
				</div>
			</section>
		</>
	);
}
