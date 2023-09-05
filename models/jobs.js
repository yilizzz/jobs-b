const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: false },
  business: { type: String, required: false },
  website: { type: String, match: /^https?:\/\/.+$/, required: false },
  post_date: { type: Date, default: Date.now },
  contact: { type: String, required: false },
  state: { type: String, required: false },
  remarks: { type: String, required: false },
  color: { type: String, require: false, default: "#A9A9A9" },
});

module.exports = mongoose.model("jobs", jobSchema);
