const POST_FIELDS = `#graphql
  fragment postFields on Post {
    __typename
    id
    title
    description
    excerpt
    content {
      __typename
      html
      tableOfContents {
        __typename
        href
        level
        heading
      }
    }
    author {
      __typename
      name
      image
    }
    status
    url {
      __typename
      href
      slug
    }
    imageBanner
    dateCreated
    datePublished
    lastModified
    views
    isBinned
    binnedAt
    tags {
      __typename
      id
      name
      dateCreated
      lastModified
    }
  }
`;

export const CREATE_POST = `#graphql
  ${POST_FIELDS}
  mutation CreatePost($post: CreatePostInput!) {
    createPost(post: $post) {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on SinglePost {
        __typename
        post {
          ...postFields
        }
        status
      }

      ... on PostValidationError {
        __typename
        titleError
        descriptionError
        excerptError
        contentError
        tagIdsError
        imageBannerError
        status
      }
    }
  }
`;

export const EDIT_POST = `#graphql
  ${POST_FIELDS}
  mutation EditPost($post: EditPostInput!) {
    editPost(post: $post) {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on SinglePost {
        __typename
        post {
          ...postFields
        }
        status
      }

      ... on EditPostValidationError {
        __typename
        idError
        titleError
        descriptionError
        excerptError
        contentError
        tagIdsError
        imageBannerError
        editStatusError
        status
      }
    }
  }
`;

export const DRAFT_POST = `#graphql
  ${POST_FIELDS}
  mutation DraftPost($post: DraftPostInput!) {
    draftPost(post: $post) {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on SinglePost {
        __typename
        post {
          ...postFields
        }
        status
      }

      ... on PostValidationError {
        __typename
        titleError
        descriptionError
        excerptError
        contentError
        tagIdsError
        imageBannerError
        status
      }
    }
  }
`;

export const GET_POST = `#graphql
  ${POST_FIELDS}
  query GetPost($slug: String!) {
    getPost(slug: $slug) {
      ... on  BaseResponse {
        __typename
        message
        status
      }

      ... on SinglePost {
        __typename
        post {
          ...postFields
        }
        status
      }

      ... on GetPostValidationError {
        __typename
        slugError
        status
      }
    }
  }
`;

export const GET_POSTS = `#graphql
  ${POST_FIELDS}
  query GetPosts($after: ID, $size: Int, $sort: SortPostsBy, $status: PostStatus) {
    getPosts(after: $after, size: $size, sort: $sort, status: $status) {
      ... on GetPostsData {
        __typename
        posts {
          ...postFields
        }
        pageData {
          __typename
          previous
          next
        }
        status
      }

      ... on GetPostsValidationError {
        __typename
        afterError
        sizeError
        sortError
        statusError
        status
      }

      ... on BaseResponse {
        __typename
        message
        status
      }
    }
  }
`;

export const UNPUBLISH_POST = `#graphql
  ${POST_FIELDS}
  mutation UnpublishPost($postId: ID!) {
    unpublishPost(postId: $postId) {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on SinglePost {
        __typename
        post {
          ...postFields
        }
        status
      }

      ... on PostIdValidationError {
        __typename
        postIdError
        status
      }
    }
  }
`;

export const UNDO_UNPUBLISH_POST = `#graphql
  ${POST_FIELDS}
  mutation UndoUnpublishPost($postId: ID!) {
    undoUnpublishPost(postId: $postId) {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on SinglePost {
        __typename
        post {
          ...postFields
        }
        status
      }

      ... on PostIdValidationError {
        __typename
        postIdError
        status
      }
    }
  }
`;

export const BIN_POST = `#graphql
  ${POST_FIELDS}
  mutation BinPost($postId: ID!) {
    binPost(postId: $postId) {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on SinglePost {
        __typename
        post {
          ...postFields
        }
        status
      }

      ... on PostIdValidationError {
        __typename
        postIdError
        status
      }
    }
  }
`;

export const BIN_POSTS = `#graphql
  ${POST_FIELDS}
  mutation BinPosts($postIds: [ID!]!) {
    binPosts(postIds: $postIds) {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on Posts {
        __typename
        posts {
          ...postFields
        }
        status
      }

      ... on PostsWarning {
        __typename
        posts {
          ...postFields
        }
      }

      ... on PostIdsValidationError {
        __typename
        postIdsError
        status
      }
    }
  }
`;

export const UN_BIN_POSTS = `#graphql
  ${POST_FIELDS}
  mutation UnBinPosts($postIds: [ID!]!) {
    unBinPosts(postIds: $postIds) {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on Posts {
        __typename
        posts {
          ...postFields
        }
        status
      }


      ... on PostsWarning {
        __typename
        posts {
          ...postFields
        }
      }

      ... on PostIdsValidationError {
        __typename
        postIdsError
        status
      }
    }
  }
`;

export const DELETE_POSTS_FROM_BIN = `#graphql
  ${POST_FIELDS}
  mutation DeletePostsFromBin($postIds: [ID!]!) {
    deletePostsFromBin(postIds: $postIds) {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on Posts {
        __typename
        posts {
          ...postFields
        }
        status
      }

      ... on PostsWarning {
        __typename
        posts {
          ...postFields
        }
      }

      ... on PostIdsValidationError {
        __typename
        postIdsError
        status
      }
    }
  }
`;

export const EMPTY_BIN = `#graphql
  ${POST_FIELDS}
  mutation EmptyBin {
    emptyBin {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on Posts {
        __typename
        posts {
          ...postFields
        }
        status
      }
    }
  }
`;

export const DELETE_POST_CONTENT_IMAGES = `#graphql
  mutation DeletePostContentImages($images: [String!]!) {
    deletePostContentImages(images: $images) {
      ... on BaseResponse {
        __typename
        message
        status
      }
      ... on DeletePostContentImagesValidationError {
        __typename
        imagesError
        status
      }
    }
  }
`;
