import pool from "../../config/config.js";

export default {

  async createEoiDetail(req, res) {
    try {
      const {
        bankName,
        chequeAmount,
        chequeDate,
        chequeNo,
        cpEmailId,
        customerName,
        projectId
      } = req.body;

      const result = await pool.query(
        `INSERT INTO tbl_eoi_detail 
         (s_bank_name, n_cheque_amt, d_cheque_date, s_cheque_no, 
          s_cp_email_id, s_customer_name, n_project_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING n_eoi_id`,
        [
          bankName,
          chequeAmount,
          chequeDate,
          chequeNo,
          cpEmailId,
          customerName,
          1
        ]
      );

      return res.status(201).json({
        message: "EOI detail created",
        eoiId: result.rows[0].n_eoi_id
      });

    } catch (error) {
      console.error("Insert EOI Error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  },
  async getAllEoi(req, res) {
    try {
      const result = await pool.query(
        `SELECT 
      e.*,
      p.s_project_name 
      FROM public.tbl_eoi_detail e
      LEFT JOIN tbl_project_validation p
      ON p.n_project_id = e.n_project_id
      ORDER BY n_eoi_id 	ASC `
      );

      return res.status(200).json({
        message: "EOI list fetched successfully",
        data: result.rows
      });

    } catch (error) {
      console.error("Fetch EOI Error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  },

};
