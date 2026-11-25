EBSRepeater.validation = {

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
};