var express = require("express");
var router = express.Router();
var multer = require("multer");
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

var MongoClient = require("mongodb").MongoClient;

var { ObjectId } = require("mongodb");


router.get("/lifeatconative", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		let teamsarr = await dbo.collection("lifeatconative").findOne({});
		let teamsitem = await dbo
					.collection("lifeItem")
					.find()
					.sort({ _id: -1 })
					.toArray();
		let userlogin = await dbo
					.collection("users")
					.findOne({ _id: new ObjectId(session.userid) });
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
			res.render("admin/aboutus/lifeatconative", {
				title: "Life at conative",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				userlogin: userlogin,
				teamsitem: teamsitem,
				pagedata: teamsarr,
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

router.post("/life-content", async function (req, res, next) {
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
			description: req.body.description.trim(),
		  };
		const result = await dbo
		.collection("lifeatconative")
		.findOneAndUpdate(
		  { oid: "1" },
		  { $set: myobj },
		  { upsert: true, returnNewDocument: true }
		);
		if (result) {
			session.message = "Data updated successfully";
			return res.redirect("/lifeatconative");
		} else {
			session.message = "Failed to update data";
			return res.redirect("/lifeatconative");
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

router.get("/life-content-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("lifeatconative").findOne({});
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
  "/lifeItem",
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
		  name: req.body.name.trim(),
		  description: req.body.description.trim(),
		  image: imagepath,
		};
		const result = await dbo.collection("lifeItem").insertOne(myobj);

		if (result) {
			session.message = "Life item added successfully";
    		return res.redirect("/lifeatconative");
		} else {
			session.message = "Failed to add life item";
    		return res.redirect("/lifeatconative");
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


router.get("/lifeItemremove/:id", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("lifeItem").remove({ _id: new ObjectId(req.params.id) });
		if (result) {
			session.message = "Team item deleted successfully";
  			res.redirect("/lifeatconative");
		} else {
			session.message = "Failed to delete team item";
  			res.redirect("/lifeatconative");
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


router.get("/getLifeitem/:id", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var aid = req.params.id;
		const result = await dbo
								.collection("lifeItem")
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
  "/lifeItemedit",
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
			$set: {
			name: req.body.name.trim(),
			description: req.body.description.trim(),
			image: imagepath,
			},
		};
		const result = await dbo.collection("lifeItem").updateOne(
			{ _id: new ObjectId(req.body.editid) },
			myobj
		  );
		if (result) {
			session.message = "Life item updated successfully";
			res.redirect("/lifeatconative");
		} else {
			session.message = "Failed to update life item";
			res.redirect("/lifeatconative");
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

router.get("/lifeitem-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo
								.collection("lifeItem")
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
