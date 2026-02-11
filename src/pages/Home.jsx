import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWs } from '../contexts/WsContext';
import { updateStatus as apiUpdateStatus } from '../api/me';
import { getTickets, takeTicket } from '../api/tickets';
import styles from './Home.module.css';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('onlyhelper_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const ROLE_LABEL = { admin: 'Administrador', attendant: 'Atendente', user: 'Colaborador' };
const STATUS_OPTIONS = [
  { value: 'available', label: 'Disponível' },
  { value: 'busy', label: 'Ocupado' },
  { value: 'away', label: 'Ausente' },
];
const MAX_LIST = 5;

export default function Home() {
  const user = getStoredUser();
  const { ticketsUpdateTrigger } = useWs();
  const [status, setStatus] = useState(user?.status || 'available');
  const [ticketsInProgress, setTicketsInProgress] = useState([]);
  const [ticketsWaiting, setTicketsWaiting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [takingId, setTakingId] = useState(null);

  useEffect(() => {
    if (user?.status) setStatus(user.status);
  }, [user?.status]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([
      getTickets({ status: 'in_progress', assigned_to: 'me' }),
      getTickets({ status: 'waiting' }),
    ])
      .then(([inProgressRes, waitingRes]) => {
        if (cancelled) return;
        setTicketsInProgress(inProgressRes.tickets || []);
        setTicketsWaiting(waitingRes.tickets || []);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Erro ao carregar');
          setTicketsInProgress([]);
          setTicketsWaiting([]);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [ticketsUpdateTrigger]);

  async function handleStatusChange(value) {
    setStatus(value);
    try {
      const updated = await apiUpdateStatus(value);
      if (updated?.status) localStorage.setItem('onlyhelper_user', JSON.stringify({ ...user, status: updated.status }));
    } catch (_) {}
  }

  async function handleTake(id) {
    setTakingId(id);
    setError('');
    try {
      await takeTicket(id);
      setTicketsWaiting((prev) => prev.filter((t) => t.id !== id));
      getTickets({ status: 'in_progress', assigned_to: 'me' })
        .then((data) => setTicketsInProgress(data.tickets || []))
        .catch(() => {});
    } catch (err) {
      setError(err.message || 'Erro ao assumir');
    } finally {
      setTakingId(null);
    }
  }

  const roleLabel = user?.role ? ROLE_LABEL[user.role] || user.role : null;
  const inProgressList = ticketsInProgress.slice(0, MAX_LIST);
  const waitingList = ticketsWaiting.slice(0, MAX_LIST);

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.dashboardHeader}>
          <div className={styles.welcome}>
            <h1 className={styles.title}>Olá, {user?.name || 'usuário'}</h1>
            {roleLabel && <span className={styles.role}>{roleLabel}</span>}
          </div>
          <section className={styles.statusSection}>
            <span className={styles.statusLabel}>Status:</span>
            <div className={styles.statusOptions}>
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleStatusChange(opt.value)}
                  className={status === opt.value ? styles.statusActive : styles.statusBtn}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>
        </header>

        {error && <div className={styles.error}>{error}</div>}

        <section className={styles.cardsSection}>
          <Link to="/atendimentos" className={styles.cardLink}>
            <div className={styles.card}>
              <span className={styles.cardValue}>{loading ? '—' : ticketsInProgress.length}</span>
              <span className={styles.cardLabel}>Em atendimento</span>
            </div>
          </Link>
          <Link to="/fila" className={styles.cardLink}>
            <div className={styles.card}>
              <span className={styles.cardValue}>{loading ? '—' : ticketsWaiting.length}</span>
              <span className={styles.cardLabel}>Na fila</span>
            </div>
          </Link>
        </section>

        <div className={styles.dashboardGrid}>
          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>Meus atendimentos</h2>
              <Link to="/atendimentos" className={styles.panelLink}>Ver todos</Link>
            </div>
            <div className={styles.panelBody}>
              {loading ? (
                <p className={styles.panelEmpty}>Carregando…</p>
              ) : inProgressList.length === 0 ? (
                <p className={styles.panelEmpty}>Nenhum atendimento em andamento.</p>
              ) : (
                <ul className={styles.ticketList}>
                  {inProgressList.map((t) => (
                    <li key={t.id} className={styles.ticketItem}>
                      <span className={styles.ticketId}>#{t.id.slice(0, 8)}</span>
                      <span className={styles.ticketVisitor}>{t.visitorName || 'Visitante'}</span>
                      <Link to={`/atendimentos/${t.id}`} className={styles.ticketAction}>Abrir chat</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>Fila de espera</h2>
              <Link to="/fila" className={styles.panelLink}>Ver fila</Link>
            </div>
            <div className={styles.panelBody}>
              {loading ? (
                <p className={styles.panelEmpty}>Carregando…</p>
              ) : waitingList.length === 0 ? (
                <p className={styles.panelEmpty}>Ninguém na fila no momento.</p>
              ) : (
                <ul className={styles.ticketList}>
                  {waitingList.map((t, index) => (
                    <li key={t.id} className={styles.ticketItem}>
                      <span className={styles.ticketPos}>{index + 1}º</span>
                      <span className={styles.ticketId}>#{t.id.slice(0, 8)}</span>
                      <span className={styles.ticketVisitor}>{t.visitorName || 'Visitante'}</span>
                      <button
                        type="button"
                        className={styles.takeBtn}
                        onClick={() => handleTake(t.id)}
                        disabled={takingId === t.id}
                      >
                        {takingId === t.id ? '…' : 'Assumir'}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        <p className={styles.contextText}>
          Os visitantes acionam o suporte pelo botão do embed. Aqui você gerencia a fila e os atendimentos em tempo real.
        </p>
      </div>
    </div>
  );
}
