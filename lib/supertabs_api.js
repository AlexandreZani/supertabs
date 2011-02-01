/*
 * Copyright 2010-2011 Alexandre Zani (Alexandre.Zani@gmail.com)
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


function getSupertabsApi() {
  var dispatcher = new MessageDispatcher("http://localhost:8999/w/api");
  var supertabs = new Supertabs();
  return new SupertabsApi(dispatcher, supertabs);
}

function SupertabsApi(dispatcher, supertabs) {
  this.dispatcher = dispatcher;
  this.supertabs = supertabs;
  this.credentials = null;

  self = this;
  this.masterCallback = function(xhr, msg) {
    var json_doc = JSON.parse(xhr.responseText);

    var response = null;
    try {
      response = json_doc.response;
    } catch(ex) {}

    var credentials = null;
    try {
      credentials = json_doc.credentials;

      if(credentials != null) {
        self.credentials = credentials;
      }
    } catch(ex) {}

    var error = null;
    try {
      error = json_doc.error;
    } catch(ex) {}

    if(typeof(msg.outer_callback) == "function")
      msg.outer_callback(response, credentials, error, msg);
  }

  this.getJsonifiable = function() {
    console.log(JSON.stringify(this.credentials));
    return { "supertabs": this.supertabs, "credentials": this.credentials };
  }

  this.login = function(username, password, callback) {
    var request = { "type" : "Login" };
    var credentials = { "type" : "UsernamePassword",
      "args" : {
        "username" : username,
        "password" : password
      }
    };

    var msg = { "request" : request, "credentials" : credentials };
    msg = new Message(msg, this.masterCallback, callback);
    this.dispatcher.sendMessage(msg);
  }

  this.logout = function(callback) {
    this.credentials = null;
    callback();
  }

  this.pull_all_tabs = function(callback) {
    var msg = { request : { type : "GetAllTabs" },
      credentials : this.credentials };
    msg = new Message(msg, this.masterCallback, callback);
    this.dispatcher.sendMessage(msg);
  }

  this.push_all_tabs = function(supertabs, callback) {
    var request = { type : "PushAllTabs", args : supertabs };
    var msg = { "request" : request, "credentials" : this.credentials };
    msg = new Message(msg, this.masterCallback, callback);
    this.dispatcher.sendMessage(msg);
  }
}

function storeAllSupertabs(super_store) {
  var g = new Object()
  g.populate = true;
  
  chrome.windows.getAll(g,
      function(windows) {
        supertabs.supertabs = new Array();
        for(w = 0; w < windows.length; w++) {
          for(t = 0; t < windows[w].tabs.length; t++) {
            var tab = windows[w].tabs[t];
            supertabs.addTab(tab.windowId, tab.id, tab.index, tab.url);
          }
        }
      });
}
