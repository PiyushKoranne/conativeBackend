var express = require("express");
var router = express.Router();
var multer = require("multer");
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

var MongoClient = require("mongodb").MongoClient;

var { ObjectId } = require("mongodb");

router.get("/aboutus", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		let aboutarr = await dbo.collection("aboutus").findOne();
		let userlogin = await dbo
								.collection("users")
								.findOne({ _id: new ObjectId(session.userid) });
		let techslideitem = await dbo
									.collection("techslideitem")
									.find()
									.sort({ _id: -1 })
									.toArray();
		let tourSlideItem = await dbo
						.collection("tourSlideItem")
						.find()
						.sort({ _id: -1 })
						.toArray();
		let chooseContentItem = await dbo
						.collection("chooseContentItem")
						.find()
						.sort({ _id: -1 })
						.toArray();
		let headermenu_dynamic = dbo
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
		
		const result = await  dbo.collection("option").findOne();
		if (result) {
			res.render("admin/aboutus/about_us", {
				title: "About Us",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				userlogin: userlogin,
				pagedata: aboutarr,
				techslideitem: techslideitem,
				tourSlideItem: tourSlideItem,
				chooseContentItem: chooseContentItem,
				opt: result,
				frontend_url: frontend_url,
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
		}
	}
});


router.post(  "/aboutus", upload.single("userPhoto"),async function (req, res, next) {

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
      hid: "1",
      meta_title: req.body.meta_title.trim(),
      meta_desc: req.body.meta_desc.trim(),
      meta_keywords: req.body.meta_keywords.trim(),
      title: req.body.title.trim(),
      heading: req.body.heading.trim(),
      content: req.body.content,
      image: imagepath,
      vision_heading: req.body.vision_heading.trim(),
      vision_content: req.body.vision_content.trim(),
      mission_heading: req.body.mission_heading.trim(),
      mission_content: req.body.mission_content.trim(),
      choose_heading: req.body.choose_heading.trim(),
      choose_desc: req.body.choose_desc.trim(),
      tour_title: req.body.tour_title.trim(),
      tour_heading: req.body.tour_heading.trim(),
      technologies_title: req.body.technologies_title.trim(),
      technologies_heading: req.body.technologies_heading.trim(),
    };

      const result = await dbo
                      .collection("aboutus")
                      .findOneAndUpdate(
                        { hid: "1" },
                        { $set: myobj },
                        { upsert: true, returnNewDocument: true });
    
		if (result) {
    session.message = "AboutUs updated successfully";
    return res.redirect("/aboutus");
		} else {
      session.message = "AboutUs Failed to updated ";
      return res.redirect("/aboutus");
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

router.get("/aboutus-content", async function (req, res, next) {


  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
   		const result = await dbo.collection("aboutus").findOne();
		console.log("REQUEST INITIATED BY : ",req.protocol + '://' + req.get('host') + req.originalUrl);
		
		if (result) {
      		res.status(200).json({message:"Retrieved ABout Us Content",result});
		} else {
      		res.status(400).json({message:"ABout Us Content Not Found",result});
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

router.post( "/techslide", upload.single("userPhoto"), async function (req, res, next) {

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

      const result = await dbo.collection("techslideitem").insertOne(myobj);

		
		if (result) {
      session.message = "Technologies Slide item added successfully";
      return res.redirect("/aboutus");
		} else {
      session.message = "Technologies Slide item Wasn't added";
      return res.redirect("/aboutus");
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



router.get("/techSlideItem-show", async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");

    const result =  await dbo
                     .collection("techslideitem")
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
		}}
});


router.get("/techSlideItem-remove/:id", async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await  dbo.collection("techslideitem").remove({ _id: new ObjectId(req.params.id) });

		if (result) {
			  session.message = "Technology Slide item deleted successfully";
        res.redirect("/aboutus");
		} else {
      session.message = "Technology Slide item Wasn't deleted";
      res.redirect("/aboutus");
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

router.post("/tourSlide",upload.single("userPhoto"),async function (req, res, next) {

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


    if (req.body.editid != "") {
      var myobj = {
        $set: {
          tour_item_title: req.body.tour_item_title.trim(),
          tour_item_content: req.body.tour_item_content.trim(),
          tour_item_year: req.body.tour_item_year.trim(),
          image: imagepath,
        },
      };

      const result = await dbo.collection("tourSlideItem").updateOne(
        { _id: new ObjectId(req.body.editid) },
        myobj,
        function (err, result) {
          if (err) {
            throw err;
          }

         
        }
      );
      if (result) {
        session.message = "Tour Slide item updated successfully";
          res.redirect("/aboutus");
      } else {
        session.message = "Tour Slide item Wasn't updated successfully";
        res.redirect("/aboutus");
      }
    }


 else {
  var myobj = {
    tour_item_title: req.body.tour_item_title.trim(),
    tour_item_content: req.body.tour_item_content.trim(),
    tour_item_year: req.body.tour_item_year.trim(),
    image: imagepath,
  };

  const result = await dbo.collection("tourSlideItem").insertOne(myobj);

  if (result) {
    session.message = "Tour Slide item added successfully";
    return res.redirect("/aboutus");
      
  } else {
    session.message = "Tour Slide item wasn't added successfully";
    return res.redirect("/aboutus");
      
  }
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

router.get("/tourSlideItem_edit/:id", async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    var aid = req.params.id;

		const result = await dbo
                        .collection("tourSlideItem")
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
		}}

});

router.get("/tourSlideItem-show", async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo
                          .collection("tourSlideItem")
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
		}}

});

router.post("/chooseSlide", async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");

    if (req.body.chooseEditid != "") {
      var myobj = {
        $set: {
          choose_title: req.body.choose_title.trim(),
          choose_content: req.body.choose_content.trim(),
        },
      };

      const result = await dbo.collection("chooseContentItem").updateOne(
                        { _id: new ObjectId(req.body.chooseEditid) },myobj);

      if (result) {
        session.message = "Choose Content item updated successfully";
        res.redirect("/aboutus");
		} else {
      session.message = "Choose Content item wasn't updated";
      res.redirect("/aboutus");
		} 
    }           

    else {
      var myobj = {
        choose_title: req.body.choose_title.trim(),
        choose_content: req.body.choose_content.trim(),
      };

      const result = await dbo.collection("chooseContentItem").insertOne(myobj);

      if (result) {
        session.message = "Choose Content item added successfully";
        return res.redirect("/aboutus");
      } else {
        session.message = "Choose Content item wasn't added ";
        return res.redirect("/aboutus");
      }

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



router.get("/chooseContentItem_edit/:id", async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
    var aid = req.params.id;
		const result = await  dbo
                            .collection("chooseContentItem")
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
		}}
});

router.get("/tourSlideItem-remove/:id", async function (req, res, next) {
  await MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("conative");
    dbo.collection("tourSlideItem").remove({ _id: new ObjectId(req.params.id) });
  });

  session.message = "Tour Slide item deleted successfully";
  res.redirect("/aboutus");
});

router.get("/chooseContentItem_remove/:id", async function (req, res, next) {

  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo
                          .collection("chooseContentItem")
                          .remove({ _id: new ObjectId(req.params.id) });
		if (result) {
      session.message = "Choose Content item deleted successfully";
      res.redirect("/aboutus");
		} else {
      session.message = "Choose Content item deleted successfully";
      res.redirect("/aboutus");
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

router.get("/chooseSlide-show", async function (req, res, next) {
  
  let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await  dbo
                        .collection("chooseContentItem")
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
		}}
});

module.exports = router;
