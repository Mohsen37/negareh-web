import { useReactiveVar } from "@apollo/client";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { isLoggedInVar, logUserOut } from "../apollo";
import useUser from "../hooks/useUser";
import logo from "../image/logo/negareh-logo.svg";
import routes from "../routes";
import Avatar from "./Avatar";

const HeaderStyle = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  border-bottom: 2px solid ${(props) => props.theme.borderColor};
  background-color: white;
  padding: 1rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  max-width: 930px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo {
    height: 36px;
  }
`;

const Icons = styled.div`
  width: 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  i {
    cursor: pointer;
  }
`;

const Button = styled.span`
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.activeBlue};
  border-radius: 4px;
  font-size: 14px;
  padding: 0.7rem 1rem;
  font-weight: 600;
  color: white;
`;

function Header() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data } = useUser();
  return (
    <HeaderStyle>
      <Wrapper>
        <img className="logo" src={logo} alt="Logo" />
        <Icons>
          {isLoggedIn ? (
            <>
              <Link to={"/"}>
                <i className="bi bi-house-fill"></i>
              </Link>
              <i className="bi bi-compass"></i>

              <Link to={`/users/${data?.me?.userName}`}>
                {data?.me?.avatar ? (
                  <Avatar url={data?.me?.avatar} />
                ) : (
                  <i className="bi bi-person-circle"></i>
                )}
              </Link>
              <i
                onClick={() => logUserOut()}
                className="bi bi-box-arrow-right"
              ></i>
            </>
          ) : (
            <Link href={routes.home} to={routes.home}>
              <Button>Login</Button>
            </Link>
          )}
        </Icons>
      </Wrapper>
    </HeaderStyle>
  );
}

export default Header;
