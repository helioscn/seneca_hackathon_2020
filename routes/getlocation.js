const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();

router.post("/", (req, res) => {
    if (req.body.input) {
        const bingKey = "AlZieBf-a1EY_4T9udiERjy-NdKx-eiPs6f75Dcnmf2Jk9RMTU-1_QkWvGyuN1ki";
        const input = req.body.input;
        const coords = { lat: 43.6532, long: -79.3832 };        // centered in Toronto
        const url = "http://dev.virtualearth.net/REST/v1/Autosuggest?query=" + input + "&userLocation=" + coords.lat + "," + coords.long + ",1000&maxResults=5&includeEntityTypes=Address,Place&key=" + bingKey;
        
        fetch(url, {
            method: "GET"
        })
        .then(response => response.json())
        .then(result => {
            let values = result.resourceSets[0].resources[0].value;
            let addresses = [];
            for (let i = 0; i < values.length; i++) {
                let address = values[i].address.addressLine;
                let city = values[i].address.locality;
                let state = values[i].address.adminDistrict;
                let pc = values[i].address.postalCode;
                let country = values[i].address.countryRegion;

                if (address && city && state && pc && country) {
                    let addressString = address + ", " + city + ", " + state + " " + pc + ", " + country;
                    addresses.push(addressString);
                }
            }
            res.send(addresses);
        });
    }
});

module.exports = router;