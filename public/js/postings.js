window.addEventListener("load", () => {
    setupDistSlider();
    setupCategorySearch();
    queryForPosts();
    setupLocationSearch();
    setupCompensationRadios();
    setupPriceSliders();
});

// document.createElement shorter identifier, with option of className
ce = (type, cn = false) => {
    let el = document.createElement(type);
    if (typeof cn === "string") el.className = cn;
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

    distSlider.addEventListener("mouseup", () => {
        const content = document.getElementById("rightContent");
        content.innerHTML = "";
        queryForPosts();
    });
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
            var event = new Event('change');
            inputBox.value = item;
            inputBox.dispatchEvent(event);
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

createPosts = (distance, i) => {
    const content = document.getElementById("rightContent");
    let existingPosts = content.querySelectorAll(".c_post");
    let found = false;

    for (let j = 0; j < existingPosts.length; j++)
        if (existingPosts[j].dataset.id == i) found = true;

    if (content.querySelector(".spinner"))
        content.removeChild(content.childNodes[0]);

    if (!found) {
        createHeader = () => {
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

            let dollars = "$" + posts[i].compensation;
            if (posts[i].hourly) dollars += "/hr";
            compensation.innerHTML = dollars;

            button.innerHTML = "Show Details";
            toggleDetailsButton(button);

            // info container
            infoContainer.appendAll(title, user, compensation);

            // header
            container.appendAll(avatar, infoContainer, button);

            return container;
        }

        createBody = () => {
            const container = ce("div", "c_postBody");
            const separator = ce("hr");
            const subtitle = ce("h3");
            const desc = ce("p", "postBodyDesc");

            subtitle.innerHTML = "Description";
            desc.innerHTML = posts[i].desc;

            container.appendAll(separator, subtitle, desc);

            return container;
        }

        createFooter = () => {
            const container = ce("div", "c_postFooter");
            const distContainer = ce("div", "c_iconInfo");
            const timeContainer = ce("div", "c_iconInfo");
            const distIcon = ce("img");
            const timeIcon = ce("img");
            const dist = ce("span");
            const time = ce("span");

            let origin = document.getElementById("i_location").value;
            let dest = posts[i].location;
            dist.innerHTML = distance + " km away";
            distIcon.src = "assets/images/ruler.png";
            
            time.innerHTML = timeToAgo(posts[i].time);
            timeIcon.src = "assets/images/clock.png";

            distContainer.appendAll(distIcon, dist);
            timeContainer.appendAll(timeIcon, time);
            container.appendAll(distContainer, timeContainer);
            container.dataset.address = posts[i].location;

            return container;
        }

        const post = ce("div", "c_post");
        const header = createHeader();
        const body = createBody();
        const footer = createFooter();

        post.dataset.id = i;
        post.dataset.hourly = posts[i].hourly;
        post.appendAll(header, body, footer);
        content.appendChild(post);
    }
}

timeToAgo = (time) => {
    let current = (new Date().getTime() / 1000).toFixed(0);
    let diff = current - time;
    console.log(diff);

    if (diff < 60) {
        return diff + (time === 1 ? " second ago" : " seconds ago");
    } else if (diff >= 60 && diff < 3600) {
        let minutes = diff / 60;
        return minutes.toFixed(0) + (minutes === 1 ? " minute ago" : " minutes ago");
    } else if (diff >= 3600 && diff < 86400) {
        let hours = diff / 3600;
        return hours.toFixed(0) + (hours === 1 ? " hour ago" : " hours ago");
    } else if (diff >= 86400) {
        let days = diff / 86400;
        return days.toFixed(0) + (days === 1 ? " day ago" : " days ago");
    }
}

toggleDetailsButton = (button) => {
    button.addEventListener("click", () => {
        const postBody = button.parentNode.parentNode.querySelector(".c_postBody");
            
        // toggle details
        if (postBody.style.display == "none") {
            postBody.style.display = "block";
            button.innerHTML = "Hide Details";
        } else {
            postBody.style.display = "none";
            button.innerHTML = "Show Details";
        }
    });
}

fetchDistance = (origin, dest) => {
    return new Promise((resolve, reject) => {
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
        }).then(res => {
            return res.json();
        }).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
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

                    queryForPosts();
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

queryForPosts = () => {
    const locInput = document.getElementById("i_location");
    const content = document.getElementById("rightContent");
    const spinner = ce("img", "spinner");
    content.innerHTML = "";

    spinner.src = "assets/images/spinner.gif";
    content.appendChild(spinner);
    
    posts.forEach((item, i) => {
        let minDollars = parseInt(document.getElementById("minPrice").innerText.replace(/^\$/, ""));
        let maxDollars = parseInt(document.getElementById("maxPrice").innerText.replace(/^\$/, ""));
        if (item.compensation >= minDollars && item.compensation <= maxDollars) {
            fetchDistance(locInput.value, item.location).then(data => {
                let radius = parseInt(document.getElementById("postingsDistSlider").value, 10);
                let d = parseInt(data.distance.toFixed(1), 10);
                if (d <= radius && d > 0) createPosts(d, i);
            });
        }
    });
}

setupCompensationRadios = () => {
    let radios = document.querySelectorAll("input[type=radio][name='compType']");

    Array.prototype.forEach.call(radios, radio => {
        radio.addEventListener("change", (e) => {

        });
    });
}

setupPriceSliders = () => {
    let sliderBg = document.getElementById("priceSlider");
    let sliderWidth = sliderBg.clientWidth;
    let minSlider = document.getElementById("minSlider");
    let maxSlider = document.getElementById("maxSlider");
    let minDrag = false, maxDrag = false;
    let minX, maxX, offsetX;

    minSlider.addEventListener("mousedown", (e) => {
        minDrag = true;
    });

    maxSlider.addEventListener("mousedown", (e) => {
        maxDrag = true;
    });

    document.addEventListener("mouseup", (e) => {
        if (minDrag) {
            minDrag = false;
            queryForPosts();
        } else if (maxDrag) {
            maxDrag = false;
            queryForPosts();
        }
    });

    document.addEventListener("mousemove", (e) => {
        if (minDrag) 
            movePriceSlider("min", e.clientX);
        else if (maxDrag)
            movePriceSlider("max", e.clientX);
    });
}

movePriceSlider = (current, mouseX) => {
    let mainSlider = document.getElementById("priceSlider");                         // main slider width minus slider width
    let xFromScreenLeft = mainSlider.getBoundingClientRect().left + 12;     // how far away start of main slider is from left edge of screen
    let minSlider = document.getElementById("minSlider");
    let maxSlider = document.getElementById("maxSlider");
    let sliderWidth = minSlider.clientWidth;
    let mainWidth = mainSlider.clientWidth - sliderWidth;   
    let inner = document.getElementById("innerPriceSlider");                // inner bar that highlights current range                     
    let toPos = mouseX - xFromScreenLeft;
    
    let difference = maxSlider.offsetLeft - minSlider.offsetLeft;

    // set inner bar width
    inner.style.width = difference + "px";

    if (current === "min") {
        if (toPos >= 0) {
            let maxX = maxSlider.offsetLeft;
            if (toPos < maxX) {
                // set inner bar left to match min slider position
                inner.style.left = (maxSlider.offsetLeft - difference) + "px";
                
                minSlider.style.left = toPos + "px";
            } else {
                // min slider can't move past max slider
                inner.style.width = "5px";
                inner.style.left = (maxSlider.offsetLeft - 2) + "px";
                minSlider.style.left = (maxX - 2) + "px";
            }
        } else {
            inner.style.left = "0px";
            minSlider.style.left = 0;
        }
    } else {
        let minX = minSlider.offsetLeft;
        if (toPos <= mainSlider.clientWidth - sliderWidth) {
            if (toPos > minX) {
                maxSlider.style.left = toPos + "px";
            } else {
                // max slider can't move past min slider
                maxSlider.style.left = (minX + 2) + "px";
            }
        } else {
            maxSlider.style.left = (mainSlider.clientWidth - sliderWidth) + "px";
        }
    }

    sliderPositionToPriceRange(minSlider.offsetLeft, maxSlider.offsetLeft, mainWidth);
}

sliderPositionToPriceRange = (left, right, width) => {
    const maxPrice = 1000;
    const minPrice = 1;
    let maxText = document.getElementById("maxPrice");
    let minText = document.getElementById("minPrice");

    maxText.innerHTML = "$" + Math.round((right/width) * 1000);
    minText.innerHTML = "$" + Math.round((left/width) * 1000);
}