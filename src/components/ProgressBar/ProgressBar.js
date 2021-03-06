import React from "react";
import styled from "styled-components";
import Box from "../UI/Layout/Box";

const Wrapper = styled(Box)`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 24px;

  @media (min-width: ${(props) => props.theme.breakpoints[2]}) {
    height: 24px;
  }
`;

const Today = styled(Box)`
  ${({ theme }) => theme.mixins.transitionSnappy("transform", "0.8s")}
  content: " ";
  position: absolute;
  z-index: 3;
  width: 2px;
  height: calc(100% + 6px);
  left: ${(props) => props.target}%;
  top: -3px;
  background-color: ${({ theme }) => theme.colors.black};
  transform: scale(${(props) => (props.target ? 1 : 0)});
`;

const Difference = styled(Box)`
  ${({ theme }) => theme.mixins.transitionStandard("all", "0.6s")}
  position: absolute;
  z-index: 3;
  top: 0;
  transform: translateY(-18px);
  opacity: 0;

  @media (min-width: ${(props) => props.theme.breakpoints[2]}) {
    transform: translateY(-26px);
  }
`;

const Number = styled(Box)`
  ${({ theme }) => theme.mixins.transitionStandard("color", "0.6s")}
`;

const Bar = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: ${({ theme }) => theme.colors.grayLight};
  border-radius: 60px;
  z-index: 2;
  overflow: hidden;
  height: 100%;
`;

const Progress = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;

  &::before {
    ${({ theme }) => theme.mixins.transitionSnappy("width", "1s")}
    content: " ";
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: ${({ theme }) => theme.colors.green};
    width: ${(props) => props.progress}%;
  }

  &::after {
    ${({ theme }) => theme.mixins.transitionSnappy("width", "1s")}
    content: " ";
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: ${({ theme }) => theme.colors.orange};
    width: ${(props) => props.target}%;
  }
`;

export const checkSign = (number) => {
  return Math.sign(Math.round(number)) === -1 && Math.round(number) !== 0
    ? "negative"
    : Math.sign(Math.round(number)) === 1 && Math.round(number) !== 0
    ? "positive"
    : "zero";
};

const ProgressBar = ({ progress }) => {
  const {
    distanceGoalDifference,
    distanceTargetDifference,
    distanceAmount,
    distanceTargetAmount,
  } = progress;
  const isTargetSign = checkSign(distanceTargetDifference);
  const isGoalSign = checkSign(distanceGoalDifference);

  const targetDifference = Math.abs(distanceTargetDifference);
  const goalDifference = Math.abs(distanceGoalDifference);
  const targetStatus =
    isTargetSign === "negative"
      ? "behind plan"
      : isTargetSign === "positive"
      ? "before plan"
      : "on plan";
  const goalStatus =
    isGoalSign === "negative"
      ? "to go"
      : isGoalSign === "positive"
      ? "extra"
      : "On goal";
  return (
    <Wrapper>
      <Today
        target={
          distanceTargetAmount === 0 || distanceTargetAmount > 100
            ? null
            : distanceTargetAmount
        }
      />
      <Difference
        sign={isTargetSign}
        className="difference"
        left={["0", null, null, "0"]}
      >
        {(isTargetSign === "negative" || isTargetSign === "positive") && (
          <Number
            as="span"
            mr={"6px"}
            color={
              isTargetSign === "negative"
                ? "orange"
                : isTargetSign === "positive"
                ? "green"
                : "black"
            }
          >
            {targetDifference} km
          </Number>
        )}
        {targetStatus}
      </Difference>
      <Difference
        sign={isGoalSign}
        className="difference"
        right={["0", null, null, "0"]}
      >
        {(isGoalSign === "negative" || isGoalSign === "positive") && (
          <Number
            as="span"
            mr={"6px"}
            color={
              isGoalSign === "negative"
                ? "orange"
                : isGoalSign === "positive"
                ? "green"
                : "black"
            }
          >
            {goalDifference} km
          </Number>
        )}
        {goalStatus}
      </Difference>
      <Bar className="Bar">
        <Progress
          className="Progress"
          progress={distanceAmount}
          target={distanceTargetAmount}
        />
      </Bar>
    </Wrapper>
  );
};

export default ProgressBar;
