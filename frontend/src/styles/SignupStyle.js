import styled from "styled-components";
import { Container, Form, Input, Button, FileInputLabel, HiddenFileInput, CancelButton } from './BaseStyle';

export const SignupContainer = styled(Container)`
  /* additional SignupContainer specific styles */
`;

export const SignupForm = styled(Form)`
  /* additional SignupForm specific styles */
`;

export const SignupInput = styled(Input)`
  /* additional SignupInput specific styles */
`;

export const SignupButton = styled(Button)`
  font-weight: bold;
`;

export const SignupFileInputLabel = styled(FileInputLabel)`
  background-color: #4caf50;
`;

export const SignupCancelButton = styled(CancelButton)`
  top: 5px;
  right: 5px;
`;
