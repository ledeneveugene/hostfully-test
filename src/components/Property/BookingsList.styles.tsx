import styled from "styled-components";

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  @media (max-width: 48em) {
    gap: 1rem;
    justify-content: flex-end;
    align-items: center;
  }
`;

export const AlertButtons = styled.div`
  margin-right: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

export const FlexLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
export const MobileBlock = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
`;

export const MobileBlockWrapper = styled.div`
  display: flex;
  @media (max-width: 30em) {
    flex-direction: column;
  }
`;
