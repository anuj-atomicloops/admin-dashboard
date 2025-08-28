import styled from "styled-components";

export const FormStyledContainer = styled.div`
  width: 100%;
  max-width: 900px; /* keeps the form centered and not too wide */
  margin: 0 auto;
  padding: 20px;

  .formDoubleField {
    display: flex;
    flex-direction: column; /* stack on mobile */
    gap: 20px;
    border-bottom: 1px solid #e7e7e7;

    @media (min-width: 640px) {
      /* sm and up → side by side */
      flex-direction: row;
      gap: 30px;
    }

    .formSingleField {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      padding-bottom: 15px;

      .inputLabel {
        font-size: 14px;
        font-weight: 500;
        color: #333 !important;
      }

      .inputBox {
        width: 100%;
        min-height: 40px;
      }
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  button {
    align-self: flex-start;

    @media (max-width: 640px) {
      width: 100%; /* full width button on mobile */
    }
  }
`;
