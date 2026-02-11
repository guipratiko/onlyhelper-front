import { Link } from 'react-router-dom';
import styles from './LegalPage.module.css';

export default function Privacidade() {
  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <div className={styles.barInner}>
          <Link to="/" className={styles.backLink}>← Voltar ao início</Link>
        </div>
      </header>
      <div className={styles.inner}>
        <h1 className={styles.title}>Política de Privacidade</h1>
        <p className={styles.updated}>Última atualização: fevereiro de 2026.</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Informações que coletamos</h2>
          <p>
            Coletamos informações que você nos fornece diretamente (nome, e-mail, dados de uso da plataforma)
            e dados gerados automaticamente (logs de acesso, endereço IP) para operação e segurança do serviço.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Uso das informações</h2>
          <p>
            Utilizamos as informações para prestar e melhorar nossos serviços, atendimento ao cliente,
            comunicações necessárias e cumprimento de obrigações legais.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Compartilhamento</h2>
          <p>
            Não vendemos seus dados pessoais. Podemos compartilhar informações apenas com prestadores
            de serviços essenciais (hospedagem, suporte) ou quando exigido por lei.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Seus direitos</h2>
          <p>
            Você pode solicitar acesso, correção ou exclusão dos seus dados pessoais, nos termos da LGPD,
            entrando em contato conosco pelo e-mail ou telefone indicados no site.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Contato</h2>
          <p>
            Dúvidas sobre esta política: Tel. +55 62 99355-7070 | CNPJ: 64.494.403/0001-17.
          </p>
        </section>
      </div>
    </div>
  );
}
