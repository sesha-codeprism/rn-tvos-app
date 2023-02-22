class MFEventEmitter {
    events: Record<string, any>;
    constructor() {
      this.events = {}
    }
  
    on = (event: string, listener: any) => {
      if (!this.events[event]) {
        this.events[event] = [];
        this.events[event].push(listener);
      }
  
      !this.events[event]  && this.events[event].push(listener)
    }
  
    emit = (event: string, payload: any) => {
      if (this.events[event]) {
        this.events[event].forEach((listener: any) => {
          listener(payload)
        })
      }
    }
  }
  
  const EventEmitter = new MFEventEmitter();
  
  export default EventEmitter as MFEventEmitter;