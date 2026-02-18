import { ZodType, z } from 'zod';

declare enum Environment {
    DEFAULT = "https://api.torbox.app"
}

type HttpMethod$1 = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
interface HttpRequest {
    baseUrl: string;
    method: HttpMethod$1;
    path: string;
    headers: Map<string, unknown>;
    body?: BodyInit;
    abortSignal?: AbortSignal;
    queryParams: Map<string, unknown>;
    pathParams: Map<string, unknown>;
}
interface HttpMetadata$1 {
    status: number;
    statusText: string;
    headers: Record<string, string>;
}
interface HttpResponse$1<T> {
    data?: T;
    metadata: HttpMetadata$1;
    raw: ArrayBuffer;
}
interface HttpError$1 {
    error: string;
    metadata: HttpMetadata$1;
}
interface Hook {
    beforeRequest(request: HttpRequest, params: Map<string, string>): Promise<HttpRequest>;
    afterResponse(request: HttpRequest, response: HttpResponse$1<any>, params: Map<string, string>): Promise<HttpResponse$1<any>>;
    onError(request: HttpRequest, response: HttpResponse$1<any>, params: Map<string, string>): Promise<HttpError$1>;
}

declare enum SerializationStyle {
    SIMPLE = "simple",
    LABEL = "label",
    MATRIX = "matrix",
    FORM = "form",
    SPACE_DELIMITED = "space_delimited",
    PIPE_DELIMITED = "pipe_delimited",
    DEEP_OBJECT = "deep_object",
    NONE = "none"
}

interface ResponseDefinition {
    schema: ZodType;
    contentType: ContentType;
    status: number;
}
interface ErrorDefinition {
    error: new (...args: any[]) => Error;
    contentType: ContentType;
    status: number;
}
interface CreateRequestParameters<Page = unknown[]> {
    baseUrl: string;
    method: HttpMethod;
    body?: any;
    headers: Map<string, RequestParameter>;
    queryParams: Map<string, RequestParameter>;
    pathParams: Map<string, RequestParameter>;
    path: string;
    config: SdkConfig;
    responses: ResponseDefinition[];
    errors: ErrorDefinition[];
    requestSchema: ZodType;
    requestContentType: ContentType;
    validation: ValidationOptions;
    retry: RetryOptions;
    pagination?: RequestPagination<Page>;
}
interface RequestParameter {
    key: string | undefined;
    value: unknown;
    explode: boolean;
    encode: boolean;
    style: SerializationStyle;
    isLimit: boolean;
    isOffset: boolean;
}
interface RequestPagination<Page> {
    pageSize: number;
    pagePath: string[];
    pageSchema?: ZodType<Page, any, any>;
}

declare class Request<PageSchema = unknown[]> {
    baseUrl: string;
    headers: Map<string, RequestParameter>;
    queryParams: Map<string, RequestParameter>;
    pathParams: Map<string, RequestParameter>;
    body?: any;
    method: HttpMethod;
    path: string;
    config: SdkConfig;
    responses: ResponseDefinition[];
    errors: ErrorDefinition[];
    requestSchema: ZodType;
    requestContentType: ContentType;
    validation: ValidationOptions;
    retry: RetryOptions;
    pagination?: RequestPagination<PageSchema>;
    private readonly pathPattern;
    constructor(params: CreateRequestParameters<PageSchema>);
    addHeaderParam(key: string, param: RequestParameter): void;
    addQueryParam(key: string, param: RequestParameter): void;
    addPathParam(key: string, param: RequestParameter): void;
    addBody(body: any): void;
    updateFromHookRequest(hookRequest: HttpRequest): void;
    constructFullUrl(): string;
    copy(overrides?: Partial<CreateRequestParameters>): Request<unknown[]>;
    getHeaders(): HeadersInit | undefined;
    nextPage(): void;
    private constructPath;
    private getOffsetParam;
    private getAllParams;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
interface SdkConfig {
    baseUrl?: string;
    environment?: Environment;
    timeoutMs?: number;
    token?: string;
    retry?: RetryOptions;
    validation?: ValidationOptions;
}
interface HttpMetadata {
    status: number;
    statusText: string;
    headers: Record<string, string>;
}
interface HttpResponse<T = unknown> {
    data?: T;
    metadata: HttpMetadata;
    raw: ArrayBuffer;
}
declare enum ContentType {
    Json = "json",
    Xml = "xml",
    Pdf = "pdf",
    Image = "image",
    File = "file",
    Binary = "binary",
    FormUrlEncoded = "form",
    Text = "text",
    MultipartFormData = "multipartFormData",
    EventStream = "eventStream",
    NoContent = "noContent"
}
interface RequestConfig {
    retry?: RetryOptions;
    validation?: ValidationOptions;
    baseUrl?: string;
}
interface RetryOptions {
    attempts: number;
    delayMs?: number;
}
interface ValidationOptions {
    responseValidation?: boolean;
}

declare class HttpError extends Error {
    readonly error: string;
    readonly metadata: HttpMetadata;
    readonly raw?: ArrayBuffer;
    constructor(metadata: HttpMetadata, raw?: ArrayBuffer, error?: string);
}

declare class CustomHook implements Hook {
    beforeRequest(request: HttpRequest, params: Map<string, string>): Promise<HttpRequest>;
    afterResponse(request: HttpRequest, response: HttpResponse$1<any>, params: Map<string, string>): Promise<HttpResponse$1<any>>;
    onError(request: HttpRequest, response: HttpResponse$1<any>, params: Map<string, string>): Promise<HttpError>;
}

declare class HttpClient {
    private config;
    private readonly requestHandlerChain;
    constructor(config: SdkConfig, hook?: CustomHook);
    call<T>(request: Request): Promise<HttpResponse<T>>;
    stream<T>(request: Request): AsyncGenerator<HttpResponse<T>>;
    callPaginated<FullResponse, Page>(request: Request<Page>): Promise<HttpResponse<Page>>;
    setBaseUrl(url: string): void;
    setConfig(config: SdkConfig): void;
    private getPage;
}

declare class BaseService {
    config: SdkConfig;
    client: HttpClient;
    constructor(config: SdkConfig);
    set baseUrl(baseUrl: string);
    set environment(environment: Environment);
    set timeoutMs(timeoutMs: number);
    set token(token: string);
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const createTorrentRequest: z.ZodLazy<z.ZodObject<{
    allowZip: z.ZodOptional<z.ZodString>;
    asQueued: z.ZodOptional<z.ZodString>;
    file: z.ZodOptional<z.ZodType<ArrayBuffer, z.ZodTypeDef, ArrayBuffer>>;
    magnet: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    seed: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    allowZip?: string | undefined;
    asQueued?: string | undefined;
    file?: ArrayBuffer | undefined;
    magnet?: string | undefined;
    name?: string | undefined;
    seed?: string | undefined;
}, {
    allowZip?: string | undefined;
    asQueued?: string | undefined;
    file?: ArrayBuffer | undefined;
    magnet?: string | undefined;
    name?: string | undefined;
    seed?: string | undefined;
}>>;
/**
 *
 * @typedef  {CreateTorrentRequest} createTorrentRequest
 * @property {string} - Tells TorBox if you want to allow this torrent to be zipped or not. TorBox only zips if the torrent is 100 files or larger.
 * @property {string} - Tells TorBox you want this torrent instantly queued. This is bypassed if user is on free plan, and will process the request as normal in this case. Optional.
 * @property {ArrayBuffer} - The torrent's torrent file. Optional.
 * @property {string} - The torrent's magnet link. Optional.
 * @property {string} - The name you want the torrent to be. Optional.
 * @property {string} - Tells TorBox your preference for seeding this torrent. 1 is auto. 2 is seed. 3 is don't seed. Optional. Default is 1, or whatever the user has in their settings. Overwrites option in settings.
 */
type CreateTorrentRequest = z.infer<typeof createTorrentRequest>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const createTorrentOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodLazy<z.ZodObject<{
        activeLimit: z.ZodOptional<z.ZodNumber>;
        authId: z.ZodOptional<z.ZodString>;
        currentActiveDownloads: z.ZodOptional<z.ZodNumber>;
        hash: z.ZodOptional<z.ZodString>;
        queuedId: z.ZodOptional<z.ZodNumber>;
        torrentId: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        activeLimit?: number | undefined;
        authId?: string | undefined;
        currentActiveDownloads?: number | undefined;
        hash?: string | undefined;
        queuedId?: number | undefined;
        torrentId?: number | undefined;
    }, {
        activeLimit?: number | undefined;
        authId?: string | undefined;
        currentActiveDownloads?: number | undefined;
        hash?: string | undefined;
        queuedId?: number | undefined;
        torrentId?: number | undefined;
    }>>>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: {
        activeLimit?: number | undefined;
        authId?: string | undefined;
        currentActiveDownloads?: number | undefined;
        hash?: string | undefined;
        queuedId?: number | undefined;
        torrentId?: number | undefined;
    } | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: {
        activeLimit?: number | undefined;
        authId?: string | undefined;
        currentActiveDownloads?: number | undefined;
        hash?: string | undefined;
        queuedId?: number | undefined;
        torrentId?: number | undefined;
    } | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {CreateTorrentOkResponse} createTorrentOkResponse
 * @property {CreateTorrentOkResponseData}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type CreateTorrentOkResponse = z.infer<typeof createTorrentOkResponse>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const controlTorrentOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: any;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: any;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {ControlTorrentOkResponse} controlTorrentOkResponse
 * @property {any}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type ControlTorrentOkResponse = z.infer<typeof controlTorrentOkResponse>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const requestDownloadLinkOkResponse$1: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodString>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: string | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: string | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {RequestDownloadLinkOkResponse} requestDownloadLinkOkResponse
 * @property {string}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type RequestDownloadLinkOkResponse$1 = z.infer<typeof requestDownloadLinkOkResponse$1>;

interface RequestDownloadLinkParams {
    token?: string;
    torrentId?: string;
    fileId?: string;
    zipLink?: string;
    userIp?: string;
    redirect?: string;
}
interface GetTorrentListParams {
    bypassCache?: string;
    id?: string;
    offset?: string;
    limit?: string;
}
interface GetTorrentCachedAvailabilityParams {
    hash?: string;
    format?: string;
    listFiles?: string;
}
interface ExportTorrentDataParams {
    torrentId?: string;
    type?: string;
}
interface GetTorrentInfoParams {
    hash?: string;
    timeout?: string;
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getTorrentListOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
        active: z.ZodOptional<z.ZodBoolean>;
        authId: z.ZodOptional<z.ZodString>;
        availability: z.ZodOptional<z.ZodNumber>;
        createdAt: z.ZodOptional<z.ZodString>;
        downloadFinished: z.ZodOptional<z.ZodBoolean>;
        downloadPresent: z.ZodOptional<z.ZodBoolean>;
        downloadSpeed: z.ZodOptional<z.ZodNumber>;
        /**
         *
         * @typedef  {GetTorrentListOkResponse} getTorrentListOkResponse
         * @property {GetTorrentListOkResponseData[]}
         * @property {string}
         * @property {any}
         * @property {boolean}
         */
        downloadState: z.ZodOptional<z.ZodString>;
        eta: z.ZodOptional<z.ZodNumber>;
        expiresAt: z.ZodOptional<z.ZodString>;
        files: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
            id: z.ZodOptional<z.ZodNumber>;
            md5: z.ZodOptional<z.ZodString>;
            mimetype: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            s3Path: z.ZodOptional<z.ZodString>;
            shortName: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            id?: number | undefined;
            md5?: string | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }, {
            id?: number | undefined;
            md5?: string | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }>>, "many">>;
        hash: z.ZodOptional<z.ZodString>;
        id: z.ZodOptional<z.ZodNumber>;
        inactiveCheck: z.ZodOptional<z.ZodNumber>;
        magnet: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        peers: z.ZodOptional<z.ZodNumber>;
        progress: z.ZodOptional<z.ZodNumber>;
        ratio: z.ZodOptional<z.ZodNumber>;
        seeds: z.ZodOptional<z.ZodNumber>;
        server: z.ZodOptional<z.ZodNumber>;
        size: z.ZodOptional<z.ZodNumber>;
        torrentFile: z.ZodOptional<z.ZodBoolean>;
        updatedAt: z.ZodOptional<z.ZodString>;
        uploadSpeed: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        active?: boolean | undefined;
        authId?: string | undefined;
        availability?: number | undefined;
        createdAt?: string | undefined;
        downloadFinished?: boolean | undefined;
        downloadPresent?: boolean | undefined;
        downloadSpeed?: number | undefined;
        downloadState?: string | undefined;
        eta?: number | undefined;
        expiresAt?: string | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
        hash?: string | undefined;
        id?: number | undefined;
        inactiveCheck?: number | undefined;
        magnet?: string | undefined;
        name?: string | undefined;
        peers?: number | undefined;
        progress?: number | undefined;
        ratio?: number | undefined;
        seeds?: number | undefined;
        server?: number | undefined;
        size?: number | undefined;
        torrentFile?: boolean | undefined;
        updatedAt?: string | undefined;
        uploadSpeed?: number | undefined;
    }, {
        active?: boolean | undefined;
        authId?: string | undefined;
        availability?: number | undefined;
        createdAt?: string | undefined;
        downloadFinished?: boolean | undefined;
        downloadPresent?: boolean | undefined;
        downloadSpeed?: number | undefined;
        downloadState?: string | undefined;
        eta?: number | undefined;
        expiresAt?: string | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
        hash?: string | undefined;
        id?: number | undefined;
        inactiveCheck?: number | undefined;
        magnet?: string | undefined;
        name?: string | undefined;
        peers?: number | undefined;
        progress?: number | undefined;
        ratio?: number | undefined;
        seeds?: number | undefined;
        server?: number | undefined;
        size?: number | undefined;
        torrentFile?: boolean | undefined;
        updatedAt?: string | undefined;
        uploadSpeed?: number | undefined;
    }>>, "many">>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: {
        active?: boolean | undefined;
        authId?: string | undefined;
        availability?: number | undefined;
        createdAt?: string | undefined;
        downloadFinished?: boolean | undefined;
        downloadPresent?: boolean | undefined;
        downloadSpeed?: number | undefined;
        downloadState?: string | undefined;
        eta?: number | undefined;
        expiresAt?: string | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
        hash?: string | undefined;
        id?: number | undefined;
        inactiveCheck?: number | undefined;
        magnet?: string | undefined;
        name?: string | undefined;
        peers?: number | undefined;
        progress?: number | undefined;
        ratio?: number | undefined;
        seeds?: number | undefined;
        server?: number | undefined;
        size?: number | undefined;
        torrentFile?: boolean | undefined;
        updatedAt?: string | undefined;
        uploadSpeed?: number | undefined;
    }[] | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: {
        active?: boolean | undefined;
        authId?: string | undefined;
        availability?: number | undefined;
        createdAt?: string | undefined;
        downloadFinished?: boolean | undefined;
        downloadPresent?: boolean | undefined;
        downloadSpeed?: number | undefined;
        downloadState?: string | undefined;
        eta?: number | undefined;
        expiresAt?: string | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
        hash?: string | undefined;
        id?: number | undefined;
        inactiveCheck?: number | undefined;
        magnet?: string | undefined;
        name?: string | undefined;
        peers?: number | undefined;
        progress?: number | undefined;
        ratio?: number | undefined;
        seeds?: number | undefined;
        server?: number | undefined;
        size?: number | undefined;
        torrentFile?: boolean | undefined;
        updatedAt?: string | undefined;
        uploadSpeed?: number | undefined;
    }[] | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetTorrentListOkResponse} getTorrentListOkResponse
 * @property {GetTorrentListOkResponseData[]}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type GetTorrentListOkResponse = z.infer<typeof getTorrentListOkResponse>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getTorrentCachedAvailabilityOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodAny>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: any;
    detail?: string | undefined;
    error?: string | null | undefined;
    success?: boolean | undefined;
}, {
    data?: any;
    detail?: string | undefined;
    error?: string | null | undefined;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetTorrentCachedAvailabilityOkResponse} getTorrentCachedAvailabilityOkResponse
 * @property {any}
 * @property {string}
 * @property {string}
 * @property {boolean}
 */
type GetTorrentCachedAvailabilityOkResponse = z.infer<typeof getTorrentCachedAvailabilityOkResponse>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const exportTorrentDataOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodString>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: string | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: string | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {ExportTorrentDataOkResponse} exportTorrentDataOkResponse
 * @property {string}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type ExportTorrentDataOkResponse = z.infer<typeof exportTorrentDataOkResponse>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getTorrentInfoOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodLazy<z.ZodObject<{
        files: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
            size?: number | undefined;
        }, {
            name?: string | undefined;
            size?: number | undefined;
        }>>, "many">>;
        hash: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        peers: z.ZodOptional<z.ZodNumber>;
        seeds: z.ZodOptional<z.ZodNumber>;
        size: z.ZodOptional<z.ZodNumber>;
        trackers: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    }, "strip", z.ZodTypeAny, {
        files?: {
            name?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
        hash?: string | undefined;
        name?: string | undefined;
        peers?: number | undefined;
        seeds?: number | undefined;
        size?: number | undefined;
        trackers?: any[] | undefined;
    }, {
        files?: {
            name?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
        hash?: string | undefined;
        name?: string | undefined;
        peers?: number | undefined;
        seeds?: number | undefined;
        size?: number | undefined;
        trackers?: any[] | undefined;
    }>>>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: {
        files?: {
            name?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
        hash?: string | undefined;
        name?: string | undefined;
        peers?: number | undefined;
        seeds?: number | undefined;
        size?: number | undefined;
        trackers?: any[] | undefined;
    } | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: {
        files?: {
            name?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
        hash?: string | undefined;
        name?: string | undefined;
        peers?: number | undefined;
        seeds?: number | undefined;
        size?: number | undefined;
        trackers?: any[] | undefined;
    } | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetTorrentInfoOkResponse} getTorrentInfoOkResponse
 * @property {GetTorrentInfoOkResponseData}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type GetTorrentInfoOkResponse = z.infer<typeof getTorrentInfoOkResponse>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getTorrentInfo1Request: z.ZodLazy<z.ZodObject<{
    hash: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    hash?: string | undefined;
}, {
    hash?: string | undefined;
}>>;
/**
 *
 * @typedef  {GetTorrentInfo1Request} getTorrentInfo1Request
 * @property {string} - Hash of the torrent you want to get info for. This is required.
 */
type GetTorrentInfo1Request = z.infer<typeof getTorrentInfo1Request>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getTorrentInfo1OkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodLazy<z.ZodObject<{
        files: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
            size?: number | undefined;
        }, {
            name?: string | undefined;
            size?: number | undefined;
        }>>, "many">>;
        hash: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        peers: z.ZodOptional<z.ZodNumber>;
        seeds: z.ZodOptional<z.ZodNumber>;
        size: z.ZodOptional<z.ZodNumber>;
        trackers: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    }, "strip", z.ZodTypeAny, {
        files?: {
            name?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
        hash?: string | undefined;
        name?: string | undefined;
        peers?: number | undefined;
        seeds?: number | undefined;
        size?: number | undefined;
        trackers?: any[] | undefined;
    }, {
        files?: {
            name?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
        hash?: string | undefined;
        name?: string | undefined;
        peers?: number | undefined;
        seeds?: number | undefined;
        size?: number | undefined;
        trackers?: any[] | undefined;
    }>>>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: {
        files?: {
            name?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
        hash?: string | undefined;
        name?: string | undefined;
        peers?: number | undefined;
        seeds?: number | undefined;
        size?: number | undefined;
        trackers?: any[] | undefined;
    } | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: {
        files?: {
            name?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
        hash?: string | undefined;
        name?: string | undefined;
        peers?: number | undefined;
        seeds?: number | undefined;
        size?: number | undefined;
        trackers?: any[] | undefined;
    } | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetTorrentInfo1OkResponse} getTorrentInfo1OkResponse
 * @property {GetTorrentInfo1OkResponseData}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type GetTorrentInfo1OkResponse = z.infer<typeof getTorrentInfo1OkResponse>;

declare class TorrentsService extends BaseService {
    /**
   * ### Overview
  Creates a torrent under your account. Simply send **either** a magnet link, or a torrent file. Once they have been checked, they will begin downloading assuming your account has available active download slots, and they aren't too large.
    
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<CreateTorrentOkResponse>>} Create Torrent Success / Create Torrent Queued / Create Torrent Active Limit Fail
   */
    createTorrent(apiVersion: string, body: CreateTorrentRequest, requestConfig?: RequestConfig): Promise<HttpResponse<CreateTorrentOkResponse>>;
    /**
   * ### Overview
  Controls a torrent. By sending the torrent's ID and the type of operation you want to perform, it will send that request to the torrent client.
  
  Operations are either:
  
  - **Reannounce** `reannounces the torrent to get new peers`
      
  - **Delete** `deletes the torrent from the client and your account permanently`
      
  - **Resume** `resumes a paused torrent`
      
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<ControlTorrentOkResponse>>} Control Torrent Success
   */
    controlTorrent(apiVersion: string, body: any, requestConfig?: RequestConfig): Promise<HttpResponse<ControlTorrentOkResponse>>;
    /**
   * ### Overview
  Requests the download link from the server. Because downloads are metered, TorBox cannot afford to allow free access to the links directly. This endpoint opens the link for 3 hours for downloads. Once a download is started, the user has nearly unlilimited time to download the file. The 1 hour time limit is simply for starting downloads. This prevents long term link sharing.
  
  ### Permalinks
  
  Instead of generating many CDN urls by requesting this endpoint, you can instead create a permalink such as: `https://api.torbox.app/v1/api/torrents/requestdl?token=APIKEY&torrent_id=NUMBER&file_id=NUMBER&redirect=true` and when a user clicks on it, it will automatically redirect them to the CDN link. This saves requests and doesn't abuse the API. Use this method rather than saving CDN links as they are not permanent. To invalidate these permalinks, simply reset your API token or delete the item from your dashboard.
  
  ### Authorization
  
  Requires an API key as a parameter for the `token` parameter.
   * @param {string} apiVersion -
   * @param {string} [params.token] - Your API Key
   * @param {string} [params.torrentId] - The torrent's ID that you want to download
   * @param {string} [params.fileId] - The files's ID that you want to download
   * @param {string} [params.zipLink] - If you want a zip link. Required if no file_id. Takes precedence over file_id if both are given.
   * @param {string} [params.userIp] - The user's IP to determine the closest CDN. Optional.
   * @param {string} [params.redirect] - If you want to redirect the user to the CDN link. This is useful for creating permalinks so that you can just make this request URL the link.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<RequestDownloadLinkOkResponse>>} Request Download Link Success
   */
    requestDownloadLink(apiVersion: string, params?: RequestDownloadLinkParams, requestConfig?: RequestConfig): Promise<HttpResponse<RequestDownloadLinkOkResponse$1>>;
    /**
   * ### Overview
  Gets the user's torrent list. This gives you the needed information to perform other torrent actions. This information only gets updated every 600 seconds, or when the _Request Update On Torrent_ request is sent to the _relay API_.
  
  #### Download States:
  
  - "downloading" -> The torrent is currently downloading.
      
  - "uploading" -> The torrent is currently seeding.
      
  - "stalled (no seeds)" -> The torrent is trying to download, but there are no seeds connected to download from.
      
  - "paused" -> The torrent is paused.
      
  - "completed" -> The torrent is completely downloaded. Do not use this for download completion status.
      
  - "cached" -> The torrent is cached from the server.
      
  - "metaDL" -> The torrent is downloading metadata from the hoard.
      
  - "checkingResumeData" -> The torrent is checking resumable data.
      
  
  All other statuses are basic qBittorrent states. [Check out here for the full list](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-4.1)#torrent-management).
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {string} [params.bypassCache] - Allows you to bypass the cached data, and always get fresh information. Useful if constantly querying for fresh download stats. Otherwise, we request that you save our database a few calls.
   * @param {string} [params.id] - Determines the torrent requested, will return an object rather than list. Optional.
   * @param {string} [params.offset] - Determines the offset of items to get from the database. Default is 0. Optional.
   * @param {string} [params.limit] - Determines the number of items to recieve per request. Default is 1000. Optional.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetTorrentListOkResponse>>} Get Torrent List Success
   */
    getTorrentList(apiVersion: string, params?: GetTorrentListParams, requestConfig?: RequestConfig): Promise<HttpResponse<GetTorrentListOkResponse>>;
    /**
   * ### Overview
  Takes in a list of comma separated torrent hashes and checks if the torrent is cached. This endpoint only gets a max of around 100 at a time, due to http limits in queries. If you want to do more, you can simply do more hash queries. Such as:
  `?hash=XXXX&hash=XXXX&hash=XXXX`
  
  or `?hash=XXXX,XXXX&hash=XXXX&hash=XXXX,XXXX`
  and this will work too. Performance is very fast. Less than 1 second per 100. Time is approximately O(log n) time for those interested in taking it to its max. That is without caching as well. This endpoint stores a cache for an hour.
  
  You may also pass a `format` parameter with the format you want the data in. Options are either `object` or `list`. You can view examples of both below.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {string} [params.hash] - The list of torrent hashes you want to check. Comma seperated.
   * @param {string} [params.format] - Format you want the data in. Acceptable is either "object" or "list". List is the most performant option as it doesn't require modification of the list.
   * @param {string} [params.listFiles] - Allows you to list the files found inside the cached data.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetTorrentCachedAvailabilityOkResponse>>} Get Torrent Cached Availability List With FIles Success / Get Torrent Cached Availability List Success / Get Torrent Cached Availability Object Success / Get Torrent Cached Availability Success Uncached
   */
    getTorrentCachedAvailability(apiVersion: string, params?: GetTorrentCachedAvailabilityParams, requestConfig?: RequestConfig): Promise<HttpResponse<GetTorrentCachedAvailabilityOkResponse>>;
    /**
   * ### Overview
  Exports the magnet or torrent file. Requires a type to be passed. If type is **magnet**, it will return a JSON response with the magnet as a string in the _data_ key. If type is **file**, it will return a bittorrent file as a download. Not compatible with cached downloads.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {string} [params.torrentId] - The torrent's ID.
   * @param {string} [params.type] - Either "magnet" or "file". Tells how the API what to get, and what to respond as. If magnet, it returns a JSON response with the magnet as a string in the data key. If file, it responds with a torrent file download.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<ExportTorrentDataOkResponse>>} Export Torrent Data Magnet / Export Torrent Data File Success
   */
    exportTorrentData(apiVersion: string, params?: ExportTorrentDataParams, requestConfig?: RequestConfig): Promise<HttpResponse<ExportTorrentDataOkResponse>>;
    /**
   * ### Overview
  A general route that allows you to give a hash, and TorBox will return data about the torrent. This data is retrieved from the Bittorrent network, so expect it to take some time. If the request goes longer than 10 seconds, TorBox will cancel it. You can adjust this if you like, but the default is 10 seconds. This route is cached as well, so subsequent requests will be instant.
  
  ### Authorization
  
  None required.
   * @param {string} apiVersion -
   * @param {string} [params.hash] - Hash of the torrent you want to get info for. This is required.
   * @param {string} [params.timeout] - The amount of time you want TorBox to search for the torrent on the Bittorrent network. If the number of seeders is low or even zero, this value may be helpful to move up. Default is 10. Optional.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetTorrentInfoOkResponse>>} Get Torrent Info Success
   */
    getTorrentInfo(apiVersion: string, params?: GetTorrentInfoParams, requestConfig?: RequestConfig): Promise<HttpResponse<GetTorrentInfoOkResponse>>;
    /**
   * ### Overview
  Same as the GET route, but allows posting data such as magnet, and torrent files.
  
  Hashes will have precedence over magnets, and magnets will have precedence over torrent files.
  
  Only proper torrent files are accepted.
  
  At least one of hash, magnet, or torrent file is required.
  
  A general route that allows you to give a hash, and TorBox will return data about the torrent. This data is retrieved from the Bittorrent network, so expect it to take some time. If the request goes longer than 10 seconds, TorBox will cancel it. You can adjust this if you like, but the default is 10 seconds. This route is cached as well, so subsequent requests will be instant.
  
  ### Authorization
  
  None required.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetTorrentInfo1OkResponse>>} Get Torrent Info Success
   */
    getTorrentInfo1(apiVersion: string, body: GetTorrentInfo1Request, requestConfig?: RequestConfig): Promise<HttpResponse<GetTorrentInfo1OkResponse>>;
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const createTorrentOkResponseData: z.ZodLazy<z.ZodObject<{
    activeLimit: z.ZodOptional<z.ZodNumber>;
    authId: z.ZodOptional<z.ZodString>;
    currentActiveDownloads: z.ZodOptional<z.ZodNumber>;
    hash: z.ZodOptional<z.ZodString>;
    queuedId: z.ZodOptional<z.ZodNumber>;
    torrentId: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    activeLimit?: number | undefined;
    authId?: string | undefined;
    currentActiveDownloads?: number | undefined;
    hash?: string | undefined;
    queuedId?: number | undefined;
    torrentId?: number | undefined;
}, {
    activeLimit?: number | undefined;
    authId?: string | undefined;
    currentActiveDownloads?: number | undefined;
    hash?: string | undefined;
    queuedId?: number | undefined;
    torrentId?: number | undefined;
}>>;
/**
 *
 * @typedef  {CreateTorrentOkResponseData} createTorrentOkResponseData
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {number}
 */
type CreateTorrentOkResponseData = z.infer<typeof createTorrentOkResponseData>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const _1: z.ZodLazy<z.ZodObject<{
    cooldownUntil: z.ZodOptional<z.ZodString>;
    currentDownloads: z.ZodOptional<z.ZodNumber>;
    currentTime: z.ZodOptional<z.ZodString>;
    monthlyLimit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    cooldownUntil?: string | undefined;
    currentDownloads?: number | undefined;
    currentTime?: string | undefined;
    monthlyLimit?: number | undefined;
}, {
    cooldownUntil?: string | undefined;
    currentDownloads?: number | undefined;
    currentTime?: string | undefined;
    monthlyLimit?: number | undefined;
}>>;
/**
 *
 * @typedef  {_1} _1
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {number}
 */
type _1 = z.infer<typeof _1>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getTorrentListOkResponseData: z.ZodLazy<z.ZodObject<{
    active: z.ZodOptional<z.ZodBoolean>;
    authId: z.ZodOptional<z.ZodString>;
    availability: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodString>;
    downloadFinished: z.ZodOptional<z.ZodBoolean>;
    downloadPresent: z.ZodOptional<z.ZodBoolean>;
    downloadSpeed: z.ZodOptional<z.ZodNumber>;
    downloadState: z.ZodOptional<z.ZodString>;
    eta: z.ZodOptional<z.ZodNumber>;
    expiresAt: z.ZodOptional<z.ZodString>;
    files: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        md5: z.ZodOptional<z.ZodString>;
        mimetype: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        s3Path: z.ZodOptional<z.ZodString>;
        shortName: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id?: number | undefined;
        md5?: string | undefined;
        mimetype?: string | undefined;
        name?: string | undefined;
        s3Path?: string | undefined;
        shortName?: string | undefined;
        size?: number | undefined;
    }, {
        id?: number | undefined;
        md5?: string | undefined;
        mimetype?: string | undefined;
        name?: string | undefined;
        s3Path?: string | undefined;
        shortName?: string | undefined;
        size?: number | undefined;
    }>>, "many">>;
    hash: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodNumber>;
    inactiveCheck: z.ZodOptional<z.ZodNumber>;
    magnet: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    peers: z.ZodOptional<z.ZodNumber>;
    progress: z.ZodOptional<z.ZodNumber>;
    ratio: z.ZodOptional<z.ZodNumber>;
    seeds: z.ZodOptional<z.ZodNumber>;
    server: z.ZodOptional<z.ZodNumber>;
    size: z.ZodOptional<z.ZodNumber>;
    torrentFile: z.ZodOptional<z.ZodBoolean>;
    updatedAt: z.ZodOptional<z.ZodString>;
    uploadSpeed: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    active?: boolean | undefined;
    authId?: string | undefined;
    availability?: number | undefined;
    createdAt?: string | undefined;
    downloadFinished?: boolean | undefined;
    downloadPresent?: boolean | undefined;
    downloadSpeed?: number | undefined;
    downloadState?: string | undefined;
    eta?: number | undefined;
    expiresAt?: string | undefined;
    files?: {
        id?: number | undefined;
        md5?: string | undefined;
        mimetype?: string | undefined;
        name?: string | undefined;
        s3Path?: string | undefined;
        shortName?: string | undefined;
        size?: number | undefined;
    }[] | undefined;
    hash?: string | undefined;
    id?: number | undefined;
    inactiveCheck?: number | undefined;
    magnet?: string | undefined;
    name?: string | undefined;
    peers?: number | undefined;
    progress?: number | undefined;
    ratio?: number | undefined;
    seeds?: number | undefined;
    server?: number | undefined;
    size?: number | undefined;
    torrentFile?: boolean | undefined;
    updatedAt?: string | undefined;
    uploadSpeed?: number | undefined;
}, {
    active?: boolean | undefined;
    authId?: string | undefined;
    availability?: number | undefined;
    createdAt?: string | undefined;
    downloadFinished?: boolean | undefined;
    downloadPresent?: boolean | undefined;
    downloadSpeed?: number | undefined;
    downloadState?: string | undefined;
    eta?: number | undefined;
    expiresAt?: string | undefined;
    files?: {
        id?: number | undefined;
        md5?: string | undefined;
        mimetype?: string | undefined;
        name?: string | undefined;
        s3Path?: string | undefined;
        shortName?: string | undefined;
        size?: number | undefined;
    }[] | undefined;
    hash?: string | undefined;
    id?: number | undefined;
    inactiveCheck?: number | undefined;
    magnet?: string | undefined;
    name?: string | undefined;
    peers?: number | undefined;
    progress?: number | undefined;
    ratio?: number | undefined;
    seeds?: number | undefined;
    server?: number | undefined;
    size?: number | undefined;
    torrentFile?: boolean | undefined;
    updatedAt?: string | undefined;
    uploadSpeed?: number | undefined;
}>>;
/**
 *
 * @typedef  {GetTorrentListOkResponseData} getTorrentListOkResponseData
 * @property {boolean}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {boolean}
 * @property {boolean}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {DataFiles1[]}
 * @property {string}
 * @property {number}
 * @property {number}
 * @property {string}
 * @property {string}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {boolean}
 * @property {string}
 * @property {number}
 */
type GetTorrentListOkResponseData = z.infer<typeof getTorrentListOkResponseData>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const dataFiles1: z.ZodLazy<z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    md5: z.ZodOptional<z.ZodString>;
    mimetype: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    s3Path: z.ZodOptional<z.ZodString>;
    shortName: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id?: number | undefined;
    md5?: string | undefined;
    mimetype?: string | undefined;
    name?: string | undefined;
    s3Path?: string | undefined;
    shortName?: string | undefined;
    size?: number | undefined;
}, {
    id?: number | undefined;
    md5?: string | undefined;
    mimetype?: string | undefined;
    name?: string | undefined;
    s3Path?: string | undefined;
    shortName?: string | undefined;
    size?: number | undefined;
}>>;
/**
 *
 * @typedef  {DataFiles1} dataFiles1
 * @property {number}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {number}
 */
type DataFiles1 = z.infer<typeof dataFiles1>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getTorrentCachedAvailabilityOkResponseData: z.ZodLazy<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodNumber>;
    hash: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    size?: number | undefined;
    hash?: string | undefined;
}, {
    name?: string | undefined;
    size?: number | undefined;
    hash?: string | undefined;
}>>;
/**
 *
 * @typedef  {GetTorrentCachedAvailabilityOkResponseData} getTorrentCachedAvailabilityOkResponseData
 * @property {string}
 * @property {number}
 * @property {string}
 */
type GetTorrentCachedAvailabilityOkResponseData = z.infer<typeof getTorrentCachedAvailabilityOkResponseData>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getTorrentInfoOkResponseData: z.ZodLazy<z.ZodObject<{
    files: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        size?: number | undefined;
    }, {
        name?: string | undefined;
        size?: number | undefined;
    }>>, "many">>;
    hash: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    peers: z.ZodOptional<z.ZodNumber>;
    seeds: z.ZodOptional<z.ZodNumber>;
    size: z.ZodOptional<z.ZodNumber>;
    trackers: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
}, "strip", z.ZodTypeAny, {
    files?: {
        name?: string | undefined;
        size?: number | undefined;
    }[] | undefined;
    hash?: string | undefined;
    name?: string | undefined;
    peers?: number | undefined;
    seeds?: number | undefined;
    size?: number | undefined;
    trackers?: any[] | undefined;
}, {
    files?: {
        name?: string | undefined;
        size?: number | undefined;
    }[] | undefined;
    hash?: string | undefined;
    name?: string | undefined;
    peers?: number | undefined;
    seeds?: number | undefined;
    size?: number | undefined;
    trackers?: any[] | undefined;
}>>;
/**
 *
 * @typedef  {GetTorrentInfoOkResponseData} getTorrentInfoOkResponseData
 * @property {DataFiles2[]}
 * @property {string}
 * @property {string}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {any[]}
 */
type GetTorrentInfoOkResponseData = z.infer<typeof getTorrentInfoOkResponseData>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const dataFiles2: z.ZodLazy<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    size?: number | undefined;
}, {
    name?: string | undefined;
    size?: number | undefined;
}>>;
/**
 *
 * @typedef  {DataFiles2} dataFiles2
 * @property {string}
 * @property {number}
 */
type DataFiles2 = z.infer<typeof dataFiles2>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getTorrentInfo1OkResponseData: z.ZodLazy<z.ZodObject<{
    files: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        size?: number | undefined;
    }, {
        name?: string | undefined;
        size?: number | undefined;
    }>>, "many">>;
    hash: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    peers: z.ZodOptional<z.ZodNumber>;
    seeds: z.ZodOptional<z.ZodNumber>;
    size: z.ZodOptional<z.ZodNumber>;
    trackers: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
}, "strip", z.ZodTypeAny, {
    files?: {
        name?: string | undefined;
        size?: number | undefined;
    }[] | undefined;
    hash?: string | undefined;
    name?: string | undefined;
    peers?: number | undefined;
    seeds?: number | undefined;
    size?: number | undefined;
    trackers?: any[] | undefined;
}, {
    files?: {
        name?: string | undefined;
        size?: number | undefined;
    }[] | undefined;
    hash?: string | undefined;
    name?: string | undefined;
    peers?: number | undefined;
    seeds?: number | undefined;
    size?: number | undefined;
    trackers?: any[] | undefined;
}>>;
/**
 *
 * @typedef  {GetTorrentInfo1OkResponseData} getTorrentInfo1OkResponseData
 * @property {DataFiles3[]}
 * @property {string}
 * @property {string}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {any[]}
 */
type GetTorrentInfo1OkResponseData = z.infer<typeof getTorrentInfo1OkResponseData>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const dataFiles3: z.ZodLazy<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    size?: number | undefined;
}, {
    name?: string | undefined;
    size?: number | undefined;
}>>;
/**
 *
 * @typedef  {DataFiles3} dataFiles3
 * @property {string}
 * @property {number}
 */
type DataFiles3 = z.infer<typeof dataFiles3>;

declare class __ extends Error {
    data?: _1 | null;
    detail?: string;
    error?: boolean | null;
    success?: boolean;
    constructor(message?: string, response?: unknown);
}

declare class _2 extends Error {
    data?: any | null;
    detail?: string;
    error?: any | null;
    success?: boolean;
    constructor(message?: string, response?: unknown);
}

declare class _3 extends Error {
    data?: any | null;
    detail?: string;
    error?: string;
    success?: boolean;
    constructor(message?: string, response?: unknown);
}

declare class _4 extends Error {
    data?: any | null;
    detail?: string;
    error?: string;
    success?: boolean;
    constructor(message?: string, response?: unknown);
}

declare class _5 extends Error {
    data?: any | null;
    detail?: string;
    error?: string;
    success?: boolean;
    constructor(message?: string, response?: unknown);
}

declare class _6 extends Error {
    data?: any | null;
    detail?: string;
    error?: string;
    success?: boolean;
    constructor(message?: string, response?: unknown);
}

declare class _7 extends Error {
    data?: string;
    detail?: string;
    error?: string;
    success?: boolean;
    constructor(message?: string, response?: unknown);
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const createUsenetDownloadRequest: z.ZodLazy<z.ZodObject<{
    file: z.ZodOptional<z.ZodType<ArrayBuffer, z.ZodTypeDef, ArrayBuffer>>;
    link: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    file?: ArrayBuffer | undefined;
    link?: string | undefined;
    name?: string | undefined;
}, {
    file?: ArrayBuffer | undefined;
    link?: string | undefined;
    name?: string | undefined;
}>>;
/**
 *
 * @typedef  {CreateUsenetDownloadRequest} createUsenetDownloadRequest
 * @property {ArrayBuffer} - An NZB File. Optional.
 * @property {string} - An accessible link to an NZB file. Cannot be a redirection. Optional.
 */
type CreateUsenetDownloadRequest = z.infer<typeof createUsenetDownloadRequest>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const createUsenetDownloadOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodLazy<z.ZodObject<{
        authId: z.ZodOptional<z.ZodString>;
        hash: z.ZodOptional<z.ZodString>;
        usenetdownloadId: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        authId?: string | undefined;
        hash?: string | undefined;
        usenetdownloadId?: number | undefined;
    }, {
        authId?: string | undefined;
        hash?: string | undefined;
        usenetdownloadId?: number | undefined;
    }>>>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: {
        authId?: string | undefined;
        hash?: string | undefined;
        usenetdownloadId?: number | undefined;
    } | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: {
        authId?: string | undefined;
        hash?: string | undefined;
        usenetdownloadId?: number | undefined;
    } | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {CreateUsenetDownloadOkResponse} createUsenetDownloadOkResponse
 * @property {CreateUsenetDownloadOkResponseData}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type CreateUsenetDownloadOkResponse = z.infer<typeof createUsenetDownloadOkResponse>;

interface RequestDownloadLink1Params {
    token?: string;
    usenetId?: string;
    fileId?: string;
    zipLink?: string;
    userIp?: string;
    redirect?: string;
}
interface GetUsenetListParams {
    bypassCache?: string;
    id?: string;
    offset?: string;
    limit?: string;
}
interface GetUsenetCachedAvailabilityParams {
    hashes?: string[];
    format?: string;
    listFiles?: string;
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getUsenetListOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodLazy<z.ZodObject<{
        active: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
        authId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        availability: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        createdAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        downloadFinished: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
        downloadPresent: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
        downloadSpeed: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        downloadState: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        eta: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        expiresAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        files: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
            id: z.ZodOptional<z.ZodNumber>;
            md5: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            mimetype: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            s3Path: z.ZodOptional<z.ZodString>;
            shortName: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }, {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }>>, "many">>>;
        hash: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        id: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        inactiveCheck: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        progress: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        server: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        torrentFile: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
        updatedAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        uploadSpeed: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        active?: boolean | null | undefined;
        authId?: string | null | undefined;
        availability?: number | null | undefined;
        createdAt?: string | null | undefined;
        downloadFinished?: boolean | null | undefined;
        downloadPresent?: boolean | null | undefined;
        downloadSpeed?: number | null | undefined;
        downloadState?: string | null | undefined;
        eta?: number | null | undefined;
        expiresAt?: string | null | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | null | undefined;
        hash?: string | null | undefined;
        id?: number | null | undefined;
        inactiveCheck?: number | null | undefined;
        name?: string | null | undefined;
        progress?: number | null | undefined;
        server?: number | null | undefined;
        size?: number | null | undefined;
        torrentFile?: boolean | null | undefined;
        updatedAt?: string | null | undefined;
        uploadSpeed?: number | null | undefined;
    }, {
        active?: boolean | null | undefined;
        authId?: string | null | undefined;
        availability?: number | null | undefined;
        createdAt?: string | null | undefined;
        downloadFinished?: boolean | null | undefined;
        downloadPresent?: boolean | null | undefined;
        downloadSpeed?: number | null | undefined;
        downloadState?: string | null | undefined;
        eta?: number | null | undefined;
        expiresAt?: string | null | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | null | undefined;
        hash?: string | null | undefined;
        id?: number | null | undefined;
        inactiveCheck?: number | null | undefined;
        name?: string | null | undefined;
        progress?: number | null | undefined;
        server?: number | null | undefined;
        size?: number | null | undefined;
        torrentFile?: boolean | null | undefined;
        updatedAt?: string | null | undefined;
        uploadSpeed?: number | null | undefined;
    }>>, "many">, z.ZodLazy<z.ZodObject<{
        active: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
        authId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        availability: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        createdAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        downloadFinished: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
        downloadPresent: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
        downloadSpeed: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        downloadState: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        eta: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        expiresAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        files: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
            id: z.ZodOptional<z.ZodNumber>;
            md5: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            mimetype: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            s3Path: z.ZodOptional<z.ZodString>;
            shortName: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }, {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }>>, "many">>>;
        hash: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        id: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        inactiveCheck: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        progress: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        server: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        torrentFile: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
        updatedAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        uploadSpeed: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        active?: boolean | null | undefined;
        authId?: string | null | undefined;
        availability?: number | null | undefined;
        createdAt?: string | null | undefined;
        downloadFinished?: boolean | null | undefined;
        downloadPresent?: boolean | null | undefined;
        downloadSpeed?: number | null | undefined;
        downloadState?: string | null | undefined;
        eta?: number | null | undefined;
        expiresAt?: string | null | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | null | undefined;
        hash?: string | null | undefined;
        id?: number | null | undefined;
        inactiveCheck?: number | null | undefined;
        name?: string | null | undefined;
        progress?: number | null | undefined;
        server?: number | null | undefined;
        size?: number | null | undefined;
        torrentFile?: boolean | null | undefined;
        updatedAt?: string | null | undefined;
        uploadSpeed?: number | null | undefined;
    }, {
        active?: boolean | null | undefined;
        authId?: string | null | undefined;
        availability?: number | null | undefined;
        createdAt?: string | null | undefined;
        downloadFinished?: boolean | null | undefined;
        downloadPresent?: boolean | null | undefined;
        downloadSpeed?: number | null | undefined;
        downloadState?: string | null | undefined;
        eta?: number | null | undefined;
        expiresAt?: string | null | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | null | undefined;
        hash?: string | null | undefined;
        id?: number | null | undefined;
        inactiveCheck?: number | null | undefined;
        name?: string | null | undefined;
        progress?: number | null | undefined;
        server?: number | null | undefined;
        size?: number | null | undefined;
        torrentFile?: boolean | null | undefined;
        updatedAt?: string | null | undefined;
        uploadSpeed?: number | null | undefined;
    }>>]>>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: {
        active?: boolean | null | undefined;
        authId?: string | null | undefined;
        availability?: number | null | undefined;
        createdAt?: string | null | undefined;
        downloadFinished?: boolean | null | undefined;
        downloadPresent?: boolean | null | undefined;
        downloadSpeed?: number | null | undefined;
        downloadState?: string | null | undefined;
        eta?: number | null | undefined;
        expiresAt?: string | null | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | null | undefined;
        hash?: string | null | undefined;
        id?: number | null | undefined;
        inactiveCheck?: number | null | undefined;
        name?: string | null | undefined;
        progress?: number | null | undefined;
        server?: number | null | undefined;
        size?: number | null | undefined;
        torrentFile?: boolean | null | undefined;
        updatedAt?: string | null | undefined;
        uploadSpeed?: number | null | undefined;
    } | {
        active?: boolean | null | undefined;
        authId?: string | null | undefined;
        availability?: number | null | undefined;
        createdAt?: string | null | undefined;
        downloadFinished?: boolean | null | undefined;
        downloadPresent?: boolean | null | undefined;
        downloadSpeed?: number | null | undefined;
        downloadState?: string | null | undefined;
        eta?: number | null | undefined;
        expiresAt?: string | null | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | null | undefined;
        hash?: string | null | undefined;
        id?: number | null | undefined;
        inactiveCheck?: number | null | undefined;
        name?: string | null | undefined;
        progress?: number | null | undefined;
        server?: number | null | undefined;
        size?: number | null | undefined;
        torrentFile?: boolean | null | undefined;
        updatedAt?: string | null | undefined;
        uploadSpeed?: number | null | undefined;
    }[] | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: {
        active?: boolean | null | undefined;
        authId?: string | null | undefined;
        availability?: number | null | undefined;
        createdAt?: string | null | undefined;
        downloadFinished?: boolean | null | undefined;
        downloadPresent?: boolean | null | undefined;
        downloadSpeed?: number | null | undefined;
        downloadState?: string | null | undefined;
        eta?: number | null | undefined;
        expiresAt?: string | null | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | null | undefined;
        hash?: string | null | undefined;
        id?: number | null | undefined;
        inactiveCheck?: number | null | undefined;
        name?: string | null | undefined;
        progress?: number | null | undefined;
        server?: number | null | undefined;
        size?: number | null | undefined;
        torrentFile?: boolean | null | undefined;
        updatedAt?: string | null | undefined;
        uploadSpeed?: number | null | undefined;
    } | {
        active?: boolean | null | undefined;
        authId?: string | null | undefined;
        availability?: number | null | undefined;
        createdAt?: string | null | undefined;
        downloadFinished?: boolean | null | undefined;
        downloadPresent?: boolean | null | undefined;
        downloadSpeed?: number | null | undefined;
        downloadState?: string | null | undefined;
        eta?: number | null | undefined;
        expiresAt?: string | null | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | null | undefined;
        hash?: string | null | undefined;
        id?: number | null | undefined;
        inactiveCheck?: number | null | undefined;
        name?: string | null | undefined;
        progress?: number | null | undefined;
        server?: number | null | undefined;
        size?: number | null | undefined;
        torrentFile?: boolean | null | undefined;
        updatedAt?: string | null | undefined;
        uploadSpeed?: number | null | undefined;
    }[] | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetUsenetListOkResponse} getUsenetListOkResponse
 * @property {GetUsenetListOkResponseData[]}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type GetUsenetListOkResponse = z.infer<typeof getUsenetListOkResponse>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const requestDownloadLinkOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodString>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: string | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: string | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {RequestDownloadLinkOkResponse} requestDownloadLinkOkResponse
 * @property {string}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type RequestDownloadLinkOkResponse = z.infer<typeof requestDownloadLinkOkResponse>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getUsenetCachedAvailabilityOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodLazy<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodNumber>;
        hash: z.ZodOptional<z.ZodString>;
        files: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
            id: z.ZodOptional<z.ZodNumber>;
            md5: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            mimetype: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            s3Path: z.ZodOptional<z.ZodString>;
            shortName: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }, {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }>>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        size?: number | undefined;
        hash?: string | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
    }, {
        name?: string | undefined;
        size?: number | undefined;
        hash?: string | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
    }>>, "many">, z.ZodRecord<z.ZodString, z.ZodLazy<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodNumber>;
        hash: z.ZodOptional<z.ZodString>;
        files: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
            id: z.ZodOptional<z.ZodNumber>;
            md5: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            mimetype: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            s3Path: z.ZodOptional<z.ZodString>;
            shortName: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }, {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }>>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        size?: number | undefined;
        hash?: string | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
    }, {
        name?: string | undefined;
        size?: number | undefined;
        hash?: string | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
    }>>>]>>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: {
        name?: string | undefined;
        size?: number | undefined;
        hash?: string | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
    }[] | Record<string, {
        name?: string | undefined;
        size?: number | undefined;
        hash?: string | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
    }> | undefined;
    detail?: string | undefined;
    error?: string | null | undefined;
    success?: boolean | undefined;
}, {
    data?: {
        name?: string | undefined;
        size?: number | undefined;
        hash?: string | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
    }[] | Record<string, {
        name?: string | undefined;
        size?: number | undefined;
        hash?: string | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | null | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
    }> | undefined;
    detail?: string | undefined;
    error?: string | null | undefined;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetUsenetCachedAvailabilityOkResponse} getUsenetCachedAvailabilityOkResponse
 * @property {any}
 * @property {string}
 * @property {string}
 * @property {boolean}
 */
type GetUsenetCachedAvailabilityOkResponse = z.infer<typeof getUsenetCachedAvailabilityOkResponse>;

declare class UsenetService extends BaseService {
    /**
   * ### Overview
  Creates a usenet download under your account. Simply send **either** a link, or an nzb file. Once they have been checked, they will begin downloading assuming your account has available active download slots, and they aren't too large.
  
  #### Post Processing Options:
  
  All post processing options that the Usenet client will perform before TorBox's own processing to make the files available. It is recommended you either don't send this parameter, or keep it at `-1` for default, which will give only the wanted files.
  
  - `-1`, Default. This runs repairs, and extractions as well as deletes the source files leaving only the wanted downloaded files.
      
  - `0`, None. No post-processing at all. Just download all the files (including all PAR2). TorBox will still do its normal processing to make the download available, but no repairs, or extraction will take place.
      
  - `1`, Repair. Download files and do a PAR2 verification. If the verification fails, download more PAR2 files and attempt to repair the files.
      
  - `2`, Repair and Unpack. Download all files, do a PAR2 verification and unpack the files. The final folder will also include the RAR and ZIP files.
      
  - `3`, Repair, Unpack and Delete. Download all files, do a PAR2 verification, unpack the files to the final folder and delete the source files.
      
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<CreateUsenetDownloadOkResponse>>} Create Usenet Download
   */
    createUsenetDownload(apiVersion: string, body: CreateUsenetDownloadRequest, requestConfig?: RequestConfig): Promise<HttpResponse<CreateUsenetDownloadOkResponse>>;
    /**
   * ### Overview
  Controls a usenet download. By sending the usenet download's ID and the type of operation you want to perform, it will send that request to the usenet client.
  
  Operations are either:
  
  - **Delete** `deletes the nzb from the client and your account permanently`
      
  - **Pause** `pauses a nzb's download`
      
  - **Resume** `resumes a paused usenet download`
      
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    controlUsenetDownload(apiVersion: string, body: any, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Requests the download link from the server. Because downloads are metered, TorBox cannot afford to allow free access to the links directly. This endpoint opens the link for 3 hours for downloads. Once a download is started, the user has nearly unlilimited time to download the file. The 1 hour time limit is simply for starting downloads. This prevents long term link sharing.
  
  ### Permalinks
  
  Instead of generating many CDN urls by requesting this endpoint, you can instead create a permalink such as: `https://api.torbox.app/v1/api/torrents/requestdl?token=APIKEY&torrent_id=NUMBER&file_id=NUMBER&redirect=true` and when a user clicks on it, it will automatically redirect them to the CDN link. This saves requests and doesn't abuse the API. Use this method rather than saving CDN links as they are not permanent. To invalidate these permalinks, simply reset your API token or delete the item from your dashboard.
  
  ### Authorization
  
  Requires an API key as a parameter for the `token` parameter.
   * @param {string} apiVersion -
   * @param {string} [params.token] - Your API Key
   * @param {string} [params.usenetId] - The usenet download's ID that you want to download
   * @param {string} [params.fileId] - The files's ID that you want to download
   * @param {string} [params.zipLink] - If you want a zip link. Required if no file_id. Takes precedence over file_id if both are given.
   * @param {string} [params.userIp] - The user's IP to determine the closest CDN. Optional.
   * @param {string} [params.redirect] - If you want to redirect the user to the CDN link. This is useful for creating permalinks so that you can just make this request URL the link.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<RequestDownloadLinkOkResponse>>}
   */
    requestDownloadLink(apiVersion: string, params?: RequestDownloadLink1Params, requestConfig?: RequestConfig): Promise<HttpResponse<RequestDownloadLinkOkResponse>>;
    /**
   * ### Overview
  Gets the user's usenet download list. This gives you the needed information to perform other usenet actions. Unlike Torrents, this information is updated on its own every 5 seconds for live usenet downloads.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {string} [params.bypassCache] - Allows you to bypass the cached data, and always get fresh information. Useful if constantly querying for fresh download stats. Otherwise, we request that you save our database a few calls.
   * @param {string} [params.id] - Determines the usenet download requested, will return an object rather than list. Optional.
   * @param {string} [params.offset] - Determines the offset of items to get from the database. Default is 0. Optional.
   * @param {string} [params.limit] - Determines the number of items to recieve per request. Default is 1000. Optional.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetUsenetListOkResponse>>} Get Usenet List Success
   */
    getUsenetList(apiVersion: string, params?: GetUsenetListParams, requestConfig?: RequestConfig): Promise<HttpResponse<GetUsenetListOkResponse>>;
    /**
   * ### Overview
  Takes in a list of comma separated usenet hashes and checks if the usenet download is cached. This endpoint only gets a max of around 100 at a time, due to http limits in queries. If you want to do more, you can simply do more hash queries. Such as:
  `?hash=XXXX&hash=XXXX&hash=XXXX`
  
  or `?hash=XXXX,XXXX&hash=XXXX&hash=XXXX,XXXX`
  and this will work too. Performance is very fast. Less than 1 second per 100. Time is approximately O(log n) time for those interested in taking it to its max. That is without caching as well. This endpoint stores a cache for an hour.
  
  You may also pass a `format` parameter with the format you want the data in. Options are either `object` or `list`. You can view examples of both below.
  
  To get the hash of a usenet download, pass the link or file through an md5 hash algo and it will return the proper hash for it.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {string[]} [params.hashes] - The list of usenet hashes you want to check. To find the hash, md5 the link of the usenet link or file.
   * @param {string} [params.format] - Format you want the data in. Acceptable is either "object" or "list". List is the most performant option as it doesn't require modification of the list.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetUsenetCachedAvailabilityOkResponse>>}
   */
    getUsenetCachedAvailability(apiVersion: string, params?: GetUsenetCachedAvailabilityParams, requestConfig?: RequestConfig): Promise<HttpResponse<GetUsenetCachedAvailabilityOkResponse>>;
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const createUsenetDownloadOkResponseData: z.ZodLazy<z.ZodObject<{
    authId: z.ZodOptional<z.ZodString>;
    hash: z.ZodOptional<z.ZodString>;
    usenetdownloadId: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    authId?: string | undefined;
    hash?: string | undefined;
    usenetdownloadId?: number | undefined;
}, {
    authId?: string | undefined;
    hash?: string | undefined;
    usenetdownloadId?: number | undefined;
}>>;
/**
 *
 * @typedef  {CreateUsenetDownloadOkResponseData} createUsenetDownloadOkResponseData
 * @property {string}
 * @property {string}
 * @property {string}
 */
type CreateUsenetDownloadOkResponseData = z.infer<typeof createUsenetDownloadOkResponseData>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getUsenetListOkResponseData: z.ZodLazy<z.ZodObject<{
    active: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    authId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    availability: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    createdAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    downloadFinished: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    downloadPresent: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    downloadSpeed: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    downloadState: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    eta: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    expiresAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    files: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        md5: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        mimetype: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        s3Path: z.ZodOptional<z.ZodString>;
        shortName: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id?: number | undefined;
        md5?: string | null | undefined;
        mimetype?: string | undefined;
        name?: string | undefined;
        s3Path?: string | undefined;
        shortName?: string | undefined;
        size?: number | undefined;
    }, {
        id?: number | undefined;
        md5?: string | null | undefined;
        mimetype?: string | undefined;
        name?: string | undefined;
        s3Path?: string | undefined;
        shortName?: string | undefined;
        size?: number | undefined;
    }>>, "many">>>;
    hash: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    id: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    inactiveCheck: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    progress: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    server: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    torrentFile: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    updatedAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    uploadSpeed: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    active?: boolean | null | undefined;
    authId?: string | null | undefined;
    availability?: number | null | undefined;
    createdAt?: string | null | undefined;
    downloadFinished?: boolean | null | undefined;
    downloadPresent?: boolean | null | undefined;
    downloadSpeed?: number | null | undefined;
    downloadState?: string | null | undefined;
    eta?: number | null | undefined;
    expiresAt?: string | null | undefined;
    files?: {
        id?: number | undefined;
        md5?: string | null | undefined;
        mimetype?: string | undefined;
        name?: string | undefined;
        s3Path?: string | undefined;
        shortName?: string | undefined;
        size?: number | undefined;
    }[] | null | undefined;
    hash?: string | null | undefined;
    id?: number | null | undefined;
    inactiveCheck?: number | null | undefined;
    name?: string | null | undefined;
    progress?: number | null | undefined;
    server?: number | null | undefined;
    size?: number | null | undefined;
    torrentFile?: boolean | null | undefined;
    updatedAt?: string | null | undefined;
    uploadSpeed?: number | null | undefined;
}, {
    active?: boolean | null | undefined;
    authId?: string | null | undefined;
    availability?: number | null | undefined;
    createdAt?: string | null | undefined;
    downloadFinished?: boolean | null | undefined;
    downloadPresent?: boolean | null | undefined;
    downloadSpeed?: number | null | undefined;
    downloadState?: string | null | undefined;
    eta?: number | null | undefined;
    expiresAt?: string | null | undefined;
    files?: {
        id?: number | undefined;
        md5?: string | null | undefined;
        mimetype?: string | undefined;
        name?: string | undefined;
        s3Path?: string | undefined;
        shortName?: string | undefined;
        size?: number | undefined;
    }[] | null | undefined;
    hash?: string | null | undefined;
    id?: number | null | undefined;
    inactiveCheck?: number | null | undefined;
    name?: string | null | undefined;
    progress?: number | null | undefined;
    server?: number | null | undefined;
    size?: number | null | undefined;
    torrentFile?: boolean | null | undefined;
    updatedAt?: string | null | undefined;
    uploadSpeed?: number | null | undefined;
}>>;
/**
 *
 * @typedef  {GetUsenetListOkResponseData} getUsenetListOkResponseData
 * @property {boolean}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {boolean}
 * @property {boolean}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {DataFiles4[]}
 * @property {string}
 * @property {number}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {boolean}
 * @property {string}
 * @property {number}
 */
type GetUsenetListOkResponseData = z.infer<typeof getUsenetListOkResponseData>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const dataFiles4: z.ZodLazy<z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    md5: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    mimetype: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    s3Path: z.ZodOptional<z.ZodString>;
    shortName: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id?: number | undefined;
    md5?: string | null | undefined;
    mimetype?: string | undefined;
    name?: string | undefined;
    s3Path?: string | undefined;
    shortName?: string | undefined;
    size?: number | undefined;
}, {
    id?: number | undefined;
    md5?: string | null | undefined;
    mimetype?: string | undefined;
    name?: string | undefined;
    s3Path?: string | undefined;
    shortName?: string | undefined;
    size?: number | undefined;
}>>;
/**
 *
 * @typedef  {DataFiles4} dataFiles4
 * @property {number}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {number}
 */
type DataFiles4 = z.infer<typeof dataFiles4>;

declare class _8 extends Error {
    data?: any | null;
    detail?: string;
    error?: string;
    success?: boolean;
    constructor(message?: string, response?: unknown);
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const createWebDownloadRequest: z.ZodLazy<z.ZodObject<{
    link: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    link?: string | undefined;
}, {
    link?: string | undefined;
}>>;
/**
 *
 * @typedef  {CreateWebDownloadRequest} createWebDownloadRequest
 * @property {string} - An accessible link to any file on the internet. Cannot be a redirection.
 */
type CreateWebDownloadRequest = z.infer<typeof createWebDownloadRequest>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const createWebDownloadOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodLazy<z.ZodObject<{
        authId: z.ZodOptional<z.ZodString>;
        hash: z.ZodOptional<z.ZodString>;
        webdownloadId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        authId?: string | undefined;
        hash?: string | undefined;
        webdownloadId?: string | undefined;
    }, {
        authId?: string | undefined;
        hash?: string | undefined;
        webdownloadId?: string | undefined;
    }>>>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: {
        authId?: string | undefined;
        hash?: string | undefined;
        webdownloadId?: string | undefined;
    } | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: {
        authId?: string | undefined;
        hash?: string | undefined;
        webdownloadId?: string | undefined;
    } | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {CreateWebDownloadOkResponse} createWebDownloadOkResponse
 * @property {CreateWebDownloadOkResponseData}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type CreateWebDownloadOkResponse = z.infer<typeof createWebDownloadOkResponse>;

interface ControlWebDownloadParams {
    bypassCache?: string;
    id?: string;
}
interface RequestDownloadLink2Params {
    token?: string;
    webId?: string;
    fileId?: string;
    zipLink?: string;
    userIp?: string;
    redirect?: string;
}
interface GetWebDownloadListParams {
    bypassCache?: string;
    id?: string;
    offset?: string;
    limit?: string;
}
interface GetWebDownloadCachedAvailabilityParams {
    hash?: string;
    format?: string;
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getWebDownloadListOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
        active: z.ZodOptional<z.ZodBoolean>;
        authId: z.ZodOptional<z.ZodString>;
        availability: z.ZodOptional<z.ZodNumber>;
        createdAt: z.ZodOptional<z.ZodString>;
        downloadFinished: z.ZodOptional<z.ZodBoolean>;
        downloadPresent: z.ZodOptional<z.ZodBoolean>;
        downloadSpeed: z.ZodOptional<z.ZodNumber>;
        downloadState: z.ZodOptional<z.ZodString>;
        error: z.ZodOptional<z.ZodString>;
        eta: z.ZodOptional<z.ZodNumber>;
        expiresAt: z.ZodOptional<z.ZodString>;
        files: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
            id: z.ZodOptional<z.ZodNumber>;
            md5: z.ZodOptional<z.ZodString>;
            mimetype: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            s3Path: z.ZodOptional<z.ZodString>;
            shortName: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            id?: number | undefined;
            md5?: string | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }, {
            id?: number | undefined;
            md5?: string | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }>>, "many">>;
        hash: z.ZodOptional<z.ZodString>;
        id: z.ZodOptional<z.ZodNumber>;
        inactiveCheck: z.ZodOptional<z.ZodNumber>;
        name: z.ZodOptional<z.ZodString>;
        progress: z.ZodOptional<z.ZodNumber>;
        server: z.ZodOptional<z.ZodNumber>;
        size: z.ZodOptional<z.ZodNumber>;
        torrentFile: z.ZodOptional<z.ZodBoolean>;
        updatedAt: z.ZodOptional<z.ZodString>;
        uploadSpeed: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        active?: boolean | undefined;
        authId?: string | undefined;
        availability?: number | undefined;
        createdAt?: string | undefined;
        downloadFinished?: boolean | undefined;
        downloadPresent?: boolean | undefined;
        downloadSpeed?: number | undefined;
        downloadState?: string | undefined;
        error?: string | undefined;
        eta?: number | undefined;
        expiresAt?: string | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
        hash?: string | undefined;
        id?: number | undefined;
        inactiveCheck?: number | undefined;
        name?: string | undefined;
        progress?: number | undefined;
        server?: number | undefined;
        size?: number | undefined;
        torrentFile?: boolean | undefined;
        updatedAt?: string | undefined;
        uploadSpeed?: number | undefined;
    }, {
        active?: boolean | undefined;
        authId?: string | undefined;
        availability?: number | undefined;
        createdAt?: string | undefined;
        downloadFinished?: boolean | undefined;
        downloadPresent?: boolean | undefined;
        downloadSpeed?: number | undefined;
        downloadState?: string | undefined;
        error?: string | undefined;
        eta?: number | undefined;
        expiresAt?: string | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
        hash?: string | undefined;
        id?: number | undefined;
        inactiveCheck?: number | undefined;
        name?: string | undefined;
        progress?: number | undefined;
        server?: number | undefined;
        size?: number | undefined;
        torrentFile?: boolean | undefined;
        updatedAt?: string | undefined;
        uploadSpeed?: number | undefined;
    }>>, "many">>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: {
        active?: boolean | undefined;
        authId?: string | undefined;
        availability?: number | undefined;
        createdAt?: string | undefined;
        downloadFinished?: boolean | undefined;
        downloadPresent?: boolean | undefined;
        downloadSpeed?: number | undefined;
        downloadState?: string | undefined;
        error?: string | undefined;
        eta?: number | undefined;
        expiresAt?: string | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
        hash?: string | undefined;
        id?: number | undefined;
        inactiveCheck?: number | undefined;
        name?: string | undefined;
        progress?: number | undefined;
        server?: number | undefined;
        size?: number | undefined;
        torrentFile?: boolean | undefined;
        updatedAt?: string | undefined;
        uploadSpeed?: number | undefined;
    }[] | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: {
        active?: boolean | undefined;
        authId?: string | undefined;
        availability?: number | undefined;
        createdAt?: string | undefined;
        downloadFinished?: boolean | undefined;
        downloadPresent?: boolean | undefined;
        downloadSpeed?: number | undefined;
        downloadState?: string | undefined;
        error?: string | undefined;
        eta?: number | undefined;
        expiresAt?: string | undefined;
        files?: {
            id?: number | undefined;
            md5?: string | undefined;
            mimetype?: string | undefined;
            name?: string | undefined;
            s3Path?: string | undefined;
            shortName?: string | undefined;
            size?: number | undefined;
        }[] | undefined;
        hash?: string | undefined;
        id?: number | undefined;
        inactiveCheck?: number | undefined;
        name?: string | undefined;
        progress?: number | undefined;
        server?: number | undefined;
        size?: number | undefined;
        torrentFile?: boolean | undefined;
        updatedAt?: string | undefined;
        uploadSpeed?: number | undefined;
    }[] | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetWebDownloadListOkResponse} getWebDownloadListOkResponse
 * @property {GetWebDownloadListOkResponseData[]}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type GetWebDownloadListOkResponse = z.infer<typeof getWebDownloadListOkResponse>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getHosterListOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
        dailyBandwidthLimit: z.ZodOptional<z.ZodNumber>;
        dailyBandwidthUsed: z.ZodOptional<z.ZodNumber>;
        dailyLinkLimit: z.ZodOptional<z.ZodNumber>;
        dailyLinkUsed: z.ZodOptional<z.ZodNumber>;
        domains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        domais: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        domaisn: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        icon: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
        name: z.ZodOptional<z.ZodString>;
        note: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        status: z.ZodOptional<z.ZodBoolean>;
        type: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        dailyBandwidthLimit?: number | undefined;
        dailyBandwidthUsed?: number | undefined;
        dailyLinkLimit?: number | undefined;
        dailyLinkUsed?: number | undefined;
        domains?: string[] | undefined;
        domais?: string[] | undefined;
        domaisn?: string[] | undefined;
        icon?: string | undefined;
        limit?: number | undefined;
        name?: string | undefined;
        note?: string | null | undefined;
        status?: boolean | undefined;
        type?: string | undefined;
        url?: string | undefined;
    }, {
        dailyBandwidthLimit?: number | undefined;
        dailyBandwidthUsed?: number | undefined;
        dailyLinkLimit?: number | undefined;
        dailyLinkUsed?: number | undefined;
        domains?: string[] | undefined;
        domais?: string[] | undefined;
        domaisn?: string[] | undefined;
        icon?: string | undefined;
        limit?: number | undefined;
        name?: string | undefined;
        note?: string | null | undefined;
        status?: boolean | undefined;
        type?: string | undefined;
        url?: string | undefined;
    }>>, "many">>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: {
        dailyBandwidthLimit?: number | undefined;
        dailyBandwidthUsed?: number | undefined;
        dailyLinkLimit?: number | undefined;
        dailyLinkUsed?: number | undefined;
        domains?: string[] | undefined;
        domais?: string[] | undefined;
        domaisn?: string[] | undefined;
        icon?: string | undefined;
        limit?: number | undefined;
        name?: string | undefined;
        note?: string | null | undefined;
        status?: boolean | undefined;
        type?: string | undefined;
        url?: string | undefined;
    }[] | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: {
        dailyBandwidthLimit?: number | undefined;
        dailyBandwidthUsed?: number | undefined;
        dailyLinkLimit?: number | undefined;
        dailyLinkUsed?: number | undefined;
        domains?: string[] | undefined;
        domais?: string[] | undefined;
        domaisn?: string[] | undefined;
        icon?: string | undefined;
        limit?: number | undefined;
        name?: string | undefined;
        note?: string | null | undefined;
        status?: boolean | undefined;
        type?: string | undefined;
        url?: string | undefined;
    }[] | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetHosterListOkResponse} getHosterListOkResponse
 * @property {GetHosterListOkResponseData[]}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type GetHosterListOkResponse = z.infer<typeof getHosterListOkResponse>;

declare class WebDownloadsDebridService extends BaseService {
    /**
   * ### Overview
  Creates a web download under your account. Simply send a link to any file on the internet. Once it has been checked, it will begin downloading assuming your account has available active download slots, and they aren't too large.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<CreateWebDownloadOkResponse>>} Create Web Download Success
   */
    createWebDownload(apiVersion: string, body: CreateWebDownloadRequest, requestConfig?: RequestConfig): Promise<HttpResponse<CreateWebDownloadOkResponse>>;
    /**
   * ### Overview
  Controls a web download. By sending the web download's ID and the type of operation you want to perform, it will send that request to the debrid client.
  
  Operations are either:
  
  - **Delete** `deletes the download from the client and your account permanently`
      
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {string} [params.bypassCache] -
   * @param {string} [params.id] - Determines the web download requested, will return an object rather than list. Optional.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    controlWebDownload(apiVersion: string, body: any, params?: ControlWebDownloadParams, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Requests the download link from the server. Because downloads are metered, TorBox cannot afford to allow free access to the links directly. This endpoint opens the link for 3 hours for downloads. Once a download is started, the user has nearly unlilimited time to download the file. The 1 hour time limit is simply for starting downloads. This prevents long term link sharing.
  
  ### Permalinks
  
  Instead of generating many CDN urls by requesting this endpoint, you can instead create a permalink such as: `https://api.torbox.app/v1/api/torrents/requestdl?token=APIKEY&torrent_id=NUMBER&file_id=NUMBER&redirect=true` and when a user clicks on it, it will automatically redirect them to the CDN link. This saves requests and doesn't abuse the API. Use this method rather than saving CDN links as they are not permanent. To invalidate these permalinks, simply reset your API token or delete the item from your dashboard.
  
  ### Authorization
  
  Requires an API key as a parameter for the `token` parameter.
   * @param {string} apiVersion -
   * @param {string} [params.token] - Your API Key
   * @param {string} [params.webId] - The web download's ID that you want to download
   * @param {string} [params.fileId] - The files's ID that you want to download
   * @param {string} [params.zipLink] - If you want a zip link. Required if no file_id. Takes precedence over file_id if both are given.
   * @param {string} [params.userIp] - The user's IP to determine the closest CDN. Optional.
   * @param {string} [params.redirect] - If you want to redirect the user to the CDN link. This is useful for creating permalinks so that you can just make this request URL the link.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    requestDownloadLink2(apiVersion: string, params?: RequestDownloadLink2Params, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Gets the user's web download list. This gives you the needed information to perform other usenet actions. Unlike Torrents, this information is updated on its own every 5 seconds for live web downloads.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {string} [params.bypassCache] - Allows you to bypass the cached data, and always get fresh information. Useful if constantly querying for fresh download stats. Otherwise, we request that you save our database a few calls.
   * @param {string} [params.id] - Determines the torrent requested, will return an object rather than list. Optional.
   * @param {string} [params.offset] - Determines the offset of items to get from the database. Default is 0. Optional.
   * @param {string} [params.limit] - Determines the number of items to recieve per request. Default is 1000. Optional.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetWebDownloadListOkResponse>>} Get Usenet List Success
   */
    getWebDownloadList(apiVersion: string, params?: GetWebDownloadListParams, requestConfig?: RequestConfig): Promise<HttpResponse<GetWebDownloadListOkResponse>>;
    /**
   * ### Overview
  Takes in a list of comma separated usenet hashes and checks if the web download is cached. This endpoint only gets a max of around 100 at a time, due to http limits in queries. If you want to do more, you can simply do more hash queries. Such as:
  `?hash=XXXX&hash=XXXX&hash=XXXX`
  
  or `?hash=XXXX,XXXX&hash=XXXX&hash=XXXX,XXXX`
  and this will work too. Performance is very fast. Less than 1 second per 100. Time is approximately O(log n) time for those interested in taking it to its max. That is without caching as well. This endpoint stores a cache for an hour.
  
  You may also pass a `format` parameter with the format you want the data in. Options are either `object` or `list`. You can view examples of both below.
  
  To get the hash of a web download, pass the link through an md5 hash algo and it will return the proper hash for it.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {string} [params.hash] - The list of web hashes you want to check. Comma seperated. To find the hash, md5 the link.
  
   * @param {string} [params.format] - Format you want the data in. Acceptable is either "object" or "list". List is the most performant option as it doesn't require modification of the list.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    getWebDownloadCachedAvailability(apiVersion: string, params?: GetWebDownloadCachedAvailabilityParams, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  A dynamic list of hosters that TorBox is capable of downloading through its paid service.
  
  - **Name** - a clean name for display use, the well known name of the service, should be recognizable to users.
      
  - **Domains** - an array of known domains that the hoster uses. While each may serve a different purpose it is still included.
      
  - **URL** - the main url of the service. This should take you to the home page or a service page of the hoster.
      
  - **Icon** - a square image, usually a favicon or logo, that represents the service, should be recognizable as the hoster's icon.
      
  - **Status** - whether this hoster can be used on TorBox or not at the current time. It is usually a good idea to check this value before submitting a download to TorBox's servers for download.
      
  - **Type** - values are either "hoster" or "stream". Both do the same thing, but is good to differentiate services used for different things.
      
  - **Note** - a string value (or null) that may give helpful information about the current status or state of a hoster. This can and should be shown to end users.
      
  - **Daily Link Limit** - the number of downloads a user can use per day. As a user submits links, once they hit this number, the API will deny them from adding anymore of this type of link. A zero value means that it is unlimited.
      
  - **Daily Link Used** - the number of downloads a user has already used. Usually zero unless you send authentication to the endpoint. This will return accurate values.
      
  - **Daily Bandwidth Limit** - the value in bytes that a user is allowed to download from this hoster. A zero value means that it is unlimited. It is recommended to use the Daily Link Limit instead.
      
  - **Daily Bandwidth Used** - the value in bytes that a user has already used to download from this hoster. Usually zero unless you send authentication to the endpoint. This will return accurate values.
      
  
  ### Authorization
  
  Optional authorization. Authorization is not required in this endpoint unless you want to get the user's live data. Requires an API key using the Authorization Bearer Header to get the live and accurate data for **Daily Link Used** and **Daily Bandwidth Used**.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetHosterListOkResponse>>} Get Hoster List Success
   */
    getHosterList(apiVersion: string, requestConfig?: RequestConfig): Promise<HttpResponse<GetHosterListOkResponse>>;
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const createWebDownloadOkResponseData: z.ZodLazy<z.ZodObject<{
    authId: z.ZodOptional<z.ZodString>;
    hash: z.ZodOptional<z.ZodString>;
    webdownloadId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    authId?: string | undefined;
    hash?: string | undefined;
    webdownloadId?: string | undefined;
}, {
    authId?: string | undefined;
    hash?: string | undefined;
    webdownloadId?: string | undefined;
}>>;
/**
 *
 * @typedef  {CreateWebDownloadOkResponseData} createWebDownloadOkResponseData
 * @property {string}
 * @property {string}
 * @property {string}
 */
type CreateWebDownloadOkResponseData = z.infer<typeof createWebDownloadOkResponseData>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getWebDownloadListOkResponseData: z.ZodLazy<z.ZodObject<{
    active: z.ZodOptional<z.ZodBoolean>;
    authId: z.ZodOptional<z.ZodString>;
    availability: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodString>;
    downloadFinished: z.ZodOptional<z.ZodBoolean>;
    downloadPresent: z.ZodOptional<z.ZodBoolean>;
    downloadSpeed: z.ZodOptional<z.ZodNumber>;
    downloadState: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    eta: z.ZodOptional<z.ZodNumber>;
    expiresAt: z.ZodOptional<z.ZodString>;
    files: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
        id: z.ZodOptional<z.ZodNumber>;
        md5: z.ZodOptional<z.ZodString>;
        mimetype: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        s3Path: z.ZodOptional<z.ZodString>;
        shortName: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id?: number | undefined;
        md5?: string | undefined;
        mimetype?: string | undefined;
        name?: string | undefined;
        s3Path?: string | undefined;
        shortName?: string | undefined;
        size?: number | undefined;
    }, {
        id?: number | undefined;
        md5?: string | undefined;
        mimetype?: string | undefined;
        name?: string | undefined;
        s3Path?: string | undefined;
        shortName?: string | undefined;
        size?: number | undefined;
    }>>, "many">>;
    hash: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodNumber>;
    inactiveCheck: z.ZodOptional<z.ZodNumber>;
    name: z.ZodOptional<z.ZodString>;
    progress: z.ZodOptional<z.ZodNumber>;
    server: z.ZodOptional<z.ZodNumber>;
    size: z.ZodOptional<z.ZodNumber>;
    torrentFile: z.ZodOptional<z.ZodBoolean>;
    updatedAt: z.ZodOptional<z.ZodString>;
    uploadSpeed: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    active?: boolean | undefined;
    authId?: string | undefined;
    availability?: number | undefined;
    createdAt?: string | undefined;
    downloadFinished?: boolean | undefined;
    downloadPresent?: boolean | undefined;
    downloadSpeed?: number | undefined;
    downloadState?: string | undefined;
    error?: string | undefined;
    eta?: number | undefined;
    expiresAt?: string | undefined;
    files?: {
        id?: number | undefined;
        md5?: string | undefined;
        mimetype?: string | undefined;
        name?: string | undefined;
        s3Path?: string | undefined;
        shortName?: string | undefined;
        size?: number | undefined;
    }[] | undefined;
    hash?: string | undefined;
    id?: number | undefined;
    inactiveCheck?: number | undefined;
    name?: string | undefined;
    progress?: number | undefined;
    server?: number | undefined;
    size?: number | undefined;
    torrentFile?: boolean | undefined;
    updatedAt?: string | undefined;
    uploadSpeed?: number | undefined;
}, {
    active?: boolean | undefined;
    authId?: string | undefined;
    availability?: number | undefined;
    createdAt?: string | undefined;
    downloadFinished?: boolean | undefined;
    downloadPresent?: boolean | undefined;
    downloadSpeed?: number | undefined;
    downloadState?: string | undefined;
    error?: string | undefined;
    eta?: number | undefined;
    expiresAt?: string | undefined;
    files?: {
        id?: number | undefined;
        md5?: string | undefined;
        mimetype?: string | undefined;
        name?: string | undefined;
        s3Path?: string | undefined;
        shortName?: string | undefined;
        size?: number | undefined;
    }[] | undefined;
    hash?: string | undefined;
    id?: number | undefined;
    inactiveCheck?: number | undefined;
    name?: string | undefined;
    progress?: number | undefined;
    server?: number | undefined;
    size?: number | undefined;
    torrentFile?: boolean | undefined;
    updatedAt?: string | undefined;
    uploadSpeed?: number | undefined;
}>>;
/**
 *
 * @typedef  {GetWebDownloadListOkResponseData} getWebDownloadListOkResponseData
 * @property {boolean}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {boolean}
 * @property {boolean}
 * @property {number}
 * @property {string}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {DataFiles5[]}
 * @property {string}
 * @property {number}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {boolean}
 * @property {string}
 * @property {number}
 */
type GetWebDownloadListOkResponseData = z.infer<typeof getWebDownloadListOkResponseData>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const dataFiles5: z.ZodLazy<z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    md5: z.ZodOptional<z.ZodString>;
    mimetype: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    s3Path: z.ZodOptional<z.ZodString>;
    shortName: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id?: number | undefined;
    md5?: string | undefined;
    mimetype?: string | undefined;
    name?: string | undefined;
    s3Path?: string | undefined;
    shortName?: string | undefined;
    size?: number | undefined;
}, {
    id?: number | undefined;
    md5?: string | undefined;
    mimetype?: string | undefined;
    name?: string | undefined;
    s3Path?: string | undefined;
    shortName?: string | undefined;
    size?: number | undefined;
}>>;
/**
 *
 * @typedef  {DataFiles5} dataFiles5
 * @property {number}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {number}
 */
type DataFiles5 = z.infer<typeof dataFiles5>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getHosterListOkResponseData: z.ZodLazy<z.ZodObject<{
    dailyBandwidthLimit: z.ZodOptional<z.ZodNumber>;
    dailyBandwidthUsed: z.ZodOptional<z.ZodNumber>;
    dailyLinkLimit: z.ZodOptional<z.ZodNumber>;
    dailyLinkUsed: z.ZodOptional<z.ZodNumber>;
    domains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    domais: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    domaisn: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    icon: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
    name: z.ZodOptional<z.ZodString>;
    note: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    dailyBandwidthLimit?: number | undefined;
    dailyBandwidthUsed?: number | undefined;
    dailyLinkLimit?: number | undefined;
    dailyLinkUsed?: number | undefined;
    domains?: string[] | undefined;
    domais?: string[] | undefined;
    domaisn?: string[] | undefined;
    icon?: string | undefined;
    limit?: number | undefined;
    name?: string | undefined;
    note?: string | null | undefined;
    status?: boolean | undefined;
    type?: string | undefined;
    url?: string | undefined;
}, {
    dailyBandwidthLimit?: number | undefined;
    dailyBandwidthUsed?: number | undefined;
    dailyLinkLimit?: number | undefined;
    dailyLinkUsed?: number | undefined;
    domains?: string[] | undefined;
    domais?: string[] | undefined;
    domaisn?: string[] | undefined;
    icon?: string | undefined;
    limit?: number | undefined;
    name?: string | undefined;
    note?: string | null | undefined;
    status?: boolean | undefined;
    type?: string | undefined;
    url?: string | undefined;
}>>;
/**
 *
 * @typedef  {GetHosterListOkResponseData} getHosterListOkResponseData
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {string[]}
 * @property {string[]}
 * @property {string[]}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {string}
 * @property {boolean}
 * @property {string}
 * @property {string}
 */
type GetHosterListOkResponseData = z.infer<typeof getHosterListOkResponseData>;

declare class _9 extends Error {
    data?: any | null;
    detail?: string;
    error?: string;
    success?: boolean;
    constructor(message?: string, response?: unknown);
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getUpStatusOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: any;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: any;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetUpStatusOkResponse} getUpStatusOkResponse
 * @property {any}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type GetUpStatusOkResponse = z.infer<typeof getUpStatusOkResponse>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getStatsOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodLazy<z.ZodObject<{
        activeTorrents: z.ZodOptional<z.ZodNumber>;
        activeUsenetDownloads: z.ZodOptional<z.ZodNumber>;
        activeWebDownloads: z.ZodOptional<z.ZodNumber>;
        totalBytesDownloaded: z.ZodOptional<z.ZodNumber>;
        totalBytesUploaded: z.ZodOptional<z.ZodNumber>;
        totalDownloads: z.ZodOptional<z.ZodNumber>;
        totalServers: z.ZodOptional<z.ZodNumber>;
        totalTorrentDownloads: z.ZodOptional<z.ZodNumber>;
        totalUsenetDownloads: z.ZodOptional<z.ZodNumber>;
        totalUsers: z.ZodOptional<z.ZodNumber>;
        totalWebDownloads: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        activeTorrents?: number | undefined;
        activeUsenetDownloads?: number | undefined;
        activeWebDownloads?: number | undefined;
        totalBytesDownloaded?: number | undefined;
        totalBytesUploaded?: number | undefined;
        totalDownloads?: number | undefined;
        totalServers?: number | undefined;
        totalTorrentDownloads?: number | undefined;
        totalUsenetDownloads?: number | undefined;
        totalUsers?: number | undefined;
        totalWebDownloads?: number | undefined;
    }, {
        activeTorrents?: number | undefined;
        activeUsenetDownloads?: number | undefined;
        activeWebDownloads?: number | undefined;
        totalBytesDownloaded?: number | undefined;
        totalBytesUploaded?: number | undefined;
        totalDownloads?: number | undefined;
        totalServers?: number | undefined;
        totalTorrentDownloads?: number | undefined;
        totalUsenetDownloads?: number | undefined;
        totalUsers?: number | undefined;
        totalWebDownloads?: number | undefined;
    }>>>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodBoolean>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: {
        activeTorrents?: number | undefined;
        activeUsenetDownloads?: number | undefined;
        activeWebDownloads?: number | undefined;
        totalBytesDownloaded?: number | undefined;
        totalBytesUploaded?: number | undefined;
        totalDownloads?: number | undefined;
        totalServers?: number | undefined;
        totalTorrentDownloads?: number | undefined;
        totalUsenetDownloads?: number | undefined;
        totalUsers?: number | undefined;
        totalWebDownloads?: number | undefined;
    } | undefined;
    detail?: string | undefined;
    error?: boolean | undefined;
    success?: boolean | undefined;
}, {
    data?: {
        activeTorrents?: number | undefined;
        activeUsenetDownloads?: number | undefined;
        activeWebDownloads?: number | undefined;
        totalBytesDownloaded?: number | undefined;
        totalBytesUploaded?: number | undefined;
        totalDownloads?: number | undefined;
        totalServers?: number | undefined;
        totalTorrentDownloads?: number | undefined;
        totalUsenetDownloads?: number | undefined;
        totalUsers?: number | undefined;
        totalWebDownloads?: number | undefined;
    } | undefined;
    detail?: string | undefined;
    error?: boolean | undefined;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetStatsOkResponse} getStatsOkResponse
 * @property {GetStatsOkResponseData}
 * @property {string}
 * @property {boolean}
 * @property {boolean}
 */
type GetStatsOkResponse = z.infer<typeof getStatsOkResponse>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getChangelogsJsonOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
        createdAt: z.ZodOptional<z.ZodString>;
        html: z.ZodOptional<z.ZodString>;
        id: z.ZodOptional<z.ZodString>;
        link: z.ZodOptional<z.ZodString>;
        markdown: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        createdAt?: string | undefined;
        html?: string | undefined;
        id?: string | undefined;
        link?: string | undefined;
        markdown?: string | undefined;
        name?: string | undefined;
    }, {
        createdAt?: string | undefined;
        html?: string | undefined;
        id?: string | undefined;
        link?: string | undefined;
        markdown?: string | undefined;
        name?: string | undefined;
    }>>, "many">>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: {
        createdAt?: string | undefined;
        html?: string | undefined;
        id?: string | undefined;
        link?: string | undefined;
        markdown?: string | undefined;
        name?: string | undefined;
    }[] | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: {
        createdAt?: string | undefined;
        html?: string | undefined;
        id?: string | undefined;
        link?: string | undefined;
        markdown?: string | undefined;
        name?: string | undefined;
    }[] | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetChangelogsJsonOkResponse} getChangelogsJsonOkResponse
 * @property {GetChangelogsJsonOkResponseData[]}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type GetChangelogsJsonOkResponse = z.infer<typeof getChangelogsJsonOkResponse>;

interface GetSpeedtestFilesParams {
    testLength?: string;
    region?: string;
}

declare class GeneralService extends BaseService {
    /**
   * ### Overview
  Simply gets if the TorBox API is available for use or not. Also might include information about downtimes.
  
  ### Authorization
  
  None needed.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetUpStatusOkResponse>>} Get Up Status Success
   */
    getUpStatus(requestConfig?: RequestConfig): Promise<HttpResponse<GetUpStatusOkResponse>>;
    /**
   * ### Overview
  Simply gets general stats about the TorBox service.
  
  ### Authorization
  
  None needed.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetStatsOkResponse>>} Get Stats Success
   */
    getStats(apiVersion: string, requestConfig?: RequestConfig): Promise<HttpResponse<GetStatsOkResponse>>;
    /**
   * ### Overview
  Gets most recent 100 changelogs from [https://feedback.torbox.app/changelog.](https://feedback.torbox.app/changelog.) This is useful for people who want updates on the TorBox changelog. Includes all the necessary items to make this compatible with RSS feed viewers for notifications, and proper HTML viewing.
  
  ### Authorization
  
  None needed.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>} Get Changelogs RSS Feed Success
   */
    getChangelogsRssFeed(apiVersion: string, requestConfig?: RequestConfig): Promise<HttpResponse<string>>;
    /**
   * ### Overview
  Gets most recent 100 changelogs from [https://feedback.torbox.app/changelog.](https://feedback.torbox.app/changelog.) This is useful for developers who want to integrate the changelog into their apps for their users to see. Includes content in HTML and markdown for developers to easily render the text in a fancy yet simple way.
  
  ### Authorization
  
  None needed.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetChangelogsJsonOkResponse>>} Get Changelogs JSON Success
   */
    getChangelogsJson(apiVersion: string, requestConfig?: RequestConfig): Promise<HttpResponse<GetChangelogsJsonOkResponse>>;
    /**
   * ### Overview
  Gets CDN speedtest files. This can be used for speedtesting TorBox for users or other usages, such as checking download speeds for verification. Provides all necessary data such as region, server name, and even coordinates. Uses the requesting IP to determine if the server is the closest to the user.
    
  You also have the ability to choose between long tests or short tests via the "test_length" parameter. You may also force the region selection by passing the "region" as a specific region.
  
  ### Authorization
  
  None needed.
   * @param {string} apiVersion -
   * @param {string} [params.testLength] - Determines the size of the file used for the speedtest. May be "long" or "short". Optional.
   * @param {string} [params.region] - Determines what cdns are returned. May be any region that TorBox is located in. To get this value, send a request without this value to determine all of the available regions that are available.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    getSpeedtestFiles(apiVersion: string, params?: GetSpeedtestFilesParams, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getStatsOkResponseData: z.ZodLazy<z.ZodObject<{
    activeTorrents: z.ZodOptional<z.ZodNumber>;
    activeUsenetDownloads: z.ZodOptional<z.ZodNumber>;
    activeWebDownloads: z.ZodOptional<z.ZodNumber>;
    totalBytesDownloaded: z.ZodOptional<z.ZodNumber>;
    totalBytesUploaded: z.ZodOptional<z.ZodNumber>;
    totalDownloads: z.ZodOptional<z.ZodNumber>;
    totalServers: z.ZodOptional<z.ZodNumber>;
    totalTorrentDownloads: z.ZodOptional<z.ZodNumber>;
    totalUsenetDownloads: z.ZodOptional<z.ZodNumber>;
    totalUsers: z.ZodOptional<z.ZodNumber>;
    totalWebDownloads: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    activeTorrents?: number | undefined;
    activeUsenetDownloads?: number | undefined;
    activeWebDownloads?: number | undefined;
    totalBytesDownloaded?: number | undefined;
    totalBytesUploaded?: number | undefined;
    totalDownloads?: number | undefined;
    totalServers?: number | undefined;
    totalTorrentDownloads?: number | undefined;
    totalUsenetDownloads?: number | undefined;
    totalUsers?: number | undefined;
    totalWebDownloads?: number | undefined;
}, {
    activeTorrents?: number | undefined;
    activeUsenetDownloads?: number | undefined;
    activeWebDownloads?: number | undefined;
    totalBytesDownloaded?: number | undefined;
    totalBytesUploaded?: number | undefined;
    totalDownloads?: number | undefined;
    totalServers?: number | undefined;
    totalTorrentDownloads?: number | undefined;
    totalUsenetDownloads?: number | undefined;
    totalUsers?: number | undefined;
    totalWebDownloads?: number | undefined;
}>>;
/**
 *
 * @typedef  {GetStatsOkResponseData} getStatsOkResponseData
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 * @property {number}
 */
type GetStatsOkResponseData = z.infer<typeof getStatsOkResponseData>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getChangelogsJsonOkResponseData: z.ZodLazy<z.ZodObject<{
    createdAt: z.ZodOptional<z.ZodString>;
    html: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
    link: z.ZodOptional<z.ZodString>;
    markdown: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    createdAt?: string | undefined;
    html?: string | undefined;
    id?: string | undefined;
    link?: string | undefined;
    markdown?: string | undefined;
    name?: string | undefined;
}, {
    createdAt?: string | undefined;
    html?: string | undefined;
    id?: string | undefined;
    link?: string | undefined;
    markdown?: string | undefined;
    name?: string | undefined;
}>>;
/**
 *
 * @typedef  {GetChangelogsJsonOkResponseData} getChangelogsJsonOkResponseData
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 */
type GetChangelogsJsonOkResponseData = z.infer<typeof getChangelogsJsonOkResponseData>;

interface GetRssNotificationFeedParams {
    token?: string;
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getNotificationFeedOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
        authId: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodString>;
        id: z.ZodOptional<z.ZodNumber>;
        message: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        authId?: string | undefined;
        createdAt?: string | undefined;
        id?: number | undefined;
        message?: string | undefined;
        title?: string | undefined;
    }, {
        authId?: string | undefined;
        createdAt?: string | undefined;
        id?: number | undefined;
        message?: string | undefined;
        title?: string | undefined;
    }>>, "many">>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: {
        authId?: string | undefined;
        createdAt?: string | undefined;
        id?: number | undefined;
        message?: string | undefined;
        title?: string | undefined;
    }[] | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: {
        authId?: string | undefined;
        createdAt?: string | undefined;
        id?: number | undefined;
        message?: string | undefined;
        title?: string | undefined;
    }[] | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetNotificationFeedOkResponse} getNotificationFeedOkResponse
 * @property {GetNotificationFeedOkResponseData[]}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type GetNotificationFeedOkResponse = z.infer<typeof getNotificationFeedOkResponse>;

declare class NotificationsService extends BaseService {
    /**
   * ### Overview
  Gets your notifications in an RSS Feed which allows you to use them with RSS Feed readers or notification services that can take RSS Feeds and listen to updates. As soon as a notification goes to your account, it will be added to your feed.
  
  ### Authorization
  
  Requires an API key using as a query parameter using the `token` key.
   * @param {string} apiVersion -
   * @param {string} [params.token] -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>} Get RSS Notification Feed Success
   */
    getRssNotificationFeed(apiVersion: string, params?: GetRssNotificationFeedParams, requestConfig?: RequestConfig): Promise<HttpResponse<string>>;
    /**
   * ### Overview
  Gets your notifications in a JSON object that is easily parsable compared to the RSS Feed. Gives all the same data as the RSS Feed.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetNotificationFeedOkResponse>>} Get Notification Feed Success
   */
    getNotificationFeed(apiVersion: string, requestConfig?: RequestConfig): Promise<HttpResponse<GetNotificationFeedOkResponse>>;
    /**
   * ### Overview
  Marks all of your notifications as read and deletes them permanently.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    clearAllNotifications(apiVersion: string, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Marks a single notification as read and permanently deletes it from your notifications. Requires a `notification_id` which can be found by getting your notification feed.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {string} notificationId -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    clearSingleNotification(apiVersion: string, notificationId: string, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Sends a test notification to all enabled notification types. This can be useful for validating setups. No need for any body in this request.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    sendTestNotification(apiVersion: string, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getNotificationFeedOkResponseData: z.ZodLazy<z.ZodObject<{
    authId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodNumber>;
    message: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    authId?: string | undefined;
    createdAt?: string | undefined;
    id?: number | undefined;
    message?: string | undefined;
    title?: string | undefined;
}, {
    authId?: string | undefined;
    createdAt?: string | undefined;
    id?: number | undefined;
    message?: string | undefined;
    title?: string | undefined;
}>>;
/**
 *
 * @typedef  {GetNotificationFeedOkResponseData} getNotificationFeedOkResponseData
 * @property {string}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {string}
 */
type GetNotificationFeedOkResponseData = z.infer<typeof getNotificationFeedOkResponseData>;

declare class _10 extends Error {
    data?: any | null;
    detail?: string;
    error?: any | null;
    success?: boolean;
    constructor(message?: string, response?: unknown);
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getUserDataOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodLazy<z.ZodObject<{
        authId: z.ZodOptional<z.ZodString>;
        baseEmail: z.ZodOptional<z.ZodString>;
        cooldownUntil: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodString>;
        customer: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        id: z.ZodOptional<z.ZodNumber>;
        isSubscribed: z.ZodOptional<z.ZodBoolean>;
        plan: z.ZodOptional<z.ZodNumber>;
        premiumExpiresAt: z.ZodOptional<z.ZodString>;
        server: z.ZodOptional<z.ZodNumber>;
        settings: z.ZodOptional<z.ZodLazy<z.ZodObject<{
            anothersetting: z.ZodOptional<z.ZodString>; /**
             * The shape of the model inside the application code - what the users use
             */
            setting: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            anothersetting?: string | undefined;
            setting?: string | undefined;
        }, {
            anothersetting?: string | undefined;
            setting?: string | undefined;
        }>>>;
        totalDownloaded: z.ZodOptional<z.ZodNumber>;
        updatedAt: z.ZodOptional<z.ZodString>;
        userReferral: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        authId?: string | undefined;
        baseEmail?: string | undefined;
        cooldownUntil?: string | undefined;
        createdAt?: string | undefined;
        customer?: string | undefined;
        email?: string | undefined;
        id?: number | undefined;
        isSubscribed?: boolean | undefined;
        plan?: number | undefined;
        premiumExpiresAt?: string | undefined;
        server?: number | undefined;
        settings?: {
            anothersetting?: string | undefined;
            setting?: string | undefined;
        } | undefined;
        totalDownloaded?: number | undefined;
        updatedAt?: string | undefined;
        userReferral?: string | undefined;
    }, {
        authId?: string | undefined;
        baseEmail?: string | undefined;
        cooldownUntil?: string | undefined;
        createdAt?: string | undefined;
        customer?: string | undefined;
        email?: string | undefined;
        id?: number | undefined;
        isSubscribed?: boolean | undefined;
        plan?: number | undefined;
        premiumExpiresAt?: string | undefined;
        server?: number | undefined;
        settings?: {
            anothersetting?: string | undefined;
            setting?: string | undefined;
        } | undefined;
        totalDownloaded?: number | undefined;
        updatedAt?: string | undefined;
        userReferral?: string | undefined;
    }>>>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: {
        authId?: string | undefined;
        baseEmail?: string | undefined;
        cooldownUntil?: string | undefined;
        createdAt?: string | undefined;
        customer?: string | undefined;
        email?: string | undefined;
        id?: number | undefined;
        isSubscribed?: boolean | undefined;
        plan?: number | undefined;
        premiumExpiresAt?: string | undefined;
        server?: number | undefined;
        settings?: {
            anothersetting?: string | undefined;
            setting?: string | undefined;
        } | undefined;
        totalDownloaded?: number | undefined;
        updatedAt?: string | undefined;
        userReferral?: string | undefined;
    } | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: {
        authId?: string | undefined;
        baseEmail?: string | undefined;
        cooldownUntil?: string | undefined;
        createdAt?: string | undefined;
        customer?: string | undefined;
        email?: string | undefined;
        id?: number | undefined;
        isSubscribed?: boolean | undefined;
        plan?: number | undefined;
        premiumExpiresAt?: string | undefined;
        server?: number | undefined;
        settings?: {
            anothersetting?: string | undefined;
            setting?: string | undefined;
        } | undefined;
        totalDownloaded?: number | undefined;
        updatedAt?: string | undefined;
        userReferral?: string | undefined;
    } | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetUserDataOkResponse} getUserDataOkResponse
 * @property {GetUserDataOkResponseData}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type GetUserDataOkResponse = z.infer<typeof getUserDataOkResponse>;

interface GetUserDataParams {
    settings?: string;
}
interface AddReferralToAccountParams {
    referral?: string;
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const addReferralToAccountOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: any;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: any;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {AddReferralToAccountOkResponse} addReferralToAccountOkResponse
 * @property {any}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type AddReferralToAccountOkResponse = z.infer<typeof addReferralToAccountOkResponse>;

declare class UserService extends BaseService {
    /**
   * ### Overview
  If you want a new API token, or your old one has been compromised, you may request a new one. If you happen to forget the token, go the [TorBox settings page ](https://torbox.app/settings) and copy the current one. If this still doesn't work, you may contact us at our support email for a new one.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header as well as passing the `session_token` from the website to be passed in the body. You can find the `session_token` in the localStorage of your browser on any TorBox.app page under the key `torbox_session_token`. This is a temporary token that only lasts for 1 hour, which is why it is used here to verify the identity of a user as well as their API token.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    refreshApiToken(apiVersion: string, body: any, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Gets a users account data and information.
  
  ### Plans
  
  `0` is Free plan
  
  `1` is Essential plan (_$3 plan_)
  
  `2` is Pro plan (_$10 plan_)
  
  `3` is Standard plan (_$5 plan_)
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {string} [params.settings] - Allows you to retrieve user settings.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetUserDataOkResponse>>} Get User Data Success / Get User Data Settings Success
   */
    getUserData(apiVersion: string, params?: GetUserDataParams, requestConfig?: RequestConfig): Promise<HttpResponse<GetUserDataOkResponse>>;
    /**
   * ### Overview
  Automatically adds a referral code to the user's account. This can be used for developers to automatically add their referral to user's accounts who use their service.
  
  This will not override any referral a user already has. If they already have one, then it cannot be changed using this endpoint. It can only be done by the user on the [website](https://torbox.app/subscription).
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header. Use the user's API key, not your own.
   * @param {string} apiVersion -
   * @param {string} [params.referral] - A referral code. Must be UUID.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<AddReferralToAccountOkResponse>>} Add Referral To Account Success
   */
    addReferralToAccount(apiVersion: string, params?: AddReferralToAccountParams, requestConfig?: RequestConfig): Promise<HttpResponse<AddReferralToAccountOkResponse>>;
    /**
   * ### Overview
  Requests a 6 digit code to be sent to the user's email for verification. Used to verify a user actually wants to perform a potentially dangerous action.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    getConfirmationCode(apiVersion: string, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getUserDataOkResponseData: z.ZodLazy<z.ZodObject<{
    authId: z.ZodOptional<z.ZodString>;
    baseEmail: z.ZodOptional<z.ZodString>;
    cooldownUntil: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
    customer: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodNumber>;
    isSubscribed: z.ZodOptional<z.ZodBoolean>;
    plan: z.ZodOptional<z.ZodNumber>;
    premiumExpiresAt: z.ZodOptional<z.ZodString>;
    server: z.ZodOptional<z.ZodNumber>;
    settings: z.ZodOptional<z.ZodLazy<z.ZodObject<{
        anothersetting: z.ZodOptional<z.ZodString>;
        setting: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        anothersetting?: string | undefined;
        setting?: string | undefined;
    }, {
        anothersetting?: string | undefined;
        setting?: string | undefined;
    }>>>;
    totalDownloaded: z.ZodOptional<z.ZodNumber>;
    updatedAt: z.ZodOptional<z.ZodString>;
    userReferral: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    authId?: string | undefined;
    baseEmail?: string | undefined;
    cooldownUntil?: string | undefined;
    createdAt?: string | undefined;
    customer?: string | undefined;
    email?: string | undefined;
    id?: number | undefined;
    isSubscribed?: boolean | undefined;
    plan?: number | undefined;
    premiumExpiresAt?: string | undefined;
    server?: number | undefined;
    settings?: {
        anothersetting?: string | undefined;
        setting?: string | undefined;
    } | undefined;
    totalDownloaded?: number | undefined;
    updatedAt?: string | undefined;
    userReferral?: string | undefined;
}, {
    authId?: string | undefined;
    baseEmail?: string | undefined;
    cooldownUntil?: string | undefined;
    createdAt?: string | undefined;
    customer?: string | undefined;
    email?: string | undefined;
    id?: number | undefined;
    isSubscribed?: boolean | undefined;
    plan?: number | undefined;
    premiumExpiresAt?: string | undefined;
    server?: number | undefined;
    settings?: {
        anothersetting?: string | undefined;
        setting?: string | undefined;
    } | undefined;
    totalDownloaded?: number | undefined;
    updatedAt?: string | undefined;
    userReferral?: string | undefined;
}>>;
/**
 *
 * @typedef  {GetUserDataOkResponseData} getUserDataOkResponseData
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {number}
 * @property {boolean}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {Settings}
 * @property {number}
 * @property {string}
 * @property {string}
 */
type GetUserDataOkResponseData = z.infer<typeof getUserDataOkResponseData>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const settings: z.ZodLazy<z.ZodObject<{
    anothersetting: z.ZodOptional<z.ZodString>;
    setting: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    anothersetting?: string | undefined;
    setting?: string | undefined;
}, {
    anothersetting?: string | undefined;
    setting?: string | undefined;
}>>;
/**
 *
 * @typedef  {Settings} settings
 * @property {string}
 * @property {string}
 */
type Settings = z.infer<typeof settings>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const _13: z.ZodLazy<z.ZodUnion<[z.ZodString, z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodString>;
    detail: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    data?: string | undefined;
    detail?: string | undefined;
}, {
    data?: string | undefined;
    detail?: string | undefined;
}>>]>>;
/**
 *
 * @typedef  {_13} _13
 * @property {string}
 * @property {_14}
 */
type _13 = z.infer<typeof _13>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const _14: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodString>;
    detail: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    data?: string | undefined;
    detail?: string | undefined;
}, {
    data?: string | undefined;
    detail?: string | undefined;
}>>;
/**
 *
 * @typedef  {_14} _14
 * @property {string}
 * @property {string}
 */
type _14 = z.infer<typeof _14>;

declare class _11 extends Error {
    data?: any | null;
    detail?: string;
    error?: string;
    success?: boolean;
    constructor(message?: string, response?: unknown);
}

declare class _12 extends Error {
    data?: any | null;
    detail?: _13;
    error?: string;
    success?: boolean;
    constructor(message?: string, response?: unknown);
}

interface GetUserRssFeedsParams {
    id?: string;
}
interface GetRssFeedItemsParams {
    rssFeedId?: string;
}

declare class RssFeedsService extends BaseService {
    /**
   * ### Overview
  Allows adding an RSS feed to your account. This API gives you a lot of customization options, but is best used with the UI on the website. This endpoint only works for Pro users (plan: 2).
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    addRssFeed(apiVersion: string, body: any, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Controls an RSS Feed. By sending the RSS feed's ID and the type of operation you want to perform, it will perform said action on the RSS feed checker.
  
  Operations are either:
  
  - **Update** `forces an update on the rss feed`
  - **Delete** `deletes the rss feed from your account permanently. This also deletes all associated RSS feed items. This does not remove queued items spawned from the RSS feed.`
  - **Pause** `pauses checking the rss feed on the scan interval`
  - **Resume** `resumes a paused rss feed`
      
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    controlRssFeed(apiVersion: string, body: any, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Allows you to edit the RSS feed based on the RSS feed ID passed. Allows you to change everything about an RSS feed, except for the URL.
  
  When updating the "rss_type" or the "torrent_seeding" options, it will update all of the RSS items associated with the RSS feed, including all previous items.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    modifyRssFeed(apiVersion: string, body: any, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Gets all of a user's RSS feeds located on their account. Can only be accessed on a Pro (plan: 2) account. Also allows you to get a specific by passing an "id" in the parameters.
  
  ##### Type Key
  
  The "type" key in the response is used for showing what type of downloads are spawned from this RSS feed. This affects how the item is downloaded, as well as what is scraped, so make sure it is correct.
  
  - **"**torrent**"** `uses .torrent files and magnet links and adds as torrent when downloaded.`
  - "usenet" `uses .nzb files and nzb links and adds as a usenet download when downloaded.`
  - "webdl" `uses generic links and adds as a web download when downloaded.`
      
  
  ##### Status Key
  
  The "status" key tells the user selected status of the RSS feed. These statuses are **not** the same as the status key for the RSS items associated with the RSS feed. Each feed also includes a "status_message" key which gives a user friendly message about anything about the RSS feed, such as errors and explainations.
  
  - "active" `the RSS feed is set to be scraped.`
  - "paused" `the RSS feed will not be scraped as it is paused by the user.`
      
  - "error" `the RSS feed had an error while scraping, and cannot continue.`
      
  
  ##### State Key
  
  The "state" key tells you exactly in real time, what the RSS feed is doing. This is useful for realtime status updates.
  
  - "idle" `the RSS feed is idle, and is currently not doing anything in the current moment.`
  - "scraping" `the RSS feed is currently scraping new RSS items.`
  - "downloading" `the RSS feed is currently downloading the newly scraped RSS items.`
      
  
  ##### Torrent Seeding Key
  
  The "torrent_seeding" key is returned with every response, regardless of the type of the RSS feed. This controls what seeding setting the RSS feed is using when it adds new torrents. These are the same options as when adding a torrent using the /torrent/createtorrent endpoint.
  
  > Tells TorBox your preference for seeding this torrent. 1 is auto. 2 is seed. 3 is don't seed. Optional. Default is 1, or whatever the user has in their settings. Overwrites option in settings.
    
  
  - 1 `auto, the torrent will seed based on what the user has in their settings.`
  - 2 `always, TorBox will be instructed to seed this torrent regardless of any other settings.`
  - 3 `never, TorBox will not seed this torrent.`
      
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {string} [params.id] - A specific RSS feed ID that you want to retrieve. Optional.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    getUserRssFeeds(apiVersion: string, params?: GetUserRssFeedsParams, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Gets the first 10,000 RSS feed items associated with an RSS feed. RSS feed items are scraped items from the RSS feed. They contain a direct download link as well as the content name, and additional information.
  
  ##### Type Key
  
  The "type" key in the response is used for showing what type of downloads this RSS feed item is. This affects how the item is downloaded, as well as what is scraped, so make sure it is correct. When the parent RSS feed's type is changed, it changes all of the items types as well.
  
  - **"**torrent**"** `uses .torrent files and magnet links and adds as torrent when downloaded.`
  - "usenet" `uses .nzb files and nzb links and adds as a usenet download when downloaded.`
  - "webdl" `uses generic links and adds as a web download when downloaded.`
      
  
  ##### Status Key
  
  The "status" key tells the status of the RSS feed item. This is useful for seeing what the item is doing, and what it will do next. Each item also includes a "status_message" key which gives a user friendly message about anything about the RSS feed item, such as errors and explainations.
  
  - "new" `the RSS feed item is set to be downloaded.`
  - "ignored" `the RSS feed item has been ignored due to the parents RSS feed settings, as it doesn't match the chosen settings. The item will not be downloaded.`
  - "error" `the RSS feed item had an error while attempting to download. The item will be retried on the next scrape.`
  - "downloaded" `the RSS feed item has already been downloaded to the user's account. It will not be downloaded again.`
      
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {string} [params.rssFeedId] - The RSS Feed ID of the RSS Feed you want to retrieve the scraped items of.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    getRssFeedItems(apiVersion: string, params?: GetRssFeedItemsParams, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getAllJobsOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
        authId: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodString>;
        detail: z.ZodOptional<z.ZodString>;
        downloadUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        fileId: z.ZodOptional<z.ZodNumber>;
        hash: z.ZodOptional<z.ZodString>;
        id: z.ZodOptional<z.ZodNumber>;
        integration: z.ZodOptional<z.ZodString>;
        progress: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodOptional<z.ZodString>;
        zip: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        authId?: string | undefined;
        createdAt?: string | undefined;
        detail?: string | undefined;
        downloadUrl?: string | null | undefined;
        fileId?: number | undefined;
        hash?: string | undefined;
        id?: number | undefined;
        integration?: string | undefined;
        progress?: number | undefined;
        status?: string | undefined;
        type?: string | undefined;
        updatedAt?: string | undefined;
        zip?: boolean | undefined;
    }, {
        authId?: string | undefined;
        createdAt?: string | undefined;
        detail?: string | undefined;
        downloadUrl?: string | null | undefined;
        fileId?: number | undefined;
        hash?: string | undefined;
        id?: number | undefined;
        integration?: string | undefined;
        progress?: number | undefined;
        status?: string | undefined;
        type?: string | undefined;
        updatedAt?: string | undefined;
        zip?: boolean | undefined;
    }>>, "many">>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: {
        authId?: string | undefined;
        createdAt?: string | undefined;
        detail?: string | undefined;
        downloadUrl?: string | null | undefined;
        fileId?: number | undefined;
        hash?: string | undefined;
        id?: number | undefined;
        integration?: string | undefined;
        progress?: number | undefined;
        status?: string | undefined;
        type?: string | undefined;
        updatedAt?: string | undefined;
        zip?: boolean | undefined;
    }[] | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: {
        authId?: string | undefined;
        createdAt?: string | undefined;
        detail?: string | undefined;
        downloadUrl?: string | null | undefined;
        fileId?: number | undefined;
        hash?: string | undefined;
        id?: number | undefined;
        integration?: string | undefined;
        progress?: number | undefined;
        status?: string | undefined;
        type?: string | undefined;
        updatedAt?: string | undefined;
        zip?: boolean | undefined;
    }[] | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetAllJobsOkResponse} getAllJobsOkResponse
 * @property {GetAllJobsOkResponseData[]}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type GetAllJobsOkResponse = z.infer<typeof getAllJobsOkResponse>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getAllJobsByHashOkResponse: z.ZodLazy<z.ZodObject<{
    data: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodObject<{
        authId: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodString>;
        detail: z.ZodOptional<z.ZodString>;
        downloadUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        fileId: z.ZodOptional<z.ZodNumber>;
        hash: z.ZodOptional<z.ZodString>;
        id: z.ZodOptional<z.ZodNumber>;
        integration: z.ZodOptional<z.ZodString>;
        progress: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodOptional<z.ZodString>;
        zip: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        authId?: string | undefined;
        createdAt?: string | undefined;
        detail?: string | undefined;
        downloadUrl?: string | null | undefined;
        fileId?: number | undefined;
        hash?: string | undefined;
        id?: number | undefined;
        integration?: string | undefined;
        progress?: number | undefined;
        status?: string | undefined;
        type?: string | undefined;
        updatedAt?: string | undefined;
        zip?: boolean | undefined;
    }, {
        authId?: string | undefined;
        createdAt?: string | undefined;
        detail?: string | undefined;
        downloadUrl?: string | null | undefined;
        fileId?: number | undefined;
        hash?: string | undefined;
        id?: number | undefined;
        integration?: string | undefined;
        progress?: number | undefined;
        status?: string | undefined;
        type?: string | undefined;
        updatedAt?: string | undefined;
        zip?: boolean | undefined;
    }>>, "many">>;
    detail: z.ZodOptional<z.ZodString>;
    error: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    success: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    data?: {
        authId?: string | undefined;
        createdAt?: string | undefined;
        detail?: string | undefined;
        downloadUrl?: string | null | undefined;
        fileId?: number | undefined;
        hash?: string | undefined;
        id?: number | undefined;
        integration?: string | undefined;
        progress?: number | undefined;
        status?: string | undefined;
        type?: string | undefined;
        updatedAt?: string | undefined;
        zip?: boolean | undefined;
    }[] | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}, {
    data?: {
        authId?: string | undefined;
        createdAt?: string | undefined;
        detail?: string | undefined;
        downloadUrl?: string | null | undefined;
        fileId?: number | undefined;
        hash?: string | undefined;
        id?: number | undefined;
        integration?: string | undefined;
        progress?: number | undefined;
        status?: string | undefined;
        type?: string | undefined;
        updatedAt?: string | undefined;
        zip?: boolean | undefined;
    }[] | undefined;
    detail?: string | undefined;
    error?: any;
    success?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetAllJobsByHashOkResponse} getAllJobsByHashOkResponse
 * @property {GetAllJobsByHashOkResponseData[]}
 * @property {string}
 * @property {any}
 * @property {boolean}
 */
type GetAllJobsByHashOkResponse = z.infer<typeof getAllJobsByHashOkResponse>;

declare class IntegrationsService extends BaseService {
    /**
   * ### Overview
  Allows you to get an authorization token for using the user's account. Callback is located at `/oauth/{provider}/callback` which will verify the token recieved from the OAuth, then redirect you finally to `https://torbox.app/{provider}/success?token={token}&expires_in={expires_in}&expires_at={expires_at}`
  
  #### Providers:
  
  - "google" -> Google Drive
      
  - "dropbox" -> Dropbox
      
  - "discord" -> Discord
      
  - "onedrive" -> Azure AD/Microsoft/Onedrive
      
  
  ### Authorization
  
  No authorization needed. This is a whitelabel OAuth solution.
   * @param {string} apiVersion -
   * @param {string} provider -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    authenticateOauth(apiVersion: string, provider: string, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Queues a job to upload the specified file or zip to the Google Drive account sent with the `google_token` key. To get this key, either get an OAuth2 token using `/oauth/google` or your own solution. Make sure when creating the OAuth link, you add the scope `https://www.googleapis.com/auth/drive.file` so TorBox has access to the user's Drive.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    queueGoogleDrive(apiVersion: string, body: any, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Queues a job to upload the specified file or zip to Pixeldrain.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    queuePixeldrain(apiVersion: string, body: any, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Queues a job to upload the specified file or zip to the OneDrive sent with the `onedrive_token` key. To get this key, either get an OAuth2 token using `/oauth/onedrive` or your own solution. Make sure when creating the OAuth link you use the scope `files.readwrite.all`. This is compatible with all different types of Microsoft accounts.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    queueOnedrive(apiVersion: string, body: any, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Queues a job to upload the specified file or zip to the GoFile account sent with the `gofile_token` _(optional)_. To get this key, login to your GoFile account and go [here](https://gofile.io/myProfile). Copy the **Account API Token**. This is what you will use as the `gofile_token`, if you choose to use it. If you don't use an Account API Token, GoFile will simply create an anonymous file. This file will expire after inactivity.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    queueGofile(apiVersion: string, body: any, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Queues a job to upload the specified file or zip to the 1Fichier account sent with the `onefichier_token` key (optional). To get this key you must be a Premium or Premium Gold member at 1Fichier. If you are upgraded, [go to the parameters page](https://1fichier.com/console/params.pl), and get an **API Key**. This is what you will use as the `onefichier_token`, if you choose to use it. If you don't use an API Key, 1Fichier will simply create an anonymous file.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    queue1fichier(apiVersion: string, body: any, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Gets all the jobs attached to a user account. This is good for an overall view of the jobs, such as on a dashboard, or something similar.
  
  ### Statuses
  
  - "pending" -> Upload is still waiting in the queue. Waiting for spot to upload.
  - "uploading" -> Upload is uploading to the proper remote. Progress will be updated as upload continues.
  - "completed" -> Upload has successfully been uploaded. Progress will be at 1, and the download URL will be populated.
      
  - "failed" -> The upload has failed. Check the Detail key for information.
      
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetAllJobsOkResponse>>} Get All Jobs Success
   */
    getAllJobs(apiVersion: string, requestConfig?: RequestConfig): Promise<HttpResponse<GetAllJobsOkResponse>>;
    /**
   * ### Overview
  Gets a specifc job using the Job's ID. To get the ID, you will have to Get All Jobs, and get the ID you want.
  
  ### Statuses
  
  - "pending" -> Upload is still waiting in the queue. Waiting for spot to upload.
  - "uploading" -> Upload is uploading to the proper remote. Progress will be updated as upload continues.
  - "completed" -> Upload has successfully been uploaded. Progress will be at 1, and the download URL will be populated.
  - "failed" -> The upload has failed. Check the Detail key for information.
      
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {string} jobId -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>} Get Specific Job Success
   */
    getSpecificJob(apiVersion: string, jobId: string, requestConfig?: RequestConfig): Promise<HttpResponse<string>>;
    /**
   * ### Overview
  Cancels a job or deletes the job. Cancels while in progess (pending, uploading), or deletes the job any other time. It will delete it from the database completely.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {string} jobId -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    cancelSpecificJob(apiVersion: string, jobId: string, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Gets all jobs that match a specific hash. Good for checking on specific downloads such as a download page, that could contain a lot of jobs.
  
  ### Statuses
  
  - "pending" -> Upload is still waiting in the queue. Waiting for spot to upload.
  - "uploading" -> Upload is uploading to the proper remote. Progress will be updated as upload continues.
  - "completed" -> Upload has successfully been uploaded. Progress will be at 1, and the download URL will be populated.
  - "failed" -> The upload has failed. Check the Detail key for information.
      
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {string} hash -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetAllJobsByHashOkResponse>>} Get All Jobs By Hash Success
   */
    getAllJobsByHash(apiVersion: string, hash: string, requestConfig?: RequestConfig): Promise<HttpResponse<GetAllJobsByHashOkResponse>>;
}

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getAllJobsOkResponseData: z.ZodLazy<z.ZodObject<{
    authId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
    detail: z.ZodOptional<z.ZodString>;
    downloadUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    fileId: z.ZodOptional<z.ZodNumber>;
    hash: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodNumber>;
    integration: z.ZodOptional<z.ZodString>;
    progress: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
    zip: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    authId?: string | undefined;
    createdAt?: string | undefined;
    detail?: string | undefined;
    downloadUrl?: string | null | undefined;
    fileId?: number | undefined;
    hash?: string | undefined;
    id?: number | undefined;
    integration?: string | undefined;
    progress?: number | undefined;
    status?: string | undefined;
    type?: string | undefined;
    updatedAt?: string | undefined;
    zip?: boolean | undefined;
}, {
    authId?: string | undefined;
    createdAt?: string | undefined;
    detail?: string | undefined;
    downloadUrl?: string | null | undefined;
    fileId?: number | undefined;
    hash?: string | undefined;
    id?: number | undefined;
    integration?: string | undefined;
    progress?: number | undefined;
    status?: string | undefined;
    type?: string | undefined;
    updatedAt?: string | undefined;
    zip?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetAllJobsOkResponseData} getAllJobsOkResponseData
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {boolean}
 */
type GetAllJobsOkResponseData = z.infer<typeof getAllJobsOkResponseData>;

/**
 * The shape of the model inside the application code - what the users use
 */
declare const getAllJobsByHashOkResponseData: z.ZodLazy<z.ZodObject<{
    authId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
    detail: z.ZodOptional<z.ZodString>;
    downloadUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    fileId: z.ZodOptional<z.ZodNumber>;
    hash: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodNumber>;
    integration: z.ZodOptional<z.ZodString>;
    progress: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
    zip: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    authId?: string | undefined;
    createdAt?: string | undefined;
    detail?: string | undefined;
    downloadUrl?: string | null | undefined;
    fileId?: number | undefined;
    hash?: string | undefined;
    id?: number | undefined;
    integration?: string | undefined;
    progress?: number | undefined;
    status?: string | undefined;
    type?: string | undefined;
    updatedAt?: string | undefined;
    zip?: boolean | undefined;
}, {
    authId?: string | undefined;
    createdAt?: string | undefined;
    detail?: string | undefined;
    downloadUrl?: string | null | undefined;
    fileId?: number | undefined;
    hash?: string | undefined;
    id?: number | undefined;
    integration?: string | undefined;
    progress?: number | undefined;
    status?: string | undefined;
    type?: string | undefined;
    updatedAt?: string | undefined;
    zip?: boolean | undefined;
}>>;
/**
 *
 * @typedef  {GetAllJobsByHashOkResponseData} getAllJobsByHashOkResponseData
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {number}
 * @property {string}
 * @property {string}
 * @property {string}
 * @property {boolean}
 */
type GetAllJobsByHashOkResponseData = z.infer<typeof getAllJobsByHashOkResponseData>;

declare class _15 extends Error {
    data?: any | null;
    detail?: string;
    error?: string;
    success?: boolean;
    constructor(message?: string, response?: unknown);
}

declare class _16 extends Error {
    data?: string;
    detail?: string;
    error?: string;
    success?: boolean;
    constructor(message?: string, response?: unknown);
}

declare class _17 extends Error {
    data?: any | null;
    detail?: string;
    error?: string;
    success?: boolean;
    constructor(message?: string, response?: unknown);
}

interface GetQueuedDownloadsParams {
    bypassCache?: string;
    id?: string;
    offset?: string;
    limit?: string;
    type?: string;
}

declare class QueuedService extends BaseService {
    /**
   * ### Overview
  Retrieves all of a user's queued downloads by type. If you want to get all 3 types, "torrent", "usenet" and "webdl" then you will need to run this request 3 times, each with the different type.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {string} [params.bypassCache] - Allows you to bypass the cached data, and always get fresh information. Useful if constantly querying for fresh download stats. Otherwise, we request that you save our database a few calls.
   * @param {string} [params.id] - Determines the queued download requested, will return an object rather than list. Optional.
   * @param {string} [params.offset] - Determines the offset of items to get from the database. Default is 0. Optional.
   * @param {string} [params.limit] - Determines the number of items to recieve per request. Default is 1000. Optional.
   * @param {string} [params.type] - The type of the queued download you want to retrieve. Can be "torrent", "usenet" or "webdl". Optional. Default is "torrent".
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    getQueuedDownloads(apiVersion: string, params?: GetQueuedDownloadsParams, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
    /**
   * ### Overview
  Controls a queued torrent. By sending the queued torrent's ID and the type of operation you want to perform, it will perform that action on the queued torrent.
  
  Operations are either:
  
  - **Delete** `deletes the queued download from your account`
      
  - **Start** `starts a queued download, cannot be used with the "all" parameter`
      
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion -
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>}
   */
    controlQueuedDownloads(apiVersion: string, body: any, requestConfig?: RequestConfig): Promise<HttpResponse<void>>;
}

declare class TorboxApi {
    config: SdkConfig;
    readonly torrents: TorrentsService;
    readonly usenet: UsenetService;
    readonly webDownloadsDebrid: WebDownloadsDebridService;
    readonly general: GeneralService;
    readonly notifications: NotificationsService;
    readonly user: UserService;
    readonly rssFeeds: RssFeedsService;
    readonly integrations: IntegrationsService;
    readonly queued: QueuedService;
    constructor(config: SdkConfig);
    set baseUrl(baseUrl: string);
    set environment(environment: Environment);
    set timeoutMs(timeoutMs: number);
    set token(token: string);
}

export { AddReferralToAccountOkResponse, ControlTorrentOkResponse, CreateTorrentOkResponse, CreateTorrentOkResponseData, CreateTorrentRequest, CreateUsenetDownloadOkResponse, CreateUsenetDownloadOkResponseData, CreateUsenetDownloadRequest, CreateWebDownloadOkResponse, CreateWebDownloadOkResponseData, CreateWebDownloadRequest, DataFiles1, DataFiles2, DataFiles3, DataFiles4, DataFiles5, Environment, ExportTorrentDataOkResponse, GeneralService, GetAllJobsByHashOkResponse, GetAllJobsByHashOkResponseData, GetAllJobsOkResponse, GetAllJobsOkResponseData, GetChangelogsJsonOkResponse, GetChangelogsJsonOkResponseData, GetHosterListOkResponse, GetHosterListOkResponseData, GetNotificationFeedOkResponse, GetNotificationFeedOkResponseData, GetStatsOkResponse, GetStatsOkResponseData, GetTorrentCachedAvailabilityOkResponse, GetTorrentCachedAvailabilityOkResponseData, GetTorrentInfo1OkResponse, GetTorrentInfo1OkResponseData, GetTorrentInfo1Request, GetTorrentInfoOkResponse, GetTorrentInfoOkResponseData, GetTorrentListOkResponse, GetTorrentListOkResponseData, GetUpStatusOkResponse, GetUsenetListOkResponse, GetUsenetListOkResponseData, GetUserDataOkResponse, GetUserDataOkResponseData, GetWebDownloadListOkResponse, GetWebDownloadListOkResponseData, HttpError, HttpMetadata, HttpMethod, HttpResponse, IntegrationsService, NotificationsService, QueuedService, RequestConfig, RequestDownloadLinkOkResponse$1 as RequestDownloadLinkOkResponse, RetryOptions, RssFeedsService, SdkConfig, Settings, TorboxApi, TorrentsService, UsenetService, UserService, ValidationOptions, WebDownloadsDebridService, _1, _10, _11, _12, _13, _14, _15, _16, _17, _2, _3, _4, _5, _6, _7, _8, _9, __ };
