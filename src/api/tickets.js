const API_URL = import.meta.env.VITE_API_URL || '';

function getAuthHeader() {
  const token = localStorage.getItem('onlyhelper_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
}

export async function getTickets(params = {}) {
  const sp = new URLSearchParams();
  if (params.status) sp.set('status', params.status);
  if (params.assigned_to) sp.set('assigned_to', params.assigned_to);
  const q = sp.toString();
  return request(`/api/tickets${q ? `?${q}` : ''}`);
}

export async function takeTicket(id) {
  return request(`/api/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ action: 'take' }),
  });
}

export async function closeTicket(id) {
  return request(`/api/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ action: 'close' }),
  });
}

export async function getMessages(ticketId) {
  return request(`/api/tickets/${ticketId}/messages`).then((d) => d.messages || []);
}

export async function sendMessageAsAttendant(ticketId, content, attachment = null) {
  const body = { content: (content || '').trim() };
  if (attachment) body.attachment = attachment;
  return request(`/api/tickets/${ticketId}/messages`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
