var express = require("express");
var router = express.Router();
var multer = require("multer");
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

var MongoClient = require("mongodb").MongoClient;

var { ObjectId } = require("mongodb");


router.get("/careers", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		let careersposts = await dbo
						.collection("careerspost")
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
		const result = await dbo.collection("option").findOne({});
		if (result) {
			session.message = "";
			res.render("admin/post-types/careerspost", {
				title: "Career Post",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				userlogin: userlogin,
				careersposts: careersposts,
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
  "/career-post",
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
				meta_title: req.body.meta_title.trim(),
				meta_desc: req.body.meta_desc.trim(),
				meta_keywords: req.body.meta_keywords.trim(),
				title: req.body.title.trim(),
				description: req.body.description.trim(),
				content: req.body.content.trim(),
				slug: req.body.slug,
				image: imagepath,
			  },
			};
	
			let result = await dbo.collection("careerspost").updateOne(
				{ _id: new ObjectId(req.body.editid) },
				myobj
			  );
			if(result) {
				session.message = "careerspost updated successfully";
				return res.redirect("/careers");
			} else {
				session.message = "careerspost failed to update";
				return res.redirect("/careers");
			}
	
		} else {
			var myobj = {
			  meta_title: req.body.meta_title.trim(),
			  meta_desc: req.body.meta_desc.trim(),
			  meta_keywords: req.body.meta_keywords.trim(),
			  title: req.body.title.trim(),
			  description: req.body.description.trim(),
			  content: req.body.content.trim(),
			  slug: req.body.slug,
			  image: imagepath,
			};
	
			let result = await dbo.collection("careerspost").insertOne(myobj);
			if(result){
				session.message = "careerspost added successfully";
				return res.redirect("/careers");
			} else {
				session.message = "failed to add careerspost";
				return res.redirect("/careers");
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

router.get("/getCareerPost/:id", async function (req, res, next) {

	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var aid = req.params.id;
		const result = await dbo
								.collection("careerspost")
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

router.get("/careerpost-remove/:id", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("careerspost").remove({ _id: new ObjectId(req.params.id) });
		if (result) {
			session.message = "careerspost deleted successfully";
  			res.redirect("/careers");
		} else {
			session.message = "failed to delete careerspost";
  			res.redirect("/careers");
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

router.get("/careerpost-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		
		const result = await dbo
								.collection("careerspost")
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

router.get("/careerpost-single/:slug", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		if (!req.params.slug) {
			res.status(404).json({ err: "slug not found" });
			process.exit(1);
		}
		const result = await dbo
								.collection("careerspost")
								.findOne({ slug: req.params.slug });
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
