var express = require("express");
var router = express.Router();
var multer = require("multer");
const session = require("express-session");
var checkLogin = require("../../middleware/check");
var axios = require("axios");
const cors = require("cors");
var { upload, url, frontend_url } = require("../constants");
const async = require("async");
router.options("*", cors());

const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

router.get("/", checkLogin, async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    const userlogin = await dbo.collection("users").findOne({ _id: new ObjectId(session.userid) });
    const option = await dbo.collection("option").findOne()
    const headermenu_dynamic  = await    dbo.collection("menus")
                                            .find({
                                              $and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
                                            })
                                            .sort({ index: 1 })
                                            .toArray();
    const setting_dynamic = await dbo.collection("menus")
                                      .find({
                                        $and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
                                      })
                                      .sort({ index: 1 })
                                      .toArray();

		const result = await dbo.collection("homes").findOne();

		if (result) {
		  session.message = "";
      res.render("common/dashboard", {
        title: "dashbord",
        headermenu: headermenu_dynamic,
        settingmenu: setting_dynamic,
        opt: option,
        frontend_url: frontend_url,
        pagedata: result,
        userlogin: userlogin,
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
		if (client) {
			client.close();
		}
	}
});

router.get("/header", checkLogin,async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    const userlogin = await dbo.collection("users").findOne({ _id: new ObjectId(session.userid) })
    const homepage = await dbo.collection("homes").findOne()
    const headermenu_dynamic = await dbo.collection("menus")
                                        .find({
                                          $and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
                                        })
                                        .sort({ index: 1 })
                                        .toArray();
    const setting_dynamic =  await  dbo.collection("menus")
                                        .find({
                                          $and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
                                        })
                                        .sort({ index: 1 })
                                        .toArray();
    
		const result = await     dbo.collection("option").findOne();
		if (result) {
      session.message = "";
      res.render("admin/home/home", {
        title: "header",
        headermenu: headermenu_dynamic,
        settingmenu: setting_dynamic,
        opt: result,
        pagedata: homepage,
        userlogin: userlogin,
        frontend_url: frontend_url,
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
		}
	}
});

router.post("/header",upload.single("userPhoto"),async function (req, res, next) {
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
      hid: "1",
      meta_title: req.body.meta_title.trim(),
      meta_desc: req.body.meta_desc.trim(),
      meta_keywords: req.body.meta_keywords.trim(),
      name: req.body.name.trim(),
      title: req.body.title.trim(),
      content: req.body.content,
      backname: req.body.backname.trim(),
      btnproject: req.body.btnproject.trim(),
      btnprojecturl: req.body.btnprojecturl.trim(),
      btnteam: req.body.btnteam.trim(),
      btnteamurl: req.body.btnteamurl.trim(),
      image: imagepath,
    };
		const result = await dbo.collection("homes")
                            .findOneAndUpdate(
                              { hid: "1" },
                              { $set: myobj },
                              { upsert: true, returnNewDocument: true });

		if (result) {
      session.message = "Home updated successfully";
      res.redirect("/header");
		} else {
      session.message = "Home wasnt updated successfully";
      res.redirect("/header");
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

router.get("/home-show",async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await  dbo.collection("homes").findOne();
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
