const { createServer } = require("net");
const server = createServer();
let socketcount = 0;
const sockets = {};
server.on("connection", (socket) => {
  let username = "";
  socket.write("Enter your name: ");
  socket.id = socketcount++;
  sockets[socket.id] = socket;
  socket.on("data", (data) => {
    if (!username) {
      username = data;
      socket.username = username;
      broadCastMessage(
        socket,
        `${username.toString().trim()} has joined, Welcome!\n`
      );
    } else {
      console.log("broadcasting data: " + data);
      broadCastMessage(
        socket,
        `${socket.username.toString().trim()} :- ${data}`
      );
    }
  });
  socket.on("end", () => {
    console.log(`${socket.username.toString().trim()} has disconnected`);
    delete sockets[socket.id];
    broadCastMessage(
      socket,
      `${socket.username.toString().trim()} has disconnected`
    );
  });
});

const broadCastMessage = (sourcesocket, data) => {
  Object.entries(sockets).forEach(([id, sock]) => {
    if (Number(id) !== sourcesocket.id) {
      sock.write(data);
    }
  });
};
server.listen(9001);
