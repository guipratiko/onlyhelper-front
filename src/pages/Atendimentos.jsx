import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWs } from '../contexts/WsContext';
import { getTickets, closeTicket } from '../api/tickets';
import styles from './Atendimentos.module.css';

export default function Atendimentos() {
  const { ticketsUpdateTrigger } = useWs();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [closingId, setClosingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    getTickets({ status: 'in_progress', assigned_to: 'me' })
      .then((data) => { if (!cancelled) setTickets(data.tickets || []); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [ticketsUpdateTrigger]);

  async function handleClose(id) {
    setClosingId(id);
    setError('');
    try {
      await closeTicket(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setClosingId(null);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <h1 className={styles.title}>Atendimentos</h1>
        <p className={styles.subtitle}>
          Conversas que você está atendendo. Atualização em tempo real via WebSocket.
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.listContainer}>
          {loading ? (
            <div className={styles.emptyState}>Carregando…</div>
          ) : tickets.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhum atendimento em andamento.</p>
              <p className={styles.emptyHint}>
                Quando um ticket for atribuído a você, ele aparecerá aqui automaticamente.
              </p>
            </div>
          ) : (
            <ul className={styles.list}>
              {tickets.map((t) => (
                <li key={t.id} className={styles.item}>
                  <div className={styles.itemMain}>
                    <span className={styles.itemId}>#{t.id.slice(0, 8)}</span>
                    <span className={styles.itemVisitor}>{t.visitorName || 'Visitante'}</span>
                    <span className={styles.itemDate}>{new Date(t.createdAt).toLocaleString('pt-BR')}</span>
                  </div>
                  <div className={styles.itemActions}>
                    <Link to={`/atendimentos/${t.id}`} className={styles.chatBtn}>Abrir chat</Link>
                    <button
                      type="button"
                      className={styles.closeBtn}
                      onClick={() => handleClose(t.id)}
                      disabled={closingId === t.id}
                    >
                      {closingId === t.id ? 'Fechando…' : 'Encerrar'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
