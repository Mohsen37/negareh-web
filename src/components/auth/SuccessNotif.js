import styled from "styled-components";

const SuccessNotifStyle = styled.div`
  text-align: center;
  background-color: rgba(46, 213, 115, 0.25);
  width: 100%;
  padding: 1rem 2rem;
  color: #138a4b;
  font-weight: 600;
  border: 1px solid #2ed573;
  border-radius: 4px;
`;

function SuccessNotif({ message }) {
  return message === "" || !message ? null : (
    <SuccessNotifStyle>{message}</SuccessNotifStyle>
  );
}

export default SuccessNotif;
