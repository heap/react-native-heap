import express from 'express';
import EventEmitter from 'events';
import {Server} from 'http';
import protobuf from 'protobufjs';
import {
  CaptureMessage,
  CaptureEvent,
  CaptureAndroidUserProperties,
  CaptureAndroidUserMigration,
  CaptureIOSBatch,
  CaptureAndroidBatch,
  CaptureSourceEvent,
  getPropertyValue,
  matcherForSourceEventWithProperties,
} from './types';
import {isAndroid} from './util';
import assert from 'assert';

const DefaultTimeout = 10;

export class CaptureServer extends EventEmitter {
  app: express.Express;
  server: Server;
  root: protobuf.Root;

  pixelRequests: URL[];
  eventMessages: CaptureMessage<CaptureEvent>[];
  androidUserPropertiesRequests: CaptureAndroidUserProperties[];
  androidIdentifyRequests: CaptureAndroidUserMigration[];

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
    this.app.post(
      '/api/integrations/android/add_user_properties',
      express.raw({inflate: true, type: 'application/x-protobuf'}),
      this.onAndroidAddUserPropertiesRequest.bind(this),
    );
    this.app.post(
      '/api/integrations/android/identify',
      express.raw({inflate: true, type: 'application/x-protobuf'}),
      this.onAndroidIdentifyRequest.bind(this),
    );
    this.app.all('*', r => console.log(r.url));
    this.reset();

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
      this.server.close(error => {
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
    this.androidUserPropertiesRequests = [];
    this.androidIdentifyRequests = [];
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

  onAndroidAddUserPropertiesRequest(
    req: express.Request,
    res: express.Response,
  ) {
    const UserProperties = this.root.lookupType(
      'tracker.android.proto.UserProperties',
    );

    const request = <CaptureAndroidUserProperties>(
      UserProperties.decode(req.body).toJSON()
    );
    this.addAndroidUserProperties(request);

    res.writeHead(200);
    res.end('{}');
  }

  onAndroidIdentifyRequest(req: express.Request, res: express.Response) {
    const UserMigration = this.root.lookupType(
      'tracker.android.proto.UserMigration',
    );

    const request = <CaptureAndroidUserMigration>(
      UserMigration.decode(req.body).toJSON()
    );
    this.addAndroidIdentify(request);

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

  addAndroidUserProperties(properties: CaptureAndroidUserProperties) {
    this.androidUserPropertiesRequests.push(properties);
    this.emit('androidAddUserProperties', properties);
  }

  addAndroidIdentify(migration: CaptureAndroidUserMigration) {
    this.androidIdentifyRequests.push(migration);
    this.emit('androidIdentify', migration);
  }

  waitForMatchingRequest<T>(
    source: () => T[],
    eventName: string,
    matcher: (request: T) => boolean,
    errorMessage: () => string = () => 'timeout',
    timeout: number = DefaultTimeout,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      for (const request of source()) {
        if (matcher(request)) {
          resolve(request);
          return;
        }
      }

      function onEvent(request: T) {
        if (matcher(request)) {
          resolve(request);
          clearTimeout(timer);
        }
      }

      const timer = setTimeout(() => {
        reject(errorMessage() + '\n' + JSON.stringify(source(), undefined, 4));
        this.off(eventName, onEvent);
      }, timeout * 1000);

      this.on(eventName, onEvent);
    });
  }

  waitForMatchingMessage(
    matcher: (message: CaptureMessage<CaptureEvent>) => boolean,
    errorMessage: () => string = () => 'timeout',
    timeout: number = DefaultTimeout,
  ): Promise<CaptureMessage<CaptureEvent>> {
    return this.waitForMatchingRequest(
      () => this.eventMessages,
      'eventMessage',
      matcher,
      errorMessage,
      timeout,
    );
  }

  waitForMatchingPixelRequest(
    matcher: (url: URL) => boolean,
    errorMessage: () => string = () => 'timeout',
    timeout: number = DefaultTimeout,
  ): Promise<URL> {
    return this.waitForMatchingRequest(
      () => this.pixelRequests,
      'pixel',
      matcher,
      errorMessage,
      timeout,
    );
  }

  waitForMatchingAndroidUserPropertiesRequest(
    matcher: (userProperties: CaptureAndroidUserProperties) => boolean,
    errorMessage: () => string = () => 'timeout',
    timeout: number = DefaultTimeout,
  ) {
    return this.waitForMatchingRequest(
      () => this.androidUserPropertiesRequests,
      'androidAddUserProperties',
      matcher,
      errorMessage,
      timeout,
    );
  }

  waitForMatchingAndroidIdentifyRequest(
    matcher: (userProperties: CaptureAndroidUserMigration) => boolean,
    errorMessage: () => string = () => 'timeout',
    timeout: number = DefaultTimeout,
  ) {
    return this.waitForMatchingRequest(
      () => this.androidIdentifyRequests,
      'androidIdentify',
      matcher,
      errorMessage,
      timeout,
    );
  }

  expectPixelRequest(path: string, expectedParams: {[key: string]: string}) {
    return this.waitForMatchingPixelRequest(
      url => {
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
    expectedType: 'touch' | 'react_navigation_screenview' | 'text_edit',
    expectedProperties: {[key: string]: string | boolean},
  ): Promise<CaptureMessage<CaptureSourceEvent>> {
    const result = await this.waitForMatchingMessage(
      matcherForSourceEventWithProperties(expectedType, expectedProperties),
      () =>
        `timeout waiting for ${expectedType} event with ${JSON.stringify(
          expectedProperties,
          undefined,
          2,
        )}`,
    );
    return <CaptureMessage<CaptureSourceEvent>>result;
  }

  assertNoExistingSourceEventWithProperties(
    expectedType: 'touch' | 'react_navigation_screenview' | 'text_edit',
    expectedProperties: {[key: string]: string | boolean},
  ) {
    const matcher = matcherForSourceEventWithProperties(
      expectedType,
      expectedProperties,
    );
    for (const message of this.eventMessages) {
      if (matcher(message)) {
        assert.fail(
          `found unexpected ${expectedType} event with ${JSON.stringify(
            expectedProperties,
            undefined,
            2,
          )}:\n\n${JSON.stringify(message, undefined, 2)}`,
        );
      }
    }
  }

  async expectUserProperties(expectedParams: {
    [key: string]: string;
  }): Promise<void> {
    if (isAndroid()) {
      await this.waitForMatchingAndroidUserPropertiesRequest(
        request => {
          for (const [key, value] of Object.entries(expectedParams)) {
            if (getPropertyValue(key, request.properties) !== value) {
              return false;
            }
          }
          return true;
        },
        () =>
          `timeout waiting for android user properties with ${JSON.stringify(
            expectedParams,
            undefined,
            2,
          )}`,
      );
    } else {
      const prefixed = Object.fromEntries(
        Object.entries(expectedParams).map(arr => ['_' + arr[0], arr[1]]),
      );

      await this.expectPixelRequest('/api/add_user_properties_v3', prefixed);
    }
  }

  async expectIdentify(identity: string): Promise<string> {
    if (isAndroid()) {
      let matched = await this.waitForMatchingAndroidIdentifyRequest(
        request => {
          return request.toIdentity === identity;
        },
        () => `timeout waiting for android identify request with ${identity}`,
      );
      return matched.fromUserId.toString();
    } else {
      let matched = await this.expectPixelRequest('/api/identify_v3', {
        i: identity,
      });

      return matched.searchParams.get('u');
    }
  }
}
