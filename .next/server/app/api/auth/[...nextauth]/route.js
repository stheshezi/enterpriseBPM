"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cshezi%5CMusic%5CProjects%5Ctravel%5Centerprise-bpm-platform%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cshezi%5CMusic%5CProjects%5Ctravel%5Centerprise-bpm-platform&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cshezi%5CMusic%5CProjects%5Ctravel%5Centerprise-bpm-platform%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cshezi%5CMusic%5CProjects%5Ctravel%5Centerprise-bpm-platform&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_shezi_Music_Projects_travel_enterprise_bpm_platform_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\shezi\\\\Music\\\\Projects\\\\travel\\\\enterprise-bpm-platform\\\\app\\\\api\\\\auth\\\\[...nextauth]\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_shezi_Music_Projects_travel_enterprise_bpm_platform_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNzaGV6aSU1Q011c2ljJTVDUHJvamVjdHMlNUN0cmF2ZWwlNUNlbnRlcnByaXNlLWJwbS1wbGF0Zm9ybSU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDc2hlemklNUNNdXNpYyU1Q1Byb2plY3RzJTVDdHJhdmVsJTVDZW50ZXJwcmlzZS1icG0tcGxhdGZvcm0maXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQzJEO0FBQ3hJO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZW50ZXJwcmlzZS1icG0tcGxhdGZvcm0vPzMwNzgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcc2hlemlcXFxcTXVzaWNcXFxcUHJvamVjdHNcXFxcdHJhdmVsXFxcXGVudGVycHJpc2UtYnBtLXBsYXRmb3JtXFxcXGFwcFxcXFxhcGlcXFxcYXV0aFxcXFxbLi4ubmV4dGF1dGhdXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hdXRoL1suLi5uZXh0YXV0aF1cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXHNoZXppXFxcXE11c2ljXFxcXFByb2plY3RzXFxcXHRyYXZlbFxcXFxlbnRlcnByaXNlLWJwbS1wbGF0Zm9ybVxcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcWy4uLm5leHRhdXRoXVxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cshezi%5CMusic%5CProjects%5Ctravel%5Centerprise-bpm-platform%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cshezi%5CMusic%5CProjects%5Ctravel%5Centerprise-bpm-platform&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/[...nextauth]/route.ts":
/*!*********************************************!*\
  !*** ./app/api/auth/[...nextauth]/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()(_lib_auth__WEBPACK_IMPORTED_MODULE_1__.authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFpQztBQUNRO0FBRXpDLE1BQU1FLFVBQVVGLGdEQUFRQSxDQUFDQyxrREFBV0E7QUFFTyIsInNvdXJjZXMiOlsid2VicGFjazovL2VudGVycHJpc2UtYnBtLXBsYXRmb3JtLy4vYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUudHM/YzhhNCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTmV4dEF1dGggZnJvbSBcIm5leHQtYXV0aFwiO1xuaW1wb3J0IHsgYXV0aE9wdGlvbnMgfSBmcm9tIFwiQC9saWIvYXV0aFwiO1xuXG5jb25zdCBoYW5kbGVyID0gTmV4dEF1dGgoYXV0aE9wdGlvbnMpO1xuXG5leHBvcnQgeyBoYW5kbGVyIGFzIEdFVCwgaGFuZGxlciBhcyBQT1NUIH07XG4iXSwibmFtZXMiOlsiTmV4dEF1dGgiLCJhdXRoT3B0aW9ucyIsImhhbmRsZXIiLCJHRVQiLCJQT1NUIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./config/permissions.ts":
/*!*******************************!*\
  !*** ./config/permissions.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ALL_PERMISSIONS: () => (/* binding */ ALL_PERMISSIONS),\n/* harmony export */   PERMISSIONS: () => (/* binding */ PERMISSIONS)\n/* harmony export */ });\nconst PERMISSIONS = {\n    TENANT_MANAGE: \"tenant.manage\",\n    USERS_VIEW: \"users.view\",\n    USERS_MANAGE: \"users.manage\",\n    ROLES_MANAGE: \"roles.manage\",\n    REQUESTS_CREATE: \"requests.create\",\n    REQUESTS_VIEW_OWN: \"requests.view.own\",\n    REQUESTS_VIEW_TENANT: \"requests.view.tenant\",\n    REQUESTS_APPROVE_MANAGER: \"requests.approve.manager\",\n    REQUESTS_APPROVE_FINANCE: \"requests.approve.finance\",\n    REQUESTS_CANCEL_OWN: \"requests.cancel.own\",\n    TASKS_VIEW_ASSIGNED: \"tasks.view.assigned\",\n    REPORTS_VIEW: \"reports.view\",\n    AUDIT_VIEW: \"audit.view\",\n    SYSTEM_ADMIN: \"system.admin\"\n};\nconst ALL_PERMISSIONS = Object.values(PERMISSIONS);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9jb25maWcvcGVybWlzc2lvbnMudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFTyxNQUFNQSxjQUFjO0lBQ3pCQyxlQUFlO0lBQ2ZDLFlBQVk7SUFDWkMsY0FBYztJQUNkQyxjQUFjO0lBQ2RDLGlCQUFpQjtJQUNqQkMsbUJBQW1CO0lBQ25CQyxzQkFBc0I7SUFDdEJDLDBCQUEwQjtJQUMxQkMsMEJBQTBCO0lBQzFCQyxxQkFBcUI7SUFDckJDLHFCQUFxQjtJQUNyQkMsY0FBYztJQUNkQyxZQUFZO0lBQ1pDLGNBQWM7QUFDaEIsRUFBbUQ7QUFFNUMsTUFBTUMsa0JBQWtCQyxPQUFPQyxNQUFNLENBQUNqQixhQUFhIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZW50ZXJwcmlzZS1icG0tcGxhdGZvcm0vLi9jb25maWcvcGVybWlzc2lvbnMudHM/MmJmOCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEFwcFBlcm1pc3Npb24gfSBmcm9tIFwiQC90eXBlcy9hdXRoXCI7XG5cbmV4cG9ydCBjb25zdCBQRVJNSVNTSU9OUyA9IHtcbiAgVEVOQU5UX01BTkFHRTogXCJ0ZW5hbnQubWFuYWdlXCIsXG4gIFVTRVJTX1ZJRVc6IFwidXNlcnMudmlld1wiLFxuICBVU0VSU19NQU5BR0U6IFwidXNlcnMubWFuYWdlXCIsXG4gIFJPTEVTX01BTkFHRTogXCJyb2xlcy5tYW5hZ2VcIixcbiAgUkVRVUVTVFNfQ1JFQVRFOiBcInJlcXVlc3RzLmNyZWF0ZVwiLFxuICBSRVFVRVNUU19WSUVXX09XTjogXCJyZXF1ZXN0cy52aWV3Lm93blwiLFxuICBSRVFVRVNUU19WSUVXX1RFTkFOVDogXCJyZXF1ZXN0cy52aWV3LnRlbmFudFwiLFxuICBSRVFVRVNUU19BUFBST1ZFX01BTkFHRVI6IFwicmVxdWVzdHMuYXBwcm92ZS5tYW5hZ2VyXCIsXG4gIFJFUVVFU1RTX0FQUFJPVkVfRklOQU5DRTogXCJyZXF1ZXN0cy5hcHByb3ZlLmZpbmFuY2VcIixcbiAgUkVRVUVTVFNfQ0FOQ0VMX09XTjogXCJyZXF1ZXN0cy5jYW5jZWwub3duXCIsXG4gIFRBU0tTX1ZJRVdfQVNTSUdORUQ6IFwidGFza3Mudmlldy5hc3NpZ25lZFwiLFxuICBSRVBPUlRTX1ZJRVc6IFwicmVwb3J0cy52aWV3XCIsXG4gIEFVRElUX1ZJRVc6IFwiYXVkaXQudmlld1wiLFxuICBTWVNURU1fQURNSU46IFwic3lzdGVtLmFkbWluXCIsXG59IGFzIGNvbnN0IHNhdGlzZmllcyBSZWNvcmQ8c3RyaW5nLCBBcHBQZXJtaXNzaW9uPjtcblxuZXhwb3J0IGNvbnN0IEFMTF9QRVJNSVNTSU9OUyA9IE9iamVjdC52YWx1ZXMoUEVSTUlTU0lPTlMpO1xuIl0sIm5hbWVzIjpbIlBFUk1JU1NJT05TIiwiVEVOQU5UX01BTkFHRSIsIlVTRVJTX1ZJRVciLCJVU0VSU19NQU5BR0UiLCJST0xFU19NQU5BR0UiLCJSRVFVRVNUU19DUkVBVEUiLCJSRVFVRVNUU19WSUVXX09XTiIsIlJFUVVFU1RTX1ZJRVdfVEVOQU5UIiwiUkVRVUVTVFNfQVBQUk9WRV9NQU5BR0VSIiwiUkVRVUVTVFNfQVBQUk9WRV9GSU5BTkNFIiwiUkVRVUVTVFNfQ0FOQ0VMX09XTiIsIlRBU0tTX1ZJRVdfQVNTSUdORUQiLCJSRVBPUlRTX1ZJRVciLCJBVURJVF9WSUVXIiwiU1lTVEVNX0FETUlOIiwiQUxMX1BFUk1JU1NJT05TIiwiT2JqZWN0IiwidmFsdWVzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./config/permissions.ts\n");

/***/ }),

/***/ "(rsc)/./config/roles.ts":
/*!*************************!*\
  !*** ./config/roles.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ROLE_DEFINITIONS: () => (/* binding */ ROLE_DEFINITIONS),\n/* harmony export */   ROLE_NAMES: () => (/* binding */ ROLE_NAMES),\n/* harmony export */   getPermissionsForRoles: () => (/* binding */ getPermissionsForRoles),\n/* harmony export */   hasPermission: () => (/* binding */ hasPermission)\n/* harmony export */ });\n/* harmony import */ var _config_permissions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/config/permissions */ \"(rsc)/./config/permissions.ts\");\n\nconst ROLE_DEFINITIONS = {\n    SUPER_ADMIN: {\n        name: \"SUPER_ADMIN\",\n        label: \"Super Admin\",\n        description: \"Godlevel platform owner with every system and tenant permission.\",\n        permissions: _config_permissions__WEBPACK_IMPORTED_MODULE_0__.ALL_PERMISSIONS\n    },\n    ADMIN: {\n        name: \"ADMIN\",\n        label: \"Tenant Admin\",\n        description: \"Runs tenant users, roles, reporting, and operational oversight.\",\n        permissions: [\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.USERS_VIEW,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.USERS_MANAGE,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.ROLES_MANAGE,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REQUESTS_CREATE,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REQUESTS_VIEW_OWN,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REQUESTS_VIEW_TENANT,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REQUESTS_CANCEL_OWN,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.TASKS_VIEW_ASSIGNED,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REPORTS_VIEW,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.AUDIT_VIEW\n        ]\n    },\n    MANAGER: {\n        name: \"MANAGER\",\n        label: \"Manager\",\n        description: \"Reviews team travel requests and handles manager approval tasks.\",\n        permissions: [\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REQUESTS_CREATE,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REQUESTS_VIEW_OWN,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REQUESTS_VIEW_TENANT,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REQUESTS_APPROVE_MANAGER,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REQUESTS_CANCEL_OWN,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.TASKS_VIEW_ASSIGNED\n        ]\n    },\n    FINANCE: {\n        name: \"FINANCE\",\n        label: \"Finance\",\n        description: \"Reviews budget impact and handles finance approval tasks.\",\n        permissions: [\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REQUESTS_CREATE,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REQUESTS_VIEW_OWN,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REQUESTS_VIEW_TENANT,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REQUESTS_APPROVE_FINANCE,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.TASKS_VIEW_ASSIGNED,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REPORTS_VIEW\n        ]\n    },\n    REQUESTER: {\n        name: \"REQUESTER\",\n        label: \"Requester\",\n        description: \"Creates and tracks their own travel requests.\",\n        permissions: [\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REQUESTS_CREATE,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REQUESTS_VIEW_OWN,\n            _config_permissions__WEBPACK_IMPORTED_MODULE_0__.PERMISSIONS.REQUESTS_CANCEL_OWN\n        ]\n    }\n};\nconst ROLE_NAMES = Object.keys(ROLE_DEFINITIONS);\nfunction getPermissionsForRoles(roles) {\n    const permissionSet = new Set();\n    for (const role of roles){\n        const definition = ROLE_DEFINITIONS[role];\n        definition?.permissions.forEach((permission)=>permissionSet.add(permission));\n    }\n    return [\n        ...permissionSet\n    ];\n}\nfunction hasPermission(roles, permission) {\n    if (!roles?.length) return false;\n    return getPermissionsForRoles(roles).includes(permission);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9jb25maWcvcm9sZXMudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBb0U7QUFHN0QsTUFBTUUsbUJBQW9EO0lBQy9EQyxhQUFhO1FBQ1hDLE1BQU07UUFDTkMsT0FBTztRQUNQQyxhQUFhO1FBQ2JDLGFBQWFQLGdFQUFlQTtJQUM5QjtJQUNBUSxPQUFPO1FBQ0xKLE1BQU07UUFDTkMsT0FBTztRQUNQQyxhQUFhO1FBQ2JDLGFBQWE7WUFDWE4sNERBQVdBLENBQUNRLFVBQVU7WUFDdEJSLDREQUFXQSxDQUFDUyxZQUFZO1lBQ3hCVCw0REFBV0EsQ0FBQ1UsWUFBWTtZQUN4QlYsNERBQVdBLENBQUNXLGVBQWU7WUFDM0JYLDREQUFXQSxDQUFDWSxpQkFBaUI7WUFDN0JaLDREQUFXQSxDQUFDYSxvQkFBb0I7WUFDaENiLDREQUFXQSxDQUFDYyxtQkFBbUI7WUFDL0JkLDREQUFXQSxDQUFDZSxtQkFBbUI7WUFDL0JmLDREQUFXQSxDQUFDZ0IsWUFBWTtZQUN4QmhCLDREQUFXQSxDQUFDaUIsVUFBVTtTQUN2QjtJQUNIO0lBQ0FDLFNBQVM7UUFDUGYsTUFBTTtRQUNOQyxPQUFPO1FBQ1BDLGFBQWE7UUFDYkMsYUFBYTtZQUNYTiw0REFBV0EsQ0FBQ1csZUFBZTtZQUMzQlgsNERBQVdBLENBQUNZLGlCQUFpQjtZQUM3QlosNERBQVdBLENBQUNhLG9CQUFvQjtZQUNoQ2IsNERBQVdBLENBQUNtQix3QkFBd0I7WUFDcENuQiw0REFBV0EsQ0FBQ2MsbUJBQW1CO1lBQy9CZCw0REFBV0EsQ0FBQ2UsbUJBQW1CO1NBQ2hDO0lBQ0g7SUFDQUssU0FBUztRQUNQakIsTUFBTTtRQUNOQyxPQUFPO1FBQ1BDLGFBQWE7UUFDYkMsYUFBYTtZQUNYTiw0REFBV0EsQ0FBQ1csZUFBZTtZQUMzQlgsNERBQVdBLENBQUNZLGlCQUFpQjtZQUM3QlosNERBQVdBLENBQUNhLG9CQUFvQjtZQUNoQ2IsNERBQVdBLENBQUNxQix3QkFBd0I7WUFDcENyQiw0REFBV0EsQ0FBQ2UsbUJBQW1CO1lBQy9CZiw0REFBV0EsQ0FBQ2dCLFlBQVk7U0FDekI7SUFDSDtJQUNBTSxXQUFXO1FBQ1RuQixNQUFNO1FBQ05DLE9BQU87UUFDUEMsYUFBYTtRQUNiQyxhQUFhO1lBQ1hOLDREQUFXQSxDQUFDVyxlQUFlO1lBQzNCWCw0REFBV0EsQ0FBQ1ksaUJBQWlCO1lBQzdCWiw0REFBV0EsQ0FBQ2MsbUJBQW1CO1NBQ2hDO0lBQ0g7QUFDRixFQUFFO0FBRUssTUFBTVMsYUFBYUMsT0FBT0MsSUFBSSxDQUFDeEIsa0JBQStCO0FBRTlELFNBQVN5Qix1QkFBdUJDLEtBQWU7SUFDcEQsTUFBTUMsZ0JBQWdCLElBQUlDO0lBRTFCLEtBQUssTUFBTUMsUUFBUUgsTUFBTztRQUN4QixNQUFNSSxhQUFhOUIsZ0JBQWdCLENBQUM2QixLQUFnQjtRQUNwREMsWUFBWXpCLFlBQVkwQixRQUFRLENBQUNDLGFBQWVMLGNBQWNNLEdBQUcsQ0FBQ0Q7SUFDcEU7SUFFQSxPQUFPO1dBQUlMO0tBQWM7QUFDM0I7QUFFTyxTQUFTTyxjQUNkUixLQUEyQixFQUMzQk0sVUFBeUI7SUFFekIsSUFBSSxDQUFDTixPQUFPUyxRQUFRLE9BQU87SUFDM0IsT0FBT1YsdUJBQXVCQyxPQUFPVSxRQUFRLENBQUNKO0FBQ2hEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZW50ZXJwcmlzZS1icG0tcGxhdGZvcm0vLi9jb25maWcvcm9sZXMudHM/MGVkNSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBTExfUEVSTUlTU0lPTlMsIFBFUk1JU1NJT05TIH0gZnJvbSBcIkAvY29uZmlnL3Blcm1pc3Npb25zXCI7XG5pbXBvcnQgdHlwZSB7IEFwcFBlcm1pc3Npb24sIEFwcFJvbGUsIFJvbGVEZWZpbml0aW9uIH0gZnJvbSBcIkAvdHlwZXMvYXV0aFwiO1xuXG5leHBvcnQgY29uc3QgUk9MRV9ERUZJTklUSU9OUzogUmVjb3JkPEFwcFJvbGUsIFJvbGVEZWZpbml0aW9uPiA9IHtcbiAgU1VQRVJfQURNSU46IHtcbiAgICBuYW1lOiBcIlNVUEVSX0FETUlOXCIsXG4gICAgbGFiZWw6IFwiU3VwZXIgQWRtaW5cIixcbiAgICBkZXNjcmlwdGlvbjogXCJHb2RsZXZlbCBwbGF0Zm9ybSBvd25lciB3aXRoIGV2ZXJ5IHN5c3RlbSBhbmQgdGVuYW50IHBlcm1pc3Npb24uXCIsXG4gICAgcGVybWlzc2lvbnM6IEFMTF9QRVJNSVNTSU9OUyxcbiAgfSxcbiAgQURNSU46IHtcbiAgICBuYW1lOiBcIkFETUlOXCIsXG4gICAgbGFiZWw6IFwiVGVuYW50IEFkbWluXCIsXG4gICAgZGVzY3JpcHRpb246IFwiUnVucyB0ZW5hbnQgdXNlcnMsIHJvbGVzLCByZXBvcnRpbmcsIGFuZCBvcGVyYXRpb25hbCBvdmVyc2lnaHQuXCIsXG4gICAgcGVybWlzc2lvbnM6IFtcbiAgICAgIFBFUk1JU1NJT05TLlVTRVJTX1ZJRVcsXG4gICAgICBQRVJNSVNTSU9OUy5VU0VSU19NQU5BR0UsXG4gICAgICBQRVJNSVNTSU9OUy5ST0xFU19NQU5BR0UsXG4gICAgICBQRVJNSVNTSU9OUy5SRVFVRVNUU19DUkVBVEUsXG4gICAgICBQRVJNSVNTSU9OUy5SRVFVRVNUU19WSUVXX09XTixcbiAgICAgIFBFUk1JU1NJT05TLlJFUVVFU1RTX1ZJRVdfVEVOQU5ULFxuICAgICAgUEVSTUlTU0lPTlMuUkVRVUVTVFNfQ0FOQ0VMX09XTixcbiAgICAgIFBFUk1JU1NJT05TLlRBU0tTX1ZJRVdfQVNTSUdORUQsXG4gICAgICBQRVJNSVNTSU9OUy5SRVBPUlRTX1ZJRVcsXG4gICAgICBQRVJNSVNTSU9OUy5BVURJVF9WSUVXLFxuICAgIF0sXG4gIH0sXG4gIE1BTkFHRVI6IHtcbiAgICBuYW1lOiBcIk1BTkFHRVJcIixcbiAgICBsYWJlbDogXCJNYW5hZ2VyXCIsXG4gICAgZGVzY3JpcHRpb246IFwiUmV2aWV3cyB0ZWFtIHRyYXZlbCByZXF1ZXN0cyBhbmQgaGFuZGxlcyBtYW5hZ2VyIGFwcHJvdmFsIHRhc2tzLlwiLFxuICAgIHBlcm1pc3Npb25zOiBbXG4gICAgICBQRVJNSVNTSU9OUy5SRVFVRVNUU19DUkVBVEUsXG4gICAgICBQRVJNSVNTSU9OUy5SRVFVRVNUU19WSUVXX09XTixcbiAgICAgIFBFUk1JU1NJT05TLlJFUVVFU1RTX1ZJRVdfVEVOQU5ULFxuICAgICAgUEVSTUlTU0lPTlMuUkVRVUVTVFNfQVBQUk9WRV9NQU5BR0VSLFxuICAgICAgUEVSTUlTU0lPTlMuUkVRVUVTVFNfQ0FOQ0VMX09XTixcbiAgICAgIFBFUk1JU1NJT05TLlRBU0tTX1ZJRVdfQVNTSUdORUQsXG4gICAgXSxcbiAgfSxcbiAgRklOQU5DRToge1xuICAgIG5hbWU6IFwiRklOQU5DRVwiLFxuICAgIGxhYmVsOiBcIkZpbmFuY2VcIixcbiAgICBkZXNjcmlwdGlvbjogXCJSZXZpZXdzIGJ1ZGdldCBpbXBhY3QgYW5kIGhhbmRsZXMgZmluYW5jZSBhcHByb3ZhbCB0YXNrcy5cIixcbiAgICBwZXJtaXNzaW9uczogW1xuICAgICAgUEVSTUlTU0lPTlMuUkVRVUVTVFNfQ1JFQVRFLFxuICAgICAgUEVSTUlTU0lPTlMuUkVRVUVTVFNfVklFV19PV04sXG4gICAgICBQRVJNSVNTSU9OUy5SRVFVRVNUU19WSUVXX1RFTkFOVCxcbiAgICAgIFBFUk1JU1NJT05TLlJFUVVFU1RTX0FQUFJPVkVfRklOQU5DRSxcbiAgICAgIFBFUk1JU1NJT05TLlRBU0tTX1ZJRVdfQVNTSUdORUQsXG4gICAgICBQRVJNSVNTSU9OUy5SRVBPUlRTX1ZJRVcsXG4gICAgXSxcbiAgfSxcbiAgUkVRVUVTVEVSOiB7XG4gICAgbmFtZTogXCJSRVFVRVNURVJcIixcbiAgICBsYWJlbDogXCJSZXF1ZXN0ZXJcIixcbiAgICBkZXNjcmlwdGlvbjogXCJDcmVhdGVzIGFuZCB0cmFja3MgdGhlaXIgb3duIHRyYXZlbCByZXF1ZXN0cy5cIixcbiAgICBwZXJtaXNzaW9uczogW1xuICAgICAgUEVSTUlTU0lPTlMuUkVRVUVTVFNfQ1JFQVRFLFxuICAgICAgUEVSTUlTU0lPTlMuUkVRVUVTVFNfVklFV19PV04sXG4gICAgICBQRVJNSVNTSU9OUy5SRVFVRVNUU19DQU5DRUxfT1dOLFxuICAgIF0sXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgUk9MRV9OQU1FUyA9IE9iamVjdC5rZXlzKFJPTEVfREVGSU5JVElPTlMpIGFzIEFwcFJvbGVbXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBlcm1pc3Npb25zRm9yUm9sZXMocm9sZXM6IHN0cmluZ1tdKTogQXBwUGVybWlzc2lvbltdIHtcbiAgY29uc3QgcGVybWlzc2lvblNldCA9IG5ldyBTZXQ8QXBwUGVybWlzc2lvbj4oKTtcblxuICBmb3IgKGNvbnN0IHJvbGUgb2Ygcm9sZXMpIHtcbiAgICBjb25zdCBkZWZpbml0aW9uID0gUk9MRV9ERUZJTklUSU9OU1tyb2xlIGFzIEFwcFJvbGVdO1xuICAgIGRlZmluaXRpb24/LnBlcm1pc3Npb25zLmZvckVhY2goKHBlcm1pc3Npb24pID0+IHBlcm1pc3Npb25TZXQuYWRkKHBlcm1pc3Npb24pKTtcbiAgfVxuXG4gIHJldHVybiBbLi4ucGVybWlzc2lvblNldF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNQZXJtaXNzaW9uKFxuICByb2xlczogc3RyaW5nW10gfCB1bmRlZmluZWQsXG4gIHBlcm1pc3Npb246IEFwcFBlcm1pc3Npb24sXG4pOiBib29sZWFuIHtcbiAgaWYgKCFyb2xlcz8ubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBnZXRQZXJtaXNzaW9uc0ZvclJvbGVzKHJvbGVzKS5pbmNsdWRlcyhwZXJtaXNzaW9uKTtcbn1cbiJdLCJuYW1lcyI6WyJBTExfUEVSTUlTU0lPTlMiLCJQRVJNSVNTSU9OUyIsIlJPTEVfREVGSU5JVElPTlMiLCJTVVBFUl9BRE1JTiIsIm5hbWUiLCJsYWJlbCIsImRlc2NyaXB0aW9uIiwicGVybWlzc2lvbnMiLCJBRE1JTiIsIlVTRVJTX1ZJRVciLCJVU0VSU19NQU5BR0UiLCJST0xFU19NQU5BR0UiLCJSRVFVRVNUU19DUkVBVEUiLCJSRVFVRVNUU19WSUVXX09XTiIsIlJFUVVFU1RTX1ZJRVdfVEVOQU5UIiwiUkVRVUVTVFNfQ0FOQ0VMX09XTiIsIlRBU0tTX1ZJRVdfQVNTSUdORUQiLCJSRVBPUlRTX1ZJRVciLCJBVURJVF9WSUVXIiwiTUFOQUdFUiIsIlJFUVVFU1RTX0FQUFJPVkVfTUFOQUdFUiIsIkZJTkFOQ0UiLCJSRVFVRVNUU19BUFBST1ZFX0ZJTkFOQ0UiLCJSRVFVRVNURVIiLCJST0xFX05BTUVTIiwiT2JqZWN0Iiwia2V5cyIsImdldFBlcm1pc3Npb25zRm9yUm9sZXMiLCJyb2xlcyIsInBlcm1pc3Npb25TZXQiLCJTZXQiLCJyb2xlIiwiZGVmaW5pdGlvbiIsImZvckVhY2giLCJwZXJtaXNzaW9uIiwiYWRkIiwiaGFzUGVybWlzc2lvbiIsImxlbmd0aCIsImluY2x1ZGVzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./config/roles.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! zod */ \"(rsc)/./node_modules/zod/v3/types.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var _config_roles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/config/roles */ \"(rsc)/./config/roles.ts\");\n\n\n\n\n\nconst credentialsSchema = zod__WEBPACK_IMPORTED_MODULE_4__.object({\n    email: zod__WEBPACK_IMPORTED_MODULE_4__.string().email(),\n    password: zod__WEBPACK_IMPORTED_MODULE_4__.string().min(1)\n});\nconst authOptions = {\n    session: {\n        strategy: \"jwt\"\n    },\n    pages: {\n        signIn: \"/login\"\n    },\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"Credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                const parsed = credentialsSchema.safeParse(credentials);\n                if (!parsed.success) return null;\n                const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n                    where: {\n                        email: parsed.data.email.toLowerCase()\n                    },\n                    include: {\n                        tenant: true,\n                        roles: {\n                            include: {\n                                role: true\n                            }\n                        }\n                    }\n                });\n                if (!user?.passwordHash) return null;\n                const passwordMatches = await bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().compare(parsed.data.password, user.passwordHash);\n                if (!passwordMatches) return null;\n                const roles = user.roles.map((userRole)=>userRole.role.name);\n                return {\n                    id: user.id,\n                    email: user.email,\n                    name: [\n                        user.firstName,\n                        user.lastName\n                    ].filter(Boolean).join(\" \") || user.email,\n                    tenantId: user.tenantId,\n                    tenantDomain: user.tenant.domain,\n                    roles,\n                    permissions: (0,_config_roles__WEBPACK_IMPORTED_MODULE_3__.getPermissionsForRoles)(roles)\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.userId = user.id;\n                token.tenantId = user.tenantId;\n                token.tenantDomain = user.tenantDomain;\n                token.roles = user.roles;\n                token.permissions = user.permissions;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (session.user) {\n                session.user.id = token.userId;\n                session.user.tenantId = token.tenantId;\n                session.user.tenantDomain = token.tenantDomain;\n                session.user.roles = token.roles;\n                session.user.permissions = token.permissions;\n            }\n            return session;\n        }\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFLO2dCQUNoQ3BCLFFBQVFhLElBQUksQ0FBQ3VCLFdBQVcsR0FBR0csTUFBTUgsV0FBVztZQUM5QztZQUVBLE9BQU9wQztRQUNUO0lBQ0Y7QUFDRixFQUFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZW50ZXJwcmlzZS1icG0tcGxhdGZvcm0vLi9saWIvYXV0aC50cz9iZjdlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSBcIm5leHQtYXV0aFwiO1xuaW1wb3J0IENyZWRlbnRpYWxzUHJvdmlkZXIgZnJvbSBcIm5leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHNcIjtcbmltcG9ydCBiY3J5cHQgZnJvbSBcImJjcnlwdGpzXCI7XG5pbXBvcnQgeyB6IH0gZnJvbSBcInpvZFwiO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSBcIkAvbGliL3ByaXNtYVwiO1xuaW1wb3J0IHsgZ2V0UGVybWlzc2lvbnNGb3JSb2xlcyB9IGZyb20gXCJAL2NvbmZpZy9yb2xlc1wiO1xuaW1wb3J0IHR5cGUgeyBBcHBSb2xlIH0gZnJvbSBcIkAvdHlwZXMvYXV0aFwiO1xuXG5jb25zdCBjcmVkZW50aWFsc1NjaGVtYSA9IHoub2JqZWN0KHtcbiAgZW1haWw6IHouc3RyaW5nKCkuZW1haWwoKSxcbiAgcGFzc3dvcmQ6IHouc3RyaW5nKCkubWluKDEpLFxufSk7XG5cbmV4cG9ydCBjb25zdCBhdXRoT3B0aW9uczogTmV4dEF1dGhPcHRpb25zID0ge1xuICBzZXNzaW9uOiB7IHN0cmF0ZWd5OiBcImp3dFwiIH0sXG4gIHBhZ2VzOiB7XG4gICAgc2lnbkluOiBcIi9sb2dpblwiLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICBDcmVkZW50aWFsc1Byb3ZpZGVyKHtcbiAgICAgIG5hbWU6IFwiQ3JlZGVudGlhbHNcIixcbiAgICAgIGNyZWRlbnRpYWxzOiB7XG4gICAgICAgIGVtYWlsOiB7IGxhYmVsOiBcIkVtYWlsXCIsIHR5cGU6IFwiZW1haWxcIiB9LFxuICAgICAgICBwYXNzd29yZDogeyBsYWJlbDogXCJQYXNzd29yZFwiLCB0eXBlOiBcInBhc3N3b3JkXCIgfSxcbiAgICAgIH0sXG4gICAgICBhc3luYyBhdXRob3JpemUoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkID0gY3JlZGVudGlhbHNTY2hlbWEuc2FmZVBhcnNlKGNyZWRlbnRpYWxzKTtcbiAgICAgICAgaWYgKCFwYXJzZWQuc3VjY2VzcykgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoe1xuICAgICAgICAgIHdoZXJlOiB7IGVtYWlsOiBwYXJzZWQuZGF0YS5lbWFpbC50b0xvd2VyQ2FzZSgpIH0sXG4gICAgICAgICAgaW5jbHVkZToge1xuICAgICAgICAgICAgdGVuYW50OiB0cnVlLFxuICAgICAgICAgICAgcm9sZXM6IHsgaW5jbHVkZTogeyByb2xlOiB0cnVlIH0gfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXVzZXI/LnBhc3N3b3JkSGFzaCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgcGFzc3dvcmRNYXRjaGVzID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUocGFyc2VkLmRhdGEucGFzc3dvcmQsIHVzZXIucGFzc3dvcmRIYXNoKTtcbiAgICAgICAgaWYgKCFwYXNzd29yZE1hdGNoZXMpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IHJvbGVzID0gdXNlci5yb2xlcy5tYXAoKHVzZXJSb2xlKSA9PiB1c2VyUm9sZS5yb2xlLm5hbWUgYXMgQXBwUm9sZSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgICBuYW1lOiBbdXNlci5maXJzdE5hbWUsIHVzZXIubGFzdE5hbWVdLmZpbHRlcihCb29sZWFuKS5qb2luKFwiIFwiKSB8fCB1c2VyLmVtYWlsLFxuICAgICAgICAgIHRlbmFudElkOiB1c2VyLnRlbmFudElkLFxuICAgICAgICAgIHRlbmFudERvbWFpbjogdXNlci50ZW5hbnQuZG9tYWluLFxuICAgICAgICAgIHJvbGVzLFxuICAgICAgICAgIHBlcm1pc3Npb25zOiBnZXRQZXJtaXNzaW9uc0ZvclJvbGVzKHJvbGVzKSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG4gIGNhbGxiYWNrczoge1xuICAgIGFzeW5jIGp3dCh7IHRva2VuLCB1c2VyIH0pIHtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHRva2VuLnVzZXJJZCA9IHVzZXIuaWQ7XG4gICAgICAgIHRva2VuLnRlbmFudElkID0gdXNlci50ZW5hbnRJZDtcbiAgICAgICAgdG9rZW4udGVuYW50RG9tYWluID0gdXNlci50ZW5hbnREb21haW47XG4gICAgICAgIHRva2VuLnJvbGVzID0gdXNlci5yb2xlcztcbiAgICAgICAgdG9rZW4ucGVybWlzc2lvbnMgPSB1c2VyLnBlcm1pc3Npb25zO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdG9rZW47XG4gICAgfSxcbiAgICBhc3luYyBzZXNzaW9uKHsgc2Vzc2lvbiwgdG9rZW4gfSkge1xuICAgICAgaWYgKHNlc3Npb24udXNlcikge1xuICAgICAgICBzZXNzaW9uLnVzZXIuaWQgPSB0b2tlbi51c2VySWQ7XG4gICAgICAgIHNlc3Npb24udXNlci50ZW5hbnRJZCA9IHRva2VuLnRlbmFudElkO1xuICAgICAgICBzZXNzaW9uLnVzZXIudGVuYW50RG9tYWluID0gdG9rZW4udGVuYW50RG9tYWluO1xuICAgICAgICBzZXNzaW9uLnVzZXIucm9sZXMgPSB0b2tlbi5yb2xlcztcbiAgICAgICAgc2Vzc2lvbi51c2VyLnBlcm1pc3Npb25zID0gdG9rZW4ucGVybWlzc2lvbnM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZXNzaW9uO1xuICAgIH0sXG4gIH0sXG59O1xuIl0sIm5hbWVzIjpbIkNyZWRlbnRpYWxzUHJvdmlkZXIiLCJiY3J5cHQiLCJ6IiwicHJpc21hIiwiZ2V0UGVybWlzc2lvbnNGb3JSb2xlcyIsImNyZWRlbnRpYWxzU2NoZW1hIiwib2JqZWN0IiwiZW1haWwiLCJzdHJpbmciLCJwYXNzd29yZCIsIm1pbiIsImF1dGhPcHRpb25zIiwic2Vzc2lvbiIsInN0cmF0ZWd5IiwicGFnZXMiLCJzaWduSW4iLCJwcm92aWRlcnMiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJsYWJlbCIsInR5cGUiLCJhdXRob3JpemUiLCJwYXJzZWQiLCJzYWZlUGFyc2UiLCJzdWNjZXNzIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImRhdGEiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGUiLCJ0ZW5hbnQiLCJyb2xlcyIsInJvbGUiLCJwYXNzd29yZEhhc2giLCJwYXNzd29yZE1hdGNoZXMiLCJjb21wYXJlIiwibWFwIiwidXNlclJvbGUiLCJpZCIsImZpcnN0TmFtZSIsImxhc3ROYW1lIiwiZmlsdGVyIiwiQm9vbGVhbiIsImpvaW4iLCJ0ZW5hbnRJZCIsInRlbmFudERvbWFpbiIsImRvbWFpbiIsInBlcm1pc3Npb25zIiwiY2FsbGJhY2tzIiwiand0IiwidG9rZW4iLCJ1c2VySWQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"error\",\n        \"warn\"\n    ] : 0\n});\nif (true) {\n    globalForPrisma.prisma = prisma;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQUU5QyxNQUFNQyxrQkFBa0JDO0FBRWpCLE1BQU1DLFNBQ1hGLGdCQUFnQkUsTUFBTSxJQUN0QixJQUFJSCx3REFBWUEsQ0FBQztJQUNmSSxLQUFLQyxLQUFzQyxHQUFHO1FBQUM7UUFBUztLQUFPLEdBQUcsQ0FBUztBQUM3RSxHQUFHO0FBRUwsSUFBSUEsSUFBcUMsRUFBRTtJQUN6Q0osZ0JBQWdCRSxNQUFNLEdBQUdBO0FBQzNCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZW50ZXJwcmlzZS1icG0tcGxhdGZvcm0vLi9saWIvcHJpc21hLnRzPzk4MjIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5cbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbFRoaXMgYXMgdW5rbm93biBhcyB7IHByaXNtYT86IFByaXNtYUNsaWVudCB9O1xuXG5leHBvcnQgY29uc3QgcHJpc21hID1cbiAgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA/P1xuICBuZXcgUHJpc21hQ2xpZW50KHtcbiAgICBsb2c6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCIgPyBbXCJlcnJvclwiLCBcIndhcm5cIl0gOiBbXCJlcnJvclwiXSxcbiAgfSk7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYTtcbn1cbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWxUaGlzIiwicHJpc21hIiwibG9nIiwicHJvY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/zod","vendor-chunks/openid-client","vendor-chunks/bcryptjs","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cshezi%5CMusic%5CProjects%5Ctravel%5Centerprise-bpm-platform%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cshezi%5CMusic%5CProjects%5Ctravel%5Centerprise-bpm-platform&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();