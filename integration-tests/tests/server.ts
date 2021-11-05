import express from 'express';
import EventEmitter from 'events';
import {Server} from 'http';
import protobuf from 'protobufjs';

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
    this.app.get('*', this.onGetRequest.bind(this));
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

  waitForMatchingMessage(
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

  waitForMatchingPixelRequest(
    matcher: (url: URL) => boolean,
    errorMessage: () => string = () => 'timeout',
    timeout: number = 10,
  ): Promise<URL> {
    return new Promise((resolve, reject) => {
      for (const url of this.pixelRequests) {
        if (matcher(url)) {
          resolve(url);
          return;
        }
      }

      function onEvent(url: URL) {
        if (matcher(url)) {
          resolve(url);
          clearTimeout(timer);
        }
      }

      const timer = setTimeout(() => {
        reject(
          errorMessage() +
            '\n' +
            JSON.stringify(this.pixelRequests, undefined, 4),
        );
        this.off('pixel', onEvent);
      }, timeout * 1000);

      this.on('pixel', onEvent);
    });
  }

  expectPixelRequest(path: string, expectedParams: {[key: string]: string}) {
    return this.waitForMatchingPixelRequest(
      (url) => {
        if (path !== url.pathname) {
          return false;
        }
        for (const [key, value] of Object.entries(expectedParams)) {
          if (url.searchParams.get(key) !== value) {
            return false;
          }
        }
        return true;
      },
      () =>
        `timeout waiting for ${path} with ${JSON.stringify(
          expectedParams,
          undefined,
          2,
        )}`,
    );
  }

  async expectSourceEventWithProperties(
    expectedType: 'touch' | 'react_navigation_screenview',
    expectedProperties: {[key: string]: string | boolean},
  ): Promise<CaptureMessage<CaptureSourceEvent>> {
    const result = await this.waitForMatchingMessage((message) => {
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

  async expectUserProperties(expectedParams: {
    [key: string]: string;
  }): Promise<URL> {
    const prefixed = Object.fromEntries(
      Object.entries(expectedParams).map((arr) => ['_' + arr[0], arr[1]]),
    );

    return await this.expectPixelRequest(
      '/api/add_user_properties_v3',
      prefixed,
    );
  }

  async expectIdentify(identity: string): Promise<string> {
    let matched = await this.expectPixelRequest('/api/identify_v3', {
      i: identity,
    });

    return matched.searchParams.get('u');
  }
}

export {CaptureServer};
