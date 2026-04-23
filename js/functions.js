
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
        text: "Opravil si level " + trenutniLevel + " / 8"
    }).then(() => {
        if (nalozinivo()) {
            posodobiZivljenjaUI();
            unpause();
        }
    });
}

function navodila() {
    Swal.fire({
        allowOutsideClick: false,
        title: "Navodila!",
        confirmButtonColor: "#185abc",

        text: "z puščicami levo in desno premikaj paddle. Imaš 3 življenja, ki jih pridobiš nazaj vsak level",
    }).then(()=> {
        unpause();
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
            
            // Posodobi izpis v HTML
            $("#tocke").html(tocke);
            $("#cas").html("00:00");
            
            // Naloži nivo in ponovno zažene zanke
            if (nalozinivo()) {
                posodobiZivljenjaUI();
                unpause();
                start = true;
            }
        }
    });
}




