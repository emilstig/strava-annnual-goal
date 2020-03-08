import React from "react";
import Row from "../UI/Layout/Grid/Row";
import Column from "../UI/Layout/Grid/Column";
import Flex from "../UI/Layout/Flex";

import Counter from "../Counter/Counter";

const Stats = ({ stats, view }) => {
  const { current } = stats;
  const { headers, rows } = current;
  return (
    <React.Fragment>
      {headers && (
        <Row bg="gray2" py={[2, null, null, 2]} flexDirection="row">
          {headers.length > 0 &&
            headers.map((header, index) => {
              const { label, alignment } = header;
              const isRight = alignment === "right";
              return (
                <Column
                  key={"header-" + index}
                  width={[3 / 12, null, null, 2 / 12]}
                  ml={isRight ? "auto" : null}
                  textAlign={isRight ? "right" : null}
                >
                  {label}
                </Column>
              );
            })}
        </Row>
      )}
      {rows &&
        rows.length > 0 &&
        rows.map((row, index) => {
          const { label, columnsLeft, columnsRight } = row;
          return (
            <Row
              key={"row-" + index}
              py={[2, null, null, 2]}
              bg={index % 2 === 1 ? "gray2" : ""}
              flexDirection="row"
            >
              <Column width={[3 / 12, null, null, 2 / 12]}>
                {label && label}
              </Column>

              {columnsLeft &&
                columnsLeft.length > 0 &&
                columnsLeft.map((column, index) => {
                  const { data, type } = column;
                  return (
                    <Column
                      key={"stat-" + index}
                      width={[3 / 12, null, null, 2 / 12]}
                    >
                      {view > 1 ? (
                        <Counter number={data} value={type} />
                      ) : (
                        `0 ${type}`
                      )}
                    </Column>
                  );
                })}

              {columnsRight &&
                columnsRight.length > 0 &&
                columnsRight.map((column, index) => {
                  const { data, difference, type } = column;
                  return (
                    <Column
                      key={"stat-" + index}
                      width={[3 / 12, null, null, 2 / 12]}
                      ml="auto"
                      textAlign="right"
                    >
                      <Flex flexDirection="row" justifyContent="flex-end">
                        <Flex
                          flexDirection="row"
                          justifyContent="flex-end"
                          color={Math.sign(difference) === -1 ? "orange" : null}
                        >
                          {view > 1 ? (
                            <React.Fragment>
                              <Counter
                                number={difference}
                                sign={true}
                                value={""}
                              />
                            </React.Fragment>
                          ) : (
                            ``
                          )}
                        </Flex>
                        <Flex
                          width="96px"
                          flexDirection="row"
                          justifyContent="flex-end"
                        >
                          {view > 1 ? (
                            <Counter number={data} value={type} />
                          ) : (
                            `0 ${type}`
                          )}
                        </Flex>
                      </Flex>
                    </Column>
                  );
                })}
            </Row>
          );
        })}
    </React.Fragment>
  );
};

export default Stats;
