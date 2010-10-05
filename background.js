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

function StoreAllSupertabs(super_store)
{
	var g = new Object()
	g.populate = true;
	
	chrome.windows.getAll(g,
			function(windows)
			{
				supertabs.supertabs = new Array();
				for(w = 0; w < windows.length; w++)
				{
					for(t = 0; t < windows[w].tabs.length; t++)
					{
						var tab = windows[w].tabs[t];
						supertabs.AddTab(tab.windowId, tab.id, tab.index, tab.url);
					}
				}
			});
}

function OnTabUpdated(tab_id, change_info, tab)
{
	if (change_info.url != undefined)
	{
		supertabs.UpdateTab(tab.windowId, tab.id, tab.url);
	}
}

function OnTabCreated(tab)
{
	supertabs.AddTab(tab.windowId, tab.id, tab.index, tab.url);
}

function OnTabRemoved(tab_id)
{
	supertabs.DeleteTab(tab_id)
}

function SetPrimaryCallbacks()
{
	chrome.tabs.onUpdated.addListener(OnTabUpdated);
	chrome.tabs.onCreated.addListener(OnTabCreated);
	chrome.tabs.onRemoved.addListener(OnTabRemoved);
}

function main()
{
	SetPrimaryCallbacks();
	StoreAllSupertabs(supertabs);
}

supertabs = new Supertabs();


main();