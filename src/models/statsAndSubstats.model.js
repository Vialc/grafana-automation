module.exports = (sequelize, Sequelize) => {
    const StatsAndSubstats = sequelize.define("statsAndSubstats", {
        collect: {
            type: Sequelize.STRING,
            allowNull: true
        },
        geography: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        status_name_id: {
            type: Sequelize.STRING,
            allowNull: true,
            primaryKey: true
        },
        status_name: {
            type: Sequelize.STRING,
            allowNull: true,
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
            type: Sequelize.STRING,
            allowNull: true
        }
    });
  
    return StatsAndSubstats;
  };