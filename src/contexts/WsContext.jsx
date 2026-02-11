import { createContext, useContext, useEffect, useState } from 'react';

function getWsUrl() {
  const api = import.meta.env.VITE_API_URL || '';
  if (api) return api.replace(/^http/, 'ws').replace(/\/$/, '') + '/ws';
  // Produção com mesmo origem: usar host atual
  if (typeof window !== 'undefined' && window.location) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws`;
  }
  return 'ws://localhost:4000/ws';
}

const WsContext = createContext({ ticketsUpdateTrigger: 0, lastMessageEvent: null });

export function WsProvider({ children }) {
  const [ticketsUpdateTrigger, setTicketsUpdateTrigger] = useState(0);
  const [lastMessageEvent, setLastMessageEvent] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const url = getWsUrl();
    const ws = new WebSocket(url);

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.event === 'tickets_update') {
          setTicketsUpdateTrigger((n) => n + 1);
        }
        if (msg.event === 'message_new' && msg.ticketId) {
          setLastMessageEvent({ ticketId: msg.ticketId, message: msg.message });
        }
      } catch (_) {}
    };

    return () => ws.close();
  }, []);

  return (
    <WsContext.Provider value={{ ticketsUpdateTrigger, lastMessageEvent, connected }}>
      {children}
    </WsContext.Provider>
  );
}

export function useWs() {
  return useContext(WsContext);
}
