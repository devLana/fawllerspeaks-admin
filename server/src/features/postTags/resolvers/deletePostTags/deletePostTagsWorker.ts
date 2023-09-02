// import { Worker, parentPort, isMainThread } from "node:worker_threads";
// import path from "node:path";
import { parentPort } from "node:worker_threads";

import { db } from "@lib/db";
import type { PostTag } from "@resolverTypes";

interface Post {
  postId: string;
  tags: string[];
}

parentPort?.on("message", (tags: PostTag[]) => {
  (async () => {
    const map = new Map<string, PostTag>();

    tags.forEach(tag => {
      map.set(tag.id, tag);
    });

    const { rows: posts } = await db.query<Post>(
      `SELECT post_id "postId", tags FROM posts WHERE tags IS NOT NULL`
    );

    for (const post of posts) {
      const notDeletedTags = post.tags.filter(tag => !map.has(tag));

      if (notDeletedTags.length === post.tags.length) continue;

      const updatedTagsList = `{${notDeletedTags.join(", ")}}`;

      await db.query(`UPDATE posts SET tags = $1 WHERE post_id = $2`, [
        updatedTagsList,
        post.postId,
      ]);
    }
  })()
    .then(() => null)
    .catch(() => null);
});
//   }
// };
// const deletePostTagsWorker = (deletedTags: PostTag[]) => {
//   if (isMainThread) {
//     const worker = new Worker(path.join(__dirname, "deletePostTagsWorker.ts"));

//     worker.postMessage(deletedTags);
//     worker.on("error", err => {
//       console.log("Delete post tags worker thread error", err);
//     });
//   } else {
//     parentPort?.on("message", (tags: PostTag[]) => {
//       (async () => {
//         const map = new Map<string, PostTag>();

//         tags.forEach(tag => {
//           map.set(tag.id, tag);
//         });

//         const { rows: posts } = await db.query<Post>(
//           `SELECT post_id "postId", tags FROM posts WHERE tags IS NOT NULL`
//         );

//         for (const post of posts) {
//           const notDeletedTags = post.tags.filter(tag => !map.has(tag));

//           if (notDeletedTags.length === post.tags.length) continue;

//           const updatedTagsList = `{${notDeletedTags.join(", ")}}`;

//           await db.query(`UPDATE posts SET tags = $1 WHERE post_id = $2`, [
//             updatedTagsList,
//             post.postId,
//           ]);
//         }
//       })()
//         .then(() => null)
//         .catch(() => null);
//     });
//   }
// };

// export default deletePostTagsWorker;
