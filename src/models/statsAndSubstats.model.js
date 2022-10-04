module.exports = (sequelize, Sequelize) => {
    const StatsAndSubstats = sequelize.define("statsAndSubstats", {
        colect: {
            type: Sequelize.DATE,
            allowNull: true
        },
        geography: {
            type: Sequelize.STRING,
            allowNull: true
        },
        status_name_id: {
            type: Sequelize.STRING,
            allowNull: true
        },
        status_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        substatus_name_id: {
            type: Sequelize.STRING,
            allowNull: true
        },
        substatus_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        records: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    });
  
    return StatsAndSubstats;
  };