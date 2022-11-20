import { useReactiveVar } from "@apollo/client";
import styled from "styled-components";
import { darkModeVar, disableDarkMode, enableDarkMode } from "../../apollo";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Wrapper = styled.div`
  max-width: 450px;
  width: 100%;
`;

const Footer = styled.footer`
  margin-top: 1rem;
`;

const DarkModeBtn = styled.span`
  cursor: pointer;
  font-size: 1.5rem;
`;

function AuthLayout({ children }) {
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <Container>
      <Wrapper>{children}</Wrapper>
      {/* <Footer>
        <DarkModeBtn onClick={darkMode ? disableDarkMode : enableDarkMode}>
          <i className={`bi bi-lightbulb${darkMode ? "-fill" : ""}`}></i>
        </DarkModeBtn>
      </Footer> */}
    </Container>
  );
}

export default AuthLayout;
