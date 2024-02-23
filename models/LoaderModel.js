const mongoose = require('mongoose')

const loaderSchema = new mongoose.Schema({

    eventName :{
        eventName:String,
        eventDate : String,
        eventDuration : String,
        classRefForEvent : String,
        firstTitle : String,
        secondTitle : String,
        conativeLogo : String,
        conativeLogoAlt : String,
        leftHangingImage : String,
        bottomLeftImage : String,
        bottomLeftImageAlt : String,
        bottomRightImage : String,
        bottomRightImageAlt : String,
    }

})

const loaderModel = mongoose.model("eventLoaders",loaderSchema);

module.exports = loaderModel;