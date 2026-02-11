import { Link } from 'react-router-dom';
import styles from './MenuHeader.module.css';

/**
 * MenuHeader — cabeçalho com logo, itens de menu e área do usuário.
 *
 * Campos úteis (props):
 * - logoSrc: string (caminho da imagem do logo)
 * - logoAlt: string (texto alternativo do logo)
 * - logoLink: string (rota/URL ao clicar no logo, ex: "/")
 * - menuItems: array de { label, to, onClick? } (itens do menu)
 * - user: { name, email?, avatarUrl? } (dados do usuário logado)
 * - onLogout: função () => void (callback ao clicar em Sair)
 * - showUser: boolean (exibir nome/avatar do usuário)
 * - showLogout: boolean (exibir botão Sair)
 * - className: string (classe CSS adicional no container)
 * - children: node (conteúdo extra à direita, antes do usuário/logout)
 */
export default function MenuHeader({
  logoSrc = '/Onlyhelper.png',
  logoAlt = 'OnlyHelper',
  logoLink = '/',
  menuItems = [],
  user = null,
  onLogout,
  showUser = true,
  showLogout = true,
  className = '',
  children,
}) {
  return (
    <header className={`${styles.header} ${className}`.trim()}>
      <Link to={logoLink} className={styles.logoWrap}>
        <img src={logoSrc} alt={logoAlt} className={styles.logo} />
      </Link>

      {menuItems?.length > 0 && (
        <nav className={styles.nav}>
          {menuItems.map((item) =>
            item.to ? (
              <Link key={item.label} to={item.to} className={styles.navLink}>
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className={styles.navLink}
              >
                {item.label}
              </button>
            )
          )}
        </nav>
      )}

      <div className={styles.right}>
        {children}
        {showUser && user?.name && (
          <span className={styles.userName}>{user.name}</span>
        )}
        {showLogout && onLogout && (
          <button type="button" onClick={onLogout} className={styles.logout}>
            Sair
          </button>
        )}
      </div>
    </header>
  );
}
