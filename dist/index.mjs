// src/services/torrents/torrents-service.ts
import { z as z27 } from "zod";

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
import { ZodUndefined } from "zod";

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
    return !!responseDefinition.schema && !(responseDefinition.schema instanceof ZodUndefined) && response.metadata.status !== 204;
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
import { ZodError } from "zod";

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
        if (error instanceof ZodError) {
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
import z from "zod";

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
      requestSchema: z.any(),
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
import { z as z2 } from "zod";
var createTorrentRequest = z2.lazy(() => {
  return z2.object({
    allowZip: z2.string().optional(),
    asQueued: z2.string().optional(),
    file: z2.instanceof(ArrayBuffer).optional(),
    magnet: z2.string().optional(),
    name: z2.string().optional(),
    seed: z2.string().optional()
  });
});
var createTorrentRequestResponse = z2.lazy(() => {
  return z2.object({
    allow_zip: z2.string().optional(),
    as_queued: z2.string().optional(),
    file: z2.instanceof(ArrayBuffer).optional(),
    magnet: z2.string().optional(),
    name: z2.string().optional(),
    seed: z2.string().optional()
  }).transform((data) => ({
    allowZip: data["allow_zip"],
    asQueued: data["as_queued"],
    file: data["file"],
    magnet: data["magnet"],
    name: data["name"],
    seed: data["seed"]
  }));
});
var createTorrentRequestRequest = z2.lazy(() => {
  return z2.object({
    allowZip: z2.string().optional(),
    asQueued: z2.string().optional(),
    file: z2.instanceof(ArrayBuffer).optional(),
    magnet: z2.string().optional(),
    name: z2.string().optional(),
    seed: z2.string().optional()
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
import { z as z4 } from "zod";

// src/services/torrents/models/create-torrent-ok-response-data.ts
import { z as z3 } from "zod";
var createTorrentOkResponseData = z3.lazy(() => {
  return z3.object({
    activeLimit: z3.number().optional(),
    authId: z3.string().optional(),
    currentActiveDownloads: z3.number().optional(),
    hash: z3.string().optional(),
    queuedId: z3.number().optional(),
    torrentId: z3.number().optional()
  });
});
var createTorrentOkResponseDataResponse = z3.lazy(() => {
  return z3.object({
    active_limit: z3.number().optional(),
    auth_id: z3.string().optional(),
    current_active_downloads: z3.number().optional(),
    hash: z3.string().optional(),
    queued_id: z3.number().optional(),
    torrent_id: z3.number().optional()
  }).transform((data) => ({
    activeLimit: data["active_limit"],
    authId: data["auth_id"],
    currentActiveDownloads: data["current_active_downloads"],
    hash: data["hash"],
    queuedId: data["queued_id"],
    torrentId: data["torrent_id"]
  }));
});
var createTorrentOkResponseDataRequest = z3.lazy(() => {
  return z3.object({
    activeLimit: z3.number().optional(),
    authId: z3.string().optional(),
    currentActiveDownloads: z3.number().optional(),
    hash: z3.string().optional(),
    queuedId: z3.number().optional(),
    torrentId: z3.number().optional()
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
var createTorrentOkResponse = z4.lazy(() => {
  return z4.object({
    data: createTorrentOkResponseData.optional(),
    detail: z4.string().optional(),
    error: z4.any().optional().nullable(),
    success: z4.boolean().optional()
  });
});
var createTorrentOkResponseResponse = z4.lazy(() => {
  return z4.object({
    data: createTorrentOkResponseDataResponse.optional(),
    detail: z4.string().optional(),
    error: z4.any().optional().nullable(),
    success: z4.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var createTorrentOkResponseRequest = z4.lazy(() => {
  return z4.object({
    data: createTorrentOkResponseDataRequest.optional(),
    detail: z4.string().optional(),
    error: z4.any().optional().nullable(),
    success: z4.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/torrents/models/__.ts
import { z as z6 } from "zod";

// src/services/torrents/models/_1.ts
import { z as z5 } from "zod";
var _1 = z5.lazy(() => {
  return z5.object({
    cooldownUntil: z5.string().optional(),
    currentDownloads: z5.number().optional(),
    currentTime: z5.string().optional(),
    monthlyLimit: z5.number().optional()
  });
});
var _1Response = z5.lazy(() => {
  return z5.object({
    cooldown_until: z5.string().optional(),
    current_downloads: z5.number().optional(),
    current_time: z5.string().optional(),
    monthly_limit: z5.number().optional()
  }).transform((data) => ({
    cooldownUntil: data["cooldown_until"],
    currentDownloads: data["current_downloads"],
    currentTime: data["current_time"],
    monthlyLimit: data["monthly_limit"]
  }));
});
var _1Request = z5.lazy(() => {
  return z5.object({
    cooldownUntil: z5.string().optional(),
    currentDownloads: z5.number().optional(),
    currentTime: z5.string().optional(),
    monthlyLimit: z5.number().optional()
  }).transform((data) => ({
    cooldown_until: data["cooldownUntil"],
    current_downloads: data["currentDownloads"],
    current_time: data["currentTime"],
    monthly_limit: data["monthlyLimit"]
  }));
});

// src/services/torrents/models/__.ts
var _response = z6.lazy(() => {
  return z6.object({
    data: _1Response.optional().nullable(),
    detail: z6.string().optional(),
    error: z6.boolean().optional().nullable(),
    success: z6.boolean().optional()
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
import { z as z7 } from "zod";
var _2Response = z7.lazy(() => {
  return z7.object({
    data: z7.any().optional().nullable(),
    detail: z7.string().optional(),
    error: z7.any().optional().nullable(),
    success: z7.boolean().optional()
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
import { z as z8 } from "zod";
var controlTorrentOkResponse = z8.lazy(() => {
  return z8.object({
    data: z8.any().optional().nullable(),
    detail: z8.string().optional(),
    error: z8.any().optional().nullable(),
    success: z8.boolean().optional()
  });
});
var controlTorrentOkResponseResponse = z8.lazy(() => {
  return z8.object({
    data: z8.any().optional().nullable(),
    detail: z8.string().optional(),
    error: z8.any().optional().nullable(),
    success: z8.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var controlTorrentOkResponseRequest = z8.lazy(() => {
  return z8.object({
    data: z8.any().optional().nullable(),
    detail: z8.string().optional(),
    error: z8.any().optional().nullable(),
    success: z8.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/torrents/models/_3.ts
import { z as z9 } from "zod";
var _3Response = z9.lazy(() => {
  return z9.object({
    data: z9.any().optional().nullable(),
    detail: z9.string().optional(),
    error: z9.string().optional(),
    success: z9.boolean().optional()
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
import { z as z10 } from "zod";
var _4Response = z10.lazy(() => {
  return z10.object({
    data: z10.any().optional().nullable(),
    detail: z10.string().optional(),
    error: z10.string().optional(),
    success: z10.boolean().optional()
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
import { z as z11 } from "zod";
var requestDownloadLinkOkResponse = z11.lazy(() => {
  return z11.object({
    data: z11.string().optional(),
    detail: z11.string().optional(),
    error: z11.any().optional().nullable(),
    success: z11.boolean().optional()
  });
});
var requestDownloadLinkOkResponseResponse = z11.lazy(() => {
  return z11.object({
    data: z11.string().optional(),
    detail: z11.string().optional(),
    error: z11.any().optional().nullable(),
    success: z11.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var requestDownloadLinkOkResponseRequest = z11.lazy(() => {
  return z11.object({
    data: z11.string().optional(),
    detail: z11.string().optional(),
    error: z11.any().optional().nullable(),
    success: z11.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/torrents/models/get-torrent-list-ok-response.ts
import { z as z14 } from "zod";

// src/services/torrents/models/get-torrent-list-ok-response-data.ts
import { z as z13 } from "zod";

// src/services/torrents/models/data-files-1.ts
import { z as z12 } from "zod";
var dataFiles1 = z12.lazy(() => {
  return z12.object({
    id: z12.number().optional(),
    md5: z12.string().optional(),
    mimetype: z12.string().optional(),
    name: z12.string().optional(),
    s3Path: z12.string().optional(),
    shortName: z12.string().optional(),
    size: z12.number().optional()
  });
});
var dataFiles1Response = z12.lazy(() => {
  return z12.object({
    id: z12.number().optional(),
    md5: z12.string().optional(),
    mimetype: z12.string().optional(),
    name: z12.string().optional(),
    s3_path: z12.string().optional(),
    short_name: z12.string().optional(),
    size: z12.number().optional()
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
var dataFiles1Request = z12.lazy(() => {
  return z12.object({
    id: z12.number().optional(),
    md5: z12.string().optional(),
    mimetype: z12.string().optional(),
    name: z12.string().optional(),
    s3Path: z12.string().optional(),
    shortName: z12.string().optional(),
    size: z12.number().optional()
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
var getTorrentListOkResponseData = z13.lazy(() => {
  return z13.object({
    active: z13.boolean().optional(),
    authId: z13.string().optional(),
    availability: z13.number().optional(),
    createdAt: z13.string().optional(),
    downloadFinished: z13.boolean().optional(),
    downloadPresent: z13.boolean().optional(),
    downloadSpeed: z13.number().optional(),
    downloadState: z13.string().optional(),
    eta: z13.number().optional(),
    expiresAt: z13.string().optional(),
    files: z13.array(dataFiles1).optional(),
    hash: z13.string().optional(),
    id: z13.number().optional(),
    inactiveCheck: z13.number().optional(),
    magnet: z13.string().optional(),
    name: z13.string().optional(),
    peers: z13.number().optional(),
    progress: z13.number().optional(),
    ratio: z13.number().optional(),
    seeds: z13.number().optional(),
    server: z13.number().optional(),
    size: z13.number().optional(),
    torrentFile: z13.boolean().optional(),
    updatedAt: z13.string().optional(),
    uploadSpeed: z13.number().optional()
  });
});
var getTorrentListOkResponseDataResponse = z13.lazy(() => {
  return z13.object({
    active: z13.boolean().optional(),
    auth_id: z13.string().optional(),
    availability: z13.number().optional(),
    created_at: z13.string().optional(),
    download_finished: z13.boolean().optional(),
    download_present: z13.boolean().optional(),
    download_speed: z13.number().optional(),
    download_state: z13.string().optional(),
    eta: z13.number().optional(),
    expires_at: z13.string().optional(),
    files: z13.array(dataFiles1Response).optional(),
    hash: z13.string().optional(),
    id: z13.number().optional(),
    inactive_check: z13.number().optional(),
    magnet: z13.string().optional(),
    name: z13.string().optional(),
    peers: z13.number().optional(),
    progress: z13.number().optional(),
    ratio: z13.number().optional(),
    seeds: z13.number().optional(),
    server: z13.number().optional(),
    size: z13.number().optional(),
    torrent_file: z13.boolean().optional(),
    updated_at: z13.string().optional(),
    upload_speed: z13.number().optional()
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
var getTorrentListOkResponseDataRequest = z13.lazy(() => {
  return z13.object({
    active: z13.boolean().optional(),
    authId: z13.string().optional(),
    availability: z13.number().optional(),
    createdAt: z13.string().optional(),
    downloadFinished: z13.boolean().optional(),
    downloadPresent: z13.boolean().optional(),
    downloadSpeed: z13.number().optional(),
    downloadState: z13.string().optional(),
    eta: z13.number().optional(),
    expiresAt: z13.string().optional(),
    files: z13.array(dataFiles1Request).optional(),
    hash: z13.string().optional(),
    id: z13.number().optional(),
    inactiveCheck: z13.number().optional(),
    magnet: z13.string().optional(),
    name: z13.string().optional(),
    peers: z13.number().optional(),
    progress: z13.number().optional(),
    ratio: z13.number().optional(),
    seeds: z13.number().optional(),
    server: z13.number().optional(),
    size: z13.number().optional(),
    torrentFile: z13.boolean().optional(),
    updatedAt: z13.string().optional(),
    uploadSpeed: z13.number().optional()
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
var getTorrentListOkResponse = z14.lazy(() => {
  return z14.object({
    data: z14.array(getTorrentListOkResponseData).optional(),
    detail: z14.string().optional(),
    error: z14.any().optional().nullable(),
    success: z14.boolean().optional()
  });
});
var getTorrentListOkResponseResponse = z14.lazy(() => {
  return z14.object({
    data: z14.array(getTorrentListOkResponseDataResponse).optional(),
    detail: z14.string().optional(),
    error: z14.any().optional().nullable(),
    success: z14.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getTorrentListOkResponseRequest = z14.lazy(() => {
  return z14.object({
    data: z14.array(getTorrentListOkResponseDataRequest).optional(),
    detail: z14.string().optional(),
    error: z14.any().optional().nullable(),
    success: z14.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/torrents/models/get-torrent-cached-availability-ok-response.ts
import { z as z15 } from "zod";
var getTorrentCachedAvailabilityOkResponse = z15.lazy(() => {
  return z15.object({
    data: z15.any().optional(),
    detail: z15.string().optional(),
    error: z15.string().optional().nullable(),
    success: z15.boolean().optional()
  });
});
var getTorrentCachedAvailabilityOkResponseResponse = z15.lazy(() => {
  return z15.object({
    data: z15.any().optional(),
    detail: z15.string().optional(),
    error: z15.string().optional().nullable(),
    success: z15.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getTorrentCachedAvailabilityOkResponseRequest = z15.lazy(() => {
  return z15.object({
    data: z15.any().optional(),
    detail: z15.string().optional(),
    error: z15.string().optional().nullable(),
    success: z15.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/torrents/models/export-torrent-data-ok-response.ts
import { z as z16 } from "zod";
var exportTorrentDataOkResponse = z16.lazy(() => {
  return z16.object({
    data: z16.string().optional(),
    detail: z16.string().optional(),
    error: z16.any().optional().nullable(),
    success: z16.boolean().optional()
  });
});
var exportTorrentDataOkResponseResponse = z16.lazy(() => {
  return z16.object({
    data: z16.string().optional(),
    detail: z16.string().optional(),
    error: z16.any().optional().nullable(),
    success: z16.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var exportTorrentDataOkResponseRequest = z16.lazy(() => {
  return z16.object({
    data: z16.string().optional(),
    detail: z16.string().optional(),
    error: z16.any().optional().nullable(),
    success: z16.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/torrents/models/_5.ts
import { z as z17 } from "zod";
var _5Response = z17.lazy(() => {
  return z17.object({
    data: z17.any().optional().nullable(),
    detail: z17.string().optional(),
    error: z17.string().optional(),
    success: z17.boolean().optional()
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
import { z as z18 } from "zod";
var _6Response = z18.lazy(() => {
  return z18.object({
    data: z18.any().optional().nullable(),
    detail: z18.string().optional(),
    error: z18.string().optional(),
    success: z18.boolean().optional()
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
import { z as z21 } from "zod";

// src/services/torrents/models/get-torrent-info-ok-response-data.ts
import { z as z20 } from "zod";

// src/services/torrents/models/data-files-2.ts
import { z as z19 } from "zod";
var dataFiles2 = z19.lazy(() => {
  return z19.object({
    name: z19.string().optional(),
    size: z19.number().optional()
  });
});
var dataFiles2Response = z19.lazy(() => {
  return z19.object({
    name: z19.string().optional(),
    size: z19.number().optional()
  }).transform((data) => ({
    name: data["name"],
    size: data["size"]
  }));
});
var dataFiles2Request = z19.lazy(() => {
  return z19.object({
    name: z19.string().optional(),
    size: z19.number().optional()
  }).transform((data) => ({
    name: data["name"],
    size: data["size"]
  }));
});

// src/services/torrents/models/get-torrent-info-ok-response-data.ts
var getTorrentInfoOkResponseData = z20.lazy(() => {
  return z20.object({
    files: z20.array(dataFiles2).optional(),
    hash: z20.string().optional(),
    name: z20.string().optional(),
    peers: z20.number().optional(),
    seeds: z20.number().optional(),
    size: z20.number().optional(),
    trackers: z20.array(z20.any()).optional()
  });
});
var getTorrentInfoOkResponseDataResponse = z20.lazy(() => {
  return z20.object({
    files: z20.array(dataFiles2Response).optional(),
    hash: z20.string().optional(),
    name: z20.string().optional(),
    peers: z20.number().optional(),
    seeds: z20.number().optional(),
    size: z20.number().optional(),
    trackers: z20.array(z20.any()).optional()
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
var getTorrentInfoOkResponseDataRequest = z20.lazy(() => {
  return z20.object({
    files: z20.array(dataFiles2Request).optional(),
    hash: z20.string().optional(),
    name: z20.string().optional(),
    peers: z20.number().optional(),
    seeds: z20.number().optional(),
    size: z20.number().optional(),
    trackers: z20.array(z20.any()).optional()
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
var getTorrentInfoOkResponse = z21.lazy(() => {
  return z21.object({
    data: getTorrentInfoOkResponseData.optional(),
    detail: z21.string().optional(),
    error: z21.any().optional().nullable(),
    success: z21.boolean().optional()
  });
});
var getTorrentInfoOkResponseResponse = z21.lazy(() => {
  return z21.object({
    data: getTorrentInfoOkResponseDataResponse.optional(),
    detail: z21.string().optional(),
    error: z21.any().optional().nullable(),
    success: z21.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getTorrentInfoOkResponseRequest = z21.lazy(() => {
  return z21.object({
    data: getTorrentInfoOkResponseDataRequest.optional(),
    detail: z21.string().optional(),
    error: z21.any().optional().nullable(),
    success: z21.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/torrents/models/_7.ts
import { z as z22 } from "zod";
var _7Response = z22.lazy(() => {
  return z22.object({
    data: z22.string().optional(),
    detail: z22.string().optional(),
    error: z22.string().optional(),
    success: z22.boolean().optional()
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
import { z as z23 } from "zod";
var getTorrentInfo1Request = z23.lazy(() => {
  return z23.object({
    hash: z23.string().optional()
  });
});
var getTorrentInfo1RequestResponse = z23.lazy(() => {
  return z23.object({
    hash: z23.string().optional()
  }).transform((data) => ({
    hash: data["hash"]
  }));
});
var getTorrentInfo1RequestRequest = z23.lazy(() => {
  return z23.object({
    hash: z23.string().optional()
  }).transform((data) => ({
    hash: data["hash"]
  }));
});

// src/services/torrents/models/get-torrent-info1-ok-response.ts
import { z as z26 } from "zod";

// src/services/torrents/models/get-torrent-info1-ok-response-data.ts
import { z as z25 } from "zod";

// src/services/torrents/models/data-files-3.ts
import { z as z24 } from "zod";
var dataFiles3 = z24.lazy(() => {
  return z24.object({
    name: z24.string().optional(),
    size: z24.number().optional()
  });
});
var dataFiles3Response = z24.lazy(() => {
  return z24.object({
    name: z24.string().optional(),
    size: z24.number().optional()
  }).transform((data) => ({
    name: data["name"],
    size: data["size"]
  }));
});
var dataFiles3Request = z24.lazy(() => {
  return z24.object({
    name: z24.string().optional(),
    size: z24.number().optional()
  }).transform((data) => ({
    name: data["name"],
    size: data["size"]
  }));
});

// src/services/torrents/models/get-torrent-info1-ok-response-data.ts
var getTorrentInfo1OkResponseData = z25.lazy(() => {
  return z25.object({
    files: z25.array(dataFiles3).optional(),
    hash: z25.string().optional(),
    name: z25.string().optional(),
    peers: z25.number().optional(),
    seeds: z25.number().optional(),
    size: z25.number().optional(),
    trackers: z25.array(z25.any()).optional()
  });
});
var getTorrentInfo1OkResponseDataResponse = z25.lazy(() => {
  return z25.object({
    files: z25.array(dataFiles3Response).optional(),
    hash: z25.string().optional(),
    name: z25.string().optional(),
    peers: z25.number().optional(),
    seeds: z25.number().optional(),
    size: z25.number().optional(),
    trackers: z25.array(z25.any()).optional()
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
var getTorrentInfo1OkResponseDataRequest = z25.lazy(() => {
  return z25.object({
    files: z25.array(dataFiles3Request).optional(),
    hash: z25.string().optional(),
    name: z25.string().optional(),
    peers: z25.number().optional(),
    seeds: z25.number().optional(),
    size: z25.number().optional(),
    trackers: z25.array(z25.any()).optional()
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
var getTorrentInfo1OkResponse = z26.lazy(() => {
  return z26.object({
    data: getTorrentInfo1OkResponseData.optional(),
    detail: z26.string().optional(),
    error: z26.any().optional().nullable(),
    success: z26.boolean().optional()
  });
});
var getTorrentInfo1OkResponseResponse = z26.lazy(() => {
  return z26.object({
    data: getTorrentInfo1OkResponseDataResponse.optional(),
    detail: z26.string().optional(),
    error: z26.any().optional().nullable(),
    success: z26.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getTorrentInfo1OkResponseRequest = z26.lazy(() => {
  return z26.object({
    data: getTorrentInfo1OkResponseDataRequest.optional(),
    detail: z26.string().optional(),
    error: z26.any().optional().nullable(),
    success: z26.boolean().optional()
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/torrents/controltorrent").setRequestSchema(z27.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/torrents/requestdl").setRequestSchema(z27.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/torrents/mylist").setRequestSchema(z27.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/torrents/checkcached").setRequestSchema(z27.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/torrents/exportdata").setRequestSchema(z27.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/torrents/torrentinfo").setRequestSchema(z27.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
import { z as z38 } from "zod";

// src/services/usenet/models/create-usenet-download-request.ts
import { z as z28 } from "zod";
var createUsenetDownloadRequest = z28.lazy(() => {
  return z28.object({
    file: z28.instanceof(ArrayBuffer).optional(),
    link: z28.string().optional(),
    name: z28.string().optional()
  });
});
var createUsenetDownloadRequestRequest = z28.lazy(() => {
  return z28.object({
    file: z28.instanceof(ArrayBuffer).optional(),
    link: z28.string().optional(),
    name: z28.string().optional()
  }).transform((data) => ({
    file: data["file"],
    link: data["link"],
    name: data["name"]
  }));
});

// src/services/usenet/models/create-usenet-download-ok-response.ts
import { z as z30 } from "zod";

// src/services/usenet/models/create-usenet-download-ok-response-data.ts
import { z as z29 } from "zod";
var createUsenetDownloadOkResponseData = z29.lazy(() => {
  return z29.object({
    authId: z29.string().optional(),
    hash: z29.string().optional(),
    usenetdownloadId: z29.number().optional()
  });
});
var createUsenetDownloadOkResponseDataResponse = z29.lazy(() => {
  return z29.object({
    auth_id: z29.string().optional(),
    hash: z29.string().optional(),
    usenetdownload_id: z29.number().optional()
  }).transform((data) => ({
    authId: data["auth_id"],
    hash: data["hash"],
    usenetdownloadId: data["usenetdownload_id"]
  }));
});
var createUsenetDownloadOkResponseDataRequest = z29.lazy(() => {
  return z29.object({
    authId: z29.string().optional(),
    hash: z29.string().optional(),
    usenetdownloadId: z29.number().optional()
  }).transform((data) => ({
    auth_id: data["authId"],
    hash: data["hash"],
    usenetdownload_id: data["usenetdownloadId"]
  }));
});

// src/services/usenet/models/create-usenet-download-ok-response.ts
var createUsenetDownloadOkResponse = z30.lazy(() => {
  return z30.object({
    data: createUsenetDownloadOkResponseData.optional(),
    detail: z30.string().optional(),
    error: z30.any().optional().nullable(),
    success: z30.boolean().optional()
  });
});
var createUsenetDownloadOkResponseResponse = z30.lazy(() => {
  return z30.object({
    data: createUsenetDownloadOkResponseDataResponse.optional(),
    detail: z30.string().optional(),
    error: z30.any().optional().nullable(),
    success: z30.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var createUsenetDownloadOkResponseRequest = z30.lazy(() => {
  return z30.object({
    data: createUsenetDownloadOkResponseDataRequest.optional(),
    detail: z30.string().optional(),
    error: z30.any().optional().nullable(),
    success: z30.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/usenet/models/_8.ts
import { z as z31 } from "zod";
var _8Response = z31.lazy(() => {
  return z31.object({
    data: z31.any().optional().nullable(),
    detail: z31.string().optional(),
    error: z31.string().optional(),
    success: z31.boolean().optional()
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
import { z as z34 } from "zod";

// src/services/usenet/models/get-usenet-list-ok-response-data.ts
import { z as z33 } from "zod";

// src/services/usenet/models/data-files-4.ts
import { z as z32 } from "zod";
var dataFiles4 = z32.lazy(() => {
  return z32.object({
    id: z32.number().optional(),
    md5: z32.string().optional().nullable(),
    mimetype: z32.string().optional(),
    name: z32.string().optional(),
    s3Path: z32.string().optional(),
    shortName: z32.string().optional(),
    size: z32.number().optional()
  });
});
var dataFiles4Response = z32.lazy(() => {
  return z32.object({
    id: z32.number().optional(),
    md5: z32.string().optional().nullable(),
    mimetype: z32.string().optional(),
    name: z32.string().optional(),
    s3_path: z32.string().optional(),
    short_name: z32.string().optional(),
    size: z32.number().optional()
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
var dataFiles4Request = z32.lazy(() => {
  return z32.object({
    id: z32.number().optional(),
    md5: z32.string().optional().nullable(),
    mimetype: z32.string().optional(),
    name: z32.string().optional(),
    s3Path: z32.string().optional(),
    shortName: z32.string().optional(),
    size: z32.number().optional()
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
var getUsenetListOkResponseData = z33.lazy(() => {
  return z33.object({
    active: z33.boolean().optional().nullable(),
    authId: z33.string().optional().nullable(),
    availability: z33.number().optional().nullable(),
    createdAt: z33.string().optional().nullable(),
    downloadFinished: z33.boolean().optional().nullable(),
    downloadPresent: z33.boolean().optional().nullable(),
    downloadSpeed: z33.number().optional().nullable(),
    downloadState: z33.string().optional().nullable(),
    eta: z33.number().optional().nullable(),
    expiresAt: z33.string().optional().nullable(),
    files: z33.array(dataFiles4).optional().nullable(),
    hash: z33.string().optional().nullable(),
    id: z33.number().optional().nullable(),
    inactiveCheck: z33.number().optional().nullable(),
    name: z33.string().optional().nullable(),
    progress: z33.number().optional().nullable(),
    server: z33.number().optional().nullable(),
    size: z33.number().optional().nullable(),
    torrentFile: z33.boolean().optional().nullable(),
    updatedAt: z33.string().optional().nullable(),
    uploadSpeed: z33.number().optional().nullable()
  });
});
var getUsenetListOkResponseDataResponse = z33.lazy(() => {
  return z33.object({
    active: z33.boolean().optional().nullable(),
    auth_id: z33.string().optional().nullable(),
    availability: z33.number().optional().nullable(),
    created_at: z33.string().optional().nullable(),
    download_finished: z33.boolean().optional().nullable(),
    download_present: z33.boolean().optional().nullable(),
    download_speed: z33.number().optional().nullable(),
    download_state: z33.string().optional().nullable(),
    eta: z33.number().optional().nullable(),
    expires_at: z33.string().optional().nullable(),
    files: z33.array(dataFiles4Response).optional().nullable(),
    hash: z33.string().optional().nullable(),
    id: z33.number().optional().nullable(),
    inactive_check: z33.number().optional().nullable(),
    name: z33.string().optional().nullable(),
    progress: z33.number().optional().nullable(),
    server: z33.number().optional().nullable(),
    size: z33.number().optional().nullable(),
    torrent_file: z33.boolean().optional().nullable(),
    updated_at: z33.string().optional().nullable(),
    upload_speed: z33.number().optional().nullable()
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
var getUsenetListOkResponseDataRequest = z33.lazy(() => {
  return z33.object({
    active: z33.boolean().optional().nullable(),
    authId: z33.string().optional().nullable(),
    availability: z33.number().optional().nullable(),
    createdAt: z33.string().optional().nullable(),
    downloadFinished: z33.boolean().optional().nullable(),
    downloadPresent: z33.boolean().optional().nullable(),
    downloadSpeed: z33.number().optional().nullable(),
    downloadState: z33.string().optional().nullable(),
    eta: z33.number().optional().nullable(),
    expiresAt: z33.string().optional().nullable(),
    files: z33.array(dataFiles4Request).optional().nullable(),
    hash: z33.string().optional().nullable(),
    id: z33.number().optional().nullable(),
    inactiveCheck: z33.number().optional().nullable(),
    name: z33.string().optional().nullable(),
    progress: z33.number().optional().nullable(),
    server: z33.number().optional().nullable(),
    size: z33.number().optional().nullable(),
    torrentFile: z33.boolean().optional().nullable(),
    updatedAt: z33.string().optional().nullable(),
    uploadSpeed: z33.number().optional().nullable()
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
var getUsenetListOkResponse = z34.lazy(() => {
  return z34.object({
    data: z34.union([
      z34.array(getUsenetListOkResponseData),
      getUsenetListOkResponseData
    ]).optional(),
    detail: z34.string().optional(),
    error: z34.any().optional().nullable(),
    success: z34.boolean().optional()
  });
});
var getUsenetListOkResponseResponse = z34.lazy(() => {
  return z34.object({
    data: z34.union([
      z34.array(getUsenetListOkResponseDataResponse),
      getUsenetListOkResponseDataResponse
    ]).optional(),
    detail: z34.string().optional(),
    error: z34.any().optional().nullable(),
    success: z34.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getUsenetListOkResponseRequest = z34.lazy(() => {
  return z34.object({
    data: z34.union([
      z34.array(getUsenetListOkResponseDataRequest),
      getUsenetListOkResponseDataRequest
    ]).optional(),
    detail: z34.string().optional(),
    error: z34.any().optional().nullable(),
    success: z34.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/usenet/models/request-download-link-response.ts
import { z as z35 } from "zod";
var requestDownloadLinkOkResponse2 = z35.lazy(() => {
  return z35.object({
    data: z35.string().optional(),
    detail: z35.string().optional(),
    error: z35.any().optional().nullable(),
    success: z35.boolean().optional()
  });
});
var requestDownloadLinkOkResponseResponse2 = z35.lazy(() => {
  return z35.object({
    data: z35.string().optional(),
    detail: z35.string().optional(),
    error: z35.any().optional().nullable(),
    success: z35.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var requestDownloadLinkOkResponseRequest2 = z35.lazy(() => {
  return z35.object({
    data: z35.string().optional(),
    detail: z35.string().optional(),
    error: z35.any().optional().nullable(),
    success: z35.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/usenet/models/get-usenet-cached-availability-response.ts
import { z as z37 } from "zod";

// src/services/usenet/models/get-usenet-cached-availability-response-data.ts
import { z as z36 } from "zod";
var getUsenetCachedAvailabilityOkResponseData = z36.lazy(() => {
  return z36.object({
    name: z36.string().optional(),
    size: z36.number().optional(),
    hash: z36.string().optional(),
    files: z36.array(dataFiles4).optional()
  });
});
var getUsenetCachedAvailabilityOkResponseDataResponse = z36.lazy(() => {
  return z36.object({
    name: z36.string().optional(),
    size: z36.number().optional(),
    hash: z36.string().optional(),
    files: z36.array(dataFiles4Response).optional()
  }).transform((data) => ({
    name: data["name"],
    size: data["size"],
    hash: data["hash"],
    files: data["files"]
  }));
});
var getUsenetCachedAvailabilityOkResponseDataRequest = z36.lazy(() => {
  return z36.object({
    name: z36.string().optional(),
    size: z36.number().optional(),
    hash: z36.string().optional(),
    files: z36.array(dataFiles4Request).optional()
  }).transform((data) => ({
    name: data["name"],
    size: data["size"],
    hash: data["hash"],
    files: data["files"]
  }));
});

// src/services/usenet/models/get-usenet-cached-availability-response.ts
var getUsenetCachedAvailabilityOkResponse = z37.lazy(() => {
  return z37.object({
    data: z37.union([z37.array(getUsenetCachedAvailabilityOkResponseData), z37.record(z37.string(), getUsenetCachedAvailabilityOkResponseData)]).optional(),
    detail: z37.string().optional(),
    error: z37.string().optional().nullable(),
    success: z37.boolean().optional()
  });
});
var getUsenetCachedAvailabilityOkResponseResponse = z37.lazy(() => {
  return z37.object({
    data: z37.union([z37.array(getUsenetCachedAvailabilityOkResponseDataResponse), z37.record(z37.string(), getUsenetCachedAvailabilityOkResponseDataResponse)]).optional(),
    detail: z37.string().optional(),
    error: z37.string().optional().nullable(),
    success: z37.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getUsenetCachedAvailabilityOkResponseRequest = z37.lazy(() => {
  return z37.object({
    data: z37.union([z37.array(getUsenetCachedAvailabilityOkResponseDataResponse), z37.record(z37.string(), getUsenetCachedAvailabilityOkResponseDataResponse)]).optional(),
    detail: z37.string().optional(),
    error: z37.string().optional().nullable(),
    success: z37.boolean().optional()
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/usenet/controlusenetdownload").setRequestSchema(z38.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z38.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/usenet/requestdl").setRequestSchema(z38.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z38.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/usenet/mylist").setRequestSchema(z38.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
   * @param {string[]} [params.hashes] - The list of usenet hashes you want to check. To find the hash, md5 the link of the usenet link or file.
   * @param {string} [params.format] - Format you want the data in. Acceptable is either "object" or "list". List is the most performant option as it doesn't require modification of the list.
   * @param {RequestConfig} requestConfig - (Optional) The request configuration for retry and validation.
   * @returns {Promise<HttpResponse<GetUsenetCachedAvailabilityOkResponse>>} 
   */
  async getUsenetCachedAvailability(apiVersion, params, requestConfig) {
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/usenet/checkcached").setRequestSchema(z38.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addHeaderParam({ key: "Content-Type", value: "application/json" }).addResponse({
      schema: getUsenetCachedAvailabilityOkResponseResponse,
      contentType: "json" /* Json */,
      status: 200
    }).setRetryAttempts(this.config, requestConfig).setRetryDelayMs(this.config, requestConfig).setResponseValidation(this.config, requestConfig).addPathParam({
      key: "api_version",
      value: apiVersion
    }).addBody({
      hashes: params == null ? void 0 : params.hashes
    }).addQueryParam({
      key: "format",
      value: params == null ? void 0 : params.format
    }).addQueryParam({
      key: "list_files",
      value: params == null ? void 0 : params.listFiles
    }).build();
    return this.client.call(request);
  }
};

// src/services/web-downloads-debrid/web-downloads-debrid-service.ts
import { z as z48 } from "zod";

// src/services/web-downloads-debrid/models/create-web-download-request.ts
import { z as z39 } from "zod";
var createWebDownloadRequest = z39.lazy(() => {
  return z39.object({
    link: z39.string().optional()
  });
});
var createWebDownloadRequestResponse = z39.lazy(() => {
  return z39.object({
    link: z39.string().optional()
  }).transform((data) => ({
    link: data["link"]
  }));
});
var createWebDownloadRequestRequest = z39.lazy(() => {
  return z39.object({
    link: z39.string().optional()
  }).transform((data) => ({
    link: data["link"]
  }));
});

// src/services/web-downloads-debrid/models/create-web-download-ok-response.ts
import { z as z41 } from "zod";

// src/services/web-downloads-debrid/models/create-web-download-ok-response-data.ts
import { z as z40 } from "zod";
var createWebDownloadOkResponseData = z40.lazy(() => {
  return z40.object({
    authId: z40.string().optional(),
    hash: z40.string().optional(),
    webdownloadId: z40.string().optional()
  });
});
var createWebDownloadOkResponseDataResponse = z40.lazy(() => {
  return z40.object({
    auth_id: z40.string().optional(),
    hash: z40.string().optional(),
    webdownload_id: z40.string().optional()
  }).transform((data) => ({
    authId: data["auth_id"],
    hash: data["hash"],
    webdownloadId: data["webdownload_id"]
  }));
});
var createWebDownloadOkResponseDataRequest = z40.lazy(() => {
  return z40.object({
    authId: z40.string().optional(),
    hash: z40.string().optional(),
    webdownloadId: z40.string().optional()
  }).transform((data) => ({
    auth_id: data["authId"],
    hash: data["hash"],
    webdownload_id: data["webdownloadId"]
  }));
});

// src/services/web-downloads-debrid/models/create-web-download-ok-response.ts
var createWebDownloadOkResponse = z41.lazy(() => {
  return z41.object({
    data: createWebDownloadOkResponseData.optional(),
    detail: z41.string().optional(),
    error: z41.any().optional().nullable(),
    success: z41.boolean().optional()
  });
});
var createWebDownloadOkResponseResponse = z41.lazy(() => {
  return z41.object({
    data: createWebDownloadOkResponseDataResponse.optional(),
    detail: z41.string().optional(),
    error: z41.any().optional().nullable(),
    success: z41.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var createWebDownloadOkResponseRequest = z41.lazy(() => {
  return z41.object({
    data: createWebDownloadOkResponseDataRequest.optional(),
    detail: z41.string().optional(),
    error: z41.any().optional().nullable(),
    success: z41.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/web-downloads-debrid/models/_9.ts
import { z as z42 } from "zod";
var _9Response = z42.lazy(() => {
  return z42.object({
    data: z42.any().optional().nullable(),
    detail: z42.string().optional(),
    error: z42.string().optional(),
    success: z42.boolean().optional()
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
import { z as z45 } from "zod";

// src/services/web-downloads-debrid/models/get-web-download-list-ok-response-data.ts
import { z as z44 } from "zod";

// src/services/web-downloads-debrid/models/data-files-5.ts
import { z as z43 } from "zod";
var dataFiles5 = z43.lazy(() => {
  return z43.object({
    id: z43.number().optional(),
    md5: z43.string().optional(),
    mimetype: z43.string().optional(),
    name: z43.string().optional(),
    s3Path: z43.string().optional(),
    shortName: z43.string().optional(),
    size: z43.number().optional()
  });
});
var dataFiles5Response = z43.lazy(() => {
  return z43.object({
    id: z43.number().optional(),
    md5: z43.string().optional(),
    mimetype: z43.string().optional(),
    name: z43.string().optional(),
    s3_path: z43.string().optional(),
    short_name: z43.string().optional(),
    size: z43.number().optional()
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
var dataFiles5Request = z43.lazy(() => {
  return z43.object({
    id: z43.number().optional(),
    md5: z43.string().optional(),
    mimetype: z43.string().optional(),
    name: z43.string().optional(),
    s3Path: z43.string().optional(),
    shortName: z43.string().optional(),
    size: z43.number().optional()
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
var getWebDownloadListOkResponseData = z44.lazy(() => {
  return z44.object({
    active: z44.boolean().optional(),
    authId: z44.string().optional(),
    availability: z44.number().optional(),
    createdAt: z44.string().optional(),
    downloadFinished: z44.boolean().optional(),
    downloadPresent: z44.boolean().optional(),
    downloadSpeed: z44.number().optional(),
    downloadState: z44.string().optional(),
    error: z44.string().optional(),
    eta: z44.number().optional(),
    expiresAt: z44.string().optional(),
    files: z44.array(dataFiles5).optional(),
    hash: z44.string().optional(),
    id: z44.number().optional(),
    inactiveCheck: z44.number().optional(),
    name: z44.string().optional(),
    progress: z44.number().optional(),
    server: z44.number().optional(),
    size: z44.number().optional(),
    torrentFile: z44.boolean().optional(),
    updatedAt: z44.string().optional(),
    uploadSpeed: z44.number().optional()
  });
});
var getWebDownloadListOkResponseDataResponse = z44.lazy(() => {
  return z44.object({
    active: z44.boolean().optional(),
    auth_id: z44.string().optional(),
    availability: z44.number().optional(),
    created_at: z44.string().optional(),
    download_finished: z44.boolean().optional(),
    download_present: z44.boolean().optional(),
    download_speed: z44.number().optional(),
    download_state: z44.string().optional(),
    error: z44.string().optional(),
    eta: z44.number().optional(),
    expires_at: z44.string().optional(),
    files: z44.array(dataFiles5Response).optional(),
    hash: z44.string().optional(),
    id: z44.number().optional(),
    inactive_check: z44.number().optional(),
    name: z44.string().optional(),
    progress: z44.number().optional(),
    server: z44.number().optional(),
    size: z44.number().optional(),
    torrent_file: z44.boolean().optional(),
    updated_at: z44.string().optional(),
    upload_speed: z44.number().optional()
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
var getWebDownloadListOkResponseDataRequest = z44.lazy(() => {
  return z44.object({
    active: z44.boolean().optional(),
    authId: z44.string().optional(),
    availability: z44.number().optional(),
    createdAt: z44.string().optional(),
    downloadFinished: z44.boolean().optional(),
    downloadPresent: z44.boolean().optional(),
    downloadSpeed: z44.number().optional(),
    downloadState: z44.string().optional(),
    error: z44.string().optional(),
    eta: z44.number().optional(),
    expiresAt: z44.string().optional(),
    files: z44.array(dataFiles5Request).optional(),
    hash: z44.string().optional(),
    id: z44.number().optional(),
    inactiveCheck: z44.number().optional(),
    name: z44.string().optional(),
    progress: z44.number().optional(),
    server: z44.number().optional(),
    size: z44.number().optional(),
    torrentFile: z44.boolean().optional(),
    updatedAt: z44.string().optional(),
    uploadSpeed: z44.number().optional()
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
var getWebDownloadListOkResponse = z45.lazy(() => {
  return z45.object({
    data: z45.array(getWebDownloadListOkResponseData).optional(),
    detail: z45.string().optional(),
    error: z45.any().optional().nullable(),
    success: z45.boolean().optional()
  });
});
var getWebDownloadListOkResponseResponse = z45.lazy(() => {
  return z45.object({
    data: z45.array(getWebDownloadListOkResponseDataResponse).optional(),
    detail: z45.string().optional(),
    error: z45.any().optional().nullable(),
    success: z45.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getWebDownloadListOkResponseRequest = z45.lazy(() => {
  return z45.object({
    data: z45.array(getWebDownloadListOkResponseDataRequest).optional(),
    detail: z45.string().optional(),
    error: z45.any().optional().nullable(),
    success: z45.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/web-downloads-debrid/models/get-hoster-list-ok-response.ts
import { z as z47 } from "zod";

// src/services/web-downloads-debrid/models/get-hoster-list-ok-response-data.ts
import { z as z46 } from "zod";
var getHosterListOkResponseData = z46.lazy(() => {
  return z46.object({
    dailyBandwidthLimit: z46.number().optional(),
    dailyBandwidthUsed: z46.number().optional(),
    dailyLinkLimit: z46.number().optional(),
    dailyLinkUsed: z46.number().optional(),
    domains: z46.array(z46.string()).optional(),
    domais: z46.array(z46.string()).optional(),
    domaisn: z46.array(z46.string()).optional(),
    icon: z46.string().optional(),
    limit: z46.number().optional(),
    name: z46.string().optional(),
    note: z46.string().optional().nullable(),
    status: z46.boolean().optional(),
    type: z46.string().optional(),
    url: z46.string().optional()
  });
});
var getHosterListOkResponseDataResponse = z46.lazy(() => {
  return z46.object({
    daily_bandwidth_limit: z46.number().optional(),
    daily_bandwidth_used: z46.number().optional(),
    daily_link_limit: z46.number().optional(),
    daily_link_used: z46.number().optional(),
    domains: z46.array(z46.string()).optional(),
    domais: z46.array(z46.string()).optional(),
    domaisn: z46.array(z46.string()).optional(),
    icon: z46.string().optional(),
    limit: z46.number().optional(),
    name: z46.string().optional(),
    note: z46.string().optional().nullable(),
    status: z46.boolean().optional(),
    type: z46.string().optional(),
    url: z46.string().optional()
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
var getHosterListOkResponseDataRequest = z46.lazy(() => {
  return z46.object({
    dailyBandwidthLimit: z46.number().optional(),
    dailyBandwidthUsed: z46.number().optional(),
    dailyLinkLimit: z46.number().optional(),
    dailyLinkUsed: z46.number().optional(),
    domains: z46.array(z46.string()).optional(),
    domais: z46.array(z46.string()).optional(),
    domaisn: z46.array(z46.string()).optional(),
    icon: z46.string().optional(),
    limit: z46.number().optional(),
    name: z46.string().optional(),
    note: z46.string().optional().nullable(),
    status: z46.boolean().optional(),
    type: z46.string().optional(),
    url: z46.string().optional()
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
var getHosterListOkResponse = z47.lazy(() => {
  return z47.object({
    data: z47.array(getHosterListOkResponseData).optional(),
    detail: z47.string().optional(),
    error: z47.any().optional().nullable(),
    success: z47.boolean().optional()
  });
});
var getHosterListOkResponseResponse = z47.lazy(() => {
  return z47.object({
    data: z47.array(getHosterListOkResponseDataResponse).optional(),
    detail: z47.string().optional(),
    error: z47.any().optional().nullable(),
    success: z47.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getHosterListOkResponseRequest = z47.lazy(() => {
  return z47.object({
    data: z47.array(getHosterListOkResponseDataRequest).optional(),
    detail: z47.string().optional(),
    error: z47.any().optional().nullable(),
    success: z47.boolean().optional()
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/webdl/controlwebdownload").setRequestSchema(z48.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z48.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/webdl/requestdl").setRequestSchema(z48.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z48.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/webdl/mylist").setRequestSchema(z48.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/webdl/checkcached").setRequestSchema(z48.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z48.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/webdl/hosters").setRequestSchema(z48.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
import { z as z54 } from "zod";

// src/services/general/models/get-up-status-ok-response.ts
import { z as z49 } from "zod";
var getUpStatusOkResponse = z49.lazy(() => {
  return z49.object({
    data: z49.any().optional().nullable(),
    detail: z49.string().optional(),
    error: z49.any().optional().nullable(),
    success: z49.boolean().optional()
  });
});
var getUpStatusOkResponseResponse = z49.lazy(() => {
  return z49.object({
    data: z49.any().optional().nullable(),
    detail: z49.string().optional(),
    error: z49.any().optional().nullable(),
    success: z49.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getUpStatusOkResponseRequest = z49.lazy(() => {
  return z49.object({
    data: z49.any().optional().nullable(),
    detail: z49.string().optional(),
    error: z49.any().optional().nullable(),
    success: z49.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/general/models/get-stats-ok-response.ts
import { z as z51 } from "zod";

// src/services/general/models/get-stats-ok-response-data.ts
import { z as z50 } from "zod";
var getStatsOkResponseData = z50.lazy(() => {
  return z50.object({
    activeTorrents: z50.number().optional(),
    activeUsenetDownloads: z50.number().optional(),
    activeWebDownloads: z50.number().optional(),
    totalBytesDownloaded: z50.number().optional(),
    totalBytesUploaded: z50.number().optional(),
    totalDownloads: z50.number().optional(),
    totalServers: z50.number().optional(),
    totalTorrentDownloads: z50.number().optional(),
    totalUsenetDownloads: z50.number().optional(),
    totalUsers: z50.number().optional(),
    totalWebDownloads: z50.number().optional()
  });
});
var getStatsOkResponseDataResponse = z50.lazy(() => {
  return z50.object({
    active_torrents: z50.number().optional(),
    active_usenet_downloads: z50.number().optional(),
    active_web_downloads: z50.number().optional(),
    total_bytes_downloaded: z50.number().optional(),
    total_bytes_uploaded: z50.number().optional(),
    total_downloads: z50.number().optional(),
    total_servers: z50.number().optional(),
    total_torrent_downloads: z50.number().optional(),
    total_usenet_downloads: z50.number().optional(),
    total_users: z50.number().optional(),
    total_web_downloads: z50.number().optional()
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
var getStatsOkResponseDataRequest = z50.lazy(() => {
  return z50.object({
    activeTorrents: z50.number().optional(),
    activeUsenetDownloads: z50.number().optional(),
    activeWebDownloads: z50.number().optional(),
    totalBytesDownloaded: z50.number().optional(),
    totalBytesUploaded: z50.number().optional(),
    totalDownloads: z50.number().optional(),
    totalServers: z50.number().optional(),
    totalTorrentDownloads: z50.number().optional(),
    totalUsenetDownloads: z50.number().optional(),
    totalUsers: z50.number().optional(),
    totalWebDownloads: z50.number().optional()
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
var getStatsOkResponse = z51.lazy(() => {
  return z51.object({
    data: getStatsOkResponseData.optional(),
    detail: z51.string().optional(),
    error: z51.boolean().optional(),
    success: z51.boolean().optional()
  });
});
var getStatsOkResponseResponse = z51.lazy(() => {
  return z51.object({
    data: getStatsOkResponseDataResponse.optional(),
    detail: z51.string().optional(),
    error: z51.boolean().optional(),
    success: z51.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getStatsOkResponseRequest = z51.lazy(() => {
  return z51.object({
    data: getStatsOkResponseDataRequest.optional(),
    detail: z51.string().optional(),
    error: z51.boolean().optional(),
    success: z51.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/general/models/get-changelogs-json-ok-response.ts
import { z as z53 } from "zod";

// src/services/general/models/get-changelogs-json-ok-response-data.ts
import { z as z52 } from "zod";
var getChangelogsJsonOkResponseData = z52.lazy(() => {
  return z52.object({
    createdAt: z52.string().optional(),
    html: z52.string().optional(),
    id: z52.string().optional(),
    link: z52.string().optional(),
    markdown: z52.string().optional(),
    name: z52.string().optional()
  });
});
var getChangelogsJsonOkResponseDataResponse = z52.lazy(() => {
  return z52.object({
    created_at: z52.string().optional(),
    html: z52.string().optional(),
    id: z52.string().optional(),
    link: z52.string().optional(),
    markdown: z52.string().optional(),
    name: z52.string().optional()
  }).transform((data) => ({
    createdAt: data["created_at"],
    html: data["html"],
    id: data["id"],
    link: data["link"],
    markdown: data["markdown"],
    name: data["name"]
  }));
});
var getChangelogsJsonOkResponseDataRequest = z52.lazy(() => {
  return z52.object({
    createdAt: z52.string().optional(),
    html: z52.string().optional(),
    id: z52.string().optional(),
    link: z52.string().optional(),
    markdown: z52.string().optional(),
    name: z52.string().optional()
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
var getChangelogsJsonOkResponse = z53.lazy(() => {
  return z53.object({
    data: z53.array(getChangelogsJsonOkResponseData).optional(),
    detail: z53.string().optional(),
    error: z53.any().optional().nullable(),
    success: z53.boolean().optional()
  });
});
var getChangelogsJsonOkResponseResponse = z53.lazy(() => {
  return z53.object({
    data: z53.array(getChangelogsJsonOkResponseDataResponse).optional(),
    detail: z53.string().optional(),
    error: z53.any().optional().nullable(),
    success: z53.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getChangelogsJsonOkResponseRequest = z53.lazy(() => {
  return z53.object({
    data: z53.array(getChangelogsJsonOkResponseDataRequest).optional(),
    detail: z53.string().optional(),
    error: z53.any().optional().nullable(),
    success: z53.boolean().optional()
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/").setRequestSchema(z54.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/stats").setRequestSchema(z54.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/changelogs/rss").setRequestSchema(z54.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z54.string(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/changelogs/json").setRequestSchema(z54.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/speedtest").setRequestSchema(z54.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z54.undefined(),
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
import { z as z58 } from "zod";

// src/services/notifications/models/_10.ts
import { z as z55 } from "zod";
var _10Response = z55.lazy(() => {
  return z55.object({
    data: z55.any().optional().nullable(),
    detail: z55.string().optional(),
    error: z55.any().optional().nullable(),
    success: z55.boolean().optional()
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
import { z as z57 } from "zod";

// src/services/notifications/models/get-notification-feed-ok-response-data.ts
import { z as z56 } from "zod";
var getNotificationFeedOkResponseData = z56.lazy(() => {
  return z56.object({
    authId: z56.string().optional(),
    createdAt: z56.string().optional(),
    id: z56.number().optional(),
    message: z56.string().optional(),
    title: z56.string().optional()
  });
});
var getNotificationFeedOkResponseDataResponse = z56.lazy(() => {
  return z56.object({
    auth_id: z56.string().optional(),
    created_at: z56.string().optional(),
    id: z56.number().optional(),
    message: z56.string().optional(),
    title: z56.string().optional()
  }).transform((data) => ({
    authId: data["auth_id"],
    createdAt: data["created_at"],
    id: data["id"],
    message: data["message"],
    title: data["title"]
  }));
});
var getNotificationFeedOkResponseDataRequest = z56.lazy(() => {
  return z56.object({
    authId: z56.string().optional(),
    createdAt: z56.string().optional(),
    id: z56.number().optional(),
    message: z56.string().optional(),
    title: z56.string().optional()
  }).transform((data) => ({
    auth_id: data["authId"],
    created_at: data["createdAt"],
    id: data["id"],
    message: data["message"],
    title: data["title"]
  }));
});

// src/services/notifications/models/get-notification-feed-ok-response.ts
var getNotificationFeedOkResponse = z57.lazy(() => {
  return z57.object({
    data: z57.array(getNotificationFeedOkResponseData).optional(),
    detail: z57.string().optional(),
    error: z57.any().optional().nullable(),
    success: z57.boolean().optional()
  });
});
var getNotificationFeedOkResponseResponse = z57.lazy(() => {
  return z57.object({
    data: z57.array(getNotificationFeedOkResponseDataResponse).optional(),
    detail: z57.string().optional(),
    error: z57.any().optional().nullable(),
    success: z57.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getNotificationFeedOkResponseRequest = z57.lazy(() => {
  return z57.object({
    data: z57.array(getNotificationFeedOkResponseDataRequest).optional(),
    detail: z57.string().optional(),
    error: z57.any().optional().nullable(),
    success: z57.boolean().optional()
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/notifications/rss").setRequestSchema(z58.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z58.string(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/notifications/mynotifications").setRequestSchema(z58.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/notifications/clear").setRequestSchema(z58.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z58.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/notifications/clear/{notification_id}").setRequestSchema(z58.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z58.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/notifications/test").setRequestSchema(z58.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z58.undefined(),
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
import { z as z67 } from "zod";

// src/services/user/models/_11.ts
import { z as z59 } from "zod";
var _11Response = z59.lazy(() => {
  return z59.object({
    data: z59.any().optional().nullable(),
    detail: z59.string().optional(),
    error: z59.string().optional(),
    success: z59.boolean().optional()
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
import { z as z62 } from "zod";

// src/services/user/models/get-user-data-ok-response-data.ts
import { z as z61 } from "zod";

// src/services/user/models/settings.ts
import { z as z60 } from "zod";
var settings = z60.lazy(() => {
  return z60.object({
    anothersetting: z60.string().optional(),
    setting: z60.string().optional()
  });
});
var settingsResponse = z60.lazy(() => {
  return z60.object({
    anothersetting: z60.string().optional(),
    setting: z60.string().optional()
  }).transform((data) => ({
    anothersetting: data["anothersetting"],
    setting: data["setting"]
  }));
});
var settingsRequest = z60.lazy(() => {
  return z60.object({
    anothersetting: z60.string().optional(),
    setting: z60.string().optional()
  }).transform((data) => ({
    anothersetting: data["anothersetting"],
    setting: data["setting"]
  }));
});

// src/services/user/models/get-user-data-ok-response-data.ts
var getUserDataOkResponseData = z61.lazy(() => {
  return z61.object({
    authId: z61.string().optional(),
    baseEmail: z61.string().optional(),
    cooldownUntil: z61.string().optional(),
    createdAt: z61.string().optional(),
    customer: z61.string().optional(),
    email: z61.string().optional(),
    id: z61.number().optional(),
    isSubscribed: z61.boolean().optional(),
    plan: z61.number().optional(),
    premiumExpiresAt: z61.string().optional(),
    server: z61.number().optional(),
    settings: settings.optional(),
    totalDownloaded: z61.number().optional(),
    updatedAt: z61.string().optional(),
    userReferral: z61.string().optional()
  });
});
var getUserDataOkResponseDataResponse = z61.lazy(() => {
  return z61.object({
    auth_id: z61.string().optional(),
    base_email: z61.string().optional(),
    cooldown_until: z61.string().optional(),
    created_at: z61.string().optional(),
    customer: z61.string().optional(),
    email: z61.string().optional(),
    id: z61.number().optional(),
    is_subscribed: z61.boolean().optional(),
    plan: z61.number().optional(),
    premium_expires_at: z61.string().optional(),
    server: z61.number().optional(),
    settings: settingsResponse.optional(),
    total_downloaded: z61.number().optional(),
    updated_at: z61.string().optional(),
    user_referral: z61.string().optional()
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
var getUserDataOkResponseDataRequest = z61.lazy(() => {
  return z61.object({
    authId: z61.string().optional(),
    baseEmail: z61.string().optional(),
    cooldownUntil: z61.string().optional(),
    createdAt: z61.string().optional(),
    customer: z61.string().optional(),
    email: z61.string().optional(),
    id: z61.number().optional(),
    isSubscribed: z61.boolean().optional(),
    plan: z61.number().optional(),
    premiumExpiresAt: z61.string().optional(),
    server: z61.number().optional(),
    settings: settingsRequest.optional(),
    totalDownloaded: z61.number().optional(),
    updatedAt: z61.string().optional(),
    userReferral: z61.string().optional()
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
var getUserDataOkResponse = z62.lazy(() => {
  return z62.object({
    data: getUserDataOkResponseData.optional(),
    detail: z62.string().optional(),
    error: z62.any().optional().nullable(),
    success: z62.boolean().optional()
  });
});
var getUserDataOkResponseResponse = z62.lazy(() => {
  return z62.object({
    data: getUserDataOkResponseDataResponse.optional(),
    detail: z62.string().optional(),
    error: z62.any().optional().nullable(),
    success: z62.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getUserDataOkResponseRequest = z62.lazy(() => {
  return z62.object({
    data: getUserDataOkResponseDataRequest.optional(),
    detail: z62.string().optional(),
    error: z62.any().optional().nullable(),
    success: z62.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/user/models/add-referral-to-account-ok-response.ts
import { z as z63 } from "zod";
var addReferralToAccountOkResponse = z63.lazy(() => {
  return z63.object({
    data: z63.any().optional().nullable(),
    detail: z63.string().optional(),
    error: z63.any().optional().nullable(),
    success: z63.boolean().optional()
  });
});
var addReferralToAccountOkResponseResponse = z63.lazy(() => {
  return z63.object({
    data: z63.any().optional().nullable(),
    detail: z63.string().optional(),
    error: z63.any().optional().nullable(),
    success: z63.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var addReferralToAccountOkResponseRequest = z63.lazy(() => {
  return z63.object({
    data: z63.any().optional().nullable(),
    detail: z63.string().optional(),
    error: z63.any().optional().nullable(),
    success: z63.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/user/models/_12.ts
import { z as z66 } from "zod";

// src/services/user/models/_13.ts
import { z as z65 } from "zod";

// src/services/user/models/_14.ts
import { z as z64 } from "zod";
var _14 = z64.lazy(() => {
  return z64.object({
    data: z64.string().optional(),
    detail: z64.string().optional()
  });
});
var _14Response = z64.lazy(() => {
  return z64.object({
    data: z64.string().optional(),
    detail: z64.string().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"]
  }));
});
var _14Request = z64.lazy(() => {
  return z64.object({
    data: z64.string().optional(),
    detail: z64.string().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"]
  }));
});

// src/services/user/models/_13.ts
var _13 = z65.lazy(() => {
  return z65.union([z65.string(), _14]);
});
var _13Response = z65.lazy(() => {
  return z65.union([z65.string(), _14Response]);
});
var _13Request = z65.lazy(() => {
  return z65.union([z65.string(), _14Request]);
});

// src/services/user/models/_12.ts
var _12Response = z66.lazy(() => {
  return z66.object({
    data: z66.any().optional().nullable(),
    detail: _13Response.optional(),
    error: z66.string().optional(),
    success: z66.boolean().optional()
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/user/refreshtoken").setRequestSchema(z67.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z67.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/user/me").setRequestSchema(z67.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/user/addreferral").setRequestSchema(z67.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/user/getconfirmation").setRequestSchema(z67.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z67.undefined(),
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
import { z as z68 } from "zod";
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/rss/addrss").setRequestSchema(z68.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z68.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/rss/controlrss").setRequestSchema(z68.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z68.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/rss/modifyrss").setRequestSchema(z68.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z68.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/rss/getfeeds").setRequestSchema(z68.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z68.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/rss/getfeeditems").setRequestSchema(z68.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z68.undefined(),
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
import { z as z76 } from "zod";

// src/services/integrations/models/_15.ts
import { z as z69 } from "zod";
var _15Response = z69.lazy(() => {
  return z69.object({
    data: z69.any().optional().nullable(),
    detail: z69.string().optional(),
    error: z69.string().optional(),
    success: z69.boolean().optional()
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
import { z as z70 } from "zod";
var _16Response = z70.lazy(() => {
  return z70.object({
    data: z70.string().optional(),
    detail: z70.string().optional(),
    error: z70.string().optional(),
    success: z70.boolean().optional()
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
import { z as z72 } from "zod";

// src/services/integrations/models/get-all-jobs-ok-response-data.ts
import { z as z71 } from "zod";
var getAllJobsOkResponseData = z71.lazy(() => {
  return z71.object({
    authId: z71.string().optional(),
    createdAt: z71.string().optional(),
    detail: z71.string().optional(),
    downloadUrl: z71.string().optional().nullable(),
    fileId: z71.number().optional(),
    hash: z71.string().optional(),
    id: z71.number().optional(),
    integration: z71.string().optional(),
    progress: z71.number().optional(),
    status: z71.string().optional(),
    type: z71.string().optional(),
    updatedAt: z71.string().optional(),
    zip: z71.boolean().optional()
  });
});
var getAllJobsOkResponseDataResponse = z71.lazy(() => {
  return z71.object({
    auth_id: z71.string().optional(),
    created_at: z71.string().optional(),
    detail: z71.string().optional(),
    download_url: z71.string().optional().nullable(),
    file_id: z71.number().optional(),
    hash: z71.string().optional(),
    id: z71.number().optional(),
    integration: z71.string().optional(),
    progress: z71.number().optional(),
    status: z71.string().optional(),
    type: z71.string().optional(),
    updated_at: z71.string().optional(),
    zip: z71.boolean().optional()
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
var getAllJobsOkResponseDataRequest = z71.lazy(() => {
  return z71.object({
    authId: z71.string().optional(),
    createdAt: z71.string().optional(),
    detail: z71.string().optional(),
    downloadUrl: z71.string().optional().nullable(),
    fileId: z71.number().optional(),
    hash: z71.string().optional(),
    id: z71.number().optional(),
    integration: z71.string().optional(),
    progress: z71.number().optional(),
    status: z71.string().optional(),
    type: z71.string().optional(),
    updatedAt: z71.string().optional(),
    zip: z71.boolean().optional()
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
var getAllJobsOkResponse = z72.lazy(() => {
  return z72.object({
    data: z72.array(getAllJobsOkResponseData).optional(),
    detail: z72.string().optional(),
    error: z72.any().optional().nullable(),
    success: z72.boolean().optional()
  });
});
var getAllJobsOkResponseResponse = z72.lazy(() => {
  return z72.object({
    data: z72.array(getAllJobsOkResponseDataResponse).optional(),
    detail: z72.string().optional(),
    error: z72.any().optional().nullable(),
    success: z72.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getAllJobsOkResponseRequest = z72.lazy(() => {
  return z72.object({
    data: z72.array(getAllJobsOkResponseDataRequest).optional(),
    detail: z72.string().optional(),
    error: z72.any().optional().nullable(),
    success: z72.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});

// src/services/integrations/models/_17.ts
import { z as z73 } from "zod";
var _17Response = z73.lazy(() => {
  return z73.object({
    data: z73.any().optional().nullable(),
    detail: z73.string().optional(),
    error: z73.string().optional(),
    success: z73.boolean().optional()
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
import { z as z75 } from "zod";

// src/services/integrations/models/get-all-jobs-by-hash-ok-response-data.ts
import { z as z74 } from "zod";
var getAllJobsByHashOkResponseData = z74.lazy(() => {
  return z74.object({
    authId: z74.string().optional(),
    createdAt: z74.string().optional(),
    detail: z74.string().optional(),
    downloadUrl: z74.string().optional().nullable(),
    fileId: z74.number().optional(),
    hash: z74.string().optional(),
    id: z74.number().optional(),
    integration: z74.string().optional(),
    progress: z74.number().optional(),
    status: z74.string().optional(),
    type: z74.string().optional(),
    updatedAt: z74.string().optional(),
    zip: z74.boolean().optional()
  });
});
var getAllJobsByHashOkResponseDataResponse = z74.lazy(() => {
  return z74.object({
    auth_id: z74.string().optional(),
    created_at: z74.string().optional(),
    detail: z74.string().optional(),
    download_url: z74.string().optional().nullable(),
    file_id: z74.number().optional(),
    hash: z74.string().optional(),
    id: z74.number().optional(),
    integration: z74.string().optional(),
    progress: z74.number().optional(),
    status: z74.string().optional(),
    type: z74.string().optional(),
    updated_at: z74.string().optional(),
    zip: z74.boolean().optional()
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
var getAllJobsByHashOkResponseDataRequest = z74.lazy(() => {
  return z74.object({
    authId: z74.string().optional(),
    createdAt: z74.string().optional(),
    detail: z74.string().optional(),
    downloadUrl: z74.string().optional().nullable(),
    fileId: z74.number().optional(),
    hash: z74.string().optional(),
    id: z74.number().optional(),
    integration: z74.string().optional(),
    progress: z74.number().optional(),
    status: z74.string().optional(),
    type: z74.string().optional(),
    updatedAt: z74.string().optional(),
    zip: z74.boolean().optional()
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
var getAllJobsByHashOkResponse = z75.lazy(() => {
  return z75.object({
    data: z75.array(getAllJobsByHashOkResponseData).optional(),
    detail: z75.string().optional(),
    error: z75.any().optional().nullable(),
    success: z75.boolean().optional()
  });
});
var getAllJobsByHashOkResponseResponse = z75.lazy(() => {
  return z75.object({
    data: z75.array(getAllJobsByHashOkResponseDataResponse).optional(),
    detail: z75.string().optional(),
    error: z75.any().optional().nullable(),
    success: z75.boolean().optional()
  }).transform((data) => ({
    data: data["data"],
    detail: data["detail"],
    error: data["error"],
    success: data["success"]
  }));
});
var getAllJobsByHashOkResponseRequest = z75.lazy(() => {
  return z75.object({
    data: z75.array(getAllJobsByHashOkResponseDataRequest).optional(),
    detail: z75.string().optional(),
    error: z75.any().optional().nullable(),
    success: z75.boolean().optional()
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/integration/oauth/{provider}").setRequestSchema(z76.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z76.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/integration/googledrive").setRequestSchema(z76.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z76.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/integration/pixeldrain").setRequestSchema(z76.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z76.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/integration/onedrive").setRequestSchema(z76.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z76.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/integration/gofile").setRequestSchema(z76.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z76.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/integration/1fichier").setRequestSchema(z76.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z76.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/integration/jobs").setRequestSchema(z76.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/integration/job/{job_id}").setRequestSchema(z76.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z76.string(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("DELETE").setPath("/{api_version}/api/integration/job/{job_id}").setRequestSchema(z76.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z76.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/integration/jobs/{hash}").setRequestSchema(z76.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
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
import { z as z77 } from "zod";
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("GET").setPath("/{api_version}/api/queued/getqueued").setRequestSchema(z77.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z77.undefined(),
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
    const request = new RequestBuilder().setBaseUrl((requestConfig == null ? void 0 : requestConfig.baseUrl) || this.config.baseUrl || this.config.environment || "https://api.torbox.app" /* DEFAULT */).setConfig(this.config).setMethod("POST").setPath("/{api_version}/api/queued/controlqueued").setRequestSchema(z77.any()).addAccessTokenAuth(this.config.token, "Bearer").setRequestContentType("json" /* Json */).addResponse({
      schema: z77.undefined(),
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
export {
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
};
