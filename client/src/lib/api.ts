import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// attach access token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// interceptor to attempt token refresh on 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Interceptors remain the same as your existing implementation...

/* ============================= */
/* 🔵 Typed API Helper Methods   */
/* ============================= */

export type Agent = {
  id: string;
  name: string;
  externalAgentId: string;
  description?: string;
  currentMethod?: string;  

  metadata?: {
      peer?: string;
      to?: string;
      from?: string;
  } & Record<string, unknown>;  
  lastSeen: string;
  createdAt: string;
  status?: string;
};

export const getAgents = async (): Promise<Agent[]> => {
  const res = await api.get("/agents");
  return res.data;
};

export type AgentLog = {
  id: string;
  agentId: string;
  type: string;
  payload: {
    jsonrpc: string;
    method: string;
    params: {
      agentId: string;
      status: string;
      metadata: Record<string, unknown>;
    };
  };
  createdAt: string;
};

export const getAgentLogs = async (agentId: string): Promise<AgentLog[]> => {
  const res = await api.get(`/agents/${agentId}/logs`);
  return res.data;
};

export type Alert = {
  id: number;
  agentId: string;
  ownerId: string;
  severity: "info" | "warning" | "critical";
  message: string;
  type: string;
  streamType: "ALERT";
  timestamp: string;
};

// helper for sending self-healing commands to the server
export const sendAgentCommand = async (agentId: string, action: string) => {
  const res = await api.post(`/agents/${agentId}/command`, { 
    command: { action, timestamp: new Date().toISOString() } 
  });
  return res.data;
};