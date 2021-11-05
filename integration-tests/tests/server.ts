import express from 'express';
import EventEmitter from 'events';
import {Server} from 'http';
import protobuf from 'protobufjs';

interface CaptureApplicationInfo {
  appName: string;
  appVersion: string;
  libraryVersion: string;
}

interface CaptureEvent {
  appVisibilityState: 0 | 1 | 2;
}

interface CaptureSourceEvent extends CaptureEvent {
  sourceEvent: CaptureSourceEventPayload;
}

interface BoolProperty {
  bool: boolean;
}

interface StringProperty {
  string: string;
}

interface CaptureSourceEventPayload {
  type?: string;
  name?: string;
  sourceProperties: {[key: string]: BoolProperty | StringProperty};
  source: string;
}

interface CaptureMessage<T extends CaptureEvent> {
  envId: string;
  id: string;
  event: T | null;
  [key: string]: any;
}

interface CaptureIOSBatch {
  sentTime: string;
  messages: CaptureMessage<CaptureEvent>[];
}

interface CaptureAndroidBatch {
  events: CaptureMessage<CaptureEvent>[];
}

function isSourceEvent(event: CaptureEvent): event is CaptureSourceEvent {
  return has(event, 'sourceEvent');
}

// This keeps getting formatted away. :(
function has(obj: any, property: string): boolean {
  return obj && obj[property] !== undefined;
}

function getPropertyValue(
  propertyName: string,
  properties: {[key: string]: BoolProperty | StringProperty},
): boolean | string | undefined {
  for (const [key, value] of Object.entries(properties)) {
    if (key === propertyName) {
      if (has(value, 'bool')) {
        return (<BoolProperty>value).bool;
      }
      if (has(value, 'string') !== undefined) {
        return (<StringProperty>value).string;
      }
      return undefined;
    }
  }
  return undefined;
}

class CaptureServer extends EventEmitter {
  app: express.Express;
  server: Server;
  root: protobuf.Root;

  pixelRequests: URL[];
  eventMessages: CaptureMessage<CaptureEvent>[];

  constructor() {
    super();
    this.app = express();
    this.app.get('/h', this.onGetRequest.bind(this));
    this.app.post(
      '/api/integrations/ios/track',
      express.json(),
      this.onIOSTrackRequest.bind(this),
    );
    this.app.post(
      '/api/integrations/android/track',
      express.raw({inflate: true, type: 'application/x-protobuf'}),
      this.onAndroidTrackRequest.bind(this),
    );
    this.app.all('*', (r) => console.log(r.url));
    this.eventMessages = [];
    this.pixelRequests = [];

    const jsonSchema = require('./root.proto.json');
    this.root = protobuf.Root.fromJSON(jsonSchema);
  }

  start(port: number) {
    this.server = this.app.listen(port);
  }

  stop(): Promise<void> {
    if (!this.server) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      this.server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  reset() {
    this.eventMessages = [];
    this.pixelRequests = [];
  }

  onGetRequest(req: express.Request, res: express.Response) {
    const url = this.getUrl(req);
    this.addPixel(url);
    res.writeHead(200);
    res.end('{}');
  }

  onAndroidTrackRequest(req: express.Request, res: express.Response) {
    const MessageBatch = this.root.lookupType(
      'tracker.android.proto.MessageBatch',
    );

    const batch = <CaptureAndroidBatch>MessageBatch.decode(req.body).toJSON();

    for (const message of batch.events) {
      this.addEvent(message);
    }

    res.writeHead(200);
    res.end('{}');
  }

  onIOSTrackRequest(req: express.Request, res: express.Response) {
    for (const message of (<CaptureIOSBatch>req.body).messages) {
      this.addEvent(message);
    }
    res.writeHead(200);
    res.end('{}');
  }

  getUrl(req: express.Request): URL {
    return new URL(req.url, 'https://heapanalytics.com/');
  }

  addEvent(event: CaptureMessage<CaptureEvent>) {
    this.eventMessages.push(event);
    this.emit('eventMessage', event);
  }

  addPixel(url: URL) {
    this.pixelRequests.push(url);
    this.emit('pixel', url);
  }

  waitForMessage(
    matcher: (message: CaptureMessage<CaptureEvent>) => boolean,
    timeout: number = 10,
  ): Promise<CaptureMessage<CaptureEvent>> {
    return new Promise((resolve, reject) => {
      for (const message of this.eventMessages) {
        if (matcher(message)) {
          resolve(message);
          return;
        }
      }

      function onEvent(message: CaptureMessage<CaptureEvent>) {
        if (matcher(message)) {
          resolve(message);
          clearTimeout(timer);
        }
      }

      const timer = setTimeout(() => {
        reject('timeout\n' + JSON.stringify(this.eventMessages, undefined, 4));
        this.off('eventMessage', onEvent);
      }, timeout * 1000);

      this.on('eventMessage', onEvent);
    });
  }

  async expectSourceEventWithProperties(
    expectedType: 'touch' | 'react_navigation_screenview',
    expectedProperties: {[key: string]: string | boolean},
  ): Promise<CaptureMessage<CaptureSourceEvent>> {
    const result = await this.waitForMessage((message) => {
      const event = message.event;

      if (!isSourceEvent(event)) {
        return false;
      }

      if (
        event.sourceEvent.type !== expectedType &&
        event.sourceEvent.name !== expectedType
      ) {
        return false;
      }

      for (const [key, value] of Object.entries(expectedProperties)) {
        if (
          getPropertyValue(key, event.sourceEvent.sourceProperties) !== value
        ) {
          return false;
        }
      }

      return true;
    });
    return <CaptureMessage<CaptureSourceEvent>>result;
  }
}

export {CaptureServer};
