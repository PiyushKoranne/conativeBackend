var express = require("express");
var router = express.Router();
var multer = require("multer");
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

router.get("/social", checkLogin, async function (req, res, next) {
	let client;
	try {
		let userlogin = [];
		let option = [];
		let headermenu_dynamic = [];
		let setting_dynamic = [];

		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		userlogin = await dbo
			.collection("users")
			.findOne({ _id: new ObjectId(session.userid) });

		option = await dbo.collection("option").findOne({});

		headermenu_dynamic = await dbo
									.collection("menus")
									.find({
										$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
									})
									.sort({ index: 1 })
									.toArray();

		setting_dynamic = await dbo
								.collection("menus")
								.find({
									$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
								})
								.sort({ index: 1 })
								.toArray();
		const result = await dbo
								.collection("socials")
								.find()
								.sort({ _id: -1 })
								.toArray();
		if (result) {
			session.message = "";
			res.render("admin/home/socialmedia", {
				title: "Social",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				opt: option,
				frontend_url: frontend_url,
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
		}
	}
	
});

router.post(
	"/social",
	checkLogin,
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
				title: req.body.title.trim(),
				socialurl: req.body.socialurl.trim(),
				description: req.body.description.trim(),
				image: imagepath,
			};


			const result = await dbo.collection("socials").insertOne(myobj, function (err, res) {
				if (err) throw err;
				
			});
			if (result) {
				console.log("Document social inserted");
				session.message = "Social media inserted successfully";
				return res.redirect("/social");
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
	}
);

router.get("/social/:id", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		let aid = req.params.id;
		var updatearr = [];
		var headermenu_dynamic = [];
		var setting_dynamic = [];

		updatearr = await dbo
							.collection("socials")
							.findOne({ _id: new ObjectId(aid) });

		headermenu_dynamic = await dbo
									.collection("menus")
									.find({
										$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
									})
									.sort({ index: 1 })
									.toArray();
		setting_dynamic = await dbo
									.collection("menus")
									.find({
										$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
									})
									.sort({ index: 1 })
									.toArray();
		
		const result = await dbo.collection("option").findOne();
		if (result) {
			res.render("admin/home/socialupdate", {
				title: "Social Edit",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				opt: result,
				updatearr: updatearr,
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

router.get("/socialremove/:id", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("socials").remove({ _id: new ObjectId(req.params.id) });
		if (result) {
			res.status(200).json(result);
			session.message = "Social media deleted successfully";
			return res.redirect("/social");
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

router.get("/getsocialitem/:id", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var aid = req.params.id;
		const result = await dbo
							.collection("socials")
							.findOne({ _id: new ObjectId(aid) });
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

router.post(
	"/socialedit",
	checkLogin,
	upload.single("userPhoto"),
	async function (req, res, next) {
		let client;
		try {
			var person = req.body;
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
				$set: {
					title: req.body.title.trim(),
					socialurl: req.body.socialurl.trim(),
					description: req.body.description.trim(),
					image: imagepath,
				},
			};
			const result = await dbo.collection("socials").updateOne({ _id: new ObjectId(req.body.editid) },myobj);
			if (result) {
				session.message = "Social media updated successfully";
				return res.redirect("/social");
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

module.exports = router;
