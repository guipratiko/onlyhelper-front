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

export async function getAdminSubjects() {
  return request('/api/admin/subjects');
}

export async function createSubject(name, position = 0) {
  return request('/api/admin/subjects', {
    method: 'POST',
    body: JSON.stringify({ name, position }),
  });
}

export async function updateSubject(id, data) {
  return request(`/api/admin/subjects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSubject(id) {
  const url = `${API_URL}/api/admin/subjects/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  if (res.status === 204) return;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Erro ao remover');
}

export async function getCollaborators() {
  return request('/api/admin/collaborators');
}

export async function updateCollaboratorSubjects(userId, subjectIds) {
  return request(`/api/admin/collaborators/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ subjectIds }),
  });
}
