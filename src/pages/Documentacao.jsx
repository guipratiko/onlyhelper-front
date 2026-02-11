import { Link } from 'react-router-dom';
import styles from './LegalPage.module.css';

export default function Documentacao() {
  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <div className={styles.barInner}>
          <Link to="/" className={styles.backLink}>← Voltar ao início</Link>
        </div>
      </header>
      <div className={styles.inner}>
        <h1 className={styles.title}>Documentação</h1>
        <p className={styles.updated}>Plataforma de comunicação multicanal.</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Visão geral</h2>
          <p>
            Esta documentação descreve o uso da plataforma OnlyHelper para gestão de atendimentos,
            fila de tickets e comunicação com clientes.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Acesso e perfis</h2>
          <p>
            Os usuários podem ter perfis de Administrador, Atendente ou Colaborador. O Administrador
            gerencia assuntos, colaboradores e configurações. Atendentes atendem tickets da fila.
            Colaboradores podem abrir e acompanhar seus próprios atendimentos.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Widget e atendimentos</h2>
          <p>
            O widget pode ser incorporado em outros sites para que visitantes iniciem conversas.
            Cada atendimento gera um ticket; o histórico fica disponível em Atendimentos e no chat.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Embed</h2>
          <p>
            O embed é um script que exibe um botão de suporte no canto inferior direito da página.
            Ao clicar, o visitante abre o chat em um painel e entra na fila de atendimento.
          </p>
          <p>
            O script usa o atributo <code>data-api</code> para saber a URL da sua instância OnlyHelper
            (onde o frontend está hospedado). Se não informar, ele tenta usar a origem do próprio script.
          </p>
          <span className={styles.codeLabel}>Código do embed (substitua pela URL da sua instalação):</span>
          <div className={styles.codeWrap}>
            <pre className={styles.code}>{`<script src="https://SEU-DOMINIO.com/embed.js" data-api="https://SEU-DOMINIO.com"></script>`}</pre>
          </div>
          <p>
            Coloque este <code>&lt;script&gt;</code> antes do <code>&lt;/body&gt;</code> em qualquer página HTML
            onde desejar o botão de suporte. O ícone e o painel do chat serão carregados automaticamente.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Manual de instalação</h2>
          <ol>
            <li>
              <strong>Obtenha a URL da sua instalação</strong> — É o endereço onde o OnlyHelper está rodando
              (ex.: <code>https://atendimento.seudominio.com</code> ou <code>https://onlyhelper.seudominio.com</code>).
              Não inclua barra no final.
            </li>
            <li>
              <strong>Copie o código do embed</strong> — Use o trecho da seção “Embed” acima, trocando
              <code>https://SEU-DOMINIO.com</code> pela URL real da sua instalação (em <code>src</code> e em <code>data-api</code>).
            </li>
            <li>
              <strong>Cole no seu site</strong> — Abra o HTML da página (ou o template do seu CMS) e cole o
              <code>&lt;script&gt;</code> logo antes do <code>&lt;/body&gt;</code>, para o botão carregar ao final da página.
            </li>
            <li>
              <strong>Publique e teste</strong> — Após publicar, abra a página no navegador. Você deve ver o botão
              de suporte no canto inferior direito. Clique para abrir o chat e conferir se a fila e os atendimentos
              aparecem no painel OnlyHelper.
            </li>
          </ol>
          <p>
            Em ambiente de desenvolvimento local, use a URL do frontend (ex.: <code>http://localhost:3000</code>) em
            <code>data-api</code> e em <code>src</code> para testar. Em produção, use sempre HTTPS.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Suporte</h2>
          <p>
            Para dúvidas técnicas ou comerciais: Tel. +55 62 99355-7070 | OnlyHelper é desenvolvido por OnlyFlow (Facebook e Instagram: OnlyFlow).
          </p>
        </section>
      </div>
    </div>
  );
}
