function app() {
  return {
    isMember: false,
    packages: [],
    init() {
      // this.isMember = true;
      this.loadConfig();
    },
    time() {
      // let time = new Date();
      // setInterval(() => {
      //     return time.toLocaleTimeString()
      // }, 1000)
    },
    loadConfig() {
      fetch("./packages.json")
        .then((res) => res.json())
        .then((res) => {
          this.packages = res;
        });
    },
  };
}

function payments() {
  return {
    steps: 0,
    timer: null,
    intervalId: null,
    data: {
      phone: null,
      name: null,
    },
    next() {
      if (this.steps == 0 && this.data.phone) {
        this.steps++;
        this.startTimer();
      }
      // if (this.steps == 1) {
      //   this.steps++;
      // }
    },
    back() {
      if (this.steps > 0) {
        this.steps--;
      }
    },
    startTimer(duration = 120) {
      let minutes, seconds;
      if (!this.intervalId) {
        this.intervalId = setInterval(() => {
          if (duration > 0) {
            --duration;
          } else {
            this.stopTimer();
            return;
          }

          minutes = parseInt(duration / 60, 10);
          seconds = parseInt(duration % 60, 10);
          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;
          this.timer = minutes + ":" + seconds;
        }, 1000);
      }
    },
    stopTimer() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.timer = null;
        this.intervalId = null;
      }
    },
  };
}

const inputs = document.querySelectorAll(".four_otp input");
inputs.forEach((input, index) => {
  input.dataset.index = index;
  input.addEventListener("keydown", clear);
  input.addEventListener("keyup", onKeyUp);
});

function clear($event) {
  $event.target.value = "";
}

function checkNumber(number) {
  return /[0-9]/g.test(number);
}

function onKeyUp($event) {
  const input = $event.target;
  const value = input.value;
  const fieldIndex = +input.dataset.index;

  if ($event.key === "Backspace" && fieldIndex > 0) {
    input?.previousElementSibling?.focus();
    input.readOnly = true;
  }
  if (checkNumber(value)) {
    if (value.length > 0 && fieldIndex < inputs.length - 1) {
      input.nextElementSibling.focus();
      input.nextElementSibling.readOnly = false;
    }
    if (input.value !== "" && fieldIndex === inputs.length - 1) {
      // input.readOnly = true;
      console.log("tr");
    }
  } else {
    clear($event);
  }
}

function generateRandomCode(length) {
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * 10); // Menghasilkan angka acak dari 0 hingga 9
    code += randomNumber.toString(); // Menambahkan angka ke dalam string
  }
  return parseInt(code);
}

function encodebase64(param) {
  return btoa(param);
}

function decodebase64(param) {
  return atob(param);
}

function setItemSession(key, params) {
  window.sessionStorage.setItem(key, params);
}

function getItemSession(key) {
  return window.sessionStorage.getItem(key);
}
