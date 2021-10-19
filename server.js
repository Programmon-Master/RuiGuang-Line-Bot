const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { bottender } = require('bottender');
const mongoose = require('mongoose');

const mainRouter = require('./routes/api/controller/mainRouter');

const app = bottender({
    dev: process.env.NODE_ENV !== 'production',
});

const port = Number(process.env.PORT) || 5000;

const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    function listen() {
        /**
         * Establish port listener when server ready
         */
        server.listen(port, (err) => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:${port}`);
        });
    }

    /**
     * Bind mongoose event and coneect to mongodb
     * @returns MongoClient Object
     */
    function connect() {
        mongoose.connection
            .on('error', console.log)
            .on('disconnected', connect)
            .once('open', listen);

        // Default connection timeout: http://mongodb.github.io/node-mongodb-native/3.1/reference/faq/
        // Others attribute: https://mongoosejs.com/docs/connections.html
        return mongoose.connect(process.env.MONGO_URL, {
            maxPoolSize: 10,
            minPoolSize: 1,
            autoIndex: process.env.NODE_ENV !== 'production',
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    // Setup logger
    server.use(logger((process.env.NODE_ENV !== 'production') ? "dev" : "production" ));

    // If your express server is behind a proxy, you need to call `enable('trust proxy')`
    // See: http://expressjs.com/en/guide/behind-proxies.html#express-behind-proxies
    // server.enable('trust proxy');

    // Setup views
    server.set('views', path.join(__dirname, 'views'));
    server.set('view engine', 'ejs');

    const verify = (req, _, buf) => {
        req.rawBody = buf.toString();
    };
    server.use(express.json({ verify }));
    server.use(express.urlencoded({ extended: false, verify }));

    server.use(cookieParser());
    server.use(express.static(path.join(__dirname, 'public')));

    server.use('/api', mainRouter);

    server.use('/webhooks', handle);

    // Catch 404 and forward to error handler
    server.use(function(req, res, next) {
        next(createError(404));
    });

    // Error handler
    server.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    connect();
});
