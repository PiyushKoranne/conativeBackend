var createError = require("http-errors");
const session = require("express-session");
var express = require("express");
var router = express.Router();
var multer = require("multer");
var jwt = require("jsonwebtoken");
var checkLogin = require("../../middleware/check");
const async = require("async");
const bcrypt = require("bcrypt");
// var bodyParser = require("body-parser");
var { upload, url, frontend_url } = require("../constants");
const { check, validationResult } = require("express-validator");

var MongoClient = require("mongodb").MongoClient;
var { ObjectId } = require("mongodb");

const register = require("../../models/Registermodel");






router.get('/loader-events', async (req, res) => {
	let client;
	try {
		var headermenu_dynamic = [];
		var setting_dynamic = [];
		var getUser = [];
		var userlogin = [];

		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");

		headermenu_dynamic = await dbo
			.collection("menus")
			.find({
				$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
			})
			.sort({ index: 1 })
			.toArray();

		setting_dynamic = await dbo
			.collection("menus")
			.find({
				$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
			})
			.sort({ index: 1 })
			.toArray();
		userlogin = await dbo
			.collection("users")
			.findOne({ _id: new ObjectId(session.userid) });

		const events = await dbo.collection('loader').find().toArray();
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

		if(events){
			session.message = "Event Data Retreived Successfully"
			res.render('admin/loader/events', { 
				title: "Loader Manager",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				userlogin: userlogin,
				techslideitem: techslideitem,
				tourSlideItem: tourSlideItem,
				eventData: events,
				frontend_url: frontend_url,
				msg: session.message,
			 });
		} else { 
			session.message = "Failed to get Data";
			res.status(400).json({success:false, message:"Cannot Find Event Data"});
		}
	} catch (error) {
		console.error('Error fetching events:', error);
		res.status(500).json({ error: 'Internal server error' });
	} finally {
		if (client) {
		 	client.close();
		}
	}
});

router.get("/users", checkLogin, async function (req, res, next) {
	let client;
	try {
		var headermenu_dynamic = [];
		var setting_dynamic = [];
		var getUser = [];
		var userlogin = [];

		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");

		headermenu_dynamic = await dbo
			.collection("menus")
			.find({
				$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "1" }] }],
			})
			.sort({ index: 1 })
			.toArray();

		setting_dynamic = await dbo
			.collection("menus")
			.find({
				$and: [{ $or: [{ displaymenu: "b" }] }, { $or: [{ parent_id: "2" }] }],
			})
			.sort({ index: 1 })
			.toArray();

		getUser = await dbo
			.collection("users")
			.find()
			.toArray();

		userlogin = await dbo
			.collection("users")
			.findOne({ _id: new ObjectId(session.userid) });

		const result = await dbo.collection("option").findOne();
		if (result) {
			session.message = "";
			res.render("admin/user/all_user", {
				title: "users",
				opt: result,
				userdata: getUser,
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				frontend_url: frontend_url,
				userlogin: [],
				successmsg: session.message,
			});
		} else {
			res.send("Data Not Found Please Check Collection");
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

router.get("/register", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");

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

		let result = await dbo.collection("option").findOne({});
		if (result) {
			session.message = "";
			res.render("admin/user/user_register", {
				title: "register",
				opt: result,
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				frontend_url: frontend_url,
				userlogin: userlogin,
				successmsg: session.message,
			});
		} else {
			res.send("Data Not Found Please Check Collection");
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
	"/addnewuser",
	upload.single("userPhoto"),
	[
		check("username", "Please enter username")
			.exists()
			.trim()
			.isLength({ min: 3 }),
		check("email", "Please enter email")
			.exists()
			.trim()
			.isEmail()
			.withMessage("Please enter valid email")
			.normalizeEmail()
			.custom((value, { req }) => {
				return new Promise((resolve, reject) => {
					register.findOne({ email: req.body.email }, function (err, user) {
						console.log(user);
						if (err) {
							console.log("ser");
							reject(new Error("Server Error"));
						}
						if (Boolean(user)) {
							reject(new Error("E-mail already in use"));
						}
						resolve(true);
					});
				});
			}),
		check("phone", "Please enter phone")
			.exists()
			.trim()
			.isLength({ min: 10, max: 10 }),
		check("address", "Please enter address")
			.exists()
			.trim()
			.isLength({ min: 5 }),
		check("userPhoto", "Please select image").trim(),
		check("password", "Please enter password")
			.exists()
			.trim()
			.isLength({ min: 5 }),
		check("confirmPassword")
			.trim()
			.isLength({ min: 5 })
			.withMessage("Password must be minlength 5 characters")
			.custom(async (confirmPassword, { req }) => {
				const password = req.body.password;
				if (password !== confirmPassword) {
					throw new Error("Password must be same");
				}
			}),
	],
	async (req, res) => {
		let client;
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				const alert = errors.array();
				// console.log(alert);
				res.render("admin/user/user_register", {
					alert,
					title: "register",
					opt: [],
					headermenu: [],
					settingmenu: [],
					userlogin: [],
					successmsg: "",
				});
			} else {
				const salt = await bcrypt.genSalt(10);
				const hashpassword = await bcrypt.hash(req.body.password, salt);
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

				var myobj = new register({
					username: req.body.username.trim(),
					email: req.body.email.trim(),
					phone: req.body.phone.trim(),
					address: req.body.address.trim(),
					password: hashpassword.trim(),
					userPhoto: imagepath,
				});
				myobj.save();

				const result = await dbo.collection("users").insertOne(myobj);
				if (result) {
					session.message = "User register successfully";
					return res.redirect("/users");
				} else {
					session.message = "User registration failed";
					return res.redirect("/users");
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
			}
		}
	}
);

//  usereditform

router.post(
	"/usereditform",
	upload.single("userPhoto"),
	[
		check("username", "Please enter username")
			.exists()
			.trim()
			.isLength({ min: 3 }),
		check("phone", "Please enter phone")
			.exists()
			.trim()
			.isLength({ min: 10, max: 10 }),
		check("address", "Please enter address")
			.exists()
			.trim()
			.isLength({ min: 5 }),
	],
	async (req, res) => {
		let client;
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				const alert = errors.array();
				// console.log(alert);
				res.render("admin/user/all_user", {
					alert,
					title: "users",
					opt: [],
					userdata: [],
					headermenu: [],
					settingmenu: [],
					userlogin: [],
					successmsg: "",
					frontend_url: frontend_url,
				});
			} else {
				client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
				const dbo = client.db("conative");
				const result = await dbo.collection("users").findOne({ _id: new ObjectId(req.body.editid) });
				if(result?.email === req.body?.email?.trim()){
					const file = req.file;
					var imagepath = "";
					// console.log("hhd",result.email);
					if (req.body.oldimage != "") {
						imagepath = req.body.oldimage;
					}
					if (file && !file.length) {
						imagepath = file.filename;
					}

					var myobj = {
						$set: {
							username: req.body.username.trim(),
							email: req.body.email.trim(),
							phone: req.body.phone.trim(),
							address: req.body.address.trim(),
							userPhoto: imagepath,
							updateAt: new Date(),
						},
					};

					const response = await dbo.collection("users").updateOne(
						{ _id: new ObjectId(req.body.editid) },
						myobj
					);
					if(response){
						session.message = "User updated successfully";
						res.redirect("/users");
					} else {
						session.message = "Failed to update user";
						res.redirect("/users");
					}
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
			}
		}
	}
);

router.get("/getuserbyid/:id", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var aid = req.params.id;
		const result = await dbo
								.collection("users")
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

router.get("/changepassword", async function (req, res, next) {
	try {
		res.render("admin/user/forgotpassword", {
			title: "Forgot",
			opt: [],
			headermenu: [],
			settingmenu: [],
			userlogin: [],
			successmsg: "",
		});
	} catch (error) {
		console.log("OPTION SHOW ROUTE ERROR\n")
		console.log(error);
		res.status(500).json({ message: "Some error occurred", error: error?.message })
	}
});

router.post(
	"/forgotpassword",
	[
		check("password", "Please enter password")
			.exists()
			.trim()
			.isLength({ min: 5 }),
		check("newpassword")
			.trim()
			.isLength({ min: 5 })
			.withMessage("Password must be minlength 5 characters")
			.custom(async (newpassword, { req }) => {
				const password = req.body.password;
				if (password !== newpassword) {
					throw new Error("Password must be same");
				}
			}),
	],
	async (req, res) => {
		let client;
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				const alert = errors.array();

				res.render("admin/user/forgotpassword", {
					alert,
					title: "Forgot",
					opt: [],
					headermenu: [],
					settingmenu: [],
					userlogin: [],
					successmsg: "",
				});
			} else {
				const salt = await bcrypt.genSalt(10);
				const hashpassword = await bcrypt.hash(req.body.password, salt);

				client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
				const dbo = client.db("conative");
				var myobj = {
					$set: {
						password: hashpassword,
					},
				};

				const result = await dbo.collection("users").updateOne(
					{ _id: new ObjectId(session.userid) },
					myobj
				);

				if(result){
					session.message = "User password updated successfully";
					res.redirect("/changepassword");
				} else {
					session.message = "Failed to update password";
					res.redirect("/changepassword");
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
			}
		}
	}
);

router.get("/userremove/:id", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("users").remove({ _id: new ObjectId(req.params.id) });
		if (result) {
			session.message = "User deleted successfully";
			return res.redirect("/users");
		} else {
			session.message = "Failed to delete user";
			return res.redirect("/users");
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
