const db = require("../../models");
const StatsAndSubstats = db.statsAndSubstatss;

const fs = require("fs");
const csv = require("fast-csv");

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }

    let statsAndSubstatss = [];
    let path =
      __basedir + "/resources/static/assets/uploads/" + req.file.filename;

    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        const newRow = rowTreatment(row);
        


        statsAndSubstatss.push(newRow);
      })
      .on("end", () => {
        StatsAndSubstats.bulkCreate(statsAndSubstatss, { returning: true })
          .then(() => {
            res.status(200).send({
              message:
                "Uploaded the file successfully: " + req.file.originalname,
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Fail to import data into database!",
              error: error.message,
            });
          });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

const getStatsAndSubstatss = (req, res) => {
  StatsAndSubstats.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

function rowTreatment(row) {
  const rowValues = Object.values(row)[0].split(';')

  const newRow = {
    collect: rowValues[0],
    geography: rowValues[1],
    status_name_id: rowValues[2],
    status_name: rowValues[3],
    substatus_name_id: rowValues[4],
    substatus_name: rowValues[5],
    records: rowValues[6]
  };

  return newRow;
}

module.exports = {
  upload,
  getStatsAndSubstatss,
};
