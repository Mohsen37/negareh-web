import styled from "styled-components";

const Button = styled.input`
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  padding: 1rem 0rem;
  margin-top: 28px;
  background-color: ${(props) => props.theme.activeBlue};
  text-align: center;
  color: white;
  border: none;
  font-weight: bold;
  border-radius: 4px;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
`;

export default Button;
