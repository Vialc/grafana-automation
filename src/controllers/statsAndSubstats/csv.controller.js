const db = require("../../models");
const StatsAndSubstats = db.statsAndSubstatss;

const fs = require("fs");
const csv = require("fast-csv");

// const teste = {
//   colect: '25/10/1988',
//   geography: 'Poa',
//   status_name_id: '35',
//   status_name: 'asdasdasd',
//   substatus_name_id: '5',
//   substatus_name: 'fgfgfgfg',
//   records: 44
// }

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }

    let statsAndSubstatss = [];
    let path = __basedir + "/resources/static/assets/uploads/" + req.file.filename;

    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        const newRow = rowTreatment(row);
        statsAndSubstatss.push(newRow);
        //console.log(`aqui os dados: ${Object.values(row)}`)
      })
      .on("end", () => {
        console.log(statsAndSubstatss)
        StatsAndSubstats.bulkCreate(statsAndSubstatss, {returning: true})
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
  const geographValue = Object.values(row)[0].substring(0, Object.values(row)[0].indexOf(';'))
  const status_nameValue = Object.values(row)[0].substring(Object.values(row)[0].indexOf(';') + 1, Object.values(row)[0].length)

  const newRow = {
    geography: geographValue,
    status_name: status_nameValue
  }

  return newRow
}

module.exports = {
  upload,
  getStatsAndSubstatss
};