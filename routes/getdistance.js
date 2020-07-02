const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();

getCoords = (location) => {
    const bingKey = "AlZieBf-a1EY_4T9udiERjy-NdKx-eiPs6f75Dcnmf2Jk9RMTU-1_QkWvGyuN1ki";
    let coordsUrl = "http://dev.virtualearth.net/REST/v1/Locations?countryRegion=Canada&adminDistrict=ON&addressLine=" + location + "&key=" + bingKey;

    return new Promise((resolve, reject) => {
        fetch(coordsUrl).then(res => {
            return res.json();
        }).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
}

getDist = (a, b) =>  {
    const bingKey = "AlZieBf-a1EY_4T9udiERjy-NdKx-eiPs6f75Dcnmf2Jk9RMTU-1_QkWvGyuN1ki";
    let distUrl = "https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=" + a.lat + ", " + a.long + "&destinations=" + b.lat + "," + b.long + "&travelMode=driving&key=" + bingKey;

    return new Promise((resolve, reject) => {
        fetch(distUrl).then(res => {
            return res.json();
        }).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
}

router.post("/", (req, res) => {
    let origin, dest;

    getCoords(req.body.origin).then(data => {
        origin = {
            lat: data.resourceSets[0].resources[0].bbox[0],
            long: data.resourceSets[0].resources[0].bbox[1]
        };
        return getCoords(req.body.dest);
    }).then(data => {
        dest = {
            lat: data.resourceSets[0].resources[0].bbox[0],
            long: data.resourceSets[0].resources[0].bbox[1]
        };
        return getDist(origin, dest);
    }).then(data => {
        let travel = {
            distance: data.resourceSets[0].resources[0].results[0].travelDistance,
            duration: data.resourceSets[0].resources[0].results[0].travelDuration
        }
        res.send(travel);
    }).catch(err => {
        console.log(err);
    });
});

module.exports = router;