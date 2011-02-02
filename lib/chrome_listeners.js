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

function ChromeListeners() { 
  this.detached_tab = null;
  this.enabled = false;
  
  this.enable = function() {
    if (! this.enabled) {
      this.enabled = true;
      chrome.tabs.onUpdated.addListener(this.onTabUpdated);
      chrome.tabs.onCreated.addListener(this.onTabCreated);
      chrome.tabs.onRemoved.addListener(this.onTabRemoved);
      chrome.tabs.onDetached.addListener(this.onTabDetached);
      chrome.tabs.onAttached.addListener(this.onTabAttached);
    }
  };
  
  this.disable = function() {
    if (this.enabled) {
      this.enabled = false;
      chrome.tabs.onUpdated.removeListener(this.onTabUpdated);
      chrome.tabs.onCreated.removeListener(this.onTabCreated);
      chrome.tabs.onRemoved.removeListener(this.onTabRemoved);
      chrome.tabs.onDetached.removeListener(this.onTabDetached);
      chrome.tabs.onAttached.removeListener(this.onTabAttached);
    }
  };
  
  this.onTabUpdated = function(tab_id, change_info, tab) {
    if(change_info.url != undefined) {
      supertabs.updateTab(tab.windowId, tab.id, tab.url);
    }
  };
  
  this.onTabCreated = function(tab) {
    supertabs.addTab(tab.windowId, tab.id, tab.index, tab.url);
  };
  
  this.onTabRemoved = function(tab_id) {
    supertabs.deleteTab(tab_id)
  };
  
  this.onTabDetached = function(tab_id, detach_info) {
    this.detached_tab = supertabs.deleteTab(tab_id);
  };
  
  this.onTabAttached = function(tab_id, attach_info) {
    supertabs.addTab(attach_info.newWindowId,
        tab_id,
        attach_info.newPosition,
        this.detached_tab.url);
  };
}


function extensionRequestsHandler(request, sender, sendResponse) {
  var handlers = new Object();
  handlers['get_supertabs'] = getSupertabsRequestHandler;
  handlers['open_supertab'] = openSupertabRequestHandler;
  handlers['validate_login'] = loginRequestHandler;
  handlers['logout'] = logoutRequestHandler;

  handlers[request.request_type](request, sender, sendResponse);
}

function getSupertabsRequestHandler(request, sender, sendResponse) {
  sendResponse(supertabs_api.getJsonifiable());
}

function openSupertabRequestHandler(request, sender, sendResponse) {
  openSupertab(request.supertab_id);
}

function loginRequestHandler(request, sender, sendResponse) {
  supertabs_api.login(request.args.username, request.args.password,
      function(response, credentials, error, msg) {
        if (error == null) {
          supertabs_api.pull_all_tabs(function(response, credentials, error, msg) {
            localStorage.setItem("original_tabs",
              JSON.stringify(supertabs_api.supertabs.getJSONObject(true)));
            if (response.supertabs.length > 0) {
              supertabs_api.supertabs.supertabs = new Array();
              supertabs_api.supertabs.fromJSONObject(response);
            } else {
              supertabs_api.push_all_tabs(supertabs_api.supertabs.getJSONObject());
            }
            listeners.enable();
            sendResponse({success : true});
          });
        } else {
          sendResponse({success : false});
        }
      });
}

function logoutRequestHandler(request, sender, sendResponse) {
  supertabs_api.logout(function() {
    chrome.windows.getAll({populate: false}, function(windows) {
      supertabs_api.supertabs.supertabs = new Array();
      supertabs_api.supertabs.fromJSONObject(JSON.parse(localStorage.getItem("original_tabs")));
      for (var i = 0; i < supertabs_api.supertabs.supertabs.length; i++) {
        openSupertab(supertabs_api.supertabs.supertabs[i].supertab_id);
      }
      for (var i = 0; i < windows.length; i++) {
        chrome.windows.remove(windows[i].id);
      }
      sendResponse();
    });
  });
}

function openSupertab(id) {
  var s = supertabs.getSupertabBySupertabId(id);
  if (s == null || s.open) {
    return;
  }

  listeners.disable();

  // Open the first tab
  create_data = new Object;
  create_data.url = s.tabs[0].url;

  chrome.windows.create(create_data,
      function(window) {
        supertabs.updateWindowChromeId(id, window.id);

        // Unfortunately, the window variable does not list the tabs
        // So we have to request them
        chrome.tabs.getAllInWindow(window.id,
          function(tabs) {
            // tabCreation will update the current chrome ids
            // and open the next tab
            tabCreation(tabs[0], id, s.tabs[0].supertab_id, 0);
          });
      });
}

function tabCreation(tab, supertab_id, supertab_tab_id, i) {
  // Updated the chrome id of the latest opened tab
  supertabs.updateTabChromeId(supertab_id, supertab_tab_id, tab.id);

  var s = supertabs.getSupertabBySupertabId(supertab_id);

  i += 1;

  // If all tabs have been opened, list the supertab as opened
  // enable listener and go home!
  if (s.tabs.length <= i) {
    s.open = true;
    listeners.enable();
    return;
  }

  // Open the next tab
  var tab_struct = new Object();
  tab_struct.windowId = s.window_id;
  tab_struct.url = s.tabs[i].url;
  supertab_tab_id = s.tabs[i].supertab_id;

  listeners.disable();
  // Go-go asynchronous recursion
  chrome.tabs.create(tab_struct,
      function(tab) {
        return tabCreation(tab, supertab_id, supertab_tab_id, i);
      });
}

chrome.extension.onRequest.addListener(extensionRequestsHandler);
