var express = require("express");
var router = express.Router();
var multer = require("multer");
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

var MongoClient = require("mongodb").MongoClient;

var { ObjectId } = require("mongodb");

router.get("/teams", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		let teamsarr = await dbo.collection("ourteams").findOne();
		let teamsitem = await dbo
						.collection("teamItem")
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
			res.render("admin/team/team", {
				title: "Our Team",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				userlogin: userlogin,
				teamsitem: teamsitem,
				pagedata: teamsarr,
				frontend_url: frontend_url,
				opt: result,
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
  "/team-content",
  upload.fields([
    {
      name: "mainPhoto",
      maxCount: 1,
    },
    {
      name: "wantPhoto",
      maxCount: 1,
    },
  ]),
  async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var mainPhotoName = "";
      var wantPhotoName = "";

      if (req.files["mainPhoto"]) {
        const mainPhoto = req.files["mainPhoto"];
        mainPhotoName = mainPhoto[0].filename;
      }
      else if (req.body.mainOldImage != "") {
        mainPhotoName = req.body.mainOldImage;
      }

      if (req.files["wantPhoto"]) {
        const wantPhoto = req.files["wantPhoto"];
        wantPhotoName = wantPhoto[0].filename;
      }
      else if (req.body.wantOldImage != "") {
        wantPhotoName = req.body.wantOldImage;
      }

      var myobj = {
        oid: "1",
        meta_title: req.body.meta_title.trim(),
        meta_desc: req.body.meta_desc.trim(),
        meta_keywords: req.body.meta_keywords.trim(),
        heading: req.body.heading.trim(),
        description: req.body.description.trim(),
        mainimage: mainPhotoName,
        wantimage: wantPhotoName,
        believe_title: req.body.believe_title.trim(),
        believe_heading: req.body.believe_heading.trim(),
        part_title: req.body.part_title.trim(),
        part_heading: req.body.part_heading.trim(),
        start_title: req.body.start_title.trim(),
        start_heading: req.body.start_heading.trim(),
        upload_resume_url: req.body.upload_resume_url.trim(),
        fill_form_url: req.body.fill_form_url.trim(),
        linkedin_url: req.body.linkedin_url.trim(),
      };
		const result = await dbo
							.collection("ourteams")
							.findOneAndUpdate(
							{ oid: "1" },
							{ $set: myobj },
							{ upsert: true, returnNewDocument: true }
							);
		if (result) {
			session.message = "Data updated successfully";
			return res.redirect("/teams");
		} else {
			session.message = "Failed to update data";
			return res.redirect("/teams");
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

router.get("/team-content-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("ourteams").findOne({});
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
  "/teamItem",
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
		const result = await dbo.collection("teamItem").insertOne(myobj);
		if (result) {
			session.message = "Team item added successfully";
    		return res.redirect("/teams");
		} else {
			session.message = "Failed to add team item";
    		return res.redirect("/teams");
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

router.get("/teamItemremove/:id", async function (req, res, next) {

	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("teamItem").remove({ _id: new ObjectId(req.params.id) });
		if (result) {
			session.message = "Team item deleted successfully";
  			res.redirect("/teams");
		} else {
			session.message = "Failed to delete team item";
  			res.redirect("/teams");
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

router.get("/getTeamitem/:id", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var aid = req.params.id;

		const result = await dbo
								.collection("teamItem")
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
  "/teamItemedit",
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
		const result = await dbo.collection("teamItem").updateOne(
								{ _id: new ObjectId(req.body.editid) },
								myobj
							);
		if (result) {
			session.message = "Team item updated successfully";
			res.redirect("/teams");
		} else {
			session.message = "Failed to update team item";
			res.redirect("/teams");
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

router.get("/teamitem-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo
								.collection("teamItem")
								.find()
								.sort({ _id: -1 })
								.toArray();
		if (result) {
			res.status(200).json(result);
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
