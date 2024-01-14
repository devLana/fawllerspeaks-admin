const POST_FIELDS = `#graphql
  fragment postFields on Post {
    __typename
    id
    title
    description
    content
    author {
      name
      image
    }
    status
    url
    slug
    imageBanner
    dateCreated
    datePublished
    lastModified
    views
    isInBin
    isDeleted
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

      ... on CreatePostValidationError {
        __typename
        titleError
        descriptionError
        contentError
        tagsError
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

      ...on PostValidationError {
        __typename
        postIdError
        titleError
        descriptionError
        contentError
        tagsError
        imageBannerError
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
        postIdError
        titleError
        descriptionError
        contentError
        tagsError
        imageBannerError
        status
      }
    }
  }
`;

export const GET_POST = `#graphql
  ${POST_FIELDS}
  query GetPost($postId: ID!) {
    getPost(postId: $postId) {
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

      ... on PostIdValidationError {
        __typename
        postIdError
        status
      }
    }
  }
`;

export const GET_POSTS = `#graphql
  ${POST_FIELDS}
  query GetPosts {
    getPosts {
      ... on  NotAllowedError {
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

export const PUBLISH_POST = `#graphql
  ${POST_FIELDS}
  mutation PublishPost($postId: ID!) {
    publishPost(postId: $postId) {
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
