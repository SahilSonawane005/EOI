import pool from "../../config/config.js";
import paginate from "express-paginate";
export default {

  async loadForm(req, res) {
    try {
      const { project_sf_id } = req.params;
      const result = await pool.query(
        `SELECT s_project_name,project_sf_id,d_start_date,d_end_date, CASE 
        WHEN status = 1 THEN 'active'
        ELSE 'inactive'
        END AS status FROM tbl_project_validation
         where project_sf_id = $1`,
        [project_sf_id]
      );

      return res.status(200).json({
        message: "Status Details",
        status: true,
        data: result.rows[0]
      });

    } catch (error) {
      console.error("EOI Error:", error.message);
      return res.status(500).json({ error: error.message, status: false });
    }
  },
  async createEoiDetail(req, res) {
    try {
      const {
        bankName,
        chequeAmount,
        chequeDate,
        chequeNo,
        cpEmailId,
        customerName,
        project_sf_id,
      } = req.body;

      const result = await pool.query(
        `INSERT INTO tbl_eoi_detail 
         (s_bank_name, n_cheque_amt, d_cheque_date, s_cheque_no, 
          s_cp_email_id, s_customer_name, project_sf_id,n_project_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7,1)
         RETURNING n_eoi_id`,
        [
          bankName,
          chequeAmount,
          chequeDate,
          chequeNo,
          cpEmailId,
          customerName,
          project_sf_id
        ]
      );

      return res.status(201).json({
        message: "EOI detail created",
        status: true,
        eoiId: result.rows[0].n_eoi_id
      });

    } catch (error) {
      console.error("Insert EOI Error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  },
  async projectDetail(req, res) {
    try {
      const result = await pool.query(
        `SELECT s_project_name,project_sf_id FROM tbl_project_validation
        ORDER BY n_project_id ASC `
      );
      return res.status(200).json({
        message: "Project list fetched successfully",
        status: true,
        data: result.rows
      });

    } catch (error) {
      console.error("Fetch Project Details Error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  },


  async getAllEoi(req, res) {
    try {
      const projid = req.params.project_sf_id;
      const search = req.query.search || "";

      const limit = Number(req.query.limit || 10);
      const offset = req.skip;
      const current = Number(req.query.page) || 1;

      const searchQuery = `%${search}%`;

      const dataQuery = `
      SELECT *
      FROM tbl_eoi_detail
      WHERE 
        project_sf_id = $3 AND
        (
          s_bank_name ILIKE $1 OR
          s_cp_email_id ILIKE $1 OR
          s_customer_name ILIKE $1
        )
      ORDER BY n_eoi_id DESC
      LIMIT $2 OFFSET $4
    `;

      const totalQuery = `
      SELECT COUNT(*) AS count
      FROM tbl_eoi_detail
      WHERE 
        project_sf_id = $2 AND
        (
          s_bank_name ILIKE $1 OR
          s_cp_email_id ILIKE $1 OR
          s_customer_name ILIKE $1
        )
    `;

      const [result, total] = await Promise.all([
        pool.query(dataQuery, [searchQuery, limit, projid, offset]),
        pool.query(totalQuery, [searchQuery, projid])
      ]);

      const totalCount = Number(total.rows[0].count);
      const pageCount = Math.ceil(totalCount / limit);

      // ---- SMART PAGES ARRAY ----
      let pages = [];

      if (pageCount <= 6) {
        // Small pages → show all
        pages = Array.from({ length: pageCount }, (_, i) => i + 1);
      } else {
        // Large pages → smart pagination
        const firstTwo = [1, 2];
        const lastTwo = [pageCount - 1, pageCount];

        pages = [...firstTwo, "...", ...lastTwo];
      }

      // Next / Prev (page number only)
      const nextPageUrl = current < pageCount ? current + 1 : null;
      const prevPageUrl = current > 1 ? current - 1 : null;

      return res.json({
        status: true,
        total: totalCount,
        current,
        pageCount,
        limit,
        nextPageUrl,
        prevPageUrl,
        pages,
        data: result.rows
      });

    } catch (error) {
      console.error("Pagination error:", error);
      res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },



  async getAllClosingMgr(req, res) {
    try {
      const { project_sf_id } = req.params; // or req.query

      const result = await pool.query(
        `SELECT a.project_sf_id, a.closing_mgr_id, a.closing_mgr_name
       FROM tbl_closing_mgr_details a 
       WHERE a.project_sf_id = $1`,
        [project_sf_id]
      );

      return res.status(200).json({
        message: "EOI list fetched successfully",
        status: true,
        data: result.rows
      });

    } catch (error) {
      console.error("Fetch EOI Error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  },
  async updateMultipleEoi(req, res) {
    try {
      const { closing_mgr_id, n_eoi_id } = req.body;

      if (!closing_mgr_id || !Array.isArray(n_eoi_id) || n_eoi_id.length === 0) {
        return res.status(400).json({
          error: "closing_mgr_id and n_eoi_id[] are required"
        });
      }

      const query = `
      UPDATE tbl_eoi_detail
      SET closing_mgr_id = $1
      WHERE n_eoi_id = ANY($2)
      RETURNING *;
    `;

      const result = await pool.query(query, [closing_mgr_id, n_eoi_id]);

      return res.status(200).json({
        message: "Closing Manager updated for selected EOIs",
        updated_rows: result.rowCount,
        status: true,
        data: result.rows
      });

    } catch (error) {
      console.error("Bulk Update Error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }


};
