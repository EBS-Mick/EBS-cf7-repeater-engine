/*
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
            var previousRow;
            var toggle;

            button = event.target.closest(".repeater-field-button-add");

            if (!button) {
                return;
            }

            setTimeout(function () {

                repeater = button.closest(".cf7-repeater");

                if (!repeater) {
                    return;
                }

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

        });

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

};