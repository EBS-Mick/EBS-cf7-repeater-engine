/*
 * Engine initialization
 */

/*
 * Engine initialization
 */

EBSRepeater.init = function (config) {

    config = config || EBSConfig;

    if (config.config) {
        EBSRepeater.config = config.config;
    }

    if (config.rules) {
        EBSRepeater.rules.set(config.rules);
    }

    if (config.summary) {
        EBSRepeater.summary.setFields(config.summary);
    }

    if (config.validation) {
        EBSRepeater.validation.set(config.validation);
    }

    if (config.submit) {
        EBSRepeater.submit.set(config.submit);
    }

    EBSRepeater.debug.init();
    EBSRepeater.events.bind();
    //EBSRepeater.observer.start();

    this.refresh();

};

/**
 * Refreshes the engine.
 */
EBSRepeater.refresh = function () {

    var rows;
    var i;

    rows = document.querySelectorAll(".repeater-field-item");

    for (i = 0; i < rows.length; i++) {

        EBSRepeater.rules.apply(rows[i]);

    }

    EBSRepeater.summary.update();

};