var express = require("express");
var router = express.Router();
var multer = require("multer");
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

const MongoClient = require("mongodb").MongoClient;

const { ObjectId } = require("mongodb");

router.get("/industries", checkLogin, async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
  const userlogin = await dbo.collection("users").findOne({ _id: new ObjectId(session.userid) });

    const option = await dbo.collection("option").findOne();

    const expertiseitem = await dbo.collection("tbindustrieitem").find().sort({ _id: -1 }).toArray();

    const headermenu_dynamic = await dbo.collection("menus")
                                      .find({
                                        $and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
                                      })
                                      .sort({ index: 1 })
                                      .toArray();

    const setting_dynamic = await dbo.collection("menus")
                                    .find({
                                      $and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
                                    })
                                    .sort({ index: 1 })
                                    .toArray();
    const result = await  dbo.collection("tbindustrie").findOne();

		if (result) {
      session.message = ""
      res.render("admin/home/Industries_show", {
        title: "Industries We Serve",
        opt: option,
        headermenu: headermenu_dynamic,
        settingmenu: setting_dynamic,
        pagedata: result,
        frontend_url: frontend_url,
        expertiseitem: expertiseitem,
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
		// Close the database connection in the finally block
		if (client) {
			client.close();
		}}
});

router.post("/industries", checkLogin, async function (req, res, next) {
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
		const result = await dbo.collection("tbindustrie")
                            .findOneAndUpdate(
                              { oid: "1" },
                              { $set: myobj },
                              { upsert: true, returnNewDocument: true })

		if (result) {
		  session.message = "Data updated successfully";
        return res.redirect("/industries");
		} else {
      session.message = "Data wasnt updated successfully";
        return res.redirect("/industries");
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

router.post("/industriesitem",upload.single("userPhoto"),async function (req, res, next) {
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
      image: imagepath.trim(),
    };
		const result = await dbo.collection("tbindustrieitem").insertOne(myobj);
		if (result) {
      session.message = "Industrie item inserted successfully";
      return res.redirect("/industries");
		} else {
      session.message = "Industrie item wasnt inserted successfully";
      return res.redirect("/industries");
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

router.get("/industriesitemremove/:id", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("tbindustrieitem").remove({ _id: new ObjectId(req.params.id) });

		if (result) {
      session.message = "Industries item deleted successfully";
      res.redirect("/industries");
		} else {
			session.message = "Industries item wasnt deleted successfully";
  res.redirect("/industries");
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


router.get("/getindustrieitem/:id", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    var aid = req.params.id;

		const result = await dbo.collection("tbindustrieitem").findOne({ _id: new ObjectId(aid) });
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

router.post( "/industriesedit", upload.single("userPhoto"), async function (req, res, next) {
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
		const result = await dbo.collection("tbindustrieitem").updateOne({ _id: new ObjectId(req.body.editid) },myobj);
   
		if (result) {
      session.message = "Industrie item updated successfully";
      res.redirect("/industries");
		} else {
      session.message = "Industrie item wasnt updated successfully";
      res.redirect("/industries");
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

router.get("/industries-show", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await  dbo.collection("tbindustrie").findOne();
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

router.get("/industriesitem-show", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("tbindustrieitem").find().sort({ _id: -1 }).toArray();

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

module.exports = router;
