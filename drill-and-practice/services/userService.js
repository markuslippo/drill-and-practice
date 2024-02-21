import { executeQuery } from "../database/database.js";

const addUser = async (email, password) => {
  await executeQuery(
    `INSERT INTO users
        (email, password)
          VALUES ($1, $2)`,
    email,
    password,
  );
};
const findUserByEmail = async (email) => {
  const result = await executeQuery(
    "SELECT * FROM users WHERE email = $1",
    email,
  );

  return result.rows;
};

const addAdmin = async (pw) => {
  await executeQuery(
    `INSERT INTO users
            (email, admin, password)
              VALUES ('admin@admin.com', true, $1)`,
    pw,
  );
};

const deleteUserByEmail = async (email) => {
  const result = await executeQuery(
    "DELETE FROM users WHERE email = $1",
    email,
  );
};

const count = async () => {
  const result = await executeQuery(
    "SELECT COUNT(email) FROM users",
  );
  result.rows[0];
};

export { addAdmin, addUser, count, deleteUserByEmail, findUserByEmail };
