import type { Server as HttpServer } from 'node:http';
import type { AccessTokenPayload } from '@inithium/types';
import type { PubSub } from '../core/create-pubsub.js';

export type ChannelAuthorizer = (
  user: AccessTokenPayload,
  channel: string,
) => boolean | Promise<boolean>;

export interface CreateSocketServerOptions {
  readonly httpServer: HttpServer;
  readonly pubsub: PubSub;
  readonly canJoinChannel: ChannelAuthorizer;
  readonly corsOrigins: readonly string[];
}