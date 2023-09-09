validateTicketReqBody = (req, res, next) => {
  if (!req.body.title) {
    res.status(400).send({
      message: "Title of the ticket is missing",
    });
  }
  if (!req.body.description) {
    res.status(400).send({
      message: "Description of the ticket is missing",
    });
  }
  next();
};

module.exports = {
  validateTicketReqBody: validateTicketReqBody,
};
