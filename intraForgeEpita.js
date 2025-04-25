'use strict';

window.addEventListener('commonLoaded', () => {

    if (window?.intraInit === true) return;

    // Constants

    let main;
    let mainInterval;

    let h1;
    let graph;

    const nodeIdRegex = /_required=(?<required>\w+)\/_validated=(?<validated>\w+)\/_accessible=(?<accessible>\w+)\/(?<path>[\w~\/]+)/mg;

    // Injection logic

    console.log('injected');

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

        let folderStructure = {};

        function wrapH1WithDownload() {
            const a = document.createElement('a');
            a.href = '#';
            a.style.pointerEvents = 'auto';
            a.onclick = async (e) => {
                e.preventDefault();
                a.style.pointerEvents = 'none';
                a.style.opacity = '0.5';
                console.log('Scraping...');
                await buildFolderStructure();
                console.log("Downloading and zipping...")
                await zipFiles(h1.textContent, folderStructure);
                a.style.pointerEvents = 'auto';
                a.style.opacity = '1';
            };

            h1.parentNode.replaceChild(a, h1);
            a.appendChild(h1);
        }

        function h1Callback() {
            console.log('h1', h1);
            withElement(() => graph, e => graph = e, () => main, getGraph, isGraph, () => {
                graphCallback();
                wrapH1WithDownload();
            });
        }

        function folderNameFromId(id) {
            const parts = id.split('/');
            return parts[parts.length - 1].replaceAll('~', '-');
        }

        async function getDoc(url) {
            const response = await fetch(url);
            if (!response.ok) {
                console.log('Access denied for\n', url, '\ngot\n', response);
                return null;
            }
            const text = await response.text();
            return new DOMParser().parseFromString(text, 'text/html');
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
                for (const node of preNode.textContent.split('\n').slice(1, -2).filter(line => line.includes(':'))) {
                    const parts = node.split(':');
                    nodeIdRegex.lastIndex = 0;
                    const res = nodeIdRegex.exec(parts[0].trim());
                    await next(`${window.location.origin}/${res.groups.path.replaceAll('~', '-')}`, `${folderName}/${parts[1].trim()}${res.groups.required === "false" ? " (bonus)" : ""}`);
                }
            } else {
                for (const final of doc.querySelector('div[class="list"]').children) {
                    await addFiles(final.href, `${folderName}/${final.getAttribute('data-name')}`);
                }
            }
        }

        async function buildFolderStructure() {
            for (const child of graph.children) {
                nodeIdRegex.lastIndex = 0;
                const res = nodeIdRegex.exec(child.getAttribute('id'));
                if (!res || res.groups.accessible === "false") continue;
                await next(`${window.location.origin}/${res.groups.path.replaceAll('~', '-')}`, `${child.querySelector('span').textContent}${res.groups.required === "false" ? " (bonus)" : ""}`);
            }
        }

        async function graphCallback() {
            console.log('graph', graph);
            const style = document.createElement('style');
            style.textContent = `
                h1:hover {
                    color: #0072DB;
                }
            `;
            document.head.appendChild(style);
        }

        startObserverOnIntervalForMain(getMain, isMain, mainCallback);

        window.addEventListener('popstate', debounce(() => withElement(() => main, e => main = e, () => document.body, getMain, isMain, mainCallback), 100));
    }

    init();

    window.intraInit ??= true;

});
