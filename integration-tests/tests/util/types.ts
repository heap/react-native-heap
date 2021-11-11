export interface CaptureEvent {
  appVisibilityState: 0 | 1 | 2;
}

export interface CaptureSourceEvent extends CaptureEvent {
  sourceEvent: CaptureSourceEventPayload;
}

export interface BoolProperty {
  bool: boolean;
}

export interface StringProperty {
  string: string;
}

export interface CaptureSourceEventPayload {
  type?: string;
  name?: string;
  sourceProperties: {[key: string]: BoolProperty | StringProperty};
  source: string;
}

export interface CaptureMessage<T extends CaptureEvent> {
  envId: string;
  id: string;
  event: T | null;
  properties?: {[key: string]: BoolProperty | StringProperty};
  [key: string]: any;
}

export interface CaptureIOSBatch {
  sentTime: string;
  messages: CaptureMessage<CaptureEvent>[];
}

export interface CaptureAndroidBatch {
  events: CaptureMessage<CaptureEvent>[];
}

export interface CaptureAndroidUserProperties {
  properties: {[key: string]: BoolProperty | StringProperty};
}

export interface CaptureAndroidUserMigration {
  fromUserId: number;
  toIdentity: string;
}

export function isSourceEvent(
  event: CaptureEvent,
): event is CaptureSourceEvent {
  return has(event, 'sourceEvent');
}

// This keeps getting formatted away. :(
export function has(obj: any, property: string): boolean {
  return obj && obj[property] !== undefined;
}

export function getPropertyValue(
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

export function matcherForSourceEventWithProperties(
  expectedType: string,
  expectedProperties: {[key: string]: string | boolean},
): (
  message: CaptureMessage<CaptureEvent>,
) => message is CaptureMessage<CaptureSourceEvent> {
  return (message): message is CaptureMessage<CaptureSourceEvent> => {
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
      if (getPropertyValue(key, event.sourceEvent.sourceProperties) !== value) {
        return false;
      }
    }

    return true;
  };
}
