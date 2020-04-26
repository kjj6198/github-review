import styled from "styled-components";

const LoadingCircle = styled.div<{ width: number }>`
  display: inline-block;
  width: ${(p) => p.width + 10}px;
  height: ${(p) => p.width + 10}px;

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  &:after {
    content: " ";
    display: block;
    width: ${(p) => p.width}px;
    height: ${(p) => p.width}px;
    margin: 4px;
    border-radius: 50%;
    border: 3px solid #27cc95;
    border-color: #27cc95 transparent #27cc95 transparent;
    animation: rotate 1.2s linear infinite;
  }
`;

export default LoadingCircle;
