/*
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

};