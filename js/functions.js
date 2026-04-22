
const defaultSwalConfig = {
  color: 'white',
  background: '#1e1f20',
  allowOutsideClick: false 
};


function test(event) {
  swal.fire({
    ...defaultSwalConfig,
    icon: "success",
    iconColor: "#48a84f",
    title: "Bravo",
    confirmButtonColor: "#185abc",
    text: "opravil si " + currentLevel + ". level"
  }).then(() => {

  });
}


function zmagaLevel(trenutniLevel) {
    Swal.fire({
        allowOutsideClick: false,
        icon: "success",
        iconColor: "#48a84f",
        title: "Bravo!",
        confirmButtonColor: "#185abc",
        text: "Opravil si " + trenutniLevel + ". level"
    }).then(() => {
        // 3. ODPAVZIRANJE IGRE: Naložimo novo postavitev in vrnemo intervale
        if (nalozinivo()) {
            intervalId = setInterval(draw, 10);
            timerIntervalId = setInterval(posodobiCas, 1000);
        }
    });
}

function konecIgre() {
    Swal.fire({
        icon: 'error',
        iconColor: '#df2d19',
        title: 'Konec igre!',
        text: 'Zmanjkalo ti je življenj',
        confirmButtonText: 'Ponovni začetek',
        confirmButtonColor: '#35495c',
        allowOutsideClick: false,
        confirmButtonText: "poskusi znova"
    }).then((result) => {
        if (result.isConfirmed) {
            // PONASTAVITEV NA LEVEL 0
            curlvl = 0;
            tocke = 0;
            sekunde = 0;
            
            // Posodobimo izpis v HTML
            $("#tocke").html(tocke);
            $("#cas").html("00:00");
            
            // Naložimo nivo in ponovno zaženemo zanke
            if (nalozinivo()) {
                intervalId = setInterval(draw, 10);
                timerIntervalId = setInterval(posodobiCas, 1000);
                start = true;
            }
        }
    });
}




