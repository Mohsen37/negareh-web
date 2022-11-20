import styled from "styled-components";

const AvatarStyle = styled.div`
  width: ${(props) => (props.lg ? "40px" : "32px")};
  height: ${(props) => (props.lg ? "40px" : "32px")};
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* outline: 2px solid black;
  outline-offset: 1px; */
  /* padding: 0.1rem;
  background: linear-gradient(#fff, #fff) padding-box,
    linear-gradient(45deg, slateblue, coral) border-box;
  border: 2px solid transparent; */
  img {
    min-width: 100%;
    min-height: 100%;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  border-radius: 100%;
`;

function Avatar({ url = "", lg = false }) {
  return (
    <AvatarStyle lg={lg}>
      {url !== "" ? (
        <img src={url} alt="Avatar" />
      ) : (
        <i className="bi bi-person-circle"></i>
      )}
    </AvatarStyle>
  );
}

export default Avatar;
