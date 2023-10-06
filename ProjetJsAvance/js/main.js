import haversine from "./module/utils/math";

const url ="https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records";
const list = document.querySelector('#cineList');


window.addEventListener('DOMContentLoaded', () => {
    fetch(url)
    .then(response => response.json())
    .then(response => {
        const tri = response.results.sort((a,b) => b.fauteuils - a.fauteuils);
        let outputHtml ='';
        tri.forEach((cinema) => {
            outputHtml += `<li id="${cinema.ndeg_auto}"> ${cinema.nom} ${cinema.adresse} ${cinema.commune}</li>`;
        });
        list.innerHTML = outputHtml;
    });
});




window.addEventListener('DOMContentLoaded', () => {
    new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
            resolve(position.coords);
        });
    })
    .then(position => {
        return fetch(url)
            .then(response => response.json())
            .then(cinemas => {  
                let outputHtml='';
                cinemas.results.forEach(cinema => {
                    const {lat,lon} = cinema.geolocalisation;
                    cinema.distance = haversine([lat,lon],[position.latitude, position.longitude]);    
                    outputHtml += `<li> La distance entre vous et le ${cinema.nom} est de ${cinema.distance} km</li>`;
                });
                cinemas.results.sort((a,b) => a.distance - b.distance);
                document.querySelector('#listDist').innerHTML= outputHtml;
            });  
    })
    .catch(error => console.error('Error:'+ error));
});
