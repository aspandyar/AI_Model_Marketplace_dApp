module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Ganache blockchain port
      network_id: "5777",
    }
  },
  compilers: {
    solc: {
      version: "0.6.0"
    }
  }
};
