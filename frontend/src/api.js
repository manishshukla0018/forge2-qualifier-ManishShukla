const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  getBoards: () => request('/boards'),
  getBoard: (boardId) => request(`/boards/${boardId}`),
  createBoard: (payload) => request('/boards', { method: 'POST', body: JSON.stringify(payload) }),
  createCard: (listId, payload) => request(`/lists/${listId}/cards`, { method: 'POST', body: JSON.stringify(payload) }),
  updateCard: (cardId, payload) => request(`/cards/${cardId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  moveCard: (cardId, payload) => request(`/cards/${cardId}/move`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteCard: (cardId) => request(`/cards/${cardId}`, { method: 'DELETE' }),
  getMembers: () => request('/members'),
  createMember: (payload) => request('/members', { method: 'POST', body: JSON.stringify(payload) }),
  getTags: () => request('/tags'),
  createTag: (payload) => request('/tags', { method: 'POST', body: JSON.stringify(payload) }),
};
