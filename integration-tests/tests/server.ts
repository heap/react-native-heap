import { createServer, IncomingMessage, METHODS, Server, ServerResponse } from 'http';

import EventEmitter from 'events';

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
    type: string;
    sourceProperties: { [key: string]: BoolProperty | StringProperty };
    source: string;
}

interface CaptureMessage {
    envId: string;
    id: string;
    applicationInfo: CaptureApplicationInfo;
    event: CaptureEvent;
}

interface CaptureBatch {
    sentTime: string;
    messages: CaptureMessage[];
}

interface CaptureRequest {
    url: URL;
    body?: CaptureBatch;
}

function isSourceEvent(event: CaptureEvent): event is CaptureSourceEvent {
    return event["sourceEvent"] !== undefined;
}

function getPropertyValue(propertyName: string, properties: { [key: string]: BoolProperty | StringProperty }): boolean | string | undefined {
    for (const [key, value] of Object.entries(properties)) {
        if (key === propertyName) {
            if (value["bool"] !== undefined) { return (<BoolProperty>value).bool }
            if (value["string"] !== undefined) { return (<StringProperty>value).string }
            return undefined;
        }
    }
    return undefined;
}


class CaptureServer extends EventEmitter {

    httpServer: Server;

    requests: CaptureRequest[];

    constructor() {
        super();
        this.httpServer = createServer(this.onRequest.bind(this));
        this.requests = [];
    }

    start(port: number) {
        this.httpServer.listen(port);
    }

    stop(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.httpServer.close((error) => {
                if (error) { reject(error); } else { resolve(); }
            });
        });
    }

    reset() {
        this.requests = [];
    }

    onRequest(req: IncomingMessage, res: ServerResponse) {

        const urlStr = req.url;

        if (urlStr) {

            const url = new URL(urlStr, "https://heapanalytics.com/");

            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {

                const request =  body ? { url, body: JSON.parse(body) } : { url };
                this.requests.push(request);
                this.emit('request', request);

                res.writeHead(200);
                res.end('{}');
            });
        }
    }

    waitFor(test: ((request: CaptureRequest) => boolean), timeout: number = 10): Promise<CaptureRequest> {
        return new Promise((resolve, reject) => {

            for (const request of this.requests) {
                if (test(request)) {
                    resolve(request);
                    return;
                }
            }

            function onEvent(request: CaptureRequest) {
                if (test(request)) {
                    resolve(request);
                    clearTimeout(timer);
                }
            }

            const timer = setTimeout(() => {
                reject("timeout\n" + JSON.stringify(this.requests, undefined, 4));
                this.off('request', onEvent);
            }, timeout * 1000);

            this.on('request', onEvent);
        });
    }

    async expectSourceEventWithProperties(
        expectedType: "touch" | "react_navigation_screenview",
        expectedProperties: { [key: string]: string | boolean }): Promise<CaptureSourceEvent> {

        var result: CaptureSourceEvent;

        await this.waitFor((req) => {

            const body = req.body;

            if (req.url.pathname !== '/api/integrations/ios/track' || !body) {
                return false;
            }

            for (const message of body.messages) {
                const event = message.event;

                if (!isSourceEvent(event) || event.sourceEvent.type !== expectedType) { continue; }

                let perfectMatch = true;
                for (const [key, value] of Object.entries(expectedProperties)) {
                    if (getPropertyValue(key, event.sourceEvent.sourceProperties) !== value) {
                        perfectMatch = false;
                        break;
                    }
                }

                if (perfectMatch) {
                    result = event;
                    return true;
                }
            }
        });

        return result;
    }
}

export { CaptureServer }