const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

const axios = require('axios');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    apiKey: "AIzaSyDWddPOr9qDqlzuvFb_GZ2VOmK53OdJdEI",
    authDomain: "fisku-36c86.firebaseapp.com",
    databaseURL: "https://fisku-36c86-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fisku-36c86",
    storageBucket: "fisku-36c86.appspot.com",
    messagingSenderId: "64822032599",
    appId: "1:64822032599:web:04a1794103a34810ba1892"
});

// fb = firebase
// RDB = Realtime Database
let fbRDB = admin.database();
let usersRef = fbRDB.ref("/users/profile");

async function getSaldo(req, res) {
  const id_Seller = req.params.id_Seller;
  let responseData = {};

  // Mengambil data user dari database
  try {
      // update saldo from api Fishku after 1 minutes
      const intervalID = setInterval(async () => {
          const responsePesanan = await axios.get(`https://apis.fishku.id/seller/pesanan/${id_Seller}`);
          const dataPesanan = responsePesanan.data;

          const responseSeler = await axios.get(`https://apis.fishku.id/seller/profile/${id_Seller}`);
          const dataSeler = responseSeler.data;
          // Lakukan penjumlahan total_price
          let total = 0;
          dataPesanan.data.forEach(item => {
              if (item.status === "sending") {
                  total += parseInt(item.total_price);
              }
          });

          // Simpan data pada database
          usersRef.child(id_Seller).set({
              name: dataSeler.data[0].name,
              id_Seller: id_Seller,
              saldoTotal: total,
          });
          responseData = {
              "name": dataSeler.data[0].name,
              "id_Seller": id_Seller,
              "saldoTotal": total,
          };
          console.log("Data berhasil disimpan pada database.");
      }, 1000 * 60 * 1);

      res.json(responseData);

      // To stop the interval from running, you can call clearInterval
      // clearInterval(intervalID);
  } catch (error) {
      console.error("Terjadi kesalahan:", error);
  }
}



module.exports = {
    getSaldo
};