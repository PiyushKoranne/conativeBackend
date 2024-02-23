var express = require("express");
var router = express.Router();
var multer = require("multer");
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

const MongoClient = require("mongodb").MongoClient;

const { ObjectId } = require("mongodb");

router.get("/projects", checkLogin, async function (_req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    const userlogin = await dbo.collection("users").findOne({ _id: new ObjectId(session.userid) });

    const option = await dbo.collection("option").findOne();

    const expertiseitem = await dbo.collection("ourprojectsitem").find().sort({ _id: -1 }).toArray();

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

		const result = await dbo.collection("ourprojects").findOne();

		if (result) {
      session.message = "";
      res.render("admin/home/oProject_show", {
        title: "Our Projects",
        opt: option,
        headermenu: headermenu_dynamic,
        settingmenu: setting_dynamic,
        pagedata: result,
        expertiseitem: expertiseitem,
        frontend_url: frontend_url,
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

router.post("/projects", checkLogin, async function (req, res, next) {
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
		const result = await 
    dbo.collection("ourprojects").findOneAndUpdate(
                                { oid: "1" },
                                { $set: myobj },
                                { upsert: true, returnNewDocument: true });
		if (result) {
			session.message = "Data updated successfully";
      res.redirect("/projects");
		} else {
			session.message = "Data wasnt updated successfully";
      res.redirect("/projects");
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

router.post( "/ourprojectsitem", upload.single("userPhoto"), async function (req, res, next) {
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
      description: req.body.description.trim(),
      image: imagepath,
    };

		const result = await dbo.collection("ourprojectsitem").insertOne(myobj);

		if (result) {
      session.message = "Project item added successfully";
      return res.redirect("/projects");
		} else {
      session.message = "Project item wasnt added";
      return res.redirect("/projects");
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

router.post("/ourprojectsitemedit",upload.single("userPhoto"),async function (req, res, next) {

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
        description: req.body.description.trim(),
        image: imagepath,
      },
    };
    const result = dbo.collection("ourprojectsitem").updateOne(
      { _id: new ObjectId(req.body.editid) },
      myobj);

		if (result) {
      session.message = "Project item updated successfully";
      res.redirect("/projects");
		} else {
      session.message = "Project item wasnt updated successfully";
      res.redirect("/projects");
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
  }
);

router.get("/ourprojectsitemremove/:id", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("ourprojectsitem").remove({ _id: new ObjectId(req.params.id) });

		if (result) {
      session.message = "Project item deleted successfully";
      res.redirect("/projects");
		} else {
      session.message = "Project item wasnt deleted successfully";
      res.redirect("/projects");
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

router.get("/ourprojects-show", async function (req, res, _next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("ourprojects").findOne();
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

router.get("/ourprojectsitem-show", async function (req, res, _next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("ourprojectsitem").find().toArray();
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

router.get("/ourprojectsitem-show-limit", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("ourprojectsitem").find().sort({ _id: -1 }).limit(9).toArray();
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

router.get("/project/:id", async function (req, res, _next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    var aid = req.params.id;
		const result = await dbo.collection("ourprojectsitem").findOne({ _id: new ObjectId(aid) });;
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

router.get("/getprojectitem/:id",async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    var aid = req.params.id;
		const result = await dbo.collection("ourprojectsitem").findOne({ _id: new ObjectId(aid) });
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
