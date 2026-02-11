import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const LEGAL_LINKS = [
  { label: 'Política de Privacidade', to: '/privacidade' },
  { label: 'Termos de Uso', to: '/termos' },
  { label: 'Documentação', to: '/documentacao' },
];

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com.br/onlyflow.tech' },
  { label: 'Instagram', href: 'https://instagram.com/onlyflow.app' },
];

const ONLYFLOW_LOGO = 'https://onlyflow.com.br/img/OnlyFlow-logo.png';

/**
 * Footer global — logo OnlyFlow (desenvolvedora), Developed by, links legais e redes sociais.
 */
export default function Footer({
  logoSrc = ONLYFLOW_LOGO,
  logoAlt = 'OnlyFlow',
  logoLink = 'https://onlyflow.com.br',
}) {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrapper}>
        <div className={styles.top}>
          <a
            href={logoLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.brand}
            aria-label={logoAlt}
          >
            <span className={styles.developedBy}>Developed by</span>
            <img src={logoSrc} alt="" className={styles.logo} />
          </a>
          <nav className={styles.legalNav} aria-label="Links legais">
            {LEGAL_LINKS.map((item) => (
              <Link key={item.label} to={item.to} className={styles.legalLink}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className={styles.social} aria-label="Redes sociais">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={item.label}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className={styles.bottom}>
          <p className={styles.copyright}>© 2026 • Todos os direitos reservados.</p>
          <p className={styles.legal}>
            CNPJ: 64.494.403/0001-17 • Tel: +55 62 99355-7070
          </p>
        </div>
      </div>
    </footer>
  );
}
