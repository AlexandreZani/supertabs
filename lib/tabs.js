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

/*
 * SupertabsTab
 * 
 * This class is made to store the information relating to a chrome
 * tab as it needs to be stored by supertabs.
 */
function SupertabsTab(chrome_tab_id, supertab_id, index, url) {
  this.chrome_id = chrome_tab_id;
  this.supertab_id = supertab_id;
  this.index = index;
  this.url = url;
  
  /*
   * clone
   * 
   * This method returns a copy of the supertab tab
   */
  this.clone = function() {
    return new SupertabsTab(
        this.chrome_id,
        this.supertab_id,
        this.index,
        this.url);
  };
}

/*
 * Supertab
 * 
 * This class is made to store the information relating to a chrome
 * window as it needs to be stored by supertabs.
 */
function Supertab(chrome_window_id, supertab_id, open) {
  this.window_id = chrome_window_id;
  this.supertab_id = supertab_id;
  this.tabs = new Array();
  this.title = "New Supertab " + supertab_id;
  this.recently_deleted = new Array();
  this.last_deletion = 0;

  if (open == undefined) {
    this.open = true;
  } else {
    this.open = open;
  }
  
  /*
   * getTabByChromeId
   * 
   * Searches for a tab matching the chrome tab id and returns that tab.
   * 
   * Parameters:
   *    chrome_tab_id: The chrome tab id of the tab to be returned
   *    clone: If true, the returned tab is a copy, otherwise, it is
   *      the original
   * 
   * Returns:
   *    The tab being sought or null if it could not be found
   */
  this.getTabByChromeId = function(chrome_tab_id, clone) {
    for(var i = 0; i < this.tabs.lenght; i++) {
      if(this.tabs[i].chrome_id == chrome_tab_id) {
        if (clone == undefined || ! clone) {
          return this.tabs[i];
        } else {
          return this.tabs[i].clone();
        }
      }
    }
    
    return null;
  };
  
  /*
   * addTab
   * 
   * Adds a tab to the supertab
   * 
   * Parameters:
   *    chrome_tab_id: The tab id internal to the chrome session
   *    index: The position of the tab in the window
   *    url: The url currently loaded in the tab
   * 
   * Returns
   *    the created SupertabTab
   */
  this.addTab = function(chrome_tab_id, index, url) {
    var top_tab_id = 0;
    for(var i = 0; i < this.tabs.length; i++) {
      if(this.tabs[i].supertab_id > top_tab_id) {
        top_tab_id = this.tabs[i].supertab_id;
      }
    }

    var t = new SupertabsTab(chrome_tab_id, top_tab_id + 1, index, url);
    this.tabs.push(t);
    return t;
  };
  
  /*
   * updateTab
   * 
   * Changes the url in the specified tab
   * 
   * Parameters:
   *    chrome_tab_id: specifies the tab to be updated
   *    url: new url for that tab
   * 
   * Returns:
   *    the changed supertab if it was found
   *    null otherwise
   */
  this.updateTab = function(chrome_tab_id, url) {
    for(var i = 0; i < this.tabs.length; i++) {
      if(this.tabs[i].chrome_id == chrome_tab_id) {
        this.tabs[i].url = url;
        return this.tabs[i];
      }
    }
    return null;
  };
  
  /*
   * deleteTab
   * 
   * Removes tab with corresponding tab id from the tabs list
   * and stores it in the recently deleted list
   * 
   * Parameters:
   *    chrome_tab_id: specifies the tab to be deleted
   * 
   * Returns
   *    the deleted tab on success, null on failure
   */
  this.deleteTab = function(chrome_tab_id) {
    for(var i = 0; i < this.tabs.length; i++) {
      if(this.tabs[i].chrome_id == chrome_tab_id) {
        var found = this.tabs[i];

        var cur_time = new Date();
        if (cur_time.getTime() - this.last_deletion > 500) {
          this.recently_deleted = new Array();
        }

        this.recently_deleted.push(found.clone());
        this.last_deletion = cur_time.getTime();

        this.tabs.splice(i, 1);
        return found;
      }
    }
    return null;
  };

  /*
   * restoreRecentlyDeletedTabs 
   *
   * Restores the more recently deleted tabs
   */
  this.restoreRecentlyDeletedTabs = function() {
    for (var i = 0; i < this.recently_deleted.length; i++) {
      this.tabs.push(this.recently_deleted[i]);
    }

    this.recently_deleted = new Array();
    this.last_deleting = 0;
  }
}

/*
 * Supertabs
 * 
 * This class is made to store the list of supertabs
 */
function Supertabs() {
  this.supertabs = new Array();
  
  /*
   * addTab
   * 
   * Adds a tab to the supertab with the corresponding chrome_window_id
   * or creates a new supertab if necessary
   * 
   * returns the created SupertabTab
   */ 
  this.addTab = function(chrome_window_id, chrome_tab_id, index, url) {
    var top_supertab_id = 0;
    for(var i = 0; i < this.supertabs.length; i++) {
      if(this.supertabs[i].supertab_id > top_supertab_id) {
        top_supertab_id = this.supertabs[i].supertab_id;
      }

      if(this.supertabs[i].window_id == chrome_window_id) {
        return this.supertabs[i].addTab(chrome_tab_id, index, url);
      }
    }
    var w = new Supertab(chrome_window_id, top_supertab_id + 1);
    var t = w.addTab(chrome_tab_id, index, url);
    this.supertabs.push(w);
    return t;
  };
  
  /*
   * updateTab
   * 
   * Updates the url contained in a tab
   * 
   * Parameters:
   *    chrome_window_id: the window which contains the tab to be changed
   *    chrome_tab_id: specifies the tab to be updated
   *    url: new url for that tab
   * 
   * Returns:
   *    the changed supertab if it was found
   *    null otherwise
   */
  this.updateTab = function(chrome_window_id, chrome_tab_id, url) {
    for(var i = 0; i < this.supertabs.length; i++) {
      if(this.supertabs[i].window_id == chrome_window_id) {
        return this.supertabs[i].updateTab(chrome_tab_id, url);
      }
    }
    return null;
  };
  
  /*
   * deleteTab
   * 
   * Removes tab with corresponding tab id
   * 
   * Parameters:
   *    chrome_tab_id: specifies the tab to be deleted
   * 
   * Returns
   *    true on success, false on failure
   */
  
  this.deleteTab = function(chrome_tab_id) {
    var found;
    
    for(var i = 0; i < this.supertabs.length; i++) {
      found = this.supertabs[i].deleteTab(chrome_tab_id);
      if(found != null) {
        if (this.supertabs[i].tabs.length <= 0) {
          this.supertabs[i].restoreRecentlyDeletedTabs();
        }
        return found;
      }
    }
    return null;
  };
}
