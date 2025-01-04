import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: ${props => props.theme.colors.background};
    font-family: ${props => props.theme.fonts.body};
    color: ${props => props.theme.colors.text};
  }

  * {
    box-sizing: border-box;
  }

  textarea {
    font-family: ${props => props.theme.fonts.body};
  }
`; 