function format_date(timestamp) {
  var date = new Date(timestamp * 1000);
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2); // Tambahkan 1 karena bulan dimulai dari 0
  var day = ("0" + date.getDate()).slice(-2);
  var hours = ("0" + date.getHours()).slice(-2);
  var minutes = ("0" + date.getMinutes()).slice(-2);
  var seconds = ("0" + date.getSeconds()).slice(-2);

  var formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}

function currency(value) {
  if (!isNumber) return value;

  const style = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  return style.format(value);
}

function isNumber(value) {
  return /[0-9]/g.test(value);
}

function generateRandomCode(count) {
  const min = Math.pow(10, count - 1); // Mendefinisikan nilai minimal
  const max = Math.pow(10, count) - 1; // Mendefinisikan nilai maksimal
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function encodebase64(param) {
  return btoa(param);
}

function decodebase64(param) {
  return atob(param);
}

function setItemSession(key, params, encode = false) {
  if (encode) {
    params = encodebase64(params);
  }

  window.sessionStorage.setItem(key, params);
}

function getItemSession(key, decode = false) {
  let value = window.sessionStorage.getItem(key);
  if (decode && value) {
    value = decodebase64(value);
  }
  return value;
}

function removeItemSession(key) {
  return window.sessionStorage.removeItem(key);
}

function hasSession(key) {
  const session = window.sessionStorage.getItem(key);
  if (session) {
    return true;
  }

  return false;
}

const storage = {
  set: (key, value, encode = false) => {
    if (encode) {
      value = encodebase64(value);
    }

    window.localStorage.setItem(key, value);
  },
  get: (key, decode = false) => {
    let data = window.localStorage.getItem(key);
    if (data && decode) {
      return decodebase64(data);
    }

    return data;
  },
  has: (key) => {
    let result = window.localStorage.getItem(key);
    if (result) {
      return true;
    }

    return false;
  },
};

function sendOtp(number, text) {
  return new Promise((resolve, reject) => {
    fetch("http://localhost/sms-gateway/", {
      method: "POST",

      body: JSON.stringify({
        text: text,
        number: number,
      }),
    })
      .then((r) => r.json())
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
