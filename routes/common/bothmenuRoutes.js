var express = require("express");
var router = express.Router();
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url } = require("../constants");

const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

router.get("/frontend-menu", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		let menus = await dbo
							.collection("menus")
							.find({ displaymenu: "f" })
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
		const result = await dbo.collection("option").findOne();
		if (result) {
			session.message = "";
			res.render("admin/menu/frontend-menu", {
				title: "Frontend Menu",
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

router.post("/frontend-menu", checkLogin, async function (req, res, next) {
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
			displaymenu: "f",
			parent_id: req.body.parentmenu.trim(),
		};
		const result = await dbo.collection("menus").insertOne(myobj, function (err, res) {
			if (err) throw err;
			console.log("1 document menu inserted");
			
		  });
		if (result) {
			session.message = "Menu Added Successfully";
			return res.redirect("/frontend-menu");
		} else {
			session.message = "Failed to add menu";
			return res.redirect("/frontend-menu");
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

router.get("/bothmenuremove/:id", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("menus").remove({ _id: new ObjectId(req.params.id) });
		if (result) {
			session.message = "Menu deleted successfully";
  			return res.redirect("/" + req.originalUrl);
		} else {
			session.message = "Failed to delete menu";
  			return res.redirect("/" + req.originalUrl);
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

router.get("/backend-menu", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		let menu = await dbo
							.collection("menus")
							.find({ displaymenu: "b" })
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
			
		const result = await dbo.collection("option").findOne();
		if (result) {
			session.message = "";
			res.render("admin/menu/backend-menu", {
				title: "Backend Menu",
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

router.post("/backend-menu", checkLogin, async function (req, res, next) {
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
			displaymenu: "b",
			parent_id: req.body.parentmenu.trim(),
		  };
		const result = await dbo.collection("menus").insertOne(myobj);
		if (result) {
			session.message = "Menu Added Successfully";
			return res.redirect("/backend-menu");

		} else {
			session.message = "Failed to add menu";
			return res.redirect("/backend-menu");
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
  await MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("conative");

    

    
  });

  
});

module.exports = router;
