EBSRepeater.submit = {

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

};