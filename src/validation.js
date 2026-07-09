EBSRepeater.validation = {

    rules: [],

    set: function (rules) {

        this.rules = rules || [];

    },

    validate: function () {

        var i;

        for (i = 0; i < this.rules.length; i++) {

            if (!this.validateRule(this.rules[i])) {
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

    normalizeCheckboxGroup: function (checkbox) {

        var row;
        var rule;
        var allCheckboxes;
        var checkboxes;
        var i;

        row = EBSRepeater.dom.getRow(checkbox);

        if (!row) {
            return;
        }

        rule = this.isExclusiveGroup(checkbox.name);

        if (!rule) {
            return;
        }

        allCheckboxes = row.querySelectorAll('input[type="checkbox"]');
        checkboxes = [];

        for (i = 0; i < allCheckboxes.length; i++) {

            if (allCheckboxes[i].name === checkbox.name) {
                checkboxes.push(allCheckboxes[i]);
            }

        }

        if (checkbox.value === rule.exclusive && checkbox.checked) {

            for (i = 0; i < checkboxes.length; i++) {

                if (checkboxes[i] !== checkbox) {
                    checkboxes[i].checked = false;
                }

            }

        } else if (checkbox.checked) {

            for (i = 0; i < checkboxes.length; i++) {

                if (checkboxes[i].value === rule.exclusive) {
                    checkboxes[i].checked = false;
                }

            }

        }

    },

    validateRule: function (rule) {

        var group;
        var inputs;
        var checked = [];
        var i;

        group = document.querySelector('[data-group="FCO"]');

        if (!group) {
            return true;
        }

        if (group.offsetParent === null) {
            return true;
        }

        inputs = group.querySelectorAll('input[type="checkbox"]');

        for (i = 0; i < inputs.length; i++) {

            if (inputs[i].checked) {
                checked.push(inputs[i].value);
            }

        }

        if (rule.requiredWhenVisible && checked.length === 0) {

            alert("Veuillez sélectionner une valeur FCO.");

            return false;

        }

        if (rule.exclusive) {

            if (
                checked.indexOf(rule.exclusive) !== -1 &&
                checked.length > 1
            ) {

                alert("\"Rien\" ne peut pas être sélectionné avec une autre valeur.");

                return false;

            }

        }

        return true;

    }

};