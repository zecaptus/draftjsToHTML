"use strict";

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rawContent = { "entityMap": { "0": { "type": "@mention", "mutability": "SEGMENTED", "data": { "id": "ff80818143dd68b00143e34749d6005a", "userName": "ff80818143dd68b00143e34749d6005a", "firstName": "Standard", "lastName": "User", "email": "standard@anaplan.com" } }, "1": { "type": "#mention", "mutability": "SEGMENTED", "data": { "entityLongId": 115000000020, "label": "Summary" } } }, "blocks": [{ "key": "ek4og", "text": "blabla Standard User xgsdsdgdsfgdfgh sdfg dgh dsfgsdfg Summary ", "type": "unstyled", "depth": 0, "inlineStyleRanges": [{ "offset": 3, "length": 22, "style": "BOLD" }, { "offset": 37, "length": 4, "style": "BOLD" }, { "offset": 14, "length": 14, "style": "ITALIC" }, { "offset": 42, "length": 13, "style": "ITALIC" }], "entityRanges": [{ "offset": 7, "length": 13, "key": 0 }, { "offset": 55, "length": 7, "key": 1 }] }] };

var html = new _index2.default(rawContent).toHtml();

console.log(html);
//# sourceMappingURL=test.js.map