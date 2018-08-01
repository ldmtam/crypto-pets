var config = global.config;

var Test = {
    test: (req, res) => {
        logger.trace('Test.controller::test');

        return res.send({
            status: 'success'
        })
    }
}

module.exports = Test;