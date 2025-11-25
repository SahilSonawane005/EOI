import pool from "../../config/config.js";

import jwt from "jsonwebtoken"
export default {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
      const result = await pool.query(
        `SELECT * FROM tbl_users WHERE s_email = $1`,
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = result.rows[0];

      if (user.s_password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user.n_user_id, email: user.s_email }, process.env.JWT_SECRATE, { expiresIn: process.env.JWT_EXPIRE_IN }
      )


      return res.status(200).json({
        status: true,
        message: "Login successful",
        data: {
          token:token,
          user:{
            id:user.n_user_id,
            email:user.s_email,
          }
        }
      });

    } catch (error) {
      console.error("Login error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
};
