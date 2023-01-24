import { gql, useMutation, useQuery } from "@apollo/client";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Avatar from "../Avatar";
import { BoldText } from "../shared";
import Comments from "./Comments";

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const PhotoContainer = styled.div`
  background-color: white;
  border: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 1rem;
  max-width: 600px;
  border-radius: 8px;
`;

const PhotoHeader = styled.div`
  padding: 12px;
  display: flex;
  align-items: center;
`;

const UsernameStyle = styled(BoldText)`
  margin-left: 0.7rem;
  font-size: 14px;
`;

const PhotoFile = styled.img`
  object-fit: cover;
  min-width: 100%;
  max-width: 600px;
  min-height: 500px;
`;

const PhotoDetails = styled.div`
  padding: 1rem;
`;

const PhotoActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
`;
const PhotoAction = styled.div`
  i {
    margin-right: 16px;
    cursor: pointer;
  }
`;

const Likes = styled(BoldText)`
  margin-top: 16px;
  display: block;
`;

function Photo({
  id,
  user,
  file,
  isLiked,
  likes,
  caption,
  commentNumber,
  comments,
}) {
  const updateToggleLike = (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev) {
            return !prev;
          },
          likes(prev) {
            if (isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };
  const [toggleLikeMutation, { loading }] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: { id },
    update: updateToggleLike,
  });
  return (
    <PhotoContainer key={id}>
      <PhotoHeader>
        <Link to={`/users/${user?.userName}`}>
          <Avatar url={user.avatar} lg={true} />
        </Link>
        <UsernameStyle>{user.userName}</UsernameStyle>
      </PhotoHeader>
      <PhotoFile src={file} alt="" />
      <PhotoDetails>
        <PhotoActions>
          <PhotoAction>
            <i
              onClick={toggleLikeMutation}
              style={{ color: isLiked ? "crimson" : "inherit" }}
              className={isLiked ? "bi bi-heart-fill" : "bi bi-heart"}
            ></i>
            <i className="bi bi-chat-right-text"></i>
            <i className="bi bi-send-fill"></i>
          </PhotoAction>
          <div>
            <i className="bi bi-bookmark"></i>
          </div>
        </PhotoActions>
        <Likes>{likes === 1 ? "1 Like" : `${likes} Likes`}</Likes>
        <Comments
          photoId={id}
          author={user.userName}
          caption={caption}
          comments={comments}
          commentNumber={commentNumber}
        />
      </PhotoDetails>
    </PhotoContainer>
  );
}

Photo.protoTypes = {
  id: PropTypes.number.isRequired,
  user: PropTypes.shape({
    avatar: PropTypes.string,
    userName: PropTypes.string.isRequired,
  }),
  caption: PropTypes.string,
  file: PropTypes.string.isRequired,
  isLiked: PropTypes.bool.isRequired,
  likes: PropTypes.number.isRequired,
  commentNumber: PropTypes.number.isRequired,
};
export default Photo;
