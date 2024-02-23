var express = require("express");
var router = express.Router();
var multer = require("multer");
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

var MongoClient = require("mongodb").MongoClient;

var { ObjectId } = require("mongodb");


router.get("/career", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		let careerarr = await dbo.collection("career").findOne();
		let headermenu_dynamic = await dbo
						.collection("menus")
						.find({
						$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
						})
						.sort({ index: 1 })
						.toArray();
		let perksitems = await dbo
						.collection("perksSlideItem")
						.find()
						.sort({ _id: -1 })
						.toArray();
		let conativeLifeslides = await dbo
						.collection("conativeLifeslide")
						.find()
						.sort({ _id: -1 })
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
		
		const result = await dbo.collection("option").findOne({});
		if (result) {
			session.message = "";
			res.render("admin/career/career_show", {
				title: "Career",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				userlogin: userlogin,
				pagedata: careerarr,
				perksitems: perksitems,
				conativeLifeslides: conativeLifeslides,
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
  "/career-content",
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
			grow_career_title: req.body.grow_career_title.trim(),
			grow_career_heading: req.body.grow_career_heading.trim(),
			perks_benefits_heading: req.body.perks_benefits_heading.trim(),
			conative_life_heading: req.body.conative_life_heading.trim(),
			our_culture_url: req.body.our_culture_url.trim(),
			image: imagepath,
		};
		const result = await dbo
								.collection("career")
								.findOneAndUpdate(
								{ oid: "1" },
								{ $set: myobj },
								{ upsert: true, returnNewDocument: true }
								);
		if (result) {
			session.message = "Data updated successfully";
			return res.redirect("/career");
		} else {
			session.message = "Failed to update data";
			return res.redirect("/career");
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

router.post(
  "/perksSlide",
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
		if (req.body.editid != "") {
			var myobj = {
			  $set: {
				perks_item_title: req.body.perks_item_title.trim(),
				image: imagepath,
			  },
			};
	
			var res = await dbo.collection("perksSlideItem").updateOne(
				{ _id: new ObjectId(req.body.editid) },
				myobj
			);
			if(res){
				session.message = "Perks Slide item updated successfully";
				return res.redirect("/career");
			}
		} else {
			var myobj = {
			  perks_item_title: req.body.perks_item_title.trim(),
			  image: imagepath,
			};
	
			const res = await dbo.collection("perksSlideItem").insertOne(myobj);
			if(res){
				session.message = "Perks Slide item added successfully";
				return res.redirect("/career");
			}
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

router.get("/perksSlideItem_edit/:id", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var aid = req.params.id;
		const result = await dbo
								.collection("perksSlideItem")
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

router.get("/perksSlideItem-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo
								.collection("perksSlideItem")
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


router.get("/perksSlideItem-remove/:id", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("perksSlideItem").remove({ _id: new ObjectId(req.params.id) });
		if (result) {
			session.message = "Perks Slide item deleted successfully";
			res.redirect("/career");
		} else {
			session.message = "Perks Slide item deleted successfully";
			res.redirect("/career");
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
  "/conativeLifeslide",
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
			image: imagepath,
		};
		const result = await dbo.collection("conativeLifeslide").insertOne(myobj);
		if (result) {
			session.message = "Slide item added successfully";
    		return res.redirect("/career");
		} else {
			session.message = "Failed to add slide item";
    		return res.redirect("/career");
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

router.get("/career-content", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("career").findOne();
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

router.get("/perksSlideItem-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo
							.collection("perksSlideItem")
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

router.get("/conativeLifeslide-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo
								.collection("conativeLifeslide")
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

router.get("/conativeLifeslide-remove/:id", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = dbo
							.collection("conativeLifeslide")
							.remove({ _id: new ObjectId(req.params.id) });
		if (result) {
			session.message = "Item deleted successfully";
  			res.redirect("/career");
		} else {
			session.message = "Failed to delete item";
  			res.redirect("/career");
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
