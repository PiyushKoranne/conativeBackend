var express = require("express");
var router = express.Router();
var multer = require("multer");
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

const MongoClient = require("mongodb").MongoClient;

const { ObjectId } = require("mongodb");

router.get("/gallery", checkLogin, async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    const userlogin = await dbo
      .collection("users")
      .findOne({ _id: new ObjectId(session.userid) });

    const option = await dbo.collection("option").findOne();

    const galleryslideitem = await dbo
      .collection("galleryslideitem")
      .find()
      .sort({ _id: -1 })
      .toArray();

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
		const result = await dbo.collection("startprojects").findOne();;
		if (result) {
      res.render("admin/home/startproject_show", {
        title: "Start Project",
        headermenu: headermenu_dynamic,
        settingmenu: setting_dynamic,
        galleryslideitem: galleryslideitem,
        frontend_url: frontend_url,
        opt: option,
        pagedata: result,
        userlogin: userlogin,
        msg: session.message,
      });
      session.message = "";
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

router.get("/createsp", checkLogin, async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
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
		const result = await     dbo.collection("option").findOne();
		if (result) {
      res.render("admin/home/startproject", {
        title: "Start Project",
        headermenu: headermenu_dynamic,
        settingmenu: setting_dynamic,
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

router.post("/addstartpjt",
  upload.fields([
    {
      name: "userPhoto",
      maxCount: 1,
    },
  ]),
  async function (req, res, next) {

    let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    var userPhotoName = "";

    if (req.files["userPhoto"]) {
      const userPhoto = req.files["userPhoto"];
      userPhotoName = userPhoto[0].filename;
    }

    var myobj = {
      oid: "1",
      name: req.body.name.trim(),
      title: req.body.title.trim(),
      userPhoto: userPhotoName,
      btnname: req.body.btnname.trim(),
      description: req.body.description.trim(),
      our_work_tagline: req.body.our_work_tagline.trim(),
      tagline: req.body.tagline.trim(),
      our_work_url: req.body.our_work_url.trim(),
    };
		const result = await dbo.collection("startprojects")
                            .findOneAndUpdate(
                              { oid: "1" },
                              { $set: myobj },
                              { upsert: true, returnNewDocument: true });

		if (result) {
      session.message = "Data updated successfully";
      return res.redirect("/gallery");
		} else {
      session.message = "Data updated successfully";
      return res.redirect("/gallery");
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

router.get("/startpjt-show", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("startprojects").findOne();
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

router.post("/galleryslide",upload.single("userPhoto"),async function (req, res, next) {
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
      image: imagepath,
    };

		const result = await dbo.collection("galleryslideitem").insertOne(myobj);
		if (result) {
      session.message = "Gallery Slide item added successfully";
      return res.redirect("/gallery");
		} else {
      session.message = "Gallery Slide item wasnt added successfully";
      return res.redirect("/gallery");
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

router.get("/gallerySlideItem-show", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("galleryslideitem").find().sort({ _id: -1 }).toArray();
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

router.get("/gallerSlideItem-edit/:id", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    var aid = req.params.id;
		const result = await dbo.collection("galleryslideitem").findOne({ _id: new ObjectId(aid) });

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

router.get("/gallerSlideItem-remove/:id", async function (req, res, next) {
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("galleryslideitem").findOneAndDelete({ _id: new ObjectId(req.params.id) });

		if (result) {
      session.message = "Gallery Slide item deleted successfully";
      res.redirect("/gallery");
		} else {
      session.message = "Gallery Slide item wasnt deleted successfully";
      res.redirect("/gallery");
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
