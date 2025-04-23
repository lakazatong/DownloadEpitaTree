'use strict';

window.addEventListener('commonLoaded', () => {

    if (window?.intraInit === true) return;

    // Constants

    let main;
    let mainInterval;

    let h1;
    let graph;

    // Injection logic

    console.log('intraForgeEpita');
    window.documentReady = getDocumentReady.bind(document);

    function init() {
        const startObserverOnIntervalForMain = getStartObserverOnInterval(() => document.body,
            () => main, e => main = e,
            () => mainInterval, i => mainInterval = i
        );

        function isMain(e) {
            return e.tagName === 'MAIN';
        }

        function isH1(e) {
            return e.tagName === 'H1';
        }

        function isGraph(e) {
            return e.tagName === 'g' && onlyAttributes(e, {
                class: 'nodes'
            }, null);
        }

        function getElement(getRoot, selector) {
            return getRoot().querySelector(selector);
        }

        const getMain = () => getElement(() => document.body, 'main');
        const getH1 = () => getElement(() => main, 'h1');
        const getGraph = () => getElement(() => main, 'g[class="nodes"]');

        function mainCallback() {
            console.log('main', main);
            withElement(() => h1, e => h1 = e, () => main, getH1, isH1, h1Callback);
        }

        function h1Callback() {
            console.log('h1', h1);
            withElement(() => graph, e => graph = e, () => main, getGraph, isGraph, graphCallback);
        }

        let folderStructure = {};

        function folderNameFromId(id) {
            const parts = id.split('/');
            return parts[parts.length - 1].replaceAll('~', '-');
        }

        async function getDoc(url) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.log('Access denied for', url);
                    return null;
                }
                const text = await response.text();
                return new DOMParser().parseFromString(text, 'text/html');
            } catch {
                console.log('Access denied for', url);
                return null;
            }
        }

        async function addFiles(url, folderName) {
            const doc = await getDoc(url);
            const fileNames = Array.from(doc.querySelector('div[class="list"]').querySelectorAll('.list__item__name'))
                .map(item => item.textContent.trim());

            if (!folderStructure[folderName])
                folderStructure[folderName] = [];

            fileNames.forEach(filename => {
                const fileUrl = `${url}/${filename}`;
                folderStructure[folderName].push({ name: filename, url: fileUrl });
                console.log(filename);
            });
        }

        async function next(url, folderName) {
            const doc = await getDoc(url);
            if (!doc) return;
            const preNode = doc.querySelector('pre');
        
            if (preNode) {
                for (const node of preNode.textContent.split('\n').slice(1, -2).filter((_, i) => i % 2 === 0)) {
                    const parts = node.split(':');
                    await next(`${url}/${folderNameFromId(parts[0].trim().slice(0, -1))}`, `${folderName}/${parts[1].trim()}`);
                }
            } else {
                for (const final of doc.querySelector('div[class="list"]').children) {
                    await addFiles(final.href, `${folderName}/${final.getAttribute('data-name')}`);
                }
            }
        }

        async function graphCallback() {
            console.log('graph', graph);
            for (const child of graph.children) {
                const a = child.querySelector('a');
                if (!a) continue;
                const parts = child.getAttribute('id').split('"');
                await next(window.location.href + '/' + folderNameFromId(parts[parts.length - 2]), child.querySelector('span').textContent);
            }

            zipFiles(h1.textContent, folderStructure);
        }

        startObserverOnIntervalForMain(getMain, isMain, mainCallback);

        window.addEventListener('popstate', debounce(() => withElement(() => main, e => main = e, () => document.body, getMain, isMain, mainCallback), 100));
    }

    init();

    window.intraInit ??= true;

});