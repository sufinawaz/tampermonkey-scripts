// ==UserScript==
// @name         Add Gerrit Buttons
// @namespace    http://sufi.io
// @version      1.0.0
// @description  Temper monkey script for adding gerrit buttons forked from https://github.com/johnwun/tampermonkies/blob/master/Add%20demo%20button.user.js
// @author       John Wundes, Sufi Nawaz
// @include https://gerrit.nexgen.neustar.biz/*
// @grant        none
// ==/UserScript==

var $$ = document.querySelector.bind(document);
var $$all = document.querySelectorAll.bind(document);
var pollFrequency = 1000; //milliseconds
var timer1;
let gerritNumbers = [];
const gerritUrl =
  "https://gerrit.nexgen.neustar.biz/changes/?q=is:open+owner:self&q=is:open+reviewer:self+-owner:self&q=is:closed+(owner:self+OR+reviewer:self)+-age:4w+limit:10&O=881";
const urlMatch = window.location.href.toString().match(/\/(\d+)\/*/);
const changeNumber = urlMatch[1];
var loadButtonFunc = function() {
  var menu = document.getElementsByClassName("topmenuTDglue")[0];
  var oldButtonNode = document.getElementById("ns-demo-button-div");
  var projectTitleNode = document.querySelectorAll(
    "#change_infoTable > tbody > tr:nth-child(5) > td > a.gwt-InlineHyperlink"
  );
  var projectTitle = projectTitleNode.length ? projectTitleNode[0].text : "";
  var changeDescriptionDiv = document.getElementsByClassName(
    "com-google-gerrit-client-change-CommitBox_BinderImpl_GenCss_style-text"
  )[0];
  if (oldButtonNode) {
    menu.removeChild(oldButtonNode);
  }
  var node = document.createElement("div");
  node.id = "ns-demo-button-div";

  var devBtn = document.createElement("BUTTON");
  devBtn.style.color = "white";
  devBtn.id = "ns-dev-button";

  var gpBtn = document.createElement("BUTTON");
  gpBtn.style.color = "white";
  gpBtn.id = "ns-gp-button";

  let nextGerritBtn = document.createElement("BUTTON");
  nextGerritBtn.style.color = "white";
  nextGerritBtn.id = "next-gerrit-button";

  let prevGerritBtn = document.createElement("BUTTON");
  prevGerritBtn.style.color = "white";
  prevGerritBtn.id = "prev-gerrit-button";

  var miiBtn = document.createElement("BUTTON");
  miiBtn.style.color = "white";
  miiBtn.id = "ns-mii-button";

  var dockerDevBtn = document.createElement("BUTTON");
  dockerDevBtn.style.color = "white";
  dockerDevBtn.id = "ns-dock-dev-button";

  if (urlMatch && urlMatch.length === 2) {
    let gerritNumber = parseInt(changeNumber, 10);
    var htmlText = document.documentElement.innerHTML;
    var lastStartedIndex = htmlText.lastIndexOf("Build Started");
    var lastSuccessIndex = htmlText.lastIndexOf("SUCCESS");
    var lastMergedIndex = htmlText.lastIndexOf("successfully merged");
    var lastAbandonedIndex = htmlText.lastIndexOf("Abandoned");
    var lastUploadedIndex = htmlText.lastIndexOf("Uploaded");
    var lastUnstableIndex = htmlText.lastIndexOf("Unstable");
    var lastFailureIndex = htmlText.lastIndexOf("FAILURE");
    var devTextNode;
    var gpTextNode;
    var miiTextNode;
    var dockerDevTextNode;
    var nextGerritTextNode;
    var prevGerritTextNode;
    var subSiteFolder = "";

    var devUrl;
    var gpUrl;
    var miiUrl;
    var dockerDevUrl;
    var prefix;
    var nextGerritUrl;
    var prevGerritUrl;

    var commonStyles = {
      border: "2px solid rgba(0, 0, 0, 0.2)",
      borderRadius: "2px",
      backgroundColor: "#5A5",
      cursor: "pointer",
      boxSizing: "content-box",
      fontWeight: "bold",
      margin: "1px 1px 0 0"
    };

    devTextNode = document.createTextNode("Dev");
    gpTextNode = document.createTextNode("GP");
    miiTextNode = document.createTextNode("MII");
    dockerDevTextNode = document.createTextNode(`Dkr`);
    nextGerritTextNode = document.createTextNode(`Next ->`);
    prevGerritTextNode = document.createTextNode(`<- Prev`);
    // hide buttons if building
    gpBtn.style.display = "none";
    miiBtn.style.display = "none";
    dockerDevBtn.style.display = "none";
    prefix =
      projectTitle.indexOf("app-onboarding-portal") !== -1
        ? "onboarding-dev"
        : "mip";

    devUrl = `https://${prefix}.dev.agkn.net/gerrit${changeNumber.toString()}${subSiteFolder}`;
    gpUrl = `https://${prefix}.gp.agkn.net/gerrit${changeNumber.toString()}${subSiteFolder}`;
    miiUrl = `https://${prefix}.mii.agkn.net/gerrit${changeNumber.toString()}${subSiteFolder}`;
    dockerDevUrl = `https://nginx-docker.dev.agkn.net/gerrit${changeNumber.toString()}/`;

    var openDevPage = function() {
      window.open(devUrl, "_blank");
    };
    var openGpPage = function() {
      window.open(gpUrl, "_blank");
    };
    var openMiiPage = function() {
      window.open(miiUrl, "_blank");
    };
    var openDockerDevPage = function() {
      window.open(dockerDevUrl, "_blank");
    };
    if (lastMergedIndex != -1) {
      // no onclick
      devTextNode = document.createTextNode(changeNumber + " was Merged!");
      devBtn.style.backgroundColor = "#f00";
    } else if (
      lastFailureIndex > lastUploadedIndex &&
      lastStartedIndex < lastFailureIndex
    ) {
      devTextNode = document.createTextNode(changeNumber + " Build FAILURE!");
      devBtn.style.backgroundColor = "#f00";
    } else if (lastSuccessIndex < lastStartedIndex || lastSuccessIndex === -1) {
      // if a new build is in process, or hasn't been triggered yet.
      node.opacity = 0.5;
      devBtn.disabled = "disabled";
      devBtn.style.backgroundColor = "#aaa";
      if (lastUnstableIndex > lastStartedIndex) {
        devTextNode = document.createTextNode("Build Unstable");
      } else {
        devTextNode = document.createTextNode("Building " + changeNumber);
      }
    } else {
      devBtn.onclick = openDevPage;
      Object.assign(devBtn.style, commonStyles);

      gpBtn.onclick = openGpPage;
      Object.assign(gpBtn.style, commonStyles);
      gpBtn.style.display = "inline";

      miiBtn.onclick = openMiiPage;
      Object.assign(miiBtn.style, commonStyles);
      miiBtn.style.display = "inline";

      dockerDevBtn.onclick = openDockerDevPage;
      Object.assign(dockerDevBtn.style, commonStyles);
      dockerDevBtn.style.display = "inline";
    }

    if (lastUploadedIndex != -1) {
      devBtn.appendChild(devTextNode);
      gpBtn.appendChild(gpTextNode);
      miiBtn.appendChild(miiTextNode);
      dockerDevBtn.appendChild(dockerDevTextNode);
      nextGerritBtn.appendChild(nextGerritTextNode);
      prevGerritBtn.appendChild(prevGerritTextNode);

      devBtn.title = devUrl;
      gpBtn.title = gpUrl;
      miiBtn.title = miiUrl;
      dockerDevBtn.title = dockerDevUrl;
      nextGerritBtn.title = nextGerritUrl;
      prevGerritBtn.title = prevGerritUrl;

      node.appendChild(devBtn);
      node.appendChild(gpBtn);
      node.appendChild(miiBtn);
      node.appendChild(dockerDevBtn);
      if (gerritNumbers.length > 0) {
        const baseUrl = "https://gerrit.nexgen.neustar.biz/";
        const currGerritIdx = gerritNumbers.indexOf(gerritNumber);
        nextGerritUrl = `${baseUrl}${gerritNumbers[currGerritIdx + 1]}`;
        prevGerritUrl = `${baseUrl}${gerritNumbers[currGerritIdx - 1]}`;
        var openNextGerritPage = () => {
          window.open(nextGerritUrl, "_self");
        };
        var openPrevGerritPage = () => {
          window.open(prevGerritUrl, "_self");
        };

        nextGerritBtn.onclick = openNextGerritPage;
        Object.assign(nextGerritBtn.style, commonStyles);
        nextGerritBtn.style.display = "inline";

        prevGerritBtn.onclick = openPrevGerritPage;
        Object.assign(prevGerritBtn.style, commonStyles);
        prevGerritBtn.style.display = "inline";
        node.appendChild(prevGerritBtn);
        node.appendChild(nextGerritBtn);
      }
      menu.appendChild(node);
    }
    if (changeDescriptionDiv) {
      var linkedTicketDescription = changeDescriptionDiv.innerHTML
        // replaces any 'XX-NNN' style unless followed by " or < which is how they are replaced in the regex, preventing infinite recursion.
        .replace(
          /([A-Z]+[-_][0-9]+(?![<"0-9]))/g,
          '<a style="color:green;text-decoration:underline" href="https://jira.nexgen.neustar.biz/browse/$1" target="_blank">$1</a>'
        );
      changeDescriptionDiv.innerHTML = linkedTicketDescription;
    }
  }
  poller();
};

fetch(gerritUrl).then(response =>
  response
    .text()
    .then(text => JSON.parse(text.substring(5)))
    .then(t => {
      gerritNumbers = t.flatMap(e =>
        e
          .sort((a, b) => {
            return a._number - b._number;
          })
          .map(e => e._number)
      );
      console.log(gerritNumbers);
    })
);
// HACK: don't know how to make this fire on url update for spa,
// so just polling every second to update button status.
var poller = function() {
  if (document.getElementsByClassName("topmenuMenuLeft").length) {
    //update every x milliseconds if we change location.
    timer1 = setTimeout(loadButtonFunc, pollFrequency);
  } else {
    timer1 = setTimeout(poller, pollFrequency);
  }
};

poller();
