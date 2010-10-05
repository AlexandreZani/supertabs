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

function ChromeListeners()
{	
	this.detached_tab = null;
	
	this.enable = function() {
		chrome.tabs.onUpdated.addListener(this.OnTabUpdated);
		chrome.tabs.onCreated.addListener(this.OnTabCreated);
		chrome.tabs.onRemoved.addListener(this.OnTabRemoved);
		chrome.tabs.onDetached.addListener(this.OnTabDetached);
		chrome.tabs.onAttached.addListener(this.OnTabAttached);
	}
	
	this.OnTabUpdated = function(tab_id, change_info, tab)
	{
		if(change_info.url != undefined) {
			supertabs.UpdateTab(tab.windowId, tab.id, tab.url);
		}
	};
	
	this.OnTabCreated = function(tab)
	{
		console.log("Tab Created");
		supertabs.AddTab(tab.windowId, tab.id, tab.index, tab.url);
	};
	
	this.OnTabRemoved = function(tab_id)
	{
		supertabs.DeleteTab(tab_id)
	};
	
	this.OnTabDetached = function(tab_id, detach_info)
	{
		this.detached_tab = supertabs.DeleteTab(tab_id);
	}
	
	this.OnTabAttached = function(tab_id, attach_info)
	{
		supertabs.AddTab(attach_info.newWindowId,
				tab_id,
				attach_info.newPosition,
				this.detached_tab.url);
	}
}