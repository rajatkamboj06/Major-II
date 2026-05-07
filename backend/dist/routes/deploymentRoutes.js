"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deploymentController_1 = require("../controllers/deploymentController");
const router = express_1.default.Router();
// This returns the actual HTML page, not JSON. It's meant to be opened in a browser tab.
router.get('/:id', deploymentController_1.renderLiveDeployment);
exports.default = router;
//# sourceMappingURL=deploymentRoutes.js.map