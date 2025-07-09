import crypto from "crypto";

if (!crypto.hash) {
  crypto.hash = function(algorithm, data) {
    const hash = crypto.createHash(algorithm);
    hash.update(data);
    return hash.digest("hex");
  };
}
