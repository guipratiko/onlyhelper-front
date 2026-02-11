import { Link } from 'react-router-dom';
import styles from './LegalPage.module.css';

export default function Termos() {
  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <div className={styles.barInner}>
          <Link to="/" className={styles.backLink}>← Voltar ao início</Link>
        </div>
      </header>
      <div className={styles.inner}>
        <h1 className={styles.title}>Termos de Uso</h1>
        <p className={styles.updated}>Última atualização: fevereiro de 2026.</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Aceitação</h2>
          <p>
            Ao acessar e utilizar esta plataforma, você concorda com estes Termos de Uso.
            Caso não concorde, não utilize o serviço.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Uso permitido</h2>
          <p>
            O uso deve ser lícito e em conformidade com a finalidade do serviço. É vedado utilizar
            a plataforma para fins ilícitos, ofensivos ou que prejudiquem terceiros ou a infraestrutura.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Conta e responsabilidade</h2>
          <p>
            Você é responsável pela confidencialidade de sua conta e por todas as atividades realizadas
            sob ela. Notifique-nos imediatamente em caso de uso não autorizado.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Propriedade intelectual</h2>
          <p>
            O conteúdo da plataforma OnlyHelper (marcas, textos, software) é de propriedade da OnlyFlow (desenvolvedora) ou de
            licenciadores. Não é permitida cópia ou uso não autorizado.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Alterações e contato</h2>
          <p>
            Podemos alterar estes termos a qualquer momento. O uso continuado após alterações
            constitui aceitação. Dúvidas: Tel. +55 62 99355-7070.
          </p>
        </section>
      </div>
    </div>
  );
}
