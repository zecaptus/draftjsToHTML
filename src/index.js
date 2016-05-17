import { OrderedSet } from 'immutable';
const EMPTY_SET = OrderedSet();


export default class DraftJsToHTML {

    constructor(rawContent) {
        this.rawContent = rawContent;

        this.ranges = this.buildRangesArray();
    }

    buildRangesArray(){
        // TODO : handle multiple blocks
        const { inlineStyleRanges, entityRanges, text } = this.rawContent.blocks[0];

        const styles = this.decodeInlineStyle(text, inlineStyleRanges);
        const entities = this.decodeEntities(text, entityRanges);

        return styles.reduce((result, current, index) => {
            if(index === 1) {
                result = [{
                    entity: false,
                    offset: 0,
                    length: 0,
                    style: result
                }]
            }

            let lastItem = result[result.length-1];
            let lastItemBis;
            lastItem.length++;

            if (lastItem.entity) {
                lastItemBis = lastItem.styles[lastItem.styles.length - 1];
                lastItemBis.length++;
            }

            const isEntity = (entities[index] !== null);
            const isSameEntity = isEntity && lastItem.entityKey === entities[index];

            if(isEntity) {
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
                }else{

                    if(! lastItemBis.style.equals(current) ) {
                        lastItem.styles.push({
                            offset: index,
                            length: 0,
                            style: current
                        })
                    }
                }
            }else if(lastItem.style && ! lastItem.style.equals(current) || lastItem.entity) {

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

    getEntity(key) {
        return this.rawContent.entityMap[key];
    }

    decodeInlineStyle(text, ranges) {
        var styles = new Array(text.length).fill(EMPTY_SET);

        if (ranges) {
            ranges.forEach((/*object*/ range) => {
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

    decodeEntities(text, ranges) {
        var entities = new Array(text.length).fill(null);
        if (ranges) {
            ranges.forEach(
                range => {
                    // Using Unicode-enabled substrings converted to JavaScript lengths,
                    // fill the output array with entity keys.
                    var start = text.substr(0, range.offset).length;
                    var end = start + text.substr(range.offset, range.length).length;
                    for (var ii = start; ii < end; ii++) {
                        entities[ii] = range.key;
                    }
                }
            );
        }

        return entities;
    }

    createHtmlStyle(range) {
        const { text } = this.rawContent.blocks[0];

        return `<span class="${range.style.toArray().join(' ')}">${text.substr(range.offset, range.length)}</span>`;
    }

    createHTmlEntities(range){
        return `<span class="Entity" data-type="${this.getEntity(range.entityKey).type}">${ range.styles.map(this.createHtmlStyle.bind(this)).join('') }</span>`;
    }

    toHtml(ranges = this.ranges) {
        return ranges.map(range => (!range.entity)?this.createHtmlStyle(range):this.createHTmlEntities(range)).join('');
    }

};