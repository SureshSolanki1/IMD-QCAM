const bcrypt = require("bcryptjs");

async function hashPassword() {
  const password = "Suresh@8766"; // Change this to the password you want to hash
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password:", hashedPassword);
}

hashPassword();
