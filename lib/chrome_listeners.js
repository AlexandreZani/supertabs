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

function ChromeListeners() { 
  this.detached_tab = null;
  
  this.enable = function() {
    chrome.tabs.onUpdated.addListener(this.onTabUpdated);
    chrome.tabs.onCreated.addListener(this.onTabCreated);
    chrome.tabs.onRemoved.addListener(this.onTabRemoved);
    chrome.tabs.onDetached.addListener(this.onTabDetached);
    chrome.tabs.onAttached.addListener(this.onTabAttached);
  };
  
  this.disable = function() {
    chrome.tabs.onUpdated.removeListener(this.onTabUpdated);
    chrome.tabs.onCreated.removeListener(this.onTabCreated);
    chrome.tabs.onRemoved.removeListener(this.onTabRemoved);
    chrome.tabs.onDetached.removeListener(this.onTabDetached);
    chrome.tabs.onAttached.removeListener(this.onTabAttached);
  };
  
  this.onTabUpdated = function(tab_id, change_info, tab)
  {
    if(change_info.url != undefined) {
      supertabs.updateTab(tab.windowId, tab.id, tab.url);
    }
  };
  
  this.onTabCreated = function(tab) {
    console.log("Tab Created");
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

  handlers[request.request_type](request, sender, sendResponse);
}

function getSupertabsRequestHandler(request, sender, sendResponse) {
  sendResponse(supertabs);
}

chrome.extension.onRequest.addListener(extensionRequestsHandler);
