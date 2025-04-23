'use strict';

// Save logic

function replaceExtensionWithPng(filename) {
	const parts = filename.split('.');
	parts[parts.length - 1] = 'png';
	return parts.join('.');
}

function getFilenameFromUrl(url) {
	const urlParts = url.split('/');
	return replaceExtensionWithPng(urlParts[urlParts.length - 1]);
}

async function downloadImage(url, filename, compress) {
	return new Promise((resolve, reject) => {
		if (!url) {
			console.error("downloadImage failed: url = ", url);
			return reject();
		}
		let xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'blob';

		xhr.onload = async () => {
			console.log("image downloaded");
			await saveImageAsPng(xhr.response, filename, compress);
			resolve();
		};

		xhr.onerror = () => {
			console.error("downloadImage failed: url = ", url);
			reject();
		};

		console.log("downloading image...");
		xhr.send();
	});
}

async function saveImageAsPng(blob, filename, compress) {
	if (compress && blob.size >= 10 * 1024 * 1024) {
		saveFile(await imageConversion.compressAccurately(blob, 10 * 1024), filename);
	} else {
		saveFile(blob, filename);
	}
}

function saveFile(blob, filename) {
	try {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	} catch (err) {
		console.error("saveFile failed:", err);
	}
}

// UUID

// Author: Abhishek Dutta, 12 June 2020
// License: CC0 (https://creativecommons.org/choose/zero/)
function generateUUID() {
	var temp_url = URL.createObjectURL(new Blob());
	var uuid = temp_url.toString();
	URL.revokeObjectURL(temp_url);
	return uuid.substr(uuid.lastIndexOf('/') + 1);
}

window.uuid ??= generateUUID();

// Image Conversion

!function (t, e) { "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.imageConversion = e() : t.imageConversion = e() }(this, (function () { return function (t) { var e = {}; function n(r) { if (e[r]) return e[r].exports; var o = e[r] = { i: r, l: !1, exports: {} }; return t[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports } return n.m = t, n.c = e, n.d = function (t, e, r) { n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: r }) }, n.r = function (t) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 }) }, n.t = function (t, e) { if (1 & e && (t = n(t)), 8 & e) return t; if (4 & e && "object" == typeof t && t && t.__esModule) return t; var r = Object.create(null); if (n.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: t }), 2 & e && "string" != typeof t) for (var o in t) n.d(r, o, function (e) { return t[e] }.bind(null, o)); return r }, n.n = function (t) { var e = t && t.__esModule ? function () { return t.default } : function () { return t }; return n.d(e, "a", e), e }, n.o = function (t, e) { return Object.prototype.hasOwnProperty.call(t, e) }, n.p = "", n(n.s = 0) }([function (t, e, n) { "use strict"; var r; function o(t) { return ["image/png", "image/jpeg", "image/gif"].some(e => e === t) } n.r(e), n.d(e, "canvastoDataURL", (function () { return a })), n.d(e, "canvastoFile", (function () { return c })), n.d(e, "dataURLtoFile", (function () { return s })), n.d(e, "dataURLtoImage", (function () { return l })), n.d(e, "downloadFile", (function () { return d })), n.d(e, "filetoDataURL", (function () { return f })), n.d(e, "imagetoCanvas", (function () { return g })), n.d(e, "urltoBlob", (function () { return w })), n.d(e, "urltoImage", (function () { return m })), n.d(e, "compress", (function () { return p })), n.d(e, "compressAccurately", (function () { return b })), n.d(e, "EImageType", (function () { return r })), function (t) { t.PNG = "image/png", t.JPEG = "image/jpeg", t.GIF = "image/gif" }(r || (r = {})); var i = function (t, e, n, r) { return new (n || (n = Promise))((function (o, i) { function a(t) { try { u(r.next(t)) } catch (t) { i(t) } } function c(t) { try { u(r.throw(t)) } catch (t) { i(t) } } function u(t) { var e; t.done ? o(t.value) : (e = t.value, e instanceof n ? e : new n((function (t) { t(e) }))).then(a, c) } u((r = r.apply(t, e || [])).next()) })) }; function a(t, e = .92, n = r.JPEG) { return i(this, void 0, void 0, (function* () { return o(n) || (n = r.JPEG), t.toDataURL(n, e) })) } function c(t, e = .92, n = r.JPEG) { return new Promise(r => t.toBlob(t => r(t), n, e)) } var u = function (t, e, n, r) { return new (n || (n = Promise))((function (o, i) { function a(t) { try { u(r.next(t)) } catch (t) { i(t) } } function c(t) { try { u(r.throw(t)) } catch (t) { i(t) } } function u(t) { var e; t.done ? o(t.value) : (e = t.value, e instanceof n ? e : new n((function (t) { t(e) }))).then(a, c) } u((r = r.apply(t, e || [])).next()) })) }; function s(t, e) { return u(this, void 0, void 0, (function* () { const n = t.split(","); let r = n[0].match(/:(.*?);/)[1]; const i = atob(n[1]); let a = i.length; const c = new Uint8Array(a); for (; a--;)c[a] = i.charCodeAt(a); return o(e) && (r = e), new Blob([c], { type: r }) })) } function l(t) { return new Promise((e, n) => { const r = new Image; r.onload = () => e(r), r.onerror = () => n(new Error("dataURLtoImage(): dataURL is illegal")), r.src = t }) } function d(t, e) { const n = document.createElement("a"); n.href = window.URL.createObjectURL(t), n.download = e || Date.now().toString(36), document.body.appendChild(n); const r = document.createEvent("MouseEvents"); r.initEvent("click", !1, !1), n.dispatchEvent(r), document.body.removeChild(n) } function f(t) { return new Promise(e => { const n = new FileReader; n.onloadend = t => e(t.target.result), n.readAsDataURL(t) }) } var h = function (t, e, n, r) { return new (n || (n = Promise))((function (o, i) { function a(t) { try { u(r.next(t)) } catch (t) { i(t) } } function c(t) { try { u(r.throw(t)) } catch (t) { i(t) } } function u(t) { var e; t.done ? o(t.value) : (e = t.value, e instanceof n ? e : new n((function (t) { t(e) }))).then(a, c) } u((r = r.apply(t, e || [])).next()) })) }; function g(t, e = {}) { return h(this, void 0, void 0, (function* () { const n = Object.assign({}, e), r = document.createElement("canvas"), o = r.getContext("2d"); let i, a; for (const t in n) Object.prototype.hasOwnProperty.call(n, t) && (n[t] = Number(n[t])); if (n.scale) { const e = n.scale > 0 && n.scale < 10 ? n.scale : 1; a = t.width * e, i = t.height * e } else a = n.width || n.height * t.width / t.height || t.width, i = n.height || n.width * t.height / t.width || t.height; switch ([5, 6, 7, 8].some(t => t === n.orientation) ? (r.height = a, r.width = i) : (r.height = i, r.width = a), n.orientation) { case 3: o.rotate(180 * Math.PI / 180), o.drawImage(t, -r.width, -r.height, r.width, r.height); break; case 6: o.rotate(90 * Math.PI / 180), o.drawImage(t, 0, -r.width, r.height, r.width); break; case 8: o.rotate(270 * Math.PI / 180), o.drawImage(t, -r.height, 0, r.height, r.width); break; case 2: o.translate(r.width, 0), o.scale(-1, 1), o.drawImage(t, 0, 0, r.width, r.height); break; case 4: o.translate(r.width, 0), o.scale(-1, 1), o.rotate(180 * Math.PI / 180), o.drawImage(t, -r.width, -r.height, r.width, r.height); break; case 5: o.translate(r.width, 0), o.scale(-1, 1), o.rotate(90 * Math.PI / 180), o.drawImage(t, 0, -r.width, r.height, r.width); break; case 7: o.translate(r.width, 0), o.scale(-1, 1), o.rotate(270 * Math.PI / 180), o.drawImage(t, -r.height, 0, r.height, r.width); break; default: o.drawImage(t, 0, 0, r.width, r.height) }return r })) } function w(t) { return fetch(t).then(t => t.blob()) } function m(t) { return new Promise((e, n) => { const r = new Image; r.onload = () => e(r), r.onerror = () => n(new Error("urltoImage(): Image failed to load, please check the image URL")), r.src = t }) } var y = function (t, e, n, r) { return new (n || (n = Promise))((function (o, i) { function a(t) { try { u(r.next(t)) } catch (t) { i(t) } } function c(t) { try { u(r.throw(t)) } catch (t) { i(t) } } function u(t) { var e; t.done ? o(t.value) : (e = t.value, e instanceof n ? e : new n((function (t) { t(e) }))).then(a, c) } u((r = r.apply(t, e || [])).next()) })) }; function p(t, e = {}) { return y(this, void 0, void 0, (function* () { if (!(t instanceof Blob)) throw new Error("compress(): First arg must be a Blob object or a File object."); if ("object" != typeof e && (e = Object.assign({ quality: e })), e.quality = Number(e.quality), Number.isNaN(e.quality)) return t; const n = yield f(t); let i = n.split(",")[0].match(/:(.*?);/)[1], c = r.JPEG; o(e.type) && (c = e.type, i = e.type); const u = yield l(n), d = yield g(u, Object.assign({}, e)), h = yield a(d, e.quality, c), w = yield s(h, i); return w.size > t.size ? t : w })) } function b(t, e = {}) { return y(this, void 0, void 0, (function* () { if (!(t instanceof Blob)) throw new Error("compressAccurately(): First arg must be a Blob object or a File object."); if ("object" != typeof e && (e = Object.assign({ size: e })), e.size = Number(e.size), Number.isNaN(e.size)) return t; if (1024 * e.size > t.size) return t; e.accuracy = Number(e.accuracy), (!e.accuracy || e.accuracy < .8 || e.accuracy > .99) && (e.accuracy = .95); const n = e.size * (2 - e.accuracy) * 1024, i = 1024 * e.size, c = e.size * e.accuracy * 1024, u = yield f(t); let d = u.split(",")[0].match(/:(.*?);/)[1], h = r.JPEG; o(e.type) && (h = e.type, d = e.type); const w = yield l(u), m = yield g(w, Object.assign({}, e)); let y, p = .5; const b = [null, null]; for (let t = 1; t <= 7; t++) { y = yield a(m, p, h); const e = .75 * y.length; if (7 === t) { (n < e || c > e) && (y = [y, ...b].filter(t => t).sort((t, e) => Math.abs(.75 * t.length - i) - Math.abs(.75 * e.length - i))[0]); break } if (n < e) b[1] = y, p -= Math.pow(.5, t + 1); else { if (!(c > e)) break; b[0] = y, p += Math.pow(.5, t + 1) } } const v = yield s(y, d); return v.size > t.size ? t : v })) } }]) }));

// Utils

if (!window.DeferredFunction) {
	class DeferredFunction {
		constructor() {
			this.fn = null;
			this.queue = [];
			this.isRunning = false;
		}

		define(fn) {
			this.fn = fn;
			if (!this.isRunning && this.queue.length > 0) {
				this.processQueue();
			}
		}

		call(context = null, ...args) {
			const now = Date.now();
			this.queue.push({ context, args, timestamp: now });
			if (!this.isRunning && this.fn) {
				this.processQueue();
			}
		}

		async processQueue() {
			this.isRunning = true;

			let startTime;
			let previousTimestamp = 0;

			while (this.queue.length > 0) {
				const { context, args, timestamp } = this.queue.shift();

				startTime ??= timestamp;
				const relativeTimestamp = timestamp - startTime;

				if (previousTimestamp) {
					const delay = Math.max(0, relativeTimestamp - (Date.now() - startTime));
					await new Promise((resolve, reject) => setTimeout(resolve, delay));
				}

				if (this.fn) {
					await this.fn.apply(context, args);
				}

				previousTimestamp = relativeTimestamp;
			}

			this.isRunning = false;
		}
	}
	window.DeferredFunction = DeferredFunction;
}

function trackPromise(promise) {
	let state = 'pending';

	const wrappedPromise = promise
		.then(value => {
			state = 'resolved';
			return value;
		})
		.catch(err => {
			state = 'rejected';
			throw err;
		});

	wrappedPromise.getState = () => state;

	return wrappedPromise;
}

function debounce(fn, delay) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), delay);
	};
}

// because apparently JS doesn't have this
function insort(array, obj, getKey = x => x) {
	let index = array.findIndex(item => getKey(obj) < getKey(item));
	if (index === -1) {
		array.push(obj);
	} else {
		array.splice(index, 0, obj);
	}
}

function getDocumentReady() {
	return this.readyState === 'interactive' || this.readyState === 'complete';
}

window.documentReady ??= getDocumentReady.bind(document);

function softRemove(e) {
	if (e) overwriteStyles(e, { display: 'none' });
}

function updateCSSProperty(currentProperty, key, value) {
	currentProperty = currentProperty || '';
	const regex = new RegExp(`${key}\\([^)]*\\)`, 'g');
	if (regex.test(currentProperty)) {
		return currentProperty.replace(regex, `${key}(${value})`);
	} else {
		return currentProperty ? `${currentProperty} ${key}(${value})` : `${key}(${value})`;
	}
}

function getElementByXPath(doc, xpath) {
	const result = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
	return result;
}

function getElementsByXPath(doc, xpath) {
	const result = [];
	const iterator = doc.evaluate(xpath, doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
	let node = iterator.iterateNext();
	while (node) {
		result.push(node);
		node = iterator.iterateNext();
	}
	return result;
}

function applyToAncestor(element, callback, check) {
	let current = element.parentElement;
	while (current) {
		if (check(current)) {
			callback(current);
			break;
		}
		current = current.parentElement;
	}
}

function camelToCssStyle(key) {
	return key.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function overwriteStyles(element, styles) {
	element.style.cssText = Object.keys(styles).reduce((acc, key) => {
		return acc + `${camelToCssStyle(key)}: ${styles[key]}; `;
	}, '').trim();
}

function getTraverse(check, callback) {
	function traverse(node) {
		if (check(node)) return callback(node);
		if (node.childNodes) {
			for (const child of node.childNodes) traverse(child);
		}
	}
	return traverse;
}

function serializeAttributes(e) {
	return Array.from(e.attributes)
		.sort((a, b) => a.name.localeCompare(b.name))
		.map(attr => `${attr.name} = ${attr.value}`)
		.join('\n\n');
}

// ignore means we don't even consider if the element has these attributes or not
function onlyAttributes(e, allowedAttributes, ignoredAttributes = ['style', 'class']) {
	const ignoredSet = new Set((ignoredAttributes || []).map(camelToCssStyle));

	for (let attr of ignoredSet) {
		if (allowedAttributes.hasOwnProperty(attr)) {
			throw new Error(`Attribute "${attr}" cannot be both allowed and ignored.`);
		}
	}

	for (let [attrName, allowedValue] of Object.entries(allowedAttributes)) {
		const v = e.getAttribute(camelToCssStyle(attrName));
		if (v === null) return false;
		if (allowedValue && allowedValue !== v) return false;
	}

	return e.attributes.length - [...e.attributes].filter(attr => ignoredSet.has(attr.name)).length === Object.keys(allowedAttributes).length;
}

// Observers utilities

// calls the callback whenever the element given by get is there if initialCheck
// otherwise whenever available, checking with the givenCheck function starting from the root
function startObserver(root, get, givenCheck, callback, initialCheck) {
	return new Promise((resolve, reject) => {
		if (!root) return reject(new Error("Invalid root element"));

		let observer;
		let resolved = false;

		function check(e) {
			return e && givenCheck(e);
		}

		function done(e) {
			if (resolved) return;
			if (observer) {
				observer.disconnect();
				observer = null;
			}
			resolve(callback(e));
			resolved = true;
		}

		const traverse = getTraverse(check, done);

		function initialCheckFunction(doubleCheck) {
			return new Promise(resolve => {
				setTimeout(async () => {
					let e = await get();
					if (check(e)) {
						done(e);
						return resolve();
					} else if (doubleCheck) {
						e = Array.from(document.querySelectorAll('*')).find(node => check(node));
						if (e) {
							done(e);
							return resolve();
						}
					}
					return resolve();
				}, 0);
			});
		}

		try {
			(async () => {
				observer = new MutationObserver(async mutationsList => {
					if (initialCheck) {
						initialCheck = false;
						await initialCheckFunction(true);
					}
					for (const mutation of mutationsList) {
						for (const node of mutation.addedNodes) traverse(node);
					}
				});

				if (initialCheck) await initialCheckFunction(false);

				if (!resolved) observer.observe(root, { subtree: true, childList: true });
			})();
		} catch (error) {
			reject(error);
		}
	});
}

function withElement(getRef, setRef, getRoot, getFn, isFn, callback) {
	if (getRef()) {
		callback();
		return;
	}
	startObserver(getRoot(), getFn, isFn, function(e) {
		setRef(e);
		callback();
	}, true);
}

// starts an attribute observer on the given element and returns it
function getAttributeObserver(e, callback) {
	if (!e) throw new Error('e must be a non null HTMLElement');
	if (typeof callback !== 'function') throw new Error('callback must be a function');
	let lastAttributes = serializeAttributes(e);
	const r = new MutationObserver(mutationsList => {
		mutationsList.forEach(function(mutation) {
			if (mutation.type === "attributes") {
				const currentAttributes = serializeAttributes(mutation.target);
				if (currentAttributes !== lastAttributes) {
					callback(mutation.target);
					lastAttributes = serializeAttributes(mutation.target);
				}
			}
		});
	});
	r.observe(e, { attributes: true });
	callback(e);
	return r;
}

// wrapper around startObserver
// both callbacks are called whenever a new reference of the object described by check is found
// and calls attributeCallback whenever the current element's attributes have changed
function startPObserver(root, get, check, childCallback, attributeCallback) {
	let lastElement = null;
	let callback;
	if (typeof attributeCallback === 'function') {
		let attributeObserver = null;
		callback = e => {
			if (e === lastElement) return;
			lastElement = e;
			let r;
			if (attributeObserver) {
				attributeObserver.disconnect();
				r = childCallback?.(e);
			} else {
				r = childCallback?.(e);
				attributeCallback(e);
			}
			attributeObserver = getAttributeObserver(e, attributeCallback);
			return r;
		};
	} else {
		callback = e => {
			if (e === lastElement) return;
			lastElement = e;
			return childCallback?.(e);
		};
	}
	function observe(initialCheck) {
		startObserver(root, get, check, callback, initialCheck).then(() => setTimeout(() => observe(false), 0));
	}
	observe(true);
}

// simple wrapper around startPObserver for the same root
function getStartPObserver(root) {
	return function (get, check, childCallback, attributeCallback) {
		startPObserver(root, get, check, childCallback, attributeCallback);
	};
}

// common use case of startPObserver wrapped here
// it generates the get and check methods given a tagName and some attributes to check against using onlyAttributes
function getStartAttributePObserver(root) {
	if (!root) throw new Error('Invalid root');

	return function (tagName, attributes, childCallback, attributeCallback, selectorPrefix = '', selectorSuffix = '') {
		
		if (typeof tagName !== 'string') throw new Error('tagName must be a string');
		if (typeof attributes !== 'object') throw new Error('attributes must be an object');
		if (typeof selectorPrefix !== 'string') throw new Error('selectorPrefix must be an string');
		if (typeof selectorSuffix !== 'string') throw new Error('selectorSuffix must be an string');

		const attributeSelector = Object.entries(attributes)
			.map(([key, value]) => value === null ? `[${camelToCssStyle(key)}]` : `[${camelToCssStyle(key)}="${value}"]`)
			.join('');

		console.log(`${selectorPrefix}${tagName}${attributeSelector}${selectorSuffix}`);

		startPObserver(root,
			() => root.querySelector(`${selectorPrefix}${tagName}${attributeSelector}${selectorSuffix}`),
			e => e.tagName === tagName.toUpperCase() && onlyAttributes(e, attributes),
			childCallback, attributeCallback
		);
	};
}

// another common use case of startPObserver
// this time it will tag elements it finds and calls itself again, excluding the marked elements
// for time when we want to execute some logic on all elements with the given tagName and attributes
// this also setup a permanent attribute observer on each of them with the given attributeCallback
function getStartAttributePObserverAll(root, finite = false) {
	if (!root) throw new Error('Invalid root');
	if (typeof finite !== 'boolean') throw new Error('tagName must be a boolean');

	return function (tagName, attributes, childCallback, attributeCallback, tagAttribute = '', selectorPrefix = '', selectorSuffix = '') {

		if (typeof tagName !== 'string') throw new Error('tagName must be a string');
		if (typeof attributes !== 'object') throw new Error('attributes must be an object');
		if (typeof tagAttribute !== 'string') throw new Error('tagAttribute must be an string');
		if (typeof selectorPrefix !== 'string') throw new Error('selectorPrefix must be an string');
		if (typeof selectorSuffix !== 'string') throw new Error('selectorSuffix must be an string');
		
		tagAttribute = tagAttribute.length ? tagAttribute : `data-${generateUUID()}`;
		
		const attributeSelector = Object.entries(attributes)
			.map(([key, value]) => value === null ? `[${camelToCssStyle(key)}]` : `[${camelToCssStyle(key)}="${value}"]`)
			.join('');

		function get() {
			return root.querySelector(`${selectorPrefix}${tagName}${attributeSelector}${selectorSuffix}`);
		}

		function wrap(callback, observeAgain) {
			return function (e) {
				callback?.(e);
				e.setAttribute(tagAttribute, 'true');
				if (observeAgain && (!finite || get())) observe();
			}
		}

		function observe() {
			startPObserver(root, get, e => e.tagName === tagName.toUpperCase() && onlyAttributes(e, attributes),
				wrap(childCallback, true), wrap(attributeCallback, false)
			);
		}

		observe();
	};
}

function getPNthChild(root, indices,
	givenCheck, childCallback, attributeCallback,
	intermediateGivenChecks = null, intermediateChildCallback = null, intermediateAttributeCallback = null) {
	if (!Array.isArray(indices)) indices = [indices];
	function help(currentRoot, remainingIndices, currentLevel = 0) {
		const index = remainingIndices[0];
		const get = () => currentRoot.children[index];
		if (remainingIndices.length === 1) {
			const check = e => e === get() && 
				(typeof givenCheck === 'function'
					? givenCheck(e)
					: true
				);
			startPObserver(currentRoot, get, check, childCallback, attributeCallback);
		} else {
			const check = e => e === get() &&
				(typeof intermediateGivenChecks?.[currentLevel] === 'function'
					? intermediateGivenChecks[currentLevel](e)
					: true
				);
			startPObserver(currentRoot, get, check, async child => {
				intermediateChildCallback?.(child, currentLevel);
				setTimeout(() => help(child, remainingIndices.slice(1), currentLevel + 1), 0);
			}, e => intermediateAttributeCallback?.(e, currentLevel));
		}
	}
	help(root, indices);
}

// TODO: get rid of this

function startObserverOnInterval(rootGetter, refGetter, refSetter, intervalGetter, intervalSetter, get, check, callback, cooldown) {
	function wrappedCallback(tmp) {
		if (tmp === refGetter() || tmp?.childElementCount === 0) return;
		refSetter(tmp);
		callback();
		if (intervalGetter()) clearInterval(intervalGetter());
		intervalSetter(setInterval(help, cooldown));
	}

	function help() {
		startObserver(rootGetter(), get, check, wrappedCallback, true);
	}

	help();
}

function getStartObserverOnInterval(rootGetter, refGetter, refSetter, intervalGetter, intervalSetter) {
	return function (get, check, callback, cooldown = 100) {
		return startObserverOnInterval(rootGetter, refGetter, refSetter, intervalGetter, intervalSetter, get, check, callback, cooldown);
	}
}

window.dispatchEvent(new Event('commonLoaded'));
