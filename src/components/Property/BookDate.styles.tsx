import styled from "styled-components";

export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.5rem 0;
  max-width: 500px;
  padding: 1rem;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  flex: 1;

  > button {
    align-self: flex-end;
  }
`;

export const FormFieldsWrapper = styled.div`
  display: flex;
  justify-content: flex-end
`