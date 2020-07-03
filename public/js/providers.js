let providers = [
    {
        firstName: "Brandon",
        lastName: "Cadaoas",
        proficiencies: {
            Cooking: 4.7,
            Delivery: 4.8,
            Shopping: 3.0
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
    },
    {
        firstName: "Andrew",
        lastName: "Smith",
        proficiencies: {
            Cleaning: 5.0,
            "Pet-Sitting": 4.8,
            Shopping: 3.7
        },
        address: "5862 Little Fort Trail, 100 Mile House, BC V0K 2E2, Canada",
        image: 'assets/images/AndrewSmith.jpeg',
        healthDoc: '',
        desc: "Hi I'm Andrew. Nothing gets done without me."
    },
    {
        firstName: "Smith",
        lastName: "Andrews",
        proficiencies: {
            Errands: 4.9,
            Delivery: 4.9,
            Moving: 4.0
        },
        address: "6 Bala Pl, St Catharines, Ontario L2N 5Z8, Canada",
        image: 'assets/images/SmithAndrews.jpg',
        healthDoc: 'assets/healthdocs/SmithAndrews_healthcert.pdf',
        desc: "Hi I'm Smith. Doing things is my profession."
    },
    {
        firstName: "Gabriella",
        lastName: "Dubois",
        proficiencies: {
            Moving: 5.0,
            "Yard Work": 5.0,
            Cooking: 4.5
        },
        address: "6 Bala Pl, St Catharines, Ontario L2N 5Z8, Canada",
        image: 'assets/images/GabriellaDubois.jpeg',
        healthDoc: '',
        desc: "Hi I'm Gabby. I am passionate about doing things."
    }
];

exports.providers = providers;

function chooseCategory(){
    var catInput = document.getElementById("i_category").value;
    var cards = document.querySelectorAll(".provider-card");
    cards.forEach(card =>{
        if (catInput){
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
        }
        else{
            card.style.display = 'block';
        }
    });
}

function searchLocation(){
    var locInput = document.getElementById("i_location")
    const dropdown = document.getElementById("c_locDropdown");

    useLocation = () => {
        getLocation(locInput.value).then(locations => {
            dropdown.innerHTML = "";
            locations.forEach(l => {
                const container = ce("div");
                    const icon = ce("img");
                    const address = ce("span");
                        
                    container.className = "item_locDropdown";
                    icon.src = "assets/images/location.png";
                    address.innerHTML = l;
        
                    container.appendAll(icon, address);
        
                    container.addEventListener("click", () => {
                        locInput.value = l;
                        dropdown.innerHTML = "";

                        providers.forEach(p => {
                            fetchDistance(l, p.address).then(data => {
                                let dist = parseInt(data.distance.toFixed(1), 10);
                                var cards = document.querySelectorAll(".provider-card");
                                cards.forEach(card => {
                                    if ((card.dataset.categories.toLowerCase()).includes(p.firstName.toLowerCase()) && (card.dataset.categories.toLowerCase()).includes(p.lastName.toLowerCase())){
                                        card.getElementsByClassName("card-dist-info")[0].getElementsByClassName("calcDist")[0].innerHTML = dist;
                                    }
                                    // let radius = parseInt(document.getElementById("postingsDistSlider").value, 10);
                                    // if (dist <= radius){
                                    //     card.style.display = 'block';
                                    // }
                                    // else{
                                    //     card.style.display = 'none';
                                    // }
                                });
                            });
                        });
                    });
        
                    dropdown.appendChild(container);
            });
        });
    }
    locInput.addEventListener("focus", () => {
        if (locInput.value != "") useLocation();
    });

    document.addEventListener("click", (e) => {
        if (e.target.id != "i_location") dropdown.innerHTML = "";
    });
    
    locInput.addEventListener("input", () => {
        if (locInput.value != "") {
            useLocation();
        } else {
            dropdown.innerHTML = "";
        }
    });


}