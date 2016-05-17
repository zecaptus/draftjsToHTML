'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require('immutable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EMPTY_SET = (0, _immutable.OrderedSet)();

var DraftJsToHTML = function () {
    function DraftJsToHTML(rawContent) {
        _classCallCheck(this, DraftJsToHTML);

        this.rawContent = rawContent;

        this.ranges = this.buildRangesArray();
    }

    _createClass(DraftJsToHTML, [{
        key: 'buildRangesArray',
        value: function buildRangesArray() {
            // TODO : handle multiple blocks
            var _rawContent$blocks$ = this.rawContent.blocks[0];
            var inlineStyleRanges = _rawContent$blocks$.inlineStyleRanges;
            var entityRanges = _rawContent$blocks$.entityRanges;
            var text = _rawContent$blocks$.text;


            var styles = this.decodeInlineStyle(text, inlineStyleRanges);
            var entities = this.decodeEntities(text, entityRanges);

            return styles.reduce(function (result, current, index) {
                if (index === 1) {
                    result = [{
                        entity: false,
                        offset: 0,
                        length: 0,
                        style: result
                    }];
                }

                var lastItem = result[result.length - 1];
                var lastItemBis = undefined;
                lastItem.length++;

                if (lastItem.entity) {
                    lastItemBis = lastItem.styles[lastItem.styles.length - 1];
                    lastItemBis.length++;
                }

                var isEntity = entities[index] !== null;
                var isSameEntity = isEntity && lastItem.entityKey === entities[index];

                if (isEntity) {
                    if (!isSameEntity) {

                        result.push({
                            entity: true,
                            offset: index,
                            length: 0,
                            entityKey: entities[index],
                            styles: [{
                                offset: index,
                                length: 0,
                                style: current
                            }]
                        });
                    } else {

                        if (!lastItemBis.style.equals(current)) {
                            lastItem.styles.push({
                                offset: index,
                                length: 0,
                                style: current
                            });
                        }
                    }
                } else if (lastItem.style && !lastItem.style.equals(current) || lastItem.entity) {

                    result.push({
                        entity: false,
                        offset: index,
                        length: 0,
                        style: current
                    });
                }

                return result;
            });
        }
    }, {
        key: 'getEntity',
        value: function getEntity(key) {
            return this.rawContent.entityMap[key];
        }
    }, {
        key: 'decodeInlineStyle',
        value: function decodeInlineStyle(text, ranges) {
            var styles = new Array(text.length).fill(EMPTY_SET);

            if (ranges) {
                ranges.forEach(function ( /*object*/range) {
                    var cursor = text.substr(0, range.offset).length;
                    var end = cursor + text.substr(range.offset, range.length).length;
                    while (cursor < end) {
                        styles[cursor] = styles[cursor].add(range.style);
                        cursor++;
                    }
                });
            }

            return styles;
        }
    }, {
        key: 'decodeEntities',
        value: function decodeEntities(text, ranges) {
            var entities = new Array(text.length).fill(null);
            if (ranges) {
                ranges.forEach(function (range) {
                    // Using Unicode-enabled substrings converted to JavaScript lengths,
                    // fill the output array with entity keys.
                    var start = text.substr(0, range.offset).length;
                    var end = start + text.substr(range.offset, range.length).length;
                    for (var ii = start; ii < end; ii++) {
                        entities[ii] = range.key;
                    }
                });
            }

            return entities;
        }
    }, {
        key: 'createHtmlStyle',
        value: function createHtmlStyle(range) {
            var text = this.rawContent.blocks[0].text;


            return '<span class="' + range.style.toArray().join(' ') + '">' + text.substr(range.offset, range.length) + '</span>';
        }
    }, {
        key: 'createHTmlEntities',
        value: function createHTmlEntities(range) {
            return '<span class="Entity" data-type="' + this.getEntity(range.entityKey).type + '">' + range.styles.map(this.createHtmlStyle.bind(this)).join('') + '</span>';
        }
    }, {
        key: 'toHtml',
        value: function toHtml() {
            var _this = this;

            var ranges = arguments.length <= 0 || arguments[0] === undefined ? this.ranges : arguments[0];

            return ranges.map(function (range) {
                return !range.entity ? _this.createHtmlStyle(range) : _this.createHTmlEntities(range);
            }).join('');
        }
    }]);

    return DraftJsToHTML;
}();

exports.default = DraftJsToHTML;
;
//# sourceMappingURL=index.js.map