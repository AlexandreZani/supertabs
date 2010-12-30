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
  chrome.extension.sendRequest({ request_type: "get_supertabs" }, populateTable);
}

function populateTable(supertabs) {
  var table = document.getElementById("supertabs_table");

  var s = supertabs.supertabs;
  var table_html = "<tr><th>Supertabs</th></tr>";

  for (var i = 0; i < s.length; i++) {
    table_html += "<tr><td id='supertab_menu_item" + s[i].supertab_id + "' ";
    table_html += "onClick='onSupertabClick(" + s[i].supertab_id + ")' ";
    table_html += "onMouseOver='onSupertabMouseOver(" + s[i].supertab_id + ")' ";
    table_html += "onMouseOut='onSupertabMouseOut(" + s[i].supertab_id + ")' ";
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
  alert("Opening " + id);
}

getSupertabs();