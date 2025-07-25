const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Category = require("../model/Category");
const Transaction = require("../model/Transaction");

//! User registration

const categoryController = {
  //!add
  create: asyncHandler(async (req, res) => {
    const { name, type } = req.body;
    if (!name || !type) {
      throw new Error("Name and type are required for creating a category");
    }
    const normalizedName = name.toLowerCase();
    //!check if type is valid
    const validTypes = ["income", "expense"];
    if (!validTypes.includes(type.toLowerCase())) {
      throw new Error("Invalid category type" + type);
    }
    //!check if category already exists on the user
    const categoryExists = await Category.findOne({
      name: normalizedName,
      user: req.user,
    });
    if (categoryExists) {
      throw new Error(
        `Category ${categoryExists.name} already exists in the database`
      );
    }
    const category = await Category.create({
      name: normalizedName,
      user: req.user,
      type,
    });
    res.status(201).json(category);
  }),
  //!lists
  lists: asyncHandler(async (req, res) => {
    const categories = await Category.find({ user: req.user });
    res.status(200).json(categories);
  }),
  //!update
  update: asyncHandler(async (req, res) => {
    const categoryId = req.params;
    const { type, name } = req.body;
    const normalizedName = name.toLowerCase();
    const category = await Category.findById(categoryId);
    if (!category && category.user.toString() == req.user.toString()) {
      throw new Error("Category not found or user not authorized");
    }
    const oldName = category.name;
    //!update category properties
    category.name = name;
    category.type = type;
    const updatedCategory = await category.save();
    //update affected transactions
    if (oldName !== updatedCategory.name) {
      await Transaction.updateMany(
        {
          user: req.user,
          category: oldName,
        },
        { set: { category: updatedCategory.name } }
      );
    }
    res.json(updatedCategory);
  }),
  //!delete
  delete: asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category && category.user.toString() === req.user.toString()) {
      //!update transaction that have this category
      const defaultCategory = "Uncategorized";
      await Transaction.updateMany(
        { user: req.user, category: category.name },
        { $set: { category: defaultCategory } }
      );
      //!remove category
      await Category.findByIdAndDelete(req.params.id);
      res.json({ message: "Category removed and transactions updated" });
    } else {
      res.json({ message: "Category not found or user not authorized" });
    }
  }),
};
module.exports = categoryController;
