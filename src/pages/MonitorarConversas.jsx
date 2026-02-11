import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWs } from '../contexts/WsContext';
import { getTickets, takeTicket } from '../api/tickets';
import styles from './MonitorarConversas.module.css';

export default function MonitorarConversas() {
  const { ticketsUpdateTrigger } = useWs();
  const [waiting, setWaiting] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [takingId, setTakingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([
      getTickets({ status: 'waiting' }),
      getTickets({ status: 'in_progress' }),
    ])
      .then(([waitRes, progRes]) => {
        if (cancelled) return;
        setWaiting(waitRes.tickets || []);
        setInProgress(progRes.tickets || []);
      })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [ticketsUpdateTrigger]);

  async function handleTake(id) {
    setTakingId(id);
    setError('');
    try {
      await takeTicket(id);
      setWaiting((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setTakingId(null);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <h1 className={styles.title}>Monitorar conversas</h1>
        <p className={styles.subtitle}>
          Visualize a fila e todos os atendimentos em andamento. Você pode assumir tickets da fila e enviar mensagens em qualquer conversa.
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.listContainer}>
          {loading ? (
            <div className={styles.emptyState}>Carregando…</div>
          ) : waiting.length === 0 && inProgress.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhum ticket na fila nem em atendimento no momento.</p>
            </div>
          ) : (
            <>
              {waiting.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Fila de espera</h2>
                  <ul className={styles.list}>
                    {waiting.map((t, index) => (
                      <li key={t.id} className={styles.item}>
                        <div className={styles.itemMain}>
                          <span className={styles.badge}>Fila</span>
                          <span className={styles.position}>{index + 1}º</span>
                          <span className={styles.itemId}>#{t.id.slice(0, 8)}</span>
                          <span className={styles.itemVisitor}>{t.visitorName || 'Visitante'}</span>
                          <span className={styles.itemDate}>{new Date(t.createdAt).toLocaleString('pt-BR')}</span>
                        </div>
                        <div className={styles.itemActions}>
                          <Link to={`/atendimentos/${t.id}`} state={{ fromMonitor: true }} className={styles.chatBtn}>
                            Abrir chat
                          </Link>
                          <button
                            type="button"
                            className={styles.takeBtn}
                            onClick={() => handleTake(t.id)}
                            disabled={takingId === t.id}
                          >
                            {takingId === t.id ? 'Assumindo…' : 'Assumir'}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {inProgress.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Em atendimento</h2>
                  <ul className={styles.list}>
                    {inProgress.map((t) => (
                      <li key={t.id} className={styles.item}>
                        <div className={styles.itemMain}>
                          <span className={styles.badgeProgress}>Em andamento</span>
                          <span className={styles.itemId}>#{t.id.slice(0, 8)}</span>
                          <span className={styles.itemVisitor}>{t.visitorName || 'Visitante'}</span>
                          <span className={styles.itemDate}>{new Date(t.createdAt).toLocaleString('pt-BR')}</span>
                        </div>
                        <div className={styles.itemActions}>
                          <Link to={`/atendimentos/${t.id}`} state={{ fromMonitor: true }} className={styles.chatBtn}>
                            Abrir chat
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
