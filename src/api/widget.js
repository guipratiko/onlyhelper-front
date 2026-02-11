const API_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
}

export async function getTicketBySession(sessionId) {
  const API_URL = import.meta.env.VITE_API_URL || '';
  const url = `${API_URL}/api/tickets/by-session/${encodeURIComponent(sessionId)}`;
  const res = await fetch(url);
  if (res.status === 404) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
}

export async function getSubjects() {
  const API_URL = import.meta.env.VITE_API_URL || '';
  const url = `${API_URL}/api/subjects`;
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Erro ao carregar assuntos');
  return data;
}

export async function createTicket(visitorSessionId, subjectId, visitorName = null) {
  const body = { visitor_session_id: visitorSessionId, visitor_name: visitorName };
  if (subjectId) body.subject_id = subjectId;
  return request('/api/tickets', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getMessages(ticketId, sessionId) {
  const API_URL = import.meta.env.VITE_API_URL || '';
  const url = `${API_URL}/api/tickets/${ticketId}/messages?session_id=${encodeURIComponent(sessionId)}`;
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Erro ao carregar mensagens');
  return data;
}

export async function sendMessage(ticketId, sessionId, content, attachment = null) {
  const body = { content: (content || '').trim(), session_id: sessionId };
  if (attachment) body.attachment = attachment;
  return request(`/api/tickets/${ticketId}/messages`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
