"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pipelineController_1 = require("../controllers/pipelineController");
const router = express_1.default.Router();
router.route('/')
    .post(pipelineController_1.createPipelineFromPrompt)
    .get(pipelineController_1.getUserPipelines);
router.route('/:id')
    .get(pipelineController_1.getPipelineById)
    .delete(pipelineController_1.deletePipeline);
router.post('/:id/rerun', pipelineController_1.rerunPipeline);
exports.default = router;
//# sourceMappingURL=pipelineRoutes.js.map