function app() {
  return {
    url: "http://localhost/mini-billing/api",
    isMember: false,
    packages: [],
    customer: null,
    init() {
      this.load_packages();
      this.getAccount();
    },
    buy_package(id) {
      let pack = this.packages.find((pack) => pack.id === id);

      storage.set("buy_package", JSON.stringify(pack));
      let customer = storage.has("customer");

      if (customer) {
        window.location.href = "payment.html";
      } else {
        window.location.href = "verification.html";
      }
    },
    load_packages() {
      fetch("./packages.json")
        .then((res) => res.json())
        .then((res) => {
          this.packages = res;
        });
    },
    getAccount() {
      $token = storage.get("token", true);

      if (!$token) return;

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
            this.customer = response.data;
            storage.set("customer", response.data, true);
          }
        });
    },
  };
}
