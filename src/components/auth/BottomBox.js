import { Link } from "react-router-dom";
import styled from "styled-components";
import { BaseBox } from "../shared";

const BottomBoxStyle = styled(BaseBox)`
  padding: 1.5rem 1px;
  text-align: center;
  font-size: 14px;
  a {
    padding-left: 4px;
    color: ${(props) => props.theme.activeBlue};
    font-weight: bold;
    text-decoration: none;
  }
`;

function BottomBox({ cta, link, linkText }) {
  return (
    <BottomBoxStyle>
      <span>{cta}</span>
      <Link to={link}>{linkText}</Link>
    </BottomBoxStyle>
  );
}

export default BottomBox;
