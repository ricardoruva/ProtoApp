import { FaInstagramSquare, FaFacebookSquare, FaTwitterSquare } from 'react-icons/fa';
import { MdMail } from 'react-icons/md';

import Link from "next/link";
import classNames from "classnames";

import styles from './styles/footer.module.css';

export default function Footer() {
  return <>
    <footer className={styles.footer}>
      <div className={styles.sectionsFooter}>
        <div className={styles.sectionFooter}>
          <h5>{'Síguenos en'}</h5>
          <div className={styles.icons}>
            <Link className={styles.linkIcon} href={{ pathname: './' }}>
              <FaInstagramSquare className={styles.icon} />
            </Link>
            <Link className={styles.linkIcon} href={{ pathname: './' }}>
              <FaFacebookSquare className={styles.icon} />
            </Link>
            <Link className={styles.linkIcon} href={{ pathname: './' }}>
              <FaTwitterSquare className={styles.icon} />
            </Link>
          </div>
        </div>
        <div className={classNames(styles.sectionFooter, styles.border)}>
          <h5>{'Información legal'}</h5>
          <div className={styles.links}>
            <Link className={styles.link} href={{ pathname: './' }} >{'Aviso de privacidad'}</Link>
            <Link className={styles.link} href={{ pathname: './' }} >{'Términos y condiciones'}</Link>
          </div>
        </div>
        <div className={styles.sectionFooter}>
          <h5>{'Contacto'}</h5>
          <Link className={styles.link} href={{ pathname: 'mailto:contacto@proyectoderesidencias.com.mx' }}>
            <MdMail className={styles.icon} />
            <h5>{'contacto@proyectoderesidencias.com.mx'}</h5>
          </Link>
        </div>
      </div>
      <h5>{'2023 Proyecto de Residencias. Todos los derechos reservados.'}</h5>
    </footer>
  </>
}
