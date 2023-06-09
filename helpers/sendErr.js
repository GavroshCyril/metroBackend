const sendErr = (res, err) => {
    res.status(400).json({
        status: "failed",
        message: err.message
    });
    return;
}

module.exports = {
    sendErr
};
