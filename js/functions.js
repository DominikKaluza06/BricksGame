
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



