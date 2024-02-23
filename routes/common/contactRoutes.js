var express = require("express");
var router = express.Router();
var multer = require("multer");
// var nodemailer = require('nodemailer');
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url } = require("../constants");

var MongoClient = require("mongodb").MongoClient;
var { ObjectId } = require("mongodb");

router.get("/contact", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		let option = await dbo.collection("option").findOne();
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

		const result = await dbo
			.collection("contacts")
			.find()
			.sort({ _id: -1 })
			.toArray();
		if (result) {
			session.message = "";
			res.render("admin/contact/contact", {
				title: "Contact",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				allcontactform: result,
				opt: option,
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
		}
	}
});

router.post("/contact", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var hell = [];
		arr = req.body.description.split(",");

		for (var i = 0; arr.length - 1 >= i; i++) {
			var d = arr[i].split(":");
			var k = d[0];
			var v = d[1];

			var input = {
				type: k,
				name: v,
			};
			hell.push(input);
		}

		var myobj = {
			formname: req.body.clientname.trim(),
			title: req.body.title.trim(),
			form: hell,
		};
		await dbo.collection("contacts").insertOne(myobj);
		// let contactform = await dbo.collection("contacts").findOne();
		let allcontactform = await dbo
			.collection("contacts")
			.find()
			.sort({ _id: -1 })
			.toArray();
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
		let result = await dbo.collection("option").findOne({});
		if (result) {
			session.message = "";
			res.render("admin/contact/contact", {
				title: "Contact",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				allcontactform: allcontactform,
				opt: result,
				// pagedata: showdata,
				msg: "Contact form added successfully",
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

router.get("/contact-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo
			.collection("contacts")
			.findOne({ _id: new ObjectId("619e31a3d387bd16d03e874c") });
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

router.post("/createContact", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var myobj = JSON.parse(req.body.body);
		const result = await dbo.collection("contactsPerson").insertOne(myobj);
		if (result) {
			res.status(200).send("document contactsPerson inserted")
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
