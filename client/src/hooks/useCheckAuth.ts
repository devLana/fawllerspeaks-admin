import * as React from "react";
import { useRouter } from "next/router";

import { gql, useApolloClient } from "@apollo/client";

import { useSession } from "@context/SessionContext";

interface User {
  isRegistered: boolean;
}

const useCheckAuth = () => {
  const router = useRouter();
  const { userId } = useSession();
  const client = useApolloClient();

  React.useEffect(() => {
    router.beforePopState(({ as }) => {
      if (userId) {
        const storeUser = client.readFragment<User>({
          id: userId,
          fragment: gql`
            fragment GetAuthUser on User {
              isRegistered
            }
          `,
        });

        if (storeUser?.isRegistered) {
          if (
            as === "/login" ||
            as === "/forgot-password" ||
            as === "/reset-password" ||
            as === "/register"
          ) {
            void router.push("/");
          }
        } else if (storeUser && !storeUser.isRegistered) {
          if (as !== "/register") void router.push("/register");
        }
      } else if (
        as !== "/login" &&
        as !== "/forgot-password" &&
        as !== "/reset-password" &&
        as !== "/404"
      ) {
        void router.push("/login");
      }

      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [client, router, userId]);
};

export default useCheckAuth;
