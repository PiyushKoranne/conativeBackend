var express = require("express");
var router = express.Router();
var multer = require("multer");
const session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

const MongoClient = require("mongodb").MongoClient;

const { ObjectId } = require("mongodb");

router.get("/clientproject", checkLogin, async function (req, res, next) {

	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");

		const userlogin = await dbo.collection("users").findOne({ _id: new ObjectId(session.userid) });
		const option = await dbo.collection("option").findOne()
		const expertiseitem = await dbo.collection("tbclientinfo").find().sort({ _id: -1 }).toArray();
		const testimonials = await dbo.collection("testimonials").find().sort({ _id: -1 }).toArray();
		const headermenu_dynamic = await dbo.collection("menus")
			.find({
				$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
			}).sort({ index: 1 }).toArray();
		const setting_dynamic = dbo.collection("menus")
			.find({
				$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
			})
			.sort({ index: 1 }).toArray();
		const result = await dbo.collection("tbclientproject").findOne();

		if (result) {
			session.message = "";
			res.render("admin/home/ocProject_show", {
				title: "Client Project",
				opt: option,
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				pagedata: result,
				frontend_url: frontend_url,
				expertiseitem: expertiseitem,
				testimonials: testimonials,
				userlogin: userlogin,
				msg: session.message,
			})
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


router.get("/clientform", checkLogin, async function (req, res, next) {

	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const expertise = await dbo.collection("tbclientproject").find().toArray();
		const headermenu_dynamic = await dbo.collection("menus")
			.find({
				$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
			}).sort({ index: 1 }).toArray();

		const setting_dynamic = await dbo.collection("menus")
			.find({
				$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
			}).sort({ index: 1 }).toArray();

		const result = await dbo.collection("option").findOne();

		if (result) {
			res.render("admin/home/ocProject", {
				title: "Client Project",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				opt: result,
				pagedata: expertise,
				msg: "",
			})
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

router.post("/clientproject", checkLogin, async function (req, res, next) {

	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var myobj = {
			oid: "1",
			title: req.body.title.trim(),
			name: req.body.name.trim(),
			description: req.body.description.trim(),
		};

		const result = await dbo.collection("tbclientproject").findOneAndUpdate(
			{ oid: "1" },
			{ $set: myobj },
			{ upsert: true, returnNewDocument: true }
		);

		if (result) {
			session.message = "Data updated successfully";
			return res.redirect("/clientProject");

		} else {
			session.message = "Data updated successfully";
			return res.redirect("/clientProject");

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

router.get("/clientprojectform", async function (req, res, next) {

	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const headermenu_dynamic = await dbo.collection("menus")
			.find({
				$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
			}).sort({ index: 1 }).toArray();

		const setting_dynamic = await dbo.collection("menus")
			.find({
				$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
			}).sort({ index: 1 }).toArray();


		const result = await dbo.collection("option").findOne();

		if (result) {
			res.render("admin/home/ocProject_item", {
				title: "Client Project Item",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				opt: result,
				updatearr: [],
				msg: "",
			})
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

router.post("/clientprojectitem", upload.single("userPhoto"), async function (req, res, next) {

	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");


		const file = req.file;
		var imagepath = "";
		if (req.body.oldimage != "") {
			imagepath = req.body.oldimage.trim();
		}
		if (file && !file.length) {
			imagepath = file.filename.trim();
		}

		var myobj = {
			name: req.body.name.trim(),
			num: req.body.num.trim(),
			num_suffix: req.body.num_suffix.trim(),
			image: imagepath,
		};

		const result = await dbo.collection("tbclientinfo").insertOne(myobj);

		if (result) {
			session.message = "Our client project item inserted successfully";
			return res.redirect("/clientProject");
		} else {
			session.message = "Our client project item wasn't inserted";
			return res.redirect("/clientProject");
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

router.get("/clientprojectedit/:id", async function (req, res, next) {

	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var aid = req.params.id;
		const updatearr = await dbo.collection("tbclientinfo").findOne({ _id: new ObjectId(aid) });
		const headermenu_dynamic = await dbo.collection("menus")
			.find({
				$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
			}).sort({ index: 1 }).toArray();
		const setting_dynamic = await dbo.collection("menus")
			.find({
				$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
			}).sort({ index: 1 }).toArray();

		const result = await dbo.collection("option").findOne();

		if (result) {
			res.render("admin/home/ocProject_item", {
				title: "Client Project Item",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				updatearr: updatearr,
				opt: result,
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

router.post("/clientprojectupdate/:id", upload.single("userPhoto"), async function (req, res, next) {

	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const file = req.file;
		var imagepath = "";
		if (req.body.oldimage != "") {
			imagepath = req.body.oldimage.trim();
		}
		if (file && !file.length) {
			imagepath = file.filename.trim();
		}

		var myobj = {
			$set: {
				name: req.body.name.trim(),
				num: req.body.num.trim(),
				image: imagepath,
			},
		};

		const result = await dbo.collection("tbclientinfo").updateOne({ _id: new ObjectId(req.params.id) }, myobj);

		if (result) {
			session.message = "Our client project item updated successfully";
			res.redirect("/clientProject");
		} else {
			session.message = "Our client project item wasn't updated";
			res.redirect("/clientProject");
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

router.get("/clientprojectremove/:id", async function (req, res, next) {

	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("tbclientinfo").remove({ _id: new ObjectId(req.params.id) });

		if (result) {
			session.message = "Our client project deleted successfully";
			res.redirect("/clientProject");
		} else {
			session.message = "Our client project wasnt deleted ";
			res.redirect("/clientProject");
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

router.get("/csliderform", async function (req, res, next) {

	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const headermenu_dynamic = await dbo.collection("menus")
			.find({
				$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
			}).sort({ index: 1 }).toArray();
		const setting_dynamic = await dbo.collection("menus")
			.find({
				$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
			}).sort({ index: 1 }).toArray();

		const result = await dbo.collection("option").findOne();

		if (result) {
			res.render("admin/home/ocsliderform", {
				title: "Client Slider",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				opt: result,
				updatearr: [],
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

router.post("/addslideritem", upload.single("clientPhoto"), async function (req, res, next) {

	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const file = req.file;
		var imagepath = "";
		if (req.body.oldimage != "") {
			imagepath = req.body.oldimage.trim();
		}
		if (file && !file.length) {
			imagepath = file.filename.trim();
		}

		var myobj = {
			name: req.body.name.trim(),
			author: req.body.author.trim(),
			videourl: req.body.videourl.trim(),
			description: req.body.description.trim(),
			image: imagepath,
		};
		const result = await dbo.collection("tbclientslider").insertOne(myobj);

		if (result) {
			session.message = "Our client slider inserted successfully";
			res.redirect("/clientProject");
		} else {
			session.message = "Our client slider wasn't inserted";
			res.redirect("/clientProject");
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

router.get("/cp-show", async function (req, res, next) {

	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("tbclientproject").findOne();

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

router.get("/cpi-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("tbclientinfo").find().toArray();
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

router.get("/cps-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("tbclientslider").find().toArray();

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

// one page insert and update for =====================

router.get("/getclientprojectitem/:id", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var aid = req.params.id;

		const result = await dbo.collection("tbclientinfo").findOne({ _id: new ObjectId(aid) });
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

router.post("/clientprojecteditajax", upload.single("userPhoto"), async function (req, res, next) {

	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const file = req.file;
		var imagepath = "";
		if (req.body.oldimage != "") {
			imagepath = req.body.oldimage.trim();
		}
		if (file && !file.length) {
			imagepath = file.filename.trim();
		}

		var myobj = {
			$set: {
				name: req.body.name.trim(),
				num: req.body.num.trim(),
				num_suffix: req.body.num_suffix.trim(),
				image: imagepath,
			},
		};
		const result = await dbo.collection("tbclientinfo").updateOne({ _id: new ObjectId(req.body.editid) }, myobj);


		if (result) {
			session.message = "Our client project item updated successfully";
			res.redirect("/clientProject");
		} else {
			session.message = "Our client project item wasn't updated ";
			res.redirect("/clientProject");
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

router.get("/cp-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("tbclientproject").findOne();

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

router.get("/cpi-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("tbclientinfo").find().toArray();
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

router.get("/cps-show", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("tbclientslider").find().toArray();

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
