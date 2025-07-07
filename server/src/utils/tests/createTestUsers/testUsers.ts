import bcrypt from "bcrypt";
import type { Pool } from "pg";

import { unRegisteredUser, registeredUser } from "../mocks";
import dateToISOString from "@utils/dateToISOString";
import type { DbTestUser } from "@types";

interface Users {
  readonly registeredUser: DbTestUser;
  readonly unregisteredUser: DbTestUser;
}

const testUsers = async (db: Pool): Promise<Users> => {
  try {
    const unregisterPromise = bcrypt.hash(unRegisteredUser.password, 10);
    const registerPromise = bcrypt.hash(registeredUser.password, 10);

    const [unRegisterHash, registerHash] = await Promise.all([
      unregisterPromise,
      registerPromise,
    ]);

    const registered = db.query<DbTestUser>(
      `INSERT INTO users (
        email,
        password,
        first_name,
        last_name,
        is_registered,
        reset_token,
        image
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id "userId",
        user_id "userUUID",
        date_created "dateCreated"`,
      [
        registeredUser.email,
        registerHash,
        registeredUser.firstName,
        registeredUser.lastName,
        registeredUser.registered,
        `{${registeredUser.resetToken[0]}, ${registeredUser.resetToken[1]}}`,
        registeredUser.image,
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
        id "userId",
        user_id "userUUID",
        date_created "dateCreated"`,
      [
        unRegisteredUser.email,
        unRegisterHash,
        unRegisteredUser.registered,
        `{${unRegisteredUser.resetToken[0]}, ${unRegisteredUser.resetToken[1]}}`,
      ]
    );

    const [registerRes, unregisterRes] = await Promise.all([
      registered,
      unRegistered,
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
    };
  } catch (err) {
    console.error("Create Test Users Error - ", err);
    throw new Error("Unable to create test users");
  }
};

export default testUsers;
