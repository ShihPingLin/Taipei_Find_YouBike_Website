let map;                // the map object
let infoList = [];      // the list of information windows
let markerList = [];    // the list of markers
const iconPeople = "/static/pictures/people.png";
const iconBike = "/static/pictures/bicycle.png";
const iconRedBike = "/static/pictures/bicycle-red.png";
const iconOrgBike = "/static/pictures/bicycle-orange.png";
const iconBluBike = "/static/pictures/bicycle-blue.png";

function reloadAgain() {
    window.location.reload();
}

function delFavorite(stopName, idx) {
    // get favorite stops from localStorage
    const favoriteList = JSON.parse(localStorage.getItem("favoriteStop"));    

    if (confirm(`確定要刪除 ${stopName} `)) {
        // delete data
        favoriteList.splice(idx, 1);

        // save back to localStorage
        localStorage.setItem("favoriteStop", JSON.stringify(favoriteList));

        // reload
        window.location.reload();
    }
}

function setFavorite(ubikeData) {
    // get favorite stops from localStorage
    const temp = JSON.parse(localStorage.getItem("favoriteStop"));

    // set favorite stop to localStorage
    let favoriteList = temp || [];
    if (favoriteList.includes(ubikeData['sno'])) {
        alert(` ${ubikeData['sna']} 已經是常用車站`);
    }
    else {
        favoriteList.push(ubikeData['sno']);
        localStorage.setItem("favoriteStop", JSON.stringify(favoriteList));

        alert(` ${ubikeData['sna']} 加入成功`);
    }
}

function initMap() {
    // the location of initial place (市政府捷運站)
    const initPlace = { lat: 25.0408578889, lng: 121.567904444 };

    map = new google.maps.Map(document.getElementById("map"), {
        center: initPlace,
        zoom: 15,
        mapTypeControl: false,
        styles: [
            // turn off business icon on the map
            {
                featureType: 'poi.business',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });
}

// get the person's location and display ubike stations near him/her
function getLocationAndDisplay(ubikeData, lenFromPos) {
    // HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // clear markers and information windows
                for (let i = 0; i < markerList.length; i++) {
                    markerList[i].setMap(null);
                    infoList[i].setMap(null);
                }
                markerList = []
                infoList = []

                let ubikeInfo = document.getElementById("ubike-info");
                ubikeInfo.innerHTML = ``
                // get the person's location
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                // set the center of the map to the person's location
                map.setCenter(pos);
                map.setZoom(15);

                // find near ubike stations and display
                for (i in ubikeData) {
                    const tempLat = parseFloat(ubikeData[i].lat);
                    const tempLng = parseFloat(ubikeData[i].lng);
                    const length = getDistanceFromLatLonInKm(pos.lat, pos.lng, tempLat, tempLng);

                    // display the ubike station with length < lenFromPos
                    if (length < lenFromPos) {
                        const ubikePos = { lat: tempLat, lng: tempLng };
                        let tempIcon;

                        if (ubikeData[i]["sbi"] == 0 || ubikeData[i]["bemp"] == 0)
                            tempIcon = iconRedBike;
                        else if (ubikeData[i]["sbi"] <= 5 || ubikeData[i]["bemp"] <= 5)
                            tempIcon = iconBluBike;
                        else
                            tempIcon = iconBike;

                        const marker = new google.maps.Marker({
                            position: ubikePos,
                            icon: tempIcon,
                            map: map
                        });
                        markerList.push(marker);
                        const infoW = new google.maps.InfoWindow({
                            pixelOffset: new google.maps.Size(0, -25),
                        });

                        const infoContent = `
                            <h6 style="margin-top: 10px">${ubikeData[i]["sna"]}</h6>
                            <p style="margin: 0px 0px">可借車數：${ubikeData[i]["sbi"]}</p>
                            <p style="margin: 0px 0px">可還空位數：${ubikeData[i]["bemp"]}</p>
                            <a style="margin-bottom: 10px" href="https://www.google.com/maps?ll=${ubikeData[i]["lat"]},${ubikeData[i]["lng"]}
                                &z=17&t=m&hl=zh-TW&gl=TW&mapclient=embed&q=youbike${ubikeData[i]["sna"]}" target="_blank">
                                詳細地圖資訊
                            </a>
                        `

                        infoW.setPosition(ubikePos);
                        infoW.setContent(infoContent);
                        infoList.push(infoW);
                    }
                }
                // create the marker on the person's location
                const marker = new google.maps.Marker({
                    position: pos,
                    icon: iconPeople,
                    map: map
                });
                markerList.push(marker);
                // create the info window of the person's location
                const infoW = new google.maps.InfoWindow({
                    pixelOffset: new google.maps.Size(0, -35),
                });
                infoW.setPosition(pos);
                infoW.setContent(`<h6 style="margin: 10px 0px">你的位置</h6>`);
                infoList.push(infoW);

                // detect click info window event
                for (let i = 0; i < markerList.length; i += 1) {
                    markerList[i].addListener("click", () => {
                        infoList[i].open(map);
                    })
                }
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
                alert("無法取得位置資訊，請嘗試打開定位功能或重新連接網路");
            }
        );
    } else {
        // browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
        alert("無法取得位置資訊，請嘗試打開定位功能或重新連接網路");
    }
}

// calculate distance
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371;                     // radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}