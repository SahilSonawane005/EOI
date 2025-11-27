import pool from "../../config/config.js";


export default {

  async createProjectValidation(req, res) {
    try {
      const { projectName, startDate, endDate } = req.body;

      const result = await pool.query(
        `INSERT INTO tbl_project_validation 
        (s_project_name, d_start_date, d_end_date, n_status_id)
        VALUES ($1, $2, $3, 1)
        RETURNING n_project_id`,
        [projectName, startDate, endDate]
      );

      return res.status(201).json({
        message: "Project validation created",
        projectId: result.rows[0].n_project_id
      });

    } catch (error) {
      console.error("Insert Project Error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  },


  async getProject(req,res){
    try{
      const result = await pool.query(
        `SELECT p.* ,
        s.s_status_name
        FROM public.tbl_project_validation p
        LEFT JOIN tbl_status_master s
        ON s.n_status_id = p.n_status_id
        ORDER BY n_project_id ASC `
      );
       return res.status(200).json({
        message: "Project fetched successfully",
        data: result.rows
      });

    } catch (error) {
      console.error("Fetch Project Error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  

};
