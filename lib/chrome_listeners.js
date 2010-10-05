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
	this.enable = function() {
		chrome.tabs.onUpdated.addListener(this.OnTabUpdated);
		chrome.tabs.onCreated.addListener(this.OnTabCreated);
		chrome.tabs.onRemoved.addListener(this.OnTabRemoved);
	}
	
	this.OnTabUpdated = function(tab_id, change_info, tab)
	{
		if(change_info.url != undefined) {
			supertabs.UpdateTab(tab.windowId, tab.id, tab.url);
		}
	};
	
	this.OnTabCreated = function(tab)
	{
		supertabs.AddTab(tab.windowId, tab.id, tab.index, tab.url);
	};
	
	this.OnTabRemoved = function(tab_id)
	{
		supertabs.DeleteTab(tab_id)
	};
}