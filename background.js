'use strict';

// Injection logic

const injectedFiles = {};
function inject(tabId, files) {
	function executeFile(index) {
		if (index >= files.length) return;
		console.log('injecting', files[index], 'into', tabId);
		if (files[index].endsWith('.css')) {
			injectedFiles[files[index]] = Date.now();
			chrome.scripting.insertCSS({
				target: { tabId },
				files: [files[index]]
			}, () => {
				executeFile(index + 1);
			});
		} else {
			chrome.scripting.executeScript({
				target: { tabId },
				files: [files[index]]
			}, () => {
				executeFile(index + 1);
			});
		}
	}

	executeFile(0);

	setInterval(() => {
		files.forEach(file => {
			if (file.endsWith('.css')) {
				let currentModificationTime = Date.now();
				if (injectedFiles[file] && injectedFiles[file] !== currentModificationTime) {
					chrome.scripting.insertCSS({
						target: { tabId },
						files: [file]
					});
					injectedFiles[file] = currentModificationTime;
				}
			}
		});
	}, 500);
}

const contentScriptsConfig = [
	{
		regex: /^https:\/\/intra\.forge\.epita\.fr/,
		callback: function (tab) { inject(tab.id, ['intraForgeEpita.js', 'common.js']); },
	},
];

function getFromDocument(tabId, key) {
	return new Promise((resolve, reject) => {
		try {
			chrome.scripting.executeScript({
				target: { tabId },
				func: key => {
					if (!document || typeof document.querySelector !== 'function') return null;
					const keys = key.split('.');
					let value = document;
					for (let i = 0; i < keys.length; i++) {
						value = value[keys[i]];
						if (value === undefined) return null;
					}
					return value;
				},
				args: [key]
			}, result => {
				resolve(chrome.runtime.lastError ? null : (result?.[0]?.result || null));
			});
		} catch (err) {
			resolve(null);
		}
	});
}

const tabsState = new Map();

function callbackOnceTabReady(tabId, tab, callback) {
	const key = String(tabId);
	let done = false;

	async function intervalCallback() {
		if (done) return;
		const readyState = await getFromDocument(tabId, 'readyState');
		if (readyState === 'interactive' || readyState === 'complete') {
			done = true;
			clearInterval(checkReadyState);
			if (tabsState[key]?.callbackTimeout) clearTimeout(tabsState[key].callbackTimeout);
			tabsState[key].callbackTimeout = setTimeout(() => callback(tab), 100);
		}
	}

	let p = Promise.resolve();
	const checkReadyState = setInterval(async () => {
		await p;
		if (done) return;
		p = intervalCallback();
	}, 100);
}

chrome.tabs.onActivated.addListener(({ tabId }) => chrome.tabs.get(tabId, tab => {
	const callback = contentScriptsConfig.find(({ regex }) => regex.test(tab.url))?.callback;
	if (!callback) return;

	const key = String(tabId);
	if (tabsState[key] && (tabsState?.state || tabsState[key]?.lastUrl === tab.url)) return;

	tabsState[key] = { lastUrl: tab.url };

	callbackOnceTabReady(tabId, tab, callback);
}));

chrome.tabs.onRemoved.addListener(tabId => tabsState.delete(tabId));

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	const callback = contentScriptsConfig.find(({ regex }) => regex.test(tab.url))?.callback;
	if (!callback) return;

	const key = String(tabId);

	if (!tabsState[key]) tabsState[key] = {};

	if (changeInfo.status === 'complete') {
		tabsState[key].state = 1;
		tabsState[key].lastUrl = tab.url;
		return;
	}

	if (changeInfo.status === 'loading') {
		if (tabsState[key]?.state === 0) return;
		tabsState[key].state = 0;
		callbackOnceTabReady(tabId, tab, callback);
		return;
	}
});
