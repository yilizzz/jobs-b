const { error } = require("console");
const Job = require("../models/jobs");
require("dotenv").config;

exports.getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ userId: req.params.userId });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};
// Update one Offer
exports.modifyJob = async (req, res, next) => {
  const jobObject = { ...req.body };
  try {
    const job = await Job.findOne({ _id: req.params.id });
    if (job) {
      if (job.userId != req.auth.userId) {
        res.status(403).json({ message: "unauthorized request" });
      } else {
        try {
          await Job.updateOne({ _id: req.params.id }, { ...jobObject });
          res.status(200).json({ message: "Job updated!" });
        } catch (err) {
          res.status(401).json({ err });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ err });
  }
};
exports.createJob = async (req, res, next) => {
  try {
    const jobObject = { ...req.body };
    delete jobObject._id;
    delete jobObject.userId;
    const job = new Job({
      ...jobObject,
      userId: req.auth.userId,
    });

    await job.save();
    res.status(201).json({ message: "One offer saved !" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id });
    if (job) {
      if (job.userId != req.auth.userId) {
        res.status(403).json({ message: "unauthorized request" });
      } else {
        try {
          await Job.deleteOne({ _id: req.params.id });
          res.status(200).json({ message: "Object deleted!" });
        } catch (err) {
          res.status(401).json({ err });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.searchJobs = async (req, res, next) => {
  const userId = req.params.userId;
  const keywords = req.params.keywords.toLowerCase();

  // Remove quotes if present
  if (keywords.startsWith('"') && keywords.endsWith('"')) {
    keywords = keywords.slice(1, -1);
  }

  // Tokenize the keywords
  const searchTerms = keywords.split(" ");

  try {
    // Query the database for jobs belonging to the specific user
    const userJobs = await Job.find({ userId: userId });

    // Filter the user-specific jobs further based on search terms
    const searchResults = userJobs.filter((job) =>
      searchTerms.some((term) => {
        const lowerCaseTerm = term.toLowerCase();
        return (
          (job.title && job.title.toLowerCase().includes(lowerCaseTerm)) ||
          (job.company && job.company.toLowerCase().includes(lowerCaseTerm)) ||
          (job.business &&
            job.business.toLowerCase().includes(lowerCaseTerm)) ||
          (job.website && job.website.toLowerCase().includes(lowerCaseTerm)) ||
          (job.contact && job.contact.toLowerCase().includes(lowerCaseTerm)) ||
          (job.remarks && job.remarks.toLowerCase().includes(lowerCaseTerm)) ||
          (job.color && job.color.toLowerCase().includes(lowerCaseTerm))
        );
      })
    );

    // Return the search results as JSON response
    res.status(200).json(searchResults);
  } catch (error) {
    // Handle any errors
    console.error("Error searching jobs:", error);
    res.status(500).json({ error: "An error occurred while searching jobs" });
  }
};
