window.addEventListener("load", () => {
    setupDistSlider();
    setupCategorySearch();
    setupPosts();
    setupLocationSearch();
});

setupDistSlider = () => {
    const distSlider = document.getElementById("postingsDistSlider");
    const output = document.getElementById("postingsDistShow");

    output.innerHTML = distSlider.value;
    distSlider.oninput = () => {
        output.innerHTML = distSlider.value;
    }
}

setupCategorySearch = () => {
    const inputBox = document.getElementById("i_category");
    const dropBox = document.getElementById("c_catDropdown");
    const deleteButton = document.getElementById("deleteCategory");

    if (inputBox.value != "")
        deleteButton.style.display = "block";

    inputBox.addEventListener("focus", () => {
        inputBox.style.borderBottomLeftRadius = 0;
        inputBox.style.borderBottomRightRadius = 0;

        dropBox.innerHTML = "";
        dropBox.style.display = "block";
        queryCategories(inputBox.value);
    });

    // use document.AEL because if focusout, focusout prevents listening of category suggestions
    document.addEventListener("click", (e) => {
        if (e.target != inputBox && dropBox.style.display == "block") {
            inputBox.style.borderBottomLeftRadius = "5px";
            inputBox.style.borderBottomRightRadius = "5px";
            dropBox.style.display = "none";
        }
    });

    inputBox.addEventListener("input", () => {
        dropBox.innerHTML = "";
        queryCategories(inputBox.value);
    });

    ["input", "change"].forEach(event => {
        inputBox.addEventListener(event, () => {
            if (inputBox.value != "")
                deleteButton.style.display = "block";
            else
                deleteButton.style.display = "none";
        });
    });

    deleteButton.addEventListener("click", () => {
        inputBox.value = "";
        deleteButton.style.display = "none";
    });
}

queryCategories = (val) => {
    const dropBox = document.getElementById("c_catDropdown");
    const inputBox = document.getElementById("i_category");

    createContainer = (item) => {
        let container = document.createElement("div");
        container.className = "item_catDropdown";
        container.innerHTML = item;
        container.addEventListener("click", () => {
            inputBox.value = item;
            document.getElementById("deleteCategory").style.display = "block";
        });
        dropBox.appendChild(container);
    }

    if (!val) {
        for (let i = 0; i < 8; i++) {
            createContainer(categories[i]);
        }
    } else {
        categories.forEach(i => {
            if ((i.toLowerCase()).includes(val.toLowerCase())) {
                createContainer(i);
            }
        });
    }
}

setupPosts = () => {
    const content = document.getElementById("rightContent");
    const seeMoreButtons = content.querySelectorAll(".postDropdownButton");
    
    seeMoreButtons.forEach(item => {
        item.addEventListener("click", () => {
            const postBody = item.parentNode.parentNode.querySelector(".c_postBody");
            
            if (postBody.style.display == "none") {
                postBody.style.display = "block";
                item.innerHTML = "Hide Details";
            } else {
                postBody.style.display = "none";
                item.innerHTML = "Show Details";
            }
        });
    });
}

setupLocationSearch = () => {
    const input = document.getElementById("i_location");
    const dropdown = document.getElementById("c_locDropdown");

    getLocation = () => {
        fetch("/api/getlocation", {
            method: "POST",
            body: JSON.stringify({
                input: input.value
            }),
            headers: {          
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(locations => {
            dropdown.innerHTML = "";
            locations.forEach(l => {
                console.log(l);
                const container = document.createElement("div");
                const icon = document.createElement("img");
                const address = document.createElement("span");
                
                container.className = "item_locDropdown";
                icon.src = "assets/images/location.png";
                address.innerHTML = l;

                container.appendChild(icon);
                container.appendChild(address);

                container.addEventListener("click", () => {
                    input.value = l;
                    dropdown.innerHTML = "";
                });

                dropdown.appendChild(container);
            })
        });
    }

    input.addEventListener("focus", () => {
        if (input.value != "") getLocation();
    });

    document.addEventListener("click", (e) => {
        if (e.target.id != "i_location") dropdown.innerHTML = "";
    });

    input.addEventListener("input", () => {
        if (input.value != "") {
            getLocation();
        } else {
            dropdown.innerHTML = "";
        }
    });
}