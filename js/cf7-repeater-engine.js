/*!
 * --------------------------------------------------------
 * EBS CF7 Repeater Engine
 * --------------------------------------------------------
 * Version : 0.1.0
 * Author  : EBS
 * License : MIT
 * --------------------------------------------------------
 */var EBSRepeater = {

    version: "0.1.0",

    config: {},

    fields: {},

    groups: {},

    rules: {},

    summary: {},

    dom: {},

    events: {},

    observer: {},

    debug: {}

};/*
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
     * Removes duplicate values.
     *
     * @param {Array} array
     * @returns {Array}
     */
    unique: function (array) {

        var result = [];
        var i;

        for (i = 0; i < array.length; i++) {

            if (result.indexOf(array[i]) === -1) {
                result.push(array[i]);
            }

        }

        return result;

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

};/*
 * DOM helpers
 */

EBSRepeater.dom = {

    /**
     * Returns the repeater row.
     *
     * @param {HTMLElement} element
     * @returns {HTMLElement|null}
     */
    getRow: function (element) {

        if (!element) {
            return null;
        }

        return element.closest(".repeater-field-item");

    },

    /**
     * Returns the first field matching the name.
     *
     * @param {HTMLElement} row
     * @param {String} name
     * @returns {HTMLElement|null}
     */
    getField: function (row, name) {

        if (!row) {
            return null;
        }

        return row.querySelector('[name^="' + name + '"]');

    },

    /**
     * Returns the field value.
     *
     * @param {HTMLElement} row
     * @param {String} name
     * @returns {String}
     */
    getValue: function (row, name) {

        var field = this.getField(row, name);

        if (!field) {
            return "";
        }

        return EBSRepeater.utils.trim(field.value);

    },

    /**
     * Returns checked checkbox values.
     *
     * @param {HTMLElement} row
     * @param {String} name
     * @returns {String}
     */
    getCheckedValues: function (row, name) {

        var values = [];
        var fields;
        var i;

        if (!row) {
            return "";
        }

        fields = row.querySelectorAll(
            'input[name^="' + name + '"]:checked'
        );

        for (i = 0; i < fields.length; i++) {
            values.push(fields[i].value);
        }

        return values.join("/");

    },

    /**
     * Returns a group element.
     *
     * @param {HTMLElement} row
     * @param {String} group
     * @returns {HTMLElement|null}
     */
    getGroup: function (row, group) {

        if (!row) {
            return null;
        }

        return row.querySelector('[data-group="' + group + '"]');

    },

    /**
     * Shows a group.
     *
     * @param {HTMLElement} row
     * @param {String} group
     */
    showGroup: function (row, group) {

        var element = this.getGroup(row, group);

        if (!element) {
            return;
        }

        element.style.display = "block";
        element.classList.add("cf-active");

    },

    /**
     * Hides a group.
     *
     * @param {HTMLElement} row
     * @param {String} group
     */
    hideGroup: function (row, group) {

        var element = this.getGroup(row, group);

        if (!element) {
            return;
        }

        element.style.display = "none";
        element.classList.remove("cf-active");

    },

    isGroupVisible: function (input) {

        var group;

        if (!input) {
            return true;
        }

        group = input.closest(".cf-group");

        if (!group) {
            return true;
        }

        return group.classList.contains("cf-active");

    },

    /**
     * Resets all fields inside a group.
     *
     * @param {HTMLElement} group
     */
    resetGroup: function (group) {

        var fields;
        var field;
        var i;

        if (!group) {
            return;
        }

        fields = group.querySelectorAll("input, select, textarea");

        for (i = 0; i < fields.length; i++) {

            field = fields[i];

            if (field.tagName === "SELECT") {

                field.selectedIndex = 0;

            } else if (
                field.type === "checkbox" ||
                field.type === "radio"
            ) {

                field.checked = false;

            } else {

                field.value = "";

            }

            field.dispatchEvent(
                new Event("input", {
                    bubbles: true
                })
            );

        }

    },

    getInputs: function (fieldName, container) {

        container = container || document;

        return container.querySelectorAll(
            'input[name="' + fieldName + '[]"],' +
            'input[name="' + fieldName + '[][]"],' +
            'input[name="' + fieldName + '"],' +
            'select[name="' + fieldName + '[]"],' +
            'select[name="' + fieldName + '"],' +
            'textarea[name="' + fieldName + '[]"],' +
            'textarea[name="' + fieldName + '"]'
        );

    },

    getInput: function (fieldName, container) {

        var inputs = this.getInputs(fieldName, container);

        return inputs.length ? inputs[0] : null;

    }

};/*
 * Rule engine
 */

EBSRepeater.rules = {

    /**
     * Rules configuration.
     */
    config: {},

    /**
     * Registers rules.
     *
     * @param {Object} rules
     */
    set: function (rules) {

        this.config = rules || {};

    },

    /**
     * Applies rules to a repeater row.
     *
     * @param {HTMLElement} row
     */
    apply: function (row) {

        var category;
        var rule;
        var groups;
        var i;

        if (!row) {
            return;
        }

        category = EBSRepeater.dom.getValue(row, "categorie");

        rule = this.config[category];

        if (!rule) {

            this.hideAll(row, []);

            return;

        }

        groups = [];

        if (!EBSRepeater.utils.isArray(rule)) {

            rule = [rule];

        }

        for (i = 0; i < rule.length; i++) {

            groups = groups.concat(
                this.getGroups(row, rule[i])
            );

        }

        groups = EBSRepeater.utils.unique(groups);

        this.hideAll(row, groups);

        this.showGroups(row, groups);

    },

    /**
     * Builds the list of groups to display.
     *
     * @param {HTMLElement} row
     * @param {Object} rule
     * @returns {Array}
     */
    getGroups: function (row, rule) {

        var groups = [];
        var children;
        var child;
        var value;
        var i;
        var j;

        if (rule.show) {

            for (i = 0; i < rule.show.length; i++) {
                groups.push(rule.show[i]);
            }

        }

        children = rule.dependencies || rule.children || [];

        for (i = 0; i < children.length; i++) {

            child = children[i];

            value = EBSRepeater.dom.getValue(row, child.field);

            if (this.match(value, child.operator || "notEmpty", child.value)) {

                if (child.show) {

                    for (j = 0; j < child.show.length; j++) {

                        groups.push(child.show[j]);

                    }

                }

            }

        }

        return groups;

    },

    /**
     * Evaluates an operator.
     *
     * @param {*} value
     * @param {String} operator
     * @param {*} expected
     * @returns {Boolean}
     */
    match: function (value, operator, expected) {

        var number;
        var expectedNumber;
        var i;

        switch (operator) {

            case "notEmpty":
                return value !== "";

            case "empty":
                return value === "";

            case "equals":
                return value === expected;

            case "notEquals":
                return value !== expected;

            case "contains":
                return String(value).indexOf(expected) !== -1;

            case "startsWith":
                return String(value).indexOf(expected) === 0;

            case "endsWith":
                value = String(value);
                expected = String(expected);

                return value.substring(
                    value.length - expected.length
                ) === expected;

            case "in":

                if (!EBSRepeater.utils.isArray(expected)) {
                    return false;
                }

                for (i = 0; i < expected.length; i++) {

                    if (value === expected[i]) {
                        return true;
                    }

                }

                return false;

            case "greaterThan":

                number = parseFloat(value);
                expectedNumber = parseFloat(expected);

                return number > expectedNumber;

            case "greaterOrEqual":

                number = parseFloat(value);
                expectedNumber = parseFloat(expected);

                return number >= expectedNumber;

            case "lessThan":

                number = parseFloat(value);
                expectedNumber = parseFloat(expected);

                return number < expectedNumber;

            case "lessOrEqual":

                number = parseFloat(value);
                expectedNumber = parseFloat(expected);

                return number <= expectedNumber;

            default:
                return false;

        }

    },

    /**
     * Shows groups.
     *
     * @param {HTMLElement} row
     * @param {Array} groups
     */
    showGroups: function (row, groups) {

        var i;

        for (i = 0; i < groups.length; i++) {

            EBSRepeater.dom.showGroup(row, groups[i]);

        }

    },

    /**
     * Hides all groups except those in keep.
     *
     * @param {HTMLElement} row
     * @param {Array} keep
     */
    hideAll: function (row, keep) {

        var groups;
        var group;
        var name;
        var i;

        groups = row.querySelectorAll(".cf-group");

        for (i = 0; i < groups.length; i++) {

            group = groups[i];

            name = group.getAttribute("data-group");

            if (keep.indexOf(name) === -1) {

                EBSRepeater.dom.resetGroup(group);

                EBSRepeater.dom.hideGroup(row, name);

            }

        }

    }

};/*
 * Summary module
 */

EBSRepeater.summary = {

    /**
     * Summary fields configuration.
     *
     * Example:
     * [
     *     { name: "nombre", type: "text" },
     *     { name: "categorie", type: "text" },
     *     { name: "fco", type: "checkbox" }
     * ]
     */
    fields: [],

    /**
     * Sets summary configuration.
     *
     * @param {Array} fields
     */
    setFields: function (fields) {

        this.fields = fields || [];

    },

    /**
     * Builds one repeater row summary.
     *
     * @param {HTMLElement} row
     * @returns {String}
     */
    buildRow: function (row) {

        var values = [];
        var field;
        var value;
        var i;

        for (i = 0; i < this.fields.length; i++) {

            field = this.fields[i];

            value = this.getValue(row, field);

            values.push(value);

        }

        return values.join(EBSRepeater.config.summarySeparator);

    },

    /**
     * Updates repeater row titles.
     */
    updateTitles: function () {

        var rows;
        var row;
        var title;
        var i;

        rows = document.querySelectorAll(".repeater-field-item");

        for (i = 0; i < rows.length; i++) {

            row = rows[i];

            title = row.querySelector(".repeater-field-header-title-text");

            if (!title) {
                continue;
            }

            title.innerHTML =
                "Ligne " +
                (i + 1) +
                " : " +
                this.buildRow(row);

        }

    },

    getValue: function (row, field) {

        var value;
        var i;

        if (field.name) {

            if (field.type === "checkbox") {

                return EBSRepeater.dom.getCheckedValues(row, field.name);

            }

            return EBSRepeater.dom.getValue(row, field.name);

        }

        if (field.fields) {

            for (i = 0; i < field.fields.length; i++) {

                value = EBSRepeater.dom.getValue(row, field.fields[i]);

                if (value !== "") {
                    return value;
                }

            }

        }

        return "";

    },

    /**
     * Updates visual summary.
     *
     * @param {Array} lines
     */
    updateContainer: function (lines) {

        var container;

        container = document.querySelector(
            EBSRepeater.config.summaryContainer
        );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        var i;
        var li;

        for (i = 0; i < lines.length; i++) {

            li = document.createElement("li");
            li.innerHTML = lines[i];
            container.appendChild(li);

        }

    },

    /**
     * Updates hidden summary field.
     *
     * @param {Array} lines
     */
    updateField: function (lines) {

        var field;

        field = document.querySelector(
            '[name="' +
            EBSRepeater.config.summaryField +
            '"]'
        );

        if (!field) {
            return;
        }

        field.value = lines.join("\n");

    },

    /**
     * Updates every summary.
     */
    update: function () {

        var rows;
        var lines;
        var line;
        var i;

        rows = document.querySelectorAll(".repeater-field-item");

        lines = [];

        for (i = 0; i < rows.length; i++) {

            line = this.buildRow(rows[i]);

            lines.push(
                "Ligne " +
                (i + 1) +
                " : " +
                line
            );

        }

        this.updateTitles();

        this.updateContainer(lines);

        this.updateField(lines);

    }

};/*
 * Event manager
 */

EBSRepeater.events = {

    /**
     * Binds all events.
     */
    bind: function () {

        this.bindChange();
        this.bindAdd();
        this.bindRemove();

        document.addEventListener("submit", function (event) {
            var form = event.target;
            if (!form.classList.contains("wpcf7-form")) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            if (!EBSRepeater.validation.validate(form)) {
                return;
            }
            EBSRepeater.transport.send(form);
        }, true);
    },

    /**
     * Field change.
     */
    bindChange: function () {

        document.addEventListener("change", function (event) {

            var row;

            if (!event.target.matches("input, select, textarea")) {
                return;
            }

            row = EBSRepeater.dom.getRow(event.target);

            if (!row) {
                return;
            }

            // Validation des groupes de checkboxes
            if (event.target.type === "checkbox") {
                EBSRepeater.validation.normalizeCheckboxGroup(event.target);
            }

            if (event.target.name.indexOf("categorie") !== -1) {

                EBSRepeater.rules.apply(row);

            }

            EBSRepeater.summary.update();

        });

    },

    /**
     * Add repeater row.
     */
    bindAdd: function () {

        document.addEventListener("click", function (event) {

            var button;
            var repeater;
            var rows;
            var row;
            var previousRow;
            var toggle;

            button = event.target.closest(".repeater-field-button-add");

            if (!button) {
                return;
            }

            repeater = button.closest(".cf7-repeater");

            if (!repeater) {
                return;
            }

            rows = repeater.querySelectorAll(".repeater-field-item");

            if (rows.length) {

                row = rows[rows.length - 1];

                if (!EBSRepeater.validation.validateRow(row)) {

                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();

                    return false;

                }

            }

            setTimeout(function () {

                rows = repeater.querySelectorAll(".repeater-field-item");

                if (rows.length < 2) {
                    EBSRepeater.summary.update();
                    return;
                }

                previousRow = rows[rows.length - 2];

                toggle = previousRow.querySelector(
                    ".repeater-field-header-acctions-toogle"
                );

                if (toggle) {
                    toggle.click();
                }

                EBSRepeater.summary.update();

            }, 300);

        }, true);

    },

    /**
     * Remove repeater row.
     */
    bindRemove: function () {

        document.addEventListener("click", function (event) {

            if (
                !event.target.classList.contains(
                    "repeater-field-header-acctions-remove"
                )
            ) {
                return;
            }

            setTimeout(function () {

                EBSRepeater.summary.update();

            }, 100);

        });

    }

};/*
 * DOM observer
 */

EBSRepeater.observer = {

    instance: null,

    /**
     * Starts observing repeater changes.
     */
    start: function () {

        var repeater;

        repeater = document.querySelector(".cf7-repeater");

        if (!repeater) {
            return;
        }

        if (typeof MutationObserver === "undefined") {
            return;
        }

        this.instance = new MutationObserver(function (mutations) {

            var i;
            var mutation;

            for (i = 0; i < mutations.length; i++) {

                mutation = mutations[i];

                if (
                    mutation.type === "childList" &&
                    (
                        mutation.addedNodes.length ||
                        mutation.removedNodes.length
                    )
                ) {

                    EBSRepeater.refresh();
                    return;

                }

            }

        });

        this.instance.observe(repeater, {

            childList: true,
            subtree: true

        });

    },

    /**
     * Stops observing.
     */
    stop: function () {

        if (this.instance) {

            this.instance.disconnect();
            this.instance = null;

        }

    }

};/*
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

};EBSRepeater.validation = {

    rules: [],

    set: function (rules) {

        this.rules = rules || [];

    },

    /* validate: function (container) {

        var rows;
        var i;
        var j;

        container = container || document;

        if (container.classList.contains("repeater-field-item")) {
            rows = [container];
        } else {
            rows = container.querySelectorAll(".repeater-field-item");
        }

        for (i = 0; i < rows.length; i++) {

            for (j = 0; j < this.rules.length; j++) {

                if (!this.validateRule(this.rules[j], rows[i])) {
                    return false;
                }

            }

        }

        return true;

    }, */
    
    validate: function (container) {
        var rows;
        var i;

        rows = container.querySelectorAll(".repeater-field-item");

        for (i = 0; i < rows.length; i++) {

            if (!this.validateRow(rows[i])) {
                return false;
            }
        }

        return true;
    },

    validateRow: function (row) {
        var requiredFields;
        var field;
        var i;
        var j;

        if (!row) {
            return true;
        }

        /*
        * Champs CF7 obligatoires : select*, number*, etc.
        */
        requiredFields = row.querySelectorAll(
            "input[aria-required='true'], " +
            "select[aria-required='true'], " +
            "textarea[aria-required='true']"
        );

        for (i = 0; i < requiredFields.length; i++) {

            field = requiredFields[i];

            if (field.type === "checkbox" || field.type === "radio") {

                if (!row.querySelector(
                    '[name="' + field.name + '"]:checked'
                )) {
                    alert("Le champ « " + field.name + " » est obligatoire.");
                    field.focus();
                    return false;
                }

            } else if (field.value === "") {

                alert("Le champ « " + field.name + " » est obligatoire.");
                field.focus();
                return false;
            }
        }

        /*
        * Règles personnalisées :
        * catégories, sous-catégories, FCO, MHE...
        */
        for (j = 0; j < this.rules.length; j++) {

            if (!this.validateRule(this.rules[j], row)) {
                return false;
            }
        }

        return true;
    },

    normalizeCheckboxGroup: function (checkbox) {

        var row;
        var rule;
        var allCheckboxes;
        var checkboxes;
        var exclusive;
        var isExclusive;
        var i;

        row = EBSRepeater.dom.getRow(checkbox);

        if (!row) {
            return;
        }

        rule = EBSRepeater.validation.isExclusiveGroup(checkbox.name);

        if (!rule || !rule.exclusive) {
            return;
        }

        allCheckboxes = row.querySelectorAll('input[type="checkbox"]');
        checkboxes = [];

        for (i = 0; i < allCheckboxes.length; i++) {

            if (allCheckboxes[i].name === checkbox.name) {
                checkboxes.push(allCheckboxes[i]);
            }

        }

        if (!checkbox.checked) {
            return;
        }

        exclusive = EBSRepeater.utils.isArray(rule.exclusive)
            ? rule.exclusive
            : [rule.exclusive];

        isExclusive = exclusive.indexOf(checkbox.value) !== -1;

        if (isExclusive) {

            // Une valeur exclusive est cochée :
            // on décoche toutes les autres.

            for (i = 0; i < checkboxes.length; i++) {

                if (checkboxes[i] !== checkbox) {
                    checkboxes[i].checked = false;
                }

            }

        } else {

            // Une valeur normale est cochée :
            // on décoche toutes les valeurs exclusives.

            for (i = 0; i < checkboxes.length; i++) {

                if (
                    exclusive.indexOf(checkboxes[i].value) !== -1
                ) {
                    checkboxes[i].checked = false;
                }

            }

        }

    },

   validateRule: function (rule, row) {

        var group;
        var inputs;
        var checked;
        var i;

        if (rule.group) {

            group = EBSRepeater.dom.getGroup(row, rule.group);

            if (!group) {
                return true;
            }

            if (group.style.display === "none") {
                return true;
            }

        }

        inputs = EBSRepeater.dom.getInputs(rule.field, row);

        if (!inputs.length) {
            return true;
        }

        checked = [];

        for (i = 0; i < inputs.length; i++) {

            if (inputs[i].type === "checkbox") {

                if (inputs[i].checked) {
                    checked.push(inputs[i].value);
                }

            } else {

                if (inputs[i].value !== "") {
                    checked.push(inputs[i].value);
                }

            }

        }

        if (rule.requiredWhenVisible && checked.length === 0) {

            alert(rule.errorMessageRequiredWhenVisible || "Veuillez sélectionner une valeur.");

            return false;

        }

        if (rule.exclusive) {

            var exclusive = EBSRepeater.utils.isArray(rule.exclusive)
                ? rule.exclusive
                : [rule.exclusive];

            var exclusiveCount = 0;

            for (i = 0; i < exclusive.length; i++) {

                if (checked.indexOf(exclusive[i]) !== -1) {
                    exclusiveCount++;
                }

            }

            if (
                (exclusiveCount > 0 && checked.length > 1) ||
                exclusiveCount > 1
            ) {

                alert(
                    "Les valeurs exclusives ne peuvent pas être sélectionnées avec une autre valeur."
                );

                return false;

            }

        }

        return true;

    },
    isExclusiveGroup: function (name) {

        var i;

        for (i = 0; i < this.rules.length; i++) {

            if (name.indexOf(this.rules[i].field) !== -1) {
                return this.rules[i];
            }

        }

        return null;

    },
};EBSRepeater.config = {

    debug: false,

    summaryField: "summary",

    summaryContainer: "#cf7-summary",

    summarySeparator: "|"

};/*
 * EBS configuration
 */
var EBSConfig = {
    config: {
        debug: false,
        summaryField: "summary",
        summaryContainer: "#cf7-summary",
        summarySeparator: ";"
    },
    summary: [
        { name: "nombre" },
        { name: "categorie" },
        {
            fields: [
                "categorieBaby",
                "categorieBroutards",
                "categorieVeauxGras",
                "categoriePetitsVeaux",
                "categorieVachesGenisses"
            ]
        },
        {
            fields: [
                "sousCategorieBaby",
                "sousCategorieBroutards",
                "sousCategorieVeauxGras",
                "sousCategoriePetitsVeaux"
            ]
        },
        { name: "race" },
        { name: "fcovac", type: "checkbox" },
        { name: "fcopcr", type: "checkbox" },
        { name: "mhe", type: "checkbox" },
        { name: "commentaire" }
    ],
    submit: {
        fields: [
            "your-email",
            "user_id",
            "numCheptel",
            "dateMarche",
            "summary",
            "commentaire"
        ]
    },
    validation: [
        {
            field: "fcovac",
            group: "FCOvac",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Vaccination FCO : selection obligatoire",
            exclusive: "Non vacciné"
        },
        {
            field: "fcopcr",
            group: "FCOpcr",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Teste (PCR) FCO : selection obligatoire",
            exclusive: "Non testé"
        },
        {
            field: "mhe",
            group: "MHE",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Vaccination MHE : selection obligatoire",
            exclusive: ["+ 60 jours", "- 60 jours", "PCR", "Rien"]
        },
        {
            field: "categorieBaby",
            group: "Baby1",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection du sex obligatoire",
        },
        {
            field: "sousCategorieBaby",
            group: "Baby2",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection de la tranche d'age obligatoire",
        },
        {
            field: "categorieBroutards",
            group: "Broutards1",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection du sex obligatoire",
        },
        {
            field: "sousCategorieBroutards",
            group: "Broutards2",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection de la tranche de poids obligatoire",
        },
        {
            field: "categorieVeauxGras",
            group: "VeauxGras1",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection du sex obligatoire",
        },
        {
            field: "sousCategorieVeauxGras",
            group: "VeauxGras2",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection de la tranche d' age obligatoire",
        },
        {
            field: "categoriePetitsVeaux",
            group: "PetitsVeaux1",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection du sex obligatoire",
        },
        {
            field: "sousCategoriePetitsVeaux",
            group: "PetitsVeaux2",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection type de petit veaux obligatoire",
        },
        {
            field: "categorieVachesGenisses",
            group: "VachesGenisses1",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection type de génisse obligatoire",
        },
    ],
    rules: {
        "Baby": {
            show: ["Baby1"],
            dependencies: [
                {
                    field: "categorieBaby",
                    show: ["Baby2"]
                }
            ]
        },
        "Broutards": {
            show: ["Broutards1", "FCOvac" , "FCOpcr", "MHE"],
            dependencies: [
                {
                    field: "categorieBroutards",
                    show: ["Broutards2"]
                }
            ]
        },
        "Veaux gras jeunes bovins": {
            show: ["VeauxGras1"],
            dependencies: [
                {
                    field: "categorieVeauxGras",
                    show: ["VeauxGras2"]
                }
            ]
        },
        "Petits veaux": {
            show: ["PetitsVeaux1"],
            dependencies: [
                {
                    field: "categoriePetitsVeaux",
                    show: ["PetitsVeaux2"]
                }
            ]
        },
        "Vaches et génisses +24M": {
            show: ["VachesGenisses1"]
        },
        "Taureaux": {
            show: ["FCOvac" , "FCOpcr", "MHE"]
        },
        "Vache suitée": {
            show: []
        }
    }
};EBSRepeater.submit = {

    fields: [],

    set: function (fields) {
        this.fields = fields || [];
    },

    prepare: function (event) {

        var allowed = this.fields;

        event.detail.inputs = event.detail.inputs.filter(function (input) {

            if (input.name.indexOf("_wpcf7") === 0) {
                return true;
            }

            return allowed.indexOf(input.name) !== -1;

        });

    }

};EBSRepeater.transport = {

    send: function (form) {

        var data;
        var action;
        var field;
        var value;
        var i;

        console.log("EBS transport");

        data = new FormData();

        // Champs techniques CF7
        [
            "_wpcf7",
            "_wpcf7_version",
            "_wpcf7_locale",
            "_wpcf7_unit_tag",
            "_wpcf7_container_post",
            "_wpcf7_posted_data_hash"
        ].forEach(function (name) {

            field = form.querySelector('[name="' + name + '"]');

            if (field) {
                data.append(name, field.value);
            }

        });

        // Champs métier
        EBSRepeater.submit.fields.forEach(function (name) {

            field = form.querySelector('[name="' + name + '"]');

            if (!field) {
                return;
            }

            value = field.value;

            if (field.type === "checkbox") {
                value = field.checked ? field.value : "";
            }
            data.append(name, value);
        });

        fetch(window.location.origin + "/segali/wp-admin/admin-ajax.php?action=ebs_cf7_submit", {
            method: "POST",
            body: data,
            credentials: "same-origin"
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            if (json.success) {
                alert(json.data.message);
                window.location.reload();
                return;
            }
            alert(json.data.message || "Une erreur est survenue.");
        })
        .catch(function () {
            alert("Impossible de contacter le serveur.");
        });
    }
};/*
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
        EBSRepeater.submit.set(config.submit.fields);
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