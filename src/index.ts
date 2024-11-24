import { Environment } from './http/environment';
import { SdkConfig } from './http/types';
import { TorrentsService } from './services/torrents';
import { UsenetService } from './services/usenet';
import { WebDownloadsDebridService } from './services/web-downloads-debrid';
import { GeneralService } from './services/general';
import { NotificationsService } from './services/notifications';
import { UserService } from './services/user';
import { RssFeedsService } from './services/rss-feeds';
import { IntegrationsService } from './services/integrations';

export * from './services/torrents';
export * from './services/usenet';
export * from './services/web-downloads-debrid';
export * from './services/general';
export * from './services/notifications';
export * from './services/user';
export * from './services/rss-feeds';
export * from './services/integrations';

export type * from './http';

export class TorboxApi {
  public readonly torrents: TorrentsService;

  public readonly usenet: UsenetService;

  public readonly webDownloadsDebrid: WebDownloadsDebridService;

  public readonly general: GeneralService;

  public readonly notifications: NotificationsService;

  public readonly user: UserService;

  public readonly rssFeeds: RssFeedsService;

  public readonly integrations: IntegrationsService;

  constructor(public config: SdkConfig) {
    const baseUrl = config.environment || config.baseUrl || Environment.DEFAULT;
    this.config = {
      ...config,
      baseUrl,
    };
    this.torrents = new TorrentsService(this.config);

    this.usenet = new UsenetService(this.config);

    this.webDownloadsDebrid = new WebDownloadsDebridService(this.config);

    this.general = new GeneralService(this.config);

    this.notifications = new NotificationsService(this.config);

    this.user = new UserService(this.config);

    this.rssFeeds = new RssFeedsService(this.config);

    this.integrations = new IntegrationsService(this.config);
  }

  set baseUrl(baseUrl: string) {
    this.torrents.baseUrl = baseUrl;
    this.usenet.baseUrl = baseUrl;
    this.webDownloadsDebrid.baseUrl = baseUrl;
    this.general.baseUrl = baseUrl;
    this.notifications.baseUrl = baseUrl;
    this.user.baseUrl = baseUrl;
    this.rssFeeds.baseUrl = baseUrl;
    this.integrations.baseUrl = baseUrl;
  }

  set environment(environment: Environment) {
    this.torrents.baseUrl = environment;
    this.usenet.baseUrl = environment;
    this.webDownloadsDebrid.baseUrl = environment;
    this.general.baseUrl = environment;
    this.notifications.baseUrl = environment;
    this.user.baseUrl = environment;
    this.rssFeeds.baseUrl = environment;
    this.integrations.baseUrl = environment;
  }

  set timeoutMs(timeoutMs: number) {
    this.torrents.timeoutMs = timeoutMs;
    this.usenet.timeoutMs = timeoutMs;
    this.webDownloadsDebrid.timeoutMs = timeoutMs;
    this.general.timeoutMs = timeoutMs;
    this.notifications.timeoutMs = timeoutMs;
    this.user.timeoutMs = timeoutMs;
    this.rssFeeds.timeoutMs = timeoutMs;
    this.integrations.timeoutMs = timeoutMs;
  }

  set token(token: string) {
    this.torrents.token = token;
    this.usenet.token = token;
    this.webDownloadsDebrid.token = token;
    this.general.token = token;
    this.notifications.token = token;
    this.user.token = token;
    this.rssFeeds.token = token;
    this.integrations.token = token;
  }
}

// c029837e0e474b76bc487506e8799df5e3335891efe4fb02bda7a1441840310c
