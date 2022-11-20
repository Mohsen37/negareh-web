import styled from "styled-components";

const SeparatorStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  div {
    background-color: rgb(219, 219, 219);
    width: 100%;
    height: 2px;
  }
  span {
    padding: 2rem 1.4rem;
    color: rgb(110, 110, 110);
  }
`;

function Separator() {
  return (
    <SeparatorStyle>
      <div></div>
      <span>OR</span>
      <div></div>
    </SeparatorStyle>
  );
}

export default Separator;
