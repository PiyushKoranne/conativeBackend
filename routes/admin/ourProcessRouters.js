var express = require("express");
var router = express.Router();
var multer = require("multer");
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

const MongoClient = require("mongodb").MongoClient;

const { ObjectId } = require("mongodb");

router.get("/process", checkLogin, async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    const userlogin = await dbo
    .collection("users")
    .findOne({ _id: new ObjectId(session.userid) });

  const option = await dbo.collection("option").findOne();

  const expertiseitem = await dbo
    .collection("processplan")
    .find()
    .sort({ _id: -1 })
    .toArray(function (err, result2) {
      expertiseitem = result2;
    });

  const headermenu_dynamic = await dbo
    .collection("menus")
    .find({
      $and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
    })
    .sort({ index: 1 })
    .toArray();

  const setting_dynamic = await dbo
    .collection("menus")
    .find({
      $and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
    })
    .sort({ index: 1 })
    .toArray();
		const result = await dbo.collection("process").findOne();

		if (result) {
			session.message = "";
			res.render("admin/home/oProcess_show", {
				title: "Our Process",
				opt: option,
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				frontend_url: frontend_url,
				pagedata: result,
				expertiseitem: expertiseitem,
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

router.post("/process", checkLogin, async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    await dbo.collection("process").deleteMany();

    var myobj = {
      title: req.body.title.trim(),
      name: req.body.name.trim(),
      description: req.body.description.trim(),
    };

    
		const result = await dbo.collection("process").insertOne(myobj);
		if (result) {
      session.message = "Our process inserted successfully";
      return res.redirect("/process");
		} else {
			session.message = "Our process failed to insert";
      return res.redirect("/process");
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

router.post( "/processplan", upload.single("userPhoto"), async function (req, res, next) {

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
      image: imagepath,
    };
		const result = await dbo.collection("processplan").insertOne(myobj);
		if (result) {
      session.message = "Our process plan inserted successfully";
      res.redirect("/process");
		} else {
      session.message = "Our process plan failed to  insert";
      res.redirect("/process");
		}

	} catch (error) {
		console.log("OPTION SHOW ROUTE ERROR\n")
		console.log(error);
		res.status(500).json({ message: "Some error occurred", error: error?.message })
	} finally {
		// Close the database connection in the finally block
		if (client) {
			client.close();
		}}
  });

router.get("/processplanremove/:id", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("processplan").remove({ _id: new ObjectId(req.params.id) });
		if (result) {
		  session.message = "Our process plan deleted successfully";
  res.redirect("/process");
		} else {
		  session.message = "Our process wasnt plan deleted successfully";
  res.redirect("/process");
		}

	} catch (error) {
		console.log("OPTION SHOW ROUTE ERROR\n")
		console.log(error);
		res.status(500).json({ message: "Some error occurred", error: error?.message })
	} finally {
		// Close the database connection in the finally block
		if (client) {
			client.close();
		}}
});

router.get("/process-show", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("process").findOne();

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
		}}
});

router.get("/processplan-show", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("processplan").find().toArray();

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

router.get("/getprocessplan/:id",async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    var aid = req.params.id;

		const result = await dbo.collection("processplan").findOne({ _id: new ObjectId(aid) });
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

router.post("/processplanedit",upload.single("userPhoto"),async function (req, res, next) {
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
        image: imagepath,
      },
    };
    const result = await dbo.collection("processplan").updateOne( { _id: new ObjectId(req.body.editid) }, myobj)

		if (result) {
      session.message = "Our process plan updated successfully";
      res.redirect("/process");
		} else {
      session.message = "Our process plan wasnt updated successfully";
      res.redirect("/process");
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
