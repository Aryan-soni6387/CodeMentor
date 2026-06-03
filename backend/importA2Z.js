const mongoose = require("mongoose");
const SheetProblem = require("./models/SheetProblem");
const data = require("./a2z.json");

require("dotenv").config();

async function importData() {

  try {

    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB Connected");

    await SheetProblem.deleteMany({});

    console.log("Old problems deleted");

    await SheetProblem.insertMany(data);

    console.log(
      `Imported ${data.length} problems`
    );

    process.exit();

  } catch (error) {

    console.log(error);
  }
}

importData();