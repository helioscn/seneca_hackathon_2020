window.addEventListener("load", () => {
    setupDistSlider();
    setupCategorySearch();
    setupPosts();
    setupLocationSearch();
});

// document.createElement shorter identifier, with option of className
ce = (type, cn = false) => {
    let el = document.createElement(type);
    if (cn) el.className = cn;
    return el;
}

// append child
HTMLElement.prototype.appendAll = function() {
    for (let i = 0; i < arguments.length; i++)
        this.appendChild(arguments[i]);
}


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
        let container = ce("div", "item_catDropdown");
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

    createHeader = (i) => {
        const container = ce("div", "c_postHeader");
        const avatar = ce("img", "postHeaderImage");
        const infoContainer = ce("div", "c_postHeaderInfo");
        const title = ce("a");
        const user = ce("span", "posterName");
        const compensation = ce("span", "postCompensation");
        const button = ce("span", "postDropdownButton");

        avatar.src = "assets/images/postDefaultIcon.png";
        title.innerHTML = posts[i].title;
        user.innerHTML = posts[i].name;
        compensation.innerHTML = "$" + posts[i].compensation;
        button.innerHTML = "Show Details";

        // info container
        infoContainer.appendAll(title, user, compensation);

        // header
        container.appendAll(avatar, infoContainer, button);

        return container;
    }

    createBody = (i) => {
        const container = ce("div", "c_postBody");
        const separator = ce("hr");
        const subtitle = ce("h3");
        const desc = ce("p", "postBodyDesc");

        subtitle.innerHTML = "Description";
        desc.innerHTML = posts[i].desc;

        container.appendAll(separator, subtitle, desc);

        return container;
    }

    createFooter = (i) => {
        const container = ce("div", "c_postFooter");
        const distContainer = ce("div", "c_iconInfo");
        const timeContainer = ce("div", "c_iconInfo");
        const distIcon = ce("img");
        const timeIcon = ce("img");
        const dist = ce("span");
        const time = ce("span");

        let origin = document.getElementById("i_location").value;
        let dest = posts[i].location;
        distIcon.src = "assets/images/ruler.png";
        
        time.innerHTML = posts[i].time;
        timeIcon.src = "assets/images/clock.png";

        distContainer.appendAll(distIcon, dist);
        timeContainer.appendAll(timeIcon, time);
        container.appendAll(distContainer, timeContainer);
        container.dataset.address = posts[i].location;

        return container;
    }

    posts.forEach((item, i) => {
        const post = ce("div", "c_post");
        const header = createHeader(i);
        const body = createBody(i);
        const footer = createFooter(i);

        post.appendAll(header, body, footer);
        content.appendChild(post);
    });

    configurePostDistance();

    toggleDetailsButton(content);
}

toggleDetailsButton = (content) => {
    const seeMoreButtons = content.querySelectorAll(".postDropdownButton");
    
    seeMoreButtons.forEach(item => {
        item.addEventListener("click", () => {
            const postBody = item.parentNode.parentNode.querySelector(".c_postBody");
            
            // toggle details
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

fetchDistance = (item, origin, dest) => {
    fetch("/api/getdistance", {
        method: "POST",
        body: JSON.stringify({
            origin: origin,
            dest: dest
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(result => {
        item.querySelector(".c_iconInfo > span").innerHTML = result.distance.toFixed(1) + " km away";
    }).catch(err => {
        console.log(err);
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
                const container = ce("div");
                const icon = ce("img");
                const address = ce("span");
                
                container.className = "item_locDropdown";
                icon.src = "assets/images/location.png";
                address.innerHTML = l;

                container.appendAll(icon, address);

                container.addEventListener("click", () => {
                    input.value = l;
                    dropdown.innerHTML = "";

                    configurePostDistance();
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

configurePostDistance = () => {
    const locInput = document.getElementById("i_location");
    let shownPosts = document.querySelectorAll(".c_post");

    shownPosts.forEach((item, i) => {
        let addr = item.querySelector(".c_postFooter").dataset.address;
        fetchDistance(item, locInput.value, addr);

        let spinner = ce("img", "spinner");
        spinner.src = "assets/images/spinner.gif";
        item.querySelector(".c_iconInfo > span").appendChild(spinner);
    });
}