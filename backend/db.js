const { docClient, Table } = require("./db.config.js");

// Read all users
exports.readAllUsers = async function() {
  const params = {
    TableName: Table
  };

  try {
    const { Items = [] } = await docClient.scan(params).promise();
    return { success: true, data: Items };
  } catch(error) {
    return { success: false, data: null };
  }
};

// Export the db and Table variables
exports.docClient = docClient;
exports.Table = Table;
