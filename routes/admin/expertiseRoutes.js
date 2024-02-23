var express = require("express");
var router = express.Router();
const session = require("express-session");
var multer = require("multer");
var checkLogin = require("../../middleware/check");
var axios = require("axios");
const async = require("async");
var { upload, url, frontend_url } = require("../constants");

const MongoClient = require("mongodb").MongoClient;

const { ObjectId } = require("mongodb");

router.get("/expertise", checkLogin, async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    const userlogin = await dbo.collection("users").findOne({ _id: new ObjectId(session.userid) })
    const option = await  dbo.collection("option").findOne()
    const expertiseitem = await  dbo.collection("expertiseitem").find().sort({ _id: -1 }).toArray()
    const expertiseitemlist = await  dbo.collection("expertiselist").find().sort({ _id: -1 }).toArray()
    const headermenu_dynamic = await dbo.collection("menus")
                                        .find({
                                          $and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
                                        }).sort({ index: 1 }).toArray()
    const setting_dynamic =  await dbo.collection("menus")
                                      .find({
                                        $and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
                                      }).sort({ index: 1 }).toArray()
    
		const result = await  dbo.collection("expertise").findOne();

		if (result) {
      session.message = "";
      res.render("admin/home/expertise_show", {
        title: "Expertise",
        opt: option,
        headermenu: headermenu_dynamic,
        settingmenu: setting_dynamic,
        pagedata: result,
        expertiseitemlist: expertiseitemlist,
        frontend_url: frontend_url,
        expertiseitem: expertiseitem,
        updatearr: [],
        userlogin: userlogin,
        msg: session.message,
      });
		} else {
      session.message = "";
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

router.post("/expertise", checkLogin, async function (req, res, next) {
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

     const result =   dbo.collection("expertise").findOneAndUpdate(
                                                   { oid: "1" },
                                                   { $set: myobj },
                                                   { upsert: true, returnNewDocument: true });

		if (result) {
         session.message = "Expertise added successfully";
         res.redirect("/expertise");
		} else {
         session.message = "Expertise wasnt added successfully";
         res.redirect("/expertise");
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

router.post("/expertiseitem",upload.single("userPhoto"),async function (req, res, next) {

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
      url: req.body.url.trim(),
      image: imagepath,
    };
		const result = await dbo.collection("expertiseitem").insertOne(myobj);
		if (result) {
      session.message = "Expertise item added successfully";
      return res.redirect("/expertise");
		} else {
      session.message = "Expertise item wasnt added";
      return res.redirect("/expertise");
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

router.post("/expertiseitemupdate/:id",upload.single("userPhoto"),async function (req, res, next) {

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
      const result = await dbo.collection("expertiseitem").updateOne({ _id: new ObjectId(req.params.id) },myobj);

		if (result) {
	
      session.message = "Expertise item updated successfully";
      res.redirect("/expertise");
		} else {
			
      session.message = "Expertise item wasnt updated successfully";
      res.redirect("/expertise");
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

router.get("/expertiseitemremove/:id", async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await  dbo.collection("expertiseitem").remove({ _id: new ObjectId(req.params.id) });
		if (result) {
      session.message = "Expertise item deleted successfully";
      res.redirect("/expertise");
		} else {
      session.message = "Expertise wasnt item deleted successfully";
      res.redirect("/expertise");
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

router.get("/expertise-show", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("expertise").findOne();
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

router.get("/expertiseitem-show", async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("expertiseitem").find().sort({ _id: -1 }).toArray();

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

router.get("/expertiseitem-show-list", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("expertiselist").find().sort({ _id: -1 }).toArray();

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

router.get("/expertiseitem-show-limit", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await     dbo.collection("expertiseitem").find().sort({ _id: -1 }).limit(6).toArray();
    
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

router.get("/singlepage/:id", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    var aid = req.params.id;

		const result = await dbo.collection("expertiseitem").findOne({ _id: new ObjectId(aid) });

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

router.get("/getexpertiseitem/:id", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    var aid = req.params.id;

		const result = await dbo.collection("expertiseitem").findOne({ _id: new ObjectId(aid) });
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

router.post("/expertiseitemedit",upload.single("userPhoto"),async function (req, res, next) {
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
        url: req.body.url.trim(),
        image: imagepath,
      },
    };
      const result = await dbo.collection("expertiseitem").updateOne({ _id: new ObjectId(req.body.editid) },myobj);

		if (result) {
      session.message = "Expertise item updated successfully";
      res.redirect("/expertise");
		} else {
      session.message = "Expertise item wasnt updated successfully";
      res.redirect("/expertise");
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

//
router.post("/expertiselistitem", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    var myobj = {
      name: req.body.name,
    };

		const result = await dbo.collection("expertiselist").insertOne(myobj);

		if (result) {
      session.message = "Expertise list item added successfully";
      res.redirect("/expertise");
		} else {
      session.message = "Expertise list wasnt item added successfully";
      res.redirect("/expertise");
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

router.get("/expertiselistremove/:id", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("expertiselist").remove({ _id: new ObjectId(req.params.id) });
		if (result) {

      session.message = "Expertise list item deleted successfully";
      res.redirect("/expertise");
		} else {
		
      session.message = "Expertise list wasnt item deleted successfully";
      res.redirect("/expertise");
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
