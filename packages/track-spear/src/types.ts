export enum EventType {
  Click = 'Click',
  RouteChange = 'RouteChange',
  NewVisitor = 'NewVisitor',
}

export interface Event {
  type: EventType;
  userId?: string;
  userName?: string;
  metaData?: unknown;
}

export interface Config {
  rootId?: string;
  userId: string;
  userName?: string;
  events?: EventType[];
}

export enum MessageType {
  IframeDimensions = '__IframeDimensions__',
  IframeElementBounds = '__IframeElementBounds__',
}
