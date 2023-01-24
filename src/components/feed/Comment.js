import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { BoldText } from "../shared";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;

const CommentContainer = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  .deleteBtn {
    cursor: pointer;
  }
`;
const CommentCaption = styled.span`
  margin-left: 12px;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.activeBlue};
    cursor: pointer;
  }
`;

function Comment({ author, payload, id, isMine, photoId }) {
  const updateDeleteComment = (cache, result) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;
    if (ok) {
      cache.evict({ id: `Comment:${id}` });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber(prev) {
            return prev - 1;
          },
        },
      });
    }
  };
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: {
      id,
    },
    update: updateDeleteComment,
  });
  const onDeleteClick = () => {
    deleteCommentMutation();
  };
  return (
    <CommentContainer>
      <div>
        <Link to={`users/${author}`}>
          <BoldText>{author} </BoldText>
        </Link>
        <CommentCaption>
          {payload.split(" ").map((word, index) =>
            /#[\w]+/.test(word) ? (
              <React.Fragment key={index}>
                <Link to={`/hashtags/${word}`}>{word}</Link>{" "}
              </React.Fragment>
            ) : (
              <React.Fragment key={index}>{word} </React.Fragment>
            )
          )}
        </CommentCaption>
      </div>
      {isMine ? (
        <i
          onClick={onDeleteClick}
          className="deleteBtn bi bi-x-circle-fill"
        ></i>
      ) : null}
    </CommentContainer>
  );
}

Comment.propTypes = {
  isMine: PropTypes.bool,
  id: PropTypes.number,
  photoId: PropTypes.number,
  author: PropTypes.string.isRequired,
  payload: PropTypes.string.isRequired,
};

export default Comment;
