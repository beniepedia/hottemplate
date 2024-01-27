function payment() {
  return {
    url: "http://localhost/mini-billing/api",
    loading: false,
    package: null,
    paymentlist: [],
    pay: null,
    data: {
      email: null,
      name: null,
      phone: null,
      payment_method: null,
    },
    init() {
      if (!this.package && !storage.has("token")) {
        window.location.href = "index.html";
      }

      this.getAccount();
      this.getPaymentList();
      this.getDataFromLocalStorage();
    },
    submit() {
      if (!this.data.payment_method) {
        alert("Pilih metode pembayaran");
        return;
      }
      this.payment();
    },
    getDataFromLocalStorage() {
      this.package = JSON.parse(storage.get("buy_package"));
    },
    getAccount() {
      $token = storage.get("token", true);

      fetch(`${this.url}/account`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + $token,
        },
      })
        .then((r) => r.json())
        .then((response) => {
          if (response.success) {
            this.data.name = response.data.name;
            this.data.email = response.data.email;
            this.data.phone = response.data.phone;
          }
        });
    },
    getPaymentList() {
      fetch(`${this.url}/payment-list`)
        .then((r) => r.json())
        .then((response) => {
          this.paymentlist = response.data;
        });
    },
    payment() {
      let token = storage.get("token", true);
      let Form = new FormData();
      Form.append("product_id", this.package.id);
      Form.append("email", this.data.email);
      Form.append("name", this.data.name);
      Form.append("payment_method", this.data.payment_method);
      Form.append("phone", this.data.phone);

      fetch(`${this.url}/payment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: Form,
      })
        .then((r) => r.json())
        .then((response) => {
          console.log(response);
          if (response.success) {
            // this.pay = response.response_payment;
          }
        });
    },
    copyClipboard() {
      const va = this.$refs.va;
      var tempTextArea = document.createElement("textarea");
      tempTextArea.value = va.innerText;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      tempTextArea.setSelectionRange(0, 99999);
      document.execCommand("copy");
      document.body.removeChild(tempTextArea);
      alert("Kode Virtual berhasil di salin.");
    },
  };
}
