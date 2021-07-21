let userAddressX = 126.570667;
let userAddressY = 33.450701;

// 지도타입 컨트롤의 지도 또는 스카이뷰 버튼을 클릭하면 호출되어 지도타입을 바꾸는 함수입니다
function setMapType(maptype) { 
    const roadmapControl = document.getElementById('btnRoadmap');
    const skyviewControl = document.getElementById('btnSkyview'); 
    if (maptype === 'roadmap') {
        map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);    
        roadmapControl.className = 'selected_btn';
        skyviewControl.className = 'btn';
    } else {
        map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);    
        skyviewControl.className = 'selected_btn';
        roadmapControl.className = 'btn';
    }
}

// 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomIn() {
    map.setLevel(map.getLevel() - 1);
}

// 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
function zoomOut() {
    map.setLevel(map.getLevel() + 1);
}

const loading = document.getElementById('loading');

geocoder.addressSearch(userAddress, function (result, status) {

    if (status === kakao.maps.services.Status.OK) {
        userAddressX = result[0].x;
        userAddressY = result[0].y;
    }
});

if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function (position) {

        const lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도

        const locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
            message = geoSuccessMsg; // 인포윈도우에 표시될 내용입니다

        displayMarker(locPosition, message);

        if (setCenterByCurrentLocation) map.setCenter(locPosition);

        loading.style.display = 'none';
    });

} else {

    let locPosition = new kakao.maps.LatLng(userAddressY, userAddressX),
        message = geoFailMsg;

    displayMarker(locPosition, message);

    if (setCenterByCurrentLocation) map.setCenter(locPosition);

    loading.style.display = 'none';
}

const addrLocationBtn = document.getElementById('address-location-button');
const currLocationBtn = document.getElementById('current-location-button');


addrLocationBtn.addEventListener('click', () => {
    const addressInput = document.getElementById('address-location');

    geocoder.addressSearch(addressInput.value, function (result, status) {

        if (status === kakao.maps.services.Status.OK) {

            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            currentLocationMarker.setMap(null);
            currentLocationInfowindow.close();

            currentLocationMarker = new kakao.maps.Marker({
                map: map,
                position: coords
            });

            currentLocationInfowindow = new kakao.maps.InfoWindow({
                content: geoSuccessMsg,
                removable: true
            });
            currentLocationInfowindow.open(map, currentLocationMarker);

            map.setCenter(coords);
        }
    });

    addressInput.value = '';
});

currLocationBtn.addEventListener('click', () => {

    loading.style.display = 'block';

    if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
        currentLocationInfowindow.close();
    }

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {

            const lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도

            const locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
                message = geoSuccessMsg; // 인포윈도우에 표시될 내용입니다

            displayMarker(locPosition, message);

            map.setCenter(locPosition);

            loading.style.display = 'none';
        });

    } else {

        const locPosition = new kakao.maps.LatLng(userAddressY, userAddressX),
            message = '현재 위치를 받아올 수 없습니다 :('

        displayMarker(locPosition, message);

        map.setCenter(locPosition);

    }

});

function displayMarker(locPosition, message) {

    currentLocationMarker = new kakao.maps.Marker({
        map: map,
        position: locPosition
    });

    currentLocationInfowindow = new kakao.maps.InfoWindow({
        content: message,
        removable: true
    });

    currentLocationInfowindow.open(map, currentLocationMarker);
}