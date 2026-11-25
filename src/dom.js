/*
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

};