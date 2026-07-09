EBSRepeater.submit = {

    fields: [],

    set: function (fields) {

        this.fields = fields || [];

    },


    prepare: function (form) {

        var allowed;
        var elements;
        var i;

        allowed = this.fields;

        elements = form.querySelectorAll("input, select, textarea");

        for (i = 0; i < elements.length; i++) {

            if (allowed.indexOf(elements[i].name) !== -1) {
                continue;
            }

            if (elements[i].name.indexOf("_wpcf7") === 0) {
                continue;
            }

            elements[i].disabled = true;

        }

    }

};