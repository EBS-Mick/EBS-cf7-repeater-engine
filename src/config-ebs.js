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
                "sousCategorieVeauxGras",
                "sousCategoriePetitsVeaux"
            ]
        },
        { name: "race" },
        { name: "fcovac", type: "checkbox" },
        { name: "fcopcr", type: "checkbox" },
        { name: "mhe", type: "checkbox" },
        { name: "commentaire" }
    ],
    submit: {
        fields: [
            "your-email",
            "user_id",
            "numCheptel",
            "dateMarche",
            "summary",
            "commentaire"
        ]
    },
    validation: [
        {
            field: "fcovac",
            group: "FCOvac",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Vaccination FCO : selection obligatoire",
            exclusive: "Non vacciné"
        },
        {
            field: "fcopcr",
            group: "FCOpcr",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Teste (PCR) FCO : selection obligatoire",
            exclusive: "Non testé"
        },
        {
            field: "mhe",
            group: "MHE",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Vaccination MHE : selection obligatoire",
            exclusive: ["+ 60 jours", "- 60 jours", "PCR", "Rien"]
        },
        {
            field: "categorieBaby",
            group: "Baby1",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection du sex obligatoire",
        },
        {
            field: "sousCategorieBaby",
            group: "Baby2",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection de la tranche d'age obligatoire",
        },
        {
            field: "categorieBroutards",
            group: "Broutards1",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection du sex obligatoire",
        },
        {
            field: "sousCategorieBroutards",
            group: "Broutards2",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection de la tranche de poids obligatoire",
        },
        {
            field: "categorieVeauxGras",
            group: "VeauxGras1",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection du sex obligatoire",
        },
        {
            field: "sousCategorieVeauxGras",
            group: "VeauxGras2",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection de la tranche d' age obligatoire",
        },
        {
            field: "categoriePetitsVeaux",
            group: "PetitsVeaux1",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection du sex obligatoire",
        },
        {
            field: "sousCategoriePetitsVeaux",
            group: "PetitsVeaux2",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection type de petit veaux obligatoire",
        },
        {
            field: "categorieVachesGenisses",
            group: "VachesGenisses1",
            requiredWhenVisible: true,
            errorMessageRequiredWhenVisible:"Catégorie : selection type de génisse obligatoire",
        },
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
            show: ["Broutards1", "FCOvac" , "FCOpcr", "MHE"],
            dependencies: [
                {
                    field: "categorieBroutards",
                    show: ["Broutards2"]
                }
            ]
        },
        "Veaux gras jeunes bovins": {
            show: ["VeauxGras1"],
            dependencies: [
                {
                    field: "categorieVeauxGras",
                    show: ["VeauxGras2"]
                }
            ]
        },
        "Petits veaux": {
            show: ["PetitsVeaux1"],
            dependencies: [
                {
                    field: "categoriePetitsVeaux",
                    show: ["PetitsVeaux2"]
                }
            ]
        },
        "Vaches et génisses +24M": {
            show: ["VachesGenisses1"]
        },
        "Taureaux": {
            show: ["FCOvac" , "FCOpcr", "MHE"]
        },
        "Vache suitée": {
            show: []
        }
    }
};