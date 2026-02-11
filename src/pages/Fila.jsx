import { useEffect, useState } from 'react';
import { useWs } from '../contexts/WsContext';
import { getTickets, takeTicket } from '../api/tickets';
import styles from './Fila.module.css';

export default function Fila() {
  const { ticketsUpdateTrigger } = useWs();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [takingId, setTakingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    getTickets({ status: 'waiting' })
      .then((data) => { if (!cancelled) setTickets(data.tickets || []); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [ticketsUpdateTrigger]);

  async function handleTake(id) {
    setTakingId(id);
    setError('');
    try {
      await takeTicket(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setTakingId(null);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <h1 className={styles.title}>Fila de atendimento</h1>
        <p className={styles.subtitle}>
          Visitantes aguardando atendimento. Atualização em tempo real via WebSocket.
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.listContainer}>
          {loading ? (
            <div className={styles.emptyState}>Carregando…</div>
          ) : tickets.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Ninguém na fila no momento.</p>
              <p className={styles.emptyHint}>
                Quando alguém abrir o chat pelo embed, aparecerá aqui na ordem de chegada.
              </p>
            </div>
          ) : (
            <ul className={styles.list}>
              {tickets.map((t, index) => (
                <li key={t.id} className={styles.item}>
                  <div className={styles.itemMain}>
                    <span className={styles.position}>{index + 1}º</span>
                    <span className={styles.itemId}>#{t.id.slice(0, 8)}</span>
                    <span className={styles.itemVisitor}>{t.visitorName || 'Visitante'}</span>
                    <span className={styles.itemDate}>{new Date(t.createdAt).toLocaleString('pt-BR')}</span>
                  </div>
                  <button
                    type="button"
                    className={styles.takeBtn}
                    onClick={() => handleTake(t.id)}
                    disabled={takingId === t.id}
                  >
                    {takingId === t.id ? 'Assumindo…' : 'Assumir'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
