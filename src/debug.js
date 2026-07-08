/*
 * Debug module
 */

EBSRepeater.debug = {

    enabled: false,

    init: function () {

        this.enabled = EBSRepeater.config.debug === true;

    },

    log: function () {

        if (!this.enabled) {
            return;
        }

        if (typeof console !== "undefined" && console.log) {
            console.log.apply(console, arguments);
        }

    },

    warn: function () {

        if (!this.enabled) {
            return;
        }

        if (typeof console !== "undefined" && console.warn) {
            console.warn.apply(console, arguments);
        }

    },

    error: function () {

        if (!this.enabled) {
            return;
        }

        if (typeof console !== "undefined" && console.error) {
            console.error.apply(console, arguments);
        }

    }

};