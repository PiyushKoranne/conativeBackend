const url = "mongodb://127.0.0.1:27017/conative";

const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");
module.exports = (uid) => {
  console.log("idssisi", uid);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("conative");

    dbo
      .collection("users")
      .findOne({ _id: new ObjectId(uid) }, function (err, result) {
        return result;
      });
  });
};
