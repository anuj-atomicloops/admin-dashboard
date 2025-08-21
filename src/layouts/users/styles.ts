import styled from "styled-components";
export const FormStyledContainer = styled.div`
  /* border: 1px solid green; */

  .formFieldSection {
    margin-bottom: 15px;
    border-bottom: 1px solid #eaeee9;
  }

  .formDoubleField {
    display: flex;
    gap: 30px;
    /* border: 1px solid black; */

    .formSingleField {
      flex-grow: 1;
      display: flex;
      align-items: center;
        padding-bottom: 15px;
      gap: 10px;
      .inputLabel {
        width: 70%;
      }
      .inputBox {
        /* border-radius: 0; */
      }
    }
  }
`;
