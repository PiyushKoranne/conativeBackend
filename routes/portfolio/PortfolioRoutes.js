var express = require("express");
var router = express.Router();
var multer = require("multer");
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

var MongoClient = require("mongodb").MongoClient;

var { ObjectId } = require("mongodb");


router.get("/portfolio", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		let portfolioarr = await dbo.collection("portfolio").findOne();
		let headermenu_dynamic = await dbo
						.collection("menus")
						.find({
						$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
						})
						.sort({ index: 1 })
						.toArray();
		let userlogin = await dbo
						.collection("users")
						.findOne({ _id: new ObjectId(session.userid) });
		let setting_dynamic = await dbo
						.collection("menus")
						.find({
						$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
						})
						.sort({ index: 1 })
						.toArray();
		
		const result = await dbo.collection("option").findOne();
		if (result) {
			session.message = "";
			res.render("admin/portfolio/portfolio", {
				title: "Portfolio",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				userlogin: userlogin,
				pagedata: portfolioarr,
				opt: result,
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


router.post(
  "/portfolio-content",
  upload.single("userPhoto"),
  async function (req, res, next) {
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
			oid: "1",
			meta_title: req.body.meta_title.trim(),
			meta_desc: req.body.meta_desc.trim(),
			meta_keywords: req.body.meta_keywords.trim(),
			title: req.body.title.trim(),
			heading: req.body.heading.trim(),
			content: req.body.content.trim(),
		};
		const result = await dbo
								.collection("portfolio")
								.findOneAndUpdate(
								{ oid: "1" },
								{ $set: myobj },
								{ upsert: true, returnNewDocument: true }
								);
		if (result) {
			session.message = "Data updated successfully";
			return res.redirect("/portfolio");
		} else {
			session.message = "Failed to update data";
			return res.redirect("/portfolio");
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


router.get("/portfolio-content-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("portfolio").findOne({});
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
