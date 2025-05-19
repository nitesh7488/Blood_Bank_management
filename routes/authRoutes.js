const express = require("express");
const {
  registerController,
  loginController,
  currentUserController,
} = require("../controllers/authController");
const authMiddelware = require("../middlewares/authMiddelware");
const { check } = require('express-validator');


const router = express.Router();


const registerValidation = [
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  check('role').isIn(['donar', 'hospital', 'organisation', 'admin']).withMessage('Invalid role'),
  // Add other field validations as needed
];

//routes
//REGISTER || POST
router.post("/register",registerValidation, registerController);

//LOGIN || POST
router.post("/login", loginController);

//GET CURRENT USER || GET
router.get("/current-user", authMiddelware, currentUserController);

module.exports = router;