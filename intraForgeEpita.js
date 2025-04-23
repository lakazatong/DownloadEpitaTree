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

        function graphCallback() {
            console.log('graph', graph);
        }

        startObserverOnIntervalForMain(getMain, isMain, mainCallback);

        window.addEventListener('popstate', debounce(() => withElement(() => main, e => main = e, () => document.body, getMain, isMain, mainCallback), 100));
    }

    init();

    window.intraInit ??= true;

});