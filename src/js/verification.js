function verifications() {
  return {
    url: "http://localhost/mini-billing/api",
    steps: 0,
    timer: null,
    intervalId: null,
    loading: false,
    inputs: {
      count: 5,
      value: "",
      values: {},
    },
    init() {
      if (storage.has("token")) {
        window.location.href = "index.html";
      }

      this.getVerificationData();
    },
    data: {
      verified: false,
      phone: null,
      name: null,
      password: null,
      email: null,
      sessionKey: "verification",
    },
    async request_code() {
      if (!this.data.phone) {
        alert("No Handphone tidak boleh kosong.");
        return;
      }
      this.loading = true;
      let Form = new FormData();
      Form.append("username", this.data.phone);
      const request = await fetch(`${this.url}/auth`, {
        method: "post",
        body: Form,
      });

      if (request.ok) {
        this.steps = 1;
        this.sessionSave();
        this.startTimer();
      }

      this.loading = false;
    },
    request_verify() {
      let Form = new FormData();
      Form.append("username", this.data.phone);
      Form.append("otp", this.inputs.value);

      this.loading = true;
      fetch(`${this.url}/auth/verify`, {
        method: "POST",
        body: Form,
      })
        .then((r) => r.json())
        .then((response) => {
          if (response.success) {
            if (response.exists) {
              removeItemSession(this.data.sessionKey);
              storage.set("token", response.token, true);
              $redirect = storage.has("buy_package") ? "payment" : "index";
              window.location.href = `${$redirect}.html`;
            } else {
              this.steps = 2;
              this.data.verified = true;
              this.sessionUpdate();
            }
          } else {
            if (response.status_code === 404) {
              this.resetData();
            } else if (response.status_code === 400) {
              this.clearInputValues();
            }
            alert(response.msg);
          }
        })
        .catch((e) => {})
        .finally(() => (this.loading = false));
    },
    request_register() {
      if (!this.data.name) {
        alert("Nama tidak boleh kosong");
        return;
      }
      if (!this.data.email) {
        alert("Alamat email tidak boleh kosong");
        return;
      }
      if (!this.data.password) {
        alert("Kata sandi tidak boleh kosong");
        return;
      }

      let Form = new FormData();
      Form.append("username", this.data.phone);
      Form.append("password", this.data.password);
      Form.append("email", this.data.email);
      Form.append("name", this.data.name);

      this.loading = true;
      fetch(`${this.url}/auth/register`, {
        method: "POST",
        body: Form,
      })
        .then((r) => r.json())
        .then((response) => {
          if (response.success) {
            removeItemSession(this.data.sessionKey);
            window.location.href = "index.html";
            storage.set("token", response.token, true);
          } else {
            alert("Poses gagal. coba lagi nanti.");
          }
        })
        .catch((e) => {})
        .finally(() => (this.loading = false));
    },
    changePhoneNumber() {
      this.resetData();
    },

    onKeyUp($event, index) {
      const input = $event.target;
      const value = input.value;
      const fieldIndex = index;

      if ($event.key === "Backspace") {
        if (fieldIndex > 1) {
          input?.previousElementSibling?.focus();
          input.previousElementSibling.readOnly = false;
          input.readOnly = true;
        }
        this.inputs.value = this.inputs.value.slice(0, -1);
      }
      if (isNumber(value)) {
        if (value.length > 1) {
          this.inputs.value = this.inputs.value.slice(0, -1);
          this.clear($event);
          return;
        }

        this.inputs.value += value;

        if (value.length > 0 && fieldIndex < this.inputs.count) {
          input.nextElementSibling.focus();
          input.nextElementSibling.readOnly = false;
          input.readOnly = true;
        }

        if (input.value !== "" && fieldIndex === this.inputs.count) {
          this.request_verify();
        }
      } else {
        this.clear($event);
      }
    },
    clear($event) {
      $event.target.value = "";
    },
    clearInputValues() {
      const inputs = document.querySelectorAll(".input_otp input");
      this.inputs.value = "";
      inputs.forEach((input, index) => {
        input.value = "";
        if (index == 0) {
          input.readOnly = false;
          input.focus();
        } else {
          input.readOnly = true;
        }
      });
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
    getVerificationData() {
      const sessionData = getItemSession(this.data.sessionKey, true);
      if (sessionData) {
        let data = JSON.parse(sessionData);
        this.data.phone = data.phone;
        this.steps = data.steps;
        this.data.verified = data.verified;
        if (data.steps < 2) {
          this.startTimer();
        } else {
          this.stopTimer();
        }
      }
    },
    sessionSave() {
      setItemSession(
        this.data.sessionKey,
        JSON.stringify({
          steps: this.steps,
          phone: this.data.phone,
          verified: this.data.verified,
        }),
        true
      );
    },
    sessionUpdate() {
      if (hasSession(this.data.sessionKey)) {
        this.sessionSave();
      }
    },
    resetData() {
      removeItemSession(this.data.sessionKey);
      this.stopTimer();
      this.steps = 0;
      this.data.verified = false;
      this.data.phone = null;
      this.data.name = null;
    },
  };
}
