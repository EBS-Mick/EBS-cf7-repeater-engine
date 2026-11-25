EBSRepeater.transport = {

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
};