import { MdOutlineAdd } from 'react-icons/md';
import styles from './styles/button.module.css';

interface ButtonProps {
	label?: string;
	icon?: 'add';
	type?: 'button' | 'submit' | 'reset' | undefined;
	onClick?: () => void;
}

/**
 * Props del componente Button.
 * @typedef {{
 *    label?: string;
 *    icon?: 'add';
 *    onClick?: () => void;
 * }} ButtonProps
 */

/**
 * Componente Button.
 * @param {ButtonProps} label - Texto del Button.
 * @param {ButtonProps} icon - Icono del Button.
 * @param {ButtonProps} type - Tipo del Button.
 * @param {ButtonProps} onClick - Evento del Button.
 * @returns {JSX.Element} El componente Button.
 */

export default function Button(props: ButtonProps) {
	const { label, icon, type, onClick } = props;

	return (
		<>
			{label ? (
				<button type={type} onClick={onClick} className={styles.button}>
					{label}
				</button>
			) : icon === 'add' ? (
				<MdOutlineAdd type={type} onClick={onClick} className={styles.iconButton} />
			) : null}
		</>
	);
}
