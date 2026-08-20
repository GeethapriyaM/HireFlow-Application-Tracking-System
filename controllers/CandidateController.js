const Candidate = require("../config/models/Candidate");


// ==========================================
// GET ALL CANDIDATES
// ==========================================

const getAllCandidate = async (req, res) => {
    try {

        const {
            search,
            jobRole,
            stage,
            skill,
            minRating
        } = req.query;

        const filter = {};

        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    jobRole: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        if (jobRole) {
            filter.jobRole = {
                $regex: jobRole,
                $options: "i"
            };
        }

        if (stage) {
            filter.stage = stage;
        }

        if (skill) {
            filter.skills = {
                $regex: skill,
                $options: "i"
            };
        }

        if (minRating) {
            filter.rating = {
                $gte: Number(minRating)
            };
        }

        const candidates = await Candidate.find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json(candidates);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// ==========================================
// GET CANDIDATE BY ID
// ==========================================

const getCandidateById = async (req, res) => {
    try {

        const candidate =
            await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate not found"
            });
        }

        res.status(200).json(candidate);

    } catch (error) {

        res.status(400).json({
            message: "Invalid candidate ID"
        });

    }
};


// ==========================================
// CREATE CANDIDATE
// ==========================================

const createCandidate = async (req, res) => {
    try {

        const candidate =
            await Candidate.create(req.body);

        res.status(201).json({
            message: "Candidate created successfully",
            candidate
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};


// ==========================================
// UPDATE CANDIDATE
// ==========================================

const updateCandidate = async (req, res) => {
    try {

        const candidate =
            await Candidate.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate not found"
            });
        }

        res.status(200).json({
            message: "Candidate updated successfully",
            candidate
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};


// ==========================================
// DELETE CANDIDATE
// ==========================================

const deleteCandidate = async (req, res) => {
    try {

        const candidate =
            await Candidate.findByIdAndDelete(
                req.params.id
            );

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate not found"
            });
        }

        res.status(200).json({
            message: "Candidate deleted successfully"
        });

    } catch (error) {

        res.status(400).json({
            message: "Invalid candidate ID"
        });

    }
};


// ==========================================
// SEARCH CANDIDATES
// ==========================================

const searchCandidate = async (req, res) => {
    try {

        const {
            name,
            jobRole,
            stage,
            skill,
            minRating
        } = req.query;

        const filter = {};

        if (name) {
            filter.name = {
                $regex: name,
                $options: "i"
            };
        }

        if (jobRole) {
            filter.jobRole = {
                $regex: jobRole,
                $options: "i"
            };
        }

        if (stage) {
            filter.stage = stage;
        }

        if (skill) {
            filter.skills = {
                $regex: skill,
                $options: "i"
            };
        }

        if (minRating) {
            filter.rating = {
                $gte: Number(minRating)
            };
        }

        const candidates =
            await Candidate.find(filter)
                .sort({ createdAt: -1 });

        res.status(200).json(candidates);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// ==========================================
// UPDATE ONE CANDIDATE STAGE
// ==========================================

const updateCandidateStage = async (req, res) => {
    try {

        const { stage } = req.body;

        const validStages = [
            "Applied",
            "Screening",
            "Interview",
            "Selected",
            "Rejected"
        ];

        if (!validStages.includes(stage)) {
            return res.status(400).json({
                message: "Invalid stage"
            });
        }

        const candidate =
            await Candidate.findByIdAndUpdate(
                req.params.id,
                { stage },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate not found"
            });
        }

        res.status(200).json({
            message: "Candidate stage updated successfully",
            candidate
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};


// ==========================================
// BULK UPDATE STAGE
// ==========================================

const bulkUpdateStage = async (req, res) => {
    try {

        const { ids, stage } = req.body;

        const validStages = [
            "Applied",
            "Screening",
            "Interview",
            "Selected",
            "Rejected"
        ];

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message: "Candidate IDs are required"
            });
        }

        if (!validStages.includes(stage)) {
            return res.status(400).json({
                message: "Invalid stage"
            });
        }

        await Candidate.updateMany(
            {
                _id: {
                    $in: ids
                }
            },
            {
                $set: {
                    stage
                }
            }
        );

        res.status(200).json({
            message: "Candidates updated successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


module.exports = {
    getAllCandidate,
    getCandidateById,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    searchCandidate,
    updateCandidateStage,
    bulkUpdateStage
};