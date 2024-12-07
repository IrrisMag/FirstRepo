const express = require('express');
const morgan = require('morgan');
const app = express();
const userRouter = require('./routes/user.route');
const dashboardRouter = require('./routes/dashboard.route');
const session = require('express-session');
const flash = require('connect-flash');
const { verifyUser } = require('./lib/middleware');

require('dotenv').config();
require('./lib/dbConnect');

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.AUTH_SECRET || 'default-secret', // Avoid hardcoding for production
    saveUninitialized: true,
    resave: false,
  })
);

app.use(flash());

app.use('/', userRouter);
app.use('/dashboard', verifyUser, dashboardRouter);
app.get('*', (req, res) => {
res.status(404).render('index', { message: 'Not Found' });
});



const PORT = 3000;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});




















/*const http = require('http');
const server = http.createServer((req, res) => {
const { url } = req;
console.log(url);
if(url === '/') {
res.end('Hello World');
} else if (url === '/contact') {
res.end('The Contact Page');
} else if (url === '/about') {
res.end('The About Page');
} else {
res.writeHead(404)
res.end('Not Found');
}
});
server.listen(3000, () => {
console.log('Server running on port 3000');
});*/
