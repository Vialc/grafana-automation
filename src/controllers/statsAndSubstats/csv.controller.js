const db = require("../../models");
const StatsAndSubstats = db.statsAndSubstatss;
const axios = require("axios");

const fs = require("fs");
const csv = require("fast-csv");
const { Server } = require("tls");

const instance = axios.create({
  baseURL:
    "https://cadastro-unificado-apigw.prd.naturacloud.com/global-people-management/v1/people/",
  headers: {
    "x-api-key": "8fe6d583-a19b-4da1-8fb2-c80f2d651a3d",
    function: 1,
    role: 1,
    businessmodel: 1,
    tenantid: "8374a616-8b1e-46af-8d41-2bcf683234db",
    sourcesystem: 1,
    country: 'AR',
    companyid: 1,
    countryid: 2,
  },
});

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
        //StatsAndSubstats.bulkCreate(statsAndSubstatss, { returning: true })
        
        executePath(statsAndSubstatss).then(() => {
            res.status(200).send({
              message:
                "Uploaded the file successfully: " + req.file.originalname,
            });
            return console.log('segundo then')
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
  const rowValues = Object.values(row)[0].split(";");

  // const newRow = {
  //   collect: rowValues[0],
  //   geography: rowValues[1],
  //   status_name_id: rowValues[2],
  //   status_name: rowValues[3],
  //   substatus_name_id: rowValues[4],
  //   substatus_name: rowValues[5],
  //   records: rowValues[6]
  // };

  const newRow = {
    candidate_id: rowValues[0],
    person_id: rowValues[1],
    tenant_id: rowValues[2],
    person_roles_id: rowValues[3],
  };

  return newRow;
}

async function executePath(arrayDeRows) {
  await arrayDeRows.map((row, index) => {
    console.log('entrou no map')
    executePosts(row)//.then((res) => console.log(res))
})
}

async function executePosts(row) {
  const pathReq = async () => await instance.patch(
    `${row.person_id}/person-role/${row.person_roles_id}/cease%27`,
  ).then((res) => {
    console.log('pegando o res')
  })
  pathReq()
}

module.exports = {
  upload,
  getStatsAndSubstatss,
};
