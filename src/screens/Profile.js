import {
  gql,
  useApolloClient,
  useMutation,
  useQuery,
  useReactiveVar,
} from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { showEditProfile } from "../apollo";
import Button from "../components/auth/Button";
import { BoldText } from "../components/shared";
import { PHOTO_FRAGMENT } from "../fragments";
import useUser from "../hooks/useUser";
import EditProfile from "./EditProfile";

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($userName: String!) {
    followUser(userName: $userName) {
      ok
    }
  }
`;
const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($userName: String!) {
    unfollowUser(userName: $userName) {
      ok
    }
  }
`;

export const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      firstName
      lastName
      userName
      bio
      avatar
      photos {
        ...PhotoFragment
      }
      isMe
      isFollowing
      totalFollowers
      totalFollowing
    }
  }
  ${PHOTO_FRAGMENT}
`;

const ProfileContainer = styled.div`
  margin-top: 2rem;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 980px;
  margin-top: 1rem;
`;

const TopHeader = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 2rem;
  border-bottom: 1px solid #c9c9c9;
`;

const Avatar = styled.div`
  background: url(${(props) => props.bg});
  width: 210px;
  height: 210px;
  background-size: cover;
  border-radius: 100%;
  margin-right: 8rem;
`;

const ProfileDetail = styled.div`
  width: 350px;
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  .bio {
    font-size: 18px;
  }
`;

const Username = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  h1 {
    font-size: 2rem;
    font-weight: 600;
    padding-bottom: 2rem;
    i {
      color: dodgerblue;
      font-size: 18px;
    }
  }
`;

const FollowDetail = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 1rem;
  p {
    margin-right: 2rem;
  }
`;
const Gallery = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 2rem;
`;
const Photo = styled.div`
  background-image: url(${(props) => (props.bg ? props.bg : "blak")});
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const Icons = styled.div`
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.div`
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 16px;
  color: white;
  i {
    margin-right: 8px;
  }
`;
const ProfileEvent = styled(Button).attrs({
  as: "span",
})`
  margin-top: 0;
  width: fit-content;
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 600;
`;

function Profile() {
  const { userName } = useParams();
  const { data: userData } = useUser();
  const client = useApolloClient();
  const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username: userName,
    },
  });

  const unfollowUserUpdate = (cache, result) => {
    const {
      data: {
        unfollowUser: { ok },
      },
    } = result;
    if (!ok) {
      return;
    }
    cache.modify({
      id: `User:${userName}`,
      fields: {
        isFollowing(prev) {
          return false;
        },
        totalFollowers(prev) {
          return prev - 1;
        },
      },
    });
    const { me } = userData;
    cache.modify({
      id: `User:${me.userName}`,
      fields: {
        totalFollowing(prev) {
          return prev - 1;
        },
      },
    });
  };

  const followUserCompleted = (data) => {
    const {
      followUser: { ok },
    } = data;
    if (!ok) {
      return;
    }
    const { cache } = client;
    cache.modify({
      id: `User:${userName}`,
      fields: {
        isFollowing(prev) {
          return true;
        },
        totalFollowers(prev) {
          return prev + 1;
        },
      },
    });
    const { me } = userData;
    cache.modify({
      id: `User:${me.userName}`,
      fields: {
        totalFollowing(prev) {
          return prev + 1;
        },
      },
    });
  };
  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    variables: {
      userName,
    },
    onCompleted: followUserCompleted,
  });
  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    variables: {
      userName,
    },
    update: unfollowUserUpdate,
  });
  const getButton = (seeProfile) => {
    const { isMe, isFollowing } = seeProfile;
    if (isMe) {
      return (
        <ProfileEvent onClick={() => showEditProfile(true)}>
          Edit Profile
        </ProfileEvent>
      );
    }
    if (isFollowing) {
      return <ProfileEvent onClick={unfollowUser}>Unfollow</ProfileEvent>;
    } else {
      return <ProfileEvent onClick={followUser}>Follow</ProfileEvent>;
    }
  };

  const showingProfile = useReactiveVar(showEditProfile);
  return (
    <ProfileContainer>
      <Helmet>
        <title>
          {loading ? "Loading..." : `${data?.seeProfile?.userName}'s Profile`}
        </title>
      </Helmet>
      <Wrapper>
        <TopHeader>
          <Avatar bg={data?.seeProfile?.avatar} />
          <ProfileDetail>
            <Username>
              <h1>
                {data?.seeProfile?.userName}{" "}
                <i className="bi bi-patch-check-fill"></i>
              </h1>
              {data?.seeProfile ? getButton(data.seeProfile) : null}
            </Username>
            <FollowDetail>
              <p>
                <BoldText>4</BoldText> posts
              </p>
              <p>
                <BoldText>{data?.seeProfile?.totalFollowers}</BoldText>{" "}
                followers
              </p>
              <p>
                <BoldText>{data?.seeProfile?.totalFollowing}</BoldText>{" "}
                following
              </p>
            </FollowDetail>
            <h3>
              {data?.seeProfile?.firstName} {data?.seeProfile?.lastName}
            </h3>
            <p className="bio">{data?.seeProfile?.bio}</p>
          </ProfileDetail>
        </TopHeader>
        <Gallery>
          {data?.seeProfile?.photos.map((photo) => (
            <Photo key={photo.id} bg={photo.file}>
              <Icons>
                <Icon>
                  <i className="bi bi-heart-fill"></i>
                  {photo.likes}
                </Icon>
                <Icon>
                  <i className="bi bi-chat-fill"></i>
                  {photo.CommentNumber}
                </Icon>
              </Icons>
            </Photo>
          ))}
        </Gallery>
      </Wrapper>
      {showingProfile ? <EditProfile /> : null}
    </ProfileContainer>
  );
}

export default Profile;
