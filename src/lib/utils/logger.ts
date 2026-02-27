import winston from 'winston';

const NS_PAD = 32;

const CC = {
  invert: '\x1b[7m',
  clear: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  brightCyan: '\x1b[96m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  teal: '\x1b[38;5;30m',
  lightPurple: '\x1b[38;5;141m',
  pink: '\x1b[38;5;219m',
  orange: '\x1b[38;5;208m',
  lightBlue: '\x1b[38;5;75m',
};

const title = (label?: string, color = CC.clear, phoneNumber?: string) => {
  const phonePrefix = phoneNumber ? `[${phoneNumber}] ` : '';
  const safeLabel = label || 'unknown';
  return color + phonePrefix + safeLabel.padEnd(NS_PAD) + CC.clear;
};

const stringify = (arg: any): string => {
  if (typeof arg === 'string') return arg;
  if (arg instanceof Error) return arg.message;
  try {
    const cache = new WeakSet();
    return JSON.stringify(arg, (k, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) return '[Circular]';
        cache.add(value);
      }
      return value;
    }, 2);
  } catch (err) {
    try {
      const util = require('util');
      return util.inspect(arg, { depth: 2, colors: false });
    } catch {
      return String(arg);
    }
  }
};

interface LogData {
  label?: string;
  phone?: string;
  message?: string;
  data?: any;
  [key: string]: any;
}

export const log = {
  info: (data: LogData) => {
    const { label, phone, message, ...rest } = data;
    console.log(title(label, CC.cyan, phone), message, ...Object.values(rest));
  },
  error: (data: LogData) => {
    const { label, phone, message, ...rest } = data;
    console.error(title(label, CC.red, phone), message, ...Object.values(rest));
  },
  warn: (data: LogData) => {
    const { label, phone, message, ...rest } = data;
    console.warn(title(label, CC.yellow, phone), message, ...Object.values(rest));
  },
  success: (data: LogData) => {
    const { label, phone, message, ...rest } = data;
    console.log(title(label, CC.green, phone), message, ...Object.values(rest));
  },
  cyan: (data: LogData) => {
    const { label, phone, message, ...rest } = data;
    console.log(title(label, CC.cyan, phone), message, ...Object.values(rest));
  },
  green: (data: LogData) => {
    const { label, phone, message, ...rest } = data;
    console.log(title(label, CC.green, phone), message, ...Object.values(rest));
  },
  yellow: (data: LogData) => {
    const { label, phone, message, ...rest } = data;
    console.log(title(label, CC.yellow, phone), message, ...Object.values(rest));
  },
  magenta: (data: LogData) => {
    const { label, phone, message, ...rest } = data;
    console.log(title(label, CC.magenta, phone), message, ...Object.values(rest));
  },
  lightPurple: (data: LogData) => {
    const { label, phone, message, ...rest } = data;
    console.log(title(label, CC.lightPurple, phone), message, ...Object.values(rest));
  },
  brightCyan: (data: LogData) => {
    const { label, phone, message, ...rest } = data;
    console.log(title(label, CC.brightCyan, phone), message, ...Object.values(rest));
  },
  lightBlue: (data: LogData) => {
    const { label, phone, message, ...rest } = data;
    console.log(title(label, CC.lightBlue, phone), message, ...Object.values(rest));
  },
  sms_received: (data: LogData) => {
    const { phone, message, ...rest } = data;
    console.log(title('sms_received', CC.green, phone), message, ...Object.values(rest));
  },
  sms_sent: (data: LogData) => {
    const { phone, message, ...rest } = data;
    console.log(title('sms_sent', CC.cyan, phone), message, ...Object.values(rest));
  },
  tool_call: (data: LogData) => {
    const { phone, message, ...rest } = data;
    console.log(title('tool_call', CC.orange, phone), message, ...Object.values(rest));
  },
  tool_result: (data: LogData) => {
    const { phone, message, ...rest } = data;
    console.log(title('tool_result', CC.lightBlue, phone), message, ...Object.values(rest));
  }
};
