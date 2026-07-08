/*
 * Utility helpers
 */

EBSRepeater.utils = {

    /**
     * Returns true if the value is undefined, null or empty.
     *
     * @param {*} value
     * @returns {Boolean}
     */
    isEmpty: function (value) {

        return (
            value === undefined ||
            value === null ||
            value === ""
        );

    },

    /**
     * Returns true if value is an array.
     *
     * @param {*} value
     * @returns {Boolean}
     */
    isArray: function (value) {

        return Object.prototype.toString.call(value) === "[object Array]";

    },

    /**
     * Converts NodeList to Array.
     *
     * @param {NodeList} list
     * @returns {Array}
     */
    toArray: function (list) {

        return Array.prototype.slice.call(list);

    },

    /**
     * Trim string.
     *
     * @param {String} value
     * @returns {String}
     */
    trim: function (value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value).replace(/^\s+|\s+$/g, "");

    }

};