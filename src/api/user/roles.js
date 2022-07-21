// Get the required files
const router = require("express").Router();
const {protect} = require("../../middleware/authMiddleware.js")
const validators = require("../../validators/roles.js")
const controller = require("../../controller/users/roles.js");

/** 
*   
*   @Route      /api/roles
*   @Desc       Route to create a new rule
*   @access     Private
*   @Group      Admin
*
**/
router.post("/", protect, validators.createRole, controller.createRole);


/** 
*   
*   @Route      /api/roles
*   @Desc       Route to delete a role
*   @access     Private
*   @Group      Admin
*
**/
router.delete("/", protect, validators.deleteRole, controller.deleteRole)

/** 
*   
*   @Route      /api/roles
*   @Desc       Route to edit the role
*   @access     Private
*   @Group      Admin
*
**/
router.put("/", protect, validators.editRole, controller.editRole)



module.exports = router;