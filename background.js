

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

function main()
{
	
}

supertabs = new Supertabs();

FirstInitSupertabs(supertabs);
main();