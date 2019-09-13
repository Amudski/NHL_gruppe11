document.addEventListener("DOMContentLoaded", start);
const url = `https://spreadsheets.google.com/feeds/list/1OAFNgheFOOnqsYvMPDD6ouyja7FnQMRnThJniKbInvU/od6/public/values?alt=json`;
let teams;
let filter = "alle";
// første funktion der kaldes efter DOM er loaded
function start() {
    const filterKnapper = document.querySelectorAll("nav button");
    filterKnapper.forEach(knap => knap.addEventListener("click", filtrerTeams));
    //document.querySelector("#detalje").style.display = "none";
    skjulDetalje();
    loadData();
}
// funktion der filtrerer personer (json)
function filtrerTeams() {
    filter = this.dataset.kategori; // sæt variabel "filter" til aktuel værdi
    document.querySelector(".valgt").classList.remove("valgt"); // fjern klassen valgt fra aktuel knap
    this.classList.add("valgt") // marker den nyvalgte knap
    vis(); // kald funktionen vis igen med nyt filter
}
// funktion der henter data fra Google sheet (via url)
async function loadData() {
    const response = await fetch(url);
    teams = await response.json();
    vis();
}
//funktion der viser personer i liste view
function vis() {
    console.log(filter);
    const dest = document.querySelector("#liste"); // container til articles med en person
    const skabelon = document.querySelector("template").content; // select indhold af html skabelon (article)
    dest.textContent = "";
    teams.feed.entry.forEach(team => { // loop igennem json (personer)
        if (team.gsx$location.$t == filter || filter == "alle") { // tjek hvilket køn personen har og sammenlign med filter eller vis alle
            const klon = skabelon.cloneNode(true);
            klon.querySelector(".navn").textContent = team.gsx$teams.$t;
            klon.querySelector(".profil-billede").src = "imgs/" + team.gsx$billede.$t + ".png";
            klon.querySelector(".team").addEventListener("click", () => {
                visDetalje(team);
            });
            dest.appendChild(klon);
        }
    })
}

function visDetalje(team) {
    console.log(team);

    document.querySelector("#detalje").style.display = "block";
    document.querySelector("#detalje .luk").addEventListener("click", skjulDetalje);


    document.querySelector("#detalje .teams").textContent = team.gsx$teams.$t;
    document.querySelector("#detalje .win").textContent = "Vundet: " + team.gsx$wins.$t;
    document.querySelector("#detalje .lose").textContent = "Tabte: " + team.gsx$losses.$t;
    document.querySelector("#detalje .pts").textContent = "Samlet point: " + team.gsx$pts.$t;
    document.querySelector("#detalje .beskrivelse").textContent = "Beskrivelse: " + team.gsx$beskrivelse.$t;

    document.querySelector("#detalje img").src = "large/" + team.gsx$billede.$t + ".png";
    document.querySelector("#detalje img").alt = `Portræt af ${team.gsx$billede.$t}`;



}

function skjulDetalje() {
    document.querySelector("#detalje").style.display = "none";
}
