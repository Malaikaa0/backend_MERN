const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  order: { type: Number, required: true },
});

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Main Board",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    columns: {
      type: [columnSchema],
      default: [
        { name: "Todo", order: 0 },
        { name: "In Progress", order: 1 },
        { name: "Review", order: 2 },
        { name: "Completed", order: 3 },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", boardSchema);