const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
const app = express();

//!connect to mongooe
mongoose
  .connect("mongodb+srv://admin:admin123@cluster0.cqvb3bk.mongodb.net/")
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log(e));

//!middlewares
app.use(express.json());
//!Routes
app.use("/", userRouter);
//!start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on this port ${PORT}`));
