import bcrypt from "bcrypt";
import type { Pool } from "pg";

import { unRegisteredUser, registeredUser, newRegisteredUser } from "../mocks";
import dateToISOString from "@utils/dateToISOString";
import type { DbTestUser } from "@types";

interface Users {
  readonly registeredUser: DbTestUser;
  readonly unregisteredUser: DbTestUser;
  readonly newRegisteredUser: DbTestUser;
}

const authUsers = async (db: Pool): Promise<Users> => {
  try {
    const unregisterPromise = bcrypt.hash(unRegisteredUser.password, 10);
    const registerPromise = bcrypt.hash(registeredUser.password, 10);
    const newRegisterPromise = bcrypt.hash(newRegisteredUser.password, 10);

    const [unRegisterHash, registerHash, newRegisterHash] = await Promise.all([
      unregisterPromise,
      registerPromise,
      newRegisterPromise,
    ]);

    const registered = db.query<DbTestUser>(
      `INSERT INTO users (
        email,
        password,
        first_name,
        last_name,
        is_registered,
        image,
        reset_token
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        user_id "userId",
        date_created "dateCreated"`,
      [
        registeredUser.email,
        registerHash,
        registeredUser.firstName,
        registeredUser.lastName,
        registeredUser.registered,
        registeredUser.image,
        `{${registeredUser.resetToken[0]}, ${registeredUser.resetToken[1]}}`,
      ]
    );

    const newRegistered = db.query<DbTestUser>(
      `INSERT INTO users (
        email,
        password,
        first_name,
        last_name,
        is_registered,
        image,
        reset_token
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        user_id "userId",
        date_created "dateCreated"`,
      [
        newRegisteredUser.email,
        newRegisterHash,
        newRegisteredUser.firstName,
        newRegisteredUser.lastName,
        newRegisteredUser.registered,
        newRegisteredUser.image,
        `{${newRegisteredUser.resetToken[0]}, ${newRegisteredUser.resetToken[1]}}`,
      ]
    );

    const unRegistered = db.query<DbTestUser>(
      `INSERT INTO users (
        email,
        password,
        is_registered,
        reset_token
      ) VALUES ($1, $2, $3, $4)
      RETURNING
        user_id "userId",
        date_created "dateCreated"`,
      [
        unRegisteredUser.email,
        unRegisterHash,
        unRegisteredUser.registered,
        `{${unRegisteredUser.resetToken[0]}, ${unRegisteredUser.resetToken[1]}}`,
      ]
    );

    const [registerRes, unregisterRes, newRegisterRes] = await Promise.all([
      registered,
      unRegistered,
      newRegistered,
    ]);

    return {
      registeredUser: {
        ...registerRes.rows[0],
        dateCreated: dateToISOString(registerRes.rows[0].dateCreated),
      },
      unregisteredUser: {
        ...unregisterRes.rows[0],
        dateCreated: dateToISOString(unregisterRes.rows[0].dateCreated),
      },
      newRegisteredUser: {
        ...newRegisterRes.rows[0],
        dateCreated: dateToISOString(newRegisterRes.rows[0].dateCreated),
      },
    };
  } catch (err) {
    console.error("Create Reset Password Users Error - ", err);
    throw new Error("Unable to create reset password test users");
  }
};

export default authUsers;
