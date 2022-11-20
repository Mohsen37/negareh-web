import styled from "styled-components";

const Input = styled.input`
  margin-top: 8px;
  padding: 12px 16px;
  border: 1px solid
    ${(props) => (props.hasError ? "crimson" : props.theme.borderColor)};
  border-radius: 4px;
  &:focus {
    border: 1px solid ${(props) => props.theme.activeBlue};
  }
`;

export default Input;
