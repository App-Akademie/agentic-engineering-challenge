const { createApp } = require('./app');
const port = Number(process.env.PORT || 3000);
const server = createApp().listen(port, '127.0.0.1', () => {
  console.log(`Referenz: http://127.0.0.1:${server.address().port}`);
});
