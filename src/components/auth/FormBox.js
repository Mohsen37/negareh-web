import styled from "styled-components";
import { BaseBox } from "../shared";

const FormBoxStyle = styled(BaseBox)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* align-items: center; */
    width: 100%;
  }
  padding: 2rem;
  padding-bottom: 1rem;
  margin-bottom: 0.5rem;
  h1 {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: 4rem;
    font-weight: 500;
    font-family: "Anastasia";
  }
`;

function FormBox({ children }) {
  return <FormBoxStyle>{children}</FormBoxStyle>;
}

export default FormBox;
