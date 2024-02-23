var express = require("express");
var router = express.Router();
var multer = require("multer");
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

const MongoClient = require("mongodb").MongoClient;

const { ObjectId } = require("mongodb");
const { constants } = require("fs");

router.get("/digitallegacy", checkLogin, async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    const userlogin = await  dbo.collection("users").findOne({ _id: new ObjectId(session.userid) });
    const option = await dbo.collection("option").findOne()
    const legacyslideitem = await dbo.collection("legacyslideitem").find().sort({ _id: -1 }).toArray()
    const headermenu_dynamic = await dbo.collection("menus")
                                    .find({
                                      $and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
                                    }).sort({ index: 1 }).toArray()
    const setting_dynamic = await dbo.collection("menus")
                                    .find({
                                      $and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
                                    }).sort({ index: 1 }).toArray()

		const result = await     dbo.collection("digitallegacies").findOne();

		if (result) {
      session.message = "";
      res.render("admin/home/digitallegacy_show", {
        title: "Digital Legacy",
        headermenu: headermenu_dynamic,
        settingmenu: setting_dynamic,
        legacyslideitem: legacyslideitem,
        frontend_url: frontend_url,
        opt: option,
        pagedata: result,
        userlogin: userlogin,
        msg: session.message,
      });
		} else {
			res.status(400).json({ message: "Data not found" })
		}

	} catch (error) {
		console.log("OPTION SHOW ROUTE ERROR\n")
		console.log(error);
		res.status(500).json({ message: "Some error occurred", error: error?.message })
	} finally {
		// Close the database connection in the finally block
		if (client) {
			client.close();
		}}
});

router.get("/createdigital", checkLogin, async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    const headermenu_dynamic = await   dbo.collection("menus")
                                          .find({
                                            $and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
                                          }).sort({ index: 1 }).toArray()

    const setting_dynamic = await dbo.collection("menus")
                                      .find({
                                        $and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
                                      }).sort({ index: 1 }).toArray()


		const result = await  dbo.collection("option").findOne();

		if (result) {
      res.render("admin/home/digitallegacy", {
        title: "Digital Legacy",
        headermenu: headermenu_dynamic,
        settingmenu: setting_dynamic,
        opt: result,
        msg: "",
      });
		} else {
			res.status(400).json({ message: "Data not found" })
		}

	} catch (error) {
		console.log("OPTION SHOW ROUTE ERROR\n")
		console.log(error);
		res.status(500).json({ message: "Some error occurred", error: error?.message })
	} finally {
		// Close the database connection in the finally block
		if (client) {
			client.close();
		}}
});

router.post("/adddigital",upload.fields([
    {
      name: "userPhoto",
      maxCount: 1,
    },
  ]),
  async function (req, res, next) {

    let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");

    var userPhotoName = "";

    if (req.files["userPhoto"]) {
      const userPhoto = req.files["userPhoto"];
      userPhotoName = userPhoto[0].filename;
    }

    var myobj = {
      oid: "1",
      name: req.body.name.trim(),
      title: req.body.title.trim(),
      experience: req.body.experience.trim(),
      description: req.body.description.trim(),
      image: userPhotoName,
    };

		const result = await  dbo .collection("digitallegacies")
                              .findOneAndUpdate(
                                { oid: "1" },
                                { $set: myobj },
                                { upsert: true, returnNewDocument: true });

		if (result) {
      session.message = "Data updated successfully";
      return res.redirect("/digitallegacy");

		} else {
      session.message = "Data wasn't updated";
      return res.redirect("/digitallegacy");

		}

	} catch (error) {
		console.log("OPTION SHOW ROUTE ERROR\n")
		console.log(error);
		res.status(500).json({ message: "Some error occurred", error: error?.message })
	} finally {
		// Close the database connection in the finally block
		if (client) {
			client.close();
		}}
});

router.get("/digital-show",async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("digitallegacies").findOne();

		if (result) {
			res.status(200).json(result)
		} else {
			res.status(400).json({ message: "Data not found" })
		}

	} catch (error) {
		console.log("OPTION SHOW ROUTE ERROR\n")
		console.log(error);
		res.status(500).json({ message: "Some error occurred", error: error?.message })
	} finally {
		// Close the database connection in the finally block
		if (client) {
			client.close();
		}
	}
});

router.post("/legacyslide",upload.single("userPhoto"),async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    const file = req.file;
    var imagepath = "";
    if (req.body.oldimage != "") {
      imagepath = req.body.oldimage;
    }
    if (file && !file.length) {
      imagepath = file.filename;
    }

    var myobj = {
      image: imagepath,
    };

		const result = await dbo.collection("legacyslideitem").insertOne(myobj);
		if (result) {
      session.message = "Legacy Slide item added successfully";
      return res.redirect("/digitallegacy");
		} else {
      session.message = "Legacy Slide item wasnt added";
      return res.redirect("/digitallegacy");
		}

	} catch (error) {
		console.log("OPTION SHOW ROUTE ERROR\n")
		console.log(error);
		res.status(500).json({ message: "Some error occurred", error: error?.message })
	} finally {
		// Close the database connection in the finally block
		if (client) {
			client.close();
		}
	}

  }
);

router.get("/legacySlideItem-show", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("legacyslideitem").find().sort({ _id: -1 }).toArray();

		if (result) {
			res.status(200).json(result)
		} else {
			res.status(400).json({ message: "Data not found" })
		}

	} catch (error) {
		console.log("OPTION SHOW ROUTE ERROR\n")
		console.log(error);
		res.status(500).json({ message: "Some error occurred", error: error?.message })
	} finally {
		// Close the database connection in the finally block
		if (client) {
			client.close();
		}}
});

router.get("/legacySlideItem-remove/:id", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("legacyslideitem").remove({ _id: new ObjectId(req.params.id) });
		if (result) {
      session.message = "Legacy Slide item deleted successfully";
      res.redirect("/digitallegacy");
		} else {
      session.message = "Legacy Slide item wasn't deleted successfully";
      res.redirect("/digitallegacy");
		}

	} catch (error) {
		console.log("OPTION SHOW ROUTE ERROR\n")
		console.log(error);
		res.status(500).json({ message: "Some error occurred", error: error?.message })
	} finally {
		// Close the database connection in the finally block
		if (client) {
			client.close();
		}
	}
});

router.get("/getlegacySlideItem/:id",async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("legacyslideitem").findOne({ _id: new ObjectId(aid) });
		if (result) {
			res.status(200).json(result)
		} else {
			res.status(400).json({ message: "Data not found" })
		}

	} catch (error) {
		console.log("OPTION SHOW ROUTE ERROR\n")
		console.log(error);
		res.status(500).json({ message: "Some error occurred", error: error?.message })
	} finally {
		// Close the database connection in the finally block
		if (client) {
			client.close();
		}
	}
});

module.exports = router;
