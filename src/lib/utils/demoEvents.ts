/**
 * Global demo event emitter — wraps Socket.io so any file can emit events
 * to the real-time dashboard without circular imports.
 */

let _io: any = null;

export function setDemoIo(io: any) {
  _io = io;
}

export function emitDemo(event: string, data: any) {
  if (_io) {
    _io.emit(event, { ...data, ts: new Date().toISOString() });
  }
}
