import React from "react";
import RenderSelectRequest from "./RenderSelectRequest";

function MainSelectRequestContainer(props) {
  return <RenderSelectRequest requestID={props.requestID} />;
}

export default MainSelectRequestContainer;