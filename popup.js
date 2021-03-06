/*
 * Copyright 2010 Alexandre Zani (Alexandre.Zani@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function getSupertabs() {
  chrome.extension.sendRequest({ request_type: "get_supertabs" }, initializePopup);
}

function login() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  chrome.extension.sendRequest( { request_type: "validate_login",
      args: {username: username, password: password } }, login_callback);
}

function logout() {
  chrome.extension.sendRequest({ request_type: "logout" }, function(){});
}

function login_callback(response) {
  if (response.success) {
    var login_form_div = document.getElementById("login_form_div");
    login_form_div.setAttribute("style", "display:none");
    getSupertabs();
  } else {
    var invalid_creds = document.getElementById("invalid_creds");
    invalid_creds.setAttribute("style", "");
  }
}

function initializePopup(supertabs_api) {
  if (supertabs_api.credentials == null) {
    var login_form_div = document.getElementById("login_form_div");
    login_form_div.setAttribute("style", "");
  } else {
    var supertabs_table_div = document.getElementById("supertabs_table_div");
    supertabs_table_div.setAttribute("style", "");
    populateTable(supertabs_api.supertabs);
  }
}

function populateTable(supertabs) {
  var table = document.getElementById("supertabs_table");

  var s = supertabs.supertabs;
  var table_html = "<tr><th>Supertabs</th></tr>";

  for (var i = 0; i < s.length; i++) {
    table_html += "<tr><td id='supertab_menu_item" + s[i].supertab_id + "' ";
    if (!s[i].open) {
      table_html += "onClick='onSupertabClick(" + s[i].supertab_id + ")' ";
      table_html += "onMouseOver='onSupertabMouseOver(" + s[i].supertab_id + ")' ";
      table_html += "onMouseOut='onSupertabMouseOut(" + s[i].supertab_id + ")' ";
    }
    table_html += ">" + s[i].title + "</td></tr>";
  }

  table.innerHTML = table_html;
}

function onSupertabMouseOver(id) {
  document.getElementById("supertab_menu_item" + id).setAttribute("style", "background:#0000AA");
}

function onSupertabMouseOut(id) {
  document.getElementById("supertab_menu_item" + id).setAttribute("style", "");
}

function onSupertabClick(id) {
  chrome.extension.sendRequest({ request_type: "open_supertab", supertab_id: id });
}

getSupertabs();
