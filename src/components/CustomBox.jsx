import React from "react";
import { FaUserFriends } from "react-icons/fa";
import { MdPerson } from "react-icons/md";

function CustomBox({childNode, onClick }) {
  const hasHadiths = childNode?.number_of_hadiths !== undefined && childNode?.number_of_hadiths !== null;

  return (
    <>
      <div className="node-box">
        <a href="#" onClick={onClick} className="node-content">
          <div className="node-text">
            <div className="node-name">{childNode?.name}</div>
          </div>
        </a>
      </div>
      {hasHadiths && (
        <div className="trained-days-box">
          <div>
            <MdPerson size={20} className="trained-days-icon" />
            <span className="trained-days-text">{childNode?.number_of_hadiths}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomBox;
