let providers = [
    {
        firstName: "Brandon",
        lastName: "Cadaoas",
        proficiencies: {
            Cooking: 4.7,
            Delivery: 4.8,
            Shopping: 2.0
        },
        address: "9201 YONGE ST, Richmond Hill, Ontario, L4C 6Z2",
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
        address: "56 LAKE AVE, Richmond Hill, Ontario, L4E 3G3",
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
        address: "4541 E Green Rock Rd, Regina, Saskatchewan S4V 3K8, Canada",
        image: 'assets/images/GulnurBaimukhambetova.jpg',
        healthDoc: 'assets/healthdocs/GulnurBaimukhambetova_healthcert.pdf',
        desc: "Hi I'm Gulnur. Things are done by me."
    }
];

exports.providers = providers;

function chooseCategory(){
    var catInput = document.getElementById("i_category").value;
    var cards = document.querySelectorAll(".provider-card");
    cards.forEach(card =>{
        if ((card.dataset.categories.toLowerCase()).includes(catInput.toLowerCase())){
            console.log(card.dataset.categories.toLowerCase());
            console.log(catInput);
            card.style.display = 'block';
        }
        else{
            console.log(card.dataset.categories.toLowerCase());
            console.log(catInput);
            card.style.display = 'none';
        }
    });
}