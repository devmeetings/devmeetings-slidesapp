db.slidesaves.find({}).toArray().forEach( function (slidesave) {
    if (!slidesave.slide || !slidesave.slide.content) {
        return;
    }
    db.slidesaves.update({
        _id: slidesave._id 
    }, {
        $set: {
            slide: slidesave.slide.content
        }
    });
});
