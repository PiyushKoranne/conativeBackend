var express = require("express");
var router = express.Router();
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url } = require("../constants");

const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

router.get("/menu", checkLogin, async function (req, res, _next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");

		let menus = await dbo
			.collection("menus")
			.find()
			.sort({ _id: -1 })
			.toArray();
		let headermenu_dynamic = await dbo
			.collection("menus")
			.find({
				$and: [
					{ $or: [{ displaymenu: "b" }, { displaymenu: "fb" }] },
					{ $or: [{ parent_id: "1" }] },
				],
			})
			.sort({ index: 1 })
			.toArray();
		let setting_dynamic = await dbo
			.collection("menus")
			.find({
				$and: [
					{ $or: [{ displaymenu: "b" }, { displaymenu: "fb" }] },
					{ $or: [{ parent_id: "2" }] },
				],
			})
			.sort({ index: 1 })
			.toArray();

		const result = await dbo.collection("option").findOne();
		if (result) {
			session.message = "";
			res.render("admin/home/menu", {
				title: "Menu",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				opt: result,
				pagedata: menus,
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

router.post("/menu", checkLogin, async function (req, res, _next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var myobj = {
			title: req.body.title.trim(),
			urlslug: req.body.urlslug.trim(),
			url: req.body.menurl.trim(),
			description: req.body.description.trim(),
			index: req.body.index.trim(),
			displaymenu: req.body.displaymenu.trim(),
			parent_id: req.body.parentmenu.trim(),
		};
		const result = await dbo.collection("menus").insertOne(myobj);
		if (result) {
			session.message = "Menu Added Successfully";
			return res.redirect("/menu");
		} else {
			session.message = "Failed to add menu";
			return res.redirect("/menu");
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

router.get("/menuupdate/:id", checkLogin, async function (req, res, _next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var aid = req.params.id;

		let updatearr = await dbo
			.collection("menus")
			.findOne({ _id: new ObjectId(aid) });
		let headermenu_dynamic = await dbo
			.collection("menus")
			.find({
				$and: [
					{ $or: [{ displaymenu: "b" }, { displaymenu: "fb" }] },
					{ $or: [{ parent_id: "1" }] },
				],
			})
			.sort({ index: 1 })
			.toArray();
		let setting_dynamic = await dbo
			.collection("menus")
			.find({
				$and: [
					{ $or: [{ displaymenu: "b" }, { displaymenu: "fb" }] },
					{ $or: [{ parent_id: "2" }] },
				],
			})
			.sort({ index: 1 })
			.toArray();

		const result = await dbo.collection("option").findOne({});
		if (result) {
			res.render("admin/home/menuupdate", {
				title: "Menu Edit",
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

router.post("/menu/:id", checkLogin, async function (req, res, _next) {
	let client;
	try {
		var person = req.body;
		const file = req.file;
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var myobj = {
			$set: {
				title: req.body.title.trim(),
				urlslug: req.body.urlslug.trim(),
				url: req.body.menurl.trim(),
				description: req.body.description.trim(),
				index: req.body.index.trim(),
				displaymenu: req.body.displaymenu.trim(),
				parent_id: req.body.parentmenu.trim(),
			},
		};
		const result = await dbo.collection("menus").updateOne(
			{ _id: new ObjectId(req.params.id) },
			myobj
		);
		if (result) {
			session.message = "Menu updateded successfully";
			return res.redirect("/menu");
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

router.get("/menuremove/:id", checkLogin, async function (req, res, _next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("menus").remove({ _id: new ObjectId(req.params.id) });

		if (result) {
			session.message = "Menu deleted successfully";
			return res.redirect("/menu");
		} else {
			session.message = "Failed to delete menu";
			return res.redirect("/menu");
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

router.get("/show-front-menu", async function (req, res, _next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo
								.collection("menus")
								.find({ $or: [{ displaymenu: "f" }, { displaymenu: "fb" }] })
								.sort({ index: 1 })
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

router.get("/show-backend-menu", checkLogin, async function (req, res, _next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo
								.collection("menus")
								.find({ $or: [{ displaymenu: "b" }, { displaymenu: "fb" }] })
								.sort({ index: 1 })
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
