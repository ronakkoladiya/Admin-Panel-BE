const bcrypt = require("bcrypt");
const constant = require("../Utils/constant");
const handleErrorResponse = require("../Utils/error/handleErrorResponse");
const User = require("../Models/UserSchema");
const Salary = require("../Models/SalarySchema");
const Password = require("../Models/PasswordSchema");
const UserRole = require("../Models/UserRoleSchema");
const {
  addUserBodySchema,
  updateUserBodySchema,
} = require("../Utils/validation/BodySchema");
const { schemaErrorResponse } = require("../Utils/error/schemaError");

// Add an User
const addUser = async (req, res) => {
  try {
    const { value, error: validationError } = addUserBodySchema.validate(
      req.body,
      {
        abortEarly: false,
        errors: { wrap: { label: '"' } },
      }
    );
    if (validationError) {
      return schemaErrorResponse({ res, error: validationError });
    }

    const userIsExist = await User.checkIsExist({ email: value.email });
    if (userIsExist) {
      return res.status(400).json({
        message: constant.ERROR.EMAIL_EXISTS_MESSAGE,
      });
    }
    const hashPassword = await bcrypt.hash(value.password, 10); // Generate salt and hash in one step

    const userData = { ...value, password: undefined, salary: undefined }; // Remove password and salary from userData
    const user = await User.create(userData);
    await Password.create({ password: hashPassword, userId: user._id });
    const salaryInfo = {
      Date: new Date().toISOString().slice(0, 10),
      amount: value.salary,
    };
    await Salary.create({
      userId: req.query.id,
      salaryInfo: [salaryInfo], // Create new salary info array
    });

    res
      .status(200)
      .json({ message: constant.SUCCESS.DATA_ADD_SUCCESSFULLY_MESSAGE });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { value, error: validationError } = updateUserBodySchema.validate(
      req.body,
      {
        abortEarly: false,
      }
    );
    if (validationError) {
      return schemaErrorResponse({ res, error: validationError });
    }
    const userData = { ...value, salary: undefined, password: undefined };
    await User.updateOne({ _id: req.query.id }, userData);

    if (value.password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(value.password, salt);
      await Password.updateOne(
        { userId: req.query.id },
        { $set: { password: hashPassword } }
      );
    }

    const salaryInfo = {
      Date: new Date().toISOString().slice(0, 10),
      amount: value.salary,
    };

    const getUserSalaryInfo = await Salary.findOne({ userId: req.query.id });
    if (!getUserSalaryInfo) {
      await Salary.create({
        userId: req.query.id,
        salaryInfo: [salaryInfo], // Create new salary info array
      });
    } else {
      // Update the existing Salary document to push a new salaryInfo object
      await Salary.updateOne(
        { userId: req.query.id },
        {
          $push: { salaryInfo: salaryInfo },
        }
      );
    }
    res.status(200).json({
      message: constant.SUCCESS.DATA_UPDATE_SUCCESSFULLY_MESSAGE,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

// Get all users or by id
const getUser = async (req, res) => {
  try {
    if (req.user.userType === "employee") {
      var userData = await User.find({ _id: req.user._id })
          .select("-updatedAt -createdAt -__v -tokens")
          .populate("designation", "_id name")
          .populate("branch", "_id branchName")
          .populate("userRole", "id name");
      // res.status(200).json({ message: constant.ERROR.ACCESS });
    } else {
      const query = {};
      Object.keys(req.query).forEach((key) => {
        query[key] = req.query[key];
      });
      var userData = await User.find(query)
        .select("-updatedAt -createdAt -__v -tokens")
        .populate("designation", "_id name")
        .populate("branch", "_id branchName")
        .populate("userRole", "id name");
    }
    res.status(200).json({ data: userData });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

// user get by designation
const getUserByDesignation = async (req, res) => {
  try {
    if (req.user.userType === "employee") {
      res.status(200).json({ message: constant.ERROR.ACCESS });
    } else {
      const query = {};
      Object.keys(req.query).forEach((key) => {
        query[key] = req.query[key];
      });
      const userData = await User.find(query)
        .sort({ $natural: -1 })
        .select("_id firstName lastName technology")
        .populate("technology", "name");
      res.send(userData);
    }
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

// Upload user data file
const uploadUsersSheet = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: constant.VALIDATION.NOT_FOUND_FILE,
      });
    }

    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();

    let dataArray;

    if (
      fileExtension === "csv" ||
      fileExtension === "xls" ||
      fileExtension === "xlsx"
    ) {
      dataArray = await parseExcelFile(req.file);
    } else {
      return res.status(400).json({
        message: constant.VALIDATION.INVALID_FILE_MESSAGE,
      });
    }

    const insertedUsers = await insertUsers(dataArray);

    res.send({
      message: constant.SUCCESS.DATA_ADD_SUCCESSFULLY_MESSAGE,
      insertedUsers,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

// Parse excel file
const parseExcelFile = async (file) => {
  try {
    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet);
  } catch (error) {
    throw error;
  }
};

// Insert sheet user data query
const insertUsers = async (dataArray) => {
  try {
    const insertedUsers = await Promise.all(
      dataArray.map(async (obj) => {
        const user = {
          firstName: obj["First Name"],
          middleName: obj["Middle Name"],
          lastName: obj["Last Name"],
          email: obj["Email"],
          gender: obj["Gender"],
          userType: obj["User Type"],
          phone: obj["Phone Number"],
          joinDate: obj["Date Of Joining"],
          branch: obj["Branch"],
          designation: obj["Designation"],
          dateOfLeaving: obj["Date Of Leaving"],
          profilePicture: obj["Profile Picture"],
          dateOfBirth: obj["Birth Date"],
          address: obj["Address"],
          userRole: obj["User Role"],
        };
        const existingUser = await Employee.findOne({ email: user.email });
        if (!existingUser) {
          const user = await User.create(user);
          const hashPassword = await bcrypt.hash(obj["Password"], 10); // Generate salt and hash in one step
          await Password.create({ password: hashPassword, userId: user._id });
          return user;
        }
      })
    );

    return insertedUsers.filter(Boolean); // Remove undefined values from the array
  } catch (error) {
    throw error;
  }
};

// insert user roles from json file
const insertUserRole = async (req, res) => {
  try {
    const seedData = require("../seeder/userRole.json");
    const userRole = await UserRole.insertMany(seedData);
    res.send(userRole);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

// get user role
const getUserRole = async (req, res) => {
  try {
    const userRole = await UserRole.find().select("_id name");
    res.send(userRole);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

module.exports = {
  addUser,
  updateUser,
  getUser,
  getUserByDesignation,
  uploadUsersSheet,
  insertUserRole,
  getUserRole,
};
