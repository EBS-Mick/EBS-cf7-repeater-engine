/*
 * EBS configuration
 */

var EBSConfig = {

    config: {

        debug: false,

        summaryField: "summary",

        summaryContainer: "#cf7-summary",

        summarySeparator: ";"

    },

    summary: [

        { name: "nombre" },

        { name: "categorie" },

        {
            fields: [
                "categorieBaby",
                "categorieBroutards",
                "categorieVeauxGras",
                "categoriePetitsVeaux",
                "categorieVachesGenisses"
            ]
        },

        {
            fields: [
                "sousCategorieBaby",
                "sousCategorieBroutards",
                "sousCategorieVeauxGras"
            ]
        },

        { name: "race" },

        { name: "fco", type: "checkbox" },

        { name: "mhe", type: "checkbox" }

    ],
    submit: [

        "your-email",
        "numCheptel",
        "dateMarche",
        "summary",
        "commentaire"

    ],
    validation: [

        {
            field: "fco",
            requiredWhenVisible: true,
            exclusive: "Rien"
        },

        {
            field: "mhe",
            requiredWhenVisible: true,
            exclusive: "Rien"
        }

    ],
    rules: {

        "Baby": {

            show: ["Baby1"],

            dependencies: [

                {
                    field: "categorieBaby",
                    show: ["Baby2"]
                }

            ]

        },

        "Broutards": {

            show: ["Broutards1", "FCO" , "MHE"],

            dependencies: [

                {
                    field: "categorieBroutards",
                    show: ["Broutards2"]
                }

            ]

        },

        "Veaux gras jeunes bovins": {

            show: ["VeauxGras1", "FCO", "MHE"],

            dependencies: [

                {
                    field: "categorieVeauxGras",
                    show: ["VeauxGras2"]
                }

            ]

        },

        "Petits veaux": {

            show: ["PetitsVeaux1"]

        },

        "Vaches et génisses +24M": {

            show: ["VachesGenisses1"]

        },

        "Taureaux": {

            show: ["FCO", "MHE"]

        },

        "Vache suitée": {

            show: []

        }

    }

};