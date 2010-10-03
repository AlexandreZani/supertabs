

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

function OnTabUpdate(tab_id, change_info, tab)
{
	if (change_info.url != undefined)
	{
		supertabs.UpdateTab(tab.windowId, tab.id, tab.url);
	}
}

function SetPrimaryCallbacks()
{
	chrome.tabs.onUpdated.addListener(OnTabUpdate);
}

function main()
{
	SetPrimaryCallbacks();
	StoreAllSupertabs(supertabs);
}

supertabs = new Supertabs();


main();