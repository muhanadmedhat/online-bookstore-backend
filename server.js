require('dotenv').config();

// ✅ FORCE IPv4 FIRST (Fix Railway + Gmail ENETUNREACH)
// Monkey-patch dns.lookup to absolutely forbid IPv6 resolution
const dns = require('node:dns');
const originalLookup = dns.lookup;
dns.lookup = function(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = { family: 4 };
  } else if (typeof options === 'object') {
    options = { ...options, family: 4 };
  } else if (typeof options === 'number') {
    options = { family: 4 };
  }
  return originalLookup(hostname, options, callback);
};
dns.setDefaultResultOrder('ipv4first');

const app = require('./app');
const connectDB = require('./config/db');

connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
