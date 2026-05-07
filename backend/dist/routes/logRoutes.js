"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logController_1 = require("../controllers/logController");
const router = express_1.default.Router();
router.get('/', logController_1.getLogs);
router.get('/pipeline/:pipelineId', logController_1.getLogsByPipeline);
exports.default = router;
//# sourceMappingURL=logRoutes.js.map