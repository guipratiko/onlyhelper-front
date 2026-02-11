import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useWs } from '../contexts/WsContext';
import { getMessages, sendMessageAsAttendant, closeTicket } from '../api/tickets';
import styles from './Chat.module.css';

export default function Chat() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromMonitor = location.state?.fromMonitor === true;
  const { lastMessageEvent } = useWs();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [closing, setClosing] = useState(false);
  const [attachmentDataUrl, setAttachmentDataUrl] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!ticketId) return;
    let cancelled = false;
    setLoading(true);
    getMessages(ticketId)
      .then((list) => { if (!cancelled) setMessages(list); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [ticketId]);

  useEffect(() => {
    if (lastMessageEvent?.ticketId === ticketId) {
      getMessages(ticketId).then(setMessages).catch(() => {});
    }
  }, [lastMessageEvent, ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setAttachmentDataUrl(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  async function handleSend(e) {
    e.preventDefault();
    if ((!input.trim() && !attachmentDataUrl) || !ticketId || sending) return;
    setSending(true);
    setError('');
    try {
      const newMsg = await sendMessageAsAttendant(ticketId, input || ' ', attachmentDataUrl || undefined);
      setMessages((prev) => [...prev, newMsg]);
      setInput('');
      setAttachmentDataUrl(null);
    } catch (err) {
      setError(err.message || 'Erro ao enviar');
    } finally {
      setSending(false);
    }
  }

  async function handleClose() {
    if (!ticketId || closing) return;
    setClosing(true);
    setError('');
    try {
      await closeTicket(ticketId);
      navigate(fromMonitor ? '/monitorar' : '/atendimentos');
    } catch (err) {
      setError(err.message);
    } finally {
      setClosing(false);
    }
  }

  if (!ticketId) {
    navigate(fromMonitor ? '/monitorar' : '/atendimentos');
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <div className={styles.header}>
          <button type="button" onClick={() => navigate(fromMonitor ? '/monitorar' : '/atendimentos')} className={styles.backBtn}>
            {fromMonitor ? '← Monitorar conversas' : '← Atendimentos'}
          </button>
          <span className={styles.ticketId}>Ticket #{ticketId.slice(0, 8)}</span>
          <button type="button" onClick={handleClose} className={styles.closeBtn} disabled={closing}>
            {closing ? 'Encerrando…' : 'Encerrar'}
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <p className={styles.loading}>Carregando mensagens…</p>
        ) : (
          <>
            <div className={styles.messagesWrap}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={m.senderType === 'attendant' ? styles.msgAttendant : styles.msgVisitor}
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
          </>
        )}
      </div>
    </div>
  );
}
