import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import FolderListItem from "./FolderListItem";
import { StyledLi } from "../shared";
import NewFolder from "./NewFolder";
import { Button } from "../shared";
import { setCurrentFolder } from "../../actions/folders";
import { hideSidebar } from "../../actions/sidebar";

const SideBar = styled.aside`
  background-color: #f3f3f3;
  width: ${(props) => (props.isMobile ? "100%" : "350px")};
  padding: 1.5rem;
  position: fixed;
  left: ${(props) => (props.breakpoint ? (props.show ? "0" : "-100%") : "0")};
  top: ${(props) => props.theme.headerHeight};
  min-height: ${(props) => `calc(100vh - ${props.theme.headerHeight})`};
  color: #1b1b1b;
  overflow-y: auto;
  box-shadow: 5px 0px 12px #c3c3c3;
  transition: 0.3s;
  z-index: 500;

  & ul {
    margin-top: 1rem;
  }
`;
SideBar.displayName = "SideBar";

const FolderList = ({ folders }) => {
  const SIDEBAR_ID = 3;
  const breakpoint = useMediaQuery({ maxWidth: 1450 });
  const isMobile = useMediaQuery({ maxWidth: 600 });
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();
  const activeSidebar = useSelector((state) => state.sidebar.show);
  const currentFolder = useSelector((state) => state.folders.currentFolder);

  return (
    <SideBar
      isMobile={isMobile}
      show={activeSidebar === SIDEBAR_ID}
      breakpoint={breakpoint}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Your Folders</h2>
        <Button onClick={() => setShowForm(!showForm)}>New</Button>
        {breakpoint && (
          <i
            style={{ fontSize: "2em", cursor: "pointer", color: "#a7a7a7" }}
            aria-label="Close menu"
            className="fas fa-times"
            onClick={() => dispatch(hideSidebar(SIDEBAR_ID))}
          ></i>
        )}
      </header>
      <div>
        {showForm && <NewFolder />}
        <ul>
          <StyledLi
            key="SUMMARY"
            onClick={() => dispatch(setCurrentFolder("SUMMARY"))}
            selected={currentFolder === "SUMMARY"}
          >
            Summary
          </StyledLi>
          {folders.map((folder) => (
            <FolderListItem
              key={folder._id}
              currentFolder={currentFolder}
              folder={folder}
            />
          ))}
        </ul>
      </div>
    </SideBar>
  );
};

export default FolderList;
