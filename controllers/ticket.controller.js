const ticketModel = require("../model/ticket.model");
const userModel = require("../model/user.model");

const sendNotification = require("../utils/notificationClient");

exports.createTicket = async (req, res) => {
  //create ticketObj from req.body
  try {
    const reqObj = {
      title: req.body.title,
      ticketPriority: req.body.ticketPriority,
      description: req.body.description,
      status: req.body.status,
      reporter: req.userId,
    };

    //find an engineer with status approved

    const engineer = await userModel.findOne({
      userType: "ENGINEER",
      userStatus: "APPROVED",
    });
    if (engineer) {
      reqObj.assignee = engineer.userId;
    }

    const ticketCreated = await ticketModel.create(reqObj);
    if (ticketCreated) {
      var customer = await userModel.findOne({ userId: req.userId });
      customer.ticketsCreated.push(ticketCreated._id);

      await customer.save();

      if (engineer) {
        engineer.ticketsAssigned.push(ticketCreated._id);
        await engineer.save();
      }
    }
    var subject = `Ticket created with ID ${ticketCreated._id} `;
    var content = `Hello, ticket created successfully`;
    var emailIds = `${customer.email}, ${engineer.email}`;
    sendNotification(subject, content, emailIds, "CRM_APP");
    res.status(201).send(ticketCreated);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error while creating ticket",
    });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const callingUser = await userModel.findOne({ userId: req.userId });
    callingUser.ticketsAssigned.map((e) => {
      console.log(e.toString());
    });
    const queryObj = {};
    if (callingUser.userType == "CUSTOMER") {
      queryObj.reporter = req.userId;
    } else if (callingUser.userType == "ENGINEER") {
      queryObj.assignee = req.userId;
    }
    const tickets = await ticketModel.findOne(queryObj);
    res.status(200).send(tickets);
  } catch (err) {
    res.status(500).send({
      message: "Error while fetching ticket",
    });
  }
};
