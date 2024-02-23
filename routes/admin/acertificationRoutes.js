var express = require("express");
var router = express.Router();
var multer = require("multer");
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

var MongoClient = require("mongodb").MongoClient;

var { ObjectId } = require("mongodb");

router.get("/awradscertification", checkLogin, async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");

    const userlogin = await dbo.collection("users").findOne({ _id: new ObjectId(session.userid) });

    const option  = await dbo.collection("option").findOne();

    const awradsitem = await dbo.collection("tbawradsitem").find().sort({ _id: -1 }).toArray()

    const headermenu_dynamic = await dbo
                                  .collection("menus")
                                  .find({
                                    $and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
                                  })
                                  .sort({ index: 1 })
                                  .toArray()

    const setting_dynamic = await dbo.collection("menus")
                              .find({
                                $and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
                              }).sort({ index: 1 }).toArray()

     const result = await  dbo.collection("tbawradscertification").findOne();

		if (result) {
      session.message = "";
			res.render("admin/home/Awrads_certification", {
                                title: "Certification & Recognition",
                                opt: option,
                                headermenu: headermenu_dynamic,
                                settingmenu: setting_dynamic,
                                pagedata: result,
                                expertiseitem: awradsitem,
                                frontend_url: frontend_url,
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

router.post("/awradscertification",checkLogin,async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");

    var myobj = {
      title: req.body.title.trim(),
      name: req.body.name.trim(),
      description: req.body.description.trim(),
    };

		const result = await dbo
                          .collection("tbawradscertification")
                          .findOneAndUpdate(
                            { oid: "1" },
                            { $set: myobj },
                            { upsert: true, returnNewDocument: true });

		if (result) {
			session.message = "Data updated successfully";
      res.redirect("/awradscertification");
		} else {
      session.message = "Data wasn't updated ";
      res.redirect("/awradscertification");
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

router.post("/awradsitemform",upload.single("userPhoto"),async function (req, res, next) {

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
      image: imagepath,
    };

		const result = await dbo.collection("tbawradsitem").insertOne(myobj);
		if (result) {
      console.log('the awards item inserted sucessfully')
      res.redirect("/awradscertification");
		} else {
      console.log("the awards item wasn't inserted ")
      res.redirect("/awradscertification");
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


router.post("/awradsitemupdate",upload.single("userPhoto"),async function (req, res, next) {

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
        image: imagepath,
      },
    };

		const result = await dbo.collection("tbawradsitem").updateOne(
                      { _id: new ObjectId(req.body.editid) },myobj);
  
		if (result) {
      session.message = "Awards item updated successfully";
      res.redirect("/awradscertification");
  
		} else {
	    session.message = "Awards item wasn't updated successfully";
      res.redirect("/awradscertification");
                    
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

router.get("/awradsitemremove/:id", async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await  dbo.collection("tbawradsitem").remove({ _id: new ObjectId(req.params.id) });
  
		if (result) {
		  session.message = "Awards item deleted successfully";
      res.redirect("/awradscertification");
		} else {
      session.message = "Awards item wasn't deleted ";
      res.redirect("/awradscertification");
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

router.get("/getawradsitem/:id", async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    var aid = req.params.id;
		const result = await dbo
                          .collection("tbawradsitem")
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
		}}
});

router.get("/awardscertification", async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("tbawradscertification").findOne({});
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

router.get("/awardsitem", async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await  dbo.collection("tbawradsitem").find().toArray()
    
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
