"use strict";
exports.__esModule = true;
exports.useMicrofrontendReact = exports.createMicroFrontend = void 0;
var react_1 = require("react");
var react_dom_1 = require("react-dom");
exports.createMicroFrontend = function (renderFunc, appName, microLocal, localProps, localContainer) {
    var createMFE = function (props) {
        var render = function (containerId, data) {
            var container = document.getElementById(containerId);
            if (!containerId) {
                throw new Error('An ID must provided');
            }
            var propsToUse = Object.keys(props).length > 0 ? props : data;
            renderFunc(propsToUse, container);
        };
        var unmount = function (containerId) {
            var container = document.getElementById(containerId);
            if (!container) {
                return;
            }
            react_dom_1["default"].unmountComponentAtNode(container);
        };
        window[appName + "MicroFrontend"] = {
            render: render,
            unmount: unmount
        };
    };
    if (process.env.NODE_ENV === 'development') {
        if (microLocal) {
            createMFE(localProps);
        }
        else {
            renderFunc(localProps, document.getElementById(localContainer ? localContainer : 'root'));
        }
    }
    else {
        createMFE();
    }
};
exports.useMicrofrontendReact = function (id, url) {
    var scriptId = id + "Bundle";
    var _a = react_1.useState(!!window[id]), isLoaded = _a[0], setLoaded = _a[1];
    var _b = react_1.useState({}), app = _b[0], updateApp = _b[1];
    react_1.useEffect(function () {
        var promises;
        fetch(url + "/asset-manifest.json")
            .then(function (res) { return res.json(); })
            .then(function (manifest) {
            promises = Object.keys(manifest['files'])
                .filter(function (key) { return key.endsWith('.js'); })
                .map(function (key) {
                return new Promise(function (resolve) {
                    var path = "" + url + manifest['files'][key];
                    var script = document.createElement('script');
                    if (key === 'main.js') {
                        script.id = scriptId;
                    }
                    script.onload = function () {
                        resolve();
                    };
                    script.src = path;
                    document.head.appendChild(script);
                });
            });
            Promise.all(promises).then(function () {
                var app = window[id + "MicroFrontend"];
                updateApp(app);
                setLoaded(true);
            });
        });
    }, []);
    return [isLoaded, app];
};
exports["default"] = exports.useMicrofrontendReact;
