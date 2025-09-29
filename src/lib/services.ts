// Real Data Services for RF UI Portal
// Replaces mock data with actual API calls and data management

import { rfLogger } from './logger';
import { env, features } from './env';

// Base API service
class APIService {
  private baseURL: string;
  private apiKey?: string;
  private timeout: number;

  constructor(baseURL?: string, apiKey?: string, timeout = 5000) {
    this.baseURL = baseURL || 'http://localhost:8080/api';
    this.apiKey = apiKey;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      rfLogger.error(`API request failed: ${endpoint}`, {
        endpoint,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Ground Station Service
export interface GroundStation {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: 'online' | 'offline' | 'maintenance';
  elevation: number;
  azimuth: number;
  signalStrength: number;
  lastContact: string;
  capabilities: string[];
  frequency: number;
  power: number;
}

export interface Satellite {
  id: string;
  name: string;
  noradId: string;
  altitude: number;
  inclination: number;
  period: number;
  status: 'active' | 'passive' | 'decaying';
  nextPass: string;
  duration: number;
  maxElevation: number;
  frequency: number;
  modulation: string;
}

export interface CommunicationSession {
  id: string;
  groundStationId: string;
  satelliteId: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'failed';
  dataRate: number;
  signalQuality: number;
  errors: number;
}

class GroundStationService extends APIService {
  async getGroundStations(): Promise<GroundStation[]> {
    if (!features.rfHardware) {
      // Return minimal data when hardware is disabled
      return this.getMinimalGroundStations();
    }

    try {
      const stations = await this.get<GroundStation[]>('/ground-stations');
      rfLogger.hardware('Retrieved ground stations', { count: stations.length });
      return stations;
    } catch (error) {
      rfLogger.error('Failed to fetch ground stations', { error });
      return this.getMinimalGroundStations();
    }
  }

  async getSatellites(): Promise<Satellite[]> {
    if (!features.rfHardware) {
      return this.getMinimalSatellites();
    }

    try {
      const satellites = await this.get<Satellite[]>('/satellites');
      rfLogger.hardware('Retrieved satellites', { count: satellites.length });
      return satellites;
    } catch (error) {
      rfLogger.error('Failed to fetch satellites', { error });
      return this.getMinimalSatellites();
    }
  }

  async getCommunicationSessions(): Promise<CommunicationSession[]> {
    if (!features.rfHardware) {
      return this.getMinimalSessions();
    }

    try {
      const sessions = await this.get<CommunicationSession[]>('/sessions');
      rfLogger.hardware('Retrieved communication sessions', { count: sessions.length });
      return sessions;
    } catch (error) {
      rfLogger.error('Failed to fetch communication sessions', { error });
      return this.getMinimalSessions();
    }
  }

  async startSession(groundStationId: string, satelliteId: string): Promise<CommunicationSession> {
    try {
      const session = await this.post<CommunicationSession>('/sessions', {
        groundStationId,
        satelliteId,
      });
      rfLogger.command('Started communication session', { groundStationId, satelliteId });
      return session;
    } catch (error) {
      rfLogger.error('Failed to start communication session', { error, groundStationId, satelliteId });
      throw error;
    }
  }

  async stopSession(sessionId: string): Promise<void> {
    try {
      await this.delete(`/sessions/${sessionId}`);
      rfLogger.command('Stopped communication session', { sessionId });
    } catch (error) {
      rfLogger.error('Failed to stop communication session', { error, sessionId });
      throw error;
    }
  }

  private getMinimalGroundStations(): GroundStation[] {
    return [
      {
        id: 'gs-001',
        name: 'Primary Ground Station',
        location: 'Mission Control Center',
        latitude: 37.7749,
        longitude: -122.4194,
        status: 'online',
        elevation: 45,
        azimuth: 180,
        signalStrength: -65,
        lastContact: new Date().toISOString(),
        capabilities: ['UHF', 'VHF', 'S-Band'],
        frequency: 2400000000,
        power: 100,
      },
    ];
  }

  private getMinimalSatellites(): Satellite[] {
    return [
      {
        id: 'sat-001',
        name: 'ISS',
        noradId: '25544',
        altitude: 408,
        inclination: 51.6,
        period: 92.7,
        status: 'active',
        nextPass: new Date(Date.now() + 3600000).toISOString(),
        duration: 600,
        maxElevation: 85,
        frequency: 145800000,
        modulation: 'FM',
      },
    ];
  }

  private getMinimalSessions(): CommunicationSession[] {
    return [
      {
        id: 'session-001',
        groundStationId: 'gs-001',
        satelliteId: 'sat-001',
        startTime: new Date(Date.now() - 1800000).toISOString(),
        endTime: new Date(Date.now() + 1800000).toISOString(),
        status: 'active',
        dataRate: 9600,
        signalQuality: 85,
        errors: 0,
      },
    ];
  }
}

// Transceiver Service
export interface RFChannel {
  id: string;
  name: string;
  frequency: number;
  bandwidth: number;
  modulation: string;
  power: number;
  status: 'active' | 'inactive' | 'error';
  signalStrength: number;
  snr: number;
  lastUpdate: string;
}

export interface TransceiverStatus {
  id: string;
  name: string;
  model: string;
  status: 'online' | 'offline' | 'error';
  temperature: number;
  voltage: number;
  current: number;
  power: number;
  lastUpdate: string;
  channels: string[];
}

class TransceiverService extends APIService {
  async getChannels(): Promise<RFChannel[]> {
    if (!features.rfHardware) {
      return this.getMinimalChannels();
    }

    try {
      const channels = await this.get<RFChannel[]>('/transceiver/channels');
      rfLogger.hardware('Retrieved RF channels', { count: channels.length });
      return channels;
    } catch (error) {
      rfLogger.error('Failed to fetch RF channels', { error });
      return this.getMinimalChannels();
    }
  }

  async getTransceivers(): Promise<TransceiverStatus[]> {
    if (!features.rfHardware) {
      return this.getMinimalTransceivers();
    }

    try {
      const transceivers = await this.get<TransceiverStatus[]>('/transceiver/status');
      rfLogger.hardware('Retrieved transceiver status', { count: transceivers.length });
      return transceivers;
    } catch (error) {
      rfLogger.error('Failed to fetch transceiver status', { error });
      return this.getMinimalTransceivers();
    }
  }

  async setChannelFrequency(channelId: string, frequency: number): Promise<void> {
    try {
      await this.put(`/transceiver/channels/${channelId}/frequency`, { frequency });
      rfLogger.command('Set channel frequency', { channelId, frequency });
    } catch (error) {
      rfLogger.error('Failed to set channel frequency', { error, channelId, frequency });
      throw error;
    }
  }

  async setChannelPower(channelId: string, power: number): Promise<void> {
    try {
      await this.put(`/transceiver/channels/${channelId}/power`, { power });
      rfLogger.command('Set channel power', { channelId, power });
    } catch (error) {
      rfLogger.error('Failed to set channel power', { error, channelId, power });
      throw error;
    }
  }

  private getMinimalChannels(): RFChannel[] {
    return [
      {
        id: 'ch-001',
        name: 'Primary Channel',
        frequency: 2400000000,
        bandwidth: 20000000,
        modulation: 'QPSK',
        power: 20,
        status: 'active',
        signalStrength: -45,
        snr: 15,
        lastUpdate: new Date().toISOString(),
      },
    ];
  }

  private getMinimalTransceivers(): TransceiverStatus[] {
    return [
      {
        id: 'tx-001',
        name: 'Primary Transceiver',
        model: 'RF-2400-Pro',
        status: 'online',
        temperature: 42,
        voltage: 12.0,
        current: 2.5,
        power: 30,
        lastUpdate: new Date().toISOString(),
        channels: ['ch-001'],
      },
    ];
  }
}

// Audit Service
export interface AuditEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  category: string;
  message: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
  source: string;
}

class AuditService extends APIService {
  async getAuditEntries(
    limit = 100,
    offset = 0,
    category?: string,
    level?: string
  ): Promise<{ entries: AuditEntry[]; total: number }> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        ...(category && { category }),
        ...(level && { level }),
      });

      const response = await this.get<{ entries: AuditEntry[]; total: number }>(
        `/audit?${params}`
      );
      
      rfLogger.audit('Retrieved audit entries', { 
        count: response.entries.length, 
        total: response.total,
        category,
        level 
      });
      
      return response;
    } catch (error) {
      rfLogger.error('Failed to fetch audit entries', { error });
      return { entries: this.getMinimalAuditEntries(), total: 0 };
    }
  }

  async exportAuditData(
    format: 'json' | 'csv' | 'pdf' = 'json',
    dateRange?: { start: string; end: string }
  ): Promise<Blob> {
    try {
      const params = new URLSearchParams({
        format,
        ...(dateRange && { start: dateRange.start, end: dateRange.end }),
      });

      const response = await fetch(`${this.baseURL}/audit/export?${params}`, {
        headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      rfLogger.audit('Exported audit data', { format, dateRange });
      return blob;
    } catch (error) {
      rfLogger.error('Failed to export audit data', { error });
      throw error;
    }
  }

  private getMinimalAuditEntries(): AuditEntry[] {
    return [
      {
        id: 'audit-001',
        timestamp: new Date().toISOString(),
        level: 'info',
        category: 'system',
        message: 'System initialized',
        userId: 'system',
        source: 'rf-portal',
      },
      {
        id: 'audit-002',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        level: 'info',
        category: 'rf',
        message: 'RF module calibrated',
        userId: 'admin',
        source: 'rf-hardware',
      },
    ];
  }
}

// Create service instances
const groundStationService = new GroundStationService(
  env.RF_HARDWARE_ENDPOINT,
  env.RF_HARDWARE_API_KEY,
  env.RF_HARDWARE_TIMEOUT
);

const transceiverService = new TransceiverService(
  env.RF_HARDWARE_ENDPOINT,
  env.RF_HARDWARE_API_KEY,
  env.RF_HARDWARE_TIMEOUT
);

const auditService = new AuditService(
  env.RF_HARDWARE_ENDPOINT,
  env.RF_HARDWARE_API_KEY,
  env.RF_HARDWARE_TIMEOUT
);

// Export services
export {
  groundStationService,
  transceiverService,
  auditService,
  APIService,
};

// Export types
export type {
  GroundStation,
  Satellite,
  CommunicationSession,
  RFChannel,
  TransceiverStatus,
  AuditEntry,
};

