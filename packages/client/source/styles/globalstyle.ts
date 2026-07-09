// import {createGlobalStyle} from "styled-components";
import { css } from "@emotion/react";

const GlobalStyle = css`
  @font-face {
    font-family: 'SFProDisplay-Bold';
    src: url("../fonts/eot/SFProDisplay-Bold.eot") format('eot'),
    url("../fonts/ttf/SFProDisplay-Bold.ttf") format('ttf'),
    url("../fonts/woff/SFProDisplay-Bold.woff") format('woff'),
    url("../fonts/woff2/SFProDisplay-Bold.woff2") format('woff2')
  }

  html {
    font-size: 100%;
    height: 100%;
  }

  body,
  ul,
  ol,
  li,
  dl,
  dt,
  dd,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  figure,
  form,
  fieldset,
  input,
  legend,
  pre,
  abbr,
  button {
    margin: 0;
    padding: 0;
  }

  body {
    color: white;
    font-style: normal;
    font-weight: normal;
    background-color: black;
    font-family:
    //"Myriad Set Pro",
    //"Myriad Pro",
    "Lucida Grande",
    "Helvetica Neue",
    "Helvetica",
    "Arial",
    "Verdana",
    sans-serif;
    height: 100%;
  }

  main {
    height: 100%;

    section {
      &:first-of-type {
        height: 100%;
      }
    }
  }

  ol,
  ul {
    list-style: none;
  }

  a {
    color: rgb(255, 255, 255);
    text-decoration: none;

    &:hover {
      color: rgb(200, 200, 200);
    }
  }

  .table {
    display: table;
    table-layout: fixed;
    width: 100%;

    ul {
      display: table-row;

      li {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
      }
    }
  }

  .centering {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .h100 {
    height: 100%;
  }

  .frame {
    border: 1px solid #555;
    padding: 20px;
    margin: 20px;
    min-width: 500px;
    text-align: center;

    form {
      display: inline-table;
    }

    .answer {
      min-height: 60px;
      background-color: #9c9c9c;
    }
  }

  input {
    appearance: none;
    color: white;
    font-size: 16px;
    border: none;
    outline: none;
    box-sizing: border-box;

    &[type="text"],
    &[type="email"],
    &[type="password"] {
      width: 250px;
      height: 30px;
      background-color: #424242;
      padding: 0 10px;
      margin: 5px;
      display: block;

      &:focus {
        border: 2px solid #9c9c9c;
      }
    }

    &::placeholder {
      color: #e0e0e0;
    }
  }

  textarea {
    width: 100%;
    min-height: 80px;
  }

  button,
  .button {
    background-color: #6a6a6a;
    width: 120px;
    height: 28px;
    color: #e0e0e0;
    font-size: 18px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 auto;
  }
`;

export default GlobalStyle;
