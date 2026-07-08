EBSRepeater.init({

    config: {

        debug: false,

        summaryField: "summary",

        summaryContainer: "#cf7-summary",

        summarySeparator: "|"

    },

    summary: [

        { name: "nombre" },
        { name: "categorie" },
        { name: "categorieBaby" },
        { name: "sousCategorieBaby" },
        { name: "categorieBroutards" },
        { name: "sousCategorieBroutards" },
        { name: "categorieVeauxGras" },
        { name: "sousCategorieVeauxGras" },
        { name: "categoriePetitsVeaux" },
        { name: "categorieVachesGenisses" },
        { name: "race" },
        { name: "fco", type: "checkbox" }

    ],

    rules: {

        "Baby": {

            show: ["Baby1"],

            children: [

                {
                    field: "categorieBaby",
                    operator: "notEmpty",
                    show: ["Baby2"]
                }

            ]

        },

        "Broutards": {

            show: ["Broutards1", "FCO"],

            children: [

                {
                    field: "categorieBroutards",
                    operator: "notEmpty",
                    show: ["Broutards2"]
                }

            ]

        },

        "Veaux gras jeunes bovins": {

            show: ["VeauxGras1", "FCO"],

            children: [

                {
                    field: "categorieVeauxGras",
                    operator: "notEmpty",
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

            show: ["FCO"]

        },

        "Vache suitée": {

            show: []

        }

    }

});