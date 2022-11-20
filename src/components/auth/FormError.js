import styled from "styled-components";

const FormErrorStyle = styled.p`
  color: crimson;
  font-size: 14px;
  text-align: center;
  padding: 0.5rem;
`;

function FormError({ message }) {
  return message === "" || !message ? null : (
    <FormErrorStyle>{message}</FormErrorStyle>
  );
}

export default FormError;
