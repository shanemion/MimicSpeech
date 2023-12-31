import React from "react";
import { Title } from "../../../components/Title";
import AuthButtons from "../../../components/AuthButtons";
import PopupMenu from "../../dashboard/components/popup-menu/PopupMenu";

const GenerateHeader = ({ typeResponse, setTypeResponse }) => {
  return (
    <div className="titleContainer">
      <div className="subTitleContainer">
        <Title />
        <div>
        </div>
      </div>
      <div style={{display: "flex", gap: "8px"}}>
       <AuthButtons /> <PopupMenu />
       </div>
    </div>
  );
};

export default GenerateHeader;
