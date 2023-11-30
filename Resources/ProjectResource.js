const moment = require("moment");

const ProjectResource = async (activity) => {
  const processedData = await Promise.all(
    activity.map(async (item) => {
      var dateInputFormate = moment.ISO_8601;
      var dateOutputFormate = "D MMM YYYY";

      var _id = item._id;
      var projectName = item.projectName;
      var client = item.client;
      var startDate = moment(item.startDate, dateInputFormate).format(
        dateOutputFormate
      );
      if (item.endDate) {
        var endDate = moment(item.endDate, dateInputFormate).format(
          dateOutputFormate
        );
      }

      var status = item.status;
      var technology = item.technology;
      var teamLeader = item.teamLeader;
      var teamMembers = item.teamMembers;
      var teamMembers = item.teamMembers;
      var description = item.description;

      return {
        _id,
        projectName,
        client,
        startDate,
        endDate,
        status,
        technology,
        teamLeader,
        teamMembers,
        teamMembers,
        description,
      };
    })
  );
  return processedData;
};

module.exports = ProjectResource;
