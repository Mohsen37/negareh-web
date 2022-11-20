import styled from "styled-components";

export const BaseBox = styled.div`
  background-color: white;
  border: 1px solid ${(props) => props.theme.borderColor};
`;

export const GrayBoldLink = styled.span`
  font-weight: bold;
  color: #a6a6a6;
`;

export const BoldText = styled.span`
  font-weight: 600;
`;
