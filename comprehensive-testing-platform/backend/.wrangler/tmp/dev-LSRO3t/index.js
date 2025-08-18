var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// .wrangler/tmp/bundle-f56PAZ/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// node_modules/hono/dist/utils/url.js
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    if (!patternCache[label]) {
      if (match[2]) {
        patternCache[label] = [label, match[1], new RegExp("^" + match[2] + "$")];
      } else {
        patternCache[label] = [label, match[1], true];
      }
    }
    return patternCache[label];
  }
  return null;
}, "getPattern");
var getPath = /* @__PURE__ */ __name((request) => {
  const match = request.url.match(/^https?:\/\/[^/]+(\/[^?]*)/);
  return match ? match[1] : "";
}, "getPath");
var getQueryStrings = /* @__PURE__ */ __name((url) => {
  const queryIndex = url.indexOf("?", 8);
  return queryIndex === -1 ? "" : "?" + url.slice(queryIndex + 1);
}, "getQueryStrings");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result[result.length - 1] === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((...paths) => {
  let p = "";
  let endsWithSlash = false;
  for (let path of paths) {
    if (p[p.length - 1] === "/") {
      p = p.slice(0, -1);
      endsWithSlash = true;
    }
    if (path[0] !== "/") {
      path = `/${path}`;
    }
    if (path === "/" && endsWithSlash) {
      p = `${p}/`;
    } else if (path !== "/") {
      p = `${p}${path}`;
    }
    if (path === "/" && p === "") {
      p = "/";
    }
  }
  return p;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (!path.match(/\:.+\?$/)) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return /%/.test(value) ? decodeURIComponent_(value) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ?? (encoded = /[%+]/.test(url));
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ?? (results[name] = value);
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/utils/cookie.js
var validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
var validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/;
var parse = /* @__PURE__ */ __name((cookie, name) => {
  const pairs = cookie.trim().split(";");
  return pairs.reduce((parsedCookie, pairStr) => {
    pairStr = pairStr.trim();
    const valueStartPos = pairStr.indexOf("=");
    if (valueStartPos === -1) {
      return parsedCookie;
    }
    const cookieName = pairStr.substring(0, valueStartPos).trim();
    if (name && name !== cookieName || !validCookieNameRegEx.test(cookieName)) {
      return parsedCookie;
    }
    let cookieValue = pairStr.substring(valueStartPos + 1).trim();
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
      cookieValue = cookieValue.slice(1, -1);
    }
    if (validCookieValueRegEx.test(cookieValue)) {
      parsedCookie[cookieName] = decodeURIComponent_(cookieValue);
    }
    return parsedCookie;
  }, {});
}, "parse");
var _serialize = /* @__PURE__ */ __name((name, value, opt = {}) => {
  let cookie = `${name}=${value}`;
  if (opt && typeof opt.maxAge === "number" && opt.maxAge >= 0) {
    cookie += `; Max-Age=${Math.floor(opt.maxAge)}`;
  }
  if (opt.domain) {
    cookie += `; Domain=${opt.domain}`;
  }
  if (opt.path) {
    cookie += `; Path=${opt.path}`;
  }
  if (opt.expires) {
    cookie += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly) {
    cookie += "; HttpOnly";
  }
  if (opt.secure) {
    cookie += "; Secure";
  }
  if (opt.sameSite) {
    cookie += `; SameSite=${opt.sameSite}`;
  }
  if (opt.partitioned) {
    cookie += "; Partitioned";
  }
  return cookie;
}, "_serialize");
var serialize = /* @__PURE__ */ __name((name, value, opt = {}) => {
  value = encodeURIComponent(value);
  return _serialize(name, value, opt);
}, "serialize");

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context, buffer) => {
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// node_modules/hono/dist/utils/stream.js
var StreamingApi = class {
  static {
    __name(this, "StreamingApi");
  }
  constructor(writable, _readable) {
    this.abortSubscribers = [];
    this.writable = writable;
    this.writer = writable.getWriter();
    this.encoder = new TextEncoder();
    const reader = _readable.getReader();
    this.responseReadable = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        done ? controller.close() : controller.enqueue(value);
      },
      cancel: /* @__PURE__ */ __name(() => {
        this.abortSubscribers.forEach((subscriber) => subscriber());
      }, "cancel")
    });
  }
  async write(input) {
    try {
      if (typeof input === "string") {
        input = this.encoder.encode(input);
      }
      await this.writer.write(input);
    } catch (e) {
    }
    return this;
  }
  async writeln(input) {
    await this.write(input + "\n");
    return this;
  }
  sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
  async close() {
    try {
      await this.writer.close();
    } catch (e) {
    }
  }
  async pipe(body) {
    this.writer.releaseLock();
    await body.pipeTo(this.writable, { preventClose: true });
    this.writer = this.writable.getWriter();
  }
  async onAbort(listener) {
    this.abortSubscribers.push(listener);
  }
};

// node_modules/hono/dist/context.js
var __accessCheck = /* @__PURE__ */ __name((obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
}, "__accessCheck");
var __privateGet = /* @__PURE__ */ __name((obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
}, "__privateGet");
var __privateAdd = /* @__PURE__ */ __name((obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
}, "__privateAdd");
var __privateSet = /* @__PURE__ */ __name((obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
}, "__privateSet");
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setHeaders = /* @__PURE__ */ __name((headers, map = {}) => {
  Object.entries(map).forEach(([key, value]) => headers.set(key, value));
  return headers;
}, "setHeaders");
var _status;
var _executionCtx;
var _headers;
var _preparedHeaders;
var _res;
var _isFresh;
var Context = class {
  static {
    __name(this, "Context");
  }
  constructor(req, options) {
    this.env = {};
    this._var = {};
    this.finalized = false;
    this.error = void 0;
    __privateAdd(this, _status, 200);
    __privateAdd(this, _executionCtx, void 0);
    __privateAdd(this, _headers, void 0);
    __privateAdd(this, _preparedHeaders, void 0);
    __privateAdd(this, _res, void 0);
    __privateAdd(this, _isFresh, true);
    this.renderer = (content) => this.html(content);
    this.notFoundHandler = () => new Response();
    this.render = (...args) => this.renderer(...args);
    this.setRenderer = (renderer) => {
      this.renderer = renderer;
    };
    this.header = (name, value, options2) => {
      if (value === void 0) {
        if (__privateGet(this, _headers)) {
          __privateGet(this, _headers).delete(name);
        } else if (__privateGet(this, _preparedHeaders)) {
          delete __privateGet(this, _preparedHeaders)[name.toLocaleLowerCase()];
        }
        if (this.finalized) {
          this.res.headers.delete(name);
        }
        return;
      }
      if (options2?.append) {
        if (!__privateGet(this, _headers)) {
          __privateSet(this, _isFresh, false);
          __privateSet(this, _headers, new Headers(__privateGet(this, _preparedHeaders)));
          __privateSet(this, _preparedHeaders, {});
        }
        __privateGet(this, _headers).append(name, value);
      } else {
        if (__privateGet(this, _headers)) {
          __privateGet(this, _headers).set(name, value);
        } else {
          __privateGet(this, _preparedHeaders) ?? __privateSet(this, _preparedHeaders, {});
          __privateGet(this, _preparedHeaders)[name.toLowerCase()] = value;
        }
      }
      if (this.finalized) {
        if (options2?.append) {
          this.res.headers.append(name, value);
        } else {
          this.res.headers.set(name, value);
        }
      }
    };
    this.status = (status) => {
      __privateSet(this, _isFresh, false);
      __privateSet(this, _status, status);
    };
    this.set = (key, value) => {
      this._var ?? (this._var = {});
      this._var[key] = value;
    };
    this.get = (key) => {
      return this._var ? this._var[key] : void 0;
    };
    this.newResponse = (data, arg, headers) => {
      if (__privateGet(this, _isFresh) && !headers && !arg && __privateGet(this, _status) === 200) {
        return new Response(data, {
          headers: __privateGet(this, _preparedHeaders)
        });
      }
      if (arg && typeof arg !== "number") {
        const headers2 = setHeaders(new Headers(arg.headers), __privateGet(this, _preparedHeaders));
        return new Response(data, {
          headers: headers2,
          status: arg.status
        });
      }
      const status = typeof arg === "number" ? arg : __privateGet(this, _status);
      __privateGet(this, _preparedHeaders) ?? __privateSet(this, _preparedHeaders, {});
      __privateGet(this, _headers) ?? __privateSet(this, _headers, new Headers());
      setHeaders(__privateGet(this, _headers), __privateGet(this, _preparedHeaders));
      if (__privateGet(this, _res)) {
        __privateGet(this, _res).headers.forEach((v, k) => {
          __privateGet(this, _headers)?.set(k, v);
        });
        setHeaders(__privateGet(this, _headers), __privateGet(this, _preparedHeaders));
      }
      headers ?? (headers = {});
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          __privateGet(this, _headers).set(k, v);
        } else {
          __privateGet(this, _headers).delete(k);
          for (const v2 of v) {
            __privateGet(this, _headers).append(k, v2);
          }
        }
      }
      return new Response(data, {
        status,
        headers: __privateGet(this, _headers)
      });
    };
    this.body = (data, arg, headers) => {
      return typeof arg === "number" ? this.newResponse(data, arg, headers) : this.newResponse(data, arg);
    };
    this.text = (text, arg, headers) => {
      if (!__privateGet(this, _preparedHeaders)) {
        if (__privateGet(this, _isFresh) && !headers && !arg) {
          return new Response(text);
        }
        __privateSet(this, _preparedHeaders, {});
      }
      __privateGet(this, _preparedHeaders)["content-type"] = TEXT_PLAIN;
      return typeof arg === "number" ? this.newResponse(text, arg, headers) : this.newResponse(text, arg);
    };
    this.json = (object, arg, headers) => {
      const body = JSON.stringify(object);
      __privateGet(this, _preparedHeaders) ?? __privateSet(this, _preparedHeaders, {});
      __privateGet(this, _preparedHeaders)["content-type"] = "application/json; charset=UTF-8";
      return typeof arg === "number" ? this.newResponse(body, arg, headers) : this.newResponse(body, arg);
    };
    this.jsonT = (object, arg, headers) => {
      return this.json(object, arg, headers);
    };
    this.html = (html, arg, headers) => {
      __privateGet(this, _preparedHeaders) ?? __privateSet(this, _preparedHeaders, {});
      __privateGet(this, _preparedHeaders)["content-type"] = "text/html; charset=UTF-8";
      if (typeof html === "object") {
        if (!(html instanceof Promise)) {
          html = html.toString();
        }
        if (html instanceof Promise) {
          return html.then((html2) => resolveCallback(html2, HtmlEscapedCallbackPhase.Stringify, false, {})).then((html2) => {
            return typeof arg === "number" ? this.newResponse(html2, arg, headers) : this.newResponse(html2, arg);
          });
        }
      }
      return typeof arg === "number" ? this.newResponse(html, arg, headers) : this.newResponse(html, arg);
    };
    this.redirect = (location, status = 302) => {
      __privateGet(this, _headers) ?? __privateSet(this, _headers, new Headers());
      __privateGet(this, _headers).set("Location", location);
      return this.newResponse(null, status);
    };
    this.streamText = (cb, arg, headers) => {
      headers ?? (headers = {});
      this.header("content-type", TEXT_PLAIN);
      this.header("x-content-type-options", "nosniff");
      this.header("transfer-encoding", "chunked");
      return this.stream(cb, arg, headers);
    };
    this.stream = (cb, arg, headers) => {
      const { readable, writable } = new TransformStream();
      const stream = new StreamingApi(writable, readable);
      cb(stream).finally(() => stream.close());
      return typeof arg === "number" ? this.newResponse(stream.responseReadable, arg, headers) : this.newResponse(stream.responseReadable, arg);
    };
    this.cookie = (name, value, opt) => {
      const cookie = serialize(name, value, opt);
      this.header("set-cookie", cookie, { append: true });
    };
    this.notFound = () => {
      return this.notFoundHandler(this);
    };
    this.req = req;
    if (options) {
      __privateSet(this, _executionCtx, options.executionCtx);
      this.env = options.env;
      if (options.notFoundHandler) {
        this.notFoundHandler = options.notFoundHandler;
      }
    }
  }
  get event() {
    if (__privateGet(this, _executionCtx) && "respondWith" in __privateGet(this, _executionCtx)) {
      return __privateGet(this, _executionCtx);
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (__privateGet(this, _executionCtx)) {
      return __privateGet(this, _executionCtx);
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    __privateSet(this, _isFresh, false);
    return __privateGet(this, _res) || __privateSet(this, _res, new Response("404 Not Found", { status: 404 }));
  }
  set res(_res2) {
    __privateSet(this, _isFresh, false);
    if (__privateGet(this, _res) && _res2) {
      __privateGet(this, _res).headers.delete("content-type");
      for (const [k, v] of __privateGet(this, _res).headers.entries()) {
        if (k === "set-cookie") {
          const cookies = __privateGet(this, _res).headers.getSetCookie();
          _res2.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res2.headers.append("set-cookie", cookie);
          }
        } else {
          _res2.headers.set(k, v);
        }
      }
    }
    __privateSet(this, _res, _res2);
    this.finalized = true;
  }
  get var() {
    return { ...this._var };
  }
  get runtime() {
    const global = globalThis;
    if (global?.Deno !== void 0) {
      return "deno";
    }
    if (global?.Bun !== void 0) {
      return "bun";
    }
    if (typeof global?.WebSocketPair === "function") {
      return "workerd";
    }
    if (typeof global?.EdgeRuntime === "string") {
      return "edge-light";
    }
    if (global?.fastly !== void 0) {
      return "fastly";
    }
    if (global?.__lagon__ !== void 0) {
      return "lagon";
    }
    if (global?.process?.release?.name === "node") {
      return "node";
    }
    return "other";
  }
};
_status = /* @__PURE__ */ new WeakMap();
_executionCtx = /* @__PURE__ */ new WeakMap();
_headers = /* @__PURE__ */ new WeakMap();
_preparedHeaders = /* @__PURE__ */ new WeakMap();
_res = /* @__PURE__ */ new WeakMap();
_isFresh = /* @__PURE__ */ new WeakMap();

// node_modules/hono/dist/compose.js
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        if (context instanceof Context) {
          context.req.routeIndex = i;
        }
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (!handler) {
        if (context instanceof Context && context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      } else {
        try {
          res = await handler(context, () => {
            return dispatch(i + 1);
          });
        } catch (err) {
          if (err instanceof Error && context instanceof Context && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// node_modules/hono/dist/http-exception.js
var HTTPException = class extends Error {
  static {
    __name(this, "HTTPException");
  }
  constructor(status = 500, options) {
    super(options?.message);
    this.res = options?.res;
    this.status = status;
  }
  getResponse() {
    if (this.res) {
      return this.res;
    }
    return new Response(this.message, {
      status: this.status
    });
  }
};

// node_modules/hono/dist/utils/body.js
var parseBody = /* @__PURE__ */ __name(async (request, options = { all: false }) => {
  const contentType = request.headers.get("Content-Type");
  if (isFormDataContent(contentType)) {
    return parseFormData(request, options);
  }
  return {};
}, "parseBody");
function isFormDataContent(contentType) {
  if (contentType === null) {
    return false;
  }
  return contentType.startsWith("multipart/form-data") || contentType.startsWith("application/x-www-form-urlencoded");
}
__name(isFormDataContent, "isFormDataContent");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = {};
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] && isArrayField(form[key])) {
    appendToExistingArray(form[key], value);
  } else if (form[key]) {
    convertToNewArray(form, key, value);
  } else {
    form[key] = value;
  }
}, "handleParsingAllValues");
function isArrayField(field) {
  return Array.isArray(field);
}
__name(isArrayField, "isArrayField");
var appendToExistingArray = /* @__PURE__ */ __name((arr, value) => {
  arr.push(value);
}, "appendToExistingArray");
var convertToNewArray = /* @__PURE__ */ __name((form, key, value) => {
  form[key] = [form[key], value];
}, "convertToNewArray");

// node_modules/hono/dist/request.js
var __accessCheck2 = /* @__PURE__ */ __name((obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
}, "__accessCheck");
var __privateGet2 = /* @__PURE__ */ __name((obj, member, getter) => {
  __accessCheck2(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
}, "__privateGet");
var __privateAdd2 = /* @__PURE__ */ __name((obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
}, "__privateAdd");
var __privateSet2 = /* @__PURE__ */ __name((obj, member, value, setter) => {
  __accessCheck2(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
}, "__privateSet");
var _validatedData;
var _matchResult;
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  constructor(request, path = "/", matchResult = [[]]) {
    __privateAdd2(this, _validatedData, void 0);
    __privateAdd2(this, _matchResult, void 0);
    this.routeIndex = 0;
    this.bodyCache = {};
    this.cachedBody = (key) => {
      const { bodyCache, raw: raw2 } = this;
      const cachedBody = bodyCache[key];
      if (cachedBody) {
        return cachedBody;
      }
      if (bodyCache.arrayBuffer) {
        return (async () => {
          return await new Response(bodyCache.arrayBuffer)[key]();
        })();
      }
      return bodyCache[key] = raw2[key]();
    };
    this.raw = request;
    this.path = path;
    __privateSet2(this, _matchResult, matchResult);
    __privateSet2(this, _validatedData, {});
  }
  param(key) {
    return key ? this.getDecodedParam(key) : this.getAllDecodedParams();
  }
  getDecodedParam(key) {
    const paramKey = __privateGet2(this, _matchResult)[0][this.routeIndex][1][key];
    const param = this.getParamValue(paramKey);
    return param ? /\%/.test(param) ? decodeURIComponent_(param) : param : void 0;
  }
  getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(__privateGet2(this, _matchResult)[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.getParamValue(__privateGet2(this, _matchResult)[0][this.routeIndex][1][key]);
      if (value && typeof value === "string") {
        decoded[key] = /\%/.test(value) ? decodeURIComponent_(value) : value;
      }
    }
    return decoded;
  }
  getParamValue(paramKey) {
    return __privateGet2(this, _matchResult)[1] ? __privateGet2(this, _matchResult)[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name.toLowerCase()) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  cookie(key) {
    const cookie = this.raw.headers.get("Cookie");
    if (!cookie) {
      return;
    }
    const obj = parse(cookie);
    if (key) {
      const value = obj[key];
      return value;
    } else {
      return obj;
    }
  }
  async parseBody(options) {
    if (this.bodyCache.parsedBody) {
      return this.bodyCache.parsedBody;
    }
    const parsedBody = await parseBody(this, options);
    this.bodyCache.parsedBody = parsedBody;
    return parsedBody;
  }
  json() {
    return this.cachedBody("json");
  }
  text() {
    return this.cachedBody("text");
  }
  arrayBuffer() {
    return this.cachedBody("arrayBuffer");
  }
  blob() {
    return this.cachedBody("blob");
  }
  formData() {
    return this.cachedBody("formData");
  }
  addValidatedData(target, data) {
    __privateGet2(this, _validatedData)[target] = data;
  }
  valid(target) {
    return __privateGet2(this, _validatedData)[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get matchedRoutes() {
    return __privateGet2(this, _matchResult)[0].map(([[, route]]) => route);
  }
  get routePath() {
    return __privateGet2(this, _matchResult)[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
  get headers() {
    return this.raw.headers;
  }
  get body() {
    return this.raw.body;
  }
  get bodyUsed() {
    return this.raw.bodyUsed;
  }
  get integrity() {
    return this.raw.integrity;
  }
  get keepalive() {
    return this.raw.keepalive;
  }
  get referrer() {
    return this.raw.referrer;
  }
  get signal() {
    return this.raw.signal;
  }
};
_validatedData = /* @__PURE__ */ new WeakMap();
_matchResult = /* @__PURE__ */ new WeakMap();

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// node_modules/hono/dist/hono-base.js
var __accessCheck3 = /* @__PURE__ */ __name((obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
}, "__accessCheck");
var __privateGet3 = /* @__PURE__ */ __name((obj, member, getter) => {
  __accessCheck3(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
}, "__privateGet");
var __privateAdd3 = /* @__PURE__ */ __name((obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
}, "__privateAdd");
var __privateSet3 = /* @__PURE__ */ __name((obj, member, value, setter) => {
  __accessCheck3(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
}, "__privateSet");
var COMPOSED_HANDLER = Symbol("composedHandler");
function defineDynamicClass() {
  return class {
  };
}
__name(defineDynamicClass, "defineDynamicClass");
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(err);
  const message = "Internal Server Error";
  return c.text(message, 500);
}, "errorHandler");
var _path;
var _Hono = class extends defineDynamicClass() {
  static {
    __name(this, "_Hono");
  }
  constructor(options = {}) {
    super();
    this._basePath = "/";
    __privateAdd3(this, _path, "/");
    this.routes = [];
    this.notFoundHandler = notFoundHandler;
    this.errorHandler = errorHandler;
    this.onError = (handler) => {
      this.errorHandler = handler;
      return this;
    };
    this.notFound = (handler) => {
      this.notFoundHandler = handler;
      return this;
    };
    this.head = () => {
      console.warn("`app.head()` is no longer used. `app.get()` implicitly handles the HEAD method.");
      return this;
    };
    this.handleEvent = (event) => {
      return this.dispatch(event.request, event, void 0, event.request.method);
    };
    this.fetch = (request, Env, executionCtx) => {
      return this.dispatch(request, executionCtx, Env, request.method);
    };
    this.request = (input, requestInit, Env, executionCtx) => {
      if (input instanceof Request) {
        if (requestInit !== void 0) {
          input = new Request(input, requestInit);
        }
        return this.fetch(input, Env, executionCtx);
      }
      input = input.toString();
      const path = /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`;
      const req = new Request(path, requestInit);
      return this.fetch(req, Env, executionCtx);
    };
    this.fire = () => {
      addEventListener("fetch", (event) => {
        event.respondWith(this.dispatch(event.request, event, void 0, event.request.method));
      });
    };
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.map((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          __privateSet3(this, _path, args1);
        } else {
          this.addRoute(method, __privateGet3(this, _path), args1);
        }
        args.map((handler) => {
          if (typeof handler !== "string") {
            this.addRoute(method, __privateGet3(this, _path), handler);
          }
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      if (!method) {
        return this;
      }
      __privateSet3(this, _path, path);
      for (const m of [method].flat()) {
        handlers.map((handler) => {
          this.addRoute(m.toUpperCase(), __privateGet3(this, _path), handler);
        });
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        __privateSet3(this, _path, arg1);
      } else {
        handlers.unshift(arg1);
      }
      handlers.map((handler) => {
        this.addRoute(METHOD_NAME_ALL, __privateGet3(this, _path), handler);
      });
      return this;
    };
    const strict = options.strict ?? true;
    delete options.strict;
    Object.assign(this, options);
    this.getPath = strict ? options.getPath ?? getPath : getPathNoStrict;
  }
  clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.routes = this.routes;
    return clone;
  }
  route(path, app2) {
    const subApp = this.basePath(path);
    if (!app2) {
      return subApp;
    }
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  showRoutes() {
    const length = 8;
    this.routes.map((route) => {
      console.log(
        `\x1B[32m${route.method}\x1B[0m ${" ".repeat(length - route.method.length)} ${route.path}`
      );
    });
  }
  mount(path, applicationHandler, optionHandler) {
    const mergedPath = mergePath(this._basePath, path);
    const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      const options = optionHandler ? optionHandler(c) : [c.env, executionContext];
      const optionsArray = Array.isArray(options) ? options : [options];
      const queryStrings = getQueryStrings(c.req.url);
      const res = await applicationHandler(
        new Request(
          new URL((c.req.path.slice(pathPrefixLength) || "/") + queryStrings, c.req.url),
          c.req.raw
        ),
        ...optionsArray
      );
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  get routerName() {
    this.matchRoute("GET", "/");
    return this.router.name;
  }
  addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  matchRoute(method, path) {
    return this.router.match(method, path);
  }
  handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.matchRoute(method, path);
    const c = new Context(new HonoRequest(request, path, matchResult), {
      env,
      executionCtx,
      notFoundHandler: this.notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.notFoundHandler(c);
        });
      } catch (err) {
        return this.handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.notFoundHandler(c))
      ).catch((err) => this.handleError(err, c)) : res;
    }
    const composed = compose(matchResult[0], this.errorHandler, this.notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. You may forget returning Response object or `await next()`"
          );
        }
        return context.res;
      } catch (err) {
        return this.handleError(err, c);
      }
    })();
  }
};
var Hono = _Hono;
_path = /* @__PURE__ */ new WeakMap();

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class {
  static {
    __name(this, "Node");
  }
  constructor() {
    this.children = {};
  }
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.children[regexpStr];
      if (!node) {
        if (Object.keys(this.children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.children[regexpStr] = new Node();
        if (name !== "") {
          node.varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.varIndex]);
      }
    } else {
      node = this.children[token];
      if (!node) {
        if (Object.keys(this.children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.children[token] = new Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.children[k];
      return (typeof c.varIndex === "number" ? `(${k})@${c.varIndex}` : k) + c.buildRegExpStr();
    });
    if (typeof this.index === "number") {
      strList.unshift(`#${this.index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  static {
    __name(this, "Trie");
  }
  constructor() {
    this.context = { varIndex: 0 };
    this.root = new Node();
  }
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.root.insert(tokens, index, paramAssoc, this.context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (typeof handlerIndex !== "undefined") {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (typeof paramIndex !== "undefined") {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var methodNames = [METHOD_NAME_ALL, ...METHODS].map((method) => method.toUpperCase());
var emptyParam = [];
var nullMatcher = [/^$/, [], {}];
var wildcardRegExpCache = {};
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ?? (wildcardRegExpCache[path] = new RegExp(
    path === "*" ? "" : `^${path.replace(/\/\*/, "(?:|/.*)")}$`
  ));
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = {};
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = {};
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, {}]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = {};
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  constructor() {
    this.name = "RegExpRouter";
    this.middleware = { [METHOD_NAME_ALL]: {} };
    this.routes = { [METHOD_NAME_ALL]: {} };
  }
  add(method, path, handler) {
    var _a;
    const { middleware, routes } = this;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (methodNames.indexOf(method) === -1) {
      methodNames.push(method);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = {};
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          var _a2;
          (_a2 = middleware[m])[path] || (_a2[path] = findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || []);
        });
      } else {
        (_a = middleware[method])[path] || (_a[path] = findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || []);
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        var _a2;
        if (method === METHOD_NAME_ALL || method === m) {
          (_a2 = routes[m])[path2] || (_a2[path2] = [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ]);
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = this.buildAllMatchers();
    this.match = (method2, path2) => {
      const matcher = matchers[method2];
      const staticMatch = matcher[2][path2];
      if (staticMatch) {
        return staticMatch;
      }
      const match = path2.match(matcher[0]);
      if (!match) {
        return [[], emptyParam];
      }
      const index = match.indexOf("", 1);
      return [matcher[1][index], match];
    };
    return this.match(method, path);
  }
  buildAllMatchers() {
    const matchers = {};
    methodNames.forEach((method) => {
      matchers[method] = this.buildMatcher(method) || matchers[METHOD_NAME_ALL];
    });
    this.middleware = this.routes = void 0;
    return matchers;
  }
  buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.middleware, this.routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute || (hasOwnRoute = true);
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  constructor(init) {
    this.name = "SmartRouter";
    this.routers = [];
    this.routes = [];
    Object.assign(this, init);
  }
  add(method, path, handler) {
    if (!this.routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.routes) {
      throw new Error("Fatal error");
    }
    const { routers, routes } = this;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        routes.forEach((args) => {
          router.add(...args);
        });
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.routers = [router];
      this.routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.routes || this.routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var Node2 = class {
  static {
    __name(this, "Node");
  }
  constructor(method, handler, children) {
    this.order = 0;
    this.params = {};
    this.children = children || {};
    this.methods = [];
    this.name = "";
    if (method && handler) {
      const m = {};
      m[method] = { handler, possibleKeys: [], score: 0, name: this.name };
      this.methods = [m];
    }
    this.patterns = [];
  }
  insert(method, path, handler) {
    this.name = `${method} ${path}`;
    this.order = ++this.order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    const parentPatterns = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      if (Object.keys(curNode.children).includes(p)) {
        parentPatterns.push(...curNode.patterns);
        curNode = curNode.children[p];
        const pattern2 = getPattern(p);
        if (pattern2) {
          possibleKeys.push(pattern2[1]);
        }
        continue;
      }
      curNode.children[p] = new Node2();
      const pattern = getPattern(p);
      if (pattern) {
        curNode.patterns.push(pattern);
        parentPatterns.push(...curNode.patterns);
        possibleKeys.push(pattern[1]);
      }
      parentPatterns.push(...curNode.patterns);
      curNode = curNode.children[p];
    }
    if (!curNode.methods.length) {
      curNode.methods = [];
    }
    const m = {};
    const handlerSet = {
      handler,
      possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
      name: this.name,
      score: this.order
    };
    m[method] = handlerSet;
    curNode.methods.push(m);
    return curNode;
  }
  gHSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.methods.length; i < len; i++) {
      const m = node.methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = {};
        handlerSet.possibleKeys.forEach((key) => {
          const processed = processedSet[handlerSet.name];
          handlerSet.params[key] = params[key] && !processed ? params[key] : nodeParams[key] ?? params[key];
          processedSet[handlerSet.name] = true;
        });
        handlerSets.push(handlerSet);
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.params = {};
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.children[part];
        if (nextNode) {
          nextNode.params = node.params;
          if (isLast === true) {
            if (nextNode.children["*"]) {
              handlerSets.push(...this.gHSets(nextNode.children["*"], method, node.params, {}));
            }
            handlerSets.push(...this.gHSets(nextNode, method, node.params, {}));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.patterns.length; k < len3; k++) {
          const pattern = node.patterns[k];
          const params = { ...node.params };
          if (pattern === "*") {
            const astNode = node.children["*"];
            if (astNode) {
              handlerSets.push(...this.gHSets(astNode, method, node.params, {}));
              tempNodes.push(astNode);
            }
            continue;
          }
          if (part === "") {
            continue;
          }
          const [key, name, matcher] = pattern;
          const child = node.children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp && matcher.test(restPathString)) {
            params[name] = restPathString;
            handlerSets.push(...this.gHSets(child, method, node.params, params));
            continue;
          }
          if (matcher === true || matcher instanceof RegExp && matcher.test(part)) {
            if (typeof key === "string") {
              params[name] = part;
              if (isLast === true) {
                handlerSets.push(...this.gHSets(child, method, params, node.params));
                if (child.children["*"]) {
                  handlerSets.push(...this.gHSets(child.children["*"], method, params, node.params));
                }
              } else {
                child.params = params;
                tempNodes.push(child);
              }
            }
          }
        }
      }
      curNodes = tempNodes;
    }
    const results = handlerSets.sort((a, b) => {
      return a.score - b.score;
    });
    return [results.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  constructor() {
    this.name = "TrieRouter";
    this.node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (const p of results) {
        this.node.insert(method, p, handler);
      }
      return;
    }
    this.node.insert(method, path, handler);
  }
  match(method, path) {
    return this.node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/middleware/cors/index.js
var cors = /* @__PURE__ */ __name((options) => {
  const defaults = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      return () => optsOrigin;
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : optsOrigin[0];
    }
  })(opts.origin);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = findAllowOrigin(c.req.header("origin") || "");
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.origin !== "*") {
      set("Vary", "Origin");
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      if (opts.allowMethods?.length) {
        set("Access-Control-Allow-Methods", opts.allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: c.res.statusText
      });
    }
    await next();
  }, "cors2");
}, "cors");

// node_modules/hono/dist/middleware/logger/index.js
var humanize = /* @__PURE__ */ __name((times) => {
  const [delimiter, separator] = [",", "."];
  const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter));
  return orderTimes.join(separator);
}, "humanize");
var time = /* @__PURE__ */ __name((start) => {
  const delta = Date.now() - start;
  return humanize([delta < 1e3 ? delta + "ms" : Math.round(delta / 1e3) + "s"]);
}, "time");
var colorStatus = /* @__PURE__ */ __name((status) => {
  const out = {
    7: `\x1B[35m${status}\x1B[0m`,
    5: `\x1B[31m${status}\x1B[0m`,
    4: `\x1B[33m${status}\x1B[0m`,
    3: `\x1B[36m${status}\x1B[0m`,
    2: `\x1B[32m${status}\x1B[0m`,
    1: `\x1B[32m${status}\x1B[0m`,
    0: `\x1B[33m${status}\x1B[0m`
  };
  const calculateStatus = status / 100 | 0;
  return out[calculateStatus];
}, "colorStatus");
function log(fn, prefix, method, path, status = 0, elapsed) {
  const out = prefix === "<--" ? `  ${prefix} ${method} ${path}` : `  ${prefix} ${method} ${path} ${colorStatus(status)} ${elapsed}`;
  fn(out);
}
__name(log, "log");
var logger = /* @__PURE__ */ __name((fn = console.log) => {
  return /* @__PURE__ */ __name(async function logger2(c, next) {
    const { method } = c.req;
    const path = getPath(c.req.raw);
    log(fn, "<--", method, path);
    const start = Date.now();
    await next();
    log(fn, "-->", method, path, c.res.status, time(start));
  }, "logger2");
}, "logger");

// node_modules/hono/dist/middleware/secure-headers/index.js
var HEADERS_MAP = {
  crossOriginEmbedderPolicy: ["Cross-Origin-Embedder-Policy", "require-corp"],
  crossOriginResourcePolicy: ["Cross-Origin-Resource-Policy", "same-origin"],
  crossOriginOpenerPolicy: ["Cross-Origin-Opener-Policy", "same-origin"],
  originAgentCluster: ["Origin-Agent-Cluster", "?1"],
  referrerPolicy: ["Referrer-Policy", "no-referrer"],
  strictTransportSecurity: ["Strict-Transport-Security", "max-age=15552000; includeSubDomains"],
  xContentTypeOptions: ["X-Content-Type-Options", "nosniff"],
  xDnsPrefetchControl: ["X-DNS-Prefetch-Control", "off"],
  xDownloadOptions: ["X-Download-Options", "noopen"],
  xFrameOptions: ["X-Frame-Options", "SAMEORIGIN"],
  xPermittedCrossDomainPolicies: ["X-Permitted-Cross-Domain-Policies", "none"],
  xXssProtection: ["X-XSS-Protection", "0"]
};
var DEFAULT_OPTIONS = {
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: true,
  crossOriginOpenerPolicy: true,
  originAgentCluster: true,
  referrerPolicy: true,
  strictTransportSecurity: true,
  xContentTypeOptions: true,
  xDnsPrefetchControl: true,
  xDownloadOptions: true,
  xFrameOptions: true,
  xPermittedCrossDomainPolicies: true,
  xXssProtection: true
};
var secureHeaders = /* @__PURE__ */ __name((customOptions) => {
  const options = { ...DEFAULT_OPTIONS, ...customOptions };
  const headersToSet = getFilteredHeaders(options);
  if (options.contentSecurityPolicy) {
    headersToSet.push(["Content-Security-Policy", getCSPDirectives(options.contentSecurityPolicy)]);
  }
  if (options.reportingEndpoints) {
    headersToSet.push(["Reporting-Endpoints", getReportingEndpoints(options.reportingEndpoints)]);
  }
  if (options.reportTo) {
    headersToSet.push(["Report-To", getReportToOptions(options.reportTo)]);
  }
  return /* @__PURE__ */ __name(async function secureHeaders2(ctx, next) {
    await next();
    setHeaders2(ctx, headersToSet);
    ctx.res.headers.delete("X-Powered-By");
  }, "secureHeaders2");
}, "secureHeaders");
function getFilteredHeaders(options) {
  return Object.entries(HEADERS_MAP).filter(([key]) => options[key]).map(([key, defaultValue]) => {
    const overrideValue = options[key];
    return typeof overrideValue === "string" ? [defaultValue[0], overrideValue] : defaultValue;
  });
}
__name(getFilteredHeaders, "getFilteredHeaders");
function getCSPDirectives(contentSecurityPolicy) {
  return Object.entries(contentSecurityPolicy || []).map(([directive, value]) => {
    const kebabCaseDirective = directive.replace(
      /[A-Z]+(?![a-z])|[A-Z]/g,
      (match, offset) => offset ? "-" + match.toLowerCase() : match.toLowerCase()
    );
    return `${kebabCaseDirective} ${Array.isArray(value) ? value.join(" ") : value}`;
  }).join("; ");
}
__name(getCSPDirectives, "getCSPDirectives");
function getReportingEndpoints(reportingEndpoints = []) {
  return reportingEndpoints.map((endpoint) => `${endpoint.name}="${endpoint.url}"`).join(", ");
}
__name(getReportingEndpoints, "getReportingEndpoints");
function getReportToOptions(reportTo = []) {
  return reportTo.map((option) => JSON.stringify(option)).join(", ");
}
__name(getReportToOptions, "getReportToOptions");
function setHeaders2(ctx, headersToSet) {
  headersToSet.forEach(([header, value]) => {
    ctx.res.headers.set(header, value);
  });
}
__name(setHeaders2, "setHeaders");

// src/middleware/errorHandler.ts
var AppError = class extends Error {
  static {
    __name(this, "AppError");
  }
  statusCode;
  isOperational;
  code;
  constructor(message, statusCode = 500, code, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
  }
};
var errorHandler2 = /* @__PURE__ */ __name((err, c) => {
  return handleError(err, c);
}, "errorHandler");
function handleError(error, c) {
  logError(error, c);
  const { body, status } = formatErrorResponse(error);
  c.status(status);
  c.header("Content-Type", "application/json");
  return c.json(body);
}
__name(handleError, "handleError");
function logError(error, c) {
  const requestId = c.get("requestId") || "unknown";
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const url = c.req.url;
  const method = c.req.method;
  const userAgent = c.req.header("User-Agent") || "unknown";
  const ip = c.req.header("CF-Connecting-IP") || c.req.header("X-Forwarded-For") || "unknown";
  const errorLog = {
    timestamp,
    requestId,
    url,
    method,
    userAgent,
    ip,
    error: {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : void 0,
      code: error instanceof AppError ? error.code : void 0
    }
  };
  if (error instanceof AppError && error.isOperational) {
    console.warn("Operational Error:", errorLog);
  } else {
    console.error("System Error:", errorLog);
  }
  sendErrorToMonitoring(errorLog);
}
__name(logError, "logError");
function formatErrorResponse(error) {
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      body: {
        success: false,
        error: error.message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: "unknown"
      }
    };
  }
  if (error instanceof Error) {
    return {
      status: 500,
      body: {
        success: false,
        error: error.message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: "unknown"
      }
    };
  }
  return {
    status: 500,
    body: {
      success: false,
      error: "An unexpected error occurred",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: "unknown"
    }
  };
}
__name(formatErrorResponse, "formatErrorResponse");
async function sendErrorToMonitoring(_errorLog) {
  try {
    return;
  } catch (e) {
  }
}
__name(sendErrorToMonitoring, "sendErrorToMonitoring");

// ../shared/types/errors.ts
var ModuleError = class extends Error {
  constructor(message, code, statusCode = 500, details) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = "ModuleError";
  }
  static {
    __name(this, "ModuleError");
  }
};
var ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  TEST_NOT_FOUND: "TEST_NOT_FOUND",
  CALCULATION_ERROR: "CALCULATION_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  RATE_LIMITED: "RATE_LIMITED",
  NOT_FOUND: "NOT_FOUND"
};

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  __name(assertIs, "assertIs");
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  __name(assertNever, "assertNever");
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  __name(joinValues, "joinValues");
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = /* @__PURE__ */ __name((data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
}, "getParsedType");

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = /* @__PURE__ */ __name((obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
}, "quotelessJson");
var ZodError = class _ZodError extends Error {
  static {
    __name(this, "ZodError");
  }
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = /* @__PURE__ */ __name((error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }, "processError");
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/zod/v3/locales/en.js
var errorMap = /* @__PURE__ */ __name((issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
}, "errorMap");
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
__name(setErrorMap, "setErrorMap");
function getErrorMap() {
  return overrideErrorMap;
}
__name(getErrorMap, "getErrorMap");

// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = /* @__PURE__ */ __name((params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
}, "makeIssue");
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
__name(addIssueToContext, "addIssueToContext");
var ParseStatus = class _ParseStatus {
  static {
    __name(this, "ParseStatus");
  }
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = /* @__PURE__ */ __name((value) => ({ status: "dirty", value }), "DIRTY");
var OK = /* @__PURE__ */ __name((value) => ({ status: "valid", value }), "OK");
var isAborted = /* @__PURE__ */ __name((x) => x.status === "aborted", "isAborted");
var isDirty = /* @__PURE__ */ __name((x) => x.status === "dirty", "isDirty");
var isValid = /* @__PURE__ */ __name((x) => x.status === "valid", "isValid");
var isAsync = /* @__PURE__ */ __name((x) => typeof Promise !== "undefined" && x instanceof Promise, "isAsync");

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  static {
    __name(this, "ParseInputLazyPath");
  }
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = /* @__PURE__ */ __name((ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
}, "handleResult");
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = /* @__PURE__ */ __name((iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  }, "customMap");
  return { errorMap: customMap, description };
}
__name(processCreateParams, "processCreateParams");
var ZodType = class {
  static {
    __name(this, "ZodType");
  }
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = /* @__PURE__ */ __name((val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    }, "getIssueProperties");
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = /* @__PURE__ */ __name(() => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      }), "setError");
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: /* @__PURE__ */ __name((data) => this["~validate"](data), "validate")
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
__name(timeRegexSource, "timeRegexSource");
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
__name(timeRegex, "timeRegex");
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
__name(datetimeRegex, "datetimeRegex");
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
__name(isValidIP, "isValidIP");
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
__name(isValidJWT, "isValidJWT");
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
__name(isValidCidr, "isValidCidr");
var ZodString = class _ZodString extends ZodType {
  static {
    __name(this, "ZodString");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
__name(floatSafeRemainder, "floatSafeRemainder");
var ZodNumber = class _ZodNumber extends ZodType {
  static {
    __name(this, "ZodNumber");
  }
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  static {
    __name(this, "ZodBigInt");
  }
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  static {
    __name(this, "ZodBoolean");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  static {
    __name(this, "ZodDate");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  static {
    __name(this, "ZodSymbol");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  static {
    __name(this, "ZodUndefined");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  static {
    __name(this, "ZodNull");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  static {
    __name(this, "ZodAny");
  }
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  static {
    __name(this, "ZodUnknown");
  }
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  static {
    __name(this, "ZodNever");
  }
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  static {
    __name(this, "ZodVoid");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  static {
    __name(this, "ZodArray");
  }
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: /* @__PURE__ */ __name(() => newShape, "shape")
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
__name(deepPartialify, "deepPartialify");
var ZodObject = class _ZodObject extends ZodType {
  static {
    __name(this, "ZodObject");
  }
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: /* @__PURE__ */ __name((issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }, "errorMap")
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => ({
        ...this._def.shape(),
        ...augmentation
      }), "shape")
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: /* @__PURE__ */ __name(() => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }), "shape"),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => shape, "shape")
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => shape, "shape")
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => newShape, "shape")
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => newShape, "shape")
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: /* @__PURE__ */ __name(() => shape, "shape"),
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: /* @__PURE__ */ __name(() => shape, "shape"),
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  static {
    __name(this, "ZodUnion");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    __name(handleResults, "handleResults");
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = /* @__PURE__ */ __name((type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
}, "getDiscriminator");
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  static {
    __name(this, "ZodDiscriminatedUnion");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
__name(mergeValues, "mergeValues");
var ZodIntersection = class extends ZodType {
  static {
    __name(this, "ZodIntersection");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = /* @__PURE__ */ __name((parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    }, "handleParsed");
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  static {
    __name(this, "ZodTuple");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  static {
    __name(this, "ZodRecord");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  static {
    __name(this, "ZodMap");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  static {
    __name(this, "ZodSet");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    __name(finalizeSet, "finalizeSet");
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  static {
    __name(this, "ZodFunction");
  }
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    __name(makeArgsIssue, "makeArgsIssue");
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    __name(makeReturnsIssue, "makeReturnsIssue");
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  static {
    __name(this, "ZodLazy");
  }
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  static {
    __name(this, "ZodLiteral");
  }
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
__name(createZodEnum, "createZodEnum");
var ZodEnum = class _ZodEnum extends ZodType {
  static {
    __name(this, "ZodEnum");
  }
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  static {
    __name(this, "ZodNativeEnum");
  }
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  static {
    __name(this, "ZodPromise");
  }
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  static {
    __name(this, "ZodEffects");
  }
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: /* @__PURE__ */ __name((arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      }, "addIssue"),
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = /* @__PURE__ */ __name((acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      }, "executeRefinement");
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  static {
    __name(this, "ZodOptional");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  static {
    __name(this, "ZodNullable");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  static {
    __name(this, "ZodDefault");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  static {
    __name(this, "ZodCatch");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  static {
    __name(this, "ZodNaN");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  static {
    __name(this, "ZodBranded");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  static {
    __name(this, "ZodPipeline");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = /* @__PURE__ */ __name(async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      }, "handleAsync");
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  static {
    __name(this, "ZodReadonly");
  }
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = /* @__PURE__ */ __name((data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    }, "freeze");
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
__name(cleanParams, "cleanParams");
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
__name(custom, "custom");
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = /* @__PURE__ */ __name((cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params), "instanceOfType");
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = /* @__PURE__ */ __name(() => stringType().optional(), "ostring");
var onumber = /* @__PURE__ */ __name(() => numberType().optional(), "onumber");
var oboolean = /* @__PURE__ */ __name(() => booleanType().optional(), "oboolean");
var coerce = {
  string: /* @__PURE__ */ __name((arg) => ZodString.create({ ...arg, coerce: true }), "string"),
  number: /* @__PURE__ */ __name((arg) => ZodNumber.create({ ...arg, coerce: true }), "number"),
  boolean: /* @__PURE__ */ __name((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }), "boolean"),
  bigint: /* @__PURE__ */ __name((arg) => ZodBigInt.create({ ...arg, coerce: true }), "bigint"),
  date: /* @__PURE__ */ __name((arg) => ZodDate.create({ ...arg, coerce: true }), "date")
};
var NEVER = INVALID;

// src/services/ValidationService.ts
var ValidationService = class {
  static {
    __name(this, "ValidationService");
  }
  // 基础验证模式
  static baseSchemas = {
    uuid: external_exports.string().uuid("Invalid UUID format"),
    email: external_exports.string().email("Invalid email format"),
    url: external_exports.string().url("Invalid URL format"),
    date: external_exports.string().datetime("Invalid date format"),
    positiveInteger: external_exports.number().int().positive("Must be a positive integer"),
    nonEmptyString: external_exports.string().min(1, "String cannot be empty"),
    optionalString: external_exports.string().optional()
  };
  // 测试相关验证模式
  static testSchemas = {
    testType: external_exports.enum([
      "psychology",
      "astrology",
      "tarot",
      "career",
      "learning",
      "relationship",
      "numerology"
    ]),
    testSubtype: external_exports.object({
      psychology: external_exports.enum(["mbti", "big_five", "phq9", "happiness"]),
      astrology: external_exports.enum(["basic", "detailed", "compatibility"]),
      tarot: external_exports.enum(["single", "three_card", "celtic_cross", "relationship", "career"]),
      career: external_exports.enum(["holland", "career_values", "skills_assessment"]),
      learning: external_exports.enum(["vark", "raven", "learning_strategies"]),
      relationship: external_exports.enum(["love_languages", "attachment_style", "relationship_skills"]),
      numerology: external_exports.enum(["basic", "detailed", "compatibility"])
    }),
    testSubmission: external_exports.object({
      testType: external_exports.string().min(1),
      answers: external_exports.array(external_exports.any()).min(1),
      userInfo: external_exports.object({
        userAgent: external_exports.string().optional(),
        timestamp: external_exports.string().optional()
      }).optional()
    }),
    testResult: external_exports.object({
      sessionId: this.baseSchemas.uuid,
      testType: external_exports.string(),
      scores: external_exports.record(external_exports.number()),
      interpretation: external_exports.string(),
      recommendations: external_exports.array(external_exports.string()),
      completedAt: this.baseSchemas.date
    })
  };
  // 用户反馈验证模式
  static feedbackSchemas = {
    feedback: external_exports.object({
      sessionId: this.baseSchemas.uuid,
      feedback: external_exports.enum(["like", "dislike"]),
      comment: external_exports.string().max(500).optional(),
      rating: external_exports.number().int().min(1).max(5).optional()
    })
  };
  // 博客相关验证模式
  static blogSchemas = {
    article: external_exports.object({
      title: external_exports.string().min(1).max(200),
      content: external_exports.string().min(1),
      excerpt: external_exports.string().max(300).optional(),
      category: external_exports.string().optional(),
      tags: external_exports.array(external_exports.string()).optional(),
      isPublished: external_exports.boolean().optional(),
      isFeatured: external_exports.boolean().optional()
    }),
    articleUpdate: external_exports.object({
      title: external_exports.string().min(1).max(200).optional(),
      content: external_exports.string().min(1).optional(),
      excerpt: external_exports.string().max(300).optional(),
      category: external_exports.string().optional(),
      tags: external_exports.array(external_exports.string()).optional(),
      isPublished: external_exports.boolean().optional(),
      isFeatured: external_exports.boolean().optional()
    })
  };
  // 分析事件验证模式
  static analyticsSchemas = {
    event: external_exports.object({
      eventType: external_exports.string().min(1),
      eventData: external_exports.record(external_exports.any()).optional(),
      sessionId: this.baseSchemas.uuid.optional(),
      userAgent: external_exports.string().optional()
    })
  };
  // 模块专用验证模式
  static moduleSchemas = {
    psychology: external_exports.object({
      testSessionId: this.baseSchemas.uuid,
      testSubtype: external_exports.enum(["mbti", "big_five", "phq9", "happiness"]),
      personalityType: external_exports.string().optional(),
      dimensionScores: external_exports.record(external_exports.number()).optional(),
      riskLevel: external_exports.enum(["minimal", "mild", "moderate", "moderately_severe", "severe"]).optional(),
      happinessDomains: external_exports.record(external_exports.number()).optional()
    }),
    astrology: external_exports.object({
      testSessionId: this.baseSchemas.uuid,
      birthDate: external_exports.date(),
      birthTime: external_exports.string().optional(),
      birthLocation: external_exports.string().optional(),
      sunSign: external_exports.string().min(1),
      moonSign: external_exports.string().optional(),
      risingSign: external_exports.string().optional(),
      planetaryPositions: external_exports.record(external_exports.any()).optional(),
      housePositions: external_exports.record(external_exports.any()).optional(),
      aspects: external_exports.record(external_exports.any()).optional()
    }),
    tarot: external_exports.object({
      testSessionId: this.baseSchemas.uuid,
      spreadType: external_exports.enum(["single", "three_card", "celtic_cross", "relationship", "career"]),
      cardsDrawn: external_exports.array(external_exports.object({
        id: external_exports.string(),
        name: external_exports.string(),
        suit: external_exports.string().optional(),
        number: external_exports.number().optional(),
        isReversed: external_exports.boolean(),
        meaning: external_exports.string(),
        reversedMeaning: external_exports.string().optional()
      })),
      cardPositions: external_exports.record(external_exports.any()).optional(),
      interpretationTheme: external_exports.string().optional(),
      questionCategory: external_exports.enum(["love", "career", "finance", "health", "spiritual", "general"]).optional()
    }),
    career: external_exports.object({
      testSessionId: this.baseSchemas.uuid,
      testSubtype: external_exports.enum(["holland", "career_values", "skills_assessment"]),
      hollandCode: external_exports.string().optional(),
      interestScores: external_exports.record(external_exports.number()).optional(),
      valuesRanking: external_exports.array(external_exports.string()).optional(),
      skillsProfile: external_exports.record(external_exports.number()).optional(),
      careerMatches: external_exports.array(external_exports.object({
        title: external_exports.string(),
        matchScore: external_exports.number(),
        description: external_exports.string(),
        requirements: external_exports.array(external_exports.string())
      })).optional()
    }),
    learning: external_exports.object({
      testSessionId: this.baseSchemas.uuid,
      testSubtype: external_exports.enum(["vark", "raven", "learning_strategies"]),
      learningStyle: external_exports.enum(["visual", "auditory", "reading", "kinesthetic", "multimodal"]).optional(),
      cognitiveScore: external_exports.number().optional(),
      percentileRank: external_exports.number().min(0).max(100).optional(),
      learningPreferences: external_exports.record(external_exports.number()).optional(),
      strategyRecommendations: external_exports.array(external_exports.string()).optional()
    }),
    relationship: external_exports.object({
      testSessionId: this.baseSchemas.uuid,
      testSubtype: external_exports.enum(["love_languages", "attachment_style", "relationship_skills"]),
      primaryLoveLanguage: external_exports.enum(["words_of_affirmation", "acts_of_service", "receiving_gifts", "quality_time", "physical_touch"]).optional(),
      secondaryLoveLanguage: external_exports.enum(["words_of_affirmation", "acts_of_service", "receiving_gifts", "quality_time", "physical_touch"]).optional(),
      attachmentStyle: external_exports.enum(["secure", "anxious", "avoidant", "disorganized"]).optional(),
      relationshipSkills: external_exports.record(external_exports.number()).optional(),
      communicationStyle: external_exports.enum(["assertive", "passive", "aggressive", "passive_aggressive"]).optional()
    }),
    numerology: external_exports.object({
      testSessionId: this.baseSchemas.uuid,
      birthDate: external_exports.date(),
      fullName: external_exports.string().min(1),
      lifePathNumber: external_exports.number().int().min(1).max(9),
      destinyNumber: external_exports.number().int().min(1).max(9),
      soulUrgeNumber: external_exports.number().int().min(1).max(9),
      personalityNumber: external_exports.number().int().min(1).max(9),
      birthDayNumber: external_exports.number().int().min(1).max(31),
      numerologyChart: external_exports.record(external_exports.any())
    })
  };
  /**
   * 验证测试提交数据
   */
  static validateTestSubmission(data) {
    try {
      return this.testSchemas.testSubmission.parse(data);
    } catch (error) {
      if (error instanceof external_exports.ZodError) {
        throw new ModuleError(
          "Invalid test submission data",
          ERROR_CODES.VALIDATION_ERROR,
          400,
          error.errors
        );
      }
      throw error;
    }
  }
  /**
   * 验证用户反馈数据
   */
  static validateFeedback(data) {
    try {
      return this.feedbackSchemas.feedback.parse(data);
    } catch (error) {
      if (error instanceof external_exports.ZodError) {
        throw new ModuleError(
          "Invalid feedback data",
          ERROR_CODES.VALIDATION_ERROR,
          400,
          error.errors
        );
      }
      throw error;
    }
  }
  /**
   * 验证博客文章数据
   */
  static validateBlogArticle(data) {
    try {
      return this.blogSchemas.article.parse(data);
    } catch (error) {
      if (error instanceof external_exports.ZodError) {
        throw new ModuleError(
          "Invalid blog article data",
          ERROR_CODES.VALIDATION_ERROR,
          400,
          error.errors
        );
      }
      throw error;
    }
  }
  /**
   * 验证分析事件数据
   */
  static validateAnalyticsEvent(data) {
    try {
      return this.analyticsSchemas.event.parse(data);
    } catch (error) {
      if (error instanceof external_exports.ZodError) {
        throw new ModuleError(
          "Invalid analytics event data",
          ERROR_CODES.VALIDATION_ERROR,
          400,
          error.errors
        );
      }
      throw error;
    }
  }
  /**
   * 验证模块专用会话数据
   */
  static validateModuleSession(module, data) {
    try {
      const schema = this.moduleSchemas[module];
      if (!schema) {
        throw new ModuleError(
          `Unknown module: ${module}`,
          ERROR_CODES.VALIDATION_ERROR,
          400
        );
      }
      return schema.parse(data);
    } catch (error) {
      if (error instanceof external_exports.ZodError) {
        throw new ModuleError(
          `Invalid ${module} session data`,
          ERROR_CODES.VALIDATION_ERROR,
          400,
          error.errors
        );
      }
      throw error;
    }
  }
  /**
   * 验证UUID格式
   */
  static validateUUID(uuid) {
    try {
      return this.baseSchemas.uuid.parse(uuid);
    } catch (error) {
      if (error instanceof external_exports.ZodError) {
        throw new ModuleError(
          "Invalid UUID format",
          ERROR_CODES.VALIDATION_ERROR,
          400,
          error.errors
        );
      }
      throw error;
    }
  }
  /**
   * 验证分页参数
   */
  static validatePagination(params) {
    try {
      const schema = external_exports.object({
        page: external_exports.number().int().min(1).default(1),
        limit: external_exports.number().int().min(1).max(100).default(10)
      });
      return schema.parse(params);
    } catch (error) {
      if (error instanceof external_exports.ZodError) {
        throw new ModuleError(
          "Invalid pagination parameters",
          ERROR_CODES.VALIDATION_ERROR,
          400,
          error.errors
        );
      }
      throw error;
    }
  }
  /**
   * 清理和验证字符串输入
   */
  static sanitizeString(input, maxLength = 1e3) {
    if (typeof input !== "string") {
      throw new ModuleError(
        "Input must be a string",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }
    const cleaned = input.trim().replace(/[<>]/g, "").replace(/javascript:/gi, "").slice(0, maxLength);
    return cleaned;
  }
  /**
   * 验证IP地址格式
   */
  static validateIPAddress(ip) {
    const ipv4Regex2 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex2 = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex2.test(ip) || ipv6Regex2.test(ip);
  }
  /**
   * 验证User-Agent字符串
   */
  static validateUserAgent(userAgent) {
    if (typeof userAgent !== "string") return false;
    if (userAgent.length === 0 || userAgent.length > 500) return false;
    return /^[a-zA-Z0-9\s\(\)\[\]\/\.\-_,;:]+$/.test(userAgent);
  }
};

// src/middleware/requestValidator.ts
var requestValidator = /* @__PURE__ */ __name(async (c, next) => {
  try {
    await validateHeaders(c);
    await validateRequestSize(c);
    await validateContentType(c);
    validateUserAgent(c);
    await next();
  } catch (error) {
    if (error instanceof ModuleError) {
      const response2 = {
        success: false,
        error: error.message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.req.header("X-Request-ID") || crypto.randomUUID()
      };
      c.status(error.statusCode);
      await c.json(response2);
      return;
    }
    const response = {
      success: false,
      error: "Request validation failed",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.req.header("X-Request-ID") || crypto.randomUUID()
    };
    c.status(400);
    await c.json(response);
    return;
  }
}, "requestValidator");
async function validateHeaders(c) {
  const headers = c.req.header();
  const requiredHeaders = ["host"];
  for (const header of requiredHeaders) {
    if (!headers[header]) {
      throw new ModuleError(
        `Missing required header: ${header}`,
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }
  }
  const authHeader = c.req.header("Authorization");
  if (authHeader && !isValidAuthHeader(authHeader)) {
    throw new ModuleError(
      "Invalid Authorization header format",
      ERROR_CODES.UNAUTHORIZED,
      401
    );
  }
  const requestId = c.req.header("X-Request-ID");
  if (requestId && !isValidUUID(requestId)) {
    throw new ModuleError(
      "Invalid X-Request-ID format, must be a valid UUID",
      ERROR_CODES.VALIDATION_ERROR,
      400
    );
  }
}
__name(validateHeaders, "validateHeaders");
async function validateRequestSize(c) {
  const contentLength = c.req.header("Content-Length");
  if (contentLength) {
    const size = parseInt(contentLength);
    const maxSize = 10 * 1024 * 1024;
    if (size > maxSize) {
      throw new ModuleError(
        "Request body too large",
        ERROR_CODES.VALIDATION_ERROR,
        413
      );
    }
  }
}
__name(validateRequestSize, "validateRequestSize");
async function validateContentType(c) {
  const method = c.req.method;
  const contentType = c.req.header("Content-Type");
  if (["POST", "PUT", "PATCH"].includes(method)) {
    if (!contentType) {
      throw new ModuleError(
        "Content-Type header is required for this method",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }
    const supportedTypes = [
      "application/json",
      "application/x-www-form-urlencoded",
      "multipart/form-data"
    ];
    const ct = contentType || "";
    const baseType = ct.includes(";") ? (ct.split(";")[0] || "").trim() : ct.trim();
    if (!supportedTypes.includes(baseType)) {
      throw new ModuleError(
        `Unsupported Content-Type: ${baseType}`,
        ERROR_CODES.VALIDATION_ERROR,
        415
      );
    }
  }
}
__name(validateContentType, "validateContentType");
function validateUserAgent(c) {
  const userAgent = c.req.header("User-Agent");
  if (userAgent && !ValidationService.validateUserAgent(userAgent)) {
    throw new ModuleError(
      "Invalid User-Agent header",
      ERROR_CODES.VALIDATION_ERROR,
      400
    );
  }
}
__name(validateUserAgent, "validateUserAgent");
function isValidAuthHeader(authHeader) {
  const patterns = [
    /^Bearer\s+[A-Za-z0-9\-._~+/]+=*$/,
    /^Basic\s+[A-Za-z0-9+/]+=*$/,
    /^API-Key\s+[A-Za-z0-9\-._~]+$/
  ];
  return patterns.some((pattern) => pattern.test(authHeader));
}
__name(isValidAuthHeader, "isValidAuthHeader");
function isValidUUID(uuid) {
  const uuidRegex2 = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex2.test(uuid);
}
__name(isValidUUID, "isValidUUID");

// src/middleware/validation.ts
var testSubmissionSchema = external_exports.object({
  testType: external_exports.string().min(1, "Test type is required"),
  answers: external_exports.array(external_exports.any()).min(1, "At least one answer is required"),
  userInfo: external_exports.object({
    userAgent: external_exports.string().optional(),
    timestamp: external_exports.string().optional()
  }).optional()
});
var analyticsEventSchema = external_exports.object({
  eventType: external_exports.string().min(1, "Event type is required"),
  data: external_exports.any().optional(),
  sessionId: external_exports.string().uuid("Invalid session ID format").optional(),
  timestamp: external_exports.string().optional()
});
var blogArticleSchema = external_exports.object({
  title: external_exports.string().min(1, "Title is required").max(200, "Title too long"),
  content: external_exports.string().min(1, "Content is required"),
  excerpt: external_exports.string().max(300, "Excerpt too long").optional(),
  category: external_exports.string().optional(),
  tags: external_exports.array(external_exports.string()).optional()
});
var validateTestSubmission = /* @__PURE__ */ __name(async (c, next) => {
  try {
    const body = await c.req.json();
    testSubmissionSchema.parse(body);
    return next();
  } catch (error) {
    if (error instanceof external_exports.ZodError) {
      throw new ModuleError(
        "Invalid test submission data",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        error.errors
      );
    }
    throw error;
  }
}, "validateTestSubmission");
var validateFeedback = /* @__PURE__ */ __name(async (c, next) => {
  console.log("validateFeedback middleware called");
  try {
    const body = await c.req.json();
    if (!body || typeof body !== "object") {
      throw new ModuleError(
        "Invalid request body format",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }
    if (!body.feedback || !["like", "dislike"].includes(body.feedback)) {
      throw new ModuleError(
        "Feedback must be 'like' or 'dislike'",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }
    await next();
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      "Invalid JSON format",
      ERROR_CODES.VALIDATION_ERROR,
      400
    );
  }
}, "validateFeedback");
var validateAnalyticsEvent = /* @__PURE__ */ __name(async (c, next) => {
  try {
    const body = await c.req.json();
    analyticsEventSchema.parse(body);
    await next();
  } catch (error) {
    if (error instanceof external_exports.ZodError) {
      throw new ModuleError(
        "Invalid analytics event data",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        error.errors
      );
    }
    throw error;
  }
}, "validateAnalyticsEvent");

// src/middleware/rateLimiter.ts
var rateLimiter = /* @__PURE__ */ __name((requests, windowMs) => {
  return async (c, next) => {
    const ip = c.req.header("CF-Connecting-IP") || c.req.header("X-Forwarded-IP") || "unknown";
    const key = `rate_limit:${ip}`;
    const windowSeconds = Math.floor(windowMs / 1e3);
    try {
      if (!c.env.KV) {
        console.warn("KV not available, skipping rate limiting");
        return next();
      }
      const current = await c.env.KV.get(key);
      const count = current ? parseInt(current) : 0;
      if (count >= requests) {
        throw new ModuleError(
          "Too many requests, please try again later",
          ERROR_CODES.RATE_LIMITED,
          429
        );
      }
      await c.env.KV.put(key, (count + 1).toString(), {
        expirationTtl: windowSeconds
      });
      await next();
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      console.warn("Rate limiter KV operation failed:", error);
      await next();
    }
  };
}, "rateLimiter");

// src/services/testEngine/index.ts
var TestEngineService = class {
  static {
    __name(this, "TestEngineService");
  }
  dbService;
  cacheService;
  /**
   * 构造函数
   * @param dbService 数据库服务
   * @param cacheService 缓存服务
   */
  constructor(dbService, cacheService) {
    this.dbService = dbService;
    this.cacheService = cacheService;
  }
  async getTestTypes(activeOnly = true) {
    try {
      const testTypes = await this.dbService.testTypes.getAllActive();
      const filteredTypes = activeOnly ? testTypes.filter((type) => type.isActive) : testTypes;
      return filteredTypes.map((type) => ({
        id: type.id,
        name: type.name || "",
        description: type.description || "",
        category: type.category || "",
        configData: type.configData,
        isActive: type.isActive || false
      }));
    } catch (error) {
      throw new ModuleError(
        "Failed to retrieve test types",
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
  async getTestConfig(testType) {
    try {
      const config = await this.dbService.testTypes.findById(testType);
      if (!config) {
        throw new ModuleError(
          `Test type '${testType}' not found`,
          ERROR_CODES.TEST_NOT_FOUND,
          404
        );
      }
      return {
        id: config.id,
        name: config.name || "",
        description: config.description || "",
        category: config.category || "",
        configData: config.configData,
        isActive: config.isActive || false
      };
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        `Failed to retrieve test configuration for: ${testType}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
  /**
   * 获取测试结果
   * @param sessionId 会话ID
   * @returns 测试结果
   */
  async getTestResult(sessionId) {
    try {
      const cacheKey = `test_result:${sessionId}`;
      const cachedResult = await this.cacheService.get(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }
      const session = await this.dbService.testSessions.findById(sessionId);
      if (!session) {
        throw new ModuleError(
          `Test session '${sessionId}' not found`,
          ERROR_CODES.TEST_NOT_FOUND,
          404
        );
      }
      const resultData = typeof session.resultData === "string" ? JSON.parse(session.resultData) : session.resultData || {};
      const result = {
        sessionId: session.id,
        testType: session.testTypeId,
        scores: resultData.scores || {},
        interpretation: resultData.interpretation || "",
        recommendations: resultData.recommendations || [],
        completedAt: typeof session.createdAt === "string" ? session.createdAt : (/* @__PURE__ */ new Date()).toISOString()
      };
      await this.cacheService.set(cacheKey, result, { ttl: 86400 });
      return result;
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        `Failed to retrieve result for session: ${sessionId}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
  /**
   * 保存测试会话
   * @param sessionData 会话数据
   * @returns 会话ID
   */
  async saveTestSession(sessionData) {
    try {
      const sessionDataToCreate = {
        testTypeId: sessionData.testTypeId,
        answers: sessionData.answersData,
        result: sessionData.resultData,
        sessionDuration: sessionData.sessionDuration || 0
      };
      if (sessionData.userAgent) {
        sessionDataToCreate.userAgent = sessionData.userAgent;
      }
      if (sessionData.ipAddressHash) {
        sessionDataToCreate.ipAddress = sessionData.ipAddressHash;
      }
      return await this.dbService.testSessions.create(sessionDataToCreate);
    } catch (error) {
      throw new ModuleError(
        "Failed to save test session",
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
};

// src/routes/tests/index.ts
var testRoutes = new Hono2();
testRoutes.get("/", async (c) => {
  try {
    const dbService = c.get("dbService");
    const cacheService = c.get("cacheService");
    const testEngineService = new TestEngineService(dbService, cacheService);
    const testTypes = await testEngineService.getTestTypes(true);
    const response = {
      success: true,
      data: testTypes,
      message: "Test types retrieved successfully",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      "Failed to retrieve test types",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});
testRoutes.get("/:testType", async (c) => {
  const testType = c.req.param("testType");
  try {
    ValidationService.sanitizeString(testType, 50);
    const dbService = c.get("dbService");
    const cacheService = c.get("cacheService");
    const testEngineService = new TestEngineService(dbService, cacheService);
    const testConfig = await testEngineService.getTestConfig(testType);
    const response = {
      success: true,
      data: testConfig,
      message: `Test configuration for ${testType} retrieved successfully`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      `Failed to retrieve test configuration for: ${testType}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});
testRoutes.get("/:testType/questions", async (c) => {
  const testType = c.req.param("testType");
  try {
    ValidationService.sanitizeString(testType, 50);
    const dbService = c.get("dbService");
    const cacheService = c.get("cacheService");
    const testEngineService = new TestEngineService(dbService, cacheService);
    const testConfig = await testEngineService.getTestConfig(testType);
    const configData = typeof testConfig.configData === "string" ? JSON.parse(testConfig.configData) : testConfig.configData;
    const response = {
      success: true,
      data: {
        testType: testConfig.id,
        name: testConfig.name,
        description: testConfig.description,
        category: testConfig.category,
        questionCount: configData.questionCount || 20,
        timeLimit: configData.timeLimit || 1800,
        instructions: configData.instructions || "\u8BF7\u6839\u636E\u5B9E\u9645\u60C5\u51B5\u9009\u62E9\u6700\u7B26\u5408\u7684\u7B54\u6848"
        // 实际的题目内容可能需要从其他地方获取或动态生成
      },
      message: `Questions configuration for ${testType} retrieved successfully`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      `Failed to retrieve questions for test type: ${testType}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});
testRoutes.post(
  "/submit",
  rateLimiter(10, 6e4),
  // 每分钟最多10次提交
  validateTestSubmission,
  async (c) => {
    try {
      const submission = await c.req.json();
      const dbService = c.get("dbService");
      const cacheService = c.get("cacheService");
      const testEngineService = new TestEngineService(dbService, cacheService);
      await testEngineService.getTestConfig(submission.testType);
      const ipHash = await hashIP(c.req.header("CF-Connecting-IP") || "unknown");
      const sessionId = await testEngineService.saveTestSession({
        testTypeId: submission.testType,
        answersData: submission.answers,
        resultData: {},
        // 暂时为空，后续计算结果后更新
        userAgent: submission.userInfo?.userAgent || null,
        ipAddressHash: ipHash,
        sessionDuration: 0
        // 暂时为0，实际应该计算
      });
      const result = {
        sessionId,
        testType: submission.testType,
        scores: {},
        interpretation: "\u6D4B\u8BD5\u7ED3\u679C\u6B63\u5728\u8BA1\u7B97\u4E2D...",
        recommendations: [],
        completedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const response = {
        success: true,
        data: result,
        message: "Test submitted successfully",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId")
      };
      return c.json(response);
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        "Failed to process test submission",
        ERROR_CODES.CALCULATION_ERROR,
        500
      );
    }
  }
);
testRoutes.get("/results/:sessionId", async (c) => {
  const sessionId = c.req.param("sessionId");
  try {
    ValidationService.validateUUID(sessionId);
    const dbService = c.get("dbService");
    const cacheService = c.get("cacheService");
    const testEngineService = new TestEngineService(dbService, cacheService);
    const result = await testEngineService.getTestResult(sessionId);
    const response = {
      success: true,
      data: result,
      message: `Result for session ${sessionId} retrieved successfully`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      `Failed to retrieve result for session: ${sessionId}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});
testRoutes.get("/stats/:testType", async (c) => {
  const testType = c.req.param("testType");
  try {
    ValidationService.sanitizeString(testType, 50);
    const dbService = c.get("dbService");
    const totalSessions = await dbService.testSessions.count({ testTypeId: testType });
    const recentSessions = await dbService.testSessions.findRecent(testType, 10);
    const response = {
      success: true,
      data: {
        testType,
        totalSessions,
        recentActivity: recentSessions.length,
        lastActivity: recentSessions[0]?.createdAt || null
      },
      message: `Statistics for ${testType} retrieved successfully`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      `Failed to retrieve statistics for test type: ${testType}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});
async function hashIP(ip) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hashIP, "hashIP");

// src/routes/blog/index.ts
var blogRoutes = new Hono2();
blogRoutes.get("/articles", async (c) => {
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "10");
  try {
    const response = {
      success: true,
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      },
      message: "Blog articles retrieved successfully",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId") || ""
    };
    return c.json(response);
  } catch (error) {
    throw new ModuleError(
      "Failed to retrieve blog articles",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});
blogRoutes.get("/articles/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const response = {
      success: true,
      data: null,
      message: `Blog article ${id} retrieved successfully`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId") || ""
    };
    return c.json(response);
  } catch (error) {
    throw new ModuleError(
      `Failed to retrieve blog article: ${id}`,
      ERROR_CODES.DATABASE_ERROR,
      404
    );
  }
});
blogRoutes.post(
  "/articles/:id/view",
  rateLimiter(30, 6e4),
  // 每分钟最多30次浏览记录
  async (c) => {
    const id = c.req.param("id");
    try {
      const response = {
        success: true,
        message: `View count updated for article ${id}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId") || ""
      };
      return c.json(response);
    } catch (error) {
      throw new ModuleError(
        `Failed to update view count for article: ${id}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
);

// src/services/ContentFilterService.ts
var ContentFilterCategory = /* @__PURE__ */ ((ContentFilterCategory2) => {
  ContentFilterCategory2["PROFANITY"] = "profanity";
  ContentFilterCategory2["HATE_SPEECH"] = "hate_speech";
  ContentFilterCategory2["PERSONAL_INFO"] = "personal_info";
  ContentFilterCategory2["SPAM"] = "spam";
  ContentFilterCategory2["ADULT"] = "adult";
  return ContentFilterCategory2;
})(ContentFilterCategory || {});
var ContentFilterService = class {
  static {
    __name(this, "ContentFilterService");
  }
  // 敏感词库 - 实际项目中应该从数据库或配置文件加载
  static sensitivePatterns = {
    ["profanity" /* PROFANITY */]: [
      /\b(bad-word-1|bad-word-2)\b/i
    ],
    ["hate_speech" /* HATE_SPEECH */]: [
      /\b(hate-word-1|hate-word-2)\b/i
    ],
    ["personal_info" /* PERSONAL_INFO */]: [
      /\b\d{3}-\d{2}-\d{4}\b/,
      // US SSN
      /\b\d{16,19}\b/,
      // Credit card
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
      // Email
      /\b(?:\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3,5}[- ]?\d{4}\b/
      // Phone
    ],
    ["spam" /* SPAM */]: [
      /\b(buy now|click here|free money|limited time)\b/i
    ],
    ["adult" /* ADULT */]: [
      /\b(adult-word-1|adult-word-2)\b/i
    ]
  };
  /**
   * 检查内容是否包含敏感信息
   * @param content 要检查的内容
   * @param categories 要检查的类别（默认全部）
   * @returns 过滤结果
   */
  static checkContent(content, categories) {
    if (!content) {
      return {
        isClean: true,
        detectedCategories: [],
        severity: "low"
      };
    }
    const categoriesToCheck = categories || Object.values(ContentFilterCategory);
    const detectedCategories = [];
    for (const category of categoriesToCheck) {
      const patterns = this.sensitivePatterns[category] || [];
      for (const pattern of patterns) {
        if (pattern.test(content)) {
          detectedCategories.push(category);
          break;
        }
      }
    }
    let severity = "low";
    if (detectedCategories.includes("hate_speech" /* HATE_SPEECH */) || detectedCategories.includes("adult" /* ADULT */)) {
      severity = "high";
    } else if (detectedCategories.length > 1 || detectedCategories.includes("personal_info" /* PERSONAL_INFO */)) {
      severity = "medium";
    }
    return {
      isClean: detectedCategories.length === 0,
      detectedCategories,
      severity
    };
  }
  /**
   * 过滤内容中的敏感信息
   * @param content 要过滤的内容
   * @param categories 要过滤的类别（默认全部）
   * @returns 过滤结果，包含过滤后的内容
   */
  static filterContent(content, categories) {
    if (!content) {
      return {
        isClean: true,
        detectedCategories: [],
        filteredContent: "",
        severity: "low"
      };
    }
    const categoriesToFilter = categories || Object.values(ContentFilterCategory);
    const detectedCategories = [];
    let filteredContent = content;
    for (const category of categoriesToFilter) {
      const patterns = this.sensitivePatterns[category] || [];
      for (const pattern of patterns) {
        if (pattern.test(content)) {
          detectedCategories.push(category);
          filteredContent = filteredContent.replace(pattern, "***");
        }
      }
    }
    let severity = "low";
    if (detectedCategories.includes("hate_speech" /* HATE_SPEECH */) || detectedCategories.includes("adult" /* ADULT */)) {
      severity = "high";
    } else if (detectedCategories.length > 1 || detectedCategories.includes("personal_info" /* PERSONAL_INFO */)) {
      severity = "medium";
    }
    return {
      isClean: detectedCategories.length === 0,
      detectedCategories,
      filteredContent,
      severity
    };
  }
  /**
   * 检查并可能拒绝敏感内容
   * @param content 要检查的内容
   * @param strictCategories 严格检查的类别（发现会被拒绝）
   * @param warnCategories 警告类别（发现会标记但不拒绝）
   * @throws 如果内容中包含严格类别中的敏感信息，则抛出错误
   * @returns 过滤结果，如果没有被拒绝
   */
  static validateContent(content, strictCategories = [
    "hate_speech" /* HATE_SPEECH */,
    "adult" /* ADULT */
  ], warnCategories = [
    "profanity" /* PROFANITY */,
    "personal_info" /* PERSONAL_INFO */,
    "spam" /* SPAM */
  ]) {
    const strictResult = this.checkContent(content, strictCategories);
    if (!strictResult.isClean) {
      throw new ModuleError(
        "Content contains inappropriate material",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        {
          categories: strictResult.detectedCategories,
          severity: strictResult.severity
        }
      );
    }
    const warnResult = this.checkContent(content, warnCategories);
    if (!warnResult.isClean) {
      const filteredResult = this.filterContent(content, warnCategories);
      return {
        ...filteredResult,
        detectedCategories: [
          ...strictResult.detectedCategories,
          ...filteredResult.detectedCategories
        ]
      };
    }
    return {
      isClean: true,
      detectedCategories: [],
      filteredContent: content,
      severity: "low"
    };
  }
};

// src/routes/feedback/index.ts
var feedbackRoutes = new Hono2();
feedbackRoutes.post(
  "/",
  rateLimiter(5, 6e4),
  // 恢复速率限制
  validateFeedback,
  // 验证中间件
  async (c) => {
    try {
      const feedbackData = await c.req.json();
      const dbService = c.get("dbService");
      if (feedbackData.sessionId) {
        const session = await dbService.testSessions.findById(feedbackData.sessionId);
        if (!session) {
          throw new ModuleError(
            `Session ID '${feedbackData.sessionId}' not found`,
            ERROR_CODES.VALIDATION_ERROR,
            404
          );
        }
      }
      let filteredComment = feedbackData.comment;
      let filterResult = null;
      if (feedbackData.comment) {
        filterResult = ContentFilterService.validateContent(
          feedbackData.comment,
          ["hate_speech" /* HATE_SPEECH */, "adult" /* ADULT */],
          // 严格过滤类别
          ["profanity" /* PROFANITY */, "spam" /* SPAM */]
          // 警告过滤类别
        );
        filteredComment = filterResult.filteredContent;
      }
      const feedbackId = await dbService.userFeedback.create({
        sessionId: feedbackData.sessionId,
        feedbackType: feedbackData.feedback,
        content: filteredComment,
        rating: feedbackData.rating || (feedbackData.feedback === "like" ? 5 : 1)
      });
      await dbService.analyticsEvents.create({
        eventType: "feedback_submitted",
        eventData: {
          feedbackType: feedbackData.feedback,
          hasComment: !!feedbackData.comment,
          wasFiltered: filterResult && !filterResult.isClean,
          sessionId: feedbackData.sessionId
        },
        sessionId: feedbackData.sessionId,
        ipAddress: c.req.header("CF-Connecting-IP") || "",
        userAgent: c.req.header("User-Agent")
      });
      const response = {
        success: true,
        data: {
          feedbackId,
          status: "recorded",
          contentFiltered: filterResult && !filterResult.isClean
        },
        message: "Feedback submitted successfully",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId")
      };
      return c.json(response);
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        "Failed to submit feedback",
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
);
feedbackRoutes.get("/stats", async (c) => {
  try {
    const dbService = c.get("dbService");
    const range = c.req.query("range");
    let stats;
    if (range && range !== "all") {
      const endDate = /* @__PURE__ */ new Date();
      const startDate = /* @__PURE__ */ new Date();
      if (range === "7d") {
        startDate.setDate(startDate.getDate() - 7);
      } else if (range === "30d") {
        startDate.setDate(startDate.getDate() - 30);
      } else if (range === "90d") {
        startDate.setDate(startDate.getDate() - 90);
      }
      stats = await dbService.userFeedback.getStatsByDateRange(
        startDate.toISOString(),
        endDate.toISOString()
      );
    } else {
      stats = await dbService.userFeedback.getStats();
    }
    const response = {
      success: true,
      data: {
        ...stats,
        timeRange: range || "all",
        likeRatio: stats.totalFeedback > 0 ? Math.round(stats.positiveCount / stats.totalFeedback * 100) : 0
      },
      message: "Feedback statistics retrieved successfully",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      "Failed to retrieve feedback statistics",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});
feedbackRoutes.get("/comments", async (c) => {
  try {
    const dbService = c.get("dbService");
    const limit = parseInt(c.req.query("limit") || "20");
    const page = parseInt(c.req.query("page") || "1");
    ValidationService.validatePagination({ page, limit: Math.min(limit, 50) });
    const comments = await dbService.userFeedback.getComments(limit);
    const stats = await dbService.userFeedback.getStats();
    const response = {
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total: stats.commentCount,
        totalPages: Math.ceil(stats.commentCount / limit),
        hasNext: page * limit < stats.commentCount,
        hasPrev: page > 1
      },
      message: "Feedback comments retrieved successfully",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      "Failed to retrieve feedback comments",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});
feedbackRoutes.get("/session/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param("sessionId");
    const dbService = c.get("dbService");
    ValidationService.validateUUID(sessionId);
    const feedback = await dbService.userFeedback.findBySessionId(sessionId);
    const response = {
      success: true,
      data: feedback,
      message: `Feedback for session ${sessionId} retrieved successfully`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      "Failed to retrieve session feedback",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// src/routes/analytics/index.ts
var analyticsRoutes = new Hono2();
analyticsRoutes.post(
  "/events",
  rateLimiter(100, 6e4),
  // 恢复速率限制
  validateAnalyticsEvent,
  // 恢复验证
  async (c) => {
    try {
      const eventData = await c.req.json();
      const dbService = c.get("dbService");
      const eventId = await dbService.analyticsEvents.create({
        eventType: eventData.eventType,
        eventData: eventData.data,
        sessionId: eventData.sessionId,
        ipAddress: c.req.header("CF-Connecting-IP") || "",
        userAgent: c.req.header("User-Agent")
      });
      const response = {
        success: true,
        data: {
          eventId,
          status: "recorded"
        },
        message: "Analytics event recorded successfully",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId")
      };
      return c.json(response);
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        "Failed to record analytics event",
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
);
analyticsRoutes.post(
  "/events/batch",
  rateLimiter(20, 6e4),
  // 恢复速率限制
  async (c) => {
    try {
      const { events } = await c.req.json();
      const dbService = c.get("dbService");
      if (!Array.isArray(events) || events.length === 0) {
        throw new ModuleError(
          "Invalid batch events data",
          ERROR_CODES.VALIDATION_ERROR,
          400
        );
      }
      events.forEach((event) => {
        if (!event.eventType) {
          throw new ModuleError(
            "Each event must have an eventType",
            ERROR_CODES.VALIDATION_ERROR,
            400
          );
        }
      });
      const ipAddress = c.req.header("CF-Connecting-IP") || "";
      const userAgent = c.req.header("User-Agent") || "";
      const eventsToCreate = events.map((event) => ({
        eventType: event.eventType,
        eventData: event.data,
        sessionId: event.sessionId,
        ipAddress,
        userAgent
      }));
      const count = await dbService.analyticsEvents.createBatch(eventsToCreate);
      const response = {
        success: true,
        data: {
          eventCount: count,
          status: "recorded"
        },
        message: "Batch analytics events recorded successfully",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId")
      };
      return c.json(response);
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        "Failed to record batch analytics events",
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
);
analyticsRoutes.get("/stats", async (c) => {
  const timeRange = c.req.query("range") || "7d";
  try {
    const dbService = c.get("dbService");
    let startDate;
    let endDate;
    if (timeRange !== "all") {
      endDate = (/* @__PURE__ */ new Date()).toISOString();
      const start = /* @__PURE__ */ new Date();
      if (timeRange === "7d") {
        start.setDate(start.getDate() - 7);
      } else if (timeRange === "30d") {
        start.setDate(start.getDate() - 30);
      } else if (timeRange === "90d") {
        start.setDate(start.getDate() - 90);
      } else {
        throw new ModuleError(
          `Invalid time range: ${timeRange}`,
          ERROR_CODES.VALIDATION_ERROR,
          400
        );
      }
      startDate = start.toISOString();
    }
    const overview = await dbService.analyticsEvents.getOverview(startDate, endDate);
    const daysToFetch = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const dailyStats = await dbService.analyticsEvents.getDailyStats(daysToFetch);
    const response = {
      success: true,
      data: {
        overview,
        dailyStats,
        timeRange,
        generatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      message: "Analytics statistics retrieved successfully",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      "Failed to retrieve analytics statistics",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});
analyticsRoutes.get("/stats/:eventType", async (c) => {
  const eventType = c.req.param("eventType");
  const timeRange = c.req.query("range") || "30d";
  try {
    const dbService = c.get("dbService");
    ValidationService.sanitizeString(eventType, 100);
    let startDate;
    let endDate;
    if (timeRange !== "all") {
      endDate = (/* @__PURE__ */ new Date()).toISOString();
      const start = /* @__PURE__ */ new Date();
      if (timeRange === "7d") {
        start.setDate(start.getDate() - 7);
      } else if (timeRange === "30d") {
        start.setDate(start.getDate() - 30);
      } else if (timeRange === "90d") {
        start.setDate(start.getDate() - 90);
      } else {
        throw new ModuleError(
          `Invalid time range: ${timeRange}`,
          ERROR_CODES.VALIDATION_ERROR,
          400
        );
      }
      startDate = start.toISOString();
    }
    const daysToFetch = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const dailyStats = await dbService.analyticsEvents.getDailyStats(daysToFetch, eventType);
    const limit = parseInt(c.req.query("limit") || "20");
    const recentEvents = await dbService.analyticsEvents.findByEventType(
      eventType,
      limit,
      startDate,
      endDate
    );
    const response = {
      success: true,
      data: {
        eventType,
        totalEvents: dailyStats.reduce((sum, day) => sum + day.count, 0),
        dailyStats,
        recentEvents,
        timeRange
      },
      message: `Statistics for event type '${eventType}' retrieved successfully`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      `Failed to retrieve statistics for event type: ${eventType}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});
analyticsRoutes.get("/sessions/:sessionId", async (c) => {
  const sessionId = c.req.param("sessionId");
  try {
    const dbService = c.get("dbService");
    ValidationService.validateUUID(sessionId);
    const events = await dbService.analyticsEvents.findBySessionId(sessionId);
    const session = await dbService.testSessions.findById(sessionId);
    if (!events.length) {
      throw new ModuleError(
        `No events found for session ID: ${sessionId}`,
        ERROR_CODES.NOT_FOUND,
        404
      );
    }
    const response = {
      success: true,
      data: {
        sessionId,
        sessionData: session,
        events,
        eventCount: events.length,
        firstEventTime: events[0].timestamp,
        lastEventTime: events[events.length - 1].timestamp
      },
      message: `User journey for session ${sessionId} retrieved successfully`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      `Failed to retrieve user journey for session: ${sessionId}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});
analyticsRoutes.get("/popular-tests", async (c) => {
  const timeRange = c.req.query("range") || "30d";
  try {
    const dbService = c.get("dbService");
    let startDate;
    let endDate;
    if (timeRange !== "all") {
      endDate = (/* @__PURE__ */ new Date()).toISOString();
      const start = /* @__PURE__ */ new Date();
      if (timeRange === "7d") {
        start.setDate(start.getDate() - 7);
      } else if (timeRange === "30d") {
        start.setDate(start.getDate() - 30);
      } else if (timeRange === "90d") {
        start.setDate(start.getDate() - 90);
      } else {
        throw new ModuleError(
          `Invalid time range: ${timeRange}`,
          ERROR_CODES.VALIDATION_ERROR,
          400
        );
      }
      startDate = start.toISOString();
    }
    const popularTests = await dbService.analyticsEvents.getEventStats(
      startDate,
      endDate,
      10
    );
    const testEvents = popularTests.filter(
      (event) => event.eventType.startsWith("test_started_")
    );
    const testTypesPromises = testEvents.map(async (event) => {
      const testType = event.eventType.replace("test_started_", "");
      try {
        return await dbService.testTypes.findById(testType);
      } catch (e) {
        return null;
      }
    });
    const testTypes = (await Promise.all(testTypesPromises)).filter((test) => test !== null);
    const response = {
      success: true,
      data: {
        popularTests: testEvents.map((event, index) => ({
          testType: event.eventType.replace("test_started_", ""),
          count: event.count,
          percentage: event.percentage,
          name: testTypes[index]?.name || "Unknown Test",
          description: testTypes[index]?.description || ""
        })),
        timeRange
      },
      message: "Popular tests retrieved successfully",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      "Failed to retrieve popular tests",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// src/routes/system/index.ts
var systemRoutes = new Hono2();
systemRoutes.get("/health", async (c) => {
  try {
    const dbService = c.get("dbService");
    const healthCheck = await dbService.healthCheck();
    const response = {
      success: true,
      data: {
        status: healthCheck.status,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        environment: c.env?.["ENVIRONMENT"],
        version: "1.0.0",
        services: {
          database: healthCheck.status,
          cache: "healthy",
          // 简化版本
          storage: "healthy"
          // 简化版本
        }
      },
      message: "System health check completed",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response, healthCheck.status === "healthy" ? 200 : 503);
  } catch (error) {
    throw new ModuleError(
      "System health check failed",
      ERROR_CODES.DATABASE_ERROR,
      503
    );
  }
});
systemRoutes.get("/health/database", async (c) => {
  try {
    const dbService = c.get("dbService");
    const healthCheck = await dbService.healthCheck();
    const response = {
      success: true,
      data: healthCheck,
      message: "Database health check completed",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response, healthCheck.status === "healthy" ? 200 : 503);
  } catch (error) {
    throw new ModuleError(
      "Database health check failed",
      ERROR_CODES.DATABASE_ERROR,
      503
    );
  }
});
systemRoutes.get(
  "/stats",
  rateLimiter(10, 6e4),
  // 每分钟最多10次请求
  async (c) => {
    try {
      const dbService = c.get("dbService");
      const stats = await dbService.getStatistics();
      const response = {
        success: true,
        data: stats,
        message: "System statistics retrieved successfully",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId")
      };
      return c.json(response);
    } catch (error) {
      throw new ModuleError(
        "Failed to retrieve system statistics",
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
);
systemRoutes.get("/migrations", async (c) => {
  try {
    const response = {
      success: true,
      data: {
        status: "up_to_date",
        lastMigration: "005_module_indexes",
        pendingMigrations: []
      },
      message: "Migration status retrieved successfully",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response);
  } catch (error) {
    throw new ModuleError(
      "Failed to retrieve migration status",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});
systemRoutes.get("/health/cache", async (c) => {
  try {
    if (!c.env) {
      return c.json({
        success: false,
        error: "\u73AF\u5883\u914D\u7F6E\u4E0D\u53EF\u7528"
      }, 500);
    }
    const testKey = "health_check_cache";
    const testValue = { timestamp: Date.now() };
    await c.env["KV"].put(testKey, JSON.stringify(testValue), { expirationTtl: 60 });
    const retrieved = await c.env["KV"].get(testKey);
    await c.env["KV"].delete(testKey);
    const isHealthy = retrieved !== null;
    const response = {
      success: true,
      data: {
        status: isHealthy ? "healthy" : "unhealthy",
        latency: 0,
        // 简化版本
        details: {
          connection: isHealthy,
          readWrite: isHealthy
        }
      },
      message: "Cache health check completed",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response, isHealthy ? 200 : 503);
  } catch (error) {
    const response = {
      success: false,
      error: "Cache health check failed",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response, 503);
  }
});
systemRoutes.get("/config", async (c) => {
  try {
    const response = {
      success: true,
      data: {
        environment: c.env?.["ENVIRONMENT"],
        version: "1.0.0",
        features: {
          analytics: true,
          feedback: true,
          caching: true,
          rateLimiting: true
        },
        limits: {
          maxRequestSize: "10MB",
          rateLimitRequests: 100,
          rateLimitWindow: "1 hour",
          cacheDefaultTTL: "1 hour"
        }
      },
      message: "System configuration retrieved successfully",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response);
  } catch (error) {
    throw new ModuleError(
      "Failed to retrieve system configuration",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});
systemRoutes.post(
  "/cleanup",
  rateLimiter(1, 36e5),
  // 每小时最多1次
  async (c) => {
    try {
      const dbService = c.get("dbService");
      const result = await dbService.cleanupExpiredData();
      const response = {
        success: true,
        data: result,
        message: "Data cleanup completed successfully",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId")
      };
      return c.json(response);
    } catch (error) {
      throw new ModuleError(
        "Failed to cleanup expired data",
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
);
systemRoutes.post(
  "/backup",
  rateLimiter(1, 36e5),
  // 每小时最多1次
  async (c) => {
    try {
      const dbService = c.get("dbService");
      const backup = await dbService.createBackup();
      const response = {
        success: true,
        data: backup,
        message: "Database backup created successfully",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId")
      };
      return c.json(response);
    } catch (error) {
      throw new ModuleError(
        "Failed to create database backup",
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
);
systemRoutes.get("/info", async (c) => {
  try {
    const response = {
      success: true,
      data: {
        name: "\u7EFC\u5408\u6D4B\u8BD5\u5E73\u53F0 API",
        version: "1.0.0",
        description: "\u4E13\u4E1A\u7684\u5FC3\u7406\u6D4B\u8BD5\u3001\u5360\u661F\u5206\u6790\u3001\u5854\u7F57\u5360\u535C\u7B49\u5728\u7EBF\u6D4B\u8BD5\u670D\u52A1",
        uptime: "N/A",
        // Cloudflare Workers不支持process.uptime
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        environment: c.env?.["ENVIRONMENT"],
        runtime: "Cloudflare Workers",
        framework: "Hono.js",
        database: "Cloudflare D1",
        cache: "Cloudflare KV",
        storage: "Cloudflare R2"
      },
      message: "System information retrieved successfully",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    };
    return c.json(response);
  } catch (error) {
    throw new ModuleError(
      "Failed to retrieve system information",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// src/models/BaseModel.ts
var BaseModel = class {
  static {
    __name(this, "BaseModel");
  }
  db;
  kv;
  tableName;
  constructor(env, tableName) {
    if (!env.DB) {
      throw new ModuleError("Database connection not available", ERROR_CODES.DATABASE_ERROR, 500);
    }
    this.db = env.DB;
    this.kv = env.KV || null;
    this.tableName = tableName;
  }
  /**
   * 获取数据库连接
   */
  get database() {
    return this.db;
  }
  /**
   * 执行数据库查询
   */
  async executeQuery(query, params = []) {
    try {
      const stmt = this.db.prepare(query);
      const result = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();
      if (!result.success) {
        throw new ModuleError(
          `Database query failed: ${result.error}`,
          ERROR_CODES.DATABASE_ERROR,
          500
        );
      }
      return result.results;
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        `Database operation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
  /**
   * 执行单条记录查询
   */
  async executeQueryFirst(query, params = []) {
    try {
      const stmt = this.db.prepare(query);
      const result = params.length > 0 ? await stmt.bind(...params).first() : await stmt.first();
      return result;
    } catch (error) {
      throw new ModuleError(
        `Database query failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
  /**
   * 执行插入/更新/删除操作
   */
  async executeRun(query, params = []) {
    try {
      const stmt = this.db.prepare(query);
      const result = params.length > 0 ? await stmt.bind(...params).run() : await stmt.run();
      if (!result.success) {
        throw new ModuleError(
          `Database operation failed: ${result.error}`,
          ERROR_CODES.DATABASE_ERROR,
          500
        );
      }
      return result;
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        `Database operation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
  /**
   * 缓存数据
   */
  async setCache(key, data, ttl = 3600) {
    try {
      await this.kv.put(key, JSON.stringify(data), {
        expirationTtl: ttl
      });
    } catch (error) {
      console.warn("Cache operation failed:", error);
    }
  }
  /**
   * 获取缓存数据
   */
  async getCache(key) {
    try {
      const cached = await this.kv.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn("Cache retrieval failed:", error);
      return null;
    }
  }
  /**
   * 删除缓存
   */
  async deleteCache(key) {
    try {
      await this.kv.delete(key);
    } catch (error) {
      console.warn("Cache deletion failed:", error);
    }
  }
  /**
   * 生成新的ID
   */
  generateId() {
    return globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
  /**
   * 格式化时间戳
   */
  formatTimestamp(date) {
    return (date || /* @__PURE__ */ new Date()).toISOString();
  }
  /**
   * 验证必填字段
   */
  validateRequired(data, fields) {
    const missing = fields.filter((field) => !data[field]);
    if (missing.length > 0) {
      throw new ModuleError(
        `Missing required fields: ${missing.join(", ")}`,
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }
  }
  /**
   * 通用错误构造器
   */
  createError(message, code = "DATABASE_ERROR", status = 500) {
    return new ModuleError(message, ERROR_CODES[code], status);
  }
  /**
   * 通用统计条目数量
   */
  async count(whereClause = "", params = []) {
    const where = whereClause ? ` WHERE ${whereClause} ` : "";
    const result = await this.executeQueryFirst(`SELECT COUNT(*) as count FROM ${this.tableName}${where}`, params);
    return result?.count || 0;
  }
};

// src/models/HomepageModuleModel.ts
var HomepageModuleModel = class extends BaseModel {
  static {
    __name(this, "HomepageModuleModel");
  }
  constructor(env) {
    super(env, "homepage_modules");
  }
  /**
   * 获取所有活跃的测试模块
   */
  async getAllActiveModules() {
    try {
      const result = await this.db.prepare(`
          SELECT * FROM homepage_modules 
          WHERE is_active = 1 
          ORDER BY sort_order ASC, created_at ASC
        `).all();
      return result.results?.map(this.mapDatabaseRowToModule) || [];
    } catch (error) {
      console.error("\u83B7\u53D6\u6D3B\u8DC3\u6D4B\u8BD5\u6A21\u5757\u5931\u8D25:", error);
      throw new Error("\u83B7\u53D6\u6D4B\u8BD5\u6A21\u5757\u5931\u8D25");
    }
  }
  /**
   * 根据主题获取测试模块
   */
  async getModulesByTheme(theme) {
    try {
      const result = await this.db.prepare(`
          SELECT * FROM homepage_modules 
          WHERE theme = ? AND is_active = 1 
          ORDER BY sort_order ASC
        `).bind(theme).all();
      return result.results?.map(this.mapDatabaseRowToModule) || [];
    } catch (error) {
      console.error(`\u83B7\u53D6${theme}\u4E3B\u9898\u6D4B\u8BD5\u6A21\u5757\u5931\u8D25:`, error);
      throw new Error(`\u83B7\u53D6${theme}\u4E3B\u9898\u6D4B\u8BD5\u6A21\u5757\u5931\u8D25`);
    }
  }
  /**
   * 根据ID获取测试模块
   */
  async getModuleById(id) {
    try {
      const result = await this.db.prepare("SELECT * FROM homepage_modules WHERE id = ? AND is_active = 1").bind(id).first();
      return result ? this.mapDatabaseRowToModule(result) : null;
    } catch (error) {
      console.error(`\u83B7\u53D6\u6D4B\u8BD5\u6A21\u5757${id}\u5931\u8D25:`, error);
      throw new Error(`\u83B7\u53D6\u6D4B\u8BD5\u6A21\u5757\u5931\u8D25`);
    }
  }
  /**
   * 更新测试模块统计信息
   */
  async updateModuleStats(id, testCount, rating) {
    try {
      await this.db.prepare(`
          UPDATE homepage_modules 
          SET test_count = ?, rating = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).bind(testCount, rating, id).run();
    } catch (error) {
      console.error(`\u66F4\u65B0\u6D4B\u8BD5\u6A21\u5757${id}\u7EDF\u8BA1\u4FE1\u606F\u5931\u8D25:`, error);
      throw new Error("\u66F4\u65B0\u7EDF\u8BA1\u4FE1\u606F\u5931\u8D25");
    }
  }
  /**
   * 获取测试模块统计摘要
   */
  async getModulesStats() {
    try {
      const countResult = await this.db.prepare("SELECT COUNT(*) as total_modules FROM homepage_modules WHERE is_active = 1").first();
      const sumResult = await this.db.prepare("SELECT SUM(test_count) as total_tests, AVG(rating) as average_rating FROM homepage_modules WHERE is_active = 1").first();
      const themesResult = await this.db.prepare("SELECT DISTINCT theme FROM homepage_modules WHERE is_active = 1").all();
      if (!countResult || !sumResult) {
        return {
          totalModules: 0,
          totalTests: 0,
          averageRating: 0,
          activeThemes: []
        };
      }
      return {
        totalModules: countResult["total_modules"],
        totalTests: sumResult["total_tests"] || 0,
        averageRating: sumResult["average_rating"] || 0,
        activeThemes: themesResult.results?.map((row) => row.theme) || []
      };
    } catch (error) {
      console.error("\u83B7\u53D6\u6D4B\u8BD5\u6A21\u5757\u7EDF\u8BA1\u6458\u8981\u5931\u8D25:", error);
      throw new Error("\u83B7\u53D6\u7EDF\u8BA1\u6458\u8981\u5931\u8D25");
    }
  }
  /**
   * 将数据库行映射为HomepageModule对象
   */
  mapDatabaseRowToModule(row) {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      icon: row.icon,
      theme: row["theme"],
      testCount: row.test_count,
      rating: row.rating,
      isActive: Boolean(row.is_active),
      route: row.route,
      features: JSON.parse(row.features_data),
      estimatedTime: row.estimated_time,
      sortOrder: row.sort_order,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
};

// src/models/HomepageConfigModel.ts
var HomepageConfigModel = class extends BaseModel {
  static {
    __name(this, "HomepageConfigModel");
  }
  constructor(env) {
    super(env, "homepage_config");
  }
  /**
   * 获取所有公开配置
   */
  async getAllPublicConfigs() {
    try {
      const result = await this.db.prepare(`
          SELECT key, value, description 
          FROM homepage_config 
          WHERE is_public = 1
        `).all();
      const configs = {};
      result.results?.forEach((row) => {
        try {
          configs[row["key"]] = JSON.parse(row["value"]);
        } catch (error) {
          console.warn(`\u89E3\u6790\u914D\u7F6E${row["key"]}\u5931\u8D25:`, error);
          configs[row["key"]] = row["value"];
        }
      });
      return configs;
    } catch (error) {
      console.error("\u83B7\u53D6\u9996\u9875\u914D\u7F6E\u5931\u8D25:", error);
      throw new Error("\u83B7\u53D6\u9996\u9875\u914D\u7F6E\u5931\u8D25");
    }
  }
  /**
   * 根据键获取配置
   */
  async getConfigByKey(key) {
    try {
      const result = await this.db.prepare("SELECT value FROM homepage_config WHERE key = ? AND is_public = 1").bind(key).first();
      if (!result) {
        return null;
      }
      try {
        return JSON.parse(result["value"]);
      } catch (error) {
        console.warn(`\u89E3\u6790\u914D\u7F6E${key}\u5931\u8D25:`, error);
        return result["value"];
      }
    } catch (error) {
      console.error(`\u83B7\u53D6\u914D\u7F6E${key}\u5931\u8D25:`, error);
      throw new Error(`\u83B7\u53D6\u914D\u7F6E\u5931\u8D25`);
    }
  }
  /**
   * 更新配置
   */
  async updateConfig(key, value, description) {
    try {
      const jsonValue = typeof value === "string" ? value : JSON.stringify(value);
      await this.db.prepare(`
          INSERT OR REPLACE INTO homepage_config (key, value, description, updated_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `).bind(key, jsonValue, description || "").run();
    } catch (error) {
      console.error(`\u66F4\u65B0\u914D\u7F6E${key}\u5931\u8D25:`, error);
      throw new Error("\u66F4\u65B0\u914D\u7F6E\u5931\u8D25");
    }
  }
  /**
   * 批量更新配置
   */
  async batchUpdateConfigs(configs) {
    try {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO homepage_config (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `);
      const batch = Object.entries(configs).map(([key, value]) => {
        const jsonValue = typeof value === "string" ? value : JSON.stringify(value);
        return stmt.bind(key, jsonValue);
      });
      await this.db.batch(batch);
    } catch (error) {
      console.error("\u6279\u91CF\u66F4\u65B0\u914D\u7F6E\u5931\u8D25:", error);
      throw new Error("\u6279\u91CF\u66F4\u65B0\u914D\u7F6E\u5931\u8D25");
    }
  }
  /**
   * 删除配置
   */
  async deleteConfig(key) {
    try {
      await this.db.prepare("DELETE FROM homepage_config WHERE key = ?").bind(key).run();
    } catch (error) {
      console.error(`\u5220\u9664\u914D\u7F6E${key}\u5931\u8D25:`, error);
      throw new Error("\u5220\u9664\u914D\u7F6E\u5931\u8D25");
    }
  }
  /**
   * 获取配置列表
   */
  async getConfigList() {
    try {
      const result = await this.db.prepare(`
          SELECT key, value, description, is_public, updated_at
          FROM homepage_config
          ORDER BY key ASC
        `).all();
      return result.results?.map(this.mapDatabaseRowToConfig) || [];
    } catch (error) {
      console.error("\u83B7\u53D6\u914D\u7F6E\u5217\u8868\u5931\u8D25:", error);
      throw new Error("\u83B7\u53D6\u914D\u7F6E\u5217\u8868\u5931\u8D25");
    }
  }
  /**
   * 将数据库行映射为HomepageConfigData对象
   */
  mapDatabaseRowToConfig(row) {
    return {
      key: row.key,
      value: row.value,
      description: row.description,
      isPublic: Boolean(row.is_public),
      updatedAt: new Date(row.updated_at)
    };
  }
};

// ../shared/constants/index.ts
var CACHE_KEYS = {
  TEST_CONFIG: "test_config:",
  TEST_RESULT: "test_result:",
  BLOG_ARTICLE: "blog_article:",
  USER_SESSION: "user_session:"
};
var DB_TABLES = {
  TEST_TYPES: "test_types",
  TEST_SESSIONS: "test_sessions",
  BLOG_ARTICLES: "blog_articles",
  USER_FEEDBACK: "user_feedback",
  ANALYTICS_EVENTS: "analytics_events",
  SYS_CONFIGS: "sys_configs"
};

// src/models/AnalyticsEventModel.ts
async function hashString(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hashString, "hashString");
var AnalyticsEventModel = class extends BaseModel {
  static {
    __name(this, "AnalyticsEventModel");
  }
  constructor(env) {
    super(env, DB_TABLES.ANALYTICS_EVENTS);
  }
  /**
   * 创建分析事件
   */
  async create(eventData) {
    this.validateRequired(eventData, ["eventType"]);
    const id = this.generateId();
    const now = this.formatTimestamp();
    const ipAddressHash = eventData.ipAddress ? await hashString(eventData.ipAddress) : null;
    const query = `
      INSERT INTO ${this.tableName} (
        id, event_type, event_data, session_id,
        ip_address_hash, user_agent, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id,
      eventData.eventType,
      eventData.eventData ? JSON.stringify(eventData.eventData) : null,
      eventData.sessionId || null,
      ipAddressHash,
      eventData.userAgent || null,
      now
    ];
    await this.executeRun(query, params);
    return id;
  }
  /**
   * 获取事件统计
   */
  async getEventStats(startDate, endDate, limit = 10) {
    let whereClause = "";
    const params = [];
    if (startDate && endDate) {
      whereClause = "WHERE timestamp BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }
    const query = `
      SELECT 
        event_type,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM ${this.tableName} ${whereClause}), 2) as percentage
      FROM ${this.tableName} 
      ${whereClause}
      GROUP BY event_type
      ORDER BY count DESC
      LIMIT ?
    `;
    params.push(limit);
    const results = await this.executeQuery(query, params);
    return results.map((row) => ({
      eventType: row.event_type,
      count: row.count,
      percentage: row.percentage
    }));
  }
  /**
   * 获取分析概览
   */
  async getOverview(startDate, endDate) {
    const timeRange = startDate && endDate ? `${startDate} to ${endDate}` : "All time";
    let whereClause = "";
    const params = [];
    if (startDate && endDate) {
      whereClause = "WHERE timestamp BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }
    const overviewQuery = `
      SELECT 
        COUNT(*) as total_events,
        COUNT(DISTINCT session_id) as unique_sessions
      FROM ${this.tableName} 
      ${whereClause}
    `;
    const overviewResult = await this.executeQueryFirst(overviewQuery, params);
    const topEvents = await this.getEventStats(startDate, endDate, 5);
    return {
      totalEvents: overviewResult?.total_events || 0,
      uniqueSessions: overviewResult?.unique_sessions || 0,
      topEvents,
      timeRange
    };
  }
  /**
   * 根据事件类型获取事件
   */
  async findByEventType(eventType, limit = 100, startDate, endDate) {
    let whereClause = "WHERE event_type = ?";
    const params = [eventType];
    if (startDate && endDate) {
      whereClause += " AND timestamp BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }
    const query = `
      SELECT * FROM ${this.tableName} 
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT ?
    `;
    params.push(limit);
    return this.executeQuery(query, params);
  }
  /**
   * 根据会话ID获取事件
   */
  async findBySessionId(sessionId) {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE session_id = ? 
      ORDER BY timestamp ASC
    `;
    return this.executeQuery(query, [sessionId]);
  }
  /**
   * 获取每日事件统计
   */
  async getDailyStats(days = 30, eventType) {
    let whereClause = `WHERE timestamp >= datetime('now', '-${days} days')`;
    const params = [];
    if (eventType) {
      whereClause += " AND event_type = ?";
      params.push(eventType);
    }
    const query = `
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as count
      FROM ${this.tableName} 
      ${whereClause}
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `;
    const results = await this.executeQuery(query, params);
    return results.map((row) => ({
      date: row.date,
      count: row.count
    }));
  }
  /**
   * 获取用户行为路径
   */
  async getUserJourney(sessionId) {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE session_id = ? 
      ORDER BY timestamp ASC
    `;
    return this.executeQuery(query, [sessionId]);
  }
  /**
   * 删除过期的分析事件（数据清理）
   */
  async deleteExpiredEvents(daysOld = 90) {
    const cutoffDate = /* @__PURE__ */ new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffTimestamp = this.formatTimestamp(cutoffDate);
    const query = `DELETE FROM ${this.tableName} WHERE timestamp < ?`;
    const result = await this.executeRun(query, [cutoffTimestamp]);
    return result.changes || 0;
  }
  /**
   * 批量创建事件（用于高频事件）
   */
  async createBatch(events) {
    if (events.length === 0) {
      return 0;
    }
    const now = this.formatTimestamp();
    const values = [];
    const params = [];
    for (const eventData of events) {
      const id = this.generateId();
      const ipAddressHash = eventData.ipAddress ? await hashString(eventData.ipAddress) : null;
      values.push("(?, ?, ?, ?, ?, ?, ?)");
      params.push(
        id,
        eventData.eventType,
        eventData.eventData ? JSON.stringify(eventData.eventData) : null,
        eventData.sessionId || null,
        ipAddressHash,
        eventData.userAgent || null,
        now
      );
    }
    const query = `
      INSERT INTO ${this.tableName} (
        id, event_type, event_data, session_id,
        ip_address_hash, user_agent, timestamp
      ) VALUES ${values.join(", ")}
    `;
    const result = await this.executeRun(query, params);
    return result.changes || 0;
  }
};

// src/routes/homepage/index.ts
var homepageRoutes = new Hono2();
homepageRoutes.get("/config", async (c) => {
  try {
    const dbService = c.get("dbService");
    const configModel = new HomepageConfigModel(dbService.env);
    const configs = await configModel.getAllPublicConfigs();
    return c.json({
      success: true,
      data: configs,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId") || ""
    });
  } catch (error) {
    console.error("\u83B7\u53D6\u9996\u9875\u914D\u7F6E\u5931\u8D25:", error);
    return c.json({
      success: false,
      error: "\u83B7\u53D6\u9996\u9875\u914D\u7F6E\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId") || ""
    }, 500);
  }
});
homepageRoutes.get("/modules", async (c) => {
  try {
    const dbService = c.get("dbService");
    const moduleModel = new HomepageModuleModel(dbService.env);
    const modules = await moduleModel.getAllActiveModules();
    return c.json({
      success: true,
      data: modules,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId") || ""
    });
  } catch (error) {
    console.error("\u83B7\u53D6\u6D4B\u8BD5\u6A21\u5757\u5217\u8868\u5931\u8D25:", error);
    return c.json({
      success: false,
      error: "\u83B7\u53D6\u6D4B\u8BD5\u6A21\u5757\u5217\u8868\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId") || ""
    }, 500);
  }
});
homepageRoutes.get("/modules/:theme", async (c) => {
  try {
    const theme = c.req.param("theme");
    const dbService = c.get("dbService");
    const moduleModel = new HomepageModuleModel(dbService.env);
    const modules = await moduleModel.getModulesByTheme(theme);
    return c.json({
      success: true,
      data: modules,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId") || ""
    });
  } catch (error) {
    console.error(`\u83B7\u53D6${c.req.param("theme")}\u4E3B\u9898\u6D4B\u8BD5\u6A21\u5757\u5931\u8D25:`, error);
    return c.json({
      success: false,
      error: "\u83B7\u53D6\u6D4B\u8BD5\u6A21\u5757\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId") || ""
    }, 500);
  }
});
homepageRoutes.get("/stats", async (c) => {
  try {
    const dbService = c.get("dbService");
    const testQuery = await dbService.db.prepare("SELECT COUNT(*) as count FROM homepage_modules").first();
    console.log("Test query result:", testQuery);
    const moduleModel = new HomepageModuleModel(dbService.env);
    const stats = await moduleModel.getModulesStats();
    return c.json({
      success: true,
      data: stats,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId") || ""
    });
  } catch (error) {
    console.error("\u83B7\u53D6\u9996\u9875\u7EDF\u8BA1\u6570\u636E\u5931\u8D25:", error);
    return c.json({
      success: false,
      error: "\u83B7\u53D6\u7EDF\u8BA1\u6570\u636E\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId") || ""
    }, 500);
  }
});
homepageRoutes.post("/analytics", async (c) => {
  try {
    const body = await c.req.json();
    const { eventType, eventData, sessionId, pageUrl, referrer } = body;
    if (!eventType || !pageUrl) {
      return c.json({
        success: false,
        error: "\u7F3A\u5C11\u5FC5\u8981\u53C2\u6570",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId") || ""
      }, 400);
    }
    const dbService = c.get("dbService");
    const analyticsModel = new AnalyticsEventModel(dbService.db);
    await analyticsModel.create({
      eventType: `homepage_${eventType}`,
      eventData: {
        ...eventData,
        pageUrl,
        referrer
      },
      sessionId,
      userAgent: c.req.header("User-Agent") || "",
      ipAddress: c.req.header("CF-Connecting-IP") || ""
    });
    return c.json({
      success: true,
      message: "\u4E8B\u4EF6\u8BB0\u5F55\u6210\u529F",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId") || ""
    });
  } catch (error) {
    console.error("\u8BB0\u5F55\u7528\u6237\u884C\u4E3A\u4E8B\u4EF6\u5931\u8D25:", error);
    return c.json({
      success: false,
      error: "\u8BB0\u5F55\u4E8B\u4EF6\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId") || ""
    }, 500);
  }
});
homepageRoutes.get("/config/:key", async (c) => {
  try {
    const key = c.req.param("key");
    const dbService = c.get("dbService");
    const configModel = new HomepageConfigModel(dbService.db);
    const config = await configModel.getConfigByKey(key);
    if (!config) {
      return c.json({
        success: false,
        error: "\u914D\u7F6E\u4E0D\u5B58\u5728",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId") || ""
      }, 404);
    }
    return c.json({
      success: true,
      data: config,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId") || ""
    });
  } catch (error) {
    console.error(`\u83B7\u53D6\u914D\u7F6E${c.req.param("key")}\u5931\u8D25:`, error);
    return c.json({
      success: false,
      error: "\u83B7\u53D6\u914D\u7F6E\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId") || ""
    }, 500);
  }
});

// src/models/SearchIndexModel.ts
var SearchIndexModel = class extends BaseModel {
  static {
    __name(this, "SearchIndexModel");
  }
  constructor(env) {
    super(env, "search_index");
  }
  /**
   * 搜索内容
   */
  async search(query, language = "zh-CN", limit = 20) {
    try {
      console.log("\u5F00\u59CB\u641C\u7D22\uFF0C\u53C2\u6570:", { query, language, limit });
      const mockResults = [
        {
          id: "search-001",
          contentType: "test",
          contentId: "psychology",
          title: "\u5FC3\u7406\u5065\u5EB7\u6D4B\u8BD5",
          description: "\u63ED\u79D8\u4F60\u7684\u6027\u683C\u5BC6\u7801",
          relevanceScore: 100,
          searchCount: 0
        },
        {
          id: "search-002",
          contentType: "test",
          contentId: "astrology",
          title: "\u661F\u5EA7\u8FD0\u52BF\u5206\u6790",
          description: "\u4ECA\u65E5\u8FD0\u52BF\u65E9\u77E5\u9053",
          relevanceScore: 95,
          searchCount: 0
        }
      ];
      console.log("\u8FD4\u56DE\u6A21\u62DF\u641C\u7D22\u7ED3\u679C:", mockResults);
      return mockResults;
    } catch (error) {
      console.error("\u641C\u7D22\u5931\u8D25:", error);
      throw new Error("\u641C\u7D22\u5931\u8D25");
    }
  }
  /**
   * 获取搜索建议
   */
  async getSearchSuggestions(query, language = "zh-CN", limit = 10) {
    try {
      const result = await this.db.prepare(`
          SELECT DISTINCT title, content_type, relevance_score
          FROM search_index 
          WHERE language = ? 
            AND (
              title LIKE ? OR 
              keywords LIKE ?
            )
          ORDER BY relevance_score DESC, search_count DESC
          LIMIT ?
        `).bind(
        language,
        `%${query}%`,
        `%${query}%`,
        limit
      ).all();
      return result.results?.map((row, index) => ({
        id: `suggestion_${index}`,
        text: row["title"],
        type: row["content_type"],
        relevance: row["relevance_score"]
      })) || [];
    } catch (error) {
      console.error("\u83B7\u53D6\u641C\u7D22\u5EFA\u8BAE\u5931\u8D25:", error);
      throw new Error("\u83B7\u53D6\u641C\u7D22\u5EFA\u8BAE\u5931\u8D25");
    }
  }
  /**
   * 获取热门搜索关键词
   */
  async getPopularKeywords(language = "zh-CN", limit = 10) {
    try {
      const result = await this.db.prepare(`
          SELECT keyword 
          FROM popular_search_keywords 
          WHERE language = ? 
          ORDER BY search_count DESC 
          LIMIT ?
        `).bind(language, limit).all();
      return result.results?.map((row) => row["keyword"]) || [];
    } catch (error) {
      console.error("\u83B7\u53D6\u70ED\u95E8\u5173\u952E\u8BCD\u5931\u8D25:", error);
      throw new Error("\u83B7\u53D6\u70ED\u95E8\u5173\u952E\u8BCD\u5931\u8D25");
    }
  }
  /**
   * 增加搜索次数
   */
  async incrementSearchCount(id) {
    try {
      await this.db.prepare(`
          UPDATE search_index 
          SET search_count = search_count + 1, last_searched = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).bind(id).run();
    } catch (error) {
      console.error(`\u589E\u52A0\u641C\u7D22\u6B21\u6570\u5931\u8D25:`, error);
    }
  }
  /**
   * 记录搜索关键词
   */
  async recordSearchKeyword(keyword, language = "zh-CN") {
    try {
      await this.db.prepare(`
          INSERT INTO popular_search_keywords (id, keyword, language, search_count)
          VALUES (?, ?, ?, 1)
          ON CONFLICT(keyword) DO UPDATE SET 
            search_count = search_count + 1,
            last_searched = CURRENT_TIMESTAMP
        `).bind(crypto.randomUUID(), keyword, language).run();
    } catch (error) {
      console.error(`\u8BB0\u5F55\u641C\u7D22\u5173\u952E\u8BCD\u5931\u8D25:`, error);
    }
  }
  /**
   * 添加搜索索引
   */
  async addSearchIndex(data) {
    try {
      const id = crypto.randomUUID();
      await this.db.prepare(`
          INSERT INTO search_index (
            id, content_type, content_id, title, description, content, 
            keywords, language, relevance_score, search_count
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
        id,
        data.contentType,
        data.contentId,
        data.title,
        data.description || "",
        data.content || "",
        data.keywords || "",
        data.language,
        data.relevanceScore,
        data.searchCount
      ).run();
      return id;
    } catch (error) {
      console.error("\u6DFB\u52A0\u641C\u7D22\u7D22\u5F15\u5931\u8D25:", error);
      throw new Error("\u6DFB\u52A0\u641C\u7D22\u7D22\u5F15\u5931\u8D25");
    }
  }
  /**
   * 更新搜索索引
   */
  async updateSearchIndex(id, data) {
    try {
      const updates = [];
      const values = [];
      if (data.title !== void 0) {
        updates.push("title = ?");
        values.push(data.title);
      }
      if (data.description !== void 0) {
        updates.push("description = ?");
        values.push(data.description);
      }
      if (data.content !== void 0) {
        updates.push("content = ?");
        values.push(data.content);
      }
      if (data.keywords !== void 0) {
        updates.push("keywords = ?");
        values.push(data.keywords);
      }
      if (data.relevanceScore !== void 0) {
        updates.push("relevance_score = ?");
        values.push(data.relevanceScore);
      }
      if (updates.length === 0) return;
      updates.push("updated_at = CURRENT_TIMESTAMP");
      values.push(id);
      await this.db.prepare(`
          UPDATE search_index 
          SET ${updates.join(", ")}
          WHERE id = ?
        `).bind(...values).run();
    } catch (error) {
      console.error(`\u66F4\u65B0\u641C\u7D22\u7D22\u5F15\u5931\u8D25:`, error);
      throw new Error("\u66F4\u65B0\u641C\u7D22\u7D22\u5F15\u5931\u8D25");
    }
  }
  /**
   * 删除搜索索引
   */
  async deleteSearchIndex(id) {
    try {
      await this.db.prepare("DELETE FROM search_index WHERE id = ?").bind(id).run();
    } catch (error) {
      console.error(`\u5220\u9664\u641C\u7D22\u7D22\u5F15\u5931\u8D25:`, error);
      throw new Error("\u5220\u9664\u641C\u7D22\u7D22\u5F15\u5931\u8D25");
    }
  }
  /**
   * 将数据库行映射为SearchResult对象
   */
  // private mapDatabaseRowToSearchResult(row: any): SearchResult { // 未使用，暂时注释
  //   return {
  //     id: row.id as string,
  //     contentType: row.content_type as string,
  //     contentId: row.content_id as string,
  //     title: row.title as string,
  //     description: row.description as string,
  //     relevanceScore: row.relevance_score as number,
  //     searchCount: row.search_count as number,
  //   };
  // }
};

// src/routes/search/index.ts
var searchRoutes = new Hono2();
searchRoutes.get("/", async (c) => {
  try {
    const query = c.req.query("q");
    const language = c.req.query("lang") || "zh-CN";
    const limit = parseInt(c.req.query("limit") || "20");
    if (!query || query.trim().length === 0) {
      return c.json({
        success: false,
        error: "\u641C\u7D22\u5173\u952E\u8BCD\u4E0D\u80FD\u4E3A\u7A7A",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId")
      }, 400);
    }
    const dbService = c.get("dbService");
    const searchModel = new SearchIndexModel(dbService.env);
    const analyticsModel = new AnalyticsEventModel(dbService.env);
    const results = await searchModel.search(query.trim(), language, limit);
    await analyticsModel.create({
      eventType: "search_query",
      eventData: {
        query: query.trim(),
        language,
        resultCount: results.length,
        limit
      },
      userAgent: c.req.header("User-Agent") || "",
      ipAddress: c.req.header("CF-Connecting-IP") || ""
    });
    await searchModel.recordSearchKeyword(query.trim(), language);
    return c.json({
      success: true,
      data: {
        query: query.trim(),
        results,
        total: results.length,
        language
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    });
  } catch (error) {
    console.error("\u641C\u7D22\u5931\u8D25:", error);
    console.error("\u9519\u8BEF\u8BE6\u60C5:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return c.json({
      success: false,
      error: "\u641C\u7D22\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    }, 500);
  }
});
searchRoutes.get("/suggestions", async (c) => {
  try {
    const query = c.req.query("q");
    const language = c.req.query("lang") || "zh-CN";
    const limit = parseInt(c.req.query("limit") || "10");
    if (!query || query.trim().length === 0) {
      return c.json({
        success: true,
        data: [],
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId")
      });
    }
    const dbService = c.get("dbService");
    const searchModel = new SearchIndexModel(dbService.env);
    const suggestions = await searchModel.getSearchSuggestions(query.trim(), language, limit);
    return c.json({
      success: true,
      data: suggestions,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    });
  } catch (error) {
    console.error("\u83B7\u53D6\u641C\u7D22\u5EFA\u8BAE\u5931\u8D25:", error);
    return c.json({
      success: false,
      error: "\u83B7\u53D6\u641C\u7D22\u5EFA\u8BAE\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    }, 500);
  }
});
searchRoutes.get("/popular", async (c) => {
  try {
    const language = c.req.query("lang") || "zh-CN";
    const limit = parseInt(c.req.query("limit") || "10");
    const dbService = c.get("dbService");
    const searchModel = new SearchIndexModel(dbService.env);
    const keywords = await searchModel.getPopularKeywords(language, limit);
    return c.json({
      success: true,
      data: keywords,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    });
  } catch (error) {
    console.error("\u83B7\u53D6\u70ED\u95E8\u5173\u952E\u8BCD\u5931\u8D25:", error);
    return c.json({
      success: false,
      error: "\u83B7\u53D6\u70ED\u95E8\u5173\u952E\u8BCD\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    }, 500);
  }
});
searchRoutes.get("/stats", async (c) => {
  try {
    const dbService = c.get("dbService");
    const totalSearches = await dbService.db.prepare("SELECT COUNT(*) as count FROM analytics_events WHERE event_type LIKE 'search_%'").first();
    const totalKeywords = await dbService.db.prepare("SELECT COUNT(*) as count FROM popular_search_keywords").first();
    const recentSearches = await dbService.db.prepare(`
        SELECT event_data, timestamp 
        FROM analytics_events 
        WHERE event_type = 'search_query' 
        ORDER BY timestamp DESC 
        LIMIT 10
      `).all();
    const stats = {
      totalSearches: totalSearches?.count || 0,
      totalKeywords: totalKeywords?.count || 0,
      recentSearches: recentSearches.results?.map((row) => ({
        data: JSON.parse(row.event_data),
        timestamp: row.timestamp
      })) || []
    };
    return c.json({
      success: true,
      data: stats,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    });
  } catch (error) {
    console.error("\u83B7\u53D6\u641C\u7D22\u7EDF\u8BA1\u5931\u8D25:", error);
    return c.json({
      success: false,
      error: "\u83B7\u53D6\u641C\u7D22\u7EDF\u8BA1\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    }, 500);
  }
});
searchRoutes.post("/click", async (c) => {
  try {
    const body = await c.req.json();
    const { searchIndexId, resultType, resultId } = body;
    if (!searchIndexId) {
      return c.json({
        success: false,
        error: "\u7F3A\u5C11\u5FC5\u8981\u53C2\u6570",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId")
      }, 400);
    }
    const dbService = c.get("dbService");
    const searchModel = new SearchIndexModel(dbService.env);
    const analyticsModel = new AnalyticsEventModel(dbService.env);
    await searchModel.incrementSearchCount(searchIndexId);
    await analyticsModel.create({
      eventType: "search_result_click",
      eventData: {
        searchIndexId,
        resultType,
        resultId
      },
      userAgent: c.req.header("User-Agent") || "",
      ipAddress: c.req.header("CF-Connecting-IP") || ""
    });
    return c.json({
      success: true,
      message: "\u70B9\u51FB\u8BB0\u5F55\u6210\u529F",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    });
  } catch (error) {
    console.error("\u8BB0\u5F55\u641C\u7D22\u7ED3\u679C\u70B9\u51FB\u5931\u8D25:", error);
    return c.json({
      success: false,
      error: "\u8BB0\u5F55\u70B9\u51FB\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    }, 500);
  }
});

// src/models/UserPreferencesModel.ts
var UserPreferencesModel = class extends BaseModel {
  static {
    __name(this, "UserPreferencesModel");
  }
  constructor(env) {
    super(env, "user_preferences");
  }
  /**
   * 创建或更新用户偏好设置
   */
  async upsertPreferences(preferences) {
    try {
      const id = crypto.randomUUID();
      await this.db.prepare(`
          INSERT OR REPLACE INTO user_preferences (
            id, session_id, language, theme, cookies_consent, analytics_consent,
            marketing_consent, notification_enabled, search_history_enabled, 
            personalized_content, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(
        id,
        preferences.sessionId || null,
        preferences.language,
        preferences.theme,
        preferences.cookiesConsent ? 1 : 0,
        preferences.analyticsConsent ? 1 : 0,
        preferences.marketingConsent ? 1 : 0,
        preferences.notificationEnabled ? 1 : 0,
        preferences.searchHistoryEnabled ? 1 : 0,
        preferences.personalizedContent ? 1 : 0
      ).run();
      return id;
    } catch (error) {
      console.error("\u521B\u5EFA\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u5931\u8D25:", error);
      throw new Error("\u521B\u5EFA\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u5931\u8D25");
    }
  }
  /**
   * 根据会话ID获取用户偏好设置
   */
  async getPreferencesBySessionId(sessionId) {
    try {
      const result = await this.db.prepare("SELECT * FROM user_preferences WHERE session_id = ?").bind(sessionId).first();
      return result ? this.mapDatabaseRowToPreferences(result) : null;
    } catch (error) {
      console.error(`\u83B7\u53D6\u4F1A\u8BDD${sessionId}\u7684\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u5931\u8D25:`, error);
      throw new Error("\u83B7\u53D6\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u5931\u8D25");
    }
  }
  /**
   * 更新Cookies同意状态
   */
  async updateCookiesConsent(sessionId, consent) {
    try {
      await this.db.prepare(`
          INSERT OR REPLACE INTO user_preferences (
            id, session_id, cookies_consent, analytics_consent, marketing_consent, 
            language, theme, notification_enabled, search_history_enabled, 
            personalized_content, created_at, updated_at
          ) VALUES (
            ?, ?, ?, ?, ?, 'zh-CN', 'auto', 1, 1, 1, 
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )
        `).bind(
        crypto.randomUUID(),
        sessionId,
        consent.cookiesConsent ? 1 : 0,
        consent.analyticsConsent ? 1 : 0,
        consent.marketingConsent ? 1 : 0
      ).run();
    } catch (error) {
      console.error(`\u66F4\u65B0\u4F1A\u8BDD${sessionId}\u7684Cookies\u540C\u610F\u72B6\u6001\u5931\u8D25:`, error);
      throw new Error("\u66F4\u65B0Cookies\u540C\u610F\u72B6\u6001\u5931\u8D25");
    }
  }
  /**
   * 获取Cookies同意统计
   */
  async getCookiesConsentStats() {
    try {
      const result = await this.db.prepare(`
          SELECT 
            COUNT(*) as total_users,
            SUM(cookies_consent) as cookies_consent,
            SUM(analytics_consent) as analytics_consent,
            SUM(marketing_consent) as marketing_consent
          FROM user_preferences
        `).first();
      if (!result) {
        return {
          totalUsers: 0,
          cookiesConsent: 0,
          analyticsConsent: 0,
          marketingConsent: 0,
          consentRate: 0
        };
      }
      const totalUsers = result["total_users"];
      const cookiesConsent = result["cookies_consent"] || 0;
      const analyticsConsent = result["analytics_consent"] || 0;
      const marketingConsent = result["marketing_consent"] || 0;
      return {
        totalUsers,
        cookiesConsent,
        analyticsConsent,
        marketingConsent,
        consentRate: totalUsers > 0 ? cookiesConsent / totalUsers * 100 : 0
      };
    } catch (error) {
      console.error("\u83B7\u53D6Cookies\u540C\u610F\u7EDF\u8BA1\u5931\u8D25:", error);
      throw new Error("\u83B7\u53D6Cookies\u540C\u610F\u7EDF\u8BA1\u5931\u8D25");
    }
  }
  /**
   * 清理过期的用户偏好设置
   */
  async cleanupExpiredPreferences(daysOld = 365) {
    try {
      const result = await this.db.prepare(`
          DELETE FROM user_preferences 
          WHERE updated_at < datetime('now', '-${daysOld} days')
            AND session_id IS NOT NULL
        `).run();
      return result.meta.changes || 0;
    } catch (error) {
      console.error("\u6E05\u7406\u8FC7\u671F\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u5931\u8D25:", error);
      throw new Error("\u6E05\u7406\u8FC7\u671F\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u5931\u8D25");
    }
  }
  /**
   * 获取用户偏好设置列表
   */
  async getPreferencesList(limit = 100, offset = 0) {
    try {
      const result = await this.db.prepare(`
          SELECT * FROM user_preferences 
          ORDER BY updated_at DESC 
          LIMIT ? OFFSET ?
        `).bind(limit, offset).all();
      return result.results?.map(this.mapDatabaseRowToPreferences) || [];
    } catch (error) {
      console.error("\u83B7\u53D6\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u5217\u8868\u5931\u8D25:", error);
      throw new Error("\u83B7\u53D6\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u5217\u8868\u5931\u8D25");
    }
  }
  /**
   * 删除用户偏好设置
   */
  async deletePreferences(id) {
    try {
      await this.db.prepare("DELETE FROM user_preferences WHERE id = ?").bind(id).run();
    } catch (error) {
      console.error(`\u5220\u9664\u7528\u6237\u504F\u597D\u8BBE\u7F6E${id}\u5931\u8D25:`, error);
      throw new Error("\u5220\u9664\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u5931\u8D25");
    }
  }
  /**
   * 将数据库行映射为UserPreferencesData对象
   */
  mapDatabaseRowToPreferences(row) {
    return {
      id: row.id,
      sessionId: row.session_id,
      language: row.language,
      theme: row.theme,
      cookiesConsent: Boolean(row.cookies_consent),
      analyticsConsent: Boolean(row.analytics_consent),
      marketingConsent: Boolean(row.marketing_consent),
      notificationEnabled: Boolean(row.notification_enabled),
      searchHistoryEnabled: Boolean(row.search_history_enabled),
      personalizedContent: Boolean(row.personalized_content),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
};

// src/routes/cookies/index.ts
var cookiesRoutes = new Hono2();
cookiesRoutes.get("/consent/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param("sessionId");
    const dbService = c.get("dbService");
    const preferencesModel = new UserPreferencesModel(dbService.env);
    const preferences = await preferencesModel.getPreferencesBySessionId(sessionId);
    if (!preferences) {
      return c.json({
        success: true,
        data: {
          cookiesConsent: false,
          analyticsConsent: false,
          marketingConsent: false,
          hasPreferences: false
        },
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId")
      });
    }
    return c.json({
      success: true,
      data: {
        cookiesConsent: preferences.cookiesConsent,
        analyticsConsent: preferences.analyticsConsent,
        marketingConsent: preferences.marketingConsent,
        hasPreferences: true,
        language: preferences.language,
        theme: preferences.theme
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    });
  } catch (error) {
    console.error("\u83B7\u53D6Cookies\u540C\u610F\u72B6\u6001\u5931\u8D25:", error);
    return c.json({
      success: false,
      error: "\u83B7\u53D6Cookies\u540C\u610F\u72B6\u6001\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    }, 500);
  }
});
cookiesRoutes.post("/consent", async (c) => {
  try {
    const body = await c.req.json();
    const { sessionId, cookiesConsent, analyticsConsent, marketingConsent } = body;
    if (!sessionId || typeof cookiesConsent !== "boolean") {
      return c.json({
        success: false,
        error: "\u7F3A\u5C11\u5FC5\u8981\u53C2\u6570",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId")
      }, 400);
    }
    const dbService = c.get("dbService");
    const preferencesModel = new UserPreferencesModel(dbService.env);
    const analyticsModel = new AnalyticsEventModel(dbService.env);
    await preferencesModel.updateCookiesConsent(sessionId, {
      sessionId,
      cookiesConsent,
      analyticsConsent: analyticsConsent || false,
      marketingConsent: marketingConsent || false,
      timestamp: /* @__PURE__ */ new Date()
    });
    await analyticsModel.create({
      eventType: "cookies_consent_updated",
      eventData: {
        sessionId,
        cookiesConsent,
        analyticsConsent: analyticsConsent || false,
        marketingConsent: marketingConsent || false
      },
      userAgent: c.req.header("User-Agent") || "",
      ipAddress: c.req.header("CF-Connecting-IP") || ""
    });
    return c.json({
      success: true,
      message: "Cookies\u540C\u610F\u72B6\u6001\u66F4\u65B0\u6210\u529F",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    });
  } catch (error) {
    console.error("\u66F4\u65B0Cookies\u540C\u610F\u72B6\u6001\u5931\u8D25:", error);
    return c.json({
      success: false,
      error: "\u66F4\u65B0Cookies\u540C\u610F\u72B6\u6001\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    }, 500);
  }
});
cookiesRoutes.get("/preferences/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param("sessionId");
    const dbService = c.get("dbService");
    const preferencesModel = new UserPreferencesModel(dbService.env);
    const preferences = await preferencesModel.getPreferencesBySessionId(sessionId);
    if (!preferences) {
      return c.json({
        success: false,
        error: "\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u4E0D\u5B58\u5728",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId")
      }, 404);
    }
    return c.json({
      success: true,
      data: preferences,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    });
  } catch (error) {
    console.error("\u83B7\u53D6\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u5931\u8D25:", error);
    return c.json({
      success: false,
      error: "\u83B7\u53D6\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    }, 500);
  }
});
cookiesRoutes.put("/preferences/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param("sessionId");
    const body = await c.req.json();
    const { language, theme, notificationEnabled, searchHistoryEnabled, personalizedContent } = body;
    const dbService = c.get("dbService");
    const preferencesModel = new UserPreferencesModel(dbService.env);
    const existingPreferences = await preferencesModel.getPreferencesBySessionId(sessionId);
    if (!existingPreferences) {
      return c.json({
        success: false,
        error: "\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u4E0D\u5B58\u5728",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: c.get("requestId")
      }, 404);
    }
    const updatedPreferences = {
      ...existingPreferences,
      language: language || existingPreferences.language,
      theme: theme || existingPreferences.theme,
      notificationEnabled: notificationEnabled !== void 0 ? notificationEnabled : existingPreferences.notificationEnabled,
      searchHistoryEnabled: searchHistoryEnabled !== void 0 ? searchHistoryEnabled : existingPreferences.searchHistoryEnabled,
      personalizedContent: personalizedContent !== void 0 ? personalizedContent : existingPreferences.personalizedContent
    };
    await preferencesModel.upsertPreferences(updatedPreferences);
    return c.json({
      success: true,
      message: "\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u66F4\u65B0\u6210\u529F",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    });
  } catch (error) {
    console.error("\u66F4\u65B0\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u5931\u8D25:", error);
    return c.json({
      success: false,
      error: "\u66F4\u65B0\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    }, 500);
  }
});
cookiesRoutes.get("/stats", async (c) => {
  try {
    const dbService = c.get("dbService");
    const preferencesModel = new UserPreferencesModel(dbService.env);
    const stats = await preferencesModel.getCookiesConsentStats();
    return c.json({
      success: true,
      data: stats,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    });
  } catch (error) {
    console.error("\u83B7\u53D6Cookies\u7EDF\u8BA1\u4FE1\u606F\u5931\u8D25:", error);
    return c.json({
      success: false,
      error: "\u83B7\u53D6Cookies\u7EDF\u8BA1\u4FE1\u606F\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    }, 500);
  }
});
cookiesRoutes.post("/cleanup", async (c) => {
  try {
    const body = await c.req.json();
    const { daysOld = 365 } = body;
    const dbService = c.get("dbService");
    const preferencesModel = new UserPreferencesModel(dbService.env);
    const deletedCount = await preferencesModel.cleanupExpiredPreferences(daysOld);
    return c.json({
      success: true,
      data: {
        deletedCount,
        message: `\u5DF2\u6E05\u7406${daysOld}\u5929\u524D\u7684\u8FC7\u671F\u504F\u597D\u8BBE\u7F6E`
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    });
  } catch (error) {
    console.error("\u6E05\u7406\u8FC7\u671F\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u5931\u8D25:", error);
    return c.json({
      success: false,
      error: "\u6E05\u7406\u8FC7\u671F\u7528\u6237\u504F\u597D\u8BBE\u7F6E\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    }, 500);
  }
});
cookiesRoutes.post("/withdraw/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param("sessionId");
    const dbService = c.get("dbService");
    const preferencesModel = new UserPreferencesModel(dbService.env);
    const analyticsModel = new AnalyticsEventModel(dbService.env);
    await preferencesModel.updateCookiesConsent(sessionId, {
      sessionId,
      cookiesConsent: false,
      analyticsConsent: false,
      marketingConsent: false,
      timestamp: /* @__PURE__ */ new Date()
    });
    await analyticsModel.create({
      eventType: "cookies_consent_withdrawn",
      eventData: {
        sessionId,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      },
      userAgent: c.req.header("User-Agent") || "",
      ipAddress: c.req.header("CF-Connecting-IP") || ""
    });
    return c.json({
      success: true,
      message: "Cookies\u540C\u610F\u5DF2\u64A4\u56DE",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    });
  } catch (error) {
    console.error("\u64A4\u56DECookies\u540C\u610F\u5931\u8D25:", error);
    return c.json({
      success: false,
      error: "\u64A4\u56DECookies\u540C\u610F\u5931\u8D25",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId")
    }, 500);
  }
});

// src/utils/migrationRunner.ts
var MigrationRunner = class {
  static {
    __name(this, "MigrationRunner");
  }
  db;
  constructor(env) {
    if (!env.DB) {
      throw new ModuleError("Database connection not available", ERROR_CODES.DATABASE_ERROR, 500);
    }
    this.db = env.DB;
  }
  /**
   * 初始化迁移表
   */
  async initMigrationTable() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS migrations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    try {
      const result = await this.db.prepare(createTableSQL).run();
      if (!result.success) {
        throw new Error(result.error || "Failed to create migrations table");
      }
    } catch (error) {
      throw new ModuleError(
        `Failed to initialize migration table: ${error instanceof Error ? error.message : "Unknown error"}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
  /**
   * 获取已应用的迁移
   */
  async getAppliedMigrations() {
    try {
      const result = await this.db.prepare("SELECT id FROM migrations ORDER BY applied_at ASC").all();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch applied migrations");
      }
      return result.results.map((row) => row.id);
    } catch (error) {
      throw new ModuleError(
        `Failed to get applied migrations: ${error instanceof Error ? error.message : "Unknown error"}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
  /**
   * 应用单个迁移
   */
  async applyMigration(migration) {
    try {
      const migrationResult = await this.db.prepare(migration.sql).run();
      if (!migrationResult.success) {
        throw new Error(migrationResult.error || "Migration SQL execution failed");
      }
      const recordResult = await this.db.prepare("INSERT INTO migrations (id, name, applied_at) VALUES (?, ?, ?)").bind(migration.id, migration.name, (/* @__PURE__ */ new Date()).toISOString()).run();
      if (!recordResult.success) {
        throw new Error(recordResult.error || "Failed to record migration");
      }
      console.log(`Applied migration: ${migration.id} - ${migration.name}`);
    } catch (error) {
      throw new ModuleError(
        `Failed to apply migration ${migration.id}: ${error instanceof Error ? error.message : "Unknown error"}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
  /**
   * 运行所有待应用的迁移
   */
  async runMigrations(migrations) {
    try {
      await this.initMigrationTable();
      const appliedMigrations = await this.getAppliedMigrations();
      const pendingMigrations = migrations.filter(
        (migration) => !appliedMigrations.includes(migration.id)
      );
      if (pendingMigrations.length === 0) {
        console.log("No pending migrations to apply");
        return;
      }
      console.log(`Applying ${pendingMigrations.length} pending migrations...`);
      for (const migration of pendingMigrations) {
        await this.applyMigration(migration);
      }
      console.log("All migrations applied successfully");
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        `Migration runner failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
  /**
   * 获取迁移状态
   */
  async getMigrationStatus(migrations) {
    try {
      await this.initMigrationTable();
      const appliedMigrationIds = await this.getAppliedMigrations();
      const applied = migrations.filter(
        (migration) => appliedMigrationIds.includes(migration.id)
      );
      const pending = migrations.filter(
        (migration) => !appliedMigrationIds.includes(migration.id)
      );
      return { applied, pending };
    } catch (error) {
      throw new ModuleError(
        `Failed to get migration status: ${error instanceof Error ? error.message : "Unknown error"}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
};

// src/models/TestTypeModel.ts
var TestTypeModel = class extends BaseModel {
  static {
    __name(this, "TestTypeModel");
  }
  constructor(env) {
    super(env, DB_TABLES.TEST_TYPES);
  }
  /**
   * 创建测试类型
   */
  async create(testTypeData) {
    this.validateRequired(testTypeData, ["id", "name", "category", "config"]);
    const now = this.formatTimestamp();
    const query = `
      INSERT INTO ${this.tableName} (
        id, name, category, description, config_data,
        is_active, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      testTypeData.id,
      testTypeData.name,
      testTypeData.category,
      testTypeData.description || null,
      JSON.stringify(testTypeData.config),
      testTypeData.isActive !== false ? 1 : 0,
      testTypeData.sortOrder || 0,
      now,
      now
    ];
    await this.executeRun(query, params);
    const cacheKey = `${CACHE_KEYS.TEST_CONFIG}${testTypeData.id}`;
    await this.setCache(cacheKey, testTypeData.config, 3600);
    return testTypeData.id;
  }
  /**
   * 获取所有活跃的测试类型
   */
  async getAllActive() {
    const cacheKey = "active_test_types";
    const cached = await this.getCache(cacheKey);
    if (cached) {
      return cached;
    }
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE is_active = 1 
      ORDER BY sort_order ASC, name ASC
    `;
    const results = await this.executeQuery(query);
    await this.setCache(cacheKey, results, 1800);
    return results;
  }
  /**
   * 根据ID获取测试类型
   */
  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return this.executeQueryFirst(query, [id]);
  }
  /**
   * 根据分类获取测试类型
   */
  async findByCategory(category) {
    const cacheKey = `test_types_category:${category}`;
    const cached = await this.getCache(cacheKey);
    if (cached) {
      return cached;
    }
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE category = ? AND is_active = 1 
      ORDER BY sort_order ASC, name ASC
    `;
    const results = await this.executeQuery(query, [category]);
    await this.setCache(cacheKey, results, 1800);
    return results;
  }
  /**
   * 获取测试配置
   */
  async getConfig(id) {
    const cacheKey = `${CACHE_KEYS.TEST_CONFIG}${id}`;
    const cached = await this.getCache(cacheKey);
    if (cached) {
      return cached;
    }
    const testType = await this.findById(id);
    if (!testType) {
      return null;
    }
    try {
      const config = JSON.parse(testType.configData);
      await this.setCache(cacheKey, config, 3600);
      return config;
    } catch (error) {
      console.error("Failed to parse test config:", error);
      return null;
    }
  }
  /**
   * 更新测试类型
   */
  async update(id, updateData) {
    const now = this.formatTimestamp();
    const fields = [];
    const params = [];
    if (updateData.name !== void 0) {
      fields.push("name = ?");
      params.push(updateData.name);
    }
    if (updateData.category !== void 0) {
      fields.push("category = ?");
      params.push(updateData.category);
    }
    if (updateData.description !== void 0) {
      fields.push("description = ?");
      params.push(updateData.description);
    }
    if (updateData.config !== void 0) {
      fields.push("config_data = ?");
      params.push(JSON.stringify(updateData.config));
    }
    if (updateData.isActive !== void 0) {
      fields.push("is_active = ?");
      params.push(updateData.isActive ? 1 : 0);
    }
    if (updateData.sortOrder !== void 0) {
      fields.push("sort_order = ?");
      params.push(updateData.sortOrder);
    }
    if (fields.length === 0) {
      return;
    }
    fields.push("updated_at = ?");
    params.push(now);
    params.push(id);
    const query = `
      UPDATE ${this.tableName} 
      SET ${fields.join(", ")} 
      WHERE id = ?
    `;
    await this.executeRun(query, params);
    await this.deleteCache(`${CACHE_KEYS.TEST_CONFIG}${id}`);
    await this.deleteCache("active_test_types");
  }
  /**
   * 删除测试类型（软删除 - 设置为不活跃）
   */
  async softDelete(id) {
    await this.update(id, { isActive: false });
  }
  /**
   * 获取所有分类
   */
  async getCategories() {
    const cacheKey = "test_categories";
    const cached = await this.getCache(cacheKey);
    if (cached) {
      return cached;
    }
    const query = `
      SELECT DISTINCT category 
      FROM ${this.tableName} 
      WHERE is_active = 1 
      ORDER BY category ASC
    `;
    const results = await this.executeQuery(query);
    const categories = results.map((row) => row.category);
    await this.setCache(cacheKey, categories, 3600);
    return categories;
  }
};

// src/models/TestSessionModel.ts
async function hashString2(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hashString2, "hashString");
var TestSessionModel = class extends BaseModel {
  static {
    __name(this, "TestSessionModel");
  }
  constructor(env) {
    super(env, DB_TABLES.TEST_SESSIONS);
  }
  /**
   * 创建测试会话
   */
  async create(sessionData) {
    this.validateRequired(sessionData, ["testTypeId", "answers", "result"]);
    const id = this.generateId();
    const now = this.formatTimestamp();
    const ipAddressHash = sessionData.ipAddress ? await hashString2(sessionData.ipAddress) : null;
    const query = `
      INSERT INTO ${this.tableName} (
        id, test_type_id, answers_data, result_data,
        user_agent, ip_address_hash, session_duration, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id,
      sessionData.testTypeId,
      JSON.stringify(sessionData.answers),
      JSON.stringify(sessionData.result),
      sessionData.userAgent || null,
      ipAddressHash,
      sessionData.sessionDuration || null,
      now
    ];
    await this.executeRun(query, params);
    const cacheKey = `${CACHE_KEYS.TEST_RESULT}${id}`;
    await this.setCache(cacheKey, {
      id,
      testTypeId: sessionData.testTypeId,
      result: sessionData.result,
      createdAt: now
    }, 86400);
    return id;
  }
  /**
   * 根据ID获取测试会话
   */
  async findById(id) {
    const cacheKey = `${CACHE_KEYS.TEST_RESULT}${id}`;
    const cached = await this.getCache(cacheKey);
    if (cached) {
      return cached;
    }
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const result = await this.executeQueryFirst(query, [id]);
    if (result) {
      await this.setCache(cacheKey, result, 3600);
    }
    return result;
  }
  /**
   * 根据测试类型获取统计数据
   */
  async getStatsByTestType(testTypeId) {
    const cacheKey = `test_stats:${testTypeId}`;
    const cached = await this.getCache(cacheKey);
    if (cached) {
      return cached;
    }
    const query = `
      SELECT 
        COUNT(*) as total_sessions,
        AVG(CAST(json_extract(result_data, '$.overallScore') AS REAL)) as avg_score,
        COUNT(CASE WHEN json_extract(result_data, '$.completed') = 'true' THEN 1 END) * 100.0 / COUNT(*) as completion_rate
      FROM ${this.tableName} 
      WHERE test_type_id = ?
    `;
    const result = await this.executeQueryFirst(query, [testTypeId]);
    const stats = {
      totalSessions: result?.total_sessions || 0,
      averageScore: result?.avg_score || 0,
      completionRate: result?.completion_rate || 0
    };
    await this.setCache(cacheKey, stats, 1800);
    return stats;
  }
  /**
   * 获取最近的测试会话
   */
  async getRecentSessions(limit = 10) {
    const query = `
      SELECT * FROM ${this.tableName} 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    return this.executeQuery(query, [limit]);
  }
  /**
   * 根据时间范围获取会话数量
   */
  async getSessionCountByDateRange(startDate, endDate, testTypeId) {
    let query = `
      SELECT COUNT(*) as count 
      FROM ${this.tableName} 
      WHERE created_at BETWEEN ? AND ?
    `;
    const params = [startDate, endDate];
    if (testTypeId) {
      query += " AND test_type_id = ?";
      params.push(testTypeId);
    }
    const result = await this.executeQueryFirst(query, params);
    return result?.count || 0;
  }
  /**
   * 删除过期的测试会话（数据清理）
   */
  async deleteExpiredSessions(daysOld = 90) {
    const cutoffDate = /* @__PURE__ */ new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffTimestamp = this.formatTimestamp(cutoffDate);
    const query = `DELETE FROM ${this.tableName} WHERE created_at < ?`;
    const result = await this.executeRun(query, [cutoffTimestamp]);
    return result.changes || 0;
  }
  /**
   * 更新会话持续时间
   */
  async updateSessionDuration(id, duration) {
    const query = `
      UPDATE ${this.tableName} 
      SET session_duration = ? 
      WHERE id = ?
    `;
    await this.executeRun(query, [duration, id]);
    const cacheKey = `${CACHE_KEYS.TEST_RESULT}${id}`;
    await this.deleteCache(cacheKey);
  }
};

// src/models/BlogArticleModel.ts
var BlogArticleModel = class extends BaseModel {
  static {
    __name(this, "BlogArticleModel");
  }
  constructor(env) {
    super(env, DB_TABLES.BLOG_ARTICLES);
  }
  /**
   * 创建博客文章
   */
  async create(articleData) {
    this.validateRequired(articleData, ["title", "content"]);
    const id = this.generateId();
    const now = this.formatTimestamp();
    const query = `
      INSERT INTO ${this.tableName} (
        id, title, content, excerpt, category, tags_data,
        view_count, like_count, is_published, is_featured,
        published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id,
      articleData.title,
      articleData.content,
      articleData.excerpt || null,
      articleData.category || null,
      JSON.stringify(articleData.tags || []),
      0,
      // view_count
      0,
      // like_count
      articleData.isPublished !== false ? 1 : 0,
      articleData.isFeatured === true ? 1 : 0,
      articleData.publishedAt || (articleData.isPublished !== false ? now : null),
      now,
      now
    ];
    await this.executeRun(query, params);
    await this.deleteCache("blog_articles_list");
    await this.deleteCache("featured_articles");
    return id;
  }
  /**
   * 获取文章列表（分页）
   */
  async getList(page = 1, limit = 10, category) {
    const offset = (page - 1) * limit;
    const cacheKey = `blog_list:${page}:${limit}:${category || "all"}`;
    const cached = await this.getCache(cacheKey);
    if (cached) {
      return cached;
    }
    let whereClause = "WHERE is_published = 1";
    const params = [];
    if (category) {
      whereClause += " AND category = ?";
      params.push(category);
    }
    const countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} ${whereClause}`;
    const countResult = await this.executeQueryFirst(countQuery, params);
    const total = countResult?.total || 0;
    const listQuery = `
      SELECT 
        id, title, excerpt, category, tags_data,
        view_count, like_count, published_at, created_at
      FROM ${this.tableName} 
      ${whereClause}
      ORDER BY published_at DESC, created_at DESC
      LIMIT ? OFFSET ?
    `;
    const articles = await this.executeQuery(listQuery, [...params, limit, offset]);
    const data = articles.map((article) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      tags: JSON.parse(article.tags_data || "[]"),
      viewCount: article.view_count,
      likeCount: article.like_count,
      publishedAt: article.published_at,
      createdAt: article.created_at
    }));
    const totalPages = Math.ceil(total / limit);
    const result = {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
    await this.setCache(cacheKey, result, 900);
    return result;
  }
  /**
   * 根据ID获取文章详情
   */
  async findById(id) {
    const cacheKey = `${CACHE_KEYS.BLOG_ARTICLE}${id}`;
    const cached = await this.getCache(cacheKey);
    if (cached) {
      return cached;
    }
    const query = `SELECT * FROM ${this.tableName} WHERE id = ? AND is_published = 1`;
    const result = await this.executeQueryFirst(query, [id]);
    if (result) {
      await this.setCache(cacheKey, result, 1800);
    }
    return result;
  }
  /**
   * 增加文章浏览量
   */
  async incrementViewCount(id) {
    const query = `
      UPDATE ${this.tableName} 
      SET view_count = view_count + 1 
      WHERE id = ?
    `;
    await this.executeRun(query, [id]);
    await this.deleteCache(`${CACHE_KEYS.BLOG_ARTICLE}${id}`);
  }
  /**
   * 增加文章点赞数
   */
  async incrementLikeCount(id) {
    const query = `
      UPDATE ${this.tableName} 
      SET like_count = like_count + 1 
      WHERE id = ?
    `;
    await this.executeRun(query, [id]);
    await this.deleteCache(`${CACHE_KEYS.BLOG_ARTICLE}${id}`);
  }
  /**
   * 获取精选文章
   */
  async getFeaturedArticles(limit = 5) {
    const cacheKey = "featured_articles";
    const cached = await this.getCache(cacheKey);
    if (cached) {
      return cached;
    }
    const query = `
      SELECT 
        id, title, excerpt, category, tags_data,
        view_count, like_count, published_at, created_at
      FROM ${this.tableName} 
      WHERE is_published = 1 AND is_featured = 1
      ORDER BY published_at DESC
      LIMIT ?
    `;
    const articles = await this.executeQuery(query, [limit]);
    const data = articles.map((article) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      tags: JSON.parse(article.tags_data || "[]"),
      viewCount: article.view_count,
      likeCount: article.like_count,
      publishedAt: article.published_at,
      createdAt: article.created_at
    }));
    await this.setCache(cacheKey, data, 1800);
    return data;
  }
  /**
   * 获取热门文章
   */
  async getPopularArticles(limit = 5) {
    const cacheKey = "popular_articles";
    const cached = await this.getCache(cacheKey);
    if (cached) {
      return cached;
    }
    const query = `
      SELECT 
        id, title, excerpt, category, tags_data,
        view_count, like_count, published_at, created_at
      FROM ${this.tableName} 
      WHERE is_published = 1
      ORDER BY view_count DESC, like_count DESC
      LIMIT ?
    `;
    const articles = await this.executeQuery(query, [limit]);
    const data = articles.map((article) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      tags: JSON.parse(article.tags_data || "[]"),
      viewCount: article.view_count,
      likeCount: article.like_count,
      publishedAt: article.published_at,
      createdAt: article.created_at
    }));
    await this.setCache(cacheKey, data, 1800);
    return data;
  }
  /**
   * 获取所有分类
   */
  async getCategories() {
    const cacheKey = "blog_categories";
    const cached = await this.getCache(cacheKey);
    if (cached) {
      return cached;
    }
    const query = `
      SELECT DISTINCT category 
      FROM ${this.tableName} 
      WHERE is_published = 1 AND category IS NOT NULL
      ORDER BY category ASC
    `;
    const results = await this.executeQuery(query);
    const categories = results.map((row) => row.category);
    await this.setCache(cacheKey, categories, 3600);
    return categories;
  }
  /**
   * 搜索文章
   */
  async search(keyword, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const searchTerm = `%${keyword}%`;
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM ${this.tableName} 
      WHERE is_published = 1 
      AND (title LIKE ? OR content LIKE ? OR excerpt LIKE ?)
    `;
    const countResult = await this.executeQueryFirst(
      countQuery,
      [searchTerm, searchTerm, searchTerm]
    );
    const total = countResult?.total || 0;
    const searchQuery = `
      SELECT 
        id, title, excerpt, category, tags_data,
        view_count, like_count, published_at, created_at
      FROM ${this.tableName} 
      WHERE is_published = 1 
      AND (title LIKE ? OR content LIKE ? OR excerpt LIKE ?)
      ORDER BY published_at DESC
      LIMIT ? OFFSET ?
    `;
    const articles = await this.executeQuery(
      searchQuery,
      [searchTerm, searchTerm, searchTerm, limit, offset]
    );
    const data = articles.map((article) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      tags: JSON.parse(article.tags_data || "[]"),
      viewCount: article.view_count,
      likeCount: article.like_count,
      publishedAt: article.published_at,
      createdAt: article.created_at
    }));
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }
};

// src/models/UserFeedbackModel.ts
var UserFeedbackModel = class extends BaseModel {
  static {
    __name(this, "UserFeedbackModel");
  }
  constructor(env) {
    super(env, DB_TABLES.USER_FEEDBACK);
  }
  /**
   * 创建用户反馈
   */
  async create(feedbackData) {
    this.validateRequired(feedbackData, ["feedbackType"]);
    const id = this.generateId();
    const now = this.formatTimestamp();
    const query = `
      INSERT INTO ${this.tableName} (
        id, session_id, feedback_type, content, rating, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id,
      feedbackData.sessionId || null,
      feedbackData.feedbackType,
      feedbackData.content || null,
      feedbackData.rating || null,
      now
    ];
    await this.executeRun(query, params);
    await this.deleteCache("feedback_stats");
    return id;
  }
  /**
   * 获取反馈统计
   */
  async getStats() {
    const cacheKey = "feedback_stats";
    const cached = await this.getCache(cacheKey);
    if (cached) {
      return cached;
    }
    const query = `
      SELECT 
        COUNT(*) as total_feedback,
        COUNT(CASE WHEN feedback_type = 'like' THEN 1 END) as positive_count,
        COUNT(CASE WHEN feedback_type = 'dislike' THEN 1 END) as negative_count,
        AVG(CASE WHEN rating IS NOT NULL THEN rating END) as average_rating,
        COUNT(CASE WHEN feedback_type = 'comment' THEN 1 END) as comment_count
      FROM ${this.tableName}
    `;
    const result = await this.executeQueryFirst(query);
    const stats = {
      totalFeedback: result?.total_feedback || 0,
      positiveCount: result?.positive_count || 0,
      negativeCount: result?.negative_count || 0,
      averageRating: result?.average_rating || 0,
      commentCount: result?.comment_count || 0
    };
    await this.setCache(cacheKey, stats, 1800);
    return stats;
  }
  /**
   * 根据会话ID获取反馈
   */
  async findBySessionId(sessionId) {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE session_id = ? 
      ORDER BY created_at DESC
    `;
    return this.executeQuery(query, [sessionId]);
  }
  /**
   * 获取最近的反馈
   */
  async getRecentFeedback(limit = 20) {
    const query = `
      SELECT * FROM ${this.tableName} 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    return this.executeQuery(query, [limit]);
  }
  /**
   * 获取评论反馈
   */
  async getComments(limit = 50) {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE feedback_type = 'comment' AND content IS NOT NULL
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    return this.executeQuery(query, [limit]);
  }
  /**
   * 根据时间范围获取反馈统计
   */
  async getStatsByDateRange(startDate, endDate) {
    const query = `
      SELECT 
        COUNT(*) as total_feedback,
        COUNT(CASE WHEN feedback_type = 'like' THEN 1 END) as positive_count,
        COUNT(CASE WHEN feedback_type = 'dislike' THEN 1 END) as negative_count,
        AVG(CASE WHEN rating IS NOT NULL THEN rating END) as average_rating,
        COUNT(CASE WHEN feedback_type = 'comment' THEN 1 END) as comment_count
      FROM ${this.tableName}
      WHERE created_at BETWEEN ? AND ?
    `;
    const result = await this.executeQueryFirst(query, [startDate, endDate]);
    return {
      totalFeedback: result?.total_feedback || 0,
      positiveCount: result?.positive_count || 0,
      negativeCount: result?.negative_count || 0,
      averageRating: result?.average_rating || 0,
      commentCount: result?.comment_count || 0
    };
  }
  /**
   * 删除过期的反馈（数据清理）
   */
  async deleteExpiredFeedback(daysOld = 365) {
    const cutoffDate = /* @__PURE__ */ new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffTimestamp = this.formatTimestamp(cutoffDate);
    const query = `DELETE FROM ${this.tableName} WHERE created_at < ?`;
    const result = await this.executeRun(query, [cutoffTimestamp]);
    await this.deleteCache("feedback_stats");
    return result.changes || 0;
  }
};

// src/models/PsychologySessionModel.ts
var PsychologySessionModel = class extends BaseModel {
  static {
    __name(this, "PsychologySessionModel");
  }
  constructor(env) {
    super(env, "psychology_sessions");
  }
  async create(data) {
    const id = this.generateId();
    const result = await this.db.prepare(`
        INSERT INTO psychology_sessions (
          id, test_session_id, test_subtype, personality_type,
          dimension_scores, risk_level, happiness_domains, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
      id,
      data.testSessionId,
      data.testSubtype,
      data.personalityType || null,
      data.dimensionScores ? JSON.stringify(data.dimensionScores) : null,
      data.riskLevel || null,
      data.happinessDomains ? JSON.stringify(data.happinessDomains) : null,
      (/* @__PURE__ */ new Date()).toISOString()
    ).run();
    if (!result.success) {
      throw this.createError("Failed to create psychology session", "DATABASE_ERROR");
    }
    return id;
  }
  async findByTestSessionId(testSessionId) {
    const result = await this.db.prepare("SELECT * FROM psychology_sessions WHERE test_session_id = ?").bind(testSessionId).first();
    if (!result) {
      return null;
    }
    return this.mapToData(result);
  }
  async findBySubtype(subtype) {
    const results = await this.db.prepare("SELECT * FROM psychology_sessions WHERE test_subtype = ? ORDER BY created_at DESC").bind(subtype).all();
    return results.results.map((result) => this.mapToData(result));
  }
  async getStatsBySubtype(subtype) {
    const totalResult = await this.db.prepare("SELECT COUNT(*) as total FROM psychology_sessions WHERE test_subtype = ?").bind(subtype).first();
    const stats = {
      totalSessions: totalResult?.["total"] || 0
    };
    if (subtype === "mbti") {
      const typeDistribution = await this.db.prepare(`
          SELECT personality_type, COUNT(*) as count 
          FROM psychology_sessions 
          WHERE test_subtype = ? AND personality_type IS NOT NULL
          GROUP BY personality_type
        `).bind(subtype).all();
      const distribution = {};
      typeDistribution.results.forEach((row) => {
        distribution[row.personality_type] = row.count;
      });
      return { ...stats, personalityTypeDistribution: distribution };
    }
    return stats;
  }
  mapToData(row) {
    return {
      id: row.id,
      testSessionId: row.test_session_id,
      testSubtype: row.test_subtype,
      personalityType: row.personality_type ?? "",
      dimensionScores: row.dimension_scores ? JSON.parse(row.dimension_scores) : void 0,
      riskLevel: row.risk_level ?? "minimal",
      happinessDomains: row.happiness_domains ? JSON.parse(row.happiness_domains) : void 0,
      createdAt: new Date(row.created_at)
    };
  }
};

// src/models/AstrologySessionModel.ts
var AstrologySessionModel = class extends BaseModel {
  static {
    __name(this, "AstrologySessionModel");
  }
  constructor(env) {
    super(env, "astrology_sessions");
  }
  async create(data) {
    const id = this.generateId();
    const result = await this.db.prepare(`
        INSERT INTO astrology_sessions (
          id, test_session_id, birth_date, birth_time, birth_location,
          sun_sign, moon_sign, rising_sign, planetary_positions,
          house_positions, aspects, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
      id,
      data.testSessionId,
      data.birthDate.toISOString().split("T")[0],
      // YYYY-MM-DD format
      data.birthTime || null,
      data.birthLocation || null,
      data.sunSign,
      data.moonSign || null,
      data.risingSign || null,
      data.planetaryPositions ? JSON.stringify(data.planetaryPositions) : null,
      data.housePositions ? JSON.stringify(data.housePositions) : null,
      data.aspects ? JSON.stringify(data.aspects) : null,
      (/* @__PURE__ */ new Date()).toISOString()
    ).run();
    if (!result.success) {
      throw this.createError("Failed to create astrology session", "DATABASE_ERROR");
    }
    return id;
  }
  async findByTestSessionId(testSessionId) {
    const result = await this.db.prepare("SELECT * FROM astrology_sessions WHERE test_session_id = ?").bind(testSessionId).first();
    if (!result) {
      return null;
    }
    return this.mapToData(result);
  }
  async findBySunSign(sunSign) {
    const results = await this.db.prepare("SELECT * FROM astrology_sessions WHERE sun_sign = ? ORDER BY created_at DESC").bind(sunSign).all();
    return results.results.map((result) => this.mapToData(result));
  }
  async getSunSignDistribution() {
    const results = await this.db.prepare(`
        SELECT sun_sign, COUNT(*) as count 
        FROM astrology_sessions 
        GROUP BY sun_sign
        ORDER BY count DESC
      `).all();
    const distribution = {};
    results.results.forEach((row) => {
      distribution[row.sun_sign] = row.count;
    });
    return distribution;
  }
  async findByBirthDateRange(startDate, endDate) {
    const results = await this.db.prepare(`
        SELECT * FROM astrology_sessions 
        WHERE birth_date BETWEEN ? AND ? 
        ORDER BY birth_date DESC
      `).bind(
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
    ).all();
    return results.results.map((result) => this.mapToData(result));
  }
  mapToData(row) {
    return {
      id: row.id,
      testSessionId: row.test_session_id,
      birthDate: new Date(row.birth_date),
      birthTime: row.birth_time ?? "",
      birthLocation: row.birth_location ?? "",
      sunSign: row.sun_sign,
      moonSign: row.moon_sign ?? "",
      risingSign: row.rising_sign ?? "",
      planetaryPositions: row.planetary_positions ? JSON.parse(row.planetary_positions) : void 0,
      housePositions: row.house_positions ? JSON.parse(row.house_positions) : void 0,
      aspects: row.aspects ? JSON.parse(row.aspects) : void 0,
      createdAt: new Date(row.created_at)
    };
  }
};

// src/models/TarotSessionModel.ts
var TarotSessionModel = class extends BaseModel {
  static {
    __name(this, "TarotSessionModel");
  }
  constructor(env) {
    super(env, "tarot_sessions");
  }
  async create(data) {
    const id = this.generateId();
    const result = await this.db.prepare(`
        INSERT INTO tarot_sessions (
          id, test_session_id, spread_type, cards_drawn,
          card_positions, interpretation_theme, question_category, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
      id,
      data.testSessionId,
      data.spreadType,
      JSON.stringify(data.cardsDrawn),
      data.cardPositions ? JSON.stringify(data.cardPositions) : null,
      data.interpretationTheme || null,
      data.questionCategory || null,
      (/* @__PURE__ */ new Date()).toISOString()
    ).run();
    if (!result.success) {
      throw this.createError("Failed to create tarot session", "DATABASE_ERROR");
    }
    return id;
  }
  async findByTestSessionId(testSessionId) {
    const result = await this.db.prepare("SELECT * FROM tarot_sessions WHERE test_session_id = ?").bind(testSessionId).first();
    if (!result) {
      return null;
    }
    return this.mapToData(result);
  }
  async findBySpreadType(spreadType) {
    const results = await this.db.prepare("SELECT * FROM tarot_sessions WHERE spread_type = ? ORDER BY created_at DESC").bind(spreadType).all();
    return results.results.map((result) => this.mapToData(result));
  }
  async findByQuestionCategory(category) {
    const results = await this.db.prepare("SELECT * FROM tarot_sessions WHERE question_category = ? ORDER BY created_at DESC").bind(category).all();
    return results.results.map((result) => this.mapToData(result));
  }
  async getSpreadTypeStats() {
    const results = await this.db.prepare(`
        SELECT spread_type, COUNT(*) as count 
        FROM tarot_sessions 
        GROUP BY spread_type
        ORDER BY count DESC
      `).all();
    const stats = {};
    results.results.forEach((row) => {
      stats[row.spread_type] = row.count;
    });
    return stats;
  }
  async getPopularCards(limit = 10) {
    const results = await this.db.prepare(`
        SELECT cards_drawn, COUNT(*) as session_count
        FROM tarot_sessions 
        GROUP BY cards_drawn
        ORDER BY session_count DESC
        LIMIT ?
      `).bind(limit).all();
    const cardCounts = {};
    results.results.forEach((row) => {
      try {
        const cards = JSON.parse(row.cards_drawn);
        cards.forEach((card) => {
          cardCounts[card.name] = (cardCounts[card.name] || 0) + 1;
        });
      } catch (error) {
        console.warn("Failed to parse cards_drawn JSON:", error);
      }
    });
    return Object.entries(cardCounts).sort(([, a], [, b]) => b - a).slice(0, limit).map(([cardName, count]) => ({ cardName, count }));
  }
  mapToData(row) {
    return {
      id: row.id,
      testSessionId: row.test_session_id,
      spreadType: row.spread_type,
      cardsDrawn: JSON.parse(row.cards_drawn),
      cardPositions: row.card_positions ? JSON.parse(row.card_positions) : void 0,
      interpretationTheme: row.interpretation_theme ?? "",
      questionCategory: row.question_category ?? "general",
      createdAt: new Date(row.created_at)
    };
  }
};

// src/models/CareerSessionModel.ts
var CareerSessionModel = class extends BaseModel {
  static {
    __name(this, "CareerSessionModel");
  }
  constructor(env) {
    super(env, "career_sessions");
  }
  async create(data) {
    const id = this.generateId();
    const result = await this.db.prepare(`
        INSERT INTO career_sessions (
          id, test_session_id, test_subtype, holland_code,
          interest_scores, values_ranking, skills_profile,
          career_matches, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
      id,
      data.testSessionId,
      data.testSubtype,
      data.hollandCode || null,
      data.interestScores ? JSON.stringify(data.interestScores) : null,
      data.valuesRanking ? JSON.stringify(data.valuesRanking) : null,
      data.skillsProfile ? JSON.stringify(data.skillsProfile) : null,
      data.careerMatches ? JSON.stringify(data.careerMatches) : null,
      (/* @__PURE__ */ new Date()).toISOString()
    ).run();
    if (!result.success) {
      throw this.createError("Failed to create career session", "DATABASE_ERROR");
    }
    return id;
  }
  async findByTestSessionId(testSessionId) {
    const result = await this.db.prepare("SELECT * FROM career_sessions WHERE test_session_id = ?").bind(testSessionId).first();
    if (!result) {
      return null;
    }
    return this.mapToData(result);
  }
  async findBySubtype(subtype) {
    const results = await this.db.prepare("SELECT * FROM career_sessions WHERE test_subtype = ? ORDER BY created_at DESC").bind(subtype).all();
    return results.results.map((result) => this.mapToData(result));
  }
  async getHollandCodeDistribution() {
    const results = await this.db.prepare(`
        SELECT holland_code, COUNT(*) as count 
        FROM career_sessions 
        WHERE holland_code IS NOT NULL
        GROUP BY holland_code
        ORDER BY count DESC
      `).all();
    const distribution = {};
    results.results.forEach((row) => {
      distribution[row.holland_code] = row.count;
    });
    return distribution;
  }
  async getPopularCareers(limit = 20) {
    const results = await this.db.prepare("SELECT career_matches FROM career_sessions WHERE career_matches IS NOT NULL").all();
    const careerCounts = {};
    results.results.forEach((row) => {
      try {
        const matches = JSON.parse(row.career_matches);
        matches.forEach((match) => {
          careerCounts[match.title] = (careerCounts[match.title] || 0) + 1;
        });
      } catch (error) {
        console.warn("Failed to parse career_matches JSON:", error);
      }
    });
    return Object.entries(careerCounts).sort(([, a], [, b]) => b - a).slice(0, limit).map(([title, count]) => ({ title, count }));
  }
  async getAverageInterestScores() {
    const results = await this.db.prepare("SELECT interest_scores FROM career_sessions WHERE interest_scores IS NOT NULL").all();
    const scoreTotals = {};
    results.results.forEach((row) => {
      try {
        const scores = JSON.parse(row.interest_scores);
        Object.entries(scores).forEach(([interest, score]) => {
          if (!scoreTotals[interest]) {
            scoreTotals[interest] = { sum: 0, count: 0 };
          }
          scoreTotals[interest].sum += score;
          scoreTotals[interest].count += 1;
        });
      } catch (error) {
        console.warn("Failed to parse interest_scores JSON:", error);
      }
    });
    const averages = {};
    Object.entries(scoreTotals).forEach(([interest, { sum, count }]) => {
      averages[interest] = Math.round(sum / count * 100) / 100;
    });
    return averages;
  }
  mapToData(row) {
    return {
      id: row.id,
      testSessionId: row.test_session_id,
      testSubtype: row.test_subtype,
      hollandCode: row.holland_code ?? "",
      interestScores: row.interest_scores ? JSON.parse(row.interest_scores) : void 0,
      valuesRanking: row.values_ranking ? JSON.parse(row.values_ranking) : void 0,
      skillsProfile: row.skills_profile ? JSON.parse(row.skills_profile) : void 0,
      careerMatches: row.career_matches ? JSON.parse(row.career_matches) : void 0,
      createdAt: new Date(row.created_at)
    };
  }
};

// src/models/LearningSessionModel.ts
var LearningSessionModel = class extends BaseModel {
  static {
    __name(this, "LearningSessionModel");
  }
  constructor(env) {
    super(env, "learning_sessions");
  }
  async create(data) {
    const id = this.generateId();
    const result = await this.db.prepare(`
        INSERT INTO learning_sessions (
          id, test_session_id, test_subtype, learning_style,
          cognitive_score, percentile_rank, learning_preferences,
          strategy_recommendations, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
      id,
      data.testSessionId,
      data.testSubtype,
      data.learningStyle || null,
      data.cognitiveScore || null,
      data.percentileRank || null,
      data.learningPreferences ? JSON.stringify(data.learningPreferences) : null,
      data.strategyRecommendations ? JSON.stringify(data.strategyRecommendations) : null,
      (/* @__PURE__ */ new Date()).toISOString()
    ).run();
    if (!result.success) {
      throw this.createError("Failed to create learning session", "DATABASE_ERROR");
    }
    return id;
  }
  async findByTestSessionId(testSessionId) {
    const result = await this.db.prepare("SELECT * FROM learning_sessions WHERE test_session_id = ?").bind(testSessionId).first();
    if (!result) {
      return null;
    }
    return this.mapToData(result);
  }
  async findBySubtype(subtype) {
    const results = await this.db.prepare("SELECT * FROM learning_sessions WHERE test_subtype = ? ORDER BY created_at DESC").bind(subtype).all();
    return results.results.map((result) => this.mapToData(result));
  }
  async getLearningStyleDistribution() {
    const results = await this.db.prepare(`
        SELECT learning_style, COUNT(*) as count 
        FROM learning_sessions 
        WHERE learning_style IS NOT NULL
        GROUP BY learning_style
        ORDER BY count DESC
      `).all();
    const distribution = {};
    results.results.forEach((row) => {
      distribution[row.learning_style] = row.count;
    });
    return distribution;
  }
  async getCognitiveScoreStats() {
    const results = await this.db.prepare(`
        SELECT 
          AVG(cognitive_score) as avg_score,
          MIN(cognitive_score) as min_score,
          MAX(cognitive_score) as max_score,
          COUNT(*) as count
        FROM learning_sessions 
        WHERE cognitive_score IS NOT NULL
      `).first();
    const medianResult = await this.db.prepare(`
        SELECT cognitive_score
        FROM learning_sessions 
        WHERE cognitive_score IS NOT NULL
        ORDER BY cognitive_score
        LIMIT 1 OFFSET (
          SELECT (COUNT(*) - 1) / 2 
          FROM learning_sessions 
          WHERE cognitive_score IS NOT NULL
        )
      `).first();
    return {
      average: Math.round((results?.["avg_score"] || 0) * 100) / 100,
      median: medianResult?.["cognitive_score"] || 0,
      min: results?.["min_score"] || 0,
      max: results?.["max_score"] || 0,
      count: results?.["count"] || 0
    };
  }
  async getPercentileDistribution() {
    const results = await this.db.prepare(`
        SELECT 
          CASE 
            WHEN percentile_rank >= 90 THEN '90-100'
            WHEN percentile_rank >= 75 THEN '75-89'
            WHEN percentile_rank >= 50 THEN '50-74'
            WHEN percentile_rank >= 25 THEN '25-49'
            ELSE '0-24'
          END as percentile_range,
          COUNT(*) as count
        FROM learning_sessions 
        WHERE percentile_rank IS NOT NULL
        GROUP BY percentile_range
        ORDER BY percentile_range DESC
      `).all();
    const distribution = {};
    results.results.forEach((row) => {
      distribution[row.percentile_range] = row.count;
    });
    return distribution;
  }
  mapToData(row) {
    return {
      id: row.id,
      testSessionId: row.test_session_id,
      testSubtype: row.test_subtype,
      learningStyle: row.learning_style ?? "visual",
      cognitiveScore: row.cognitive_score ?? 0,
      percentileRank: row.percentile_rank ?? 0,
      learningPreferences: row.learning_preferences ? JSON.parse(row.learning_preferences) : void 0,
      strategyRecommendations: row.strategy_recommendations ? JSON.parse(row.strategy_recommendations) : void 0,
      createdAt: new Date(row.created_at)
    };
  }
};

// src/models/RelationshipSessionModel.ts
var RelationshipSessionModel = class extends BaseModel {
  static {
    __name(this, "RelationshipSessionModel");
  }
  constructor(env) {
    super(env, "relationship_sessions");
  }
  async create(data) {
    const id = this.generateId();
    const result = await this.db.prepare(`
        INSERT INTO relationship_sessions (
          id, test_session_id, test_subtype, primary_love_language,
          secondary_love_language, attachment_style, relationship_skills,
          communication_style, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
      id,
      data.testSessionId,
      data.testSubtype,
      data.primaryLoveLanguage || null,
      data.secondaryLoveLanguage || null,
      data.attachmentStyle || null,
      data.relationshipSkills ? JSON.stringify(data.relationshipSkills) : null,
      data.communicationStyle || null,
      (/* @__PURE__ */ new Date()).toISOString()
    ).run();
    if (!result.success) {
      throw this.createError("Failed to create relationship session", "DATABASE_ERROR");
    }
    return id;
  }
  async findByTestSessionId(testSessionId) {
    const result = await this.db.prepare("SELECT * FROM relationship_sessions WHERE test_session_id = ?").bind(testSessionId).first();
    if (!result) {
      return null;
    }
    return this.mapToData(result);
  }
  async findBySubtype(subtype) {
    const results = await this.db.prepare("SELECT * FROM relationship_sessions WHERE test_subtype = ? ORDER BY created_at DESC").bind(subtype).all();
    return results.results.map((result) => this.mapToData(result));
  }
  async getLoveLanguageDistribution() {
    const results = await this.db.prepare(`
        SELECT primary_love_language, COUNT(*) as count 
        FROM relationship_sessions 
        WHERE primary_love_language IS NOT NULL
        GROUP BY primary_love_language
        ORDER BY count DESC
      `).all();
    const distribution = {};
    results.results.forEach((row) => {
      distribution[row.primary_love_language] = row.count;
    });
    return distribution;
  }
  async getAttachmentStyleDistribution() {
    const results = await this.db.prepare(`
        SELECT attachment_style, COUNT(*) as count 
        FROM relationship_sessions 
        WHERE attachment_style IS NOT NULL
        GROUP BY attachment_style
        ORDER BY count DESC
      `).all();
    const distribution = {};
    results.results.forEach((row) => {
      distribution[row.attachment_style] = row.count;
    });
    return distribution;
  }
  async getCommunicationStyleDistribution() {
    const results = await this.db.prepare(`
        SELECT communication_style, COUNT(*) as count 
        FROM relationship_sessions 
        WHERE communication_style IS NOT NULL
        GROUP BY communication_style
        ORDER BY count DESC
      `).all();
    const distribution = {};
    results.results.forEach((row) => {
      distribution[row.communication_style] = row.count;
    });
    return distribution;
  }
  async getAverageRelationshipSkills() {
    const results = await this.db.prepare("SELECT relationship_skills FROM relationship_sessions WHERE relationship_skills IS NOT NULL").all();
    const skillTotals = {};
    results.results.forEach((row) => {
      try {
        const skills = JSON.parse(row.relationship_skills);
        Object.entries(skills).forEach(([skill, score]) => {
          if (!skillTotals[skill]) {
            skillTotals[skill] = { sum: 0, count: 0 };
          }
          skillTotals[skill].sum += score;
          skillTotals[skill].count += 1;
        });
      } catch (error) {
        console.warn("Failed to parse relationship_skills JSON:", error);
      }
    });
    const averages = {};
    Object.entries(skillTotals).forEach(([skill, { sum, count }]) => {
      averages[skill] = Math.round(sum / count * 100) / 100;
    });
    return averages;
  }
  async findCompatiblePairs() {
    const results = await this.db.prepare(`
        SELECT 
          primary_love_language,
          attachment_style,
          COUNT(*) as count
        FROM relationship_sessions 
        WHERE primary_love_language IS NOT NULL 
          AND attachment_style IS NOT NULL
        GROUP BY primary_love_language, attachment_style
        ORDER BY count DESC
        LIMIT 10
      `).all();
    return results.results.map((row) => ({
      loveLanguage: row.primary_love_language,
      attachmentStyle: row.attachment_style,
      count: row.count
    }));
  }
  mapToData(row) {
    return {
      id: row.id,
      testSessionId: row.test_session_id,
      testSubtype: row.test_subtype,
      primaryLoveLanguage: row.primary_love_language || void 0,
      secondaryLoveLanguage: row.secondary_love_language || void 0,
      attachmentStyle: row.attachment_style || void 0,
      relationshipSkills: row.relationship_skills ? JSON.parse(row.relationship_skills) : void 0,
      communicationStyle: row.communication_style || void 0,
      createdAt: new Date(row.created_at)
    };
  }
};

// src/models/NumerologySessionModel.ts
var NumerologySessionModel = class extends BaseModel {
  static {
    __name(this, "NumerologySessionModel");
  }
  constructor(env) {
    super(env, "numerology_sessions");
  }
  async create(data) {
    const id = this.generateId();
    const result = await this.db.prepare(`
        INSERT INTO numerology_sessions (
          id, test_session_id, birth_date, full_name,
          life_path_number, destiny_number, soul_urge_number,
          personality_number, birth_day_number, numerology_chart, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
      id,
      data.testSessionId,
      data.birthDate.toISOString().split("T")[0],
      // YYYY-MM-DD format
      data.fullName,
      data.lifePathNumber,
      data.destinyNumber,
      data.soulUrgeNumber,
      data.personalityNumber,
      data.birthDayNumber,
      JSON.stringify(data.numerologyChart),
      (/* @__PURE__ */ new Date()).toISOString()
    ).run();
    if (!result.success) {
      throw this.createError("Failed to create numerology session", "DATABASE_ERROR");
    }
    return id;
  }
  async findByTestSessionId(testSessionId) {
    const result = await this.db.prepare("SELECT * FROM numerology_sessions WHERE test_session_id = ?").bind(testSessionId).first();
    if (!result) {
      return null;
    }
    return this.mapToData(result);
  }
  async findByLifePathNumber(lifePathNumber) {
    const results = await this.db.prepare("SELECT * FROM numerology_sessions WHERE life_path_number = ? ORDER BY created_at DESC").bind(lifePathNumber).all();
    return results.results.map((result) => this.mapToData(result));
  }
  async getLifePathDistribution() {
    const results = await this.db.prepare(`
        SELECT life_path_number, COUNT(*) as count 
        FROM numerology_sessions 
        GROUP BY life_path_number
        ORDER BY life_path_number
      `).all();
    const distribution = {};
    results.results.forEach((row) => {
      distribution[row.life_path_number] = row.count;
    });
    return distribution;
  }
  async getDestinyNumberDistribution() {
    const results = await this.db.prepare(`
        SELECT destiny_number, COUNT(*) as count 
        FROM numerology_sessions 
        GROUP BY destiny_number
        ORDER BY destiny_number
      `).all();
    const distribution = {};
    results.results.forEach((row) => {
      distribution[row.destiny_number] = row.count;
    });
    return distribution;
  }
  async findByBirthDateRange(startDate, endDate) {
    const results = await this.db.prepare(`
        SELECT * FROM numerology_sessions 
        WHERE birth_date BETWEEN ? AND ? 
        ORDER BY birth_date DESC
      `).bind(
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
    ).all();
    return results.results.map((result) => this.mapToData(result));
  }
  async getMasterNumberStats() {
    const results = await this.db.prepare(`
        SELECT numerology_chart FROM numerology_sessions
      `).all();
    let masterNumber11 = 0;
    let masterNumber22 = 0;
    let masterNumber33 = 0;
    results.results.forEach((row) => {
      try {
        const chart = JSON.parse(row.numerology_chart);
        if (chart.masterNumbers) {
          if (chart.masterNumbers.includes(11)) masterNumber11++;
          if (chart.masterNumbers.includes(22)) masterNumber22++;
          if (chart.masterNumbers.includes(33)) masterNumber33++;
        }
      } catch (error) {
        console.warn("Failed to parse numerology_chart JSON:", error);
      }
    });
    return {
      masterNumber11,
      masterNumber22,
      masterNumber33,
      totalMasterNumbers: masterNumber11 + masterNumber22 + masterNumber33
    };
  }
  async getKarmicDebtStats() {
    const results = await this.db.prepare(`
        SELECT numerology_chart FROM numerology_sessions
      `).all();
    const karmicDebtCounts = {
      13: 0,
      14: 0,
      16: 0,
      19: 0
    };
    results.results.forEach((row) => {
      try {
        const chart = JSON.parse(row.numerology_chart);
        if (chart.karmicDebtNumbers) {
          chart.karmicDebtNumbers.forEach((number) => {
            if (Object.prototype.hasOwnProperty.call(karmicDebtCounts, number)) {
              karmicDebtCounts[number] = (karmicDebtCounts[number] || 0) + 1;
            }
          });
        }
      } catch (error) {
        console.warn("Failed to parse numerology_chart JSON:", error);
      }
    });
    return karmicDebtCounts;
  }
  async getBirthDatePatterns() {
    const results = await this.db.prepare(`
        SELECT 
          CAST(strftime('%m', birth_date) AS INTEGER) as month,
          COUNT(*) as count
        FROM numerology_sessions 
        GROUP BY month
        ORDER BY month
      `).all();
    return results.results.map((row) => ({
      month: row.month,
      count: row.count
    }));
  }
  mapToData(row) {
    return {
      id: row.id,
      testSessionId: row.test_session_id,
      birthDate: new Date(row.birth_date),
      fullName: row.full_name,
      lifePathNumber: row.life_path_number,
      destinyNumber: row.destiny_number,
      soulUrgeNumber: row.soul_urge_number,
      personalityNumber: row.personality_number,
      birthDayNumber: row.birth_day_number,
      numerologyChart: JSON.parse(row.numerology_chart),
      createdAt: new Date(row.created_at)
    };
  }
};

// src/services/DatabaseService.ts
var DatabaseService = class {
  constructor(env) {
    this.env = env;
    this.migrationRunner = new MigrationRunner(env);
    this.testTypes = new TestTypeModel(env);
    this.testSessions = new TestSessionModel(env);
    this.blogArticles = new BlogArticleModel(env);
    this.userFeedback = new UserFeedbackModel(env);
    this.analyticsEvents = new AnalyticsEventModel(env);
    this.psychologySessions = new PsychologySessionModel(env);
    this.astrologySessions = new AstrologySessionModel(env);
    this.tarotSessions = new TarotSessionModel(env);
    this.careerSessions = new CareerSessionModel(env);
    this.learningSessions = new LearningSessionModel(env);
    this.relationshipSessions = new RelationshipSessionModel(env);
    this.numerologySessions = new NumerologySessionModel(env);
  }
  static {
    __name(this, "DatabaseService");
  }
  // private dbManager: DatabaseManager; // 未使用，暂时注释
  migrationRunner;
  // 暴露数据库连接供路由使用
  get db() {
    if (!this.env.DB) {
      throw new Error("Database connection not available");
    }
    return this.env.DB;
  }
  // 模型实例
  testTypes;
  testSessions;
  blogArticles;
  userFeedback;
  analyticsEvents;
  psychologySessions;
  astrologySessions;
  tarotSessions;
  careerSessions;
  learningSessions;
  relationshipSessions;
  numerologySessions;
  /**
   * 初始化数据库
   * 运行所有待执行的迁移
   */
  async initialize() {
    try {
      await this.migrationRunner.runMigrations([]);
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Database initialization failed:", error);
      throw new ModuleError(
        "Failed to initialize database",
        ERROR_CODES.DATABASE_ERROR,
        500,
        error
      );
    }
  }
  /**
   * 检查数据库健康状态
   */
  async healthCheck() {
    try {
      const connectionTest = await this.db.prepare("SELECT 1").first();
      const connectionHealthy = connectionTest !== null;
      const migrationsHealthy = true;
      const tablesResult = await this.db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `).all();
      const tables = (tablesResult.success ? tablesResult.results : []).map((row) => row.name);
      const requiredTables = [
        "test_types",
        "test_sessions",
        "blog_articles",
        "user_feedback",
        "analytics_events",
        "sys_configs"
      ];
      const tablesHealthy = requiredTables.every((table) => tables.includes(table));
      const isHealthy = connectionHealthy && migrationsHealthy && tablesHealthy;
      return {
        status: isHealthy ? "healthy" : "unhealthy",
        details: {
          connection: connectionHealthy,
          migrations: migrationsHealthy,
          tables
        }
      };
    } catch (error) {
      console.error("Database health check failed:", error);
      return {
        status: "unhealthy",
        details: {
          connection: false,
          migrations: false,
          tables: []
        }
      };
    }
  }
  /**
   * 获取数据库统计信息
   */
  async getStatistics() {
    try {
      const [
        testSessionsCount,
        blogArticlesCount,
        feedbackCount,
        analyticsEventsCount,
        psychologyCount,
        astrologyCount,
        tarotCount,
        careerCount,
        learningCount,
        relationshipCount,
        numerologyCount,
        recentTests,
        recentFeedback,
        recentArticles
      ] = await Promise.all([
        this.testSessions.count(),
        this.blogArticles.count(),
        this.userFeedback.count(),
        this.analyticsEvents.count(),
        this.psychologySessions.count(),
        this.astrologySessions.count(),
        this.tarotSessions.count(),
        this.careerSessions.count(),
        this.learningSessions.count(),
        this.relationshipSessions.count(),
        this.numerologySessions.count(),
        this.getRecentTestsCount(24),
        // 24小时内
        this.getRecentFeedbackCount(24),
        // 24小时内
        this.getRecentArticlesCount(7)
        // 7天内
      ]);
      return {
        totalTestSessions: testSessionsCount,
        totalBlogArticles: blogArticlesCount,
        totalFeedback: feedbackCount,
        totalAnalyticsEvents: analyticsEventsCount,
        moduleSessionCounts: {
          psychology: psychologyCount,
          astrology: astrologyCount,
          tarot: tarotCount,
          career: careerCount,
          learning: learningCount,
          relationship: relationshipCount,
          numerology: numerologyCount
        },
        recentActivity: {
          testsLast24h: recentTests,
          feedbackLast24h: recentFeedback,
          articlesLast7d: recentArticles
        }
      };
    } catch (error) {
      console.error("Failed to get database statistics:", error);
      throw new ModuleError(
        "Failed to retrieve database statistics",
        ERROR_CODES.DATABASE_ERROR,
        500,
        error
      );
    }
  }
  /**
   * 清理过期数据
   */
  async cleanupExpiredData(retentionDays = 90) {
    try {
      const cutoffDate = /* @__PURE__ */ new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      const cutoffISO = cutoffDate.toISOString();
      const deletedSessions = await this.db.prepare("DELETE FROM test_sessions WHERE created_at < ?").bind(cutoffISO).run();
      const deletedEvents = await this.db.prepare("DELETE FROM analytics_events WHERE timestamp < ?").bind(cutoffISO).run();
      const feedbackCutoff = /* @__PURE__ */ new Date();
      feedbackCutoff.setDate(feedbackCutoff.getDate() - 30);
      const deletedFeedback = await this.db.prepare("DELETE FROM user_feedback WHERE created_at < ?").bind(feedbackCutoff.toISOString()).run();
      return {
        deletedSessions: deletedSessions.changes || 0,
        deletedEvents: deletedEvents.changes || 0,
        deletedFeedback: deletedFeedback.changes || 0
      };
    } catch (error) {
      console.error("Failed to cleanup expired data:", error);
      throw new ModuleError(
        "Failed to cleanup expired data",
        ERROR_CODES.DATABASE_ERROR,
        500,
        error
      );
    }
  }
  /**
   * 备份数据库
   */
  async createBackup() {
    try {
      const backupId = `backup_${Date.now()}`;
      const timestamp = (/* @__PURE__ */ new Date()).toISOString();
      console.log(`Creating backup: ${backupId} at ${timestamp}`);
      return {
        backupId,
        timestamp,
        size: 0
        // 实际实现时应该返回备份文件大小
      };
    } catch (error) {
      console.error("Failed to create backup:", error);
      throw new ModuleError(
        "Failed to create database backup",
        ERROR_CODES.DATABASE_ERROR,
        500,
        error
      );
    }
  }
  // 私有辅助方法
  async getRecentTestsCount(hours) {
    const cutoffDate = /* @__PURE__ */ new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);
    const result = await this.db.prepare("SELECT COUNT(*) as count FROM test_sessions WHERE created_at > ?").bind(cutoffDate.toISOString()).first();
    return result?.["count"] || 0;
  }
  async getRecentFeedbackCount(hours) {
    const cutoffDate = /* @__PURE__ */ new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);
    const result = await this.db.prepare("SELECT COUNT(*) as count FROM user_feedback WHERE created_at > ?").bind(cutoffDate.toISOString()).first();
    return result?.["count"] || 0;
  }
  async getRecentArticlesCount(days) {
    const cutoffDate = /* @__PURE__ */ new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const result = await this.db.prepare("SELECT COUNT(*) as count FROM blog_articles WHERE created_at > ?").bind(cutoffDate.toISOString()).first();
    return result?.["count"] || 0;
  }
  // 提供最小化count实现，供统计使用 - 未使用，暂时注释
  // private async countTable(_tableName: string): Promise<number> {
  //   const result = await this.db
  //     .prepare(`SELECT COUNT(*) as count FROM ${_tableName}`)
  //     .first();
  //   return (result?.['count'] as number) || 0;
  // }
};

// src/index.ts
var app = new Hono2();
app.use("*", secureHeaders({
  xFrameOptions: "DENY",
  xContentTypeOptions: "nosniff",
  referrerPolicy: "strict-origin-when-cross-origin",
  crossOriginEmbedderPolicy: false
  // Cloudflare Workers不支持
}));
app.use("*", cors({
  origin: /* @__PURE__ */ __name((origin) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://*.pages.dev",
      "https://*.cloudflare.com"
    ];
    if (!origin) return origin;
    const allowed = allowedOrigins.some((allowed2) => {
      if (allowed2.includes("*")) {
        const pattern = allowed2.replace("*", ".*");
        return new RegExp(pattern).test(origin);
      }
      return allowed2 === origin;
    });
    return allowed ? origin : null;
  }, "origin"),
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
  allowHeaders: [
    "Content-Type",
    "Authorization",
    "X-Request-ID",
    "X-API-Key",
    "Cache-Control"
  ],
  credentials: true,
  maxAge: 86400
  // 24小时
}));
app.use("*", logger());
app.use("*", requestValidator);
app.use("*", async (c, next) => {
  const requestId = c.req.header("X-Request-ID") || crypto.randomUUID();
  const dbService = new DatabaseService(c.env);
  c.set("requestId", requestId);
  c.set("dbService", dbService);
  await next();
});
app.onError(errorHandler2);
app.route("/api/system", systemRoutes);
app.get("/debug/env", async (c) => {
  return c.json({
    success: true,
    data: {
      hasDB: !!c.env.DB,
      hasKV: !!c.env.KV,
      hasBUCKET: !!c.env?.["BUCKET"],
      environment: c.env.ENVIRONMENT,
      envKeys: Object.keys(c.env)
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/health", async (c) => {
  try {
    const dbService = c.get("dbService");
    const healthCheck = await dbService.healthCheck();
    const response = {
      success: true,
      data: {
        status: healthCheck.status,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        environment: c.env.ENVIRONMENT,
        version: "1.0.0",
        services: {
          database: healthCheck.status,
          cache: "healthy",
          // 简化版本，实际应该检查KV
          storage: "healthy"
          // 简化版本，实际应该检查R2
        }
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId") || ""
    };
    return c.json(response, healthCheck.status === "healthy" ? 200 : 503);
  } catch (error) {
    const response = {
      success: false,
      error: "Health check failed",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: c.get("requestId") || ""
    };
    return c.json(response, 503);
  }
});
app.route("/api/tests", testRoutes);
app.route("/api/blog", blogRoutes);
app.route("/api/feedback", feedbackRoutes);
app.route("/api/analytics", analyticsRoutes);
app.route("/api/homepage", homepageRoutes);
app.route("/api/search", searchRoutes);
app.route("/api/cookies", cookiesRoutes);
app.get("/api", (c) => {
  const response = {
    success: true,
    data: {
      name: "\u7EFC\u5408\u6D4B\u8BD5\u5E73\u53F0 API",
      version: "1.0.0",
      description: "\u4E13\u4E1A\u7684\u5FC3\u7406\u6D4B\u8BD5\u3001\u5360\u661F\u5206\u6790\u3001\u5854\u7F57\u5360\u535C\u7B49\u5728\u7EBF\u6D4B\u8BD5\u670D\u52A1API",
      endpoints: {
        tests: "/api/tests",
        blog: "/api/blog",
        feedback: "/api/feedback",
        analytics: "/api/analytics",
        homepage: "/api/homepage",
        search: "/api/search",
        cookies: "/api/cookies",
        // recommendations: "/api/recommendations", // 暂时注释
        // seo: "/api/seo", // 暂时注释
        system: "/api/system"
      },
      documentation: "https://docs.example.com/api"
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    requestId: c.get("requestId") || ""
  };
  return c.json(response);
});
app.notFound((c) => {
  const response = {
    success: false,
    error: "Not Found",
    message: "The requested resource was not found",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    requestId: c.get("requestId") || ""
  };
  return c.json(response, 404);
});
app.all("*", (c) => {
  const response = {
    success: false,
    error: "Method Not Allowed",
    message: `Method ${c.req.method} is not allowed for this endpoint`,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    requestId: c.get("requestId") || ""
  };
  return c.json(response, 405);
});
var src_default = app;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-f56PAZ/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-f56PAZ/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
