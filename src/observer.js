/*
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

};