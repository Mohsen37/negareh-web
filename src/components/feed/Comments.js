import React, { useRef } from "react";
import { gql, useMutation } from "@apollo/client";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import Comment from "./Comment";
import useUser from "../../hooks/useUser";

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      id
      error
    }
  }
`;

const CommentsContainer = styled.div`
  margin-top: 8px;
`;

const CommentNumber = styled.span`
  display: block;
  margin-top: 8px;
  opacity: 0.6;
  font-size: 14px;
  font-weight: 500;
`;

const PostCommentContainer = styled.div`
  width: 100%;
  margin-top: 16px;
  margin-bottom: 8px;
  padding-top: 20px;
  border-top: 1px solid ${(props) => props.theme.borderColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  form {
    width: 98%;
    input {
      margin-left: 8px;
      width: 98%;
    }
  }
  i {
    margin-left: 8px;
    margin-right: 4px;
    font-size: 24px;
    cursor: pointer;
  }
`;

function Comments({ author, caption, commentNumber, comments, photoId }) {
  const postComment = useRef();
  const { data: userData } = useUser();
  const createCommentUpdate = (cache, result) => {
    const { payload } = getValues();
    setValue("payload", "");
    const {
      data: {
        createComment: { ok, id },
      },
    } = result;
    if (ok && userData?.me) {
      const newComment = {
        __typename: "Comment",
        createdAt: Date.now() + "",
        id,
        isMine: true,
        payload,
        user: {
          ...userData.me,
        },
      };
      const newCacheComment = cache.writeFragment({
        data: newComment,
        fragment: gql`
          fragment BSName on Comment {
            id
            createdAt
            isMine
            payload
            user {
              userName
              avatar
            }
          }
        `,
      });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          comments(prev) {
            return [...prev, newCacheComment];
          },
          commentNumber(prev) {
            return prev + 1;
          },
        },
      });
    }
  };
  const [createCommentMuattion, { loading }] = useMutation(
    CREATE_COMMENT_MUTATION,
    { update: createCommentUpdate }
  );
  const { register, handleSubmit, setValue, getValues } = useForm();
  const onValid = (data) => {
    const { payload } = data;
    if (loading) {
      return;
    }
    createCommentMuattion({
      variables: {
        photoId,
        payload,
      },
    });
  };
  return (
    <CommentsContainer>
      <Comment author={author} payload={caption} />
      <CommentNumber>
        {commentNumber === 1 ? "1 comment" : `${commentNumber} comments`}
      </CommentNumber>
      {comments?.map((comment) => (
        <Comment
          id={comment.id}
          photoId={photoId}
          key={comment.id}
          isMine={comment.isMine}
          author={comment.user.userName}
          payload={comment.payload}
        />
      ))}
      <PostCommentContainer>
        <form onSubmit={handleSubmit(onValid)}>
          <input
            {...register("payload", { required: true })}
            type="text"
            placeholder="Add a comment..."
          />
          <input type="submit" value="" hidden ref={postComment} />
        </form>
        <i
          onClick={() => postComment.current.click()}
          className="bi bi-send"
        ></i>
      </PostCommentContainer>
    </CommentsContainer>
  );
}

Comments.propTypes = {
  photoId: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  caption: PropTypes.string,
  commentNumber: PropTypes.number.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.shape({
        avatar: PropTypes.string,
        userName: PropTypes.string.isRequired,
      }),
      payload: PropTypes.string.isRequired,
      isMine: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ),
};

export default Comments;
