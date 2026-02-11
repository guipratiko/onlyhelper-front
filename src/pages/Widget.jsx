import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTicketBySession, createTicket, getMessages, sendMessage, getSubjects } from '../api/widget';
import styles from './Widget.module.css';

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function Widget() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [attachmentDataUrl, setAttachmentDataUrl] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const sid = searchParams.get('sid');

  const showSubjectSelection = !loading && (!ticket || ticket?.status === 'closed');

  useEffect(() => {
    if (!sid) {
      const newSid = generateId();
      setSearchParams({ sid: newSid }, { replace: true });
      return;
    }
  }, [sid, setSearchParams]);

  useEffect(() => {
    if (!sid) return;
    let cancelled = false;
    async function loadTicket() {
      try {
        const existing = await getTicketBySession(sid);
        if (!cancelled) {
          if (existing) setTicket(existing);
          else setTicket(null);
        }
      } catch (err) {
        if (!cancelled) setTicket(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadTicket();
    return () => { cancelled = true; };
  }, [sid]);

  useEffect(() => {
    if (!sid || !ticket || ticket?.status === 'closed') return;
    const interval = setInterval(async () => {
      try {
        const updated = await getTicketBySession(sid);
        setTicket(updated);
      } catch (_) {}
    }, 3000);
    return () => clearInterval(interval);
  }, [sid, ticket?.id, ticket?.status]);

  useEffect(() => {
    if (!ticket?.id || ticket.status !== 'in_progress' || !sid) return;
    let cancelled = false;
    getMessages(ticket.id, sid)
      .then((data) => { if (!cancelled) setMessages(data.messages || []); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [ticket?.id, ticket?.status, sid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!ticket?.id || ticket.status !== 'in_progress' || !sid) return;
    const interval = setInterval(() => {
      getMessages(ticket.id, sid)
        .then((data) => setMessages(data.messages || []))
        .catch(() => {});
    }, 2000);
    return () => clearInterval(interval);
  }, [ticket?.id, ticket?.status, sid]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setAttachmentDataUrl(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  useEffect(() => {
    if (!showSubjectSelection) return;
    setLoadingSubjects(true);
    getSubjects()
      .then((d) => setSubjects(d.subjects || []))
      .catch(() => setSubjects([]))
      .finally(() => setLoadingSubjects(false));
  }, [showSubjectSelection]);

  async function handlePickSubject(subjectId) {
    setError('');
    setLoading(true);
    try {
      const created = await createTicket(sid, subjectId);
      setTicket(created);
    } catch (err) {
      setError(err.message || 'Erro ao iniciar atendimento');
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if ((!input.trim() && !attachmentDataUrl) || !ticket?.id || sending) return;
    setSending(true);
    setError('');
    try {
      const newMsg = await sendMessage(ticket.id, sid, input || ' ', attachmentDataUrl || undefined);
      setMessages((prev) => [...prev, newMsg]);
      setInput('');
      setAttachmentDataUrl(null);
    } catch (err) {
      setError(err.message || 'Erro ao enviar');
    } finally {
      setSending(false);
    }
  }

  if (!sid) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>Carregando…</div>
      </div>
    );
  }

  const showChat = ticket?.status === 'in_progress';

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <img src="/Onlyhelper-claro.png" alt="OnlyHelper" className={styles.logo} />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <p className={styles.status}>Conectando…</p>
        ) : showSubjectSelection ? (
          <div className={styles.subjectSection}>
            <p className={styles.status}>Sobre o que deseja falar?</p>
            {loadingSubjects ? (
              <p className={styles.status}>Carregando assuntos…</p>
            ) : subjects.length === 0 ? (
              <p className={styles.status}>Nenhum assunto disponível no momento.</p>
            ) : (
              <ul className={styles.subjectList}>
                {subjects.map((s) => (
                  <li key={s.id}>
                    <button type="button" onClick={() => handlePickSubject(s.id)} className={styles.subjectBtn}>
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : showChat ? (
          <div className={styles.chatLayout}>
            <p className={styles.status}>
              Chat com o atendente · <strong>Ticket #{ticket.id.slice(0, 8)}</strong>
            </p>
            <div className={styles.messagesWrap}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={m.senderType === 'visitor' ? styles.msgVisitor : styles.msgAttendant}
                >
                  {m.attachmentData && (
                    <button
                      type="button"
                      className={styles.msgImgWrap}
                      onClick={() => setLightboxImage(m.attachmentData)}
                      aria-label="Abrir imagem"
                    >
                      <img src={m.attachmentData} alt="Anexo" className={styles.msgImg} />
                    </button>
                  )}
                  {(m.content && m.content.trim()) ? <span className={styles.msgContent}>{m.content}</span> : null}
                  <span className={styles.msgTime}>{new Date(m.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {lightboxImage && (
              <div
                className={styles.lightbox}
                onClick={() => setLightboxImage(null)}
                role="dialog"
                aria-modal="true"
                aria-label="Imagem anexada"
              >
                <button type="button" className={styles.lightboxClose} onClick={() => setLightboxImage(null)} aria-label="Fechar">×</button>
                <img src={lightboxImage} alt="Anexo em tamanho completo" className={styles.lightboxImg} onClick={(e) => e.stopPropagation()} />
              </div>
            )}
            <form onSubmit={handleSend} className={styles.form}>
              {attachmentDataUrl && (
                <div className={styles.previewWrap}>
                  <img src={attachmentDataUrl} alt="Preview" className={styles.previewImg} />
                  <button type="button" onClick={() => setAttachmentDataUrl(null)} className={styles.previewRemove}>Remover</button>
                </div>
              )}
              <div className={styles.formRow}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className={styles.input}
                  disabled={sending}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  aria-label="Anexar imagem"
                />
                <button type="button" onClick={() => fileInputRef.current?.click()} className={styles.attachBtn} title="Anexar imagem">📷</button>
                <button type="submit" className={styles.sendBtn} disabled={sending || (!input.trim() && !attachmentDataUrl)}>
                  Enviar
                </button>
              </div>
            </form>
          </div>
        ) : ticket?.status === 'waiting' ? (
          <p className={styles.status}>
            Você está na fila. <strong>Posição: {ticket.position ?? 1}</strong>
          </p>
        ) : (
          <p className={styles.status}>Aguardando…</p>
        )}
      </div>
    </div>
  );
}
