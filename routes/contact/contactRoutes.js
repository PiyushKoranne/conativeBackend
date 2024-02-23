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

router.get("/contact", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		let userlogin = await dbo
								.collection("users")
								.findOne({ _id: new ObjectId(session.userid) });
		let homepage = await dbo.collection("homes").findOne();
		let headermenu_dynamic = await dbo
						.collection("menus")
						.find({
						$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
						})
						.sort({ index: 1 })
						.toArray();
		let setting_dynamic = await dbo
						.collection("menus")
						.find({
						$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
						})
						.sort({ index: 1 })
						.toArray();
		let option = await dbo.collection("option").findOne();

		const result = await dbo.collection("contactus").findOne();
		if (result) {
			session.message = "";
			res.render("admin/contact/contact", {
				title: "contact",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				option: option,
				pagedata: result,
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

router.post("/contact-content", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var myobj = {
			oid: "1",
			meta_title: req.body.meta_title.trim(),
			meta_desc: req.body.meta_desc.trim(),
			meta_keywords: req.body.meta_keywords.trim(),
			heading: req.body.heading.trim(),
			sub_heading: req.body.sub_heading.trim(),
			description: req.body.description.trim(),
			grow_title: req.body.grow_title.trim(),
			grow_content: req.body.grow_content.trim(),
			join_us_text: req.body.join_us_text.trim(),
			join_us_url: req.body.join_us_url.trim(),
		};

		const result = await dbo
								.collection("contactus")
								.findOneAndUpdate(
								{ oid: "1" },
								{ $set: myobj },
								{ upsert: true, returnNewDocument: true }
								);
		if (result) {
			session.message = "Data updated successfully";
			return res.redirect("/contact");
		} else {
			session.message = "Failed to update data";
			return res.redirect("/contact");
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

router.get("/contactus-content-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("contactus").findOne();
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
