/*
 * SupertabsTab
 * 
 * This class is made to store the information relating to a chrome
 * tab as it needs to be stored by supertabs.
 */

function SupertabsTab(
		chrome_tab_id,
		index,
		url)
{
	this.chrome_id = chrome_tab_id;
	this.index = index;
	this.url = url;
	
	/*
	 * clone
	 * 
	 * This method returns a copy of the supertab tab
	 */
	this.clone = function()
	{
		return new SupertabsTab(
				this.chrome_id,
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

function Supertab(
		chrome_window_id)
{
	this.window_id = chrome_window_id;
	this.tabs = new Array();
	
	/*
	 * getTabByChromeId
	 * 
	 * Searches for a tab matching the chrome tab id and returns that tab.
	 * 
	 * Parameters:
	 * 		chrome_tab_id: The chrome tab id of the tab to be returned
	 * 		clone: If true, the returned tab is a copy, otherwise, it is
	 * 			the original
	 * 
	 * Returns:
	 * 		The tab being sought or null if it could not be found
	 */
	
	this.getTabByChromeId = function(chrome_tab_id, clone)
	{
		for(i = 0; i < this.tabs.lenght; i++) {
			if(this.tabs[i].chrome_id == chrome_tab_id) {
				if (clone == undefined || ! clone)
					return this.tabs[i];
				else
					return this.tabs[i].clone();
			}
		}
		
		return null;
	};
	
	/*
	 * AddTab
	 * 
	 * Adds a tab to the supertab
	 * 
	 * Parameters:
	 * 		chrome_tab_id: The tab id internal to the chrome session
	 * 		index: The position of the tab in the window
	 * 		url: The url currently loaded in the tab
	 * 
	 * Returns
	 * 		the created SupertabTab
	 */
	
	this.AddTab = function(chrome_tab_id, index, url)
	{
		var t = new SupertabsTab(chrome_tab_id, index, url)
		this.tabs.push(t);
		return t;
	};
	
	/*
	 * UpdateTab
	 * 
	 * Changes the url in the specified tab
	 * 
	 * Parameters:
	 * 		chrome_tab_id: specifies the tab to be updated
	 * 		url: new url for that tab
	 * 
	 * Returns:
	 * 		the changed supertab if it was found
	 * 		null otherwise
	 */
	
	this.UpdateTab = function(chrome_tab_id, url)
	{
		for(i = 0; i < this.tabs.length; i++)
			if(this.tabs[i].chrome_id == chrome_tab_id) {
				this.tabs[i].url = url;
				return this.tabs[i];
			}
		return null;
	};
}

function Supertabs()
{
	this.supertabs = new Array();
	
	/*
	 * AddTab
	 * 
	 * Adds a tab to the supertab with the corresponding chrome_window_id
	 * or creates a new supertab if necessary
	 * 
	 * returns the created SupertabTab
	 */	
	this.AddTab = function(chrome_window_id, chrome_tab_id, index, url)
	{
		for(i = 0; i < this.supertabs.length; i++)
			if(this.supertabs[i].window_id == chrome_window_id)
				return this.supertabs[i].AddTab(chrome_tab_id, index, url);
		var w = new Supertab(chrome_window_id);
		var t = w.AddTab(chrome_tab_id, index, url);
		this.supertabs.push(w);
		return t;
	};
}