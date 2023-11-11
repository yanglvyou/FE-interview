
    (function(graph){
        function require(filename){
            function localRequire(relativePath){
                return require(graph[filename].dependencies[relativePath]);
            }
            const exports = {};
            (function(require, exports, code){
                eval(code);
            })(localRequire, exports, graph[filename].code)
            return exports;
        }
        
        require('./src/index.js');
    })({"./src/index.js":{"dependencies":{"./a.js":"./src/a.js","./b.js":"./src/b.js"},"code":"\"use strict\";\n\nvar _a = _interopRequireDefault(require(\"./a.js\"));\nvar _b = _interopRequireDefault(require(\"./b.js\"));\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\nconsole.log(_a[\"default\"]);\nconsole.log(_b[\"default\"]);"},"./src/a.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar _default = 1;\nexports[\"default\"] = _default;"},"./src/b.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = _default;\nfunction _default() {\n  console.log('I am b');\n}"}})
    