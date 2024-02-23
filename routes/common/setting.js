const session = require("express-session");
var express = require("express");
var router = express.Router();
var multer = require("multer");
var jwt = require("jsonwebtoken");
var checkLogin = require("../../middleware/check");
const async = require("async");
var { upload, url, frontend_url } = require("../constants");

var MongoClient = require("mongodb").MongoClient;
var { ObjectId } = require("mongodb");


router.get("/setting", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var userlogin = {};
		var headermenu_dynamic = [];
		var setting_dynamic = [];
		userlogin = await dbo
							.collection("users")
							.findOne({ _id: new ObjectId(session.userid) });
		headermenu_dynamic = await dbo.collection("menus").find({
									$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
								}).sort({ index: 1 }).toArray();
		setting_dynamic = await dbo.collection("menus").find({
								$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
							}).sort({ index: 1 }).toArray();

		const result = await dbo.collection("option").findOne({});
		if (result) {
			session.message = "";
			res.render("admin/home/setting", {
				title: "setting",
				opt: result,
				headermenu: headermenu_dynamic,
				frontend_url: frontend_url,
				settingmenu: setting_dynamic,
				userlogin: userlogin,
				msg: session.message,
			});
		} else {
			res.send("Data Not Found Please Check Collection");
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
	"/addsetting",
	upload.fields([
		{
			name: "userPhoto",
			maxCount: 1,
		},
		{
			name: "footer_logo",
			maxCount: 1,
		},
	]),
	async function (req, res, next) {
		let client;
		try {
			const file = req.file;
			client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
			const dbo = client.db("conative");
			if (req.body.oldimage != "") {
				imagepath = req.body.oldimage;
			}

			if (file && !file.length) {
				// Do something
				imagepath = file.filename;
			}

			var imagepath = "";
			var footer_logoName = "";

			if (req.files["userPhoto"]) {
				const userPhoto = req.files["userPhoto"];
				imagepath = userPhoto[0].filename;
			} else if (req.body.oldimage != "") {
				imagepath = req.body.oldimage;
			}

			if (req.files["footer_logo"]) {
				const footer_logo = req.files["footer_logo"];
				footer_logoName = footer_logo[0].filename;
			} else {
				if (req.body.footer_logo_old != "") {
					footer_logoName = req.body.footer_logo_old;
				}
			}

			var myobj = {
				oid: "1",
				name: req.body.clientname.trim(),
				email: req.body.clientemail.trim(),
				description: req.body.description.trim(),
				address: req.body.address.trim(),
				address_1: req.body.address_1.trim(),
				address_2: req.body.address_2.trim(),
				phone: req.body.phone.trim(),
				alternatephone: req.body.alternatephone.trim(),
				alternateemail: req.body.alternateemail.trim(),
				image: imagepath,
				footer_logo: footer_logoName,
				footer: req.body.footer.trim(),
				header_analytics: req.body.header_analytics.trim(),
				footer_analytics: req.body.footer_analytics.trim(),
				query: req.body.query.trim(),
				button: req.body.button.trim(),
			};


			const result = await dbo
				.collection("option")
				.findOneAndUpdate(
					{ oid: "1" },
					{ $set: myobj },
					{ upsert: true, returnNewDocument: true }
				);
			if (result) {
				session.message = "Setting updated successfully";
				return res.redirect("/setting");
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
	}
);

router.get("/option-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("option").findOne({});
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

router.get("/social-media", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo
			.collection("socials")
			.find()
			.sort({ _id: -1 })
			.toArray();
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
