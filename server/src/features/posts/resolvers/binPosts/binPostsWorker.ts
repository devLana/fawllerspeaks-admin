// import { Worker, parentPort, isMainThread } from "node:worker_threads";
// import path from "node:path";
import { parentPort } from "node:worker_threads";

import { db } from "@services/db";
import { PostStatus } from "@resolverTypes";

parentPort?.on("message", postIds => {
  (async () => {
    await db.query(
      `UPDATE posts SET
            status = $1,
            date_published = $2
          WHERE
            post_id = ANY ($3)
          AND
            status = $4`,
      [PostStatus.Unpublished, null, postIds, PostStatus.Published]
    );
  })()
    .then(() => null)
    .catch(() => null);
});

// const binPostsWorker = (binnedPostIds: string[]) => {
//   if (isMainThread) {
//     const worker = new Worker(path.join(__dirname, "binPostsWorker.ts"));

//     worker.postMessage(binnedPostIds);

//     worker.on("error", err => {
//       console.error("Worker error - ", err);
//     });
//   } else {
//     parentPort?.on("message", postIds => {
//       (async () => {
//         await db.query(
//           `UPDATE posts SET
//             status = $1,
//             date_published = $2
//           WHERE
//             post_id = ANY ($3)
//           AND
//             status = $4`,
//           [PostStatus.Unpublished, null, postIds, PostStatus.Published]
//         );
//       })()
//         .then(() => null)
//         .catch(() => null);
//     });
//   }
// };

// export default binPostsWorker;
