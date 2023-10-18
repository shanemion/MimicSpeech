import React from "react";
import { Title } from "../../../components/Title";
import SavedAuthButtons from "../../../components/SavedAuthButtons";
import PopupMenu from "../../dashboard/components/popup-menu/PopupMenu";

const SavedHeader = ({ typeResponse, setTypeResponse }) => {
  return (
    <div className="titleContainer">
      <div className="subTitleContainer">
        <Title />
        <div>
        </div>
      </div>
      <div style={{display: "flex", gap: "8px"}}>
       <SavedAuthButtons /> <PopupMenu />
       </div>
    </div>
  );
};

export default SavedHeader;
