var express = require("express");
var router = express.Router();
var multer = require("multer");
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

var MongoClient = require("mongodb").MongoClient;

var { ObjectId } = require("mongodb");

router.get("/testimonials", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		let testimonialsarr = await dbo.collection("testimonialMain").findOne({});
		let testimonialsitem = await dbo
										.collection("testimonials")
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
			res.render("admin/testimonials/testimonials", {
				title: "Our Team",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				userlogin: userlogin,
				testimonialsitem: testimonialsitem,
				pagedata: testimonialsarr,
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

router.post("/testimonial-content", async function (req, res, next) {
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
								.collection("testimonialMain")
								.findOneAndUpdate(
								{ oid: "1" },
								{ $set: myobj },
								{ upsert: true, returnNewDocument: true }
								);
		if (result) {
			session.message = "Data updated successfully";
			return res.redirect("/testimonials");
		} else {
			session.message = "Failed to update data";
			return res.redirect("/testimonials");
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

router.get("/testimonial-content-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("testimonialMain").findOne();
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
  "/addtestimonial",
  upload.fields([
    {
      name: "userPhoto",
      maxCount: 1,
    },
    {
      name: "userVideo",
      maxCount: 1,
    },
    {
      name: "thumbnailPhoto",
      maxCount: 1,
    },
  ]),
  async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var userPhotoName = "";
		var userVideoName = "";

		if (req.files["userPhoto"]) {
			const userPhoto = req.files["userPhoto"];
			userPhotoName = userPhoto[0].filename;
		}

		if (req.files["userVideo"]) {
			const userVideo = req.files["userVideo"];
			userVideoName = userVideo[0].filename;
		}

		var myobj = {
			name: req.body.name.trim(),
			designation: req.body.designation.trim(),
			content: req.body.content.trim(),
			image: userPhotoName,
			video: userVideoName,
		};
		const result = dbo.collection("testimonials").insertOne(myobj);
		if (result) {
			session.message = "Testimonial item added successfully";
    		return res.redirect("/testimonials");
		} else {
			session.message = "Failed to add testimonial item";
    		return res.redirect("/testimonials");
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

router.get("/getTestimonialItem/:id", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var aid = req.params.id;
		const result = await dbo
								.collection("testimonials")
								.findOne({ _id: new ObjectId(aid) });
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

router.get("/testimonialremove/:id", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("testimonials").remove({ _id: new ObjectId(req.params.id) });
		if (result) {
			session.message = "Testimonial item deleted successfully";
			res.redirect("/testimonials");
		} else {
			session.message = "Failed to delete testimonial item";
			res.redirect("/testimonials");
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
  "/edittestimonial",
  upload.fields([
    {
      name: "userPhoto",
      maxCount: 1,
    },
    {
      name: "userVideo",
      maxCount: 1,
    },
    {
      name: "thumbnailPhoto",
      maxCount: 1,
    },
  ]),
  async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var userPhotoName = "";
      var thumbnailPhotoName = "";
      var userVideoName = "";
      var show_homepage = "";

      if (req.body.testpreimage != "") {
        userPhotoName = req.body.testpreimage;
      }

      if (req.files["userPhoto"]) {
        const userPhoto = req.files["userPhoto"];
        userPhotoName = userPhoto[0].filename;
      }

      if (req.body.thumbpreimage != "") {
        thumbnailPhotoName = req.body.thumbpreimage;
      }

      if (req.files["thumbnailPhoto"]) {
        const thumbnailPhoto = req.files["thumbnailPhoto"];
        thumbnailPhotoName = thumbnailPhoto[0].filename;
      }

      if (req.body.testprevideo != "") {
        userVideoName = req.body.testprevideo;
      }

      if (req.files["userVideo"]) {
        const userVideo = req.files["userVideo"];
        userVideoName = userVideo[0].filename;
      }

      if (req.body.show_homepage != null) {
        show_homepage = "true";
      } else {
        show_homepage = "false";
      }

      var myobj = {
        $set: {
          name: req.body.testimonial_name.trim(),
          designation: req.body.designation.trim(),
          content: req.body.testimonial_content.trim(),
          show_homepage: show_homepage,
          image: userPhotoName,
          thumbImage: thumbnailPhotoName,
          video: userVideoName,
        },
      };
		const result = await dbo.collection("testimonials").updateOne(
							{ _id: new ObjectId(req.body.testimonialEditid) },
							myobj,
						);
		if (result) {
			session.message = "Testimonial item updated successfully";
			res.redirect("/testimonials");
		} else {
			session.message = "Failed to edit testimonial";
			res.redirect("/testimonials");
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

router.get("/testimonial-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo
								.collection("testimonials")
								.find()
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
