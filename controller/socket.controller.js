export const notificationsocket = (socket) => {
  socket.on('join', (id) => {
    if (!id) {
      console.error('Invalid room ID:', id);
      return;
    }
    socket.join(id.toString());
  });

  socket.on('notification', (data) => {
    if (!data || !data.id) {
      console.error('Invalid notification data:', data);
      return;
    }
    socket.to(data.id.toString()).emit('notification', data);
    console.log(data);
  });
};