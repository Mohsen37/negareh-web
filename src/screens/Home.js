import { gql, useQuery } from "@apollo/client";
import styled from "styled-components";
import { logUserOut } from "../apollo";
import Avatar from "../components/Avatar";
import { BoldText } from "../components/shared";

const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      id
      user {
        userName
        avatar
      }
      file
      caption
      likes
      comments
      createdAt
      isMine
      isLiked
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
  }
`;

const Likes = styled(BoldText)`
  margin-top: 16px;
  display: block;
`;

function Home() {
  const { data } = useQuery(FEED_QUERY);
  console.log(data);

  return (
    <div>
      {data?.seeFeed?.map((photo) => (
        <PhotoContainer key={photo.id}>
          <PhotoHeader>
            <Avatar url={photo.user.avatar} lg={true} />
            <UsernameStyle>{photo.user.userName}</UsernameStyle>
          </PhotoHeader>
          <PhotoFile src={photo.file} alt="" />
          <PhotoDetails>
            <PhotoActions>
              <PhotoAction>
                <i
                  style={{ color: photo.isLiked ? "crimson" : "inherit" }}
                  className={photo.isLiked ? "bi bi-heart-fill" : "bi bi-heart"}
                ></i>
                <i className="bi bi-chat-right-text"></i>
                <i className="bi bi-send-fill"></i>
              </PhotoAction>
              <div>
                <i className="bi bi-bookmark"></i>
              </div>
            </PhotoActions>
            <Likes>
              {photo.likes === 1 ? "1 Like" : `${photo.likes} Likes`}
            </Likes>
          </PhotoDetails>
        </PhotoContainer>
      ))}
    </div>
  );
}

export default Home;
