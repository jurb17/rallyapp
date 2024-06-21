import React from "react";
import advisoryService from "services/advisory.service";
import { articleCategories, articleSubcategories } from "./categories";

// Given: list of objects with client ids,
// Function: match the client ids and return the same list of objects, each with a "clientName" attribute.
export const mapClientNameList = async (someList, includeProspects) => {
  let clientNames = [];
  const clients = await advisoryService.getClientList({});
  const prospects = await advisoryService.getProspectList({});
  someList.forEach((item) => {
    clients.data.clients.forEach((client) => {
      let found = false;
      if (item.clientid === client.id) {
        item.clientName = client.name;
        found = true;
      }
      if (!found && includeProspects) {
        prospects.data.clients.forEach((prospect) => {
          if (prospect.id === item.clientid) {
            item.clientName = `${prospect.name} (Prospect)`;
          }
        });
      }
    });
  });
  return { newList: someList, clientList: clients, prospectList: prospects };
};

// Given: a single clientid,
// Function: return the client name.
export const mapClientName = async (id) => {
  let clientList = [];
  let clientNames = [];
  let clientName = "";
  let found = false;
  await advisoryService
    .getClientList({})
    .then((response) => {
      clientList = response.data.payload.clients;
      clientList.forEach((client) => {
        clientNames.push(client.name);
        if (client.id === id) {
          clientName = client.name;
          found = true;
        }
      });
    })
    .catch((error) => {
      return { clientList: [], clientNames: [], clientName: "", found: false };
    });
  return {
    clientName: clientName,
    clientNames: clientNames,
    clientList: clientList,
    found: found,
  };
};

// Given: a single prospectid,
// Function: return the prospect name.
export const mapProspectName = async (id) => {
  let prospectList = [];
  let prospectNames = [];
  let prospectName = "";
  let found = false;
  await advisoryService
    .getProspectList({})
    .then((response) => {
      prospectList = response.data.payload.clients;
      prospectList.forEach((prospect) => {
        prospectNames.push(prospect.name);
        if (prospect.id === id) {
          prospectName = prospect.name;
          found = true;
        }
      });
    })
    .catch((error) => {
      return {
        prospectList: [],
        prospectNames: [],
        prospectName: "",
        found: false,
      };
    });
  return {
    prospectName: prospectName,
    prospectNames: prospectNames,
    prospectList: prospectList,
    found: found,
  };
};

// Given: category id,
// Function: match the id and return the list of subcategory ids.

// Given: category id and subcategory id,
// Function: match the ids and return the names.
export const mapCategoryDisplayNames = async (categoryid, subcategoryid) => {
  let categoryDisplayName = "";
  let subcategoryDisplayName = "";
  await advisoryService
    .getConfigs({})
    .then((response) => {
      const values = Object.values(response.data.payload);
      let categories = values[1].categories;
      let subcategories = values[1].subcategories[categoryid];

      // find the category name from the category id
      categories.forEach((pair) => {
        if (pair[1] === categoryid) {
          categoryDisplayName = pair[0];
          subcategories.forEach((subpair) => {
            if (subpair[1] === subcategoryid) {
              subcategoryDisplayName = subpair[0];
              return {
                categoryDisplayName: categoryDisplayName,
                subcategoryDisplayName: subcategoryDisplayName,
              };
            }
          });
        }
      });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

// Given: categoryid and subcategoryid
// Function: match the ids and return displayable names
export const demoMapCategoryDisplayNames = (categoryid, subcategoryid) => {
  let categoryDisplayName = articleCategories[categoryid];
  let subcategoryDisplayName = "";
  // Now find the subcategory display name
  let subcatlist = articleSubcategories[categoryid];
  subcatlist.forEach((item) => {
    if (item[0] === subcategoryid) subcategoryDisplayName = item[1];
  });
  return {
    categoryDisplayName: categoryDisplayName,
    subcategoryDisplayName: subcategoryDisplayName,
  };
};

// Given: lowercase state abbreviation,
// Function: match the abbreviation and return the state name.
const states = [
  ["Alabama", "AL"],
  ["Alaska", "AK"],
  ["Arizona", "AZ"],
  ["Arkansas", "AR"],
  ["California", "CA"],
  ["Colorado", "CO"],
  ["Connecticut", "CT"],
  ["Delaware", "DE"],
  ["Florida", "FL"],
  ["Georgia", "GA"],
  ["Hawaii", "HI"],
  ["Idaho", "ID"],
  ["Illinois", "IL"],
  ["Indiana", "IN"],
  ["Iowa", "IA"],
  ["Kansas", "KS"],
  ["Kentucky", "KY"],
  ["Louisiana", "LA"],
  ["Maine", "ME"],
  ["Maryland", "MD"],
  ["Massachusetts", "MA"],
  ["Michigan", "MI"],
  ["Minnesota", "MN"],
  ["Mississippi", "MS"],
  ["Missouri", "MO"],
  ["Montana", "MT"],
  ["Nebraska", "NE"],
  ["Nevada", "NV"],
  ["New Hampshire", "NH"],
  ["New Jersey", "NJ"],
  ["New Mexico", "NM"],
  ["New York", "NY"],
  ["North Carolina", "NC"],
  ["North Dakota", "ND"],
  ["Ohio", "OH"],
  ["Oklahoma", "OK"],
  ["Oregon", "OR"],
  ["Pennsylvania", "PA"],
  ["Rhode Island", "RI"],
  ["South Carolina", "SC"],
  ["South Dakota", "SD"],
  ["Tennessee", "TN"],
  ["Texas", "TX"],
  ["Utah", "UT"],
  ["Vermont", "VT"],
  ["Virginia", "VA"],
  ["Washington", "WA"],
  ["West Virginia", "WV"],
  ["Wisconsin", "WI"],
  ["Wyoming", "WY"],
];
export const mapStateName = (abbreviation) => {
  let id = abbreviation.toUpperCase();
  return states.find((state) => state[1] === id)[0] || id;
};
