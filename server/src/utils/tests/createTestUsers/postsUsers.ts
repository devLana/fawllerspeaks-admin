import bcrypt from "bcrypt";
import type { Pool } from "pg";

import { unRegisteredUser, registeredUser, postAuthor } from "../mocks";
import dateToISOString from "../../dateToISOString";
import type { DbTestUser } from "@types";

export interface Users {
  readonly registeredUser: DbTestUser;
  readonly unregisteredUser: DbTestUser;
  readonly postAuthor: DbTestUser;
}

const postsUsers = async (db: Pool): Promise<Users> => {
  try {
    const unregisterPromise = bcrypt.hash(unRegisteredUser.password, 10);
    const registerPromise = bcrypt.hash(registeredUser.password, 10);
    const authorPromise = bcrypt.hash(postAuthor.password, 10);

    const [unRegisterHash, registerHash, authorHash] = await Promise.all([
      unregisterPromise,
      registerPromise,
      authorPromise,
    ]);

    const registered = db.query<DbTestUser>(
      `INSERT INTO users (
        email,
        password,
        first_name,
        last_name,
        is_registered,
        reset_token
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        image,
        user_id "userId",
        date_created "dateCreated",
        reset_token "resetToken"`,
      [
        registeredUser.email,
        registerHash,
        registeredUser.firstName,
        registeredUser.lastName,
        registeredUser.registered,
        `{${registeredUser.resetToken[0]}, ${registeredUser.resetToken[1]}}`,
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
        image,
        user_id "userId",
        date_created "dateCreated",
        reset_token "resetToken"`,
      [
        unRegisteredUser.email,
        unRegisterHash,
        unRegisteredUser.registered,
        `{${unRegisteredUser.resetToken[0]}, ${unRegisteredUser.resetToken[1]}}`,
      ]
    );

    const authored = db.query<DbTestUser>(
      `INSERT INTO users (
        email,
        password,
        first_name,
        last_name,
        is_registered
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING
        image,
        user_id "userId",
        date_created "dateCreated",
        reset_token "resetToken"`,
      [
        postAuthor.email,
        authorHash,
        postAuthor.firstName,
        postAuthor.lastName,
        postAuthor.registered,
      ]
    );

    const [registerRes, unregisterRes, authorRes] = await Promise.all([
      registered,
      unRegistered,
      authored,
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
      postAuthor: {
        ...authorRes.rows[0],
        dateCreated: dateToISOString(authorRes.rows[0].dateCreated),
      },
    };
  } catch (err) {
    console.log("Create Posts Users Error - ", err);
    throw new Error("Unable to create posts users");
  }
};

export default postsUsers;
