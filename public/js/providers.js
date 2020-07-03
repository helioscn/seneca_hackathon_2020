let providers = [
    {
        firstName: "Brandon",
        lastName: "Cadaoas",
        proficiencies: {
            Cooking: 4.7,
            Delivery: 4.8,
            Shopping: 2.0
        },
        image: 'assets/images/BrandonCadaoas.jpg',
        healthDoc: '',
        desc: "Hi I'm Brandon. I do things."
    },
    {
        firstName: "Helios",
        lastName: "Chan",
        proficiencies: {
            Cooking: 4.9,
            "Pet-Sitting": 4.8,
            Moving: 2.7
        },
        image: 'assets/images/HeliosChan.jpg',
        healthDoc: '',
        desc: "Hi I'm Helios. I like to get things done."
    },
    {
        firstName: "Gulnur",
        lastName: "Baimukhambetova",
        proficiencies: {
            Plumbing: 5.0,
            "Yard Work": 4.5,
            Errands: 3.2
        },
        image: 'assets/images/GulnurBaimukhambetova.jpg',
        healthDoc: 'assets/healthdocs/GulnurBaimukhambetova_healthcert.pdf',
        desc: "Hi I'm Gulnur. Things are done by me."
    }
];

exports.providers = providers;

function chooseCategory(){
    console.log("Hello");
    var dropDownItems = document.getElementById("c_catDropdown").querySelectorAll(".item_catDropdown");
    dropDownItems.forEach(item => {
        item.addEventListener("click", () => {
            console.log(item.innerHTML);
        });
    });

    // var cards = document.getElementsByClassName("provider-card");
    // cards.forEach(card => (console.log(card.dataset.categories)));
    // if (inputVal){
    //     var cards = document.getElementsByClassName("provider-card");
    //     cards.forEach(card => {
    //         if (!(inputVal in card.dataset.categories)){
    //             card.style.display = 'none';
    //         }
    //     });
    // }
}