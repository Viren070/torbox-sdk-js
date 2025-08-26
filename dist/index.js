"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Environment: () => Environment,
  GeneralService: () => GeneralService,
  IntegrationsService: () => IntegrationsService,
  NotificationsService: () => NotificationsService,
  QueuedService: () => QueuedService,
  RssFeedsService: () => RssFeedsService,
  TorboxApi: () => TorboxApi,
  TorrentsService: () => TorrentsService,
  UsenetService: () => UsenetService,
  UserService: () => UserService,
  WebDownloadsDebridService: () => WebDownloadsDebridService
});
module.exports = __toCommonJS(src_exports);

// src/services/torrents/torrents-service.ts
var import_zod29 = require("zod");

// src/http/handlers/handler-chain.ts
var RequestHandlerChain = class {
  constructor() {
    this.handlers = [];
  }
  addHandler(handler) {
    if (this.handlers.length > 0) {
      const previousHandler = this.handlers[this.handlers.length - 1];
      previousHandler.next = handler;
    }
    this.handlers.push(handler);
  }
  async callChain(request) {
    if (!this.handlers.length) {
      throw new Error("No handlers added to the chain");
    }
    return this.handlers[0].handle(request);
  }
  async *streamChain(request) {
    if (!this.handlers.length) {
      throw new Error("No handlers added to the chain");
    }
    yield* this.handlers[0].stream(request);
  }
};

// src/http/error.ts
var HttpError = class extends Error {
  constructor(metadata, raw, error) {
    super(error);
    this.error = metadata.statusText;
    this.metadata = metadata;
    this.raw = raw;
  }
};

// src/http/hooks/custom-hook.ts
var CustomHook = class {
  async beforeRequest(request, params) {
    return request;
  }
  async afterResponse(request, response, params) {
    return response;
  }
  async onError(request, response, params) {
    return new HttpError(response.metadata, response.raw);
  }
};

// src/http/serialization/base-serializer.ts
var Serializer = class {
  serializeValue(param) {
    if (Array.isArray(param.value)) {
      return this.serializeArray(param.value, param);
    }
    if (this.isNonNullObject(param.value)) {
      return this.serializeObject(param.value, param);
    }
    return this.serializePrimitive(param);
  }
  serializePrimitive(param) {
    if (param.style === "label" /* LABEL */) {
      return `.${param.value}`;
    } else if (param.style === "matrix" /* MATRIX */) {
      return `;${param.key}=${param.value}`;
    } else if (param.style === "form" /* FORM */) {
      return `${encodeURIComponent(param.key || "")}=${encodeURIComponent(`${param.value}`)}`;
    }
    return `${param.value}`;
  }
  serializeArray(value, param) {
    if (param.explode) {
      this.serializeArrayExploded(value, param);
      return this.serializeArrayExploded(value, param);
    }
    if (param.style === "simple" /* SIMPLE */) {
      return `${value.join(",")}`;
    } else if (param.style === "label" /* LABEL */) {
      return `.${value.join(",")}`;
    } else if (param.style === "matrix" /* MATRIX */) {
      return `;${param.key}=${value.join(",")}`;
    } else if (param.style === "form" /* FORM */) {
      return `${encodeURIComponent(param.key || "")}=${encodeURIComponent(value.join(","))}`;
    } else if (param.style === "space_delimited" /* SPACE_DELIMITED */) {
      return `${param.key}=${value.join(" ")}`;
    } else if (param.style === "pipe_delimited" /* PIPE_DELIMITED */) {
      return `${param.key}=${value.join("|")}`;
    }
    return `${value.join(",")}`;
  }
  serializeArrayExploded(value, param) {
    if (param.style === "simple" /* SIMPLE */) {
      return value.map((val) => `${val}`).join(",");
    } else if (param.style === "label" /* LABEL */) {
      return value.map((val) => `.${val}`).join("");
    } else if (param.style === "matrix" /* MATRIX */) {
      return value.map((val) => `;${param.key}=${val}`).join("");
    } else if (param.style === "form" /* FORM */ || param.style === "space_delimited" /* SPACE_DELIMITED */ || param.style === "pipe_delimited" /* PIPE_DELIMITED */) {
      return value.map((val) => `${encodeURIComponent(param.key || "")}=${encodeURIComponent(`${val}`)}`).join("&");
    }
    return `${value.join(",")}`;
  }
  serializeObject(obj, param) {
    if (param.explode) {
      if (param.style === "simple" /* SIMPLE */) {
        return Object.entries(obj).map(([key, val]) => `${key}=${val}`).join(",");
      } else if (param.style === "label" /* LABEL */) {
        return Object.entries(obj).map(([key, val]) => `.${key}=${val}`).join("");
      } else if (param.style === "matrix" /* MATRIX */) {
        return Object.entries(obj).map(([key, val]) => `;${key}=${val}`).join("");
      } else if (param.style === "form" /* FORM */) {
        return Object.entries(obj).map(([key, val]) => `${key}=${val}`).join("&");
      }
    }
    if (param.style === "simple" /* SIMPLE */) {
      return Object.entries(obj).map(([key, val]) => `${key},${val}`).join(",");
    } else if (param.style === "label" /* LABEL */) {
      return `.${Object.entries(obj).map(([key, val]) => `${key},${val}`).join(",")}`;
    } else if (param.style === "matrix" /* MATRIX */) {
      return `;${param.key}=${Object.entries(obj).map(([key, val]) => `${key},${val}`).join(",")}`;
    } else if (param.style === "form" /* FORM */) {
      return Object.entries(obj).map(([key, val]) => `${key}=${val}`).join("&");
    } else if (param.style === "deep_object" /* DEEP_OBJECT */) {
      return Object.entries(obj).map(([key, val]) => {
        return `${param.key}[${key}]=${val}`;
      }).join("&");
    }
    return Object.entries(obj).map(([key, val]) => `${key}=${val}`).join("&");
  }
  isNonNullObject(value) {
    return typeof value === "object" && value !== null;
  }
};

// src/http/transport/transport-hook-adapter.ts
var TransportHookAdapter = class {
  constructor() {
    this.hook = new CustomHook();
  }
  async beforeRequest(request, params) {
    const hookRequest = this.requestToHookRequest(request);
    const newRequest = await this.hook.beforeRequest(hookRequest, params);
    const newTransportRequest = request.copy({
      baseUrl: newRequest.baseUrl,
      method: newRequest.method,
      path: newRequest.path,
      body: newRequest.body,
      queryParams: this.hookParamsToTransportParams(newRequest.queryParams, request.queryParams, true),
      headers: this.hookParamsToTransportParams(newRequest.headers, request.headers, false),
      pathParams: this.hookParamsToTransportParams(newRequest.pathParams, request.headers, false)
    });
    return newTransportRequest;
  }
  async afterResponse(request, response, params) {
    const hookRequest = this.requestToHookRequest(request);
    return this.hook.afterResponse(hookRequest, response, params);
  }
  async onError(request, response, params) {
    const hookRequest = this.requestToHookRequest(request);
    return this.hook.onError(hookRequest, response, params);
  }
  requestToHookRequest(request) {
    const hookHeaders = /* @__PURE__ */ new Map();
    request.headers.forEach((header, key) => {
      hookHeaders.set(key, header.value);
    });
    const hookQueryParams = /* @__PURE__ */ new Map();
    request.queryParams.forEach((queryParam, key) => {
      hookQueryParams.set(key, queryParam.value);
    });
    const hookPathParams = /* @__PURE__ */ new Map();
    request.pathParams.forEach((pathParam, key) => {
      hookPathParams.set(key, pathParam.value);
    });
    const hookRequest = {
      baseUrl: request.baseUrl,
      method: request.method,
      path: request.path,
      headers: hookHeaders,
      body: request.body,
      queryParams: hookQueryParams,
      pathParams: hookPathParams
    };
    return hookRequest;
  }
  hookParamsToTransportParams(hookParams, originalTransportParams, encode) {
    const transportParams = /* @__PURE__ */ new Map();
    hookParams.forEach((hookParamValue, hookParamKey) => {
      var _a, _b, _c, _d;
      const requestParam = originalTransportParams.get(hookParamKey);
      transportParams.set(hookParamKey, {
        key: hookParamKey,
        value: hookParamValue,
        encode: (_a = requestParam == null ? void 0 : requestParam.encode) != null ? _a : false,
        style: (requestParam == null ? void 0 : requestParam.style) || "none" /* NONE */,
        explode: (_b = requestParam == null ? void 0 : requestParam.explode) != null ? _b : false,
        isLimit: (_c = requestParam == null ? void 0 : requestParam.isLimit) != null ? _c : false,
        isOffset: (_d = requestParam == null ? void 0 : requestParam.isOffset) != null ? _d : false
      });
    });
    return transportParams;
  }
};

// src/http/utils/content-type.ts
function getContentTypeDefinition(contentType) {
  if (contentType.startsWith("application/") && contentType.includes("xml")) {
    return "xml" /* Xml */;
  }
  if (contentType.toLowerCase() === "application/x-www-form-urlencoded") {
    return "form" /* FormUrlEncoded */;
  }
  if (contentType.toLowerCase() === "text/event-stream") {
    return "eventStream" /* EventStream */;
  }
  if (contentType.toLowerCase().startsWith("text/")) {
    return "text" /* Text */;
  }
  if (contentType.toLowerCase().startsWith("image/")) {
    return "image" /* Image */;
  }
  if (contentType.toLowerCase() === "application/octet-stream") {
    return "binary" /* Binary */;
  }
  if (contentType.toLowerCase() === "application/json") {
    return "json" /* Json */;
  }
  return "json" /* Json */;
}

// src/http/handlers/hook-handler.ts
var HookHandler = class {
  constructor(hook) {
    this.hook = hook;
  }
  async handle(request) {
    var _a;
    if (!this.next) {
      throw new Error("No next handler set in hook handler.");
    }
    const hook = new TransportHookAdapter();
    const hookParams = this.getHookParams(request);
    const nextRequest = await hook.beforeRequest(request, hookParams);
    const response = await this.next.handle(nextRequest);
    if (response.metadata.status < 400) {
      return await hook.afterResponse(nextRequest, response, hookParams);
    }
    const rawContentType = ((_a = response.metadata.headers["content-type"]) == null ? void 0 : _a.toLocaleLowerCase()) || "";
    const contentType = getContentTypeDefinition(rawContentType);
    const statusCode = response.metadata.status;
    const error = request.errors.find((error2) => {
      return error2.contentType === contentType && error2.status === statusCode;
    });
    if (error == null ? void 0 : error.error) {
      const decodedBody2 = new TextDecoder().decode(response.raw);
      const json = JSON.parse(decodedBody2);
      throw new error.error((json == null ? void 0 : json.message) || "", json);
    }
    const decodedBody = new TextDecoder().decode(response.raw);
    throw new HttpError(
      response.metadata,
      response.raw,
      `Unexpected response body for error status.
StatusCode: ${response.metadata.status}
Body: ${decodedBody}`
    );
  }
  async *stream(request) {
    if (!this.next) {
      throw new Error("No next handler set in hook handler.");
    }
    const hook = new TransportHookAdapter();
    const hookParams = this.getHookParams(request);
    const nextRequest = await hook.beforeRequest(request, hookParams);
    const stream = this.next.stream(nextRequest);
    for await (const response of stream) {
      if (response.metadata.status < 400) {
        yield await hook.afterResponse(nextRequest, response, hookParams);
      } else {
        throw await hook.onError(nextRequest, response, hookParams);
      }
    }
  }
  getHookParams(_request) {
    const hookParams = /* @__PURE__ */ new Map();
    return hookParams;
  }
};

// src/http/handlers/response-validation-handler.ts
var import_zod = require("zod");

// src/http/utils/response-matcher.ts
var ResponseMatcher = class {
  constructor(responses) {
    this.responses = responses;
  }
  getResponseDefinition(response) {
    var _a;
    const rawContentType = ((_a = response.metadata.headers["content-type"]) == null ? void 0 : _a.toLocaleLowerCase()) || "";
    const contentType = getContentTypeDefinition(rawContentType);
    const statusCode = response.metadata.status;
    if (!this.responses.length) {
      return;
    }
    if (this.responses.length === 1) {
      return this.responses[0];
    }
    return this.responses.find((response2) => {
      return response2.contentType === contentType && response2.status === statusCode;
    });
  }
};

// src/http/handlers/response-validation-handler.ts
var ResponseValidationHandler = class {
  async handle(request) {
    const response = await this.next.handle(request);
    return this.decodeBody(request, response);
  }
  async *stream(request) {
    const stream = this.next.stream(request);
    for await (const response of stream) {
      const responseChunks = this.splitByDataChunks(response);
      for (const chunk of responseChunks) {
        yield this.decodeBody(request, chunk);
      }
    }
  }
  splitByDataChunks(response) {
    if (!response.metadata.headers["content-type"].includes("text/event-stream")) {
      return [response];
    }
    const text = new TextDecoder().decode(response.raw);
    const encoder = new TextEncoder();
    return text.split("\n").filter((line) => line.startsWith("data: ")).map((part) => ({
      ...response,
      raw: encoder.encode(part)
    }));
  }
  decodeBody(request, response) {
    var _a;
    const responseMatcher = new ResponseMatcher(request.responses);
    const responseDefinition = responseMatcher.getResponseDefinition(response);
    if (!responseDefinition || !this.hasContent(responseDefinition, response)) {
      return response;
    }
    const contentType = responseDefinition.contentType;
    const contentTypeHandlers = {
      ["binary" /* Binary */]: this.decodeFile,
      ["image" /* Image */]: this.decodeFile,
      ["multipartFormData" /* MultipartFormData */]: this.decodeMultipartFormData,
      ["text" /* Text */]: this.decodeText,
      ["xml" /* Xml */]: this.decodeText,
      ["form" /* FormUrlEncoded */]: this.decodeFormUrlEncoded,
      ["eventStream" /* EventStream */]: this.decodeEventStream
    };
    if (contentTypeHandlers[contentType]) {
      return contentTypeHandlers[contentType].call(this, request, responseDefinition, response);
    }
    if ((_a = response.metadata.headers["content-type"]) == null ? void 0 : _a.includes("text/event-stream")) {
      return this.decodeEventStream(request, responseDefinition, response);
    }
    return this.decodeJson(request, responseDefinition, response);
  }
  decodeFile(request, responseDefinition, response) {
    return {
      ...response,
      data: this.validate(request, responseDefinition, response.raw)
    };
  }
  decodeMultipartFormData(request, responseDefinition, response) {
    const formData = this.fromFormData(response.raw);
    return {
      ...response,
      data: this.validate(request, responseDefinition, formData)
    };
  }
  decodeText(request, responseDefinition, response) {
    const decodedBody = new TextDecoder().decode(response.raw);
    return {
      ...response,
      data: this.validate(request, responseDefinition, decodedBody)
    };
  }
  decodeFormUrlEncoded(request, responseDefinition, response) {
    const decodedBody = new TextDecoder().decode(response.raw);
    const urlEncoded = this.fromUrlEncoded(decodedBody);
    return {
      ...response,
      data: this.validate(request, responseDefinition, urlEncoded)
    };
  }
  decodeEventStream(request, responseDefinition, response) {
    let decodedBody = new TextDecoder().decode(response.raw);
    if (decodedBody.startsWith("data: ")) {
      decodedBody = decodedBody.substring(6);
    }
    const json = JSON.parse(decodedBody);
    return {
      ...response,
      data: this.validate(request, responseDefinition, json)
    };
  }
  decodeJson(request, responseDefinition, response) {
    const decodedBody = new TextDecoder().decode(response.raw);
    const json = JSON.parse(decodedBody);
    return {
      ...response,
      data: this.validate(request, responseDefinition, json)
    };
  }
  validate(request, response, data) {
    var _a;
    if ((_a = request.validation) == null ? void 0 : _a.responseValidation) {
      return response.schema.parse(data);
    }
    return data;
  }
  hasContent(responseDefinition, response) {
    return !!responseDefinition.schema && !(responseDefinition.schema instanceof import_zod.ZodUndefined) && response.metadata.status !== 204;
  }
  fromUrlEncoded(urlEncodedData) {
    const pairs = urlEncodedData.split("&");
    const result = {};
    pairs.forEach((pair) => {
      const [key, value] = pair.split("=");
      if (key && value !== void 0) {
        result[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
    return result;
  }
  fromFormData(arrayBuffer) {
    const decoder = new TextDecoder();
    const text = decoder.decode(arrayBuffer);
    const boundary = text.split("\r\n")[0];
    const parts = text.split(boundary).slice(1, -1);
    const formDataObj = {};
    parts.forEach((part) => {
      const [header, value] = part.split("\r\n\r\n");
      const nameMatch = header.match(/name="([^"]+)"/);
      if (nameMatch) {
        const name = nameMatch[1].trim();
        formDataObj[name] = (value == null ? void 0 : value.trim()) || "";
      }
    });
    return formDataObj;
  }
};

// src/http/handlers/request-validation-handler.ts
var import_zod2 = require("zod");

// src/http/errors/validation-error.ts
var ValidationError = class extends Error {
  constructor(zodError, object) {
    let actual;
    try {
      actual = JSON.stringify(object, void 0, 2);
    } catch (err) {
      actual = object;
    }
    const error = [
      `ValidationError:`,
      ...zodError.issues.map((issue) => `  Property: ${issue.path.join(".")}. Message: ${issue.message}`),
      "  Validated:",
      ...actual.split("\n").map((line) => `  ${line}`)
    ].join("\n");
    super(error);
    this.error = error;
  }
};

// src/http/handlers/request-validation-handler.ts
var RequestValidationHandler = class {
  async handle(request) {
    if (!this.next) {
      throw new Error("No next handler set in ContentTypeHandler.");
    }
    this.validateRequest(request);
    return this.next.handle(request);
  }
  async *stream(request) {
    if (!this.next) {
      throw new Error("No next handler set in ContentTypeHandler.");
    }
    this.validateRequest(request);
    yield* this.next.stream(request);
  }
  validateRequest(request) {
    var _a, _b;
    if (request.requestContentType === "json" /* Json */) {
      try {
        const parsedBody = (_a = request.requestSchema) == null ? void 0 : _a.parse(request.body);
        request.body = JSON.stringify(parsedBody);
      } catch (error) {
        if (error instanceof import_zod2.ZodError) {
          throw new ValidationError(error, request.body);
        }
        throw error;
      }
    } else if (request.requestContentType === "xml" /* Xml */ || request.requestContentType === "text" /* Text */ || request.requestContentType === "image" /* Image */ || request.requestContentType === "binary" /* Binary */) {
      request.body = request.body;
    } else if (request.requestContentType === "form" /* FormUrlEncoded */) {
      request.body = this.toFormUrlEncoded(request);
    } else if (request.requestContentType === "multipartFormData" /* MultipartFormData */) {
      request.body = this.toFormData(request.body);
    } else {
      request.body = JSON.stringify((_b = request.requestSchema) == null ? void 0 : _b.parse(request.body));
    }
  }
  toFormUrlEncoded(request) {
    var _a;
    if (request.body === void 0) {
      return "";
    }
    if (typeof request.body === "string") {
      return request.body;
    }
    if (request.body instanceof URLSearchParams) {
      return request.body.toString();
    }
    const validatedBody = (_a = request.requestSchema) == null ? void 0 : _a.parse(request.body);
    if (validatedBody instanceof FormData) {
      const params = new URLSearchParams();
      validatedBody.forEach((value, key) => {
        if (value != null) {
          params.append(key, value.toString());
        }
      });
      return params.toString();
    }
    if (typeof validatedBody === "object" && !Array.isArray(validatedBody)) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(validatedBody)) {
        if (value != null) {
          params.append(key, `${value}`);
        }
      }
      return params.toString();
    }
    return "";
  }
  toFormData(body) {
    const formData = new FormData();
    Object.keys(body).forEach((key) => {
      const value = body[key];
      if (Array.isArray(value)) {
        value.forEach((v, i) => formData.append(`${key}[${i}]`, v));
      } else if (value instanceof ArrayBuffer) {
        formData.append(key, new Blob([value]));
      } else {
        formData.append(key, value);
      }
    });
    return formData;
  }
};

// src/http/utils/line-decoder.ts
var LineDecoder = class {
  constructor() {
    this.lineBuffer = "";
    this.decoder = new TextDecoder();
    this.encoder = new TextEncoder();
  }
  /**
   * Splits the given chunk into lines.
   * Stores incomplete lines in a buffer and returns them when the next chunk arrives.
   */
  splitLines(chunk) {
    this.lineBuffer += this.decoder.decode(chunk);
    let lineEndIndex;
    const lines = [];
    while ((lineEndIndex = this.lineBuffer.indexOf("\n")) >= 0) {
      const line = this.lineBuffer.slice(0, lineEndIndex + 1);
      this.lineBuffer = this.lineBuffer.slice(lineEndIndex + 1);
      if (line.length > 1) {
        lines.push(this.encoder.encode(line));
      }
    }
    return lines;
  }
  /** Returns the remaining lines in the buffer. */
  flush() {
    if (this.lineBuffer.length === 0) {
      return [];
    }
    const lines = [this.encoder.encode(this.lineBuffer)];
    this.lineBuffer = "";
    return lines;
  }
};

// src/http/transport/request-fetch-adapter.ts
var RequestFetchAdapter = class {
  constructor(request) {
    this.request = request;
    this.requestInit = {};
    this.setMethod(request.method);
    this.setHeaders(request.getHeaders());
    this.setBody(request.body);
    this.setTimeout(request.config.timeoutMs);
  }
  async send() {
    const response = await fetch(this.request.constructFullUrl(), this.requestInit);
    const metadata = {
      status: response.status,
      statusText: response.statusText || "",
      headers: this.getHeaders(response)
    };
    return {
      metadata,
      raw: await response.clone().arrayBuffer()
    };
  }
  async *stream() {
    const response = await fetch(this.request.constructFullUrl(), this.requestInit);
    const metadata = {
      status: response.status,
      statusText: response.statusText || "",
      headers: this.getHeaders(response)
    };
    if (response.status >= 400) {
      throw new HttpError(metadata, await response.clone().arrayBuffer());
    }
    if (!response.body) {
      return yield {
        metadata,
        raw: await response.clone().arrayBuffer()
      };
    }
    const reader = response.body.getReader();
    const lineDecoder = new LineDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      for (const line of lineDecoder.splitLines(value)) {
        yield {
          metadata,
          raw: line
        };
      }
    }
    for (const line of lineDecoder.flush()) {
      yield {
        metadata,
        raw: line
      };
    }
  }
  setMethod(method) {
    if (!method) {
      return;
    }
    this.requestInit = {
      ...this.requestInit,
      method
    };
  }
  setBody(body) {
    if (!body) {
      return;
    }
    this.requestInit = {
      ...this.requestInit,
      body
    };
  }
  setHeaders(headers) {
    if (!headers) {
      return;
    }
    this.requestInit = {
      ...this.requestInit,
      headers
    };
  }
  setTimeout(timeoutMs) {
    if (!timeoutMs) {
      return;
    }
    this.requestInit = {
      ...this.requestInit,
      signal: AbortSignal.timeout(timeoutMs)
    };
  }
  getHeaders(response) {
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }
};

// src/http/handlers/terminating-handler.ts
var TerminatingHandler = class {
  async handle(request) {
    return new RequestFetchAdapter(request).send();
  }
  async *stream(request) {
    yield* new RequestFetchAdapter(request).stream();
  }
};

// src/http/handlers/retry-handler.ts
var RetryHandler = class {
  async handle(request) {
    if (!this.next) {
      throw new Error("No next handler set in retry handler.");
    }
    for (let attempt = 1; attempt <= request.retry.attempts; attempt++) {
      try {
        return await this.next.handle(request);
      } catch (error) {
        if (!this.shouldRetry(error) || attempt === request.retry.attempts) {
          throw error;
        }
        await this.delay(request.retry.delayMs);
      }
    }
    throw new Error("Error retrying request.");
  }
  async *stream(request) {
    if (!this.next) {
      throw new Error("No next handler set in retry handler.");
    }
    for (let attempt = 1; attempt <= request.retry.attempts; attempt++) {
      try {
        yield* this.next.stream(request);
        return;
      } catch (error) {
        if (!this.shouldRetry(error) || attempt === request.retry.attempts) {
          throw error;
        }
        await this.delay(request.retry.delayMs);
      }
    }
    throw new Error("Error retrying request.");
  }
  shouldRetry(error) {
    return error instanceof HttpError && (error.metadata.status >= 500 || error.metadata.status === 408);
  }
  delay(delayMs) {
    if (!delayMs) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), delayMs);
    });
  }
};

// src/http/client.ts
var HttpClient = class {
  constructor(config, hook = new CustomHook()) {
    this.config = config;
    this.requestHandlerChain = new RequestHandlerChain();
    this.requestHandlerChain.addHandler(new ResponseValidationHandler());
    this.requestHandlerChain.addHandler(new RequestValidationHandler());
    this.requestHandlerChain.addHandler(new RetryHandler());
    this.requestHandlerChain.addHandler(new HookHandler(hook));
    this.requestHandlerChain.addHandler(new TerminatingHandler());
  }
  call(request) {
    return this.requestHandlerChain.callChain(request);
  }
  async *stream(request) {
    yield* this.requestHandlerChain.streamChain(request);
  }
  async callPaginated(request) {
    const response = await this.call(request);
    if (!response.data) {
      throw new Error("no response data to paginate through");
    }
    return {
      ...response,
      data: this.getPage(request, response.data)
    };
  }
  setBaseUrl(url) {
    this.config.baseUrl = url;
  }
  setConfig(config) {
    this.config = config;
  }
  getPage(request, data) {
    var _a, _b, _c, _d;
    if (!request.pagination) {
      throw new Error("getPage called for request without pagination property");
    }
    let curr = data;
    for (const segment of ((_a = request.pagination) == null ? void 0 : _a.pagePath) || []) {
      curr = curr[segment];
    }
    const page = (_c = (_b = request.pagination) == null ? void 0 : _b.pageSchema) == null ? void 0 : _c.parse(curr);
    if (!page) {
      throw new Error(
        `error getting page data. Curr: ${JSON.stringify(curr)}. PagePath: ${(_d = request.pagination) == null ? void 0 : _d.pagePath}. Data: ${JSON.stringify(data)}`
      );
    }
    return page;
  }
};

// src/services/base-service.ts
var BaseService = class {
  constructor(config) {
    this.config = config;
    this.client = new HttpClient(this.config);
  }
  set baseUrl(baseUrl) {
    this.config.baseUrl = baseUrl;
  }
  set environment(environment) {
    this.config.environment = environment;
  }
  set timeoutMs(timeoutMs) {
    this.config.timeoutMs = timeoutMs;
  }
  set token(token) {
    this.config.token = token;
  }
};

// src/http/transport/request-builder.ts
var import_zod3 = __toESM(require("zod"));

// src/http/serialization/path-serializer.ts
var PathSerializer = class extends Serializer {
  serialize(pathPattern, pathArguments) {
    let serializedPath = pathPattern;
    pathArguments.forEach((param) => {
      serializedPath = serializedPath.replace(`{${param.key}}`, `${this.serializeValue(param)}`);
    });
    return serializedPath;
  }
};

// src/http/serialization/query-serializer.ts
var QuerySerializer = class extends Serializer {
  serialize(queryParams) {
    if (!queryParams || !queryParams.size) {
      return "";
    }
    const query = [];
    queryParams.forEach((param) => {
      return query.push(`${this.serializeValue(param)}`);
    });
    return query.length ? `?${query.join("&")}` : "";
  }
};

// src/http/serialization/header-serializer.ts
var HeaderSerializer = class extends Serializer {
  serialize(headerParams) {
    if (!headerParams || !headerParams.size) {
      return void 0;
    }
    const headers = {};
    headerParams.forEach((param) => {
      if (!param.key) {
        return;
      }
      headers[param.key] = this.serializeValue(param);
    });
    return headers;
  }
};

// src/http/transport/request.ts
var Request = class {
  constructor(params) {
    this.baseUrl = "";
    this.headers = /* @__PURE__ */ new Map();
    this.queryParams = /* @__PURE__ */ new Map();
    this.pathParams = /* @__PURE__ */ new Map();
    this.validation = {};
    this.retry = {};
    this.baseUrl = params.baseUrl;
    this.method = params.method;
    this.pathPattern = params.path;
    this.body = params.body;
    this.path = this.constructPath();
    this.config = params.config;
    this.pathParams = params.pathParams;
    this.headers = params.headers;
    this.queryParams = params.queryParams;
    this.responses = params.responses;
    this.errors = params.errors;
    this.requestSchema = params.requestSchema;
    this.requestContentType = params.requestContentType;
    this.retry = params.retry;
    this.validation = params.validation;
    this.pagination = params.pagination;
  }
  addHeaderParam(key, param) {
    if (param.value === void 0) {
      return;
    }
    if (param.explode === void 0) {
      param.explode = false;
    }
    if (param.style === void 0) {
      param.style = "simple" /* SIMPLE */;
    }
    if (param.encode === void 0) {
      param.encode = false;
    }
    this.headers.set(key, param);
  }
  addQueryParam(key, param) {
    if (param.value === void 0) {
      return;
    }
    if (param.explode === void 0) {
      param.explode = true;
    }
    if (param.style === void 0) {
      param.style = "form" /* FORM */;
    }
    if (param.encode === void 0) {
      param.encode = true;
    }
    this.queryParams.set(key, param);
  }
  addPathParam(key, param) {
    if (param.value === void 0) {
      return;
    }
    if (param.explode === void 0) {
      param.explode = false;
    }
    if (param.style === void 0) {
      param.style = "simple" /* SIMPLE */;
    }
    if (param.encode === void 0) {
      param.encode = true;
    }
    this.pathParams.set(key, param);
  }
  addBody(body) {
    if (body === void 0) {
      return;
    }
    this.body = body;
  }
  updateFromHookRequest(hookRequest) {
    this.baseUrl = hookRequest.baseUrl;
    this.method = hookRequest.method;
    this.path = hookRequest.path;
    this.body = hookRequest.body;
  }
  constructFullUrl() {
    const queryString = new QuerySerializer().serialize(this.queryParams);
    const path = this.constructPath();
    let baseUrl = this.baseUrl;
    return `${baseUrl}${path}${queryString}`;
  }
  copy(overrides) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
    const createRequestParams = {
      baseUrl: (_a = overrides == null ? void 0 : overrides.baseUrl) != null ? _a : this.baseUrl,
      errors: (_b = overrides == null ? void 0 : overrides.errors) != null ? _b : this.errors,
      method: (_c = overrides == null ? void 0 : overrides.method) != null ? _c : this.method,
      path: (_d = overrides == null ? void 0 : overrides.path) != null ? _d : this.path,
      body: (_e = overrides == null ? void 0 : overrides.body) != null ? _e : this.body,
      config: (_f = overrides == null ? void 0 : overrides.config) != null ? _f : this.config,
      pathParams: (_g = overrides == null ? void 0 : overrides.pathParams) != null ? _g : this.pathParams,
      queryParams: (_h = overrides == null ? void 0 : overrides.queryParams) != null ? _h : this.queryParams,
      headers: (_i = overrides == null ? void 0 : overrides.headers) != null ? _i : this.headers,
      responses: (_j = overrides == null ? void 0 : overrides.responses) != null ? _j : this.responses,
      requestSchema: (_k = overrides == null ? void 0 : overrides.requestSchema) != null ? _k : this.requestSchema,
      requestContentType: (_l = overrides == null ? void 0 : overrides.requestContentType) != null ? _l : this.requestContentType,
      retry: (_m = overrides == null ? void 0 : overrides.retry) != null ? _m : this.retry,
      validation: (_n = overrides == null ? void 0 : overrides.validation) != null ? _n : this.validation
    };
    return new Request({
      ...createRequestParams,
      ...overrides
    });
  }
  getHeaders() {
    if (!this.headers || !this.headers.size) {
      return void 0;
    }
    return new HeaderSerializer().serialize(this.headers);
  }
  nextPage() {
    if (!this.pagination) {
      return;
    }
    const offsetParam = this.getOffsetParam();
    if (!offsetParam) {
      return;
    }
    offsetParam.value = Number(offsetParam.value) + this.pagination.pageSize;
  }
  constructPath() {
    return new PathSerializer().serialize(this.pathPattern, this.pathParams);
  }
  getOffsetParam() {
    const offsetParam = this.getAllParams().find((param) => param.isOffset);
    return offsetParam;
  }
  getAllParams() {
    const allParams = [];
    this.headers.forEach((val, _) => {
      allParams.push(val);
    });
    this.queryParams.forEach((val, _) => {
      allParams.push(val);
    });
    this.pathParams.forEach((val, _) => {
      allParams.push(val);
    });
    return allParams;
  }
};

// src/http/environment.ts
var Environment = /* @__PURE__ */ ((Environment2) => {
  Environment2["DEFAULT"] = "https://api.torbox.app";
  return Environment2;
})(Environment || {});

// src/http/transport/request-builder.ts
var RequestBuilder = class {
  constructor() {
    this.params = {
      baseUrl: "https://api.torbox.app" /* DEFAULT */,
      method: "GET",
      path: "",
      config: {},
      responses: [],
      errors: [],
      requestSchema: import_zod3.default.any(),
      requestContentType: "json" /* Json */,
      retry: {
        attempts: 3,
        delayMs: 150
      },
      validation: {
        responseValidation: true
      },
      pathParams: /* @__PURE__ */ new Map(),
      queryParams: /* @__PURE__ */ new Map(),
      headers: /* @__PURE__ */ new Map()
    };
  }
  setRetryAttempts(sdkConfig, requestConfig) {
    var _a, _b;
    if (((_a = requestConfig == null ? void 0 : requestConfig.retry) == null ? void 0 : _a.attempts) !== void 0) {
      this.params.retry.attempts = requestConfig.retry.attempts;
    } else if (((_b = sdkConfig == null ? void 0 : sdkConfig.retry) == null ? void 0 : _b.attempts) !== void 0) {
      this.params.retry.attempts = sdkConfig.retry.attempts;
    }
    return this;
  }
  setRetryDelayMs(sdkConfig, requestConfig) {
    var _a, _b;
    if (((_a = requestConfig == null ? void 0 : requestConfig.retry) == null ? void 0 : _a.delayMs) !== void 0) {
      this.params.retry.delayMs = requestConfig.retry.delayMs;
    } else if (((_b = sdkConfig == null ? void 0 : sdkConfig.retry) == null ? void 0 : _b.delayMs) !== void 0) {
      this.params.retry.delayMs = sdkConfig.retry.delayMs;
    }
    return this;
  }
  setResponseValidation(sdkConfig, requestConfig) {
    var _a, _b;
    if (((_a = requestConfig == null ? void 0 : requestConfig.validation) == null ? void 0 : _a.responseValidation) !== void 0) {
      this.params.validation.responseValidation = requestConfig.validation.responseValidation;
    } else if (((_b = sdkConfig == null ? void 0 : sdkConfig.validation) == null ? void 0 : _b.responseValidation) !== void 0) {
      this.params.validation.responseValidation = sdkConfig.validation.responseValidation;
    }
    return this;
  }
  setBaseUrl(baseUrl) {
    if (baseUrl) {
      this.params.baseUrl = baseUrl;
    }
    return this;
  }
  setMethod(method) {
    this.params.method = method;
    return this;
  }
  setPath(path) {
    this.params.path = path;
    return this;
  }
  setConfig(config) {
    this.params.config = config;
    return this;
  }
  setRequestContentType(contentType) {
    this.params.requestContentType = contentType;
    return this;
  }
  setRequestSchema(requestSchema) {
    this.params.requestSchema = requestSchema;
    return this;
  }
  setPagination(pagination) {
    this.params.pagination = pagination;
    return this;
  }
  addAccessTokenAuth(accessToken, prefix) {
    if (accessToken === void 0) {
      return this;
    }
    this.params.headers.set("Authorization", {
      key: "Authorization",
      value: `${prefix != null ? prefix : "Bearer"} ${accessToken}`,
      explode: false,
      style: "simple" /* SIMPLE */,
      encode: true,
      isLimit: false,
      isOffset: false
    });
    return this;
  }
  addBasicAuth(username, password) {
    if (username === void 0 || password === void 0) {
      return this;
    }
    this.params.headers.set("Authorization", {
      key: "Authorization",
      value: `Basic ${this.toBase64(`${username}:${password}`)}`,
      explode: false,
      style: "simple" /* SIMPLE */,
      encode: true,
      isLimit: false,
      isOffset: false
    });
    return this;
  }
  addApiKeyAuth(apiKey, keyName) {
    if (apiKey === void 0) {
      return this;
    }
    this.params.headers.set(keyName != null ? keyName : "X-API-KEY", {
      key: keyName != null ? keyName : "X-API-KEY",
      value: apiKey,
      explode: false,
      style: "simple" /* SIMPLE */,
      encode: true,
      isLimit: false,
      isOffset: false
    });
    return this;
  }
  addResponse(response) {
    this.params.responses.push(response);
    return this;
  }
  addError(error) {
    this.params.errors.push(error);
    return this;
  }
  addBody(body) {
    if (body !== void 0) {
      this.params.body = body;
    }
    return this;
  }
  addPathParam(param) {
    var _a, _b, _c;
    if (param.value === void 0 || param.key === void 0) {
      return this;
    }
    this.params.pathParams.set(param.key, {
      key: param.key,
      value: param.value,
      explode: (_a = param.explode) != null ? _a : true,
      style: (_b = param.style) != null ? _b : "simple" /* SIMPLE */,
      encode: (_c = param.encode) != null ? _c : true,
      isLimit: !!param.isLimit,
      isOffset: !!param.isOffset
    });
    return this;
  }
  addQueryParam(param) {
    var _a, _b, _c;
    if (param.value === void 0 || param.key === void 0) {
      return this;
    }
    this.params.queryParams.set(param.key, {
      key: param.key,
      value: param.value,
      explode: (_a = param.explode) != null ? _a : true,
      style: (_b = param.style) != null ? _b : "form" /* FORM */,
      encode: (_c = param.encode) != null ? _c : true,
      isLimit: !!param.isLimit,
      isOffset: !!param.isOffset
    });
    return this;
  }
  addHeaderParam(param) {
    var _a, _b, _c;
    if (param.value === void 0 || param.key === void 0) {
      return this;
    }
    this.params.headers.set(param.key, {
      key: param.key,
      value: param.value,
      explode: (_a = param.explode) != null ? _a : true,
      style: (_b = param.style) != null ? _b : "simple" /* SIMPLE */,
      encode: (_c = param.encode) != null ? _c : false,
      isLimit: !!param.isLimit,
      isOffset: !!param.isOffset
    });
    return this;
  }
  build() {
    return new Request(this.params);
  }
  toBase64(str) {
    if (typeof window === "undefined") {
      return Buffer.from(str, "utf-8").toString("base64");
    } else {
      return btoa(unescape(encodeURIComponent(str)));
    }
  }
};

// src/services/torrents/models/create-torrent-request.ts
var import_zod4 = require("zod");
var createTorrentRequest = import_zod4.z.lazy(() => {
  return import_zod4.z.object({
    allowZip: import_zod4.z.string().optional(),
    asQueued: import_zod4.z.string().optional(),
    file: import_zod4.z.instanceof(ArrayBuffer).optional(),
    magnet: import_zod4.z.string().optional(),
    name: import_zod4.z.string().optional(),
    seed: import_zod4.z.string().optional()
  });
});
var createTorrentRequestResponse = import_zod4.z.lazy(() => {
  return import_zod4.z.object({
    allow_zip: import_zod4.z.string().optional(),
    as_queued: import_zod4.z.string().optional(),
    file: import_zod4.z.instanceof(ArrayBuffer).optional(),
    magnet: import_zod4.z.string().optional(),
    name: import_zod4.z.string().optional(),
    seed: import_zod4.z.string().optional()
  }).transform((data) => ({
    allowZip: data["allow_zip"],
    asQueued: data["as_queued"],
    file: data["file"],
    magnet: data["magnet"],
    name: data["name"],
    seed: data["seed"]
  }));
});
var createTorrentRequestRequest = import_zod4.z.lazy(() => {
  return import_zod4.z.object({
    allowZip: import_zod4.z.string().optional(),
    asQueued: import_zod4.z.string().optional(),
    file: import_zod4.z.instanceof(ArrayBuffer).optional(),
    magnet: import_zod4.z.string().optional(),
    name: import_zod4.z.string().optional(),
    seed: import_zod4.z.string().optional()
  }).transform((data) => ({
    allow_zip: data["allowZip"],
    as_queued: data["asQueued"],
    file: data["file"],
    magnet: data["magnet"],
    name: data["name"],
    seed: data["seed"]
  }));
});

// src/services/torrents/models/create-torrent-ok-response.ts
var import_zod6 = require("zod");

// src/services/torrents/models/create-torrent-ok-response-data.ts
var import_zod5 = require("zod");
var createTorrentOkResponseData = import_zod5.z.lazy(() => {
  return import_zod5.z.object({
    activeLimit: import_zod5.z.number().optional(),
    authId: import_zod5.z.string().optional(),
    currentActiveDownloads: import_zod5.z.number().optional(),
    hash: import_zod5.z.string().optional(),
    queuedId: import_zod5.z.number().optional(),
    torrentId: import_zod5.z.number().optional()
  });
});
var createTorrentOkResponseDataResponse = import_zod5.z.lazy(() => {
  return import_zod5.z.object({
    active_limit: import_zod5.z.number().optional(),
    auth_id: import_zod5.z.string().optional(),
    current_active_downloads: import_zod5.z.number().optional(),
    hash: import_zod5.z.string().optional(),
    queued_id: import_zod5.z.number().optional(),
    torrent_id: import_zod5.z.number().optional()
  }).transform((data) => ({
    activeLimit: data["active_limit"],
    authId: data["auth_id"],
    currentActiveDownloads: data["current_active_downloads"],
    hash: data["hash"],
    queuedId: data["queued_id"],
    torrentId: data["torrent_id"]
  }));
});
var createTorrentOkResponseDataRequest = import_zod5.z.lazy(() => {
  return import_zod5.z.object({
    activeLimit: import_zod5.z.number().optional(),
    authId: import_zod5.z.string().optional(),
    currentActiveDownloads: import_zod5.z.number().optional(),
    hash: import_zod5.z.string().optional(),
    queuedId: import_zod5.z.number().optional(),
    torrentId: import_zod5.z.number().optional()
  }).transform((data) => ({
    active_limit: data["activeLimit"],
    auth_id: data["authId"],
    current_active_downloads: data["currentActiveDownloads"],
    hash: data["hash"],
    queued_id: data["queuedId"],
    torrent_id: data["torrentId"]
  }));
});

// src/services/torrents/models/create-torrent-ok-response.ts
var createTorrentOkResponse = import_zod6.z.lazy(() => {
  return import_zod6.z.object({
    data: createTorrentOkResponseData.optional(),
    detail: import_zod6.z.string().optional(),
    error: import_zod6.z.any().optional().nullable(),
    success: import_zod6.z.boolean().optional()
  });
});
var createTorrentOkResponseResponse = import_zod6.z.lazy(() => {
  return import_zod6.z.object({
    data: createTorrentOkResponseDataResponse.optional(),
    detail: import_zod6.z.string().optional(),
    error: import_zod6.z.any().optional().nullable(),
    success: import_zod6.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var createTorrentOkResponseRequest = import_zod6.z.lazy(() => {
  return import_zod6.z.object({
    data: createTorrentOkResponseDataRequest.optional(),
    detail: import_zod6.z.string().optional(),
    error: import_zod6.z.any().optional().nullable(),
    success: import_zod6.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/torrents/models/__.ts
var import_zod8 = require("zod");

// src/services/torrents/models/_1.ts
var import_zod7 = require("zod");
var _1 = import_zod7.z.lazy(() => {
  return import_zod7.z.object({
    cooldownUntil: import_zod7.z.string().optional(),
    currentDownloads: import_zod7.z.number().optional(),
    currentTime: import_zod7.z.string().optional(),
    monthlyLimit: import_zod7.z.number().optional()
  });
});
var _1Response = import_zod7.z.lazy(() => {
  return import_zod7.z.object({
    cooldown_until: import_zod7.z.string().optional(),
    current_downloads: import_zod7.z.number().optional(),
    current_time: import_zod7.z.string().optional(),
    monthly_limit: import_zod7.z.number().optional()
  }).transform((data) => ({
    cooldownUntil: data["cooldown_until"],
    currentDownloads: data["current_downloads"],
    currentTime: data["current_time"],
    monthlyLimit: data["monthly_limit"]
  }));
});
var _1Request = import_zod7.z.lazy(() => {
  return import_zod7.z.object({
    cooldownUntil: import_zod7.z.string().optional(),
    currentDownloads: import_zod7.z.number().optional(),
    currentTime: import_zod7.z.string().optional(),
    monthlyLimit: import_zod7.z.number().optional()
  }).transform((data) => ({
    cooldown_until: data["cooldownUntil"],
    current_downloads: data["currentDownloads"],
    current_time: data["currentTime"],
    monthly_limit: data["monthlyLimit"]
  }));
});

// src/services/torrents/models/__.ts
var _response = import_zod8.z.lazy(() => {
  return import_zod8.z.object({
    data: _1Response.optional().nullable(),
    detail: import_zod8.z.string().optional(),
    error: import_zod8.z.boolean().optional().nullable(),
    success: import_zod8.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var __ = class extends Error {
  constructor(message, response) {
    super(message);
    const parsedResponse = _response.parse(response);
    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
};

// src/services/torrents/models/_2.ts
var import_zod9 = require("zod");
var _2Response = import_zod9.z.lazy(() => {
  return import_zod9.z.object({
    data: import_zod9.z.any().optional().nullable(),
    detail: import_zod9.z.string().optional(),
    error: import_zod9.z.any().optional().nullable(),
    success: import_zod9.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var _2 = class extends Error {
  constructor(message, response) {
    super(message);
    const parsedResponse = _2Response.parse(response);
    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
};

// src/services/torrents/models/control-torrent-ok-response.ts
var import_zod10 = require("zod");
var controlTorrentOkResponse = import_zod10.z.lazy(() => {
  return import_zod10.z.object({
    data: import_zod10.z.any().optional().nullable(),
    detail: import_zod10.z.string().optional(),
    error: import_zod10.z.any().optional().nullable(),
    success: import_zod10.z.boolean().optional()
  });
});
var controlTorrentOkResponseResponse = import_zod10.z.lazy(() => {
  return import_zod10.z.object({
    data: import_zod10.z.any().optional().nullable(),
    detail: import_zod10.z.string().optional(),
    error: import_zod10.z.any().optional().nullable(),
    success: import_zod10.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var controlTorrentOkResponseRequest = import_zod10.z.lazy(() => {
  return import_zod10.z.object({
    data: import_zod10.z.any().optional().nullable(),
    detail: import_zod10.z.string().optional(),
    error: import_zod10.z.any().optional().nullable(),
    success: import_zod10.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/torrents/models/_3.ts
var import_zod11 = require("zod");
var _3Response = import_zod11.z.lazy(() => {
  return import_zod11.z.object({
    data: import_zod11.z.any().optional().nullable(),
    detail: import_zod11.z.string().optional(),
    error: import_zod11.z.string().optional(),
    success: import_zod11.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var _3 = class extends Error {
  constructor(message, response) {
    super(message);
    const parsedResponse = _3Response.parse(response);
    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
};

// src/services/torrents/models/_4.ts
var import_zod12 = require("zod");
var _4Response = import_zod12.z.lazy(() => {
  return import_zod12.z.object({
    data: import_zod12.z.any().optional().nullable(),
    detail: import_zod12.z.string().optional(),
    error: import_zod12.z.string().optional(),
    success: import_zod12.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var _4 = class extends Error {
  constructor(message, response) {
    super(message);
    const parsedResponse = _4Response.parse(response);
    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
};

// src/services/torrents/models/request-download-link-ok-response.ts
var import_zod13 = require("zod");
var requestDownloadLinkOkResponse = import_zod13.z.lazy(() => {
  return import_zod13.z.object({
    data: import_zod13.z.string().optional(),
    detail: import_zod13.z.string().optional(),
    error: import_zod13.z.any().optional().nullable(),
    success: import_zod13.z.boolean().optional()
  });
});
var requestDownloadLinkOkResponseResponse = import_zod13.z.lazy(() => {
  return import_zod13.z.object({
    data: import_zod13.z.string().optional(),
    detail: import_zod13.z.string().optional(),
    error: import_zod13.z.any().optional().nullable(),
    success: import_zod13.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var requestDownloadLinkOkResponseRequest = import_zod13.z.lazy(() => {
  return import_zod13.z.object({
    data: import_zod13.z.string().optional(),
    detail: import_zod13.z.string().optional(),
    error: import_zod13.z.any().optional().nullable(),
    success: import_zod13.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/torrents/models/get-torrent-list-ok-response.ts
var import_zod16 = require("zod");

// src/services/torrents/models/get-torrent-list-ok-response-data.ts
var import_zod15 = require("zod");

// src/services/torrents/models/data-files-1.ts
var import_zod14 = require("zod");
var dataFiles1 = import_zod14.z.lazy(() => {
  return import_zod14.z.object({
    id: import_zod14.z.number().optional(),
    md5: import_zod14.z.string().optional(),
    mimetype: import_zod14.z.string().optional(),
    name: import_zod14.z.string().optional(),
    s3Path: import_zod14.z.string().optional(),
    shortName: import_zod14.z.string().optional(),
    size: import_zod14.z.number().optional()
  });
});
var dataFiles1Response = import_zod14.z.lazy(() => {
  return import_zod14.z.object({
    id: import_zod14.z.number().optional(),
    md5: import_zod14.z.string().optional(),
    mimetype: import_zod14.z.string().optional(),
    name: import_zod14.z.string().optional(),
    s3_path: import_zod14.z.string().optional(),
    short_name: import_zod14.z.string().optional(),
    size: import_zod14.z.number().optional()
  }).transform((data) => ({
    id: data["id"],
    md5: data["md5"],
    mimetype: data["mimetype"],
    name: data["name"],
    s3Path: data["s3_path"],
    shortName: data["short_name"],
    size: data["size"]
  }));
});
var dataFiles1Request = import_zod14.z.lazy(() => {
  return import_zod14.z.object({
    id: import_zod14.z.number().optional(),
    md5: import_zod14.z.string().optional(),
    mimetype: import_zod14.z.string().optional(),
    name: import_zod14.z.string().optional(),
    s3Path: import_zod14.z.string().optional(),
    shortName: import_zod14.z.string().optional(),
    size: import_zod14.z.number().optional()
  }).transform((data) => ({
    id: data["id"],
    md5: data["md5"],
    mimetype: data["mimetype"],
    name: data["name"],
    s3_path: data["s3Path"],
    short_name: data["shortName"],
    size: data["size"]
  }));
});

// src/services/torrents/models/get-torrent-list-ok-response-data.ts
var getTorrentListOkResponseData = import_zod15.z.lazy(() => {
  return import_zod15.z.object({
    active: import_zod15.z.boolean().optional(),
    authId: import_zod15.z.string().optional(),
    availability: import_zod15.z.number().optional(),
    createdAt: import_zod15.z.string().optional(),
    downloadFinished: import_zod15.z.boolean().optional(),
    downloadPresent: import_zod15.z.boolean().optional(),
    downloadSpeed: import_zod15.z.number().optional(),
    downloadState: import_zod15.z.string().optional(),
    eta: import_zod15.z.number().optional(),
    expiresAt: import_zod15.z.string().optional(),
    files: import_zod15.z.array(dataFiles1).optional(),
    hash: import_zod15.z.string().optional(),
    id: import_zod15.z.number().optional(),
    inactiveCheck: import_zod15.z.number().optional(),
    magnet: import_zod15.z.string().optional(),
    name: import_zod15.z.string().optional(),
    peers: import_zod15.z.number().optional(),
    progress: import_zod15.z.number().optional(),
    ratio: import_zod15.z.number().optional(),
    seeds: import_zod15.z.number().optional(),
    server: import_zod15.z.number().optional(),
    size: import_zod15.z.number().optional(),
    torrentFile: import_zod15.z.boolean().optional(),
    updatedAt: import_zod15.z.string().optional(),
    uploadSpeed: import_zod15.z.number().optional()
  });
});
var getTorrentListOkResponseDataResponse = import_zod15.z.lazy(() => {
  return import_zod15.z.object({
    active: import_zod15.z.boolean().optional(),
    auth_id: import_zod15.z.string().optional(),
    availability: import_zod15.z.number().optional(),
    created_at: import_zod15.z.string().optional(),
    download_finished: import_zod15.z.boolean().optional(),
    download_present: import_zod15.z.boolean().optional(),
    download_speed: import_zod15.z.number().optional(),
    download_state: import_zod15.z.string().optional(),
    eta: import_zod15.z.number().optional(),
    expires_at: import_zod15.z.string().optional(),
    files: import_zod15.z.array(dataFiles1Response).optional(),
    hash: import_zod15.z.string().optional(),
    id: import_zod15.z.number().optional(),
    inactive_check: import_zod15.z.number().optional(),
    magnet: import_zod15.z.string().optional(),
    name: import_zod15.z.string().optional(),
    peers: import_zod15.z.number().optional(),
    progress: import_zod15.z.number().optional(),
    ratio: import_zod15.z.number().optional(),
    seeds: import_zod15.z.number().optional(),
    server: import_zod15.z.number().optional(),
    size: import_zod15.z.number().optional(),
    torrent_file: import_zod15.z.boolean().optional(),
    updated_at: import_zod15.z.string().optional(),
    upload_speed: import_zod15.z.number().optional()
  }).transform((data) => ({
    active: data["active"],
    authId: data["auth_id"],
    availability: data["availability"],
    createdAt: data["created_at"],
    downloadFinished: data["download_finished"],
    downloadPresent: data["download_present"],
    downloadSpeed: data["download_speed"],
    downloadState: data["download_state"],
    eta: data["eta"],
    expiresAt: data["expires_at"],
    files: data["files"],
    hash: data["hash"],
    id: data["id"],
    inactiveCheck: data["inactive_check"],
    magnet: data["magnet"],
    name: data["name"],
    peers: data["peers"],
    progress: data["progress"],
    ratio: data["ratio"],
    seeds: data["seeds"],
    server: data["server"],
    size: data["size"],
    torrentFile: data["torrent_file"],
    updatedAt: data["updated_at"],
    uploadSpeed: data["upload_speed"]
  }));
});
var getTorrentListOkResponseDataRequest = import_zod15.z.lazy(() => {
  return import_zod15.z.object({
    active: import_zod15.z.boolean().optional(),
    authId: import_zod15.z.string().optional(),
    availability: import_zod15.z.number().optional(),
    createdAt: import_zod15.z.string().optional(),
    downloadFinished: import_zod15.z.boolean().optional(),
    downloadPresent: import_zod15.z.boolean().optional(),
    downloadSpeed: import_zod15.z.number().optional(),
    downloadState: import_zod15.z.string().optional(),
    eta: import_zod15.z.number().optional(),
    expiresAt: import_zod15.z.string().optional(),
    files: import_zod15.z.array(dataFiles1Request).optional(),
    hash: import_zod15.z.string().optional(),
    id: import_zod15.z.number().optional(),
    inactiveCheck: import_zod15.z.number().optional(),
    magnet: import_zod15.z.string().optional(),
    name: import_zod15.z.string().optional(),
    peers: import_zod15.z.number().optional(),
    progress: import_zod15.z.number().optional(),
    ratio: import_zod15.z.number().optional(),
    seeds: import_zod15.z.number().optional(),
    server: import_zod15.z.number().optional(),
    size: import_zod15.z.number().optional(),
    torrentFile: import_zod15.z.boolean().optional(),
    updatedAt: import_zod15.z.string().optional(),
    uploadSpeed: import_zod15.z.number().optional()
  }).transform((data) => ({
    active: data["active"],
    auth_id: data["authId"],
    availability: data["availability"],
    created_at: data["createdAt"],
    download_finished: data["downloadFinished"],
    download_present: data["downloadPresent"],
    download_speed: data["downloadSpeed"],
    download_state: data["downloadState"],
    eta: data["eta"],
    expires_at: data["expiresAt"],
    files: data["files"],
    hash: data["hash"],
    id: data["id"],
    inactive_check: data["inactiveCheck"],
    magnet: data["magnet"],
    name: data["name"],
    peers: data["peers"],
    progress: data["progress"],
    ratio: data["ratio"],
    seeds: data["seeds"],
    server: data["server"],
    size: data["size"],
    torrent_file: data["torrentFile"],
    updated_at: data["updatedAt"],
    upload_speed: data["uploadSpeed"]
  }));
});

// src/services/torrents/models/get-torrent-list-ok-response.ts
var getTorrentListOkResponse = import_zod16.z.lazy(() => {
  return import_zod16.z.object({
    data: import_zod16.z.array(getTorrentListOkResponseData).optional(),
    detail: import_zod16.z.string().optional(),
    error: import_zod16.z.any().optional().nullable(),
    success: import_zod16.z.boolean().optional()
  });
});
var getTorrentListOkResponseResponse = import_zod16.z.lazy(() => {
  return import_zod16.z.object({
    data: import_zod16.z.array(getTorrentListOkResponseDataResponse).optional(),
    detail: import_zod16.z.string().optional(),
    error: import_zod16.z.any().optional().nullable(),
    success: import_zod16.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getTorrentListOkResponseRequest = import_zod16.z.lazy(() => {
  return import_zod16.z.object({
    data: import_zod16.z.array(getTorrentListOkResponseDataRequest).optional(),
    detail: import_zod16.z.string().optional(),
    error: import_zod16.z.any().optional().nullable(),
    success: import_zod16.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/torrents/models/get-torrent-cached-availability-ok-response.ts
var import_zod17 = require("zod");
var getTorrentCachedAvailabilityOkResponse = import_zod17.z.lazy(() => {
  return import_zod17.z.object({
    data: import_zod17.z.any().optional(),
    detail: import_zod17.z.string().optional(),
    error: import_zod17.z.string().optional().nullable(),
    success: import_zod17.z.boolean().optional()
  });
});
var getTorrentCachedAvailabilityOkResponseResponse = import_zod17.z.lazy(() => {
  return import_zod17.z.object({
    data: import_zod17.z.any().optional(),
    detail: import_zod17.z.string().optional(),
    error: import_zod17.z.string().optional().nullable(),
    success: import_zod17.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getTorrentCachedAvailabilityOkResponseRequest = import_zod17.z.lazy(() => {
  return import_zod17.z.object({
    data: import_zod17.z.any().optional(),
    detail: import_zod17.z.string().optional(),
    error: import_zod17.z.string().optional().nullable(),
    success: import_zod17.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/torrents/models/export-torrent-data-ok-response.ts
var import_zod18 = require("zod");
var exportTorrentDataOkResponse = import_zod18.z.lazy(() => {
  return import_zod18.z.object({
    data: import_zod18.z.string().optional(),
    detail: import_zod18.z.string().optional(),
    error: import_zod18.z.any().optional().nullable(),
    success: import_zod18.z.boolean().optional()
  });
});
var exportTorrentDataOkResponseResponse = import_zod18.z.lazy(() => {
  return import_zod18.z.object({
    data: import_zod18.z.string().optional(),
    detail: import_zod18.z.string().optional(),
    error: import_zod18.z.any().optional().nullable(),
    success: import_zod18.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var exportTorrentDataOkResponseRequest = import_zod18.z.lazy(() => {
  return import_zod18.z.object({
    data: import_zod18.z.string().optional(),
    detail: import_zod18.z.string().optional(),
    error: import_zod18.z.any().optional().nullable(),
    success: import_zod18.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/torrents/models/_5.ts
var import_zod19 = require("zod");
var _5Response = import_zod19.z.lazy(() => {
  return import_zod19.z.object({
    data: import_zod19.z.any().optional().nullable(),
    detail: import_zod19.z.string().optional(),
    error: import_zod19.z.string().optional(),
    success: import_zod19.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var _5 = class extends Error {
  constructor(message, response) {
    super(message);
    const parsedResponse = _5Response.parse(response);
    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
};

// src/services/torrents/models/_6.ts
var import_zod20 = require("zod");
var _6Response = import_zod20.z.lazy(() => {
  return import_zod20.z.object({
    data: import_zod20.z.any().optional().nullable(),
    detail: import_zod20.z.string().optional(),
    error: import_zod20.z.string().optional(),
    success: import_zod20.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var _6 = class extends Error {
  constructor(message, response) {
    super(message);
    const parsedResponse = _6Response.parse(response);
    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
};

// src/services/torrents/models/get-torrent-info-ok-response.ts
var import_zod23 = require("zod");

// src/services/torrents/models/get-torrent-info-ok-response-data.ts
var import_zod22 = require("zod");

// src/services/torrents/models/data-files-2.ts
var import_zod21 = require("zod");
var dataFiles2 = import_zod21.z.lazy(() => {
  return import_zod21.z.object({
    name: import_zod21.z.string().optional(),
    size: import_zod21.z.number().optional()
  });
});
var dataFiles2Response = import_zod21.z.lazy(() => {
  return import_zod21.z.object({
    name: import_zod21.z.string().optional(),
    size: import_zod21.z.number().optional()
  }).transform((data) => ({
    name: data["name"],
    size: data["size"]
  }));
});
var dataFiles2Request = import_zod21.z.lazy(() => {
  return import_zod21.z.object({
    name: import_zod21.z.string().optional(),
    size: import_zod21.z.number().optional()
  }).transform((data) => ({
    name: data["name"],
    size: data["size"]
  }));
});

// src/services/torrents/models/get-torrent-info-ok-response-data.ts
var getTorrentInfoOkResponseData = import_zod22.z.lazy(() => {
  return import_zod22.z.object({
    files: import_zod22.z.array(dataFiles2).optional(),
    hash: import_zod22.z.string().optional(),
    name: import_zod22.z.string().optional(),
    peers: import_zod22.z.number().optional(),
    seeds: import_zod22.z.number().optional(),
    size: import_zod22.z.number().optional(),
    trackers: import_zod22.z.array(import_zod22.z.any()).optional()
  });
});
var getTorrentInfoOkResponseDataResponse = import_zod22.z.lazy(() => {
  return import_zod22.z.object({
    files: import_zod22.z.array(dataFiles2Response).optional(),
    hash: import_zod22.z.string().optional(),
    name: import_zod22.z.string().optional(),
    peers: import_zod22.z.number().optional(),
    seeds: import_zod22.z.number().optional(),
    size: import_zod22.z.number().optional(),
    trackers: import_zod22.z.array(import_zod22.z.any()).optional()
  }).transform((data) => ({
    files: data["files"],
    hash: data["hash"],
    name: data["name"],
    peers: data["peers"],
    seeds: data["seeds"],
    size: data["size"],
    trackers: data["trackers"]
  }));
});
var getTorrentInfoOkResponseDataRequest = import_zod22.z.lazy(() => {
  return import_zod22.z.object({
    files: import_zod22.z.array(dataFiles2Request).optional(),
    hash: import_zod22.z.string().optional(),
    name: import_zod22.z.string().optional(),
    peers: import_zod22.z.number().optional(),
    seeds: import_zod22.z.number().optional(),
    size: import_zod22.z.number().optional(),
    trackers: import_zod22.z.array(import_zod22.z.any()).optional()
  }).transform((data) => ({
    files: data["files"],
    hash: data["hash"],
    name: data["name"],
    peers: data["peers"],
    seeds: data["seeds"],
    size: data["size"],
    trackers: data["trackers"]
  }));
});

// src/services/torrents/models/get-torrent-info-ok-response.ts
var getTorrentInfoOkResponse = import_zod23.z.lazy(() => {
  return import_zod23.z.object({
    data: getTorrentInfoOkResponseData.optional(),
    detail: import_zod23.z.string().optional(),
    error: import_zod23.z.any().optional().nullable(),
    success: import_zod23.z.boolean().optional()
  });
});
var getTorrentInfoOkResponseResponse = import_zod23.z.lazy(() => {
  return import_zod23.z.object({
    data: getTorrentInfoOkResponseDataResponse.optional(),
    detail: import_zod23.z.string().optional(),
    error: import_zod23.z.any().optional().nullable(),
    success: import_zod23.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getTorrentInfoOkResponseRequest = import_zod23.z.lazy(() => {
  return import_zod23.z.object({
    data: getTorrentInfoOkResponseDataRequest.optional(),
    detail: import_zod23.z.string().optional(),
    error: import_zod23.z.any().optional().nullable(),
    success: import_zod23.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/torrents/models/_7.ts
var import_zod24 = require("zod");
var _7Response = import_zod24.z.lazy(() => {
  return import_zod24.z.object({
    data: import_zod24.z.string().optional(),
    detail: import_zod24.z.string().optional(),
    error: import_zod24.z.string().optional(),
    success: import_zod24.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var _7 = class extends Error {
  constructor(message, response) {
    super(message);
    const parsedResponse = _7Response.parse(response);
    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
};

// src/services/torrents/models/get-torrent-info1-request.ts
var import_zod25 = require("zod");
var getTorrentInfo1Request = import_zod25.z.lazy(() => {
  return import_zod25.z.object({
    hash: import_zod25.z.string().optional()
  });
});
var getTorrentInfo1RequestResponse = import_zod25.z.lazy(() => {
  return import_zod25.z.object({
    hash: import_zod25.z.string().optional()
  }).transform((data) => ({
    hash: data["hash"]
  }));
});
var getTorrentInfo1RequestRequest = import_zod25.z.lazy(() => {
  return import_zod25.z.object({
    hash: import_zod25.z.string().optional()
  }).transform((data) => ({
    hash: data["hash"]
  }));
});

// src/services/torrents/models/get-torrent-info1-ok-response.ts
var import_zod28 = require("zod");

// src/services/torrents/models/get-torrent-info1-ok-response-data.ts
var import_zod27 = require("zod");

// src/services/torrents/models/data-files-3.ts
var import_zod26 = require("zod");
var dataFiles3 = import_zod26.z.lazy(() => {
  return import_zod26.z.object({
    name: import_zod26.z.string().optional(),
    size: import_zod26.z.number().optional()
  });
});
var dataFiles3Response = import_zod26.z.lazy(() => {
  return import_zod26.z.object({
    name: import_zod26.z.string().optional(),
    size: import_zod26.z.number().optional()
  }).transform((data) => ({
    name: data["name"],
    size: data["size"]
  }));
});
var dataFiles3Request = import_zod26.z.lazy(() => {
  return import_zod26.z.object({
    name: import_zod26.z.string().optional(),
    size: import_zod26.z.number().optional()
  }).transform((data) => ({
    name: data["name"],
    size: data["size"]
  }));
});

// src/services/torrents/models/get-torrent-info1-ok-response-data.ts
var getTorrentInfo1OkResponseData = import_zod27.z.lazy(() => {
  return import_zod27.z.object({
    files: import_zod27.z.array(dataFiles3).optional(),
    hash: import_zod27.z.string().optional(),
    name: import_zod27.z.string().optional(),
    peers: import_zod27.z.number().optional(),
    seeds: import_zod27.z.number().optional(),
    size: import_zod27.z.number().optional(),
    trackers: import_zod27.z.array(import_zod27.z.any()).optional()
  });
});
var getTorrentInfo1OkResponseDataResponse = import_zod27.z.lazy(() => {
  return import_zod27.z.object({
    files: import_zod27.z.array(dataFiles3Response).optional(),
    hash: import_zod27.z.string().optional(),
    name: import_zod27.z.string().optional(),
    peers: import_zod27.z.number().optional(),
    seeds: import_zod27.z.number().optional(),
    size: import_zod27.z.number().optional(),
    trackers: import_zod27.z.array(import_zod27.z.any()).optional()
  }).transform((data) => ({
    files: data["files"],
    hash: data["hash"],
    name: data["name"],
    peers: data["peers"],
    seeds: data["seeds"],
    size: data["size"],
    trackers: data["trackers"]
  }));
});
var getTorrentInfo1OkResponseDataRequest = import_zod27.z.lazy(() => {
  return import_zod27.z.object({
    files: import_zod27.z.array(dataFiles3Request).optional(),
    hash: import_zod27.z.string().optional(),
    name: import_zod27.z.string().optional(),
    peers: import_zod27.z.number().optional(),
    seeds: import_zod27.z.number().optional(),
    size: import_zod27.z.number().optional(),
    trackers: import_zod27.z.array(import_zod27.z.any()).optional()
  }).transform((data) => ({
    files: data["files"],
    hash: data["hash"],
    name: data["name"],
    peers: data["peers"],
    seeds: data["seeds"],
    size: data["size"],
    trackers: data["trackers"]
  }));
});

// src/services/torrents/models/get-torrent-info1-ok-response.ts
var getTorrentInfo1OkResponse = import_zod28.z.lazy(() => {
  return import_zod28.z.object({
    data: getTorrentInfo1OkResponseData.optional(),
    detail: import_zod28.z.string().optional(),
    error: import_zod28.z.any().optional().nullable(),
    success: import_zod28.z.boolean().optional()
  });
});
var getTorrentInfo1OkResponseResponse = import_zod28.z.lazy(() => {
  return import_zod28.z.object({
    data: getTorrentInfo1OkResponseDataResponse.optional(),
    detail: import_zod28.z.string().optional(),
    error: import_zod28.z.any().optional().nullable(),
    success: import_zod28.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getTorrentInfo1OkResponseRequest = import_zod28.z.lazy(() => {
  return import_zod28.z.object({
    data: getTorrentInfo1OkResponseDataRequest.optional(),
    detail: import_zod28.z.string().optional(),
    error: import_zod28.z.any().optional().nullable(),
    success: import_zod28.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/torrents/torrents-service.ts
var TorrentsService = class extends BaseService {
  /**
   * ### Overview
  Creates a torrent under your account. Simply send **either** a magnet link, or a torrent file. Once they have been checked, they will begin downloading assuming your account has available active download slots, and they aren't too large.  
    
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion - 
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<CreateTorrentOkResponse>>} Create Torrent Success / Create Torrent Queued / Create Torrent Active Limit Fail
   */
  async createTorrent(apiVersion, body, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/torrents/createtorrent").setRequestSchema(createTorrentRequestRequest).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("multipartFormData" /* MultipartFormData */).addResponse({
      schema: createTorrentOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).addError({
      error: __,
      contentType: "json" /* Json */,
      status: 400
    }).addError({
      error: _2,
      contentType: "json" /* Json */,
      status: 500
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addHeaderParam({ key: "Content-Type", value: "multipart/form-data" }).addBody(body).build();
    return this.client.call(request);
  }
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
  async controlTorrent(apiVersion, body, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/torrents/controltorrent").setRequestSchema(import_zod29.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: controlTorrentOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).addError({
      error: _3,
      contentType: "json" /* Json */,
      status: 400
    }).addError({
      error: _4,
      contentType: "json" /* Json */,
      status: 500
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addHeaderParam({ key: "Content-Type", value: "application/json" }).addBody(body).build();
    return this.client.call(request);
  }
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
  async requestDownloadLink(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/torrents/requestdl").setRequestSchema(import_zod29.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: requestDownloadLinkOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "token",
      value: params == null ? void 0 : params.token
    }).addQueryParam({
      key: "torrent_id",
      value: params == null ? void 0 : params.torrentId
    }).addQueryParam({
      key: "file_id",
      value: params == null ? void 0 : params.fileId
    }).addQueryParam({
      key: "zip_link",
      value: params == null ? void 0 : params.zipLink
    }).addQueryParam({
      key: "user_ip",
      value: params == null ? void 0 : params.userIp
    }).addQueryParam({
      key: "redirect",
      value: params == null ? void 0 : params.redirect
    }).build();
    return this.client.call(request);
  }
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
  async getTorrentList(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/torrents/mylist").setRequestSchema(import_zod29.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: getTorrentListOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "bypass_cache",
      value: params == null ? void 0 : params.bypassCache
    }).addQueryParam({
      key: "id",
      value: params == null ? void 0 : params.id
    }).addQueryParam({
      key: "offset",
      value: params == null ? void 0 : params.offset
    }).addQueryParam({
      key: "limit",
      value: params == null ? void 0 : params.limit
    }).build();
    return this.client.call(request);
  }
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
  async getTorrentCachedAvailability(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/torrents/checkcached").setRequestSchema(import_zod29.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: getTorrentCachedAvailabilityOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "hash",
      value: params == null ? void 0 : params.hash
    }).addQueryParam({
      key: "format",
      value: params == null ? void 0 : params.format
    }).addQueryParam({
      key: "list_files",
      value: params == null ? void 0 : params.listFiles
    }).build();
    return this.client.call(request);
  }
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
  async exportTorrentData(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/torrents/exportdata").setRequestSchema(import_zod29.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: exportTorrentDataOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).addError({
      error: _5,
      contentType: "json" /* Json */,
      status: 400
    }).addError({
      error: _6,
      contentType: "json" /* Json */,
      status: 500
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "torrent_id",
      value: params == null ? void 0 : params.torrentId
    }).addQueryParam({
      key: "type",
      value: params == null ? void 0 : params.type
    }).build();
    return this.client.call(request);
  }
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
  async getTorrentInfo(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/torrents/torrentinfo").setRequestSchema(import_zod29.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: getTorrentInfoOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).addError({
      error: _7,
      contentType: "json" /* Json */,
      status: 500
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "hash",
      value: params == null ? void 0 : params.hash
    }).addQueryParam({
      key: "timeout",
      value: params == null ? void 0 : params.timeout
    }).build();
    return this.client.call(request);
  }
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
  async getTorrentInfo1(apiVersion, body, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/torrents/torrentinfo").setRequestSchema(getTorrentInfo1RequestRequest).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("multipartFormData" /* MultipartFormData */).addResponse({
      schema: getTorrentInfo1OkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addHeaderParam({ key: "Content-Type", value: "multipart/form-data" }).addBody(body).build();
    return this.client.call(request);
  }
};

// src/services/usenet/usenet-service.ts
var import_zod40 = require("zod");

// src/services/usenet/models/create-usenet-download-request.ts
var import_zod30 = require("zod");
var createUsenetDownloadRequest = import_zod30.z.lazy(() => {
  return import_zod30.z.object({
    file: import_zod30.z.instanceof(ArrayBuffer).optional(),
    link: import_zod30.z.string().optional(),
    name: import_zod30.z.string().optional()
  });
});
var createUsenetDownloadRequestRequest = import_zod30.z.lazy(() => {
  return import_zod30.z.object({
    file: import_zod30.z.instanceof(ArrayBuffer).optional(),
    link: import_zod30.z.string().optional(),
    name: import_zod30.z.string().optional()
  }).transform((data) => ({
    file: data["file"],
    link: data["link"],
    name: data["name"]
  }));
});

// src/services/usenet/models/create-usenet-download-ok-response.ts
var import_zod32 = require("zod");

// src/services/usenet/models/create-usenet-download-ok-response-data.ts
var import_zod31 = require("zod");
var createUsenetDownloadOkResponseData = import_zod31.z.lazy(() => {
  return import_zod31.z.object({
    authId: import_zod31.z.string().optional(),
    hash: import_zod31.z.string().optional(),
    usenetdownloadId: import_zod31.z.number().optional()
  });
});
var createUsenetDownloadOkResponseDataResponse = import_zod31.z.lazy(() => {
  return import_zod31.z.object({
    auth_id: import_zod31.z.string().optional(),
    hash: import_zod31.z.string().optional(),
    usenetdownload_id: import_zod31.z.number().optional()
  }).transform((data) => ({
    authId: data["auth_id"],
    hash: data["hash"],
    usenetdownloadId: data["usenetdownload_id"]
  }));
});
var createUsenetDownloadOkResponseDataRequest = import_zod31.z.lazy(() => {
  return import_zod31.z.object({
    authId: import_zod31.z.string().optional(),
    hash: import_zod31.z.string().optional(),
    usenetdownloadId: import_zod31.z.number().optional()
  }).transform((data) => ({
    auth_id: data["authId"],
    hash: data["hash"],
    usenetdownload_id: data["usenetdownloadId"]
  }));
});

// src/services/usenet/models/create-usenet-download-ok-response.ts
var createUsenetDownloadOkResponse = import_zod32.z.lazy(() => {
  return import_zod32.z.object({
    data: createUsenetDownloadOkResponseData.optional(),
    detail: import_zod32.z.string().optional(),
    error: import_zod32.z.any().optional().nullable(),
    success: import_zod32.z.boolean().optional()
  });
});
var createUsenetDownloadOkResponseResponse = import_zod32.z.lazy(() => {
  return import_zod32.z.object({
    data: createUsenetDownloadOkResponseDataResponse.optional(),
    detail: import_zod32.z.string().optional(),
    error: import_zod32.z.any().optional().nullable(),
    success: import_zod32.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var createUsenetDownloadOkResponseRequest = import_zod32.z.lazy(() => {
  return import_zod32.z.object({
    data: createUsenetDownloadOkResponseDataRequest.optional(),
    detail: import_zod32.z.string().optional(),
    error: import_zod32.z.any().optional().nullable(),
    success: import_zod32.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/usenet/models/_8.ts
var import_zod33 = require("zod");
var _8Response = import_zod33.z.lazy(() => {
  return import_zod33.z.object({
    data: import_zod33.z.any().optional().nullable(),
    detail: import_zod33.z.string().optional(),
    error: import_zod33.z.string().optional(),
    success: import_zod33.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var _8 = class extends Error {
  constructor(message, response) {
    super(message);
    const parsedResponse = _8Response.parse(response);
    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
};

// src/services/usenet/models/get-usenet-list-ok-response.ts
var import_zod36 = require("zod");

// src/services/usenet/models/get-usenet-list-ok-response-data.ts
var import_zod35 = require("zod");

// src/services/usenet/models/data-files-4.ts
var import_zod34 = require("zod");
var dataFiles4 = import_zod34.z.lazy(() => {
  return import_zod34.z.object({
    id: import_zod34.z.number().optional(),
    md5: import_zod34.z.string().optional().nullable(),
    mimetype: import_zod34.z.string().optional(),
    name: import_zod34.z.string().optional(),
    s3Path: import_zod34.z.string().optional(),
    shortName: import_zod34.z.string().optional(),
    size: import_zod34.z.number().optional()
  });
});
var dataFiles4Response = import_zod34.z.lazy(() => {
  return import_zod34.z.object({
    id: import_zod34.z.number().optional(),
    md5: import_zod34.z.string().optional().nullable(),
    mimetype: import_zod34.z.string().optional(),
    name: import_zod34.z.string().optional(),
    s3_path: import_zod34.z.string().optional(),
    short_name: import_zod34.z.string().optional(),
    size: import_zod34.z.number().optional()
  }).transform((data) => ({
    id: data["id"],
    md5: data["md5"],
    mimetype: data["mimetype"],
    name: data["name"],
    s3Path: data["s3_path"],
    shortName: data["short_name"],
    size: data["size"]
  }));
});
var dataFiles4Request = import_zod34.z.lazy(() => {
  return import_zod34.z.object({
    id: import_zod34.z.number().optional(),
    md5: import_zod34.z.string().optional().nullable(),
    mimetype: import_zod34.z.string().optional(),
    name: import_zod34.z.string().optional(),
    s3Path: import_zod34.z.string().optional(),
    shortName: import_zod34.z.string().optional(),
    size: import_zod34.z.number().optional()
  }).transform((data) => ({
    id: data["id"],
    md5: data["md5"],
    mimetype: data["mimetype"],
    name: data["name"],
    s3_path: data["s3Path"],
    short_name: data["shortName"],
    size: data["size"]
  }));
});

// src/services/usenet/models/get-usenet-list-ok-response-data.ts
var getUsenetListOkResponseData = import_zod35.z.lazy(() => {
  return import_zod35.z.object({
    active: import_zod35.z.boolean().optional().nullable(),
    authId: import_zod35.z.string().optional().nullable(),
    availability: import_zod35.z.number().optional().nullable(),
    createdAt: import_zod35.z.string().optional().nullable(),
    downloadFinished: import_zod35.z.boolean().optional().nullable(),
    downloadPresent: import_zod35.z.boolean().optional().nullable(),
    downloadSpeed: import_zod35.z.number().optional().nullable(),
    downloadState: import_zod35.z.string().optional().nullable(),
    eta: import_zod35.z.number().optional().nullable(),
    expiresAt: import_zod35.z.string().optional().nullable(),
    files: import_zod35.z.array(dataFiles4).optional().nullable(),
    hash: import_zod35.z.string().optional().nullable(),
    id: import_zod35.z.number().optional().nullable(),
    inactiveCheck: import_zod35.z.number().optional().nullable(),
    name: import_zod35.z.string().optional().nullable(),
    progress: import_zod35.z.number().optional().nullable(),
    server: import_zod35.z.number().optional().nullable(),
    size: import_zod35.z.number().optional().nullable(),
    torrentFile: import_zod35.z.boolean().optional().nullable(),
    updatedAt: import_zod35.z.string().optional().nullable(),
    uploadSpeed: import_zod35.z.number().optional().nullable()
  });
});
var getUsenetListOkResponseDataResponse = import_zod35.z.lazy(() => {
  return import_zod35.z.object({
    active: import_zod35.z.boolean().optional().nullable(),
    auth_id: import_zod35.z.string().optional().nullable(),
    availability: import_zod35.z.number().optional().nullable(),
    created_at: import_zod35.z.string().optional().nullable(),
    download_finished: import_zod35.z.boolean().optional().nullable(),
    download_present: import_zod35.z.boolean().optional().nullable(),
    download_speed: import_zod35.z.number().optional().nullable(),
    download_state: import_zod35.z.string().optional().nullable(),
    eta: import_zod35.z.number().optional().nullable(),
    expires_at: import_zod35.z.string().optional().nullable(),
    files: import_zod35.z.array(dataFiles4Response).optional().nullable(),
    hash: import_zod35.z.string().optional().nullable(),
    id: import_zod35.z.number().optional().nullable(),
    inactive_check: import_zod35.z.number().optional().nullable(),
    name: import_zod35.z.string().optional().nullable(),
    progress: import_zod35.z.number().optional().nullable(),
    server: import_zod35.z.number().optional().nullable(),
    size: import_zod35.z.number().optional().nullable(),
    torrent_file: import_zod35.z.boolean().optional().nullable(),
    updated_at: import_zod35.z.string().optional().nullable(),
    upload_speed: import_zod35.z.number().optional().nullable()
  }).transform((data) => ({
    active: data["active"],
    authId: data["auth_id"],
    availability: data["availability"],
    createdAt: data["created_at"],
    downloadFinished: data["download_finished"],
    downloadPresent: data["download_present"],
    downloadSpeed: data["download_speed"],
    downloadState: data["download_state"],
    eta: data["eta"],
    expiresAt: data["expires_at"],
    files: data["files"],
    hash: data["hash"],
    id: data["id"],
    inactiveCheck: data["inactive_check"],
    name: data["name"],
    progress: data["progress"],
    server: data["server"],
    size: data["size"],
    torrentFile: data["torrent_file"],
    updatedAt: data["updated_at"],
    uploadSpeed: data["upload_speed"]
  }));
});
var getUsenetListOkResponseDataRequest = import_zod35.z.lazy(() => {
  return import_zod35.z.object({
    active: import_zod35.z.boolean().optional().nullable(),
    authId: import_zod35.z.string().optional().nullable(),
    availability: import_zod35.z.number().optional().nullable(),
    createdAt: import_zod35.z.string().optional().nullable(),
    downloadFinished: import_zod35.z.boolean().optional().nullable(),
    downloadPresent: import_zod35.z.boolean().optional().nullable(),
    downloadSpeed: import_zod35.z.number().optional().nullable(),
    downloadState: import_zod35.z.string().optional().nullable(),
    eta: import_zod35.z.number().optional().nullable(),
    expiresAt: import_zod35.z.string().optional().nullable(),
    files: import_zod35.z.array(dataFiles4Request).optional().nullable(),
    hash: import_zod35.z.string().optional().nullable(),
    id: import_zod35.z.number().optional().nullable(),
    inactiveCheck: import_zod35.z.number().optional().nullable(),
    name: import_zod35.z.string().optional().nullable(),
    progress: import_zod35.z.number().optional().nullable(),
    server: import_zod35.z.number().optional().nullable(),
    size: import_zod35.z.number().optional().nullable(),
    torrentFile: import_zod35.z.boolean().optional().nullable(),
    updatedAt: import_zod35.z.string().optional().nullable(),
    uploadSpeed: import_zod35.z.number().optional().nullable()
  }).transform((data) => ({
    active: data["active"],
    auth_id: data["authId"],
    availability: data["availability"],
    created_at: data["createdAt"],
    download_finished: data["downloadFinished"],
    download_present: data["downloadPresent"],
    download_speed: data["downloadSpeed"],
    download_state: data["downloadState"],
    eta: data["eta"],
    expires_at: data["expiresAt"],
    files: data["files"],
    hash: data["hash"],
    id: data["id"],
    inactive_check: data["inactiveCheck"],
    name: data["name"],
    progress: data["progress"],
    server: data["server"],
    size: data["size"],
    torrent_file: data["torrentFile"],
    updated_at: data["updatedAt"],
    upload_speed: data["uploadSpeed"]
  }));
});

// src/services/usenet/models/get-usenet-list-ok-response.ts
var getUsenetListOkResponse = import_zod36.z.lazy(() => {
  return import_zod36.z.object({
    data: import_zod36.z.union([
      import_zod36.z.array(getUsenetListOkResponseData),
      getUsenetListOkResponseData
    ]).optional(),
    detail: import_zod36.z.string().optional(),
    error: import_zod36.z.any().optional().nullable(),
    success: import_zod36.z.boolean().optional()
  });
});
var getUsenetListOkResponseResponse = import_zod36.z.lazy(() => {
  return import_zod36.z.object({
    data: import_zod36.z.union([
      import_zod36.z.array(getUsenetListOkResponseDataResponse),
      getUsenetListOkResponseDataResponse
    ]).optional(),
    detail: import_zod36.z.string().optional(),
    error: import_zod36.z.any().optional().nullable(),
    success: import_zod36.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getUsenetListOkResponseRequest = import_zod36.z.lazy(() => {
  return import_zod36.z.object({
    data: import_zod36.z.union([
      import_zod36.z.array(getUsenetListOkResponseDataRequest),
      getUsenetListOkResponseDataRequest
    ]).optional(),
    detail: import_zod36.z.string().optional(),
    error: import_zod36.z.any().optional().nullable(),
    success: import_zod36.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/usenet/models/request-download-link-response.ts
var import_zod37 = require("zod");
var requestDownloadLinkOkResponse2 = import_zod37.z.lazy(() => {
  return import_zod37.z.object({
    data: import_zod37.z.string().optional(),
    detail: import_zod37.z.string().optional(),
    error: import_zod37.z.any().optional().nullable(),
    success: import_zod37.z.boolean().optional()
  });
});
var requestDownloadLinkOkResponseResponse2 = import_zod37.z.lazy(() => {
  return import_zod37.z.object({
    data: import_zod37.z.string().optional(),
    detail: import_zod37.z.string().optional(),
    error: import_zod37.z.any().optional().nullable(),
    success: import_zod37.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var requestDownloadLinkOkResponseRequest2 = import_zod37.z.lazy(() => {
  return import_zod37.z.object({
    data: import_zod37.z.string().optional(),
    detail: import_zod37.z.string().optional(),
    error: import_zod37.z.any().optional().nullable(),
    success: import_zod37.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/usenet/models/get-usenet-cached-availability-response.ts
var import_zod39 = require("zod");

// src/services/usenet/models/get-usenet-cached-availability-response-data.ts
var import_zod38 = require("zod");
var getUsenetCachedAvailabilityOkResponseData = import_zod38.z.lazy(() => {
  return import_zod38.z.object({
    name: import_zod38.z.string().optional(),
    size: import_zod38.z.number().optional(),
    hash: import_zod38.z.string().optional()
  });
});
var getUsenetCachedAvailabilityOkResponseDataResponse = import_zod38.z.lazy(() => {
  return import_zod38.z.object({
    name: import_zod38.z.string().optional(),
    size: import_zod38.z.number().optional(),
    hash: import_zod38.z.string().optional()
  }).transform((data) => ({
    name: data["name"],
    size: data["size"],
    hash: data["hash"]
  }));
});
var getUsenetCachedAvailabilityOkResponseDataRequest = import_zod38.z.lazy(() => {
  return import_zod38.z.object({
    name: import_zod38.z.string().optional(),
    size: import_zod38.z.number().optional(),
    hash: import_zod38.z.string().optional()
  }).transform((data) => ({
    name: data["name"],
    size: data["size"],
    hash: data["hash"]
  }));
});

// src/services/usenet/models/get-usenet-cached-availability-response.ts
var getUsenetCachedAvailabilityOkResponse = import_zod39.z.lazy(() => {
  return import_zod39.z.object({
    data: import_zod39.z.union([import_zod39.z.array(getUsenetCachedAvailabilityOkResponseData), import_zod39.z.record(import_zod39.z.string(), getUsenetCachedAvailabilityOkResponseData)]).optional(),
    detail: import_zod39.z.string().optional(),
    error: import_zod39.z.string().optional().nullable(),
    success: import_zod39.z.boolean().optional()
  });
});
var getUsenetCachedAvailabilityOkResponseResponse = import_zod39.z.lazy(() => {
  return import_zod39.z.object({
    data: import_zod39.z.union([import_zod39.z.array(getUsenetCachedAvailabilityOkResponseDataResponse), import_zod39.z.record(import_zod39.z.string(), getUsenetCachedAvailabilityOkResponseDataResponse)]).optional(),
    detail: import_zod39.z.string().optional(),
    error: import_zod39.z.string().optional().nullable(),
    success: import_zod39.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getUsenetCachedAvailabilityOkResponseRequest = import_zod39.z.lazy(() => {
  return import_zod39.z.object({
    data: import_zod39.z.union([import_zod39.z.array(getUsenetCachedAvailabilityOkResponseDataResponse), import_zod39.z.record(import_zod39.z.string(), getUsenetCachedAvailabilityOkResponseDataResponse)]).optional(),
    detail: import_zod39.z.string().optional(),
    error: import_zod39.z.string().optional().nullable(),
    success: import_zod39.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/usenet/usenet-service.ts
var UsenetService = class extends BaseService {
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
  async createUsenetDownload(apiVersion, body, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/usenet/createusenetdownload").setRequestSchema(createUsenetDownloadRequestRequest).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("multipartFormData" /* MultipartFormData */).addResponse({
      schema: createUsenetDownloadOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addBody(body).build();
    return this.client.call(request);
  }
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
  async controlUsenetDownload(apiVersion, body, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/usenet/controlusenetdownload").setRequestSchema(import_zod40.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod40.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).addError({
      error: _8,
      contentType: "json" /* Json */,
      status: 400
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addHeaderParam({ key: "Content-Type", value: "application/json" }).addBody(body).build();
    return this.client.call(request);
  }
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
  async requestDownloadLink(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/usenet/requestdl").setRequestSchema(import_zod40.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod40.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 307
    }).addResponse({
      schema: requestDownloadLinkOkResponseResponse2,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "token",
      value: params == null ? void 0 : params.token
    }).addQueryParam({
      key: "usenet_id",
      value: params == null ? void 0 : params.usenetId
    }).addQueryParam({
      key: "file_id",
      value: params == null ? void 0 : params.fileId
    }).addQueryParam({
      key: "zip_link",
      value: params == null ? void 0 : params.zipLink
    }).addQueryParam({
      key: "user_ip",
      value: params == null ? void 0 : params.userIp
    }).addQueryParam({
      key: "redirect",
      value: params == null ? void 0 : params.redirect
    }).build();
    return this.client.call(request);
  }
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
  async getUsenetList(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/usenet/mylist").setRequestSchema(import_zod40.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: getUsenetListOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "bypass_cache",
      value: params == null ? void 0 : params.bypassCache
    }).addQueryParam({
      key: "id",
      value: params == null ? void 0 : params.id
    }).addQueryParam({
      key: "offset",
      value: params == null ? void 0 : params.offset
    }).addQueryParam({
      key: "limit",
      value: params == null ? void 0 : params.limit
    }).build();
    return this.client.call(request);
  }
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
   * @param {string} [params.hash] - The list of usenet hashes you want to check. Comma seperated. To find the hash, md5 the link of the usenet link or file.
   * @param {string} [params.format] - Format you want the data in. Acceptable is either "object" or "list". List is the most performant option as it doesn't require modification of the list.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetUsenetCachedAvailabilityOkResponse>>} 
   */
  async getUsenetCachedAvailability(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/usenet/checkcached").setRequestSchema(import_zod40.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: getUsenetCachedAvailabilityOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "hash",
      value: params == null ? void 0 : params.hash
    }).addQueryParam({
      key: "format",
      value: params == null ? void 0 : params.format
    }).build();
    return this.client.call(request);
  }
};

// src/services/web-downloads-debrid/web-downloads-debrid-service.ts
var import_zod50 = require("zod");

// src/services/web-downloads-debrid/models/create-web-download-request.ts
var import_zod41 = require("zod");
var createWebDownloadRequest = import_zod41.z.lazy(() => {
  return import_zod41.z.object({
    link: import_zod41.z.string().optional()
  });
});
var createWebDownloadRequestResponse = import_zod41.z.lazy(() => {
  return import_zod41.z.object({
    link: import_zod41.z.string().optional()
  }).transform((data) => ({
    link: data["link"]
  }));
});
var createWebDownloadRequestRequest = import_zod41.z.lazy(() => {
  return import_zod41.z.object({
    link: import_zod41.z.string().optional()
  }).transform((data) => ({
    link: data["link"]
  }));
});

// src/services/web-downloads-debrid/models/create-web-download-ok-response.ts
var import_zod43 = require("zod");

// src/services/web-downloads-debrid/models/create-web-download-ok-response-data.ts
var import_zod42 = require("zod");
var createWebDownloadOkResponseData = import_zod42.z.lazy(() => {
  return import_zod42.z.object({
    authId: import_zod42.z.string().optional(),
    hash: import_zod42.z.string().optional(),
    webdownloadId: import_zod42.z.string().optional()
  });
});
var createWebDownloadOkResponseDataResponse = import_zod42.z.lazy(() => {
  return import_zod42.z.object({
    auth_id: import_zod42.z.string().optional(),
    hash: import_zod42.z.string().optional(),
    webdownload_id: import_zod42.z.string().optional()
  }).transform((data) => ({
    authId: data["auth_id"],
    hash: data["hash"],
    webdownloadId: data["webdownload_id"]
  }));
});
var createWebDownloadOkResponseDataRequest = import_zod42.z.lazy(() => {
  return import_zod42.z.object({
    authId: import_zod42.z.string().optional(),
    hash: import_zod42.z.string().optional(),
    webdownloadId: import_zod42.z.string().optional()
  }).transform((data) => ({
    auth_id: data["authId"],
    hash: data["hash"],
    webdownload_id: data["webdownloadId"]
  }));
});

// src/services/web-downloads-debrid/models/create-web-download-ok-response.ts
var createWebDownloadOkResponse = import_zod43.z.lazy(() => {
  return import_zod43.z.object({
    data: createWebDownloadOkResponseData.optional(),
    detail: import_zod43.z.string().optional(),
    error: import_zod43.z.any().optional().nullable(),
    success: import_zod43.z.boolean().optional()
  });
});
var createWebDownloadOkResponseResponse = import_zod43.z.lazy(() => {
  return import_zod43.z.object({
    data: createWebDownloadOkResponseDataResponse.optional(),
    detail: import_zod43.z.string().optional(),
    error: import_zod43.z.any().optional().nullable(),
    success: import_zod43.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var createWebDownloadOkResponseRequest = import_zod43.z.lazy(() => {
  return import_zod43.z.object({
    data: createWebDownloadOkResponseDataRequest.optional(),
    detail: import_zod43.z.string().optional(),
    error: import_zod43.z.any().optional().nullable(),
    success: import_zod43.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/web-downloads-debrid/models/_9.ts
var import_zod44 = require("zod");
var _9Response = import_zod44.z.lazy(() => {
  return import_zod44.z.object({
    data: import_zod44.z.any().optional().nullable(),
    detail: import_zod44.z.string().optional(),
    error: import_zod44.z.string().optional(),
    success: import_zod44.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var _9 = class extends Error {
  constructor(message, response) {
    super(message);
    const parsedResponse = _9Response.parse(response);
    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
};

// src/services/web-downloads-debrid/models/get-web-download-list-ok-response.ts
var import_zod47 = require("zod");

// src/services/web-downloads-debrid/models/get-web-download-list-ok-response-data.ts
var import_zod46 = require("zod");

// src/services/web-downloads-debrid/models/data-files-5.ts
var import_zod45 = require("zod");
var dataFiles5 = import_zod45.z.lazy(() => {
  return import_zod45.z.object({
    id: import_zod45.z.number().optional(),
    md5: import_zod45.z.string().optional(),
    mimetype: import_zod45.z.string().optional(),
    name: import_zod45.z.string().optional(),
    s3Path: import_zod45.z.string().optional(),
    shortName: import_zod45.z.string().optional(),
    size: import_zod45.z.number().optional()
  });
});
var dataFiles5Response = import_zod45.z.lazy(() => {
  return import_zod45.z.object({
    id: import_zod45.z.number().optional(),
    md5: import_zod45.z.string().optional(),
    mimetype: import_zod45.z.string().optional(),
    name: import_zod45.z.string().optional(),
    s3_path: import_zod45.z.string().optional(),
    short_name: import_zod45.z.string().optional(),
    size: import_zod45.z.number().optional()
  }).transform((data) => ({
    id: data["id"],
    md5: data["md5"],
    mimetype: data["mimetype"],
    name: data["name"],
    s3Path: data["s3_path"],
    shortName: data["short_name"],
    size: data["size"]
  }));
});
var dataFiles5Request = import_zod45.z.lazy(() => {
  return import_zod45.z.object({
    id: import_zod45.z.number().optional(),
    md5: import_zod45.z.string().optional(),
    mimetype: import_zod45.z.string().optional(),
    name: import_zod45.z.string().optional(),
    s3Path: import_zod45.z.string().optional(),
    shortName: import_zod45.z.string().optional(),
    size: import_zod45.z.number().optional()
  }).transform((data) => ({
    id: data["id"],
    md5: data["md5"],
    mimetype: data["mimetype"],
    name: data["name"],
    s3_path: data["s3Path"],
    short_name: data["shortName"],
    size: data["size"]
  }));
});

// src/services/web-downloads-debrid/models/get-web-download-list-ok-response-data.ts
var getWebDownloadListOkResponseData = import_zod46.z.lazy(() => {
  return import_zod46.z.object({
    active: import_zod46.z.boolean().optional(),
    authId: import_zod46.z.string().optional(),
    availability: import_zod46.z.number().optional(),
    createdAt: import_zod46.z.string().optional(),
    downloadFinished: import_zod46.z.boolean().optional(),
    downloadPresent: import_zod46.z.boolean().optional(),
    downloadSpeed: import_zod46.z.number().optional(),
    downloadState: import_zod46.z.string().optional(),
    error: import_zod46.z.string().optional(),
    eta: import_zod46.z.number().optional(),
    expiresAt: import_zod46.z.string().optional(),
    files: import_zod46.z.array(dataFiles5).optional(),
    hash: import_zod46.z.string().optional(),
    id: import_zod46.z.number().optional(),
    inactiveCheck: import_zod46.z.number().optional(),
    name: import_zod46.z.string().optional(),
    progress: import_zod46.z.number().optional(),
    server: import_zod46.z.number().optional(),
    size: import_zod46.z.number().optional(),
    torrentFile: import_zod46.z.boolean().optional(),
    updatedAt: import_zod46.z.string().optional(),
    uploadSpeed: import_zod46.z.number().optional()
  });
});
var getWebDownloadListOkResponseDataResponse = import_zod46.z.lazy(() => {
  return import_zod46.z.object({
    active: import_zod46.z.boolean().optional(),
    auth_id: import_zod46.z.string().optional(),
    availability: import_zod46.z.number().optional(),
    created_at: import_zod46.z.string().optional(),
    download_finished: import_zod46.z.boolean().optional(),
    download_present: import_zod46.z.boolean().optional(),
    download_speed: import_zod46.z.number().optional(),
    download_state: import_zod46.z.string().optional(),
    error: import_zod46.z.string().optional(),
    eta: import_zod46.z.number().optional(),
    expires_at: import_zod46.z.string().optional(),
    files: import_zod46.z.array(dataFiles5Response).optional(),
    hash: import_zod46.z.string().optional(),
    id: import_zod46.z.number().optional(),
    inactive_check: import_zod46.z.number().optional(),
    name: import_zod46.z.string().optional(),
    progress: import_zod46.z.number().optional(),
    server: import_zod46.z.number().optional(),
    size: import_zod46.z.number().optional(),
    torrent_file: import_zod46.z.boolean().optional(),
    updated_at: import_zod46.z.string().optional(),
    upload_speed: import_zod46.z.number().optional()
  }).transform((data) => ({
    active: data["active"],
    authId: data["auth_id"],
    availability: data["availability"],
    createdAt: data["created_at"],
    downloadFinished: data["download_finished"],
    downloadPresent: data["download_present"],
    downloadSpeed: data["download_speed"],
    downloadState: data["download_state"],
    error: data["error"],
    eta: data["eta"],
    expiresAt: data["expires_at"],
    files: data["files"],
    hash: data["hash"],
    id: data["id"],
    inactiveCheck: data["inactive_check"],
    name: data["name"],
    progress: data["progress"],
    server: data["server"],
    size: data["size"],
    torrentFile: data["torrent_file"],
    updatedAt: data["updated_at"],
    uploadSpeed: data["upload_speed"]
  }));
});
var getWebDownloadListOkResponseDataRequest = import_zod46.z.lazy(() => {
  return import_zod46.z.object({
    active: import_zod46.z.boolean().optional(),
    authId: import_zod46.z.string().optional(),
    availability: import_zod46.z.number().optional(),
    createdAt: import_zod46.z.string().optional(),
    downloadFinished: import_zod46.z.boolean().optional(),
    downloadPresent: import_zod46.z.boolean().optional(),
    downloadSpeed: import_zod46.z.number().optional(),
    downloadState: import_zod46.z.string().optional(),
    error: import_zod46.z.string().optional(),
    eta: import_zod46.z.number().optional(),
    expiresAt: import_zod46.z.string().optional(),
    files: import_zod46.z.array(dataFiles5Request).optional(),
    hash: import_zod46.z.string().optional(),
    id: import_zod46.z.number().optional(),
    inactiveCheck: import_zod46.z.number().optional(),
    name: import_zod46.z.string().optional(),
    progress: import_zod46.z.number().optional(),
    server: import_zod46.z.number().optional(),
    size: import_zod46.z.number().optional(),
    torrentFile: import_zod46.z.boolean().optional(),
    updatedAt: import_zod46.z.string().optional(),
    uploadSpeed: import_zod46.z.number().optional()
  }).transform((data) => ({
    active: data["active"],
    auth_id: data["authId"],
    availability: data["availability"],
    created_at: data["createdAt"],
    download_finished: data["downloadFinished"],
    download_present: data["downloadPresent"],
    download_speed: data["downloadSpeed"],
    download_state: data["downloadState"],
    error: data["error"],
    eta: data["eta"],
    expires_at: data["expiresAt"],
    files: data["files"],
    hash: data["hash"],
    id: data["id"],
    inactive_check: data["inactiveCheck"],
    name: data["name"],
    progress: data["progress"],
    server: data["server"],
    size: data["size"],
    torrent_file: data["torrentFile"],
    updated_at: data["updatedAt"],
    upload_speed: data["uploadSpeed"]
  }));
});

// src/services/web-downloads-debrid/models/get-web-download-list-ok-response.ts
var getWebDownloadListOkResponse = import_zod47.z.lazy(() => {
  return import_zod47.z.object({
    data: import_zod47.z.array(getWebDownloadListOkResponseData).optional(),
    detail: import_zod47.z.string().optional(),
    error: import_zod47.z.any().optional().nullable(),
    success: import_zod47.z.boolean().optional()
  });
});
var getWebDownloadListOkResponseResponse = import_zod47.z.lazy(() => {
  return import_zod47.z.object({
    data: import_zod47.z.array(getWebDownloadListOkResponseDataResponse).optional(),
    detail: import_zod47.z.string().optional(),
    error: import_zod47.z.any().optional().nullable(),
    success: import_zod47.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getWebDownloadListOkResponseRequest = import_zod47.z.lazy(() => {
  return import_zod47.z.object({
    data: import_zod47.z.array(getWebDownloadListOkResponseDataRequest).optional(),
    detail: import_zod47.z.string().optional(),
    error: import_zod47.z.any().optional().nullable(),
    success: import_zod47.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/web-downloads-debrid/models/get-hoster-list-ok-response.ts
var import_zod49 = require("zod");

// src/services/web-downloads-debrid/models/get-hoster-list-ok-response-data.ts
var import_zod48 = require("zod");
var getHosterListOkResponseData = import_zod48.z.lazy(() => {
  return import_zod48.z.object({
    dailyBandwidthLimit: import_zod48.z.number().optional(),
    dailyBandwidthUsed: import_zod48.z.number().optional(),
    dailyLinkLimit: import_zod48.z.number().optional(),
    dailyLinkUsed: import_zod48.z.number().optional(),
    domains: import_zod48.z.array(import_zod48.z.string()).optional(),
    domais: import_zod48.z.array(import_zod48.z.string()).optional(),
    domaisn: import_zod48.z.array(import_zod48.z.string()).optional(),
    icon: import_zod48.z.string().optional(),
    limit: import_zod48.z.number().optional(),
    name: import_zod48.z.string().optional(),
    note: import_zod48.z.string().optional().nullable(),
    status: import_zod48.z.boolean().optional(),
    type: import_zod48.z.string().optional(),
    url: import_zod48.z.string().optional()
  });
});
var getHosterListOkResponseDataResponse = import_zod48.z.lazy(() => {
  return import_zod48.z.object({
    daily_bandwidth_limit: import_zod48.z.number().optional(),
    daily_bandwidth_used: import_zod48.z.number().optional(),
    daily_link_limit: import_zod48.z.number().optional(),
    daily_link_used: import_zod48.z.number().optional(),
    domains: import_zod48.z.array(import_zod48.z.string()).optional(),
    domais: import_zod48.z.array(import_zod48.z.string()).optional(),
    domaisn: import_zod48.z.array(import_zod48.z.string()).optional(),
    icon: import_zod48.z.string().optional(),
    limit: import_zod48.z.number().optional(),
    name: import_zod48.z.string().optional(),
    note: import_zod48.z.string().optional().nullable(),
    status: import_zod48.z.boolean().optional(),
    type: import_zod48.z.string().optional(),
    url: import_zod48.z.string().optional()
  }).transform((data) => ({
    dailyBandwidthLimit: data["daily_bandwidth_limit"],
    dailyBandwidthUsed: data["daily_bandwidth_used"],
    dailyLinkLimit: data["daily_link_limit"],
    dailyLinkUsed: data["daily_link_used"],
    domains: data["domains"],
    domais: data["domais"],
    domaisn: data["domaisn"],
    icon: data["icon"],
    limit: data["limit"],
    name: data["name"],
    note: data["note"],
    status: data["status"],
    type: data["type"],
    url: data["url"]
  }));
});
var getHosterListOkResponseDataRequest = import_zod48.z.lazy(() => {
  return import_zod48.z.object({
    dailyBandwidthLimit: import_zod48.z.number().optional(),
    dailyBandwidthUsed: import_zod48.z.number().optional(),
    dailyLinkLimit: import_zod48.z.number().optional(),
    dailyLinkUsed: import_zod48.z.number().optional(),
    domains: import_zod48.z.array(import_zod48.z.string()).optional(),
    domais: import_zod48.z.array(import_zod48.z.string()).optional(),
    domaisn: import_zod48.z.array(import_zod48.z.string()).optional(),
    icon: import_zod48.z.string().optional(),
    limit: import_zod48.z.number().optional(),
    name: import_zod48.z.string().optional(),
    note: import_zod48.z.string().optional().nullable(),
    status: import_zod48.z.boolean().optional(),
    type: import_zod48.z.string().optional(),
    url: import_zod48.z.string().optional()
  }).transform((data) => ({
    daily_bandwidth_limit: data["dailyBandwidthLimit"],
    daily_bandwidth_used: data["dailyBandwidthUsed"],
    daily_link_limit: data["dailyLinkLimit"],
    daily_link_used: data["dailyLinkUsed"],
    domains: data["domains"],
    domais: data["domais"],
    domaisn: data["domaisn"],
    icon: data["icon"],
    limit: data["limit"],
    name: data["name"],
    note: data["note"],
    status: data["status"],
    type: data["type"],
    url: data["url"]
  }));
});

// src/services/web-downloads-debrid/models/get-hoster-list-ok-response.ts
var getHosterListOkResponse = import_zod49.z.lazy(() => {
  return import_zod49.z.object({
    data: import_zod49.z.array(getHosterListOkResponseData).optional(),
    detail: import_zod49.z.string().optional(),
    error: import_zod49.z.any().optional().nullable(),
    success: import_zod49.z.boolean().optional()
  });
});
var getHosterListOkResponseResponse = import_zod49.z.lazy(() => {
  return import_zod49.z.object({
    data: import_zod49.z.array(getHosterListOkResponseDataResponse).optional(),
    detail: import_zod49.z.string().optional(),
    error: import_zod49.z.any().optional().nullable(),
    success: import_zod49.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getHosterListOkResponseRequest = import_zod49.z.lazy(() => {
  return import_zod49.z.object({
    data: import_zod49.z.array(getHosterListOkResponseDataRequest).optional(),
    detail: import_zod49.z.string().optional(),
    error: import_zod49.z.any().optional().nullable(),
    success: import_zod49.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/web-downloads-debrid/web-downloads-debrid-service.ts
var WebDownloadsDebridService = class extends BaseService {
  /**
   * ### Overview
  Creates a web download under your account. Simply send a link to any file on the internet. Once it has been checked, it will begin downloading assuming your account has available active download slots, and they aren't too large.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion - 
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<CreateWebDownloadOkResponse>>} Create Web Download Success
   */
  async createWebDownload(apiVersion, body, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/webdl/createwebdownload").setRequestSchema(createWebDownloadRequestRequest).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("multipartFormData" /* MultipartFormData */).addResponse({
      schema: createWebDownloadOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addHeaderParam({ key: "Content-Type", value: "multipart/form-data" }).addBody(body).build();
    return this.client.call(request);
  }
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
  async controlWebDownload(apiVersion, body, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/webdl/controlwebdownload").setRequestSchema(import_zod50.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod50.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).addError({
      error: _9,
      contentType: "json" /* Json */,
      status: 400
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "bypass_cache",
      value: params == null ? void 0 : params.bypassCache
    }).addQueryParam({
      key: "id",
      value: params == null ? void 0 : params.id
    }).addHeaderParam({ key: "Content-Type", value: "application/json" }).addBody(body).build();
    return this.client.call(request);
  }
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
  async requestDownloadLink2(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/webdl/requestdl").setRequestSchema(import_zod50.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod50.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "token",
      value: params == null ? void 0 : params.token
    }).addQueryParam({
      key: "web_id",
      value: params == null ? void 0 : params.webId
    }).addQueryParam({
      key: "file_id",
      value: params == null ? void 0 : params.fileId
    }).addQueryParam({
      key: "zip_link",
      value: params == null ? void 0 : params.zipLink
    }).addQueryParam({
      key: "user_ip",
      value: params == null ? void 0 : params.userIp
    }).addQueryParam({
      key: "redirect",
      value: params == null ? void 0 : params.redirect
    }).build();
    return this.client.call(request);
  }
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
  async getWebDownloadList(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/webdl/mylist").setRequestSchema(import_zod50.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: getWebDownloadListOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "bypass_cache",
      value: params == null ? void 0 : params.bypassCache
    }).addQueryParam({
      key: "id",
      value: params == null ? void 0 : params.id
    }).addQueryParam({
      key: "offset",
      value: params == null ? void 0 : params.offset
    }).addQueryParam({
      key: "limit",
      value: params == null ? void 0 : params.limit
    }).build();
    return this.client.call(request);
  }
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
  async getWebDownloadCachedAvailability(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/webdl/checkcached").setRequestSchema(import_zod50.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod50.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "hash",
      value: params == null ? void 0 : params.hash
    }).addQueryParam({
      key: "format",
      value: params == null ? void 0 : params.format
    }).build();
    return this.client.call(request);
  }
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
  async getHosterList(apiVersion, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/webdl/hosters").setRequestSchema(import_zod50.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: getHosterListOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).build();
    return this.client.call(request);
  }
};

// src/services/general/general-service.ts
var import_zod56 = require("zod");

// src/services/general/models/get-up-status-ok-response.ts
var import_zod51 = require("zod");
var getUpStatusOkResponse = import_zod51.z.lazy(() => {
  return import_zod51.z.object({
    data: import_zod51.z.any().optional().nullable(),
    detail: import_zod51.z.string().optional(),
    error: import_zod51.z.any().optional().nullable(),
    success: import_zod51.z.boolean().optional()
  });
});
var getUpStatusOkResponseResponse = import_zod51.z.lazy(() => {
  return import_zod51.z.object({
    data: import_zod51.z.any().optional().nullable(),
    detail: import_zod51.z.string().optional(),
    error: import_zod51.z.any().optional().nullable(),
    success: import_zod51.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getUpStatusOkResponseRequest = import_zod51.z.lazy(() => {
  return import_zod51.z.object({
    data: import_zod51.z.any().optional().nullable(),
    detail: import_zod51.z.string().optional(),
    error: import_zod51.z.any().optional().nullable(),
    success: import_zod51.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/general/models/get-stats-ok-response.ts
var import_zod53 = require("zod");

// src/services/general/models/get-stats-ok-response-data.ts
var import_zod52 = require("zod");
var getStatsOkResponseData = import_zod52.z.lazy(() => {
  return import_zod52.z.object({
    activeTorrents: import_zod52.z.number().optional(),
    activeUsenetDownloads: import_zod52.z.number().optional(),
    activeWebDownloads: import_zod52.z.number().optional(),
    totalBytesDownloaded: import_zod52.z.number().optional(),
    totalBytesUploaded: import_zod52.z.number().optional(),
    totalDownloads: import_zod52.z.number().optional(),
    totalServers: import_zod52.z.number().optional(),
    totalTorrentDownloads: import_zod52.z.number().optional(),
    totalUsenetDownloads: import_zod52.z.number().optional(),
    totalUsers: import_zod52.z.number().optional(),
    totalWebDownloads: import_zod52.z.number().optional()
  });
});
var getStatsOkResponseDataResponse = import_zod52.z.lazy(() => {
  return import_zod52.z.object({
    active_torrents: import_zod52.z.number().optional(),
    active_usenet_downloads: import_zod52.z.number().optional(),
    active_web_downloads: import_zod52.z.number().optional(),
    total_bytes_downloaded: import_zod52.z.number().optional(),
    total_bytes_uploaded: import_zod52.z.number().optional(),
    total_downloads: import_zod52.z.number().optional(),
    total_servers: import_zod52.z.number().optional(),
    total_torrent_downloads: import_zod52.z.number().optional(),
    total_usenet_downloads: import_zod52.z.number().optional(),
    total_users: import_zod52.z.number().optional(),
    total_web_downloads: import_zod52.z.number().optional()
  }).transform((data) => ({
    activeTorrents: data["active_torrents"],
    activeUsenetDownloads: data["active_usenet_downloads"],
    activeWebDownloads: data["active_web_downloads"],
    totalBytesDownloaded: data["total_bytes_downloaded"],
    totalBytesUploaded: data["total_bytes_uploaded"],
    totalDownloads: data["total_downloads"],
    totalServers: data["total_servers"],
    totalTorrentDownloads: data["total_torrent_downloads"],
    totalUsenetDownloads: data["total_usenet_downloads"],
    totalUsers: data["total_users"],
    totalWebDownloads: data["total_web_downloads"]
  }));
});
var getStatsOkResponseDataRequest = import_zod52.z.lazy(() => {
  return import_zod52.z.object({
    activeTorrents: import_zod52.z.number().optional(),
    activeUsenetDownloads: import_zod52.z.number().optional(),
    activeWebDownloads: import_zod52.z.number().optional(),
    totalBytesDownloaded: import_zod52.z.number().optional(),
    totalBytesUploaded: import_zod52.z.number().optional(),
    totalDownloads: import_zod52.z.number().optional(),
    totalServers: import_zod52.z.number().optional(),
    totalTorrentDownloads: import_zod52.z.number().optional(),
    totalUsenetDownloads: import_zod52.z.number().optional(),
    totalUsers: import_zod52.z.number().optional(),
    totalWebDownloads: import_zod52.z.number().optional()
  }).transform((data) => ({
    active_torrents: data["activeTorrents"],
    active_usenet_downloads: data["activeUsenetDownloads"],
    active_web_downloads: data["activeWebDownloads"],
    total_bytes_downloaded: data["totalBytesDownloaded"],
    total_bytes_uploaded: data["totalBytesUploaded"],
    total_downloads: data["totalDownloads"],
    total_servers: data["totalServers"],
    total_torrent_downloads: data["totalTorrentDownloads"],
    total_usenet_downloads: data["totalUsenetDownloads"],
    total_users: data["totalUsers"],
    total_web_downloads: data["totalWebDownloads"]
  }));
});

// src/services/general/models/get-stats-ok-response.ts
var getStatsOkResponse = import_zod53.z.lazy(() => {
  return import_zod53.z.object({
    data: getStatsOkResponseData.optional(),
    detail: import_zod53.z.string().optional(),
    error: import_zod53.z.boolean().optional(),
    success: import_zod53.z.boolean().optional()
  });
});
var getStatsOkResponseResponse = import_zod53.z.lazy(() => {
  return import_zod53.z.object({
    data: getStatsOkResponseDataResponse.optional(),
    detail: import_zod53.z.string().optional(),
    error: import_zod53.z.boolean().optional(),
    success: import_zod53.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getStatsOkResponseRequest = import_zod53.z.lazy(() => {
  return import_zod53.z.object({
    data: getStatsOkResponseDataRequest.optional(),
    detail: import_zod53.z.string().optional(),
    error: import_zod53.z.boolean().optional(),
    success: import_zod53.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/general/models/get-changelogs-json-ok-response.ts
var import_zod55 = require("zod");

// src/services/general/models/get-changelogs-json-ok-response-data.ts
var import_zod54 = require("zod");
var getChangelogsJsonOkResponseData = import_zod54.z.lazy(() => {
  return import_zod54.z.object({
    createdAt: import_zod54.z.string().optional(),
    html: import_zod54.z.string().optional(),
    id: import_zod54.z.string().optional(),
    link: import_zod54.z.string().optional(),
    markdown: import_zod54.z.string().optional(),
    name: import_zod54.z.string().optional()
  });
});
var getChangelogsJsonOkResponseDataResponse = import_zod54.z.lazy(() => {
  return import_zod54.z.object({
    created_at: import_zod54.z.string().optional(),
    html: import_zod54.z.string().optional(),
    id: import_zod54.z.string().optional(),
    link: import_zod54.z.string().optional(),
    markdown: import_zod54.z.string().optional(),
    name: import_zod54.z.string().optional()
  }).transform((data) => ({
    createdAt: data["created_at"],
    html: data["html"],
    id: data["id"],
    link: data["link"],
    markdown: data["markdown"],
    name: data["name"]
  }));
});
var getChangelogsJsonOkResponseDataRequest = import_zod54.z.lazy(() => {
  return import_zod54.z.object({
    createdAt: import_zod54.z.string().optional(),
    html: import_zod54.z.string().optional(),
    id: import_zod54.z.string().optional(),
    link: import_zod54.z.string().optional(),
    markdown: import_zod54.z.string().optional(),
    name: import_zod54.z.string().optional()
  }).transform((data) => ({
    created_at: data["createdAt"],
    html: data["html"],
    id: data["id"],
    link: data["link"],
    markdown: data["markdown"],
    name: data["name"]
  }));
});

// src/services/general/models/get-changelogs-json-ok-response.ts
var getChangelogsJsonOkResponse = import_zod55.z.lazy(() => {
  return import_zod55.z.object({
    data: import_zod55.z.array(getChangelogsJsonOkResponseData).optional(),
    detail: import_zod55.z.string().optional(),
    error: import_zod55.z.any().optional().nullable(),
    success: import_zod55.z.boolean().optional()
  });
});
var getChangelogsJsonOkResponseResponse = import_zod55.z.lazy(() => {
  return import_zod55.z.object({
    data: import_zod55.z.array(getChangelogsJsonOkResponseDataResponse).optional(),
    detail: import_zod55.z.string().optional(),
    error: import_zod55.z.any().optional().nullable(),
    success: import_zod55.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getChangelogsJsonOkResponseRequest = import_zod55.z.lazy(() => {
  return import_zod55.z.object({
    data: import_zod55.z.array(getChangelogsJsonOkResponseDataRequest).optional(),
    detail: import_zod55.z.string().optional(),
    error: import_zod55.z.any().optional().nullable(),
    success: import_zod55.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/general/general-service.ts
var GeneralService = class extends BaseService {
  /**
   * ### Overview
  Simply gets if the TorBox API is available for use or not. Also might include information about downtimes.
  
  ### Authorization
  
  None needed.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetUpStatusOkResponse>>} Get Up Status Success
   */
  async getUpStatus(requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/").setRequestSchema(import_zod56.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: getUpStatusOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).addError({
      error: Error,
      contentType: "text" /* Text */,
      status: 502
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).build();
    return this.client.call(request);
  }
  /**
   * ### Overview
  Simply gets general stats about the TorBox service.
  
  ### Authorization
  
  None needed.
   * @param {string} apiVersion - 
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetStatsOkResponse>>} Get Stats Success
   */
  async getStats(apiVersion, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/stats").setRequestSchema(import_zod56.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: getStatsOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).build();
    return this.client.call(request);
  }
  /**
   * ### Overview
  Gets most recent 100 changelogs from [https://feedback.torbox.app/changelog.](https://feedback.torbox.app/changelog.) This is useful for people who want updates on the TorBox changelog. Includes all the necessary items to make this compatible with RSS feed viewers for notifications, and proper HTML viewing.
  
  ### Authorization
  
  None needed.
   * @param {string} apiVersion - 
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>} Get Changelogs RSS Feed Success
   */
  async getChangelogsRssFeed(apiVersion, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/changelogs/rss").setRequestSchema(import_zod56.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod56.z.string(),
      contentType: "text" /* Text */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).build();
    return this.client.call(request);
  }
  /**
   * ### Overview
  Gets most recent 100 changelogs from [https://feedback.torbox.app/changelog.](https://feedback.torbox.app/changelog.) This is useful for developers who want to integrate the changelog into their apps for their users to see. Includes content in HTML and markdown for developers to easily render the text in a fancy yet simple way.
  
  ### Authorization
  
  None needed.
   * @param {string} apiVersion - 
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetChangelogsJsonOkResponse>>} Get Changelogs JSON Success
   */
  async getChangelogsJson(apiVersion, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/changelogs/json").setRequestSchema(import_zod56.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: getChangelogsJsonOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).build();
    return this.client.call(request);
  }
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
  async getSpeedtestFiles(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/speedtest").setRequestSchema(import_zod56.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod56.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "test_length",
      value: params == null ? void 0 : params.testLength
    }).addQueryParam({
      key: "region",
      value: params == null ? void 0 : params.region
    }).build();
    return this.client.call(request);
  }
};

// src/services/notifications/notifications-service.ts
var import_zod60 = require("zod");

// src/services/notifications/models/_10.ts
var import_zod57 = require("zod");
var _10Response = import_zod57.z.lazy(() => {
  return import_zod57.z.object({
    data: import_zod57.z.any().optional().nullable(),
    detail: import_zod57.z.string().optional(),
    error: import_zod57.z.any().optional().nullable(),
    success: import_zod57.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var _10 = class extends Error {
  constructor(message, response) {
    super(message);
    const parsedResponse = _10Response.parse(response);
    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
};

// src/services/notifications/models/get-notification-feed-ok-response.ts
var import_zod59 = require("zod");

// src/services/notifications/models/get-notification-feed-ok-response-data.ts
var import_zod58 = require("zod");
var getNotificationFeedOkResponseData = import_zod58.z.lazy(() => {
  return import_zod58.z.object({
    authId: import_zod58.z.string().optional(),
    createdAt: import_zod58.z.string().optional(),
    id: import_zod58.z.number().optional(),
    message: import_zod58.z.string().optional(),
    title: import_zod58.z.string().optional()
  });
});
var getNotificationFeedOkResponseDataResponse = import_zod58.z.lazy(() => {
  return import_zod58.z.object({
    auth_id: import_zod58.z.string().optional(),
    created_at: import_zod58.z.string().optional(),
    id: import_zod58.z.number().optional(),
    message: import_zod58.z.string().optional(),
    title: import_zod58.z.string().optional()
  }).transform((data) => ({
    authId: data["auth_id"],
    createdAt: data["created_at"],
    id: data["id"],
    message: data["message"],
    title: data["title"]
  }));
});
var getNotificationFeedOkResponseDataRequest = import_zod58.z.lazy(() => {
  return import_zod58.z.object({
    authId: import_zod58.z.string().optional(),
    createdAt: import_zod58.z.string().optional(),
    id: import_zod58.z.number().optional(),
    message: import_zod58.z.string().optional(),
    title: import_zod58.z.string().optional()
  }).transform((data) => ({
    auth_id: data["authId"],
    created_at: data["createdAt"],
    id: data["id"],
    message: data["message"],
    title: data["title"]
  }));
});

// src/services/notifications/models/get-notification-feed-ok-response.ts
var getNotificationFeedOkResponse = import_zod59.z.lazy(() => {
  return import_zod59.z.object({
    data: import_zod59.z.array(getNotificationFeedOkResponseData).optional(),
    detail: import_zod59.z.string().optional(),
    error: import_zod59.z.any().optional().nullable(),
    success: import_zod59.z.boolean().optional()
  });
});
var getNotificationFeedOkResponseResponse = import_zod59.z.lazy(() => {
  return import_zod59.z.object({
    data: import_zod59.z.array(getNotificationFeedOkResponseDataResponse).optional(),
    detail: import_zod59.z.string().optional(),
    error: import_zod59.z.any().optional().nullable(),
    success: import_zod59.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getNotificationFeedOkResponseRequest = import_zod59.z.lazy(() => {
  return import_zod59.z.object({
    data: import_zod59.z.array(getNotificationFeedOkResponseDataRequest).optional(),
    detail: import_zod59.z.string().optional(),
    error: import_zod59.z.any().optional().nullable(),
    success: import_zod59.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/notifications/notifications-service.ts
var NotificationsService = class extends BaseService {
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
  async getRssNotificationFeed(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/notifications/rss").setRequestSchema(import_zod60.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod60.z.string(),
      contentType: "text" /* Text */,
      status: 200
    }).addError({
      error: _10,
      contentType: "json" /* Json */,
      status: 500
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "token",
      value: params == null ? void 0 : params.token
    }).build();
    return this.client.call(request);
  }
  /**
   * ### Overview
  Gets your notifications in a JSON object that is easily parsable compared to the RSS Feed. Gives all the same data as the RSS Feed.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion - 
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetNotificationFeedOkResponse>>} Get Notification Feed Success
   */
  async getNotificationFeed(apiVersion, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/notifications/mynotifications").setRequestSchema(import_zod60.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: getNotificationFeedOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).build();
    return this.client.call(request);
  }
  /**
   * ### Overview
  Marks all of your notifications as read and deletes them permanently.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion - 
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>} 
   */
  async clearAllNotifications(apiVersion, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/notifications/clear").setRequestSchema(import_zod60.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod60.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).build();
    return this.client.call(request);
  }
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
  async clearSingleNotification(apiVersion, notificationId, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/notifications/clear/{notification_id}").setRequestSchema(import_zod60.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod60.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addPathParam({
      key: "notification_id",
      value: notificationId
    }).build();
    return this.client.call(request);
  }
  /**
   * ### Overview
  Sends a test notification to all enabled notification types. This can be useful for validating setups. No need for any body in this request.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion - 
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>} 
   */
  async sendTestNotification(apiVersion, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/notifications/test").setRequestSchema(import_zod60.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod60.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).build();
    return this.client.call(request);
  }
};

// src/services/user/user-service.ts
var import_zod69 = require("zod");

// src/services/user/models/_11.ts
var import_zod61 = require("zod");
var _11Response = import_zod61.z.lazy(() => {
  return import_zod61.z.object({
    data: import_zod61.z.any().optional().nullable(),
    detail: import_zod61.z.string().optional(),
    error: import_zod61.z.string().optional(),
    success: import_zod61.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var _11 = class extends Error {
  constructor(message, response) {
    super(message);
    const parsedResponse = _11Response.parse(response);
    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
};

// src/services/user/models/get-user-data-ok-response.ts
var import_zod64 = require("zod");

// src/services/user/models/get-user-data-ok-response-data.ts
var import_zod63 = require("zod");

// src/services/user/models/settings.ts
var import_zod62 = require("zod");
var settings = import_zod62.z.lazy(() => {
  return import_zod62.z.object({
    anothersetting: import_zod62.z.string().optional(),
    setting: import_zod62.z.string().optional()
  });
});
var settingsResponse = import_zod62.z.lazy(() => {
  return import_zod62.z.object({
    anothersetting: import_zod62.z.string().optional(),
    setting: import_zod62.z.string().optional()
  }).transform((data) => ({
    anothersetting: data["anothersetting"],
    setting: data["setting"]
  }));
});
var settingsRequest = import_zod62.z.lazy(() => {
  return import_zod62.z.object({
    anothersetting: import_zod62.z.string().optional(),
    setting: import_zod62.z.string().optional()
  }).transform((data) => ({
    anothersetting: data["anothersetting"],
    setting: data["setting"]
  }));
});

// src/services/user/models/get-user-data-ok-response-data.ts
var getUserDataOkResponseData = import_zod63.z.lazy(() => {
  return import_zod63.z.object({
    authId: import_zod63.z.string().optional(),
    baseEmail: import_zod63.z.string().optional(),
    cooldownUntil: import_zod63.z.string().optional(),
    createdAt: import_zod63.z.string().optional(),
    customer: import_zod63.z.string().optional(),
    email: import_zod63.z.string().optional(),
    id: import_zod63.z.number().optional(),
    isSubscribed: import_zod63.z.boolean().optional(),
    plan: import_zod63.z.number().optional(),
    premiumExpiresAt: import_zod63.z.string().optional(),
    server: import_zod63.z.number().optional(),
    settings: settings.optional(),
    totalDownloaded: import_zod63.z.number().optional(),
    updatedAt: import_zod63.z.string().optional(),
    userReferral: import_zod63.z.string().optional()
  });
});
var getUserDataOkResponseDataResponse = import_zod63.z.lazy(() => {
  return import_zod63.z.object({
    auth_id: import_zod63.z.string().optional(),
    base_email: import_zod63.z.string().optional(),
    cooldown_until: import_zod63.z.string().optional(),
    created_at: import_zod63.z.string().optional(),
    customer: import_zod63.z.string().optional(),
    email: import_zod63.z.string().optional(),
    id: import_zod63.z.number().optional(),
    is_subscribed: import_zod63.z.boolean().optional(),
    plan: import_zod63.z.number().optional(),
    premium_expires_at: import_zod63.z.string().optional(),
    server: import_zod63.z.number().optional(),
    settings: settingsResponse.optional(),
    total_downloaded: import_zod63.z.number().optional(),
    updated_at: import_zod63.z.string().optional(),
    user_referral: import_zod63.z.string().optional()
  }).transform((data) => ({
    authId: data["auth_id"],
    baseEmail: data["base_email"],
    cooldownUntil: data["cooldown_until"],
    createdAt: data["created_at"],
    customer: data["customer"],
    email: data["email"],
    id: data["id"],
    isSubscribed: data["is_subscribed"],
    plan: data["plan"],
    premiumExpiresAt: data["premium_expires_at"],
    server: data["server"],
    settings: data["settings"],
    totalDownloaded: data["total_downloaded"],
    updatedAt: data["updated_at"],
    userReferral: data["user_referral"]
  }));
});
var getUserDataOkResponseDataRequest = import_zod63.z.lazy(() => {
  return import_zod63.z.object({
    authId: import_zod63.z.string().optional(),
    baseEmail: import_zod63.z.string().optional(),
    cooldownUntil: import_zod63.z.string().optional(),
    createdAt: import_zod63.z.string().optional(),
    customer: import_zod63.z.string().optional(),
    email: import_zod63.z.string().optional(),
    id: import_zod63.z.number().optional(),
    isSubscribed: import_zod63.z.boolean().optional(),
    plan: import_zod63.z.number().optional(),
    premiumExpiresAt: import_zod63.z.string().optional(),
    server: import_zod63.z.number().optional(),
    settings: settingsRequest.optional(),
    totalDownloaded: import_zod63.z.number().optional(),
    updatedAt: import_zod63.z.string().optional(),
    userReferral: import_zod63.z.string().optional()
  }).transform((data) => ({
    auth_id: data["authId"],
    base_email: data["baseEmail"],
    cooldown_until: data["cooldownUntil"],
    created_at: data["createdAt"],
    customer: data["customer"],
    email: data["email"],
    id: data["id"],
    is_subscribed: data["isSubscribed"],
    plan: data["plan"],
    premium_expires_at: data["premiumExpiresAt"],
    server: data["server"],
    settings: data["settings"],
    total_downloaded: data["totalDownloaded"],
    updated_at: data["updatedAt"],
    user_referral: data["userReferral"]
  }));
});

// src/services/user/models/get-user-data-ok-response.ts
var getUserDataOkResponse = import_zod64.z.lazy(() => {
  return import_zod64.z.object({
    data: getUserDataOkResponseData.optional(),
    detail: import_zod64.z.string().optional(),
    error: import_zod64.z.any().optional().nullable(),
    success: import_zod64.z.boolean().optional()
  });
});
var getUserDataOkResponseResponse = import_zod64.z.lazy(() => {
  return import_zod64.z.object({
    data: getUserDataOkResponseDataResponse.optional(),
    detail: import_zod64.z.string().optional(),
    error: import_zod64.z.any().optional().nullable(),
    success: import_zod64.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getUserDataOkResponseRequest = import_zod64.z.lazy(() => {
  return import_zod64.z.object({
    data: getUserDataOkResponseDataRequest.optional(),
    detail: import_zod64.z.string().optional(),
    error: import_zod64.z.any().optional().nullable(),
    success: import_zod64.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/user/models/add-referral-to-account-ok-response.ts
var import_zod65 = require("zod");
var addReferralToAccountOkResponse = import_zod65.z.lazy(() => {
  return import_zod65.z.object({
    data: import_zod65.z.any().optional().nullable(),
    detail: import_zod65.z.string().optional(),
    error: import_zod65.z.any().optional().nullable(),
    success: import_zod65.z.boolean().optional()
  });
});
var addReferralToAccountOkResponseResponse = import_zod65.z.lazy(() => {
  return import_zod65.z.object({
    data: import_zod65.z.any().optional().nullable(),
    detail: import_zod65.z.string().optional(),
    error: import_zod65.z.any().optional().nullable(),
    success: import_zod65.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var addReferralToAccountOkResponseRequest = import_zod65.z.lazy(() => {
  return import_zod65.z.object({
    data: import_zod65.z.any().optional().nullable(),
    detail: import_zod65.z.string().optional(),
    error: import_zod65.z.any().optional().nullable(),
    success: import_zod65.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/user/models/_12.ts
var import_zod68 = require("zod");

// src/services/user/models/_13.ts
var import_zod67 = require("zod");

// src/services/user/models/_14.ts
var import_zod66 = require("zod");
var _14 = import_zod66.z.lazy(() => {
  return import_zod66.z.object({
    data: import_zod66.z.string().optional(),
    detail: import_zod66.z.string().optional()
  });
});
var _14Response = import_zod66.z.lazy(() => {
  return import_zod66.z.object({
    data: import_zod66.z.string().optional(),
    detail: import_zod66.z.string().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"]
  }));
});
var _14Request = import_zod66.z.lazy(() => {
  return import_zod66.z.object({
    data: import_zod66.z.string().optional(),
    detail: import_zod66.z.string().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"]
  }));
});

// src/services/user/models/_13.ts
var _13 = import_zod67.z.lazy(() => {
  return import_zod67.z.union([import_zod67.z.string(), _14]);
});
var _13Response = import_zod67.z.lazy(() => {
  return import_zod67.z.union([import_zod67.z.string(), _14Response]);
});
var _13Request = import_zod67.z.lazy(() => {
  return import_zod67.z.union([import_zod67.z.string(), _14Request]);
});

// src/services/user/models/_12.ts
var _12Response = import_zod68.z.lazy(() => {
  return import_zod68.z.object({
    data: import_zod68.z.any().optional().nullable(),
    detail: _13Response.optional(),
    error: import_zod68.z.string().optional(),
    success: import_zod68.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var _122 = class extends Error {
  constructor(message, response) {
    super(message);
    const parsedResponse = _12Response.parse(response);
    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
};

// src/services/user/user-service.ts
var UserService = class extends BaseService {
  /**
   * ### Overview
  If you want a new API token, or your old one has been compromised, you may request a new one. If you happen to forget the token, go the [TorBox settings page ](https://torbox.app/settings) and copy the current one. If this still doesn't work, you may contact us at our support email for a new one.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header as well as passing the `session_token` from the website to be passed in the body. You can find the `session_token` in the localStorage of your browser on any TorBox.app page under the key `torbox_session_token`. This is a temporary token that only lasts for 1 hour, which is why it is used here to verify the identity of a user as well as their API token.
   * @param {string} apiVersion - 
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>} 
   */
  async refreshApiToken(apiVersion, body, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/user/refreshtoken").setRequestSchema(import_zod69.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod69.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).addError({
      error: _11,
      contentType: "json" /* Json */,
      status: 500
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addHeaderParam({ key: "Content-Type", value: "application/json" }).addBody(body).build();
    return this.client.call(request);
  }
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
  async getUserData(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/user/me").setRequestSchema(import_zod69.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: getUserDataOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "settings",
      value: params == null ? void 0 : params.settings
    }).build();
    return this.client.call(request);
  }
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
  async addReferralToAccount(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/user/addreferral").setRequestSchema(import_zod69.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: addReferralToAccountOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).addError({
      error: _122,
      contentType: "json" /* Json */,
      status: 400
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "referral",
      value: params == null ? void 0 : params.referral
    }).build();
    return this.client.call(request);
  }
  /**
   * ### Overview
  Requests a 6 digit code to be sent to the user's email for verification. Used to verify a user actually wants to perform a potentially dangerous action.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion - 
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>} 
   */
  async getConfirmationCode(apiVersion, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/user/getconfirmation").setRequestSchema(import_zod69.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod69.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).build();
    return this.client.call(request);
  }
};

// src/services/rss-feeds/rss-feeds-service.ts
var import_zod70 = require("zod");
var RssFeedsService = class extends BaseService {
  /**
   * ### Overview
  Allows adding an RSS feed to your account. This API gives you a lot of customization options, but is best used with the UI on the website. This endpoint only works for Pro users (plan: 2).
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion - 
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>} 
   */
  async addRssFeed(apiVersion, body, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/rss/addrss").setRequestSchema(import_zod70.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod70.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addHeaderParam({ key: "Content-Type", value: "application/json" }).addBody(body).build();
    return this.client.call(request);
  }
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
  async controlRssFeed(apiVersion, body, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/rss/controlrss").setRequestSchema(import_zod70.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod70.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addHeaderParam({ key: "Content-Type", value: "application/json" }).addBody(body).build();
    return this.client.call(request);
  }
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
  async modifyRssFeed(apiVersion, body, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/rss/modifyrss").setRequestSchema(import_zod70.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod70.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addHeaderParam({ key: "Content-Type", value: "application/json" }).addBody(body).build();
    return this.client.call(request);
  }
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
  async getUserRssFeeds(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/rss/getfeeds").setRequestSchema(import_zod70.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod70.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "id",
      value: params == null ? void 0 : params.id
    }).build();
    return this.client.call(request);
  }
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
  async getRssFeedItems(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/rss/getfeeditems").setRequestSchema(import_zod70.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod70.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "rss_feed_id",
      value: params == null ? void 0 : params.rssFeedId
    }).build();
    return this.client.call(request);
  }
};

// src/services/integrations/integrations-service.ts
var import_zod78 = require("zod");

// src/services/integrations/models/_15.ts
var import_zod71 = require("zod");
var _15Response = import_zod71.z.lazy(() => {
  return import_zod71.z.object({
    data: import_zod71.z.any().optional().nullable(),
    detail: import_zod71.z.string().optional(),
    error: import_zod71.z.string().optional(),
    success: import_zod71.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var _15 = class extends Error {
  constructor(message, response) {
    super(message);
    const parsedResponse = _15Response.parse(response);
    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
};

// src/services/integrations/models/_16.ts
var import_zod72 = require("zod");
var _16Response = import_zod72.z.lazy(() => {
  return import_zod72.z.object({
    data: import_zod72.z.string().optional(),
    detail: import_zod72.z.string().optional(),
    error: import_zod72.z.string().optional(),
    success: import_zod72.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var _16 = class extends Error {
  constructor(message, response) {
    super(message);
    const parsedResponse = _16Response.parse(response);
    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
};

// src/services/integrations/models/get-all-jobs-ok-response.ts
var import_zod74 = require("zod");

// src/services/integrations/models/get-all-jobs-ok-response-data.ts
var import_zod73 = require("zod");
var getAllJobsOkResponseData = import_zod73.z.lazy(() => {
  return import_zod73.z.object({
    authId: import_zod73.z.string().optional(),
    createdAt: import_zod73.z.string().optional(),
    detail: import_zod73.z.string().optional(),
    downloadUrl: import_zod73.z.string().optional().nullable(),
    fileId: import_zod73.z.number().optional(),
    hash: import_zod73.z.string().optional(),
    id: import_zod73.z.number().optional(),
    integration: import_zod73.z.string().optional(),
    progress: import_zod73.z.number().optional(),
    status: import_zod73.z.string().optional(),
    type: import_zod73.z.string().optional(),
    updatedAt: import_zod73.z.string().optional(),
    zip: import_zod73.z.boolean().optional()
  });
});
var getAllJobsOkResponseDataResponse = import_zod73.z.lazy(() => {
  return import_zod73.z.object({
    auth_id: import_zod73.z.string().optional(),
    created_at: import_zod73.z.string().optional(),
    detail: import_zod73.z.string().optional(),
    download_url: import_zod73.z.string().optional().nullable(),
    file_id: import_zod73.z.number().optional(),
    hash: import_zod73.z.string().optional(),
    id: import_zod73.z.number().optional(),
    integration: import_zod73.z.string().optional(),
    progress: import_zod73.z.number().optional(),
    status: import_zod73.z.string().optional(),
    type: import_zod73.z.string().optional(),
    updated_at: import_zod73.z.string().optional(),
    zip: import_zod73.z.boolean().optional()
  }).transform((data) => ({
    authId: data["auth_id"],
    createdAt: data["created_at"],
    detail: data["detail"],
    downloadUrl: data["download_url"],
    fileId: data["file_id"],
    hash: data["hash"],
    id: data["id"],
    integration: data["integration"],
    progress: data["progress"],
    status: data["status"],
    type: data["type"],
    updatedAt: data["updated_at"],
    zip: data["zip"]
  }));
});
var getAllJobsOkResponseDataRequest = import_zod73.z.lazy(() => {
  return import_zod73.z.object({
    authId: import_zod73.z.string().optional(),
    createdAt: import_zod73.z.string().optional(),
    detail: import_zod73.z.string().optional(),
    downloadUrl: import_zod73.z.string().optional().nullable(),
    fileId: import_zod73.z.number().optional(),
    hash: import_zod73.z.string().optional(),
    id: import_zod73.z.number().optional(),
    integration: import_zod73.z.string().optional(),
    progress: import_zod73.z.number().optional(),
    status: import_zod73.z.string().optional(),
    type: import_zod73.z.string().optional(),
    updatedAt: import_zod73.z.string().optional(),
    zip: import_zod73.z.boolean().optional()
  }).transform((data) => ({
    auth_id: data["authId"],
    created_at: data["createdAt"],
    detail: data["detail"],
    download_url: data["downloadUrl"],
    file_id: data["fileId"],
    hash: data["hash"],
    id: data["id"],
    integration: data["integration"],
    progress: data["progress"],
    status: data["status"],
    type: data["type"],
    updated_at: data["updatedAt"],
    zip: data["zip"]
  }));
});

// src/services/integrations/models/get-all-jobs-ok-response.ts
var getAllJobsOkResponse = import_zod74.z.lazy(() => {
  return import_zod74.z.object({
    data: import_zod74.z.array(getAllJobsOkResponseData).optional(),
    detail: import_zod74.z.string().optional(),
    error: import_zod74.z.any().optional().nullable(),
    success: import_zod74.z.boolean().optional()
  });
});
var getAllJobsOkResponseResponse = import_zod74.z.lazy(() => {
  return import_zod74.z.object({
    data: import_zod74.z.array(getAllJobsOkResponseDataResponse).optional(),
    detail: import_zod74.z.string().optional(),
    error: import_zod74.z.any().optional().nullable(),
    success: import_zod74.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getAllJobsOkResponseRequest = import_zod74.z.lazy(() => {
  return import_zod74.z.object({
    data: import_zod74.z.array(getAllJobsOkResponseDataRequest).optional(),
    detail: import_zod74.z.string().optional(),
    error: import_zod74.z.any().optional().nullable(),
    success: import_zod74.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/integrations/models/_17.ts
var import_zod75 = require("zod");
var _17Response = import_zod75.z.lazy(() => {
  return import_zod75.z.object({
    data: import_zod75.z.any().optional().nullable(),
    detail: import_zod75.z.string().optional(),
    error: import_zod75.z.string().optional(),
    success: import_zod75.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var _17 = class extends Error {
  constructor(message, response) {
    super(message);
    const parsedResponse = _17Response.parse(response);
    this.data = parsedResponse.data;
    this.detail = parsedResponse.detail;
    this.error = parsedResponse.error;
    this.success = parsedResponse.success;
  }
};

// src/services/integrations/models/get-all-jobs-by-hash-ok-response.ts
var import_zod77 = require("zod");

// src/services/integrations/models/get-all-jobs-by-hash-ok-response-data.ts
var import_zod76 = require("zod");
var getAllJobsByHashOkResponseData = import_zod76.z.lazy(() => {
  return import_zod76.z.object({
    authId: import_zod76.z.string().optional(),
    createdAt: import_zod76.z.string().optional(),
    detail: import_zod76.z.string().optional(),
    downloadUrl: import_zod76.z.string().optional().nullable(),
    fileId: import_zod76.z.number().optional(),
    hash: import_zod76.z.string().optional(),
    id: import_zod76.z.number().optional(),
    integration: import_zod76.z.string().optional(),
    progress: import_zod76.z.number().optional(),
    status: import_zod76.z.string().optional(),
    type: import_zod76.z.string().optional(),
    updatedAt: import_zod76.z.string().optional(),
    zip: import_zod76.z.boolean().optional()
  });
});
var getAllJobsByHashOkResponseDataResponse = import_zod76.z.lazy(() => {
  return import_zod76.z.object({
    auth_id: import_zod76.z.string().optional(),
    created_at: import_zod76.z.string().optional(),
    detail: import_zod76.z.string().optional(),
    download_url: import_zod76.z.string().optional().nullable(),
    file_id: import_zod76.z.number().optional(),
    hash: import_zod76.z.string().optional(),
    id: import_zod76.z.number().optional(),
    integration: import_zod76.z.string().optional(),
    progress: import_zod76.z.number().optional(),
    status: import_zod76.z.string().optional(),
    type: import_zod76.z.string().optional(),
    updated_at: import_zod76.z.string().optional(),
    zip: import_zod76.z.boolean().optional()
  }).transform((data) => ({
    authId: data["auth_id"],
    createdAt: data["created_at"],
    detail: data["detail"],
    downloadUrl: data["download_url"],
    fileId: data["file_id"],
    hash: data["hash"],
    id: data["id"],
    integration: data["integration"],
    progress: data["progress"],
    status: data["status"],
    type: data["type"],
    updatedAt: data["updated_at"],
    zip: data["zip"]
  }));
});
var getAllJobsByHashOkResponseDataRequest = import_zod76.z.lazy(() => {
  return import_zod76.z.object({
    authId: import_zod76.z.string().optional(),
    createdAt: import_zod76.z.string().optional(),
    detail: import_zod76.z.string().optional(),
    downloadUrl: import_zod76.z.string().optional().nullable(),
    fileId: import_zod76.z.number().optional(),
    hash: import_zod76.z.string().optional(),
    id: import_zod76.z.number().optional(),
    integration: import_zod76.z.string().optional(),
    progress: import_zod76.z.number().optional(),
    status: import_zod76.z.string().optional(),
    type: import_zod76.z.string().optional(),
    updatedAt: import_zod76.z.string().optional(),
    zip: import_zod76.z.boolean().optional()
  }).transform((data) => ({
    auth_id: data["authId"],
    created_at: data["createdAt"],
    detail: data["detail"],
    download_url: data["downloadUrl"],
    file_id: data["fileId"],
    hash: data["hash"],
    id: data["id"],
    integration: data["integration"],
    progress: data["progress"],
    status: data["status"],
    type: data["type"],
    updated_at: data["updatedAt"],
    zip: data["zip"]
  }));
});

// src/services/integrations/models/get-all-jobs-by-hash-ok-response.ts
var getAllJobsByHashOkResponse = import_zod77.z.lazy(() => {
  return import_zod77.z.object({
    data: import_zod77.z.array(getAllJobsByHashOkResponseData).optional(),
    detail: import_zod77.z.string().optional(),
    error: import_zod77.z.any().optional().nullable(),
    success: import_zod77.z.boolean().optional()
  });
});
var getAllJobsByHashOkResponseResponse = import_zod77.z.lazy(() => {
  return import_zod77.z.object({
    data: import_zod77.z.array(getAllJobsByHashOkResponseDataResponse).optional(),
    detail: import_zod77.z.string().optional(),
    error: import_zod77.z.any().optional().nullable(),
    success: import_zod77.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getAllJobsByHashOkResponseRequest = import_zod77.z.lazy(() => {
  return import_zod77.z.object({
    data: import_zod77.z.array(getAllJobsByHashOkResponseDataRequest).optional(),
    detail: import_zod77.z.string().optional(),
    error: import_zod77.z.any().optional().nullable(),
    success: import_zod77.z.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/integrations/integrations-service.ts
var IntegrationsService = class extends BaseService {
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
  async authenticateOauth(apiVersion, provider, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/integration/oauth/{provider}").setRequestSchema(import_zod78.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod78.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).addError({
      error: _15,
      contentType: "json" /* Json */,
      status: 400
    }).addError({
      error: _16,
      contentType: "json" /* Json */,
      status: 500
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addPathParam({
      key: "provider",
      value: provider
    }).build();
    return this.client.call(request);
  }
  /**
   * ### Overview
  Queues a job to upload the specified file or zip to the Google Drive account sent with the `google_token` key. To get this key, either get an OAuth2 token using `/oauth/google` or your own solution. Make sure when creating the OAuth link, you add the scope `https://www.googleapis.com/auth/drive.file` so TorBox has access to the user's Drive.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion - 
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>} 
   */
  async queueGoogleDrive(apiVersion, body, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/integration/googledrive").setRequestSchema(import_zod78.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod78.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addHeaderParam({ key: "Content-Type", value: "application/json" }).addBody(body).build();
    return this.client.call(request);
  }
  /**
   * ### Overview
  Queues a job to upload the specified file or zip to Pixeldrain.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion - 
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>} 
   */
  async queuePixeldrain(apiVersion, body, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/integration/pixeldrain").setRequestSchema(import_zod78.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod78.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addHeaderParam({ key: "Content-Type", value: "application/json" }).addBody(body).build();
    return this.client.call(request);
  }
  /**
   * ### Overview
  Queues a job to upload the specified file or zip to the OneDrive sent with the `onedrive_token` key. To get this key, either get an OAuth2 token using `/oauth/onedrive` or your own solution. Make sure when creating the OAuth link you use the scope `files.readwrite.all`. This is compatible with all different types of Microsoft accounts.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion - 
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>} 
   */
  async queueOnedrive(apiVersion, body, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/integration/onedrive").setRequestSchema(import_zod78.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod78.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addHeaderParam({ key: "Content-Type", value: "application/json" }).addBody(body).build();
    return this.client.call(request);
  }
  /**
   * ### Overview
  Queues a job to upload the specified file or zip to the GoFile account sent with the `gofile_token` _(optional)_. To get this key, login to your GoFile account and go [here](https://gofile.io/myProfile). Copy the **Account API Token**. This is what you will use as the `gofile_token`, if you choose to use it. If you don't use an Account API Token, GoFile will simply create an anonymous file. This file will expire after inactivity.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion - 
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>} 
   */
  async queueGofile(apiVersion, body, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/integration/gofile").setRequestSchema(import_zod78.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod78.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addHeaderParam({ key: "Content-Type", value: "application/json" }).addBody(body).build();
    return this.client.call(request);
  }
  /**
   * ### Overview
  Queues a job to upload the specified file or zip to the 1Fichier account sent with the `onefichier_token` key (optional). To get this key you must be a Premium or Premium Gold member at 1Fichier. If you are upgraded, [go to the parameters page](https://1fichier.com/console/params.pl), and get an **API Key**. This is what you will use as the `onefichier_token`, if you choose to use it. If you don't use an API Key, 1Fichier will simply create an anonymous file.
  
  ### Authorization
  
  Requires an API key using the Authorization Bearer Header.
   * @param {string} apiVersion - 
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<any>>} 
   */
  async queue1fichier(apiVersion, body, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/integration/1fichier").setRequestSchema(import_zod78.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod78.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addHeaderParam({ key: "Content-Type", value: "application/json" }).addBody(body).build();
    return this.client.call(request);
  }
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
  async getAllJobs(apiVersion, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/integration/jobs").setRequestSchema(import_zod78.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: getAllJobsOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).build();
    return this.client.call(request);
  }
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
  async getSpecificJob(apiVersion, jobId, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/integration/job/{job_id}").setRequestSchema(import_zod78.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod78.z.string(),
      contentType: "text" /* Text */,
      status: 200
    }).addError({
      error: _17,
      contentType: "json" /* Json */,
      status: 404
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addPathParam({
      key: "job_id",
      value: jobId
    }).build();
    return this.client.call(request);
  }
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
  async cancelSpecificJob(apiVersion, jobId, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("DELETE").setPath("/{api_version}/api/integration/job/{job_id}").setRequestSchema(import_zod78.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod78.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addPathParam({
      key: "job_id",
      value: jobId
    }).build();
    return this.client.call(request);
  }
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
  async getAllJobsByHash(apiVersion, hash, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/integration/jobs/{hash}").setRequestSchema(import_zod78.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: getAllJobsByHashOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addPathParam({
      key: "hash",
      value: hash
    }).build();
    return this.client.call(request);
  }
};

// src/services/queued/queued-service.ts
var import_zod79 = require("zod");
var QueuedService = class extends BaseService {
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
  async getQueuedDownloads(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/queued/getqueued").setRequestSchema(import_zod79.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod79.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addQueryParam({
      key: "bypass_cache",
      value: params == null ? void 0 : params.bypassCache
    }).addQueryParam({
      key: "id",
      value: params == null ? void 0 : params.id
    }).addQueryParam({
      key: "offset",
      value: params == null ? void 0 : params.offset
    }).addQueryParam({
      key: "limit",
      value: params == null ? void 0 : params.limit
    }).addQueryParam({
      key: "type",
      value: params == null ? void 0 : params.type
    }).build();
    return this.client.call(request);
  }
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
  async controlQueuedDownloads(apiVersion, body, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/queued/controlqueued").setRequestSchema(import_zod79.z.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: import_zod79.z.undefined(),
      contentType: "noContent" /* NoContent */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addHeaderParam({ key: "Content-Type", value: "application/json" }).addBody(body).build();
    return this.client.call(request);
  }
};

// src/index.ts
var TorboxApi = class {
  constructor(config) {
    this.config = config;
    this.torrents = new TorrentsService(this.config);
    this.usenet = new UsenetService(this.config);
    this.webDownloadsDebrid = new WebDownloadsDebridService(this.config);
    this.general = new GeneralService(this.config);
    this.notifications = new NotificationsService(this.config);
    this.user = new UserService(this.config);
    this.rssFeeds = new RssFeedsService(this.config);
    this.integrations = new IntegrationsService(this.config);
    this.queued = new QueuedService(this.config);
  }
  set baseUrl(baseUrl) {
    this.torrents.baseUrl = baseUrl;
    this.usenet.baseUrl = baseUrl;
    this.webDownloadsDebrid.baseUrl = baseUrl;
    this.general.baseUrl = baseUrl;
    this.notifications.baseUrl = baseUrl;
    this.user.baseUrl = baseUrl;
    this.rssFeeds.baseUrl = baseUrl;
    this.integrations.baseUrl = baseUrl;
    this.queued.baseUrl = baseUrl;
  }
  set environment(environment) {
    this.torrents.baseUrl = environment;
    this.usenet.baseUrl = environment;
    this.webDownloadsDebrid.baseUrl = environment;
    this.general.baseUrl = environment;
    this.notifications.baseUrl = environment;
    this.user.baseUrl = environment;
    this.rssFeeds.baseUrl = environment;
    this.integrations.baseUrl = environment;
    this.queued.baseUrl = environment;
  }
  set timeoutMs(timeoutMs) {
    this.torrents.timeoutMs = timeoutMs;
    this.usenet.timeoutMs = timeoutMs;
    this.webDownloadsDebrid.timeoutMs = timeoutMs;
    this.general.timeoutMs = timeoutMs;
    this.notifications.timeoutMs = timeoutMs;
    this.user.timeoutMs = timeoutMs;
    this.rssFeeds.timeoutMs = timeoutMs;
    this.integrations.timeoutMs = timeoutMs;
    this.queued.timeoutMs = timeoutMs;
  }
  set token(token) {
    this.torrents.token = token;
    this.usenet.token = token;
    this.webDownloadsDebrid.token = token;
    this.general.token = token;
    this.notifications.token = token;
    this.user.token = token;
    this.rssFeeds.token = token;
    this.integrations.token = token;
    this.queued.token = token;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Environment,
  GeneralService,
  IntegrationsService,
  NotificationsService,
  QueuedService,
  RssFeedsService,
  TorboxApi,
  TorrentsService,
  UsenetService,
  UserService,
  WebDownloadsDebridService
});
