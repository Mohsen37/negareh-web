import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const lightTheme = {
  activeBlue: "#0095f6",
  bgColor: "#f1f2f6",
  fontColor: "rgb(38,38,38)",
  borderColor: "#DBDBDB",
};

export const darkTheme = {
  activeBlue: "#0095f6",
  bgColor: "#1e272e",
  fontColor: "#f1f2f6",
  borderColor: "#DBDBDB",
};

export const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
  }
  input {
    all: unset;
  }
  body {
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.fontColor};
    font-family: "Poppins";

  }
  a {
    text-decoration: none;
  }

`;
