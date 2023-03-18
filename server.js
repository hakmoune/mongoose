const moongoose = require("mongoose");

//CNX to our Database
moongoose
  .connect("mongodb://localhost:27017/moongose_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Schema
const courseSchema = moongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
  author: { type: String, required: true },
  price: {
    type: Number,
    required: function() {
      return this.isPublished; // Quand il y a le mot clé "this" arrow function ne marche pas
    },
    get: v => Math.round(v),
    set: v => Math.round(v)
  },
  date: { type: Date, default: Date.now(), required: true },
  //tags: [String], // Array type String
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: val => val && val.length > 0,
      message: "Please entre at least one Tag"
    }
  },
  productCategory: {
    type: String,
    enum: ["database", "backend", "frontend"],
    required: true,
    lowercase: true,
    trim: true //Supprimer les espaces
  },
  isPublished: { type: Boolean, required: true }
});

//Model
const Course = moongoose.model("Course", courseSchema);

//CRUD OPERATIONS
async function CreateCourse() {
  const course = new Course({
    name: "lA VIDE lOCA",
    author: "My-self",
    price: 499.99545,
    tags: [
      "Back end",
      "NodeJS",
      "Full Stack JS",
      "Express",
      "Moongose",
      "MongoDB"
    ],
    productCategory: "BACKEND  ",
    isPublished: true
  });

  try {
    const result = await course.save();
    console.log(result);
  } catch (e) {
    //Errors return collections of errors available
    for (i in e.errors) {
      console.log(e.errors[i].message);
    }
  }
}

CreateCourse();

async function GetAll() {
  const result = await Course.find({ _id: "6415ef611ad0a9e1a2a7b534" });
  console.log(result);
}

//GetAll();

//Get one cour
async function getCourse() {
  const course = await Course.findOne({ _id: "641201d142185e1e0a2fb28b" });
  console.log(course);
}

async function GetCourses() {
  const courses = await Course.find({
    name: "Mehdi Hakmoune",
    isPublished: true
  })
    .limit(1)
    .sort({ price: -1 })
    .select({ name: 1, price: 1 });

  console.log(courses);
}

//Filtre Operatiion
async function GetCoursesFilter() {
  /*const course = await Course.find({
    price: { $lte: 600 },
    name: "Mehdi",
    isPublished: false
    //price: { $gte: 500 }
    //price: { $in: [499.99, 599.99] }
  });*/

  /*const course = await Course.find().and([
    { name: "Hakmoune" },
    { author: "Moi-meme" }
  ]);*/

  const course = await Course.find({
    name: /.*hak.*/i
  }).count();
  console.log(course);
}

async function Paging() {
  const pageNumber = 1;
  const pageSize = 5;

  const courses = await Course.find()
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .select({ name: 1 });

  console.log(courses);
}

async function UodateCourse(id) {
  /*const course = await Course.updateOne(
    { _id: id },
    {
      name: "Alal Jalal Boulaq"
    }
  );*/

  const course = await Course.findById((id = "641200a67e8dea93c7c393d9"));
  /*course.author = "Khaba Benjdida";
  course.name = "Mouhcine Metouali";*/
  course.set({
    author: "Khaba Hamza Rajaoui",
    name: "Mouhcine Metouali"
  });

  const result = await course.save();

  console.log("Well Updated" + result);
}

async function DeleteCourse(id = "641201d142185e1e0a2fb28b") {
  //const result = await Course.deleteOne({ _id: id }); // Delete
  const result = await Course.findByIdAndDelete({ _id: id }); // Delete and return the object deleted
  console.log("Well Deleted" + result);
}
