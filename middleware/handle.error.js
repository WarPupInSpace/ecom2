export const HandleError = (err, req, res, next) => {
    err.status ||= 500;
    err.message ||= "server error";
    res.status(err.status).send(err.message);
 }