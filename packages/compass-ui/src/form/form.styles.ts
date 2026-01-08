import styled from '@emotion/styled'

export const StyledForm = styled.form`
  &.compass-form-horizontal {
    .compass-form-item {
      display: flex;
      flex-direction: row;
      align-items: flex-start;

      .compass-form-item-label {
        flex: 0 0 auto;
        margin-right: 16px;
        margin-bottom: 0;
        padding-top: 5px;
      }

      > *:not(.compass-form-item-label) {
        flex: 1;
      }
    }
  }

  &.compass-form-vertical {
    .compass-form-item {
      display: flex;
      flex-direction: column;
    }
  }

  &.compass-form-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .compass-form-item {
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 0;

      .compass-form-item-label {
        margin-right: 8px;
        margin-bottom: 0;
      }
    }
  }
`
