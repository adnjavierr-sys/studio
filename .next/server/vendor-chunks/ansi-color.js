/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/ansi-color";
exports.ids = ["vendor-chunks/ansi-color"];
exports.modules = {

/***/ "(action-browser)/./node_modules/ansi-color/lib/ansi-color.js":
/*!***************************************************!*\
  !*** ./node_modules/ansi-color/lib/ansi-color.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("// ANSI color code outputs for strings\n\nvar ANSI_CODES = {\n  \"off\": 0,\n  \"bold\": 1,\n  \"italic\": 3,\n  \"underline\": 4,\n  \"blink\": 5,\n  \"inverse\": 7,\n  \"hidden\": 8,\n  \"black\": 30,\n  \"red\": 31,\n  \"green\": 32,\n  \"yellow\": 33,\n  \"blue\": 34,\n  \"magenta\": 35,\n  \"cyan\": 36,\n  \"white\": 37,\n  \"black_bg\": 40,\n  \"red_bg\": 41,\n  \"green_bg\": 42,\n  \"yellow_bg\": 43,\n  \"blue_bg\": 44,\n  \"magenta_bg\": 45,\n  \"cyan_bg\": 46,\n  \"white_bg\": 47\n};\n\nexports.set = function(str, color) {\n  if(!color) return str;\n\n  var color_attrs = color.split(\"+\");\n  var ansi_str = \"\";\n  for(var i=0, attr; attr = color_attrs[i]; i++) {\n    ansi_str += \"\\033[\" + ANSI_CODES[attr] + \"m\";\n  }\n  ansi_str += str + \"\\033[\" + ANSI_CODES[\"off\"] + \"m\";\n  return ansi_str;\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFjdGlvbi1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9hbnNpLWNvbG9yL2xpYi9hbnNpLWNvbG9yLmpzIiwibWFwcGluZ3MiOiJBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLHVCQUF1QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyIvaG9tZS91c2VyL3N0dWRpby9ub2RlX21vZHVsZXMvYW5zaS1jb2xvci9saWIvYW5zaS1jb2xvci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBTlNJIGNvbG9yIGNvZGUgb3V0cHV0cyBmb3Igc3RyaW5nc1xuXG52YXIgQU5TSV9DT0RFUyA9IHtcbiAgXCJvZmZcIjogMCxcbiAgXCJib2xkXCI6IDEsXG4gIFwiaXRhbGljXCI6IDMsXG4gIFwidW5kZXJsaW5lXCI6IDQsXG4gIFwiYmxpbmtcIjogNSxcbiAgXCJpbnZlcnNlXCI6IDcsXG4gIFwiaGlkZGVuXCI6IDgsXG4gIFwiYmxhY2tcIjogMzAsXG4gIFwicmVkXCI6IDMxLFxuICBcImdyZWVuXCI6IDMyLFxuICBcInllbGxvd1wiOiAzMyxcbiAgXCJibHVlXCI6IDM0LFxuICBcIm1hZ2VudGFcIjogMzUsXG4gIFwiY3lhblwiOiAzNixcbiAgXCJ3aGl0ZVwiOiAzNyxcbiAgXCJibGFja19iZ1wiOiA0MCxcbiAgXCJyZWRfYmdcIjogNDEsXG4gIFwiZ3JlZW5fYmdcIjogNDIsXG4gIFwieWVsbG93X2JnXCI6IDQzLFxuICBcImJsdWVfYmdcIjogNDQsXG4gIFwibWFnZW50YV9iZ1wiOiA0NSxcbiAgXCJjeWFuX2JnXCI6IDQ2LFxuICBcIndoaXRlX2JnXCI6IDQ3XG59O1xuXG5leHBvcnRzLnNldCA9IGZ1bmN0aW9uKHN0ciwgY29sb3IpIHtcbiAgaWYoIWNvbG9yKSByZXR1cm4gc3RyO1xuXG4gIHZhciBjb2xvcl9hdHRycyA9IGNvbG9yLnNwbGl0KFwiK1wiKTtcbiAgdmFyIGFuc2lfc3RyID0gXCJcIjtcbiAgZm9yKHZhciBpPTAsIGF0dHI7IGF0dHIgPSBjb2xvcl9hdHRyc1tpXTsgaSsrKSB7XG4gICAgYW5zaV9zdHIgKz0gXCJcXDAzM1tcIiArIEFOU0lfQ09ERVNbYXR0cl0gKyBcIm1cIjtcbiAgfVxuICBhbnNpX3N0ciArPSBzdHIgKyBcIlxcMDMzW1wiICsgQU5TSV9DT0RFU1tcIm9mZlwiXSArIFwibVwiO1xuICByZXR1cm4gYW5zaV9zdHI7XG59OyJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(action-browser)/./node_modules/ansi-color/lib/ansi-color.js\n");

/***/ })

};
;