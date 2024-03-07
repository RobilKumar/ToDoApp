const accessModel = require("../models/acessModel");
const rateLimiting = async (req, res, next) => {
  const sessionId = req.session.id;

  // check if thsi the request for the first time or not

  try {
    const accessDb = await accessModel.findOne({ sessionId: sessionId });
    console.log(accessDb);
    // first request , create an entry in the db
    if (!accessDb) {
      const accessObj = new accessModel({
        sessionId: sessionId,
        time: Date.now(),
      });

      await accessObj.save();
      next(); // it will call the function from where it is called
      return;
    }

    // 2-nt request
    // time compare

    const diff = (Date.now() - accessDb.time) / 1000;
    if (diff < 1) {
      return res.send({
        status: 400,
        message: "Too many request, please wait for some time",
      });
    }

    // update the time
    await accessModel.findOneAndUpdate(
      { sessionId: sessionId },
      { time: Date.now() }
    );
    next();
  } catch (error) {
    return res.send({
        status:500,
        message:"Database error",
        error:error,
    });
  }
};

module.exports= rateLimiting;
