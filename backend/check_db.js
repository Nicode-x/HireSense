const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nikhil",
  database: "resume_analyzer",
});

db.connect((err) => {
  if (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected.");
  
  db.query("DESCRIBE users", (err, results) => {
    if (err) {
      console.error("Table Error:", err.message);
    } else {
      console.log("Users Table Structure:");
      console.table(results);
    }
    
    db.query("DESCRIBE analysis_results", (err, results) => {
        if (err) {
          console.error("Analysis Table Error:", err.message);
        } else {
          console.log("Analysis Table Structure:");
          console.table(results);
        }
        process.exit(0);
    });
  });
});
