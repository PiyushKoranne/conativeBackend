// var createError = require("http-errors");
require("dotenv").config();
const express = require("express");
const app = express();
var path = require("path");
const helmet = require("helmet");
const fs = require("fs");
const ejs = require("ejs");
var expressLayout = require("express-ejs-layouts");
var bodyParser = require("body-parser");
const flash = require("connect-flash");
var cookieParser = require("cookie-parser");
const session = require("express-session");
var jwt = require("jsonwebtoken");
var checkLogin = require("./middleware/check"); 
const bcrypt = require("bcrypt");
const cors = require("cors");
var axios = require("axios");
// const async = require("async");
var multer = require("multer");
var logger = require("morgan");
const mongodb = require("mongodb");
const nodemailer = require("nodemailer");
const fileupload = require("express-fileupload");
const { check, validationResult } = require("express-validator");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const register = require("./models/Registermodel");
const {user_message_one, user_message_two} = require("./utils/emailPlaceholders");
var MongoClient = require("mongodb").MongoClient;
const {frontend_url, upload} = require("./routes/constants")
const { ObjectId } = require("mongodb");
var url = "mongodb://localhost:27017"
const date = new Date();
const PORT = process.env.PORT || 4000


var userRoutes = require("./routes/common/userRoutes");
var SettingRouter = require("./routes/common/setting");

//  ======================== menu ============================
var menuRoutes = require("./routes/common/menuRoutes");
var bothmenuRoutes = require("./routes/common/bothmenuRoutes");

var socialRoutes = require("./routes/common/socialRoutes");
var AboutFirstRoutes = require("./routes/aboutus/AboutUs");

// ============== adminRouter =================================
var homeRoutes = require("./routes/admin/homeRoutes");
var expertiseRoutes = require("./routes/admin/expertiseRoutes");
var ourProjectsRouters = require("./routes/admin/ourProjectsRouters");
var digitallegacyRoutes = require("./routes/admin/digitallegacyRoutes");
var ourProcessRouters = require("./routes/admin/ourProcessRouters");
var clientProject = require("./routes/admin/clientProjectRoutes");
var startProjectRoutes = require("./routes/admin/startProjectRoutes");
var IndustriesRoutes = require("./routes/admin/IndustriesRoutes");
var acertificationRoutes = require("./routes/admin/acertificationRoutes");

// ======================= PagesRoutes ========================
var contactRoutes = require("./routes/contact/contactRoutes");
var PortfolioRoutes = require("./routes/portfolio/PortfolioRoutes");
var LifeAtConativeRoutes = require("./routes/aboutus/LifeAtConative");
var TeamRoutes = require("./routes/Team/TeamRoutes");
var TestimonialsRoutes = require("./routes/Testimonials/testimonialsRoutes");

// ======================= CareerRoutes =========================
var CareerRoutes = require("./routes/career/CareerRoutes");
var CareerPostRoutes = require("./routes/post-types/careers");

// ======================= IndustriesWeServeRoutes ==============
var IndustriesPostRoutes = require("./routes/post-types/IndustriesWeServe");
var WebDevelopmentPostRoutes = require("./routes/post-types/webDevelopment");
var graphicsDesignPostRoutes = require("./routes/post-types/graphicsDesign");


// ============== NodeMailer ===================================
let transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "noreply.conative@gmail.com",
		pass: "eyuqtvihrjkyijvn",
	},
});

transporter.verify((err, success) => {
	err
		? console.log(err)
		: console.log(`✅ - MAIL TRANSPORTER READY.`);
});

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    helmet.contentSecurityPolicy({
      useDefaults: false,
      "block-all-mixed-content": true,
      "upgrade-insecure-requests": true,
      directives: {
        "default-src": [
            "'self'"
        ],
        "base-uri": "'self'",
        "font-src": [
            "'self'",
            "https:",
            "data:"
        ],
        "frame-ancestors": [
            "'self'"
        ],
        "img-src": [
            "'self'",
            "data:"
        ],
        "object-src": [
            "'none'"
        ],
        "script-src": [
            "'self'",
			"'unsafe-inline'",
            "https://admin.conativeitsolutions.com"
        ],
        "script-src-attr": "'unsafe-inline'",
        "style-src": [
            "'self'",
			"'unsafe-inline'",
            "https://cdnjs.cloudflare.com"
        ],
      },
    }),
    helmet.dnsPrefetchControl({
        allow: true
    }),
    helmet.frameguard({
        action: "deny"
    }),
    helmet.hidePoweredBy(),
    helmet.hsts({
        maxAge: 123456,
        includeSubDomains: false
    }),
    helmet.ieNoOpen(),
    helmet.noSniff(),
    helmet.referrerPolicy({
        policy: [ "origin", "unsafe-url" ]
    }),
    helmet.xssFilter()
)
app.use(express.json());

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());

app.use(express.static("public"));
app.use(expressLayout);

app.use(
	session({
		secret: "secret token",
		resave: false,
		saveUninitialized: true,
		name: "session cookie name",
		genid: (req) => {
			// console.log("uniqueid",req);
			// Returns a random string to be used as a session ID
		},
	})
);

app.use(flash());

const corsOptions = {
	origin: ["https://conativeitsolutions.com", "http://192.168.16.36:3000", "http://192.168.16.139:8000", process.env.PRODUCTION_URL, process.env.DEVELOPMENT_URL],
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
app.use(cors(corsOptions));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



app.use("/imgupload", express.static(__dirname + "/imgupload"));
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		var path = require("path");
		imagec = new Date().toISOString().replace(/:/g, "-") + file.originalname;
		cb(null, "imgupload");
	},
	filename: function (req, file, cb) {
		cb(null, imagec);
	},
});
var storageForNewPath = multer.diskStorage({
	destination: function (req, file, cb) {
	  // Customize the destination folder as needed
	  cb(null, "public/assets/loaderImg/");
	},
	filename: function (req, file, cb) {
	  // Customize the filename as needed
	  cb(null, file.originalname);
	},
  });

// var upload = multer({ storage: storage });
var loaderImgupload = multer({ storage: storageForNewPath });


// app.use("/", headerRoutes);
app.use("/", userRoutes);
app.use("/", SettingRouter);
app.use("/", menuRoutes);
app.use("/", bothmenuRoutes);
app.use("/", socialRoutes);
app.use("/", contactRoutes);
app.use("/", AboutFirstRoutes);
app.use("/", homeRoutes);
app.use("/", expertiseRoutes);
app.use("/", ourProjectsRouters);
app.use("/", digitallegacyRoutes);
app.use("/", ourProcessRouters);
app.use("/", clientProject);
app.use("/", startProjectRoutes);
app.use("/", IndustriesRoutes);
app.use("/", acertificationRoutes);

app.use("/", PortfolioRoutes);
app.use("/", CareerRoutes);
app.use("/", TeamRoutes);
app.use("/", TestimonialsRoutes);
app.use("/", LifeAtConativeRoutes);
app.use("/", CareerPostRoutes);
app.use("/", contactRoutes);
app.use("/", IndustriesPostRoutes);
app.use("/", WebDevelopmentPostRoutes);
app.use("/", graphicsDesignPostRoutes);

const fieldNames = ['eventName',  'classRefForEvent', 'firstTitle', 'secondTitle' ];
const fieldLabels = ['Event Name', 'Class Reference for Event', 'First Title', 'Second Title'];



app.get('/loader',checkLogin, async(req, res) => {
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

		session.message = "Event Data Retreived Successfully"

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


		
	res.render('loader', { 
		fieldNames,
		fieldLabels,
		selectedEvent: '',
		formSubmitted	: false,
		title: "Loader Manager",
		headermenu: headermenu_dynamic,
		settingmenu: setting_dynamic,
		userlogin: userlogin,
		techslideitem: techslideitem,
		tourSlideItem: tourSlideItem,
		frontend_url: frontend_url,
		msg: session.message,
 });
  });



app.post('/loader/submitForm', upload.fields([
	{ name: 'conativeLogo', maxCount: 1 },
	{ name: 'leftHangingImage', maxCount: 1 },
	{ name: 'rightHangingImage', maxCount: 1 },
	{ name: 'bottomLeftImage', maxCount: 1 },
	{ name: 'bottomRightImage', maxCount: 1 },
	{ name: 'homePageEventImage', maxCount: 1 },
  ]), async (req, res) => {
	let client;
	try {
	  client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
	  const db = client.db("conative");
	  const collection = db.collection('loader');
	  const { eventName,  bgType, textType,solidColor, gradientDirection, textgradientDirection,gradientColor1, gradientColor2,textgradientColor1, textgradientColor2,radialgradientColor1,radialgradientColor2,fromPercent,toPercent,radialgradientsize,textsolidColor,textgradientColor1percent,textgradientColor2percent,gradientColor1percent,gradientColor2percent, eventDate, eventEndDate, conativeLogoAlt, leftHangingImageAlt, rightHangingImageAlt, bottomLeftImageAlt, bottomRightImageAlt  } = req.body;

	  const startDate = new Date(eventDate);
	  const endDate = new Date(eventEndDate);
	  const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)).toString();

	  console.log("duration calculated>>>>>>>>>>>>>>>",duration)
  
  
  
	  
	  

	let bgColor;
	if (gradientColor1percent === "" || gradientColor2percent === "") {
		if (bgType === 'solid') {
			bgColor = solidColor;
		  } else if (bgType === 'gradient') {
			bgColor = `linear-gradient(${gradientDirection} , ${gradientColor1} , ${gradientColor2})`;
		  } else if (bgType === 'radialgradient') {
			  bgColor = `radial-gradient(${radialgradientsize} at ${fromPercent}% ${toPercent}%, ${radialgradientColor1}, ${radialgradientColor2})`;
			} else {
			bgColor = '#000'; 
		  }
	} else {
		if (bgType === 'solid') {
			bgColor = solidColor;
		  } else if (bgType === 'gradient') {
			bgColor = `linear-gradient(${gradientDirection} ${gradientColor1percent}%, ${gradientColor1} ${gradientColor2percent}%, ${gradientColor2})`;
		  } else if (bgType === 'radialgradient') {
			  bgColor = `radial-gradient(${radialgradientsize} at ${fromPercent}% ${toPercent}%, ${radialgradientColor1}, ${radialgradientColor2})`;
			} else {
			bgColor = '#000'; 
		  }
	}
		
	
	let textColor;

	if (textgradientColor1percent === "" || textgradientColor2percent === "" ) {
		if (textType === 'textsolid') {
			textColor = textsolidColor;
		  } else if (textType === 'textgradient') {
			textColor = `linear-gradient(${textgradientDirection}, ${textgradientColor1} , ${textgradientColor2} )`;
		  } else {
			textColor = '#fff'; 
		  }
	} else {
		if (textType === 'textsolid') {
			textColor = textsolidColor;
		  } else if (textType === 'textgradient') {
			textColor = `linear-gradient(${textgradientDirection}, ${textgradientColor1} ${textgradientColor1percent}%, ${textgradientColor2} ${textgradientColor2percent}%)`;
		  } else {
			textColor = '#fff'; 
		  }
		
	}
	
	const customFieldsData = {
		bgColor,
		eventDate,
		eventEndDate,
		conativeLogoAlt,
		leftHangingImageAlt,
		rightHangingImageAlt,
		bottomLeftImageAlt,
		bottomRightImageAlt,
		textColor,
		eventDuration: duration
	  };
  
	  const existingDoc = await collection.findOne({ eventName });

  
	  let eventsData = {
		...customFieldsData,
		...fieldNames.reduce((acc, fieldName) => {
		  acc[fieldName] = req.body[fieldName];
		  return acc;
		}, {}),
	  };


	  fieldNames.forEach(fieldName => {
		eventsData[fieldName] = req.body[fieldName];
	  });
	  
	  console.log("Logging uploaded files",req.files);



	  ['conativeLogo', 'leftHangingImage', 'rightHangingImage', 'bottomLeftImage', 'bottomRightImage','homePageEventImage'].forEach(imageFieldName => {
		if(Object.keys(req.files).length > 0){
			if (req.files[imageFieldName]) {
				console.log("went inside if condition");
				eventsData[imageFieldName] = `/assets/imgupload/${req.files[imageFieldName][0].filename}`;
			} else {
				console.log("went inside else condition");
				eventsData[imageFieldName] = existingDoc.eventsData[imageFieldName] 
			}
		} else {
			if(existingDoc){	
				const textColor = req.body.textColor
				const bgColor = req.body.bgColor
				eventsData = {...existingDoc.eventsData,...eventsData,textColor,bgColor}
			}else{
				eventsData = {...eventsData}
				
			}
		}
		

		
	  });

		if (existingDoc) {
			await collection.updateOne({ eventName }, { $set: { eventsData } });
		  } else {
			await collection.insertOne({ eventName, eventsData });
		  }
		  return res.status(200).redirect('/loader-events');
	
	 
	} catch (error) {
	  console.error('Error submitting form:', error);
	  res.status(500).json({ error: 'Internal server error' });
	} finally {
	  if (client) {
		await client.close();
	  }
	}
  });

  
  
  
//   fetching all the events
app.post('/checkEventsForToday', async (req, res) => {
	let client;
	try {
	  const { todaysDate } = req.body;
	  const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
	  const db = client.db("conative");
	  const collection = db.collection('loader');
  
	  const eventsForToday = await collection.find({
		'eventsData.eventDate': { $lte: todaysDate },  
		'eventsData.eventEndDate': { $gte: todaysDate }
	  }).toArray();
  
	  if (eventsForToday.length > 0) {
		res.status(200).json({ events: eventsForToday });
	  } else {
		res.status(400).json({ message: 'No events for today' });
	  }
	} catch (error) {
	  console.error('Error checking events for today:', error);
	  res.status(500).json({ error: 'Internal server error' });
	} finally {
	  if (client) {
		await client.close();
	  }
	}
  });
  

  app.get('/editEvent', async (req, res) => {
	let client;
	const eventName = req.query.eventName;
	const fieldNames = [  'classRefForEvent', 'firstTitle', 'secondTitle'];
	const fieldLabels = [  'Class Reference for Event', 'First Title', 'Second Title',];
	
	try {
		var headermenu_dynamic = [];
		var setting_dynamic = [];
		var getUser = [];
		var userlogin = [];

		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");

		const collection = dbo.collection('loader');
	  	const eventDetails = await collection.findOne({ eventName });

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

					  if(eventDetails){
						res.render('editEvent', { 
							eventName,
							eventDetails,
							fieldLabels,
							fieldNames,
							title: "Loader Manager",
							headermenu: headermenu_dynamic,
							settingmenu: setting_dynamic,
							userlogin: userlogin,
							techslideitem: techslideitem,
							tourSlideItem: tourSlideItem,
							frontend_url: frontend_url,
						});
					  }

  
	
	} catch (error) {
	  console.error('Error fetching event details:', error);
	  res.status(500).send('Internal Server Error');
	}finally{
		if (client) {
			await client.close();
		  }
	}
  });
  app.get('/deleteEvent', async (req, res) => {
	let client;
	const eventName = req.query.eventName;
  
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");

		const collection = dbo.collection('loader');
	  	const eventDetails = await collection.findOneAndDelete({ eventName });


		if(eventDetails){
		res.redirect('/loader-events');
		}

  
	
	} catch (error) {
	  console.error('Error fetching event details:', error);
	  res.status(500).send('Internal Server Error');
	}finally{
		if (client) {
			await client.close();
		  }
	}
  });
  


app.get("po", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");

		const result = await dbo.collection("option").findOne({});
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

// ====================Upload PDF File==============================

app.use(fileupload());
app.use(express.static("files"));
let year = date.getFullYear();
var month = date.getMonth() + 1;
var today_date = date.getDate();

app.use("/filesUpload", express.static(__dirname + "/filesUpload"));

app.post("/filesUpload", (req, res) => {
	const newpath =
		__dirname + "/filesUpload/" + year + "/" + month + "/" + today_date + "/";
	const file = req.files.file;
	const filename = file.name;

	if (!fs.existsSync(newpath)) {
		fs.mkdirSync(newpath, { recursive: true });
	}

	file.mv(`${newpath}${filename}`, (err) => {
		if (err) {
			res.status(500).send({ message: "File upload failed", code: 500 });
		}
		res.status(200).send({
			message: "File Uploaded",
			code: 200,
			file: file.name,
			filepath: "/filesUpload/" + year + "/" + month + "/" + today_date + "/",
		});
	});
});

// =======================Send Mail===========================
app.post("/sendmail", async (req, res) => {
	let year = date.getFullYear();
	var month = date.getMonth() + 1;
	var today_date = date.getDate();

	var current_date = today_date + "/" + month + "/" + year;

	if (req.body.name == "" || req.body.email == "" || req.body.contact == "") {
		res.send({
			message: "Please fill all the fields properly!",
		});
		return false;
	}

	var spreadsheet_id = "";
	if (req.body.subject === "Career Application") {
		spreadsheet_id = new GoogleSpreadsheet(
			"1qXsCNbbZVd9NWpCfepGWKNWfCf7MnGZ0WTqn2oUdDwo"
		);
	} else {
		spreadsheet_id = new GoogleSpreadsheet(
			"1DGwxzK7EA-AFqGSdEtPJSuqU7U9cYTebiRCHan6Bcw8"
		);
	}

	if (spreadsheet_id == "") {
		res.send({
			message: "Something went wrong! Please try again later.",
		});
		return false;
	}

	const spreadsheet_auth = await spreadsheet_id.useServiceAccountAuth({
		// env var values are copied from service account credentials generated by google
		// see "Authentication" section in docs for more info
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
	});

	var spreadsheet_info = await spreadsheet_id.loadInfo();

	var sheet = spreadsheet_id.sheetsByIndex[0];

	if (req.body.candidate_type == "Experienced") {
		var Candidate_Experience = req.body.experience;
	} else {
		var Candidate_Experience = req.body.candidate_type;
	}

	if (req.body.subject === "Career Application") {
		const add_row = await sheet.addRow({
			S_No: "=ROW()-2",
			Date: current_date,
			Name: req.body.name,
			Email: req.body.email,
			Contact_Number: req.body.contact,
			Current_Location: req.body.city,
			Profile: req.body.career_position,
			Experience: Candidate_Experience,
			Current_Company: req.body.current_company,
			Current_CTC: req.body.current_ctc,
			Expected_CTC: req.body.expected_ctc,
		});
	} else {
		const add_row = await sheet.addRow({
			Date: current_date,
			Name: req.body.name,
			Email: req.body.email,
			Contact_Number: req.body.contact,
			Which_Services_you_are_looking_for: req.body.services,
			Requirements: req.body.message,
			Lead_Source_From: req.body.subject,
		});
	}

	if (req.body.subject === "Career Application") {
		var userMail = {
			from: process.env.EMAIL,
			to: req.body.email,
			subject: req.body.subject,
			html: user_message_one,
		};
	} else {
		var userMail = {
			from: process.env.EMAIL,
			to: req.body.email,
			subject: req.body.subject,
			html: user_message_two,
		};
	}

	var admin_message = `<p><label>Name : </label>${req.body.name}</p>
    <p><label>Contact : </label>${req.body.contact}</p>`;

	{
		req.body.services
			? (admin_message += `<p><label>Services : </label>${req.body.services}</p>`)
			: "";
	}
	{
		req.body.start_project
			? (admin_message += `<p><label>Start Project : </label>${req.body.start_project}</p>`)
			: "";
	}
	{
		req.body.service_type
			? (admin_message += `<p><label>Type of service : </label>${req.body.service_type}</p>`)
			: "";
	}
	{
		req.body.city
			? (admin_message += `<p><label>City : </label>${req.body.city}</p>`)
			: "";
	}
	{
		req.body.candidate_type
			? (admin_message += `<p><label>Candidate Type : </label>${req.body.candidate_type}</p>`)
			: "";
	}
	if (req.body.candidate_type == "Fresher") {
		{
			req.body.expected_ctc
				? (admin_message += `<p><label>Expected CTC : </label>${req.body.expected_ctc}</p>`)
				: "";
		}
		{
			req.body.career_position
				? (admin_message += `<p><label>Position : </label>${req.body.career_position}</p>`)
				: "";
		}
	} else if (req.body.candidate_type == "Experienced") {
		{
			req.body.current_company
				? (admin_message += `<p><label>Current Company : </label>${req.body.current_company}</p>`)
				: "";
		}
		{
			req.body.current_ctc
				? (admin_message += `<p><label>Current CTC : </label>${req.body.current_ctc}</p>`)
				: "";
		}
		{
			req.body.experience
				? (admin_message += `<p><label>Experience : </label>${req.body.experience}</p>`)
				: "";
		}
	}
	{
		req.body.message
			? (admin_message += `<p><label>Message : </label>${req.body.message}</p>`)
			: "";
	}
	var fileName = req.body.filename;
	var filePath =
		"filesUpload/" +
		year +
		"/" +
		month +
		"/" +
		today_date +
		"/" +
		req.body.filename;

	var email_array = [""];
	var emails =
		"info@conative.in,vivekgupta@conative.in,shikhajain@conative.in";
	// var emails = "citstestdev@gmail.com";
	email_array = emails.split(",");

	if (req.body.sent_to) {
		email_array = req.body.sent_to.split(",");
	}

	if (req.body.filename) {
		var adminMail = {
			from: process.env.EMAIL,
			to: email_array,
			subject: req.body.subject,
			html: admin_message,
			attachments: [
				{
					filename: fileName,
					path: filePath,
					contentType: "application/pdf",
				},
			],
		};
	} else {
		var adminMail = {
			from: process.env.EMAIL,
			to: email_array,
			subject: req.body.subject,
			html: admin_message,
		};
	}

	transporter.sendMail(adminMail, function (err, data) {
		if (err) {
			console.log("Error " + err);
			return false;
		} else {
			fs.unlink(filePath, (err) => {
				if (err && err.code == "ENOENT") {
					console.info("Error! File doesn't exist.");
				} else if (err) {
					console.error("Something went wrong. Please try again later.");
				} else {
					console.info(
						`Successfully removed file with the path of ${filePath}`
					);
				}
			});
			console.log("Sent successfully to Admin");
			res.json({ status: "Sent successfully to User" });
		}
	});

	transporter.sendMail(userMail, function (err, data) {
		if (err) {
			console.log("Error " + err);
			return false;
		} else {
			console.log("Sent successfully to User");
			res.json({ status: "Sent successfully to User" });
		}
	});

	res.send({
		message: "Thanks for contacting us! We will get in touch with you shortly.",
		code: "success",
	});
	return false;
});

app.get("/social-media", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");

		const result = await dbo.collection("socials").find().toArray();
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

app.get("/dashboard", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		let userlogin = await dbo
			.collection("users")
			.findOne({ _id: session.userid });

		const result = await dbo.collection("users").findOne({});
		if (result) {
			return res.render("common/dashboard", {
				title: "dashbord",
				user: result,
				session: session.userid,
				userlogin: userlogin,
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

app.get("/setting", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
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
			res.render("admin/home/setting", {
				title: "setting",
				opt: result,
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
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

app.post("/checklogin", async function (req, res, next) {
	const { Loginmodel, validate } = require("./models/Loginmodel");
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");

		const result = await dbo
			.collection("users")
			.findOne({ email: req.body.email, password: req.body.password });
		if (result) {
			var user = {
				_id: result._id,
				email: result.email,
			};
			var token = jwt.sign(user, "seceret");
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

			if (jwt.verify(token, "seceret")) {
				var decode = jwt.verify(token, "seceret");
				res.cookie(`token`, token, { maxAge: 3000, httpOnly: true });
				sessions.tokenseesion = token;
				//  console.log(req.sessions);
				res.redirect("/portfolio");
			} else {
				res.status(401).json({
					error: "Invalid Token",
				});
			}
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


app.get("/register", async function (req, res, next) {
	let token = req.cookies.token ? true : false;

	if (token) {
		return res.redirect("/home");
	}

	return res.render("common/register");
});

app.get("/admin", (req, res) => {
	let bad_auth = req.query.msg ? true : false;
	let token = req.cookies.token ? true : false;

	if (token) {
		return res.redirect("/dashboard");
	}
	// if there exists, send the error.
	if (bad_auth) {
		return res.render("common/login_1", {
			error: "Invalid username or password",
		});
	} else {
		// else just render the login
		return res.render("common/login_1", { opt: [] });
	}
});

app.get("/home", checkLogin, (req, res) => {
	let username = req.cookies.username;
	let token = req.cookies.token ? true : false;

	if (!token) {
		return res.redirect("/admin");
	}
	// render welcome page
	return res.redirect("/dashboard");
});

app.post("/process_login", async (req, res) => {
	// get the data
	let client;
	try {
		let { username, password } = req.body;
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		const result = await dbo.collection("users").findOne({ email: username });

		if (result) {
			const validPassword = await bcrypt.compare(
				req.body.password,
				result.password
			);
			if (validPassword && username === result.email) {
				var user = {
					_id: result._id,
					email: result.email,
				};
				session.email = result.email;
				session.userid = result._id;
				// res.session("persnalid",result._id);
				// session.massage = "Login successfully";
				var token = jwt.sign(user, "seceret");
				res.cookie("token", token);
				res.cookie("username", username);
				// redirect
				return res.redirect("/dashboard");
			} else {
				return res.redirect("/admin?msg=fail");
			}
		} else {
			return res.redirect("/admin?msg=fail");
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

app.post(
	"/adduser",
	urlencodedParser,
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
					throw new Error("Passwords must be same");
				}
			}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const alert = errors.array();
			res.render("common/register", {
				alert,
			});
		} else {
			const salt = await bcrypt.genSalt(10);
			// console.log("nooo");
			const hashpassword = await bcrypt.hash(req.body.password, salt);

			var myobj = new register({
				username: req.body.username.trim(),
				email: req.body.email.trim(),
				password: hashpassword.trim(),
			});
			myobj.save();
			return res.redirect("/admin");
		}
	}
);

app.get("/logout", (req, res) => {
	try {
		// clear the cookie
		res.clearCookie("token");
		res.clearCookie("username");
		req.flash(
			"success",
			`You've been successfully redirected to the Message route!`
		);
		return res.redirect("/admin");
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "SERVER ERROR", error: error })
	}
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	if (req.originalUrl === "/addnewuser") {
		res.redirect("/register");
	}
	else if (req.originalUrl === "/forgotpassword") {
		res.redirect("/changepassword");
	}
});

app.listen(PORT, () => {
	console.log(`✅ - [PORT :: ${PORT}] SERVER READY `)
});

module.exports = app;
