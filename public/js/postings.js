window.addEventListener("load", () => {
    setupDistSlider();
    setupCategorySearch();
    setupPosts();
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