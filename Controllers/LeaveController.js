const Leave = require("../Models/LeaveSchema");
const { leaveBodySchema } = require("../Utils/validation/BodySchema");
const handleErrorResponse = require("../Utils/error/handleErrorResponse");
const { schemaErrorResponse } = require("../Utils/error/schemaError");
const constant = require("../Utils/constant");

const addLeave = async (req, res) => {
  try {
    const { value, error: validationError } = leaveBodySchema.validate(
      req.body,
      {
        abortEarly: false,
      }
    );
    if (validationError) {
      return schemaErrorResponse({ res, error: validationError });
    }

    const addLeaveData = { ...value, status: 'Pending' };
    await Leave.create(addLeaveData);
    res
      .status(200)
      .json({ message: constant.SUCCESS.DATA_ADD_SUCCESSFULLY_MESSAGE });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const getLeave = async (req, res) => {
  try {
    if(req?.user?.userType === 'employee'){
      var leaveData = await Leave.find({ userId: req.user._id })
          .select("-updatedAt -__v -tokens").sort({ createdAt: -1});

      const currentDate = new Date();

      leaveData.forEach(leave => {
        const toDate = new Date(leave.toDate);
        if (toDate < currentDate && leave.status === 'Pending') {
          leave.status = 'Declined';
          leave.save();
        }
      });
    }
    else{
      var leaveData = await Leave.find({}).select("-updatedAt -__v -tokens").populate('userId', 'firstName lastName').sort({ createdAt: -1});
    }

    res.status(200).json({ data: leaveData });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

// Update leave status by ID
const updateLeaveStatus = async (req, res) => {
  try {
    if(req?.user?.userType === 'admin'){
      const leaveId = req.query._id;
      const { status } = req.body;

      if (!leaveId || !status) {
        return res.status(400).json({ message: "Leave ID and status are required." });
      }

      const updatedLeave = await Leave.findByIdAndUpdate(
          leaveId,
          { status },
          { new: true }
      );

      if (!updatedLeave) {
        return res.status(404).json({ message: "Leave not found." });
      }

      return res.json({ message: "Leave status updated successfully", leave: updatedLeave });
    }
    else {
      return res.json({ message: "Only admin can change the leave status."});
    }

  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { addLeave, getLeave, updateLeaveStatus };