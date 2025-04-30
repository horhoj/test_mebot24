export interface Call {
  id: number;
  date: string;
  time: string;
  responsible: string;
  type: CallType;
  priority: CallPriority;
}

export enum CallPriority {
  Express = 'express',
  Ordinary = 'ordinary',
}

export enum CallType {
  In = 'in',
  Out = 'out',
}

export type CallError = {
  field: keyof Call;
};

export type Errors = Record<number, string[]>;
