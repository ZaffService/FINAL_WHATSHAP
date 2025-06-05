const jsonServer = require('json-server');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

server.use(middlewares);
server.use(router);

server.listen(5001, '0.0.0.0', () => {
    console.log('JSON Server est démarré sur http://localhost:5001');
});
