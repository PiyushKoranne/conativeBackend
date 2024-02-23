var express = require("express");
var router = express.Router();
var multer = require("multer");
var session = require("express-session");
var checkLogin = require("../../middleware/check");
var { upload, url, frontend_url } = require("../constants");

var MongoClient = require("mongodb").MongoClient;

var { ObjectId } = require("mongodb");


router.get("/industries-we-serve", checkLogin, async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		let industriesPosts = await dbo
			.collection("industriesPost")
			.find()
			.sort({ _id: -1 })
			.toArray();
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

		const result = await dbo.collection("option").findOne({});
		if (result) {
			session.message = "";
			res.render("admin/post-types/industriesPost", {
				title: "Industries We Serve Post",
				headermenu: headermenu_dynamic,
				settingmenu: setting_dynamic,
				userlogin: userlogin,
				industriesPosts: industriesPosts,
				opt: result,
				frontend_url: frontend_url,
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

router.post(
	"/industries-post",
	upload.fields([
		{ name: "project_video", maxCount: 2 },
		{ name: "banner_main_image", maxCount: 2 },
		{ name: "banner_second_image", maxCount: 2 },
		{ name: "dimension_image_one", maxCount: 2 },
		{ name: "dimension_image_two", maxCount: 2 },
		{ name: "dimension_image_three", maxCount: 2 },
		{ name: "dimension_image_four", maxCount: 2 },
		{ name: "dimension_image_five", maxCount: 2 },
		{ name: "dimension_image_six", maxCount: 2 },
		{ name: "dimension_image_seven", maxCount: 2 },
		{ name: "dimension_image_eight", maxCount: 2 },
		{ name: "industries_image_one", maxCount: 2 },
		{ name: "industries_image_two", maxCount: 2 },
		{ name: "industries_image_three", maxCount: 2 },
		{ name: "industries_image_four", maxCount: 2 },
		{ name: "industries_image_five", maxCount: 2 },
		{ name: "industries_image_six", maxCount: 2 },
		{ name: "industries_image_seven", maxCount: 2 },
		{ name: "industries_image_eight", maxCount: 2 },
		{ name: "brand_image_one", maxCount: 2 },
		{ name: "brand_image_two", maxCount: 2 },
		{ name: "brand_image_three", maxCount: 2 },
		{ name: "our_technology_image", maxCount: 2 },
		{ name: "toolkit_image_one", maxCount: 2 },
		{ name: "toolkit_image_two", maxCount: 2 },
		{ name: "toolkit_image_three", maxCount: 2 },
		{ name: "language_image_one", maxCount: 2 },
		{ name: "language_image_two", maxCount: 2 },
		{ name: "language_image_three", maxCount: 2 },
		{ name: "sdk_image_one", maxCount: 2 },
		{ name: "sdk_image_two", maxCount: 2 },
		{ name: "sdk_image_three", maxCount: 2 },
		{ name: "ask_us_image", maxCount: 2 },
	]),
	async function (req, res, next) {
		let client;
		try {
			client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
			const dbo = client.db("conative");
			var project_video_name = "";
			var banner_main_image_name = "";
			var banner_second_image_name = "";
			var dimension_image_one_name = "";
			var dimension_image_two_name = "";
			var dimension_image_three_name = "";
			var dimension_image_four_name = "";
			var dimension_image_five_name = "";
			var dimension_image_six_name = "";
			var dimension_image_seven_name = "";
			var dimension_image_eight_name = "";
			var industries_image_one_name = "";
			var industries_image_two_name = "";
			var industries_image_three_name = "";
			var industries_image_four_name = "";
			var industries_image_five_name = "";
			var industries_image_six_name = "";
			var industries_image_seven_name = "";
			var industries_image_eight_name = "";
			var brand_image_one_name = "";
			var brand_image_two_name = "";
			var brand_image_three_name = "";
			var our_technology_image_name = "";
			var toolkit_image_one_name = "";
			var toolkit_image_two_name = "";
			var toolkit_image_three_name = "";
			var language_image_one_name = "";
			var language_image_two_name = "";
			var language_image_three_name = "";
			var sdk_image_one_name = "";
			var sdk_image_two_name = "";
			var sdk_image_three_name = "";
			var ask_us_image_name = "";

			if (req.files["project_video"]) {
				const project_video = req.files["project_video"];
				project_video_name = project_video[0].filename;
			} else if (req.body.pre_project_video != "") {
				project_video_name = req.body.pre_project_video;
			}
			if (req.files["banner_main_image"]) {
				const banner_main_image = req.files["banner_main_image"];
				banner_main_image_name = banner_main_image[0].filename;
			} else if (req.body.pre_banner_main_image != "") {
				banner_main_image_name = req.body.pre_banner_main_image;
			}
			if (req.files["banner_second_image"]) {
				const banner_second_image = req.files["banner_second_image"];
				banner_second_image_name = banner_second_image[0].filename;
			} else if (req.body.pre_banner_second_image != "") {
				banner_second_image_name = req.body.pre_banner_second_image;
			}

			if (req.files["dimension_image_one"]) {
				const dimension_image_one = req.files["dimension_image_one"];
				dimension_image_one_name = dimension_image_one[0].filename;
			} else if (req.body.pre_dimension_image_one != "") {
				dimension_image_one_name = req.body.pre_dimension_image_one;
			}
			if (req.files["dimension_image_two"]) {
				const dimension_image_two = req.files["dimension_image_two"];
				dimension_image_two_name = dimension_image_two[0].filename;
			} else if (req.body.pre_dimension_image_two != "") {
				dimension_image_two_name = req.body.pre_dimension_image_two;
			}
			if (req.files["dimension_image_three"]) {
				const dimension_image_three = req.files["dimension_image_three"];
				dimension_image_three_name = dimension_image_three[0].filename;
			} else if (req.body.pre_dimension_image_three != "") {
				dimension_image_three_name = req.body.pre_dimension_image_three;
			}
			if (req.files["dimension_image_four"]) {
				const dimension_image_four = req.files["dimension_image_four"];
				dimension_image_four_name = dimension_image_four[0].filename;
			} else if (req.body.pre_dimension_image_four != "") {
				dimension_image_four_name = req.body.pre_dimension_image_four;
			}
			if (req.files["dimension_image_five"]) {
				const dimension_image_five = req.files["dimension_image_five"];
				dimension_image_five_name = dimension_image_five[0].filename;
			} else if (req.body.pre_dimension_image_five != "") {
				dimension_image_five_name = req.body.pre_dimension_image_five;
			}
			if (req.files["dimension_image_six"]) {
				const dimension_image_six = req.files["dimension_image_six"];
				dimension_image_six_name = dimension_image_six[0].filename;
			} else if (req.body.pre_dimension_image_six != "") {
				dimension_image_six_name = req.body.pre_dimension_image_six;
			}
			if (req.files["dimension_image_seven"]) {
				const dimension_image_seven = req.files["dimension_image_seven"];
				dimension_image_seven_name = dimension_image_seven[0].filename;
			} else if (req.body.pre_dimension_image_seven != "") {
				dimension_image_seven_name = req.body.pre_dimension_image_seven;
			}
			if (req.files["dimension_image_eight"]) {
				const dimension_image_eight = req.files["dimension_image_eight"];
				dimension_image_eight_name = dimension_image_eight[0].filename;
			} else if (req.body.pre_dimension_image_eight != "") {
				dimension_image_eight_name = req.body.pre_dimension_image_eight;
			}

			if (req.files["industries_image_one"]) {
				const industries_image_one = req.files["industries_image_one"];
				industries_image_one_name = industries_image_one[0].filename;
			} else if (req.body.pre_industries_image_one != "") {
				industries_image_one_name = req.body.pre_industries_image_one;
			}
			if (req.files["industries_image_two"]) {
				const industries_image_two = req.files["industries_image_two"];
				industries_image_two_name = industries_image_two[0].filename;
			} else if (req.body.pre_industries_image_two != "") {
				industries_image_two_name = req.body.pre_industries_image_two;
			}
			if (req.files["industries_image_three"]) {
				const industries_image_three = req.files["industries_image_three"];
				industries_image_three_name = industries_image_three[0].filename;
			} else if (req.body.pre_industries_image_three != "") {
				industries_image_three_name = req.body.pre_industries_image_three;
			}
			if (req.files["industries_image_four"]) {
				const industries_image_four = req.files["industries_image_four"];
				industries_image_four_name = industries_image_four[0].filename;
			} else if (req.body.pre_industries_image_four != "") {
				industries_image_four_name = req.body.pre_industries_image_four;
			}
			if (req.files["industries_image_five"]) {
				const industries_image_five = req.files["industries_image_five"];
				industries_image_five_name = industries_image_five[0].filename;
			} else if (req.body.pre_industries_image_five != "") {
				industries_image_five_name = req.body.pre_industries_image_five;
			}
			if (req.files["industries_image_six"]) {
				const industries_image_six = req.files["industries_image_six"];
				industries_image_six_name = industries_image_six[0].filename;
			} else if (req.body.pre_industries_image_six != "") {
				industries_image_six_name = req.body.pre_industries_image_six;
			}
			if (req.files["industries_image_seven"]) {
				const industries_image_seven = req.files["industries_image_seven"];
				industries_image_seven_name = industries_image_seven[0].filename;
			} else if (req.body.pre_industries_image_seven != "") {
				industries_image_seven_name = req.body.pre_industries_image_seven;
			}
			if (req.files["industries_image_eight"]) {
				const industries_image_eight = req.files["industries_image_eight"];
				industries_image_eight_name = industries_image_eight[0].filename;
			} else if (req.body.pre_industries_image_eight != "") {
				industries_image_eight_name = req.body.pre_industries_image_eight;
			}

			if (req.files["brand_image_one"]) {
				const brand_image_one = req.files["brand_image_one"];
				brand_image_one_name = brand_image_one[0].filename;
			} else if (req.body.pre_brand_image_one != "") {
				brand_image_one_name = req.body.pre_brand_image_one;
			}
			if (req.files["brand_image_two"]) {
				const brand_image_two = req.files["brand_image_two"];
				brand_image_two_name = brand_image_two[0].filename;
			} else if (req.body.pre_brand_image_two != "") {
				brand_image_two_name = req.body.pre_brand_image_two;
			}
			if (req.files["brand_image_three"]) {
				const brand_image_three = req.files["brand_image_three"];
				brand_image_three_name = brand_image_three[0].filename;
			} else if (req.body.pre_brand_image_three != "") {
				brand_image_three_name = req.body.pre_brand_image_three;
			}

			if (req.files["toolkit_image_one"]) {
				const toolkit_image_one = req.files["toolkit_image_one"];
				toolkit_image_one_name = toolkit_image_one[0].filename;
			} else if (req.body.pre_toolkit_image_one != "") {
				toolkit_image_one_name = req.body.pre_toolkit_image_one;
			}
			if (req.files["toolkit_image_two"]) {
				const toolkit_image_two = req.files["toolkit_image_two"];
				toolkit_image_two_name = toolkit_image_two[0].filename;
			} else if (req.body.pre_toolkit_image_two != "") {
				toolkit_image_two_name = req.body.pre_toolkit_image_two;
			}
			if (req.files["toolkit_image_three"]) {
				const toolkit_image_three = req.files["toolkit_image_three"];
				toolkit_image_three_name = toolkit_image_three[0].filename;
			} else if (req.body.pre_toolkit_image_three != "") {
				toolkit_image_three_name = req.body.pre_toolkit_image_three;
			}

			if (req.files["language_image_one"]) {
				const language_image_one = req.files["language_image_one"];
				language_image_one_name = language_image_one[0].filename;
			} else if (req.body.pre_language_image_one != "") {
				language_image_one_name = req.body.pre_language_image_one;
			}
			if (req.files["language_image_two"]) {
				const language_image_two = req.files["language_image_two"];
				language_image_two_name = language_image_two[0].filename;
			} else if (req.body.pre_language_image_two != "") {
				language_image_two_name = req.body.pre_language_image_two;
			}
			if (req.files["language_image_three"]) {
				const language_image_three = req.files["language_image_three"];
				language_image_three_name = language_image_three[0].filename;
			} else if (req.body.pre_language_image_three != "") {
				language_image_three_name = req.body.pre_language_image_three;
			}

			if (req.files["sdk_image_one"]) {
				const sdk_image_one = req.files["sdk_image_one"];
				sdk_image_one_name = sdk_image_one[0].filename;
			} else if (req.body.pre_sdk_image_one != "") {
				sdk_image_one_name = req.body.pre_sdk_image_one;
			}
			if (req.files["sdk_image_two"]) {
				const sdk_image_two = req.files["sdk_image_two"];
				sdk_image_two_name = sdk_image_two[0].filename;
			} else if (req.body.pre_sdk_image_two != "") {
				sdk_image_two_name = req.body.pre_sdk_image_two;
			}
			if (req.files["sdk_image_three"]) {
				const sdk_image_three = req.files["sdk_image_three"];
				sdk_image_three_name = sdk_image_three[0].filename;
			} else if (req.body.pre_sdk_image_three != "") {
				sdk_image_three_name = req.body.pre_sdk_image_three;
			}

			if (req.files["our_technology_image"]) {
				const our_technology_image = req.files["our_technology_image"];
				our_technology_image_name = our_technology_image[0].filename;
			} else if (req.body.pre_our_technology_image != "") {
				our_technology_image_name = req.body.pre_our_technology_image;
			}

			if (req.files["ask_us_image"]) {
				const ask_us_image = req.files["ask_us_image"];
				ask_us_image_name = ask_us_image[0].filename;
			} else if (req.body.pre_ask_us_image != "") {
				ask_us_image_name = req.body.pre_ask_us_image;
			}

			if (req.body.editid != "") {
				var myobj = {
					$set: {
						meta_title: req.body.meta_title.trim(),
						meta_desc: req.body.meta_desc.trim(),
						meta_keywords: req.body.meta_keywords.trim(),
						title: req.body.title.trim(),
						slug: req.body.title
							.toLowerCase()
							.replace(/[^\w ]+/g, "")
							.replace(/ +/g, "-"),
						banner_title: req.body.banner_title.trim(),
						banner_desc: req.body.banner_desc.trim(),
						view_project_url: req.body.view_project_url.trim(),
						content: req.body.content.trim(),
						dimension_title_one: req.body.dimension_title_one.trim(),
						dimension_title_two: req.body.dimension_title_two.trim(),
						dimension_title_three: req.body.dimension_title_three.trim(),
						dimension_title_four: req.body.dimension_title_four.trim(),
						dimension_title_five: req.body.dimension_title_five.trim(),
						dimension_title_six: req.body.dimension_title_six.trim(),
						dimension_title_seven: req.body.dimension_title_seven.trim(),
						dimension_title_eight: req.body.dimension_title_eight.trim(),
						industries_title: req.body.industries_title.trim(),
						industries_title_one: req.body.industries_title_one.trim(),
						industries_title_two: req.body.industries_title_two.trim(),
						industries_title_three: req.body.industries_title_three.trim(),
						industries_title_four: req.body.industries_title_four.trim(),
						industries_title_five: req.body.industries_title_five.trim(),
						industries_title_six: req.body.industries_title_six.trim(),
						industries_title_seven: req.body.industries_title_seven.trim(),
						industries_title_eight: req.body.industries_title_eight.trim(),
						brand_title: req.body.brand_title.trim(),
						brand_heading: req.body.brand_heading.trim(),
						our_technology_title: req.body.our_technology_title.trim(),
						ask_us_title: req.body.ask_us_title.trim(),
						ask_us_heading: req.body.ask_us_heading.trim(),
						toolkit_title_one: req.body.toolkit_title_one.trim(),
						toolkit_title_two: req.body.toolkit_title_two.trim(),
						toolkit_title_three: req.body.toolkit_title_three.trim(),
						language_title_one: req.body.language_title_one.trim(),
						language_title_two: req.body.language_title_two.trim(),
						language_title_three: req.body.language_title_three.trim(),
						sdk_title_one: req.body.sdk_title_one.trim(),
						sdk_title_two: req.body.sdk_title_two.trim(),
						sdk_title_three: req.body.sdk_title_three.trim(),
						ask_us_bg_text: req.body.ask_us_bg_text.trim(),
						project_video_name: project_video_name,
						banner_main_image_name: banner_main_image_name,
						banner_second_image_name: banner_second_image_name,
						dimension_image_one_name: dimension_image_one_name,
						dimension_image_two_name: dimension_image_two_name,
						dimension_image_three_name: dimension_image_three_name,
						dimension_image_four_name: dimension_image_four_name,
						dimension_image_five_name: dimension_image_five_name,
						dimension_image_six_name: dimension_image_six_name,
						dimension_image_seven_name: dimension_image_seven_name,
						dimension_image_eight_name: dimension_image_eight_name,
						industries_image_one_name: industries_image_one_name,
						industries_image_two_name: industries_image_two_name,
						industries_image_three_name: industries_image_three_name,
						industries_image_four_name: industries_image_four_name,
						industries_image_five_name: industries_image_five_name,
						industries_image_six_name: industries_image_six_name,
						industries_image_seven_name: industries_image_seven_name,
						industries_image_eight_name: industries_image_eight_name,
						brand_image_one_name: brand_image_one_name,
						brand_image_two_name: brand_image_two_name,
						brand_image_three_name: brand_image_three_name,
						our_technology_image_name: our_technology_image_name,
						toolkit_image_one_name: toolkit_image_one_name,
						toolkit_image_two_name: toolkit_image_two_name,
						toolkit_image_three_name: toolkit_image_three_name,
						language_image_one_name: language_image_one_name,
						language_image_two_name: language_image_two_name,
						language_image_three_name: language_image_three_name,
						sdk_image_one_name: sdk_image_one_name,
						sdk_image_two_name: sdk_image_two_name,
						sdk_image_three_name: sdk_image_three_name,
						ask_us_image_name: ask_us_image_name,
					},
				};
				const result = await dbo.collection("industriesPost").updateOne(
					{ _id: new ObjectId(req.body.editid) });
				if (result) {
					session.message = "industriesPost updated successfully";
					res.status(200).json(result)
				} else {
					session.message = "industriesPost updated successfully";
					res.status(400).json({ message: "Data not found" })
				}
			} else if (req.body.editid == "") {
				var myobj = {
					meta_title: req.body.meta_title.trim(),
					meta_desc: req.body.meta_desc.trim(),
					meta_keywords: req.body.meta_keywords.trim(),
					title: req.body.title.trim(),
					slug: req.body.title
						.toLowerCase()
						.replace(/[^\w ]+/g, "")
						.replace(/ +/g, "-"),
					banner_title: req.body.banner_title.trim(),
					banner_desc: req.body.banner_desc.trim(),
					view_project_url: req.body.view_project_url.trim(),
					content: req.body.content.trim(),
					dimension_title_one: req.body.dimension_title_one.trim(),
					dimension_title_two: req.body.dimension_title_two.trim(),
					dimension_title_three: req.body.dimension_title_three.trim(),
					dimension_title_four: req.body.dimension_title_four.trim(),
					dimension_title_five: req.body.dimension_title_five.trim(),
					dimension_title_six: req.body.dimension_title_six.trim(),
					dimension_title_seven: req.body.dimension_title_seven.trim(),
					dimension_title_eight: req.body.dimension_title_eight.trim(),
					industries_title: req.body.industries_title.trim(),
					industries_title_one: req.body.industries_title_one.trim(),
					industries_title_two: req.body.industries_title_two.trim(),
					industries_title_three: req.body.industries_title_three.trim(),
					industries_title_four: req.body.industries_title_four.trim(),
					industries_title_five: req.body.industries_title_five.trim(),
					industries_title_six: req.body.industries_title_six.trim(),
					industries_title_seven: req.body.industries_title_seven.trim(),
					industries_title_eight: req.body.industries_title_eight.trim(),
					brand_title: req.body.brand_title.trim(),
					brand_heading: req.body.brand_heading.trim(),
					our_technology_title: req.body.our_technology_title.trim(),
					ask_us_title: req.body.ask_us_title.trim(),
					ask_us_heading: req.body.ask_us_heading.trim(),
					toolkit_title_one: req.body.toolkit_title_one.trim(),
					toolkit_title_two: req.body.toolkit_title_two.trim(),
					toolkit_title_three: req.body.toolkit_title_three.trim(),
					language_title_one: req.body.language_title_one.trim(),
					language_title_two: req.body.language_title_two.trim(),
					language_title_three: req.body.language_title_three.trim(),
					sdk_title_one: req.body.sdk_title_one.trim(),
					sdk_title_two: req.body.sdk_title_two.trim(),
					sdk_title_three: req.body.sdk_title_three.trim(),
					ask_us_bg_text: req.body.ask_us_bg_text.trim(),
					project_video_name: project_video_name,
					banner_main_image_name: banner_main_image_name,
					banner_second_image_name: banner_second_image_name,
					dimension_image_one_name: dimension_image_one_name,
					dimension_image_two_name: dimension_image_two_name,
					dimension_image_three_name: dimension_image_three_name,
					dimension_image_four_name: dimension_image_four_name,
					dimension_image_five_name: dimension_image_five_name,
					dimension_image_six_name: dimension_image_six_name,
					dimension_image_seven_name: dimension_image_seven_name,
					dimension_image_eight_name: dimension_image_eight_name,
					industries_image_one_name: industries_image_one_name,
					industries_image_two_name: industries_image_two_name,
					industries_image_three_name: industries_image_three_name,
					industries_image_four_name: industries_image_four_name,
					industries_image_five_name: industries_image_five_name,
					industries_image_six_name: industries_image_six_name,
					industries_image_seven_name: industries_image_seven_name,
					industries_image_eight_name: industries_image_eight_name,
					brand_image_one_name: brand_image_one_name,
					brand_image_two_name: brand_image_two_name,
					brand_image_three_name: brand_image_three_name,
					our_technology_image_name: our_technology_image_name,
					toolkit_image_one_name: toolkit_image_one_name,
					toolkit_image_two_name: toolkit_image_two_name,
					toolkit_image_three_name: toolkit_image_three_name,
					language_image_one_name: language_image_one_name,
					language_image_two_name: language_image_two_name,
					language_image_three_name: language_image_three_name,
					sdk_image_one_name: sdk_image_one_name,
					sdk_image_two_name: sdk_image_two_name,
					sdk_image_three_name: sdk_image_three_name,
					ask_us_image_name: ask_us_image_name,
				};

				let result = await dbo.collection("industriesPost").insertOne(myobj);
				if (result) {
					session.message = "industriesPost added successfully";
					res.status(200).json(result)
				} else {
					session.message = "industriesPost added successfully";
					res.status(400).json({ message: "Data not found" })
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

router.get("/getIndustriesPost/:id", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		var aid = req.params.id;

		const result = await dbo
								.collection("industriesPost")
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

router.get("/industries-single/:slug", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		if (!req.params.slug) {
			res.status(404).json({ err: "slug not found" });
			process.exit(1);
		}
		const result = await dbo
								.collection("industriesPost")
								.findOne({ slug: req.params.slug });
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

router.get("/industriespost-remove/:id", async function (req, res, next) {
	let client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
		const dbo = client.db("conative");
		
		const result = await dbo.collection("industriesPost").remove({ _id: new ObjectId(req.params.id) });
		if (result) {
			session.message = "industriesPost deleted successfully";
			res.redirect("/industries-we-serve");
		} else {
			session.message = "failed to delete industriesPost";
			res.redirect("/industries-we-serve");
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
