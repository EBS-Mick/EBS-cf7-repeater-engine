/*
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

        if (!row) {
            return;
        }

        category = EBSRepeater.dom.getValue(row, "categorie");

        rule = this.config[category];

        if (!rule) {

            this.hideAll(row, []);

            return;

        }

        groups = this.getGroups(row, rule);

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

};