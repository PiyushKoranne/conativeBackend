var express = require("express");
var router = express.Router();
var multer = require("multer");
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

var MongoClient = require("mongodb").MongoClient;

var { ObjectId } = require("mongodb");

// router.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept,Authorization"
//   );
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,PUT,PATCH,POST,DELETE,OPTIONS"
//   );
//   next();
// });

router.get("/graphic-design", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		let graghicDesignarr = await dbo.collection("graphicDesign").findOne();
		let graphicsDesignPosts = await dbo
						.collection("graphicsDesignPost")
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
			res.render("admin/post-types/graphicsDesign", {
				title: "Graphic Design Post",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				pagedata: graghicDesignarr,
				userlogin: userlogin,
				graphicsDesignPosts: graphicsDesignPosts,
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

router.post("/graphic-design-content", async function (req, res, next) {
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
		};

		const result = await dbo
								.collection("graphicDesign")
								.findOneAndUpdate(
								{ oid: "1" },
								{ $set: myobj },
								{ upsert: true, returnNewDocument: true }
								);
		if (result) {
			session.message = "Data updated successfully";
			return res.redirect("/graphic-design");
		} else {
			session.message = "Failed to update data";
			return res.redirect("/graphic-design");
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
  "/designs-post",
  upload.array("design_image", 30),
  async function (req, res, next) {
	let client;
	try {
		console.log("TRYING... ")
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const date = new Date();

		var month = date.getMonth() + 1;
		let year = date.getFullYear();

		const uniqueSuffix = year + "-" + month + "_";

		const files = req.files;
		console.log("UPLOADING FILES", files)
		const uploaded_images = req.body?.uploaded_images;

		var file_names = [];

		if (req.body.editid != "" && uploaded_images) {
			for (var item of uploaded_images) {
				file_names.push(item);
			}
		}

		for (var item of files) {
			file_names.push(item.filename);
		}
		console.log("FILE NAMES", file_names);
		// console.log(file_names);
		if (req.body.editid != "") {
			var myobj = {
			  $set: {
				meta_title: req.body.post_meta_title.trim(),
				meta_desc: req.body.post_meta_desc.trim(),
				meta_keywords: req.body.post_meta_keywords.trim(),
				title: req.body.title.trim(),
				post_content: req.body.post_content.trim(),
				slug: req.body.slug.trim(),
				design_type: req.body.design_type,
				images: file_names,
			  },
			};
	
			let result = await dbo.collection("graphicsDesignPost").updateOne(
			  { _id: new ObjectId(req.body.editid) },
			  myobj
			);
			console.log("Updated the database,", result);
			if (result) {
				session.message = "graphicsDesignPost updated successfully";
				return res.redirect("/graphic-design");
			} else {
				session.message = "failed to update graphicsDesignPost";
				return res.redirect("/graphic-design");
			}
		} else if (req.body.editid == "") {
			var myobj = {
			  meta_title: req.body.post_meta_title.trim(),
			  meta_desc: req.body.post_meta_desc.trim(),
			  meta_keywords: req.body.post_meta_keywords.trim(),
			  title: req.body.title.trim(),
			  post_content: req.body.post_content.trim(),
			  slug: req.body.slug.trim(),
			  design_type: req.body.design_type,
			  images: file_names,
			};
	
			let result = await dbo
			  .collection("graphicsDesignPost")
			  .insertOne(myobj);
			if (result) {
				session.message = "graphicsDesignPost added successfully";
				return res.redirect("/graphic-design");
			} else {
				session.message = "Failed to add graphicsDesignPost";
				return res.redirect("/graphic-design");
			}
			
		}
	} catch (error) {
		console.log("OPTION SHOW ROUTE ERROR\n")
		console.log(error);
		res.status(500).json({ message: "Some error occurred", error: error?.message })
	} finally {
		// Close the database connection in the finally block
		if (client) {
			console.log("closing the client")
			client.close();
		}
	}
  }
);

router.get("/graphicsDesignPost-remove/:id", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		let result = await dbo
						.collection("graphicsDesignPost")
						.remove({ _id: new ObjectId(req.params.id) });
		if (result) {
			session.message = "graphicsDesignPost deleted successfully";
  			res.redirect("/graphic-design");
		} else {
			session.message = "graphicsDesignPost deleted successfully";
  			res.redirect("/graphic-design");
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

router.get("/getGraphicDesignPost/:id", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var aid = req.params.id;

		const result = await dbo
								.collection("graphicsDesignPost")
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

router.get("/graphicsDesignPost-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		
		const result = await dbo
								.collection("graphicsDesignPost")
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

router.get("/graphicsDesignPost-single/:slug", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		if (!req.params.slug) {
			res.status(404).json({ err: "slug not found" });
			process.exit(1);
		}
	
		const result = await dbo
								.collection("graphicsDesignPost")
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
		if (client) {
			client.close();
		}
	}
});

router.get("/graphic-design-content-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		
		const result = await dbo.collection("graphicDesign").findOne({});
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
