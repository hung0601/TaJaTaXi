import Echo from "laravel-echo";
window.Pusher = require("pusher-js");

const echo = new Echo({
  broadcaster: "pusher",
  key: "ca5bb1a8c13925e7420c",
  cluster: "ap1",
  forceTLS: true,
  encryption: true,
});

export default echo;
