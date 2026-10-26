export type FaultType = 
  | 'NORMAL' 
  | 'SHADING' 
  | 'DUST' 
  | 'ELECTRICAL_FAULT' 
  | 'LOW_POWER' 
  | 'OVERHEATING';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SensorReading {
  id: number;
  timestamp: string;
  time?: string;
  date?: string;
  voltage: number;
  current: number;
  temperature: number;
  light_intensity: number;
  power: number;
  expected_power?: number;
  efficiency?: number;
  device_id: string;
  prediction?: {
    condition: FaultType;
    confidence: number;
    severity: SeverityLevel;
    recommendation: string;
    probabilities?: Record<FaultType, number>;
  };
  simulation_mode?: boolean;
}

export interface PredictionResult {
  prediction: FaultType;
  confidence: number;
  severity: SeverityLevel;
  title: string;
  description: string;
  recommendation: string;
  probabilities: Record<FaultType, number>;
  autoencoder: {
    reconstruction_error: number;
    threshold: number;
    anomaly: boolean;
    status: string;
  };
  model_version: string;
  input_features: {
    voltage: number;
    current: number;
    temperature: number;
    light_intensity: number;
    power: number;
  };
}

export interface AlertItem {
  id: number;
  prediction_id?: number;
  fault_type: FaultType;
  severity: SeverityLevel;
  message: string;
  recommendation?: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  timestamp: string;
  formatted_time?: string;
}

export interface FaultHistoryItem {
  id: number;
  date: string;
  time: string;
  timestamp: string;
  fault_type: FaultType;
  severity: SeverityLevel;
  confidence: number;
  voltage: number;
  current: number;
  temperature: number;
  light_intensity: number;
  actual_power: number;
  expected_power: number;
  power_loss: string;
  recommendation: string;
  status: string;
}

export interface DeviceItem {
  id: number;
  device_name: string;
  device_id: string;
  status: 'CONNECTED' | 'SIMULATED' | 'DISCONNECTED';
  ip_address: string;
  last_seen: string | null;
  total_telemetry_sent: number;
  sensors: Array<{
    name: string;
    pin: string;
    status: string;
  }>;
  firmware_version: string;
  simulation_active: boolean;
}

export interface ModelMetrics {
  model_name: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
  };
  dataset_summary: {
    total_samples: number;
    train_samples: number;
    test_samples: number;
    features: string[];
  };
  confusion_matrix: number[][];
  training_history: {
    epochs: number[];
    accuracy: number[];
    val_accuracy: number[];
    loss: number[];
    val_loss: number[];
  };
  autoencoder: {
    model_name: string;
    architecture: string;
    threshold: number;
    baseline_reconstruction_error: number;
    status: string;
  };
}
